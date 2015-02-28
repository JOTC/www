var db = require("../model/db.js");

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
			"get": function(req, res, next)
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
			"post": function(req, res, next)
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
		"/classes/:id": {
			"put": function(req, res, next)
			{
				res.send({});
				next();
			},
			"delete": function(req, res, next)
			{
				res.send({});
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