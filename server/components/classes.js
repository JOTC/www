var db = require("../model/db.js");

var serverError = function(error, res)
{
	console.log(error);
	res.send(500, "SERVER ERROR");
};

var getFutureClasses = function(callback)
{
	var midnightToday = Date.now();
	midnightToday = new Date(midnightToday - (midnightToday % 86400000));
	db.classes.classes.find({ startDate: { $gte: midnightToday }}).sort({ startDate: "asc" }).exec(callback);
};

module.exports = {
	name: "classes",	
	paths: {
		"/classes/": {
			get: function(req, res, next)
			{
				getFutureClasses(function(error, classes)
				{
					if(error)
					{
						console.log(error);
						res.send(500);
					}
					else
					{
						res.send(classes);
					}
				});
				next();
			},
			post: function(req, res, next)
			{
				try
				{
					db.classes.classTypes.find({ _id: { $in: req.body.classTypes }}).exec(function(error, classTypes)
					{
						if(error)
						{
							res.send({ succeess: false });
						}
						else
						{
							req.body.classTypes = classTypes;
							var newClass = new db.classes.classes(req.body);
							newClass.save(function()
							{
								res.send({ success: true, class: newClass.toObject() });
							});
						}
					});					
				}
				catch(e)
				{
					console.log(e);
					res.send({ success: false });
				}
				next();
			}
		},
		"/classes/md": {
			get: function(req, res, next)
			{
				res.setHeader("content-type", "text/plain");
				
				getFutureClasses(function(error, classes)
				{
					if(error)
					{						
						res.send("");
					}
					else
					{
						var days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
						var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
						
						var markdown = "";
						classes.forEach(function(c, i)
						{
							if(i > 0)
							{
								markdown += "\n-----\n";
							}
							markdown += "#Starting " + days[c.startDate.getDay()] + ", " + months[c.startDate.getMonth()] + " " + c.startDate.getDate() + "\n";
							
							markdown += "This class meets for " + c.hoursPerWeek + " hour" + (c.hoursPerWeek == 1 ? "" : "s") + " per week, every ";
							markdown += days[c.startDate.getDay()] + " at " + c.timeOfDay + ", for " + c.numberOfWeeks + " weeks.  The following class";
							markdown += (c.classTypes.length == 1 ? "" : "es") + " are being offered at this time:\n\n";
							
							c.classTypes.forEach(function(classType)
							{
								markdown += "###" + classType.name + "\n";
								markdown += "*" + classType.prerequisite + "*  \n";
								markdown += "> " + classType.description + "\n\n";
							});
						});
						res.send(markdown);
					}
				});
				next();
			}
		},
		"/classes/:id": {
			put: function(req, res, next)
			{
				res.send({});
				next();
			},
			delete: function(req, res, next)
			{
				res.send({});
				next();
			}
		},
		"/classes/types/": {
			get: function(req, res, next)
			{
				try
				{
					db.classes.classTypes.find({}).sort({ priorityOrder: "asc" }).exec(function(error, classTypes)
					{
						if(error)
							serverError(error, res);
						else
							res.send(classTypes);
					});
				}
				catch(ex) { serverError(ex, res); }
				
				next();
			},
			post: function(req, res, next)
			{
			}
		}
	}
};