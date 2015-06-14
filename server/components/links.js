var restify = require("restify");
var db = require("../model/db.js");
var fn = require("../common-fn.js");
var log = require("bunyan").createLogger({ name: "links component", level: "debug" });

function validateRequest(req, requiredIDs) {
	if(!req.user || !req.user.permissions.links) {
		return new restify.UnauthorizedError();
	}

	var error;

	if(requiredIDs && Array.isArray(requiredIDs)) {
		requiredIDs.forEach(function(requiredID) {
			if(!req.params[requiredID] || !/[0-9a-zA-Z]{24}/.test(req.params[requiredID])) {
				error = new restify.BadRequestError();
			}
		});
	}

	return error;
}

function handleError(err, res, continueFn) {
	if(err) {
		log.error(err);
		res.send(new restify.InternalServerError());
	} else if(typeof continueFn === "function") {
		continueFn();
	}
}

var swapGroup = function(groupID, direction, res) {
	if(direction < 0) {
		direction = -1;
	} else {
		direction = 1;
	}

	db.linkGroups.findOne({ _id: groupID }).exec(function(err, group) {
		handleError(err, res, function() {
			if(group) {
				db.linkGroups.findOne({ ordering: (group.ordering + direction) }).exec(function(err, swapGroup) {
					handleError(err, res, function() {
						if(swapGroup) {
							var newOrder = swapGroup.ordering;
							swapGroup.ordering = group.ordering;
							group.ordering = newOrder;

							swapGroup.save(function(err) {
								handleError(err, res, function() {
									group.save(function(err) {
										handleError(err, res, function() {
											res.send(200, { });
										});
									});
								});
							});
						} else {
							res.send(new restify.NotFoundError());
						}
					});
				});
			} else {
				res.send(new restify.NotFoundError());
			}
		});
	});
};

var swapLink = function(groupID, linkID, direction, res) {
	if(direction < 0) {
		direction = -1;
	} else {
		direction = 1;
	}

	db.linkGroups.findOne({ _id: groupID }).exec(function(err, group) {
		handleError(err, res, function() {
			if(group) {
				var index = group.links.indexOf(group.links.id(linkID));
				if(index < 0) {
					res.send(new restify.NotFoundError());
					return;
				}

				if((index + direction) >= 0 && (index + direction) < group.links.length) {
					var tmp = group.links[index + direction];
					group.links[index + direction] = group.links[index];
					group.links[index] = tmp;

					group.markModified("links");
					group.save(function(err) {
						handleError(err, res, function() {
							res.send(200, { });
						});
					});
				} else {
					res.send(200, { });
				}
			} else {
				res.send(new restify.NotFoundError());
			}
		});
	});
};

var isValidGroup = function(group) {
	var valid = false;
	if(group) {
		valid = true;
		valid = valid && (group.name && typeof group.name === "string");
	}

	return valid;
};

var isValidLink = function(link) {
	var valid = false;
	if(link) {
		valid = true;
		valid = valid && (link.name && typeof link.name === "string");
		valid = valid && (link.url && typeof link.url === "string");
	}

	return valid;
};

module.exports = {
	name: "links",
	paths: {
		"/links": {
			"get": fn.getModelLister(db.linkGroups, log, { ordering: "asc" }),
			"post": fn.getModelCreator(db.linkGroups, "links", log, isValidGroup, function(obj, done) {
				db.linkGroups.find({}).sort({ ordering: "desc" }).exec(function(err, groups) {
					if(groups && groups.length > 0) {
						obj.ordering = groups[0].ordering + 1;
					} else {
						obj.ordering = 1;
					}
					done();
				});
			})
		},
		"/links/:groupID": {
			"put": fn.getModelUpdater(db.linkGroups, "groupID", "links", log, isValidGroup),
			"post": function(req, res, next) {
				var error = validateRequest(req, ["groupID"]);
				if(error) {
					return next(error);
				}

				var link = req.body;
				if(isValidLink(link)) {
					delete link._id;
					db.linkGroups.findOne({ _id: req.params.groupID }).exec(function(err, group) {
						handleError(err, res, function() {
							if(group) {
								group.links.push(link);
								group.save(function(err) {
									handleError(err, res, function() {
										res.send(200, group.links[group.links.length - 1]);
									});
								});
							} else {
								log.error("No such group");
								res.send(new restify.NotFoundError());
							}
						});
					});
				} else {
					return next(new restify.BadRequestError());
				}

				next();
			},
			"delete": fn.getModelDeleter(db.linkGroups, "groupID", "links", log)
		},
		"/links/:groupID/up": {
			"put": function(req, res, next) {
				var error = validateRequest(req, ["groupID"]);
				if(error) {
					return next(error);
				}

				swapGroup(req.params.groupID, -1, res);
				next();
			}
		},
		"/links/:groupID/down": {
			"put": function(req, res, next) {
				var error = validateRequest(req, ["groupID"]);
				if(error) {
					return next(error);
				}

				swapGroup(req.params.groupID, 1, res);
				next();
			}
		},
		"/links/:groupID/:linkID": {
			"put": function(req, res, next) {
				var error = validateRequest(req, ["groupID", "linkID"]);
				if(error) {
					return next(error);
				}

				var link = req.body;
				if(isValidLink(link)) {
					delete link._id;
					db.linkGroups.findOne({ _id: req.params.groupID }).exec(function(err, group) {
						handleError(err, res, function() {
							if(group) {
								var dbLink = group.links.id(req.params.linkID);
								if(dbLink) {
									dbLink.name = link.name;
									dbLink.url = link.url;

									group.markModified("links");
									group.save(function(err) {
										handleError(err, res, function() {
											res.send(200, { });
										});
									});
								} else {
									res.send(new restify.NotFoundError());
								}
							} else {
								res.send(new restify.NotFoundError());
							}
						});
					});
				} else {
					return next(new restify.BadRequestError());
				}

				next();
			},
			"delete": function(req, res, next) {
				var error = validateRequest(req, ["groupID", "linkID"]);
				if(error) {
					return next(error);
				}

				db.linkGroups.findOne({ _id: req.params.groupID }).exec(function(err, group) {
					handleError(err, res, function() {
						if(group) {
							var linkID = group.links.id(req.params.linkID);
							if(!linkID) {
								res.send(new restify.NotFoundError());
								return;
							}

							linkID.remove();
							group.save(function(err) {
								handleError(err, res, function() {
									res.send(200, { });
								});
							});
						} else {
							res.send(new restify.NotFoundError());
						}
					});
				});

				next();
			}
		},
		"/links/:groupID/:linkID/up": {
			"put": function(req, res, next) {
				var error = validateRequest(req, ["groupID", "linkID"]);
				if(error) {
					return next(error);
				}

				swapLink(req.params.groupID, req.params.linkID, -1, res);
				next();
			}
		},
		"/links/:groupID/:linkID/down": {
			"put": function(req, res, next) {
				var error = validateRequest(req, ["groupID", "linkID"]);
				if(error) {
					return next(error);
				}

				swapLink(req.params.groupID, req.params.linkID, 1, res);
				next();
			}
		}
	}
};
