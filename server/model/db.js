require("mongoose").connect('mongodb://localhost/jotc');

module.exports = {
	calendar: require("./calendar.js"),
	classes: require("./classes.js"),	
	files: require("./files.js"),
	shows: require("./shows.js"),
	images: require("./images.js"),
	users: require("./users.js")
};

module.exports.classes.classTypes.find({}).exec().then(function(classTypes)
	{
		if(classTypes.length == 0)
		{
			console.log("Initializing class types");
			require("./initial/classTypes.js").forEach(function(classType)
			{
				var db = new module.exports.classes.classTypes(classType);
				db.save();
			});
		}
	});

module.exports.shows.showTypes.find({}).exec().then(function(showTypes)
	{
		if(showTypes.length == 0)
		{
			require("./initial/showTypes.js").forEach(function(showType)
			{
				console.log(showType);
				var db = new module.exports.shows.showTypes(showType);
				db.save();
			});
		}
	});