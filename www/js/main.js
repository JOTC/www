angular.module("jotc", [ "ngRoute", "ui.bootstrap", "angularFileUpload", "jotc-partials" ])
	.config([ "$routeProvider", function($routeProvider)
	{
		Date.prototype.toMidnightUTC = function()
		{
			// Go to 23:59:59 UTC of the current day.  That pretty
			// much puts the entire world on the same date.  This
			// is handy since we're not interested in times.
			
			var month = this.getMonth() + 1;
			var date = this.getDate();
			
			return new Date(this.getFullYear() + "-" + (month > 10 ? "" : "0") + month + "-" + (date > 10 ? "" : "0") + date + "T23:59:59Z");
		};
		
		$routeProvider
			.when("/home", {
				templateUrl: "jotc/sections/home/home.html",
				controller: "home"
			})
			.when("/shows", {
				templateUrl: "jotc/sections/shows/shows.html",
				controller: "shows"
			})
			.when("/classes", {
				templateUrl: "jotc/sections/classes/classes.html",
				controller: "classes"
			})
			.when("/pictures", {
				templateUrl: "jotc/sections/pictures/pictures.html",
				controller: "pictures"
			})
			.when("/calendar", {
				templateUrl: "jotc/sections/calendar/calendar.html",
				controller: "calendar"
			})
			.when("/links", {
				templateUrl: "jotc/sections/links/links.html",
				controller: "links"
			})
			.when("/about", {
				templateUrl: "jotc/sections/about/about.html",
				controller: "about"
			})
			.otherwise({
				redirectTo: "/home"
			});
	}])
	.service("jotc-auth", [ "$http", function($http)
	{
		/* * /
		$http({
			method: "POST",
			url: "/data2/auth/local",
			data: "username=mgwalker@gmail.com&password=" + SHA256(""),
			headers: { "Content-type": "application/x-www-form-urlencoded" }
		}).success(function(){});
		//*/
		
		var permissions = {
			shows: false,
			classes: false,
			pictures: false,
			calendar: false,
			links: false,
			officers: false,
			users: false
		};

		$http.get("/data2/auth/user")
		.success(function(user)
		{
			if(user && user.permissions)
			{
				permissions.shows = user.permissions.shows;
				permissions.classes = user.permissions.classes;
				permissions.pictures = user.permissions.pictures;
				permissions.calendar = user.permissions.calendar;
				permissions.links = user.permissions.links;
				permissions.officers = user.permissions.officers;
				permissions.users = user.permissions.users;
			}
		});
		
		return permissions;
	}])
	.service("jotc-api", [ "$http", "jotc-api.shows", "jotc-api.classes", "jotc-api.calendar", "jotc-api.pictures", "jotc-api.linkGroups", "jotc-api.officers", function($http, $shows, $classes, $calendar, $pictures, $linkGroups, $officers)
	{
		return Object.freeze({
			calendar: $calendar,
			
			shows: $shows,
			
			classes: $classes,
			
			galleries: $pictures,
						
			links: $linkGroups,
			
			officers: $officers
		});
	}])
	.service("jotc-location", [ function()
	{
		return Object.freeze({
			getImageURLForLocation: function(locationStr)
			{
				if(!locationStr)
				{
					return "";
				}
				var loc = locationStr.replace(/ /g, "+");
				return "http://maps.googleapis.com/maps/api/staticmap?sensor=false&zoom=11&size=200x150&center=" + loc + "&markers=" + loc;
				
			},
			getDirectionsURLForLocation: function(locationStr)
			{
				if(!locationStr)
				{
					return "";
				}
				return "https://maps.google.com/maps?q=" + locationStr.replace(/ /g, "+");
			}
		});
	}])
	.controller("main", [ "$scope", "$http", function($scope, $http)
	{
	}]);
