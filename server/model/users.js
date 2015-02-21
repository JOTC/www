var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
	local: {
		username: String,
		secret: String
	},
	name: String,
	email: String,
	permissions: {
		links: Boolean,
		officers: Boolean,
		shows: Boolean,
		classes: Boolean,
		pictures: Boolean,
		calendar: Boolean,
		users: Boolean
	}
});

module.exports = mongoose.model("users", userSchema);