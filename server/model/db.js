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

var initializedModels = {
	"./initial/classTypes.js": module.exports.classes.classTypes,
	"./initial/showTypes.js": module.exports.shows.showTypes,
	"./initial/links.js": module.exports.linkGroups
};

var getInserter = function(model, module)
{
	return function(objs)
	{
		if(objs.length === 0)
		{
			require(module).forEach(function(obj)
			{
				var modelObj = new model(obj);
				modelObj.save();
			});
		}
	};
};

for(var mod in initializedModels)
{
	if(initializedModels.hasOwnProperty(mod))
	{
		initializedModels[mod].find({}).exec().then(getInserter(initializedModels[mod], mod));
	}
}