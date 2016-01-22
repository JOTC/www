angular.module("jotc")
	.directive("dragDropFileUploader", [ "$upload", function($upload) {
		return {
			scope: {
				objectType: "@objType",
				obj: "=obj",
				documentType: "@docType",
				documentName: "@docName",
			},
			transclude: false,
			templateUrl: "jotc/sections/uploader/template.html"
		};
	}])
	.controller("dragDropFileUploader.prompt.controller", [ "$scope", "$modalInstance", "file", "upload", function($scope, $self, file, uploadFn) {
		$scope.file = file;
		
		$scope.upload = function() {
			uploadFn($scope.file.name);
			$self.dismiss();
		};
		
		$scope.cancel = $self.dismiss;
	}])
	.controller("dragDropFileUploader.controller", [ "$scope", "$upload", "$modal", function($scope, $upload, $modal) {
		$scope.files = [ ];
		$scope.uploadingFiles = [ ];
		
		function doUpload(metaFile, url) {
			$upload
				.upload({
					url: url,
					file: metaFile.file
				})
				.progress(function(e) {
					metaFile.progress = Math.round(100 * e.loaded / e.total);
				})
				.success(function(data) {
					$scope.uploadingFiles.splice(0, 1);
					if($scope.documentType === "prompt") {
						Array.prototype.splice.apply($scope.obj.files, [ 0, $scope.obj.files.length ].concat(data.files));
					} else {
						var prop = $scope.documentType + "Path";
						$scope.obj[prop] = data[prop];
					}
				})
				.error(function() {
					alert("There was an error uploading this file.  Please try again later.");
					$scope.uploadingFiles.splice(0, 1);
				});
		}

		$scope.fileDropped = function($files, $event, $rejectedFiles) {

			if($files.length !== 1) {
				return;
			}

			var uploadingFile = {
				name: $files[0].name,
				file: $files[0],
				progress: 0
			};
			$scope.uploadingFiles[0] = uploadingFile;

			if($scope.documentType === "prompt") {
				if($scope.objectType === "shows") {
					uploadingFile.name = "Premium List";
				} else {
					uploadingFile.name = "";
				}
				
				$modal.open({
					templateUrl: "jotc/sections/uploader/prompt.template.html",
					controller: "dragDropFileUploader.prompt.controller",
					backdrop: "static",
					size: "lg",
					resolve: {
						file: function() {
							return uploadingFile;
						},
						upload: function() {
							return function(name) {
								doUpload(uploadingFile, "/data2/" + $scope.objectType + "/" + $scope.obj._id + "/file?name=" + encodeURIComponent(name));
							};
						}
					}
				});
			} else {
				doUpload(uploadingFile, "/data2/" + $scope.objectType + "/" + $scope.obj._id + "/" + $scope.documentType);
			}
		};
	}]);
