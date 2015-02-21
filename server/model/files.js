var mongoose = require("mongoose");

var fileSchema = mongoose.Schema({
	filename: String,
	mime: String,
	size: String
});

module.exports = mongoose.model("files", fileSchema);