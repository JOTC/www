angular.module("jotc")
	.filter("orderEventObjects", function()
	{
		return function(items)
		{
			var filtered = [];
			angular.forEach(items, function(item)
			{
				filtered.push(item);
			});
			filtered.sort(function(a, b)
			{
				return (a.date < b.date ? 1 : -1);
			});
			
			return filtered;
		};
	})
	.controller("home", [ "$scope", "$location", "jotc-api", function($scope, $location, $api)
	{
		$scope.calendar = $api.calendar.events;
		$scope.events = [ ];
		
		$scope.$watchCollection("calendar", function()
		{
			var seenShows = [ ], seenClasses = [ ], newEvents = { };
			
			var add = function(ts, event)
			{
				if(!newEvents[ts])
				{
					newEvents[ts] = [ ];
				}
				newEvents[ts].push(event);
				event.date = ts;
			};
			
			for(var i in $scope.calendar)
			{
				if($scope.calendar.hasOwnProperty(i))
				{
					for(var j in $scope.calendar[i])
					{
						if($scope.calendar[i][j].type === "class")
						{
							if(seenClasses.indexOf($scope.calendar[i][j].classID) < 0)
							{
								seenClasses.push($scope.calendar[i][j].classID);
								add(i, $scope.calendar[i][j]);
							}
						}
						else
						{
							add(i, $scope.calendar[i][j]);
						}
					}
				}
			}
			
			var eventsArray = [ ];
			for(var d in newEvents)
			{
				eventsArray.push({
					date: new Date(d),
					events: newEvents[d]
				});
			}
			eventsArray.sort(function(a, b)
			{
				return (a.date > b.date) ? 1 : -1;
			});
			
			Array.prototype.splice.apply($scope.events, [ 0, $scope.events.length ].concat(eventsArray));
		});
		
		var pathsByTypes = {
			"show": "shows",
			"class": "classes",
			"calendar": "calendar"
		};
		
		$scope.imgUrl = "";
		$scope.getRandomImage = function()
		{
			if($scope.imgUrl === "" && $api.galleries.list.length > 0)
			{
				var r1 = Math.floor(Math.random() * $api.galleries.list.length);
				var r2 = Math.floor(Math.random() * $api.galleries.list[r1].images.length);
				$scope.imgUrl = $api.galleries.list[r1].images[r2].path;
			}
			
			return $scope.imgUrl;
		};
		
		$scope.isFuture = function(eventGroup)
		{
			return eventGroup.date > new Date();
		};
		
		$scope.click = function(event)
		{
			if(pathsByTypes.hasOwnProperty(event.type))
			{
				$location.path(pathsByTypes[event.type]);
			}
		};
	}]);