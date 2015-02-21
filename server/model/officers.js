var mongoose = require("mongoose");

var contactSchema = mongoose.Schema({
	type: String,
	value: String
});

var officerSchema = mongoose.Schema({
	name: String,
	titles: [ String ],
	contacts: [ contactSchema ],
	ordering: Number
});

module.exports = mongoose.model("officers", officerSchema);