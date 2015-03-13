angular.module("jotc")
	.controller("gallery", [ "$scope", "$modalInstance", "jotc-auth", "jotc-api", "gallery", function($scope, $self, $auth, $api, gallery)
	{
		$scope.gallery = gallery;
		$scope.index = 0;
		
		$scope.auth = $auth.permissions;
		
		$scope.next = function()
		{
			cancelEditing();
			if($scope.index < $scope.gallery.images.length - 1)
			{
				$scope.index++;
			}
		};
		
		$scope.previous = function()
		{
			cancelEditing();
			if($scope.index > 0)
			{
				$scope.index--;
			}
		};

		$scope.editing = false;
		var _description = "";
		$scope.beginEditing = function()
		{
			$scope.editing = true;
			_description = $scope.gallery.images[$scope.index].description;
		};
		$scope.saveEditing = function()
		{
			$scope.editing = false;
			$api.galleries.gallery($scope.gallery._id).image($scope.gallery.images[$scope.index]._id).update($scope.gallery.images[$scope.index]);
		};
		var cancelEditing = function()
		{
			if($scope.editing)
			{
				$scope.gallery.images[$scope.index].description = _description;
				$scope.editing = false;
			}
		};
		
		$scope.delete = function()
		{
			if(confirm("Are you sure you wish to delete this picture?  This action cannot be undone."))
			{
				if(confirm("Confirm again.  Are you sure you wish to permanently delete this picture?"))
				{
					$api.galleries.gallery($scope.gallery._id).image($scope.gallery.images[$scope.index]._id).delete(function()
					{
						$scope.index--;
						if($scope.index < 0)
						{
							$scope.index = 0;
						}
					
						if($scope.gallery.images.length === 0)
						{
							$scope.close();
						}
					});
				}
			}
		};
		
		$scope.close = function()
		{
			cancelEditing();
			$self.dismiss();
		};
	}])
	.controller("editGallery", [ "$scope", "$modalInstance", "jotc-api", "gallery", function($scope, $self, $api, gallery)
	{
		$scope.action = (gallery.name === "" ? "New" : "Edit");
		$scope.gallery = JSON.parse(JSON.stringify(gallery));
		
		$scope.cancel = $self.dismiss;
		
		$scope.save = function()
		{
			if($scope.gallery._id)
			{
				$api.galleries.gallery($scope.gallery._id).update($scope.gallery, function()
				{
					$self.dismiss();
				});
			}
			else
			{
				$api.galleries.create($scope.gallery, function()
				{
					$self.dismiss();
				});
			}
		};
	}])
	.controller("pictures", [ "$scope", "$http", "$upload", "$modal", "jotc-auth", "jotc-api", function($scope, $http, $upload, $modal, $auth, $api)
	{
		$scope.galleries = $api.galleries.list;
		$scope.rows = [ ];
		$scope.auth = $auth.permissions;
		
		$scope.getRows = function()
		{
			var i = 0;
			var rowedGalleries = 0;
			
			for(i = 0; i < $scope.rows.length; i++)
			{
				rowedGalleries += $scope.rows[i].length;
			}
			if(rowedGalleries === $scope.galleries.length)
			{
				return $scope.rows;
			}
			
			$scope.rows.splice(0, $scope.rows.length);
			
			var row = [ ];
			for(i = 0; i < $scope.galleries.length; i++)
			{
				row.push($scope.galleries[i]);
				if(row.length === 2)
				{
					$scope.rows.push(row);
					row = [ ];
				}
			}
			if(row.length > 0)
			{
				$scope.rows.push(row);
			}
		};
		
		$scope.showGallery = function(gallery)
		{
			if(gallery.images.length > 0)
			{
				$modal.open({
					templateUrl: "jotc/sections/pictures/gallery.template.html",
					controller: "gallery",
					backdrop: "static",
					size: "lg",
					resolve: {
						gallery: function()
						{
							return gallery;
						}
					}
				});
			}
		};
		
		$scope.openEditor = function(gallery, event)
		{
			if(!gallery)
			{
				gallery = {
					name: "",
					description: ""
				};
			}
			
			$modal.open({
				templateUrl: "jotc/sections/pictures/edit-gallery.template.html",
				controller: "editGallery",
				backdrop: "static",
				size: "lg",
				resolve: {
					gallery: function() { return gallery; }
				}
			});
			event.stopPropagation();
		};
		
		$scope.deleteGallery = function(gallery, event)
		{
			var s = (gallery.images.length === 1 ? "" : "s");
			if(confirm("Are you sure you wish to delete this gallery?  It and all " + gallery.images.length + " picture" + s + " will be deleted.  This action cannot be undone."))
			{
				if(confirm("Confirm again.  Are you sure you wish to permanently delete this gallery and all of its images?"))
				{
					$api.galleries.gallery(gallery._id).delete();
				}
			}
			event.stopPropagation();
		};
	}])
	.controller("pictures.dragdrop", [ "$scope", "$attrs", "$upload", "jotc-api", function($scope, $attrs, $upload, $api)
	{
		$scope.files = [ ];
		$scope.uploadingFiles = [ ];

		var getUploader = function(file, metadata)
		{
			return function()
			{
				$upload.upload({
					url: "/data2/galleries/" + $attrs.galleryId + "/image",
					file: file
				})
				.progress(function(e)
				{
					metadata.progress = Math.round(100 * e.loaded / e.total);
				})
				.success(function(data)
				{
					window.URL.revokeObjectURL(metadata.objUrl);
					for(var i = 0; i < $scope.uploadingFiles.length; i++)
					{
						if($scope.uploadingFiles[i].file === file)
						{
							$scope.uploadingFiles.splice(i, 1);
							
							var galleries = $api.galleries.list;
							for(var j = 0; j < galleries.length; j++)
							{
								if(galleries[j]._id === $attrs.galleryId)
								{
									galleries[j].images.push(data);
									break;
								}
							}
							break;
						}
					}
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
					objUrl: window.URL.createObjectURL($scope.files[i]),
					progress: 0
				};
				$scope.uploadingFiles.push(uploadingFile);
				
				getUploader($scope.files[i], uploadingFile)();
			}
		});
	}]);
