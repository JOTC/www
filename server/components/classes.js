var restify = require("restify");
var mv = require("mv");
var fs = require("fs");
var db = require("../model/db.js");
var fn = require("../common-fn.js");
var log = require("bunyan").createLogger({ name: "classes component", level: "debug" });

var __BASE_PATH = "/vagrant/www";

var getFutureClasses = function(callback)
{
	var midnightToday = Date.now();
	midnightToday = new Date(midnightToday - (midnightToday % 86400000));
	db.classes.classes.find({ startDate: { $gte: midnightToday }}).sort({ startDate: "asc" }).exec(callback);
};

var isValidClass = function(clss)
{
	var valid = false;
	
	if(clss)
	{
		valid = true;
		valid = valid && (clss.location && typeof clss.location === "string");
		valid = valid && (clss.startDate && typeof clss.startDate === "string");
		valid = valid && (clss.numberOfWeeks && typeof +clss.numberOfWeeks === "number");
		valid = valid && (clss.hoursPerWeek && typeof +clss.hoursPerWeek === "number");
		valid = valid && (clss.classTypes && Array.isArray(clss.classTypes));
		
		if(valid)
		{
			valid = valid && (clss.classTypes.length > 0);
			
			clss.classTypes.forEach(function(classType)
			{
				valid = valid && (classType._id && typeof classType._id === "string");
				valid = valid && (classType.name && typeof classType.name === "string");
				valid = valid && (classType.description && typeof classType.description === "string");
				valid = valid && (typeof classType.isAdvanced === "boolean");
			});
		}
	}
	
	return valid;
}

var getRegistrationFormFilename = function(clss)
{
	return "JOTC_Class_Registration.pdf";
};

module.exports = {
	name: "classes",	
	paths: {
		"/classes/": {
			"get": function(req, res, next)
			{
				getFutureClasses(function(error, classes)
				{
					if(error)
					{
						log.error(error);
						res.send(500);
					}
					else
					{
						res.send(classes);
					}
				});
				next();
			},
			"post": fn.getModelCreator(db.classes.classes, "classes", log, isValidClass, function(obj)
			{
				obj.endDate = new Date(obj.startDate.getTime() + (obj.numberOfWeeks * 604800000));
			})
		},
		"/classes/:classID": {
			"put": fn.getModelUpdater(db.classes.classes, "classID", "classes", log, isValidClass, function(obj)
			{
				obj.startDate = new Date(obj.startDate);
				obj.endDate = new Date(obj.startDate.getTime() + (obj.numberOfWeeks * 604800000));
			}),
			"delete": fn.getModelDeleter(db.classes.classes, "classID", "classes", log, function(obj)
			{
				if(obj.registrationFormPath)
				{
					fs.unlinkSync(__BASE_PATH + "/classes/" + obj._id + "/" + getRegistrationFormFilename(obj));
				}
			})
		},
		"/classes/:classID/registrationForm": {
			"post": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.classes)
				{
					return next(new restify.UnauthorizedError());
				}
	
				var handleError = function(err)
				{
					log.error(err);
					res.send(500);
					require("fs").unlinkSync(req.files.file.path);
				};
					
				db.classes.classes.findOne({ _id: req.params.classID }).exec(function(err, clss)
				{
					if(err)
					{
						handleError(err);
						next();
					}
					else if(clss)
					{
						var filename = getRegistrationFormFilename(clss);
						mv(req.files.file.path, __BASE_PATH + "/classes/" + req.params.classID + "/" + filename, { mkdirp: true }, function(err)
						{
							if(err)
							{
								handleError(err);
								next();
							}
							else
							{
								clss.registrationFormPath = "/classes/" + req.params.classID + "/" + filename;
								clss.save(function(err)
								{
									if(err)
									{
										handleError(err);
										require("fs").unlinkSync(__BASE_PATH + "/classes/" + req.params.classID + "/" + filename);
									}
									else
									{
										res.send(200, clss);
									}
									next();
								});
							}
						});
					}
					else
					{
						handleError("Show ID [" + req.params.classID + "] not found");
						next();
					}
				});
			},
			"delete": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.classes)
				{
					return next(new restify.UnauthorizedError());
				}
				
				db.classes.classes.findOne({ _id: req.params.classID }).exec(function(err, clss)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
					}
					else if(clss)
					{
						fs.unlink(__BASE_PATH + "/classes/" + clss._id + "/" + getRegistrationFormFilename(clss), function(err)
						{
							if(err)
							{
								log.error(err);
								res.send(500);
							}
							else
							{
								clss.registrationFormPath = "";
								clss.save(function(err)
								{
									if(err)
									{
										log.error(err);
										res.send(500);
									}
									else
									{
										res.send(200);
									}
								});
							}
						})
					}
					else
					{
						res.send(200);
					}
				});
				
				next();
			}
		},
		"/classes/types/": {
			"get": function(req, res, next)
			{
				try
				{
					db.classes.classTypes.find({}).sort({ priorityOrder: "asc" }).exec(function(error, classTypes)
					{
						if(error)
						{
							console.log(error);
							res.send(500);
						}
						else
						{
							res.send(classTypes);
						}
					});
				}
				catch(ex)
				{
					console.log(ex);
					res.send(500);
				}
				
				next();
			}
		}
	}
};