angular.module("jotc")
	.controller("calendar", [ "$scope", "$location", "$modal", "jotc-auth", "jotc-api", function($scope, $location, $modal, $auth, $api)
	{
		$scope.auth = $auth.permissions;
		$scope.events = $api.calendar.events;

		var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		$scope.daysOfTheWeek = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
		
		$scope.weeks = [ ];
		
		var theDate = Date.now();
		theDate = new Date(theDate - (theDate % 86400000));
		theDate = new Date(theDate.getTime() - (theDate.getUTCDay() * 86400000) + 86399000);

		for(var weekNumber = 0; weekNumber < 5; weekNumber++)
		{
			var days = [ ];
			for(var i = 0; i < 7; i++)
			{
				days.push({
					date: theDate.getUTCDate(),
					month: (i === 0 ? monthNames[theDate.getUTCMonth()] : false),
					do: theDate
				});
				
				theDate = new Date(theDate.getTime() + 86400000);
			}
			$scope.weeks.push(days);
		}
		
		$scope.gotoEvent = function(event)
		{
			if(event.type === "show")
			{
				$location.path("/shows");
			}
			else if(event.type === "class")
			{
				$location.path("/classes");
			}
			else
			{
				$modal.open({
					templateUrl: "jotc/sections/calendar/popup.template.html",
					controller: "calendar.popup",
					backdrop: "static",
					size: "lg",
					resolve: {
						event: function()
						{
							return event.event;
						}
					}
				});
			}
		};
		
		$scope.editEvent = function(event, $domEvent)
		{
			$domEvent.stopPropagation();
			
			if(!event)
			{
				event = {
					title: "",
					description: "",
					location: "",
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
				templateUrl: "jotc/sections/calendar/edit-calendar.template.html",
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
		
		$scope.deleteEvent = function(event, $domEvent)
		{
			$domEvent.stopPropagation();
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
			$scope.event.startDate = new Date($scope.event.startDate).toMidnightUTC();
			if($scope.event.endDate)
			{
				$scope.event.endDate = new Date($scope.event.endDate).toMidnightUTC();
			}
			else
			{
				$scope.event.endDate = $scope.event.startDate;
			}
			
			var fn = null;
			if($scope.event._id)
			{
				fn = $calendar.event($scope.event._id).update;
			}
			else
			{
				fn = $calendar.create;
			}
			
			fn($scope.event, $self.dismiss);
		};
		
		$scope.cancel = $self.dismiss;
	}])
	.controller("calendar.popup", [ "$scope", "$modalInstance", "jotc-location", "event", function($scope, $self, locationService, event)
	{
		$scope.event = event;
		$scope.close = $self.dismiss;
		$scope.$location = locationService;
		
		var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		var days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
		
		var getDateString = function(date)
		{
			return days[date.getUTCDay()] + ", " + months[date.getUTCMonth()] + " " + date.getUTCDate();
		};
		
		$scope.dateRange = (event.startDate.getTime() === event.endDate.getTime() ? getDateString(event.startDate) : getDateString(event.startDate) + " through " + getDateString(event.endDate));
	}]);