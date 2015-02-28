var mongoose = require("mongoose");

var calendarSchema = mongoose.Schema({
	title: String,
	startDate: Date,
	endDate: Date,
	link: String,
	description: String,
	isPublic: Boolean
});

module.exports = mongoose.model("calendar", calendarSchema);