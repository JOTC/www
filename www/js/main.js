angular.module("jotc", [ "ngRoute", "ui.bootstrap", "angularFileUpload", "jotc-partials" ])
	.config([ "$routeProvider", function($routeProvider)
	{
		$routeProvider
			.when("/home", {
				templateUrl: "jotc/partials/home.html",
				controller: "home"
			})
			.when("/shows", {
				templateUrl: "jotc/partials/shows.html",
				controller: "shows"
			})
			.when("/classes", {
				templateUrl: "jotc/partials/classes.html",
				controller: "classes"
			})
			.when("/pictures", {
				templateUrl: "jotc/partials/pictures.html",
				controller: "pictures"
			})
			.when("/links", {
				templateUrl: "jotc/partials/links.html",
				controller: "links"
			})
			.when("/about", {
				templateUrl: "jotc/partials/about.html",
				controller: "about"
			})
			.otherwise({
				redirectTo: "/home"
			})
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
		}

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
		var calendar = function()
		{
			var calendar = [ ];
		
			$http.get("old/data/calendar.php?summary")
				.success(function(data)
				{
					calendar.splice(0, calendar.length);
					if(data.success)
					{
						for(event in data.events)
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
		}();
			
		var shows = function()
		{
			var shows = [ ];
			var classes = [ ]
		
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
									if(shows[i]._id == showID)
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
									if(shows[i]._id == showID)
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
			})
		}();
		
		var classes = function()
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
			}
		}();
		
		var officers = function()
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
		}();
			
		var links = function()
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
		}();
		
		var pictureGalleries = function()
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
								if(galleries[i]._id == galleryID)
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
								if(galleries[i]._id == galleryID)
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
						})
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
			}
		}();
			
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
					return "";
				var loc = locationStr.replace(/ /g, "+");
				return "http://maps.googleapis.com/maps/api/staticmap?sensor=false&zoom=11&size=200x150&center=" + loc + "&markers=" + loc;
				
			},
			getDirectionsURLForLocation: function(locationStr)
			{
				if(!locationStr)
					return "";
				return "https://maps.google.com/maps?q=" + locationStr.replace(/ /g, "+");
			}
		});
	}])
	.controller("main", [ "$scope", "$http", function($scope, $http)
	{
	}]);
	
function SHA256(o){function e(c,b){var d=(c&65535)+(b&65535);return(c>>16)+(b>>16)+(d>>16)<<16|d&65535}function g(c,b){return c>>>b|c<<32-b}o=function(c){c=c.replace(/\r\n/g,"\n");for(var b="",d=0;d<c.length;d++){var a=c.charCodeAt(d);if(a<128)b+=String.fromCharCode(a);else{if(a>127&&a<2048)b+=String.fromCharCode(a>>6|192);else{b+=String.fromCharCode(a>>12|224);b+=String.fromCharCode(a>>6&63|128)}b+=String.fromCharCode(a&63|128)}}return b}(o);return function(c){for(var b="",d=0;d<c.length*4;d++)b+="0123456789abcdef".charAt(c[d>>2]>>(3-d%4)*8+4&15)+"0123456789abcdef".charAt(c[d>>2]>>(3-d%4)*8&15);return b}(function(c,b){var d=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298),a=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225),h=new Array(64),i,k,l,p,j,m,n,q,r,f,s,t;c[b>>5]|=128<<24-b%32;c[(b+64>>9<<4)+15]=b;for(r=0;r<c.length;r+=16){i=a[0];k=a[1];l=a[2];p=a[3];j=a[4];m=a[5];n=a[6];q=a[7];for(f=0;f<64;f++){h[f]=f<16?c[f+r]:e(e(e(g(h[f-2],17)^g(h[f-2],19)^h[f-2]>>>10,h[f-7]),g(h[f-15],7)^g(h[f-15],18)^h[f-15]>>>3),h[f-16]);s=e(e(e(e(q,g(j,6)^g(j,11)^g(j,25)),j&m^~j&n),d[f]),h[f]);t=e(g(i,2)^g(i,13)^g(i,22),i&k^i&l^k&l);q=n;n=m;m=j;j=e(p,s);p=l;l=k;k=i;i=e(s,t)}a[0]=e(i,a[0]);a[1]=e(k,a[1]);a[2]=e(l,a[2]);a[3]=e(p,a[3]);a[4]=e(j,a[4]);a[5]=e(m,a[5]);a[6]=e(n,a[6]);a[7]=e(q,a[7])}return a}(function(c){for(var b=Array(),d=0;d<c.length*8;d+=8)b[d>>5]|=(c.charCodeAt(d/8)&255)<<24-d%32;return b}(o),o.length*8))};
