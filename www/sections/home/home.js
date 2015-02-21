angular.module("jotc")
	.controller("home", [ "$scope", "$location", "jotc-api", function($scope, $location, $api)
	{
		$scope.calendar = $api.calendar.events;
		
		var pathsByTypes = {
			"show": "shows",
			"class": "classes"
		};
		
		$scope.imgUrl = "";
		$scope.getRandomImage = function()
		{
			if($scope.imgUrl === "" && $api.galleries.list.length > 0)
			{
				var r1 = Math.floor(Math.random() * $api.galleries.list.length);
				var r2 = Math.floor(Math.random() * $api.galleries.list[r1].images.length);
				$scope.imgUrl = $api.galleries.list[r1].images[r2].path;
			}
			
			return $scope.imgUrl;
		};
		
		$scope.click = function(event)
		{
			if(pathsByTypes.hasOwnProperty(event.type))
			{
				$location.path(pathsByTypes[event.type]);
			}
		};
	}]);