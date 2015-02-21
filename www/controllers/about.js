angular.module("jotc")
	.controller("about", [ "$scope", "jotc-api", function($scope, $api)
	{
		$scope.officers = $api.officers;
	}]);