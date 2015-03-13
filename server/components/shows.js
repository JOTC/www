var restify = require("restify");
var mv = require("mv");
var fs = require("fs");
var db = require("../model/db.js");
var dates = require("../dateHelper.js");
var fn = require("../common-fn.js");
var log = require("bunyan").createLogger({ name: "shows component", level: "debug" });
var config = require("../config");
var path = require("path");

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

var __WWW_PATH = "/files/shows";
var __FILE_PATH = config.www.getPath(__WWW_PATH);

var getObjectsInOrder = function(model, sortBy, callback)
{
	var sort = { };
	sort[sortBy] = "asc";
	
	model.find({}).sort(sort).exec().then(callback);
};

var getFileUploadHandler = function(filenameSuffix, showPropertyName)
{
	return function(req, res, next)
	{
		if(!req.user || !req.user.permissions.shows)
		{
			return next(new restify.UnauthorizedError());
		}
	
		var handleError = function(err)
		{
			log.error(err);
			res.send(500);
			require("fs").unlinkSync(req.files.file.path);
		};
					
		db.shows.shows.findOne({ _id: req.params.showID }).exec(function(err, show)
		{
			if(err)
			{
				handleError(err);
				next();
			}
			else if(show)
			{
				var filename = show.title + " " + filenameSuffix + ".pdf";
				mv(req.files.file.path, path.join(__FILE_PATH, req.params.showID, filename), { mkdirp: true }, function(err)
				{
					if(err)
					{
						handleError(err);
						next();
					}
					else
					{
						show[showPropertyName] = path.join(__WWW_PATH, req.params.showID, filename);
						show.save(function(err)
						{
							if(err)
							{
								handleError(err);
								require("fs").unlinkSync(path.join(__FILE_PATH, req.params.showID, filename));
							}
							else
							{
								res.send(200, show);
							}
							next();
						});
					}
				});
			}
			else
			{
				handleError("Show ID [" + req.params.showID + "] not found");
				next();
			}
		});
	};
};

var getFileDeleteHandler = function(showPropertyName)
{
	return function(req, res, next)
	{
		if(!req.user || !req.user.permissions.shows)
		{
			return next(new restify.UnauthorizedError());
		}
		
		db.shows.shows.findOne({ _id: req.params.showID }).exec(function(err, show)
		{
			if(err)
			{
				log.error(err);
				res.send(500);
			}
			else
			{
				fs.unlink(config.www.getPath(decodeURIComponent(show[showPropertyName])), function(err)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
					}
					else
					{
						show[showPropertyName] = "";
						show.save(function(err)
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
				});
			}
		});
	};
};

module.exports = {
	name: "shows",
	paths: {
		"/shows": {
			"get": function(req, res, next)
			{
				getObjectsInOrder(db.shows.shows, "startDate", function(objs, err)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
					}
					else
					{
						var shows = {
							upcoming: [ ],
							past: [ ]
						};
						
						var now = new Date();
						objs.forEach(function(show)
						{
							if(show.startDate > now || show.endDate > now)
							{
								shows.upcoming.push(show);
							}
							else
							{
								shows.past.push(show);
							}
						});
						res.send(shows);
					}
				});
				next();
			},
			"post": fn.getModelCreator(db.shows.shows, "shows", log, isValidShow, function(obj)
			{
				obj.dateRange = dates.stringDateRange(obj.startDate, obj.endDate);
			})
		},
		"/shows/:showID":
		{
			"put": fn.getModelUpdater(db.shows.shows, "showID", "shows", log, isValidShow, function(obj)
			{
				obj.dateRange = dates.stringDateRange(new Date(obj.startDate), new Date(obj.endDate));
			}),
			"delete": fn.getModelDeleter(db.shows.shows, "showID", "shows", log, function(show)
			{
				if(show.premiumListPath)
				{
					fs.unlinkSync(path.join(__FILE_PATH, decodeURIComponent(show.premiumListPath)));
				}
				if(show.resultsPath)
				{
					fs.unlinkSync(path.join(__FILE_PATH, decodeURIComponent(show.resultsPath)));
				}
			})
		},
		"/shows/:showID/premiumList": {
			"post": getFileUploadHandler("Premium List", "premiumListPath"),
			"delete": getFileDeleteHandler("premiumListPath")
		},
		"/shows/:showID/results": {
			"post": getFileUploadHandler("Results", "resultsPath"),
			"delete": getFileDeleteHandler("resultsPath")
		},
		"/shows/types/": {
			"get": function(req, res, next)
			{
				getObjectsInOrder(db.shows.showTypes, "priorityOrder", function(objs, err)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
					}
					else
					{
						res.send(objs);
					}
				});
				next();
			}
		}
	}
};