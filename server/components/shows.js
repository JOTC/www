var restify = require("restify");
var db = require("../model/db.js");
var dates = require("../dateHelper.js");
var log = require("bunyan").createLogger({ name: "shows component", level: "debug" });

var isValidShow = function(show)
{
	var valid = false;
	if(show)
	{
		valid = true;
		valid = valid && (show.title && typeof show.title === "string");
		valid = valid && (show.location && typeof show.location === "string");
		valid = valid && (show.startDate && typeof show.startDate === "string");
		valid = valid && (show.endDate && typeof show.endDate === "string");
		valid = valid && (show.registrationDeadline && typeof show.registrationDeadline === "string");
	}
	
	return valid;
};

var getObjectsInOrder = function(model, sortBy, response)
{
	var sort = { };
	sort[sortBy] = "asc";
	
	model.find({}).sort(sort).exec().then(function(objs, err)
	{
		if(err)
		{
			log.error(err);
			response.send(500);
		}
		else
		{
			response.send(objs);
		}
	});
};

module.exports = {
	name: "shows",
	paths: {
		"/shows": {
			"get": function(req, res, next)
			{
				getObjectsInOrder(db.shows.shows, "startDate", res);
				next();
			},
			"post": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.shows)
				{
					return next(new restify.UnauthorizedError());
				}
								
				var show = req.body;
				if(isValidShow(show))
				{
					
					var dbShow = new db.shows.shows(show);
					dbShow.dateRange = dates.stringDateRange(dbShow.startDate, dbShow.endDate);

					dbShow.save(function(err)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else
						{
							res.send(dbShow);
						}
					});
				}
				else
				{
					return next(new restify.BadRequestError());
				}
				
				
				next();
			}
		},
		"/shows/:showID":
		{
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.shows)
				{
					return next(new restify.UnauthorizedError());
				}
				
				var show = req.body;
				if(isValidShow(show))
				{
					delete show._id;
					db.shows.shows.update({ _id: req.params.showID }, show, { upsert: true }).exec(function(err)
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
				else
				{
					return next(new restify.BadRequestError());
				}
				
				next();
			},
			"delete": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.shows)
				{
					return next(new restify.UnauthorizedError());
				}

				db.shows.shows.remove({ _id: req.params.showID }).exec(function(err)
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
		},
		"/shows/types/": {
			"get": function(req, res, next)
			{
				getObjectsInOrder(db.shows.showTypes, "priorityOrder", res);
				next();
			}
		}
	}
};