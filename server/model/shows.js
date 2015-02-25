var mongoose = require("mongoose");

var showTypesSchema = mongoose.Schema({
	name: String,
	description: String,
	isRally: Boolean,
	priorityOrder: Number
});

var showSchema = mongoose.Schema({
	startDate: Date,
	endDate: Date,
	dateRange: String,
	registrationDeadline: Date,
	title: String,
	location: String,
	description: String,
	registrationLink: String,
	classes: [ showTypesSchema ],
	premiumListPath: String,
	resultsPath: String
});

module.exports = {
	showTypes: mongoose.model("showTypes", showTypesSchema),
	shows: mongoose.model("shows", showSchema)
};