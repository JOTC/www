angular.module("jotc")
	.service("jotc-api.shows", [ "$http", function($http)
	{
		var _updateHandlers = [ ];
		
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
				
				var i = 0;
				for(i = 0; i < shows.upcoming.length; i++)
				{
					shows.upcoming[i].registrationDeadline = new Date(shows.upcoming[i].registrationDeadline);
					shows.upcoming[i].startDate = new Date(shows.upcoming[i].startDate);
					shows.upcoming[i].endDate = new Date(shows.upcoming[i].endDate);
				}
				for(i = 0; i < shows.past.length; i++)
				{
					shows.past[i].registrationDeadline = new Date(shows.past[i].registrationDeadline);
					shows.past[i].startDate = new Date(shows.past[i].startDate);
					shows.past[i].endDate = new Date(shows.past[i].endDate);
				}
				
				triggerUpdateHandlers();
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
				triggerUpdateHandlers();
			};
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
					show.registrationDeadline = new Date(show.registrationDeadline);
					show.startDate = new Date(show.startDate);
					show.endDate = new Date(show.endDate);
					
					shows.upcoming.push(show);
					if(callback)
					{
						callback();
					}
					triggerUpdateHandlers();
				});
		};
		
		var addOnUpdate = function(handler)
		{
			if(handler && typeof handler === "function")
			{
				_updateHandlers.push(handler);
			}
		};

		var triggerUpdateHandlers = function()
		{
			for(var i in _updateHandlers)
			{
				_updateHandlers[i]();
			}
		};
		
		return Object.freeze({
			list: shows,
			classes: classes,
			show: show,
			create: create,
			onUpdate: addOnUpdate
		});
	}]);

