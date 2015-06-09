var log = require("bunyan").createLogger({ name: "image processor", level: "debug" });

var timeout = null;
var imagesProcessed = 0;
process.on("message", function(info) {
    var sharp = require("sharp");

    sharp(info.inputPath).rotate().resize(1024, 1024).max().toFile(info.outputPath, function(err) {
        log.debug("Image processed [%s]", info.outputPath);
        process.send({ path: info.outputPath, error: err });

        imagesProcessed++;
        if(imagesProcessed >= 10) {
            clearTimeout(timeout);
            log.debug("Overheated image processor quitting");
            process.exit();
        }
    });

    clearTimeout(timeout);
    timeout = setTimeout(function() {
        log.debug("Idle image processor quitting");
        process.exit();
    }, 10000);
});

module.exports = function ImageProcessor() {
    var fork = require("child_process").fork;
    var processor = null;
    var queue = new (require("corq"))(200, 1000);

    var getProcessor = function() {
        if(processor === null) {
            log.debug("New image processor being created");
            processor = fork("./components/images.processor.js");

            processor.on("message", function() {
                current.callback();
                current.success();
            });

            processor.on("exit", function() {
                log.debug("Image processor exited");
                processor = null;
            });
        }

        return processor;
    };

    var current = null;
    queue.on("image", function(img, success) {
        current = { callback: img.callback, success: success };
        getProcessor().send({ inputPath: img.inputPath, outputPath: img.outputPath });
    });

    return Object.freeze({
        process: function(inPath, outPath, callback) {
            queue.push("image", { inputPath: inPath, outputPath: outPath, callback: callback });
        }
    });
};
