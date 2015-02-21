angular.module("jotc")
	.controller("classes", [ "$scope", "jotc-api", "jotc-location", function($scope, $api, locationService)
	{
		$scope.classes = $api.classes.list;
		$scope.classTypes = $api.classes.types;

		$scope.getDescriptionBlocks = function(clss)
		{
			var descriptions = [ ];
			
			var basicStr = "";
			var basicClassesListed = 0;
			for(var i = 0; i < clss.classTypes.length; i++)
			{
				console.log(clss.classTypes[i]);
				
				if(!clss.classTypes[i].isAdvanced)
				{
					if(basicClassesListed > 0)
					{
						if(i == clss.classTypes.length - 1)
						{
							if(basicClassesListed > 1)
								basicStr += ",";
							basicStr += " and ";
						}
						else
							basicStr += ", ";
					}
					
					console.log(clss.classTypes[i]);

					basicStr += clss.classTypes[i].name;
					basicClassesListed++;
				}
			}
			
			var day = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ][new Date(clss.startDate).getUTCDay()];
			if(basicClassesListed > 0)
				basicStr += " will be offered.  Classes meet every " + day + " at " + clss.timeOfDay + " for " + clss.hoursPerWeek + " hour" + (clss.hoursPerWeek == 1 ? "" : "s") + " and last " + clss.numberOfWeeks + " weeks, including a graduation night.";

			if(basicStr.length > 0)
			{
				descriptions.push(basicStr);
			}
			
			var advancedStr = "";
			var advancedClassesListed = 0;
			for(var i = 0; i < clss.classTypes.length; i++)
			{
				if(clss.classTypes[i].isAdvanced)
				{
					if(advancedClassesListed > 0)
					{
						if(i == clss.classTypes.length - 1)
						{
							if(advancedClassesListed > 1)
								advancedStr += ",";
							advancedStr += " and ";
						}
						else
							advancedStr += ", ";
					}

					advancedStr += clss.classTypes[i].name;
					advancedClassesListed++;
				}
			}

			var requires = (advancedClassesListed > 1 ? "These classes require" : "This class requires");
			if(advancedClassesListed > 0)
				advancedStr += " will " + (basicStr.length > 0 ? "also " : "") + "be available if enough dogs enroll.  " + requires + " that the dog previously completed the JOTC Basic Obedience course.";
			
			if(advancedStr.length > 0)
			{
				descriptions.push(advancedStr);
			}

			return descriptions;
		};

		$scope.$location = locationService;
	}]);