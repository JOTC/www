angular.module("jotc")
	.controller("links", [ "$scope", "jotc-api", function($scope, $api)
	{
		$scope.links = $api.links;
		
		var halves = [ [], [] ];
		$scope.getHalves = function()
		{
			Array.prototype.splice.apply(halves[0], [0, halves[0].length].concat($scope.links.slice(0, Math.ceil($scope.links.length / 2))));
			Array.prototype.splice.apply(halves[1], [0, halves[1].length].concat($scope.links.slice(Math.ceil($scope.links.length / 2))));

			return halves;
		}
	}]);