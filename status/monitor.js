var request = require("request");
var slackHookURL = "https://hooks.slack.com/services/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";
var fs = require("fs");

var processStatus = "";
var lastStatus = (new Date()).getTime();

if(fs.existsSync("./statefile")) {
    var state = JSON.parse(fs.readFileSync("./statefile"));
    lastStatus = state[0].status;
}

function readStateFile() {
    try {
        var state = JSON.parse(fs.readFileSync("./statefile"));
        var newStatus = state[0].status;

        var now = (new Date()).getTime();

        console.log("%s | %s | %s", processStatus, newStatus, (now - lastStatus));

        if(newStatus !== status) {
            processStatus = newStatus;
            request
                .post(slackHookURL)
                .form({
                    payload: '{"text": "The JOTC API server process is now ' + processStatus + '.","username":"JOTC Webserver"}'
                });
        } else if(newStatus === "running" && (now - lastStatus) > 100) {
            request
                .post(slackHookURL)
                .form({
                    payload: '{"text": "The JOTC API server process has restarted.","username":"JOTC Webserver"}'
                });
        }

        lastStatus = (new Date()).getTime();
    } catch(ex) {
        setTimeout(readStateFile, 500);
    }
}

fs.watch("./statefile", { persistent: true }, readStateFile);
