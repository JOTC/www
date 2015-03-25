var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");

var config = {
	"port": 9931,
	"session": {
		"secret": "session-secret-key",
		"lifetimeInDays": 10
	},
	"gmail": {
		"username": "gmail-username",
		"password": "gmail-password"
	},
	"www": {
		"root": "/vagrant/www",
		"getPath": function(pathSegment)
		{
			var fullPath = path.join(config.www.root, pathSegment);
			if(!fs.existsSync(fullPath))
			{
				mkdirp.sync(fullPath);
			}

			return fullPath;
		}
	}
};

function mergeObjects(obj1, obj2)
{
	for(var property in obj1)
	{
		if(obj1.hasOwnProperty(property))
		{
			if(typeof obj1[property] === "function")
			{
				continue;
			}
			else if(typeof obj1[property] === "object")
			{
				if(obj2.hasOwnProperty(property) && typeof obj2[property] === "object")
				{
					mergeObjects(obj1[property], obj2[property]);
				}
			}
			else if(obj2.hasOwnProperty(property))
			{
				var type = typeof obj2[property];
				if(type !== "function" && type !== "object")
				{
					obj1[property] = obj2[property];
				}
			}
		}
	}
}

try
{
	var configFile = JSON.parse(fs.readFileSync("config.json"));
	mergeObjects(config, configFile);

} catch(e){ console.log(e); }

module.exports = config;
