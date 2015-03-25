angular.module("jotc", [ "ngRoute", "ngAnimate", "ui.bootstrap", "angularFileUpload", "jotc-partials" ])
	.config([ "$routeProvider", function($routeProvider)
	{
		Date.prototype.toMidnightUTC = function()
		{
			// Go to 23:59:59 UTC of the current day.  That pretty
			// much puts the entire world on the same date.  This
			// is handy since we're not interested in times.

			var month = this.getMonth() + 1;
			var date = this.getDate();

			return new Date(this.getFullYear() + "-" + (month > 9 ? "" : "0") + month + "-" + (date > 9 ? "" : "0") + date + "T23:59:59Z");
		};

		$routeProvider
			.when("/home", {
				templateUrl: "jotc/sections/home/template.html",
				controller: "home"
			})
			.when("/shows", {
				templateUrl: "jotc/sections/shows/template.html",
				controller: "shows"
			})
			.when("/classes", {
				templateUrl: "jotc/sections/classes/template.html",
				controller: "classes"
			})
			.when("/pictures", {
				templateUrl: "jotc/sections/pictures/template.html",
				controller: "pictures"
			})
			.when("/calendar", {
				templateUrl: "jotc/sections/calendar/template.html",
				controller: "calendar"
			})
			.when("/links", {
				templateUrl: "jotc/sections/links/template.html",
				controller: "links"
			})
			.when("/about", {
				templateUrl: "jotc/sections/about/template.html",
				controller: "about"
			})
			.when("/users", {
				templateUrl: "jotc/sections/users/template.html",
				controller: "manage-users"
			})
			.when("/resetPassword", {
				templateUrl: "jotc/sections/resetPassword/template.html",
				controller: "resetPassword"
			})
			.otherwise({
				redirectTo: "/home"
			});
	}])
	.service("jotc-auth", [ "$http", function($http)
	{
		var permissions = {
			shows: false,
			classes: false,
			pictures: false,
			calendar: false,
			links: false,
			officers: false,
			users: false
		};

		var users = {
			list: [ ]
		};

		var loggedIn = false;
		var userID = "";
		var username = "";

		var getUser = function()
		{
			$http.get("/data2/auth/user")
			.success(function(user)
			{
				loggedIn = false;
				userID = "";
				username = "";

				if(user && user.permissions)
				{
					loggedIn = true;
					userID = user._id;
					username = user.name;

					permissions.shows = user.permissions.shows;
					permissions.classes = user.permissions.classes;
					permissions.pictures = user.permissions.pictures;
					permissions.calendar = user.permissions.calendar;
					permissions.links = user.permissions.links;
					permissions.officers = user.permissions.officers;
					permissions.users = user.permissions.users;

					if(permissions.users)
					{
						$http.get("/data2/users")
						.success(function(list)
						{
							Array.prototype.splice.apply(users.list, [ 0, users.list.length ].concat(list));
						});
					}
				}
				else
				{
					permissions.shows = false;
					permissions.classes = false;
					permissions.pictures = false;
					permissions.calendar = false;
					permissions.links = false;
					permissions.officers = false;
					permissions.users = false;
				}
			});
		};

		getUser();

		return {
			isLoggedIn: function() { return loggedIn; },
			getUserID: function() { return userID; },
			getUsername: function() { return username; },
			refresh: getUser,
			permissions: permissions,
			users: users
		};
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
	.controller("main", [ "$scope", "$window", "$modal", "$http", "jotc-auth", function($scope, $window, $modal, $http, $auth)
	{
		$scope.login = function()
		{
			$modal.open({
				templateUrl: "jotc/sections/login/template.html",
				controller: "login",
				backdrop: "static",
				size: "sm"
			});
		};

		$scope.logout = function()
		{
			$http.get("/data2/auth/logout")
			.success(function()
			{
				$auth.refresh();
			});
		};

		$scope.auth = $auth;

		$scope.navbar = {
			fixed: false
		};

		var $$window = $(window);
		angular.element($window).bind("scroll", function()
		{
			var fixed = ($$window.scrollTop() > 200);
			if(fixed !== $scope.navbar.fixed)
			{
				$scope.$apply(function()
				{
					$scope.navbar.fixed = fixed;
				});
			}
		});
	}]);
