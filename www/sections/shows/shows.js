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
				templateUrl: "jotc/sections/shows/shows.edit.html",
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
	.controller("show-addFile", [ "$scope", "$attrs", "$upload", "jotc-api", function($scope, $attrs, $upload, $api)
	{
		$scope.files = [ ];
		$scope.uploadingFiles = [ ];
		$scope.name = $attrs.name;
		
		var removeFileFromUploading = function(file)
		{
			for(var i = 0; i < $scope.uploadingFiles.length; i++)
			{
				if($scope.uploadingFiles[i].file === file)
				{
					$scope.uploadingFiles.splice(i, 1);
					break;
				}
			}
		};
		
		var getUploader = function(file, metadata)
		{
			return function()
			{
				$upload.upload({
					url: "/data2/shows/" + $attrs.showId + "/" + $attrs.type,
					file: file
				})
				.progress(function(e)
				{
					metadata.progress = Math.round(100 * e.loaded / e.total);
				})
				.success(function(data)
				{
					removeFileFromUploading(file);

					var prop = $attrs.type + "Path";
					var shows = $api.shows.list.past.concat($api.shows.list.upcoming);
					
					for(var i = 0; i < shows.length; i++)
					{
						if(shows[i]._id === data._id)
						{
							shows[i][prop] = data[prop];
							break;
						}
					}
				})
				.error(function()
				{
					alert("There was an error uploading this file.  Please try again later.");
					removeFileFromUploading(file);
				});
			};
		};
		
		$scope.$watch("files", function()
		{
			for(var i = 0; i < $scope.files.length; i++)
			{
				var uploadingFile = {
					name: $scope.files[i].name,
					file: $scope.files[i],
					progress: 0
				};
				$scope.uploadingFiles.push(uploadingFile);

				getUploader($scope.files[i], uploadingFile)();
			}
		});
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
			var i = 0;
			
			if(classesByRow.length === 0)
			{
				var row;
				for(i = 0; i < $scope.classes.length; i++)
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
			
			for(i = 0; i < $scope.show.classes.length; i++)
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