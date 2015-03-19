angular.module("jotc")
	.controller("shows", [ "$scope", "$window", "$modal", "jotc-auth", "jotc-api", "jotc-location", function($scope, $window, $modal, $auth, $api, locationService)
	{
		$scope.shows = $api.shows.list;
		$scope.classes = $api.shows.classes;
		
		$scope.recurring = {
			list: $api.shows.recurring.list,
			delete: function(recurringShow)
			{
				if(confirm("Are you certain you wish to delete this recurring show description?  It cannot be undone."))
				{
					if(confirm("Please confirm again.  Do you want to permanently delete this recurring show description?"))
					{
						$api.shows.recurring.delete(recurringShow._id);
					}
				}
			},
			up: $api.shows.recurring.up,
			down: $api.shows.recurring.down,
			edit: function(recurringShow)
			{
				if(!recurringShow)
				{
					recurringShow = {
						description: "",
						categories: [ ]
					};
				}
			
				$modal.open({
					templateUrl: "jotc/sections/shows/edit-recurring.template.html",
					controller: "editRecurring",
					backdrop: "static",
					size: "lg",
					resolve: {
						recurringShow: function()
						{
							return recurringShow;
						}
					}
				});
			}
		};
		
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
		
		$scope.auth = $auth.permissions;
		
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
				templateUrl: "jotc/sections/shows/edit-show.template.html",
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
		
		$scope.deletePremiumList = function(show)
		{
			if(confirm("Are you sure you wish to delete the premium list for the show " + show.title + "?  This cannot be undone."))
			{
				if(confirm("Please confirm again.  This will delete the premium list for this show."))
				{
					$api.shows.show(show._id).deletePremiumList();
				}
			}
		};

		$scope.deleteResults = function(show)
		{
			if(confirm("Are you sure you wish to delete the results for the show " + show.title + "?  This cannot be undone."))
			{
				if(confirm("Please confirm again.  This will delete the results for this show."))
				{
					$api.shows.show(show._id).deleteResults();
				}
			}
		};
		
		$scope.safeURL = function(url)
		{
			return encodeURIComponent(url);
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
		
		for(var i = 0; i < $scope.show.classes.length; i++)
		{
			$scope.show.classes[i] = { name: $scope.show.classes[i] };
		}
		
		$scope.addClass = function()
		{
			if($scope.show.classes.length === 0 || $scope.show.classes[$scope.show.classes.length - 1].name !== "")
			{
				$scope.show.classes.push({ name: "" })
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
			var show = JSON.parse(JSON.stringify($scope.show));
			for(var i = 0; i < show.classes.length; i++)
			{
				if(show.classes[i].name === "")
				{
					show.classes.splice(i, 1);
					i--;
				}
				else
				{
					show.classes[i] = show.classes[i].name;
				}
			}
			
			var fn;
			if($scope.show._id)
			{
				fn = $api.shows.show(show._id).update;
			}
			else
			{
				fn = $api.shows.create;
			}
			
			show.registrationDeadline = new Date(show.registrationDeadline).toMidnightUTC();
			show.startDate = new Date(show.startDate).toMidnightUTC();
			show.endDate = new Date(show.endDate).toMidnightUTC();
			
			fn(show, function()
			{
				$modalInstance.dismiss();
			});
		};
		
		$scope.cancel = $modalInstance.dismiss;
	}])
	.controller("editRecurring", [ "$scope", "$modalInstance", "jotc-api", "recurringShow", function($scope, $modalInstance, $api, recurringShow)
	{
		$scope.action = (recurringShow.description === "" ? "New" : "Edit");
		$scope.recurringShow = JSON.parse(JSON.stringify(recurringShow));
		
		$scope.recurringShow.categories.forEach(function(category)
		{
			for(var i = 0; i < category.classes.length; i++)
			{
				category.classes[i] = { name: category.classes[i] };
			}
		});
		
		$scope.addClass = function(category)
		{
			if(category.classes.length === 0 || category.classes[category.classes.length - 1].name !== "")
			{
				category.classes.push({ name: "" });
			}
		};
		
		$scope.addClassCategory = function()
		{
			$scope.recurringShow.categories.push({ name: "", classes: [ { name: "" } ]});
		};
		
		$scope.save = function()
		{
			var recurringShow = JSON.parse(JSON.stringify($scope.recurringShow));
			for(var j = 0; j < recurringShow.categories.length; j++)
			{
				var category = recurringShow.categories[j];
				for(var i = 0; i < category.classes.length; i++)
				{
					if(category.classes[i].name !== "")
					{
						category.classes[i] = category.classes[i].name
					}
					else
					{
						category.classes.splice(i, 1);
						i--;
					}
				}
				
				if(category.classes.length === 0)
				{
					recurringShow.categories.splice(j, 1);
					j--;
				}
			};
			
			$api.shows.recurring.save(recurringShow, $modalInstance.dismiss);
		}
		
		$scope.cancel = $modalInstance.dismiss;
	}]);