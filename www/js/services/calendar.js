angular.module("jotc")
	.service("jotc-api.calendar", [ "$http", "jotc-api.shows", function($http, $shows)
	{
		var events = [ ];
		var calendarEvents = { };
		
		var addCalendarEvent = function(timestamp, obj)
		{
			if(!calendarEvents[timestamp])
			{
				calendarEvents[timestamp] = [ ];
			}
			calendarEvents[timestamp].push(obj);
		};
		
		var addEvent = function(event)
		{
			var time = event.startDate.getTime();
			
			while(time <= event.endDate.getTime())
			{
				addCalendarEvent(time, {
					title: event.title,
					type: "calendar",
					_id: event._id,
					event: event
				});
				time += 86400000;
			}
		};
		
		var buildCalendarEvents = function()
		{
			for(var property in calendarEvents)
			{
				if(calendarEvents.hasOwnProperty(property))
				{
					delete calendarEvents[property];
				}
			}
			
			var i = 0;
			for(i = 0; i < events.length; i++)
			{
				addEvent(events[i]);
			}
			
			var show = null;
			for(i = 0; i < $shows.list.upcoming.length; i++)
			{
				show = $shows.list.upcoming[i];
				addCalendarEvent(show.registrationDeadline.getTime(), {
					title: "Registration deadline for " + show.title + " show",
					type: "show"
				});

				var time = show.startDate.getTime();
				addCalendarEvent(time, {
					title: show.title + " show begins",
					type: "show"
				});
				time += 86400000;
				
				while(time < show.endDate.getTime())
				{
					addCalendarEvent(time, {
						title: show.title + " show",
						type: "show"
					});
					time += 86400000;
				}
				
				addCalendarEvent(show.endDate.getTime(), {
					title: show.title + " show end",
					type: "show"
				});
			}
		};
		
		$http.get("data2/calendar")
			.success(function(data)
			{
				Array.prototype.splice.apply(events, [ 0, events.length ].concat(data));
				for(var i = 0; i < events.length; i++)
				{
					events[i].startDate = new Date(events[i].startDate);
					events[i].endDate = new Date(events[i].endDate);
				}
				buildCalendarEvents();
			});
			
		$shows.onUpdate(buildCalendarEvents);
			
		var create = function(newEvent, callback)
		{
			$http.post("/data2/calendar", newEvent)
				.success(function(event)
				{
					event.startDate = new Date(event.startDate);
					event.endDate = new Date(event.endDate);
					events.push(event);
					
					buildCalendarEvents();
					
					if(callback)
					{
						callback();
					}
				});
		};
		
		var event = function(eventID)
		{
			return Object.freeze({
				update: function(newEvent, callback)
				{
					$http.put("/data2/calendar/" + eventID, newEvent)
						.success(function()
						{
							for(var i = 0; i < events.length; i++)
							{
								if(events[i]._id === eventID)
								{
									events[i] = newEvent;
									break;
								}
							}
							
							buildCalendarEvents();
							
							if(callback)
							{
								callback();
							}
						});
				},
				delete: function(callback)
				{
					$http.delete("/data2/calendar/" + eventID)
						.success(function()
						{
							for(var i = 0; i < events.length; i++)
							{
								if(events[i]._id === eventID)
								{
									events.splice(i, 1);
									break;
								}
							}

							buildCalendarEvents();
							
							if(callback)
							{
								callback();
							}
						});
				}
			});
		};

		return {
			events: calendarEvents,
			create: create,
			event: event
		};
	}]);
