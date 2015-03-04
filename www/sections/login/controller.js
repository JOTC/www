angular.module("jotc")
	.controller("login", [ "$scope", "$modalInstance", "jotc-auth", "$http", function($scope, $self, $auth, $http)
	{
		$scope.credentials = {
			username: "",
			password: ""
		};
		
		$scope.login = function()
		{
			$http({
				method: "POST",
				url: "/data2/auth/local",
				data: "username=" + $scope.credentials.username + "&password=" + SHA256($scope.credentials.password),
				headers: { "Content-type": "application/x-www-form-urlencoded" }
			})
			.success(function()
			{
				$auth.refresh();
				$self.dismiss();
			});
			
		};
		
		$scope.cancel = $self.dismiss;
	}]);