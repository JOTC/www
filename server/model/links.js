var mongoose = require("mongoose");

var linkSchema = mongoose.Schema({
	name: String,
	url: String
});

var groupSchema = mongoose.Schema({
	name: String,
	ordering: Number,
	links: [ linkSchema ]
});

module.exports = mongoose.model("linkGroups", groupSchema);