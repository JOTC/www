angular.module("jotc")
	.controller("calendar", [ "$scope", "$modal", "jotc-auth", "jotc-api.officers", function($scope, $modal, $auth, $officers)
	{
		var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		$scope.daysOfTheWeek = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
		
		$scope.weeks = [ ];
		
		var theDate = Date.now();
		theDate = new Date(theDate - (theDate % 86400000));
		theDate = new Date(theDate.getTime() - (theDate.getUTCDay() * 86400000));

		for(var weekNumber = 0; weekNumber < 5; weekNumber++)
		{
			var days = [ ];
			for(var i = 0; i < 7; i++)
			{
				days.push({
					date: theDate.getUTCDate(),
					month: (i === 0 ? monthNames[theDate.getUTCMonth()] : false),
					ts: theDate.getTime()
				});
				
				theDate = new Date(theDate.getTime() + 86400000);
			}
			$scope.weeks.push(days);
		}
		
		console.log($scope.weeks);
		
		$scope.events = {
			"1425254400000": [
				{
					title: "An event",
					type: "class"
				},
				{
					title: "Another event with a longer title",
					type: "show"
				},
				{
					title: "One more, so we can see what happens when a cell exceeds the set height..."
				}
			]
		}
		
	}]);