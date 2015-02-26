var db = require("../model/db.js");
var log = require("bunyan").createLogger({ name: "officers component", level: "debug" });
var fn = require("../common-fn.js");

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
			"get": fn.getModelLister(db.officers, log),
			"post": fn.getModelCreator(db.officers, "officers", log, isValidOfficer)
		},
		"/officers/:officerID": {
			"put": fn.getModelUpdater(db.officers, "officerID", "shows", log, isValidOfficer),
			"delete": fn.getModelDeleter(db.officers, "officerID", "officers", log)
		}
	}
};