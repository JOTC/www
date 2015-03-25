var db = require("../model/db.js");
var fn = require("../common-fn.js");
var log = require("bunyan").createLogger({ name: "users component", level: "debug" });
var nodemailer = require('nodemailer');
var config = require("../config");
var bcrypt = require("bcryptjs");

var isValidUser = function(user)
{
	var valid = false;
	if(user)
	{
		valid = true;
		valid = valid && (user.name && typeof user.name === "string");
		valid = valid && (user.email && typeof user.email === "string");
		valid = valid && (user.permissions && typeof user.permissions === "object");
		valid = valid && (typeof user.permissions.shows === "boolean");
		valid = valid && (typeof user.permissions.classes === "boolean");
		valid = valid && (typeof user.permissions.pictures === "boolean");
		valid = valid && (typeof user.permissions.calendar === "boolean");
		valid = valid && (typeof user.permissions.links === "boolean");
		valid = valid && (typeof user.permissions.officers === "boolean");
		valid = valid && (typeof user.permissions.users === "boolean");
	}

	return valid;
};

module.exports = {
	name: "users",
	paths: {
		"/users": {
			"get": fn.getModelLister(db.users, log, { name: "asc" }, function(objs, req)
			{
				if(!req.user || !req.user.permissions.users)
				{
					objs.splice(0, objs.length);
				}

				objs.forEach(function(user)
				{
					user.local = null;
				});
			}),
			"post": fn.getModelCreator(db.users, "users", log, isValidUser, function(obj)
			{
				var token = require("crypto").randomBytes(16).toString("hex");

				obj.local.username = obj.email;
				obj.local.secret = "---init---" + bcrypt.hashSync(token);

				var transporter = nodemailer.createTransport({
				    service: "Gmail",
				    auth: {
				        user: config.gmail.username,
				        pass: config.gmail.password
				    }
				});

				var emailOptions = {
					from: "JOTC Website <" + config.gmail.username + ">",
					to: obj.name + " <" + obj.email + ">",
					subject: "JOTC Website Account",
					text:	"Dear " + obj.name + ",\n\nAn account has been created for you on the " +
							"Jackson Obedience Training Club website. Before you can log in, you must enable " +
							"your account and set a password. To do that, please click the following link:\n\n" +
							"http://jotc.org/data2/auth/local/validate/" + obj._id + "/" + token + "\n\n" +
							"After you have set your password, you will immediately be logged in and " +
							"redirected to to the JOTC website. After that, you may log in again whenever " +
							"you need to by simply visiting the JOTC website and clicking the [Login] link " +
							"in the top-right corner of the front page."
				};

				var permissionText = "";
				if(obj.permissions)
				{
					if(obj.permissions.shows)
					{
						permissionText += "\n • Add, edit, and remove shows";
					}
					if(obj.permissions.classes)
					{
						permissionText += "\n • Add, edit, and remove classes";
					}
					if(obj.permissions.pictures)
					{
						permissionText += "\n • Add, edit, and remove pictures and galleries";
					}
					if(obj.permissions.calendar)
					{
						permissionText += "\n • Add, edit, and remove calendar events";
					}
					if(obj.permissions.links)
					{
						permissionText += "\n • Add, edit, and remove links";
					}
					if(obj.permissions.officers)
					{
						permissionText += "\n • Add, edit, and remove officers";
					}
					if(obj.permissions.users)
					{
						permissionText += "\n • Add, edit, and remove users";
					}
				}
				if(permissionText.length > 0)
				{
					permissionText = "\n\nYour account has been granted the following privileges:" + permissionText;
				}

				emailOptions.text += permissionText + "\n\nSincerely,\nJOTC Website Admin";

				transporter.sendMail(emailOptions, function(error)
				{
					if(error)
					{
						log.error("Error sending email to %s", obj.email);
						log.error(error);
					}
					else
					{
						log.info("Email successfully sent to %s", obj.email);
					}
				});
			})
		},
		"/users/:userID": {
			"put": fn.getModelUpdater(db.users, "userID", "users", log, isValidUser),
			"delete": fn.getModelDeleter(db.users, "userID", "users", log)
		},
		"/auth/local/reset/": {
			"put": function(req, res, next)
			{
				if(req.body && req.body.email)
				{
					db.users.findOne({ "local.username": req.body.email }).exec(function(err, user)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else
						{
							var token = require("crypto").randomBytes(16).toString("hex");
							user.local.secret = "---init---" + bcrypt.hashSync(token);

							user.save(function(err)
							{
								if(err)
								{
									log.error(err);
									res.send(500);
								}
								else
								{
									var transporter = nodemailer.createTransport({
									    service: "Gmail",
									    auth: {
									        user: config.gmail.username,
									        pass: config.gmail.password
									    }
									});

									var emailOptions = {
										from: "JOTC Website <" + config.gmail.username + ">",
										to: user.name + " <" + user.email + ">",
										subject: "JOTC Website Password Reset",
										text:	"Dear " + user.name + ",\n\nYour password on Jackson Obedience Training Club " +
												"website is ready to be reset.  To do that, please click the following link:\n\n" +
												"http://jotc.org/data2/auth/local/validate/" + user._id + "/" + token + "\n\n" +
												"After you have set your password, you will immediately be logged in and " +
												"redirected to to the JOTC website. After that, you may log in again whenever " +
												"you need to by simply visiting the JOTC website and clicking the [Login] link " +
												"in the top-right corner of the front page.\n\nSincerely,\nJOTC Website Admin"
									};

									transporter.sendMail(emailOptions, function(error)
									{
										if(error)
										{
											log.error("Error sending email to %s", user.email);
											log.error(error);
										}
										else
										{
											log.info("Email successfully sent to %s", user.email);
										}
									});

									res.send(200);
								}
							});
						}
					});
				}
				else
				{
					res.send(400);
				}

				next();
			}
		},
		"/auth/local/validate/:userID/:validationCode": {
			"get": function(req, res, next)
			{
				db.users.findOne({ _id: req.params.userID }).exec(function(err, user)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
					}
					else if(!user)
					{
						log.error("User [%s] not found", req.params.userID);
						res.send(404);
					}
					else if(user.local && user.local.secret && typeof user.local.secret === "string" && user.local.secret.substr(0, 10) === "---init---")
					{
						var secret = user.local.secret.substr(10);
						if(bcrypt.compareSync(req.params.validationCode, secret))
						{
							req.session.resetPassword = { userID: req.params.userID, validationCode: req.params.validationCode };
							res.redirect("/#/resetPassword");
						}
						else
						{
							log.error("Validation code failed.");
							res.send(403);
						}
					}
					else
					{
						log.error("User is not in initialization/reset phase");
						res.send(403);
					}
				});
				next();
			}
		},
		"/auth/local/resetPassword": {
			"put": function(req, res, next)
			{
				if(req.session && req.session.resetPassword)
				{
					db.users.findOne({ _id: req.session.resetPassword.userID }).exec(function(err, user)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else if(!user)
						{
							log.error("User [%s] not found", req.params.userID);
							res.send(404);
						}
						else if(user.local && user.local.secret && typeof user.local.secret === "string" && user.local.secret.substr(0, 10) === "---init---")
						{
							var newSecret = req.body;
							if(newSecret && newSecret.secret && typeof newSecret.secret === "string")
							{
								newSecret = newSecret.secret;
								var secret = user.local.secret.substr(10);

								if(bcrypt.compareSync(req.session.resetPassword.validationCode, secret))
								{
									delete req.session.resetPassword;
									user.local.secret = bcrypt.hashSync(newSecret);
									user.save(function(err)
									{
										if(err)
										{
											log.error(err);
											res.send(500);
										}
										else
										{
											req.session.passport.user = user._id;
											res.send(200);
										}
									});
								}
								else
								{
									log.error("Validation code failed.");
									res.send(403);
								}
							}
							else
							{
								log.error("No new secret supplied.  Cannot reset password.");
								res.send(400);
							}
						}
						else
						{
							log.error("User is not in initialization/reset phase");
							res.send(403);
						}
					});
				}
				else
				{
					log.error("No password reset session.  Cannot reset.");
					res.send(400);
				}
				console.log(req.session.resetPassword);

				next();
			}
		}
	}
};
