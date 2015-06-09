var restify = require("restify");
var fs = require("fs-extra");
var db = require("../model/db.js");
var dates = require("../dateHelper.js");
var fn = require("../common-fn.js");
var log = require("bunyan").createLogger({ name: "shows component", level: "debug" });
var config = require("../config");
var path = require("path");

var isValidShow = function(show) {
	var valid = false;
	if(show) {
		valid = true;
		valid = valid && (show.title && typeof show.title === "string");
		valid = valid && (show.location && typeof show.location === "string");
		valid = valid && (show.startDate && typeof show.startDate === "string");
		valid = valid && (show.endDate && typeof show.endDate === "string");
		valid = valid && (show.registrationDeadline && typeof show.registrationDeadline === "string");
		valid = valid && (show.classes && Array.isArray(show.classes));
	}

	return valid;
};

var isValidRecurringShow = function(show) {
	var valid = false;
	if(show) {
		valid = true;
		valid = valid && (show.description && typeof show.description === "string");
		valid = valid && (show.categories && Array.isArray(show.categories));

		if(valid) {
			show.categories.forEach(function(category) {
				valid = valid && (category.name && typeof category.name === "string");
				valid = valid && (category.classes && Array.isArray(category.classes));

				if(valid) {
					category.classes.forEach(function(c) {
						valid = valid && (c && typeof c === "string");
					});
				}
			});
		}
	}

	return valid;
};

var moveRecurringShow = function(showID, direction, res) {
	if(+direction > 0) {
		direction = 1;
	} else {
		direction = -1;
	}

	db.shows.recurring.findOne({ _id: showID }).exec(function(err, show) {
		if(err) {
			log.error(err);
			res.send(500);
			return;
		}

		db.shows.recurring.findOne({ ordering: (show.ordering + direction) }).exec(function(err, swapShow) {
			if(err) {
				log.error(err);
				res.send(500);
				return;
			}

			if(swapShow) {
				show.ordering += direction;
				swapShow.ordering -= direction;

				show.save();
				swapShow.save();
			}

			res.send(200);
		});
	});
};

var __WWW_PATH = "/files/shows";
var __FILE_PATH = config.www.getPath(__WWW_PATH);

var getObjectsInOrder = function(model, sortBy, callback) {
	var sort = { };
	sort[sortBy] = "asc";

	model.find({}).sort(sort).exec().then(callback);
};

var getFileUploadHandler = function(filenameSuffix, showPropertyName) {
	return function(req, res, next) {
		if(!req.user || !req.user.permissions.shows) {
			return next(new restify.UnauthorizedError());
		}

		var handleError = function(err) {
			log.error(err);
			res.send(500);
			require("fs").unlinkSync(req.files.file.path);
		};

		db.shows.shows.findOne({ _id: req.params.showID }).exec(function(err, show) {
			if(err) {
				handleError(err);
				next();
			} else if(show) {
				
				if(showPropertyName === "files") {
					filenameSuffix = "Files " + Date.now();
				}
				
				var filename = show.title + " " + filenameSuffix + ".pdf";
				fs.move(req.files.file.path, path.join(__FILE_PATH, req.params.showID, filename), { mkdirp: true }, function(err) {
					if(err) {
						handleError(err);
						next();
					} else {
						var wwwPath = path.join(__WWW_PATH, req.params.showID, filename);
						if(showPropertyName === "files") {
							show.files.push({ name: req.params.name, path: wwwPath });
						} else {
							show[showPropertyName] = wwwPath;
						}
						show.save(function(err) {
							if(err) {
								handleError(err);
								require("fs").unlinkSync(path.join(__FILE_PATH, req.params.showID, filename));
							} else {
								res.send(200, show);
							}
							next();
						});
					}
				});
			} else {
				handleError("Show ID [" + req.params.showID + "] not found");
				next();
			}
		});
	};
};

