require("mongoose").connect('mongodb://localhost/jotc');

module.exports = {
	calendar: require("./calendar.js"),
	classes: require("./classes.js"),	
	files: require("./files.js"),
	shows: require("./shows.js"),
	images: require("./images.js"),
	officers: require("./officers.js"),
	users: require("./users.js"),
	linkGroups: require("./links.js")
};

module.exports.classes.classTypes.find({}).exec().then(function(classTypes)
	{
		if(classTypes.length === 0)
		{
			require("./initial/classTypes.js").forEach(function(classType)
			{
				var db = new module.exports.classes.classTypes(classType);
				db.save();
			});
		}
	});

module.exports.shows.showTypes.find({}).exec().then(function(showTypes)
	{
		if(showTypes.length === 0)
		{
			require("./initial/showTypes.js").forEach(function(showType)
			{
				var db = new module.exports.shows.showTypes(showType);
				db.save();
			});
		}
	});
	
module.exports.linkGroups.find({}).exec().then(function(linkGroups)
	{
		if(linkGroups.length === 0)
		{
			require("./initial/links.js").forEach(function(link)
			{
				var db = new module.exports.linkGroups(link);
				db.save();
			});
		}
	});