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
		valid &= (show.title && typeof show.title === "string");
		valid &= (show.location && typeof show.location === "string");
		valid &= (show.startDate && typeof show.startDate === "string");
		valid &= (show.endDate && typeof show.endDate === "string");
		valid &= (show.registrationDeadline && typeof show.registrationDeadline === "string");
	}
	
	return valid;
}

module.exports = {
	name: "shows",
	paths: {
		"/shows": {
			"get": function(req, res, next)
			{
				db.shows.shows.find({}).sort({ startDate: "asc" }).exec().then(function(shows, error)
				{
					if(error)
					{
						console.log(err);
						res.send(500);
					}
					else
					{
						res.send(shows);
					}
				});
				next();
			},
			"post": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.shows)
				{
					return next(new restify.UnauthorizedError)
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
					return next(new restify.UnauthorizedError)
				}
				
				var show = req.body;
				if(isValidShow(show))
				{
					delete show._id;
					db.shows.shows.update({ _id: req.params.showID }, show, { upsert: true }).exec(function(err, count)
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
					return next(new restify.UnauthorizedError)
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
				db.shows.showTypes.find({}).sort({ priorityOrder: "asc" }).exec().then(function(showTypes, error)
				{
					if(error)
					{
						console.log(error);
						res.send(500);
					}
					else
					{
						res.send(showTypes);
					}
				});
				next();
			}
		}
	}
}