angular.module("jotc")
	.service("jotc-api.calendar", [ "$http", function($http)
	{
		var events = [ ];

		$http.get("old/data/calendar.php?summary")
			.success(function(data)
			{
				events.splice(0, events.length);
				if(data.success)
				{
					for(var event in data.events)
					{
						if(data.events.hasOwnProperty(event))
						{
							var eventsOnDate = data.events[event];

							for(var i = 0; i < eventsOnDate.length; i++)
							{
								events.push({
									// Dates are stored as midnight UTC, so move it up 12 hours
									// to get everyone in the world on the same date. Also,
									// they're stored as seconds.  This will be resolved when
									// calendar entries are created by this service instead of
									// being read from the old PHP services.
									start: (+event + 43200) * 1000,
									id: data.events[event][i].id,
									title: data.events[event][i].title,
									duration: data.events[event][i].duration,
									type: data.events[event][i].type
								});
							}
						}
					}
				}
			});

		return {
			events: events
		};
	}]);
