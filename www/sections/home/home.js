angular.module("jotc")
	.controller("home", [ "$scope", "$location", "jotc-api", function($scope, $location, $api)
	{
		$scope.calendar = $api.calendar.events;
		$scope.events = { };
		
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
			
			for(var i in $scope.events)
			{
				if($scope.events.hasOwnProperty(i))
				{
					delete $scope.events[i];
				}
			}
			for(var i in newEvents)
			{
				$scope.events[i] = newEvents[i];
			}
		});
		
		var pathsByTypes = {
			"show": "shows",
			"class": "classes"
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
		
		$scope.isFuture = function(ts)
		{
			return ts > Date.now();
		};
		
		$scope.click = function(event)
		{
			if(pathsByTypes.hasOwnProperty(event.type))
			{
				$location.path(pathsByTypes[event.type]);
			}
		};
	}]);