angular.module("jotc")
	.controller("resetPassword", [ "$scope", "$http", "$location", "jotc-auth", function($scope, $http, $location, $auth)
	{
		$scope.reset = {
			password1: "",
			password2: ""
		};
		
		$scope.passwordIsSufficient = function()
		{
			return /[0-9]+/.test($scope.reset.password1) && /[a-zA-Z]+/.test($scope.reset.password1) && $scope.reset.password1.length >= 8;
		};
		
		$scope.passwordsMatch = function()
		{
			return ($scope.reset.password1 == $scope.reset.password2 && $scope.passwordIsSufficient());
		};
		
		$scope.resetPassword = function()
		{
			if($scope.passwordIsSufficient() && $scope.passwordsMatch())
			{
				$http.put("/data2/auth/local/resetPassword", { secret: SHA256($scope.reset.password1) })
				.success(function()
				{
					$auth.refresh();
					$location.path("/");
					alert("Your password has been set.  You are now logged in and will be redirected to the front page.");
				});
			}
		}
	}]);