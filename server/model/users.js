var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
	local: {
		username: String,
		secret: String
	},
	name: String,
	email: String,
	permissions: {
		links: { type: Boolean, default: false },
		officers: { type: Boolean, default: false },
		shows: { type: Boolean, default: false },
		classes: { type: Boolean, default: false },
		pictures: { type: Boolean, default: false },
		calendar: { type: Boolean, default: false },
		users: { type: Boolean, default: false }
	}
});

module.exports = mongoose.model("users", userSchema);