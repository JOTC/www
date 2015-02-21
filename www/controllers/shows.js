angular.module("jotc")
	.controller("shows", [ "$scope", "$window", "$modal", "jotc-auth", "jotc-api", "jotc-location", function($scope, $window, $modal, $auth, $api, locationService)
	{
		$scope.shows = $api.shows.list;
		$scope.classes = $api.shows.classes;
		
		var showClasses = [ ];
		$scope.getShowClasses = function()
		{
			if(showClasses.length === 0)
			{
				for(var i = 0; i < $scope.classes.length; i++)
				{
					if(!$scope.classes[i].isRally)
					{
						showClasses.push($scope.classes[i]);
					}
				}
			}
			return showClasses;
		};
		
		var rallyClasses = [ ];
		$scope.getRallyClasses = function()
		{
			if(rallyClasses.length === 0)
			{
				for(var i = 0; i < $scope.classes.length; i++)
				{
					if($scope.classes[i].isRally)
					{
						rallyClasses.push($scope.classes[i]);
					}
				}
			}
			return rallyClasses;
		};
		
		$scope.$location = locationService;
		
		$scope.auth = $auth;
		
		$scope.openEditor = function(show)
		{
			if(!show)
			{
				show = {
					title: "",
					description: "",
					registrationDeadline: null,
					startDate: null,
					endDate: null,
					classes: [ ],
					location: "",
					registrationLink: "",
				};
			}
			
			$modal.open({
				templateUrl: "jotc/partials/shows.edit.html",
				controller: "editShow",
				backdrop: "static",
				size: "lg",
				resolve: {
					show: function()
					{
						return show;
					}
				}
			});
		};
		
		$scope.delete = function(show)
		{
			if(confirm("Are you sure you wish to delete the show titled " + show.title + "?  This cannot be undone."))
			{
				if(confirm("Please confirm again.  This show will be permanently deleted."))
				{
					$api.shows.show(show._id).delete();
				}
			}
		};
		
		$scope.openNewWindow = function(url)
		{
			$window.open(url, '_blank');
		};
	}])
	.controller("editShow", [ "$scope", "$modalInstance", "jotc-api", "show", function($scope, $modalInstance, $api, show)
	{
		$scope.action = (show.title === "" ? "New" : "Edit");
		$scope.show = JSON.parse(JSON.stringify(show));
		
		$scope.classes = $api.shows.classes;
		$scope.classesChecked = { };
		
		var classesByRow = [ ];
		$scope.getClassesByRow = function()
		{
			if(classesByRow.length === 0)
			{
				var row;
				for(var i = 0; i < $scope.classes.length; i++)
				{
					if(i % 3 === 0)
					{
						row = [ ];
						classesByRow.push(row);
					}
					row.push($scope.classes[i]);
					
					$scope.classesChecked[$scope.classes[i]._id] = false;
				}
			}
			
			for(var i = 0; i < $scope.show.classes.length; i++)
			{
				$scope.classesChecked[$scope.show.classes[i]._id] = true;
			}
			
			return classesByRow;
		};
		
		$scope.toggleClass = function(toggledClass)
		{
			if($scope.classesChecked[toggledClass._id])
			{
				$scope.show.classes.push(toggledClass);
			}
			else
			{
				for(var i = 0; i < $scope.show.classes.length; i++)
				{
					if($scope.show.classes[i]._id === toggledClass._id)
					{
						$scope.show.classes.splice(i, 1);
						break;
					}
				}
			}
		};
		
		$scope.dateOpen = {
			reg: false,
			start: false,
			end: false,
			
			open: function(which, $event)
			{
				$event.preventDefault();
				$event.stopPropagation();
				
				switch(which)
				{
					case "reg":
						$scope.dateOpen.reg = true;
						break;
						
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
			var fn;
			if($scope.show._id)
			{
				fn = $api.shows.show($scope.show._id).update;
			}
			else
			{
				fn = $api.shows.create;
			}
			
			fn($scope.show, function()
			{
				$modalInstance.dismiss();
			});
		};
		
		$scope.cancel = $modalInstance.dismiss;
	}]);