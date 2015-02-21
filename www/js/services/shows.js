angular.module("jotc")
	.service("jotc-api.shows", [ "$http", function($http)
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
	}]);

