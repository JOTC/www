var mongoose = require("mongoose");

var classTypesSchema = mongoose.Schema({
	name: String,
	description: String,
	prerequisite: String,
	isAdvanced: Boolean,
	priorityOrder: Number
});

var classSchema = mongoose.Schema({
	startDate: Date,
	endDate: Date,
	numberOfWeeks: {type: Number, default: 6 },
	hoursPerWeek: { type: Number, default: 1 },
	timeOfDay: String,
	location: String,
	classTypes: [ classTypesSchema ]
});

module.exports = {
	classTypes: mongoose.model("classTypes", classTypesSchema),
	classes: mongoose.model("classes", classSchema)
};