angular.module("jotc", [ "ngRoute", "ui.bootstrap", "angularFileUpload", "jotc-partials" ])
	.config([ "$routeProvider", function($routeProvider)
	{
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
	.service("jotc-api", [ "$http", function($http)
	{
		var calendar = (function()
		{
			var calendar = [ ];
		
			$http.get("old/data/calendar.php?summary")
				.success(function(data)
				{
					calendar.splice(0, calendar.length);
					if(data.success)
					{
						for(var event in data.events)
						{
							if(data.events.hasOwnProperty(event))
							{
								var eventsOnDate = data.events[event];

								for(var i = 0; i < eventsOnDate.length; i++)
								{
									calendar.push({
										start: (+event + 43200) * 1000,	// Dates are stored as midnight UTC, so move it up 12 hours to get everyone in the world on the same date.
										id: data.events[event][i].id,
										title: data.events[event][i].title,
										duration: data.events[event][i].duration,
										type: data.events[event][i].type
									});
								}
							}
						}
					}
				});
			
			return calendar;
		}());
			
		var shows = (function()
		{
			var shows = [ ];
			var classes = [ ];
		
			$http.get("/data2/shows")
				.success(function(_shows)
				{
					Array.prototype.splice.apply(shows, [0, shows.length].concat(_shows));
				});
				
			$http.get("/data2/shows/types")
				.success(function(showClasses)
				{
					Array.prototype.splice.apply(classes, [0, classes.length].concat(showClasses));
				});
				
			var show = function(showID)
			{
				return Object.freeze({
					update: function(newShow, callback)
					{
						$http.put("/data2/shows/" + showID, newShow)
							.success(function()
							{
								for(var i = 0; i < shows.length; i++)
								{
									if(shows[i]._id === showID)
									{
										shows[i] = newShow;
										break;
									}
								}
							
								if(callback)
								{
									callback();
								}
							});
					},
					delete: function(callback)
					{
						$http.delete("/data2/shows/" + showID)
							.success(function()
							{
								for(var i = 0; i < shows.length; i++)
								{
									if(shows[i]._id === showID)
									{
										shows.splice(i, 1);
										break;
									}
								}
							});
					}
				});
			};
			
			var create = function(newShow, callback)
			{
				$http.post("/data2/shows", newShow)
					.success(function(show)
					{
						shows.push(show);
						if(callback)
						{
							callback();
						}
					});
			};
				
			return Object.freeze({
				list: shows,
				classes: classes,
				show: show,
				create: create
				//showClasses: showClasses,
				//rallyClasses: rallyClasses
			});
		}());
		
		var classes = (function()
		{
			var classes = [ ];
			var classTypes = [ ];
		
			$http.get("/data2/classes")
				.success(function(data)
				{
					Array.prototype.splice.apply(classes, [0, classes.length].concat(data));
				});
			$http.get("/data2/classes/types")
				.success(function(data)
				{
					Array.prototype.splice.apply(classTypes, [0, classTypes.length].concat(data));
				});
				
			return {
				classes: classes,
				classTypes: classTypes
			};
		}());
		
		var officers = (function()
		{
			var officers = [ ];
			
			$http.get("old/data/officers.php")
				.success(function(data)
				{
					if(data.success)
					{
						Array.prototype.splice.apply(officers, [0, officers.length].concat(data.officers));
					}
				});
			
			return officers;
		}());
			
		var links = (function()
		{
			var links = [ ];
			
			$http.get("old/data/links.php")
				.success(function(data)
				{
					if(data.success)
					{
						Array.prototype.splice.apply(links, [0, links.length].concat(data.groups));
					}
				});
			
			return links;
		}());
		
		var pictureGalleries = (function()
		{
			var galleries = [ ];
			
			$http.get("/data2/galleries")
			.success(function(data)
			{
				Array.prototype.splice.apply(galleries, [0, galleries.length].concat(data));
			});
			
			var gallery = function(galleryID)
			{
				return Object.freeze({
					update: function(newGallery, callback)
					{
						$http.put("/data2/galleries/" + galleryID, newGallery)
						.success(function()
						{
							for(var i = 0; i < galleries.length; i++)
							{
								if(galleries[i]._id === galleryID)
								{
									galleries[i].name = newGallery.name;
									galleries[i].description = newGallery.description;
									break;
								}
							}
							if(callback)
							{
								callback();
							}
						});
					},
					delete: function(callback)
					{
						$http.delete("/data2/galleries/" + galleryID)
						.success(function()
						{
							for(var i = 0; i < galleries.length; i++)
							{
								if(galleries[i]._id === galleryID)
								{
									galleries.splice(i, 1);
									break;
								}
							}
							if(callback)
							{
								callback();
							}
						});
					},
					
					image: function(imageID)
					{
						return Object.freeze({
							update: function(newImage, callback)
							{
								$http.put("/data2/galleries/" + galleryID + "/image/" + imageID, newImage)
								.success(function()
								{
									if(callback)
									{
										callback();
									}
								});
							},
							delete: function(callback)
							{
								$http.delete("/data2/galleries/" + galleryID + "/image/" + imageID)
								.success(function()
								{
									for(var i = 0; i < galleries.length; i++)
									{
										if(galleries[i]._id === galleryID)
										{
											for(var j = 0; j < galleries[i].images.length; j++)
											{
												if(galleries[i].images[j]._id === imageID)
												{
													galleries[i].images.splice(j, 1);
													break;
												}
											}
											break;
										}
									}
									if(callback)
									{
										callback();
									}
								});
							}
						});
					}
				});
			};
			
			var createGallery = function(gallery, callback)
			{
				$http.post("/data2/galleries", gallery)
				.success(function(gallery)
				{
					galleries.push(gallery);
					if(callback)
					{
						callback();
					}
				});
			};
			
			return {
				list: galleries,
				gallery: gallery,
				create: createGallery
			};
		}());
			
		return Object.freeze({
			calendar: calendar,
			
			shows: shows,
			
			classes: Object.freeze({
				list: classes.classes,
				types: classes.classTypes
			}),
			
			galleries: pictureGalleries,
						
			links: links,
			
			officers: officers
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
