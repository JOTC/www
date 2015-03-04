var restify = require("restify");
var passport = require("passport");
var sessions = require("client-sessions");
var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));

var app = restify.createServer({ name: "JOTC Data API Server" });

app.use(restify.queryParser());
app.use(restify.bodyParser({ mapParams: false }));
app.use(sessions({
	cookieName: "session",
	secret: config.session.secret,
	duration: (86400000 * config.session.lifetimeInDays), // milliseconds
	activeDuration: (86400000 * config.session.lifetimeInDays) // milliseconds
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next)
{
	res.redirect = function(address)
	{
		res.header("Location", address);
		res.send(302);
	};
	next();
});
app.delete = app.del;

require("./auth.js")(passport);

app.post("/auth/local", passport.authenticate("custom-local"), function(req, res) { res.send(200); });

app.get("/auth/user", function(req, res, next)
{
	var user = { };
	if(req.user)
	{
		user = JSON.parse(JSON.stringify(req.user));
	}
	delete user.local;
	
	res.send(user);
	next();
});

app.get("/auth/logout", function(req, res, next)
{
	req.logout();
	req.session.destroy();
	res.send(200);
	next();
});

fs.readdirSync("./components").forEach(function(file)
{
	var component = require("./components/" + file);
	for(var path in component.paths)
	{

		if(!component.paths.hasOwnProperty(path))
		{
			continue;
		}

		for(var verb in component.paths[path])
		{
			if(!component.paths[path].hasOwnProperty(verb))
			{
				continue;
			}

			var handler = component.paths[path][verb];
			if(typeof(handler) === "function")
			{
				app[verb.toLowerCase()](path, handler);
				console.log("%s\t%s", verb.toUpperCase(), path);
			}
		}
	}
});

app.listen(config.port, function()
{
	console.log("%s ready at %s", app.name, app.url);
	require("./model/db.js");
});
