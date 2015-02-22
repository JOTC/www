var restify = require("restify");
var db = require("../model/db.js");
var log = require("bunyan").createLogger({ name: "links component", level: "debug" });

var swapGroup = function(groupID, direction, res)
{
	if(direction < 0)
	{
		direction = -1;
	}
	else
	{
		direction = 1;
	}
	
	db.linkGroups.findOne({ _id: groupID }).exec(function(err, group)
	{
		if(err)
		{
			log.error(err);
			res.send(500);
		}
		else
		{
			db.linkGroups.findOne({ ordering: (group.ordering + direction) }).exec(function(err, swapGroup)
			{
				if(err)
				{
					log.error(err);
					res.send(500);
				}
				else
				{
					if(swapGroup)
					{
						var newOrder = swapGroup.ordering;
						swapGroup.ordering = group.ordering;
						group.ordering = newOrder;
						
						swapGroup.save(function(err)
						{
							if(err)
							{
								log.error(err);
								res.send(500);
							}
							else
							{
								group.save(function(err)
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
					else
					{
						res.send(200);
					}
				}
			});
		}
	});
};

var swapLink = function(groupID, linkID, direction, res)
{
	if(direction < 0)
	{
		direction = -1;
	}
	else
	{
		direction = 1;
	}
	
	db.linkGroups.findOne({ _id: groupID }).exec(function(err, group)
	{
		if(err)
		{
			log.error(err);
			res.send(500);
		}
		else if(group)
		{
			var index = group.links.indexOf(group.links.id(linkID));
			if((index + direction) >= 0 && (index + direction) < group.links.length)
			{
				var tmp = group.links[index + direction];
				group.links[index + direction] = group.links[index];
				group.links[index] = tmp;
				
				group.markModified("links");
				group.save(function(err)
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
				res.send(200);
			}
		}
		else
		{
			res.send(200);
		}
	});	
};

var isValidGroup = function(group)
{
	var valid = false;
	if(group)
	{
		valid = true;
		valid = valid && (group.name && typeof group.name === "string");
	}
	
	return valid;
};

var isValidLink = function(link)
{
	var valid = false;
	if(link)
	{
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
			"get": function(req, res, next)
			{
				db.linkGroups.find({}).sort({ ordering: "asc" }).exec(function(err, links)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
					}
					else
					{
						res.send(links);
					}
				});
				
				next();
			},
			"post": function(req, res, next)
			{
				console.log("HEY, I'M AT POST /links");
				
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}
				
				var group = req.body;
				console.log(group);
				if(isValidGroup(group))
				{
					delete group._id;
					var groupDB = new db.linkGroups(group);
					
					db.linkGroups.find({}).sort({ ordering: "desc" }).exec(function(err, groups)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else
						{
							if(groups.length > 0)
							{
								groupDB.ordering = groups[0].ordering + 1;
							}
							else
							{
								groupDB.ordering = 1;
							}
							
							groupDB.save(function(err)
							{
								if(err)
								{
									log.error(err);
									res.send(500);
								}
								else
								{
									res.send(200, groupDB);
								}
							});
						}
					});
				}
				else
				{
					console.log(group);
					return next(new restify.BadRequestError());
				}
				
				next();
			}
		},
		"/links/:groupID": {
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}

				var group = req.body;
				if(isValidGroup(group))
				{
					delete group._id;
					db.linkGroups.update({ _id: req.params.groupID }, group, { upsert: true }).exec(function(err)
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
			"post": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}
				
				var link = req.body;
				if(isValidLink(link))
				{
					delete link._id;
					db.linkGroups.findOne({ _id: req.params.groupID }).exec(function(err, group)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else if(group)
						{
							group.links.push(link);
							group.save(function(err)
							{
								if(err)
								{
									log.error(err);
									res.send(500);
								}
								else
								{
									res.send(200, group.links[group.links.length - 1]);
								}
							});
						}
						else
						{
							log.error("No such group");
							res.send(new restify.BadRequestError());
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
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}
				
				db.linkGroups.remove({ _id: req.params.groupID }).exec(function(err)
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
				
				next();
			}
		},
		"/links/:groupID/up": {
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}
				
				swapGroup(req.params.groupID, -1, res);
				next();
			}
		},
		"/links/:groupID/down": {
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}

				swapGroup(req.params.groupID, 1, res);
				next();
			}
		},
		"/links/:groupID/:linkID": {
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}
			
				var link = req.body;
				if(isValidGroup(link))
				{
					delete link._id;
					db.linkGroups.findOne({ _id: req.params.groupID }).exec(function(err, group)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else if(group)
						{
							var dbLink = group.links.id(req.params.linkID);
							if(dbLink)
							{
								dbLink.name = link.name;
								dbLink.url = link.url;
								
								group.markModified("links");
								group.save(function(err)
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
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}
			
				db.linkGroups.findOne({ _id: req.params.groupID }).exec(function(err, group)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
					}
					else if(group)
					{
						group.links.id(req.params.linkID).remove();
						group.save(function(err)
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
						res.send(200);
					}
				});
				
				next();
			}
		},
		"/links/:groupID/:linkID/up": {
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}
				
				swapLink(req.params.groupID, req.params.linkID, -1, res);
				next();
			}
		},
		"/links/:groupID/:linkID/down": {
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.links)
				{
					return next(new restify.UnauthorizedError());
				}

				swapLink(req.params.groupID, req.params.linkID, 1, res);
				next();
			}
		}
		
	}
};
