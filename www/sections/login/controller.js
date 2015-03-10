angular.module("jotc")
	.controller("login", [ "$scope", "$modalInstance", "jotc-auth", "$http", function($scope, $self, $auth, $http)
	{
		$scope.credentials = {
			username: "",
			password: ""
		};
		
		$scope.inReset = false;
		
		$scope.formSubmit = function()
		{
			if($scope.inReset)
			{
				$http.put("/data2/auth/local/reset", { email: $scope.credentials.username })
				.success(function()
				{
					alert("An email has been sent to you with instructions.");
					$self.dismiss();
				});
			}
			else
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
			}
		};
		
		$scope.forgotPassword = function()
		{
			$scope.inReset = true;
		};
		
		$scope.cancel = $self.dismiss;
	}]);