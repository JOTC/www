angular.module("jotc")
	.controller("classes", [ "$scope", "jotc-api", "jotc-location", function($scope, $api, locationService)
	{
		$scope.classes = $api.classes.list;
		$scope.classTypes = $api.classes.types;
		
		var getClassTypesList = function(clss, advanced)
		{
			var str = "";
			var numListed = 0;
			
			for(var i = 0; i < clss.classTypes.length; i++)
			{
				if(clss.classTypes[i].isAdvanced === advanced)
				{
					if(numListed > 0)
					{
						if(i === clss.classTypes.length - 1)
						{
							if(numListed > 1)
							{
								str += ",";
							}
							str += " and ";
						}
						else
						{
							str += ", ";
						}
					}

					str += clss.classTypes[i].name;
					numListed++;
				}
			}
			
			return {
				string: str,
				count: numListed
			};
		};

		$scope.getDescriptionBlocks = function(clss)
		{
			var descriptions = [ ];
			
			var day = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ][new Date(clss.startDate).getUTCDay()];
			
			var basicStr = getClassTypesList(clss, false).string;
			if(basicStr.length > 0)
			{
				basicStr += " will be offered.  Classes meet every " + day + " at " + clss.timeOfDay + " for " + clss.hoursPerWeek + " hour" + (clss.hoursPerWeek === 1 ? "" : "s") + " and last " + clss.numberOfWeeks + " weeks, including a graduation night.";
				descriptions.push(basicStr);
			}

			var advanced = getClassTypesList(clss, true);
			var advancedStr = advanced.string;
			if(advancedStr.length > 0)
			{
				var requires = (advanced.count > 1 ? "These classes require" : "This class requires");
				advancedStr += " will " + (basicStr.length > 0 ? "also " : "") + "be available if enough dogs enroll.  " + requires + " that the dog previously completed the JOTC Basic Obedience course.";
				descriptions.push(advancedStr);
			}

			return descriptions;
		};

		$scope.$location = locationService;
	}]);