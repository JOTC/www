var restify = require("restify");
var db = require("../model/db.js");
var log = require("bunyan").createLogger({ name: "officers component", level: "debug" });

var isValidOfficer = function(officer)
{
	var valid = false;
	if(officer)
	{
		valid = true;
		valid = valid && (officer.name && typeof officer.name === "string");
		valid = valid && (officer.titles && Array.isArray(officer.titles));
		valid = valid && (officer.contacts && Array.isArray(officer.contacts));
		
		officer.titles.forEach(function(title)
		{
			valid = valid && (title && typeof title === "string");
		});
		
		officer.contacts.forEach(function(contact)
		{
			valid = valid && (contact.type && (contact.type === "email" || contact.type === "phone"));
			valid = valid && (contact.value && typeof contact.value === "string");
		});
	}
	
	return valid;
};

module.exports = {
	name: "officers",
	paths: {
		"/officers": {
			"get": function(req, res, next)
			{
				db.officers.find({}).exec(function(err, officers)
				{
					if(err)
					{
						res.send(500);
					}
					else
					{
						res.send(officers);
					}
				});
				
				next();
			},
			"post": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.shows)
				{
					return next(new restify.UnauthorizedError());
				}
				
				var officer = req.body;
				if(isValidOfficer(officer))
				{
					var dbOfficer = new db.officers(officer);
					dbOfficer.save(function(err)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else
						{
							res.send(dbOfficer);
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
		"/officers/:officerID": {
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.shows)
				{
					return next(new restify.UnauthorizedError());
				}
				
				var officer = req.body;
				if(isValidOfficer(officer))
				{
					delete officer._id;
					db.officers.update({ _id: req.params.officerID }, officer, { upsert: true }).exec(function(err)
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
				
				db.officers.remove({ _id: req.params.officerID }).exec(function(err)
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
		}
	}
}