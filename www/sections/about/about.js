angular.module("jotc")
	.controller("about", [ "$scope", "jotc-api.officers", function($scope, $officers)
	{
		$scope.officers = $officers.list;
	}]);