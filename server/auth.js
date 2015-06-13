var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");
var db = require("./model/db.js");

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(userID, done) {
		db.users.findOne({ _id: userID }, function(err, user) {
			if(err) {
				done(err, null);
			} else {
				done(null, user);
			}
		});
	});

	passport.use("custom-local", new LocalStrategy(function(username, password, done) {
		db.users.findOne({ "local.username": username }).exec(function(err, user) {
			if(err) {
				done(err);
				return;
			}
			if(!user) {
				done(null, false);
				return;
			}

			if(bcrypt.compareSync(password, user.local.secret)) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}));
};