var getFileDeleteHandler = function(showPropertyName) {
	return function(req, res, next) {
		if(!req.user || !req.user.permissions.shows) {
			return next(new restify.UnauthorizedError());
		}

		db.shows.shows.findOne({ _id: req.params.showID }).exec(function(err, show) {
			if(err) {
				log.error(err);
				res.send(500);
			} else {
				
				var filename = "";
				
				if(showPropertyName === "files") {
					var files = show.files.filter(function(file) {
						return (file._id.toString() === req.params.fileID);
					});
					if(files.length > 0) {
						filename = files[0].path;
					}
				} else {
					filename = show[showPropertyName];
				}
				
				if(!filename) {
					res.send(400);
					return;
				}
				
				fs.unlink(config.www.getPath(decodeURIComponent(filename)), function(err) {
					if(err) {
						log.error(err);
						res.send(500);
					} else {
						
						if(showPropertyName === "files") {
							show.files = show.files.filter(function(file) {
								return (file._id.toString() !== req.params.fileID);
							});
						} else {
							show[showPropertyName] = "";
						}
						
						show.save(function(err) {
							if(err) {
								log.error(err);
								res.send(500);
							} else {
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
			"get": function(req, res, next) {
				getObjectsInOrder(db.shows.shows, "startDate", function(objs, err) {
					if(err) {
						log.error(err);
						res.send(500);
					} else {
						var shows = {
							upcoming: [ ],
							past: [ ]
						};

						var now = new Date();
						objs.forEach(function(show) {
							if(show.startDate > now || show.endDate > now) {
								shows.upcoming.push(show);
							} else {
								shows.past.push(show);
							}
						});
						res.send(shows);
					}
				});
				next();
			},
			"post": fn.getModelCreator(db.shows.shows, "shows", log, isValidShow, function(obj) {
				obj.dateRange = dates.stringDateRange(obj.startDate, obj.endDate);
			})
		},
		"/shows/:showID":
		{
			"put": fn.getModelUpdater(db.shows.shows, "showID", "shows", log, isValidShow, function(obj) {
				obj.dateRange = dates.stringDateRange(new Date(obj.startDate), new Date(obj.endDate));
			}),
			"delete": fn.getModelDeleter(db.shows.shows, "showID", "shows", log, function(show) {
				if(show.premiumListPath) {
					fs.unlinkSync(path.join(__FILE_PATH, decodeURIComponent(show.premiumListPath)));
				}
				if(show.resultsPath) {
					fs.unlinkSync(path.join(__FILE_PATH, decodeURIComponent(show.resultsPath)));
				}
			})
		},
		"/shows/:showID/file": {
			"post": getFileUploadHandler("File", "files")
		},
		"/shows/:showID/files/:fileID": {
			"delete": getFileDeleteHandler("files")
		},
		"/shows/:showID/results": {
			"post": getFileUploadHandler("Results", "resultsPath"),
			"delete": getFileDeleteHandler("resultsPath")
		},
		"/shows/recurring": {
			"post": fn.getModelCreator(db.shows.recurring, "shows", log, isValidRecurringShow, function(obj) {
				db.shows.recurring.find({}).sort({ ordering: "desc" }).exec(function(err, shows) {
					if(shows && shows.length > 0) {
						obj.ordering = shows[0].ordering + 1;
					} else {
						obj.ordering = 1;
					}
					obj.save();
				});
			}),
			"get": fn.getModelLister(db.shows.recurring, log, "ordering")
		},
		"/shows/recurring/:showID": {
			"put": fn.getModelUpdater(db.shows.recurring, "showID", "shows", log, isValidRecurringShow),
			"delete": fn.getModelDeleter(db.shows.recurring, "showID", "shows", log)
		},
		"/shows/recurring/:showID/up": {
			"put": function(req, res, next) {
				moveRecurringShow(req.params.showID, -1, res);
				next();
			}
		},
		"/shows/recurring/:showID/down": {
			"put": function(req, res, next) {
				moveRecurringShow(req.params.showID, 1, res);
				next();
			}
		}
	}
};
