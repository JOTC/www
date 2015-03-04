angular.module("jotc")
	.directive("dragDropFileUploader", [ "$upload", function($upload)
	{
		return {
			scope: {
				objectType: "@objType",
				obj: "=obj",
				documentType: "@docType",
				documentName: "@docName"
			},
			transclude: false,
			templateUrl: "jotc/sections/uploader/template.html"
		};
	}])
	.controller("dragDropFileUploader.controller", [ "$scope", "$upload", function($scope, $upload)
	{
		$scope.files = [ ];
		$scope.uploadingFiles = [ ];
		
		$scope.fileDropped = function($files, $event, $rejectedFiles)
		{
			if($files.length !== 1)
			{
				return;
			}
			
			var uploadingFile = {
				name: $files[0].name,
				file: $files[0],
				progress: 0
			};
			$scope.uploadingFiles[0] = uploadingFile;

			$upload.upload({
				url: "/data2/" + $scope.objectType + "/" + $scope.obj._id + "/" + $scope.documentType,
				file: uploadingFile.file
			})
			.progress(function(e)
			{
				uploadingFile.progress = Math.round(100 * e.loaded / e.total);
			})
			.success(function(data)
			{
				$scope.uploadingFiles.splice(0, 1);
				
				var prop = $scope.documentType + "Path";
				$scope.obj[prop] = data[prop];
			})
			.error(function()
			{
				alert("There was an error uploading this file.  Please try again later.");
				$scope.uploadingFiles.splice(0, 1);
			});
		};
	}])