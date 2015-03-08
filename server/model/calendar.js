var mongoose = require("mongoose");

var calendarSchema = mongoose.Schema({
	title: String,
	startDate: Date,
	endDate: Date,
	link: String,
	description: String,
	location: String,
	filePath: String
});

module.exports = mongoose.model("calendar", calendarSchema);