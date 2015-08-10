angular.module("jotc")
	.service("jotc-api.shows", [ "$http", function($http)
	{
		var _updateHandlers = [ ];
		
		var recurring = {
			list: [ ],
			save: function(recurringShow, callback)
			{
				var promise;
				if(recurringShow._id)
				{
					$http.put("/data2/shows/recurring/" + recurringShow._id, recurringShow)
						.success(function()
						{
							for(var i = 0; i < recurring.list.length; i++)
							{
								if(recurring.list[i]._id === recurringShow._id)
								{
									recurring.list[i] = recurringShow;
									break;
								}
							}
							
							if(callback)
							{
								callback();
							}
						});
				}
				else
				{
					$http.post("/data2/shows/recurring", recurringShow)
						.success(function(recurringShow)
						{
							recurring.list.push(recurringShow);
							if(callback)
							{
								callback();
							}
						});
				}
			},
			up: function(recurringShow)
			{
				$http.put("/data2/shows/recurring/" + recurringShow._id + "/up")
					.success(function()
					{
						for(var i = 0; i < recurring.list.length; i++)
						{
							if(recurring.list[i]._id === recurringShow._id)
							{
								if(i > 0)
								{
									var tmp = recurring.list[i];
									recurring.list[i] = recurring.list[i - 1];
									recurring.list[i - 1] = tmp;
								}
								break;
							}
						}
					});
			},
			down: function(recurringShow)
			{
				$http.put("/data2/shows/recurring/" + recurringShow._id + "/down")
					.success(function()
					{
						for(var i = 0; i < recurring.list.length; i++)
						{
							if(recurring.list[i]._id === recurringShow._id)
							{
								if(i < recurring.list.length - 1)
								{
									var tmp = recurring.list[i];
									recurring.list[i] = recurring.list[i + 1];
									recurring.list[i + 1] = tmp;
								}
								break;
							}
						}
					});
			},
			delete: function(recurringShowID)
			{
				$http.delete("/data2/shows/recurring/" + recurringShowID)
					.success(function()
					{
						for(var i = 0; i < recurring.list.length; i++)
						{
							if(recurring.list[i]._id === recurringShowID)
							{
								recurring.list.splice(i, 1);
								break;
							}
						}
					});
			}
		};
		
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
		
		/*$http.get("/data2/shows/types")
			.success(function(showClasses)
			{
				Array.prototype.splice.apply(classes, [0, classes.length].concat(showClasses));
			});*/
			
		$http.get("/data2/shows/recurring")
			.success(function(recurringShows)
			{
				Array.prototype.splice.apply(recurring.list, [0, recurring.list.length].concat(recurringShows));
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
				deleteFile: function(fileID, callback)
				{
					$http.delete("/data2/shows/" + showID + "/file/" + fileID)
						.success(getNoDataSuccessHandler(showID, callback, function(show)
						{
							show.files = show.files.filter(function(file) {
								return (file._id !== fileID);
							});
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
			recurring: recurring,
			list: shows,
			classes: classes,
			show: show,
			create: create,
			onUpdate: addOnUpdate
		});
	}]);

