angular.module("jotc")
	.service("jotc-api.shows", [ "$http", function($http)
	{
		var shows = {
			upcoming: [ ],
			past: [ ]
		};
		var classes = [ ];

		$http.get("/data2/shows")
			.success(function(_shows)
			{
				shows.upcoming = _shows.upcoming;
				shows.past = _shows.past;
			});
		
		$http.get("/data2/shows/types")
			.success(function(showClasses)
			{
				Array.prototype.splice.apply(classes, [0, classes.length].concat(showClasses));
			});
			
		var getNoDataSuccessHandler = function(showID, callback, fn)
		{
			return function()
			{
				var outerBreak = false;
				for(var showType in shows)
				{
					if(shows.hasOwnProperty(showType))
					{
						for(var i = 0; i < shows[showType].length; i++)
						{
							if(shows[showType][i]._id === showID)
							{
								fn(shows[showType][i], shows[showType], i);
								outerBreak = true;
								break;
							}
						}
					}
				
					if(outerBreak)
					{
						break;
					}
				}
				
				if(callback)
				{
					callback();
				}
			}
		};
		
		var show = function(showID)
		{
			return Object.freeze({
				update: function(newShow, callback)
				{
					$http.put("/data2/shows/" + showID, newShow)
						.success(getNoDataSuccessHandler(showID, callback, function(show, arr, i)
						{
							arr[i] = newShow;
						}));
				},
				delete: function(callback)
				{
					$http.delete("/data2/shows/" + showID)
						.success(getNoDataSuccessHandler(showID, callback, function(show, arr, i)
						{
							arr.splice(i, 1);
						}));
				},
				deletePremiumList: function(callback)
				{
					$http.delete("/data2/shows/" + showID + "/premiumList")
						.success(getNoDataSuccessHandler(showID, callback, function(show)
						{
							show.premiumListPath = "";
						}));
				},
				deleteResults: function(callback)
				{
					$http.delete("/data2/shows/" + showID + "/results")
						.success(getNoDataSuccessHandler(showID, callback, function(show)
						{
							show.resultsPath = "";
						}));
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
		});
	}]);

