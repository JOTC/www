angular.module("jotc")
	.controller("classes", [ "$scope", "$modal", "jotc-auth", "jotc-api", "jotc-location", function($scope, $modal, $auth, $api, locationService)
	{
		$scope.auth = $auth.permissions;
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
			
			var day = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ][clss.startDate.getUTCDay()];
			
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
		
		$scope.getStartDate = function()
		{
			var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
			
			return function(clss)
			{
				return months[clss.startDate.getUTCMonth()] + " " + clss.startDate.getUTCDate() + ", " + clss.startDate.getUTCFullYear();
			};
		}();

		$scope.$location = locationService;
		
		$scope.editClass = function(clss)
		{
			if(!clss)
			{
				clss = {
					startDate: null,
					numberOfWeeks: 6,
					hoursPerWeek: 1,
					timeOfDay: "7:00 PM",
					location: "",
					classTypes: [ ],
				};
			}
			
			$modal.open({
				templateUrl: "jotc/sections/classes/edit-class.template.html",
				controller: "classes.edit",
				backdrop: "static",
				size: "lg",
				resolve: {
					editClass: function()
					{
						return clss;
					}
				}
			});
		};
		
		$scope.deleteClass = function(clss)
		{
			if(confirm("Are you sure you wish to delete this class?  This cannot be undone."))
			{
				if(confirm("Please confirm again.  This class will be permanently deleted."))
				{
					$api.classes.class(clss._id).delete();
				}
			}
		};
		
		$scope.deleteRegistrationForm = function(clss)
		{
			if(confirm("Are you sure you wish to delete this registration form?  This cannot be undone."))
			{
				if(confirm("Please confirm again.  This file will be permanently deleted."))
				{
					$api.classes.class(clss._id).deleteRegistrationForm();
				}
			}
		};
	}])
	.controller("classes.edit", [ "$scope", "$modalInstance", "jotc-api.classes", "editClass", function($scope, $self, $classes, editClass)
	{
		$scope.action = (editClass._id === "" ? "New" : "Edit");
		$scope.editClass = JSON.parse(JSON.stringify(editClass));
		
		$scope.date = {
			start: false,
			open: function(which, $event)
			{
				$event.preventDefault();
				$event.stopPropagation();
				
				switch(which)
				{
					case "start":
						$scope.date.start = true;
						break;
				}
			}
		};
		
		$scope.classes = $classes.types;
		$scope.classesChecked = { };
		
		var classesByRow = [ ];
		$scope.getClassesByRow = function()
		{
			var i = 0;
			
			if(classesByRow.length === 0)
			{
				var row;
				for(i = 0; i < $scope.classes.length; i++)
				{
					if(i % 2 === 0)
					{
						row = [ ];
						classesByRow.push(row);
					}
					row.push($scope.classes[i]);
					
					$scope.classesChecked[$scope.classes[i]._id] = false;
				}
			}
			
			for(i = 0; i < $scope.editClass.classTypes.length; i++)
			{
				$scope.classesChecked[$scope.editClass.classTypes[i]._id] = true;
			}
			
			return classesByRow;
		};
		
		$scope.toggleClass = function(toggledClass)
		{
			if($scope.classesChecked[toggledClass._id])
			{
				$scope.editClass.classTypes.push(toggledClass);
			}
			else
			{
				for(var i = 0; i < $scope.editClass.classTypes.length; i++)
				{
					if($scope.editClass.classTypes[i]._id === toggledClass._id)
					{
						$scope.editClass.classTypes.splice(i, 1);
						break;
					}
				}
			}
		};
		
		$scope.save = function()
		{
			var fn = null;
			if($scope.editClass._id)
			{
				fn = $classes.class($scope.editClass._id).update;
			}
			else
			{
				fn = $classes.create;
			}
			
			$scope.editClass.startDate = new Date($scope.editClass.startDate).toMidnightUTC();
			delete $scope.editClass.endDate;
			
			fn($scope.editClass, $self.dismiss);
		};
		
		$scope.cancel = $self.dismiss;
	}]);