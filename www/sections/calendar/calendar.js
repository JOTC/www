angular.module("jotc")
	.controller("calendar", [ "$scope", "$modal", "jotc-auth", "jotc-api", function($scope, $modal, $auth, $api)
	{
		$scope.auth = $auth;
		$scope.events = $api.calendar.events;

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
		
		$scope.editEvent = function(event)
		{
			if(!event)
			{
				event = {
					title: "",
					description: "",
					link: "",
					startDate: null,
					endDate: null
				};
			}
			else
			{
				event = event.event;
			}
			
			$modal.open({
				templateUrl: "jotc/sections/calendar/calendar.edit.html",
				controller: "calendar.edit",
				backdrop: "static",
				size: "lg",
				resolve: {
					event: function()
					{
						return event;
					}
				}
			});
		};
		
		$scope.deleteEvent = function(event)
		{
			if(confirm("Are you sure you want to delete the event titled " + event.title + "?  This cannot be undone."))
			{
				if(confirm("Please confirm again.  Do you wish to delete this event?"))
				{
					$api.calendar.event(event._id).delete();
				}
			}
		};
	}])
	.controller("calendar.edit", [ "$scope", "$modalInstance", "jotc-api.calendar", "event", function($scope, $self, $calendar, event)
	{
		$scope.action = (event.name === "" ? "New" : "Edit");
		$scope.event = JSON.parse(JSON.stringify(event));
		$scope.event.startDate = new Date($scope.event.startDate);
		$scope.event.endDate = new Date($scope.event.endDate);
		
		$scope.dateOpen = {
			start: false,
			end: false,
			
			open: function(which, $event)
			{
				$event.preventDefault();
				$event.stopPropagation();
				
				switch(which)
				{
					case "start":
						$scope.dateOpen.start = true;
						break;
						
					case "end":
						$scope.dateOpen.end = true;
						break;
				}
			}
		};
		
		$scope.save = function()
		{
			console.log($scope.event);
			$scope.event.startDate = $scope.event.startDate.toMidnightUTC();
			if($scope.event.endDate)
			{
				$scope.event.endDate = $scope.event.endDate.toMidnightUTC();
			}
			
			var fn = null;
			if($scope.event._id)
			{
				fn = $calendar.event($scope.event._id).update;
			}
			else
			{
				fn = $calendar.create
			}
			fn($scope.event, $self.dismiss);
			//var time = $scope.event.startDate.getTime();
			//time = time - (time % 86400000);
			//$scope.event.startDate = new Date(time);
		};
		
		$scope.cancel = $self.dismiss;
	}]);