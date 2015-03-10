angular.module("jotc")
	.controller("manage-users", [ "$scope", "$http", "$modal", "jotc-auth", function($scope, $http, $modal, $auth)
	{
		$scope.auth = $auth;
		$scope.users = $auth.users;
		$scope.selectedUser = null;
		$scope.selectedUserShadow = null;
		
		$scope.permissions = {
			shows: "Can add, edit, and remove shows",
			classes: "Can add, edit, and remove classes",
			pictures: "Can add, edit, and remove pictures and galleries",
			calendar: "Can add, edit, and remove calendar events",
			links: "Can add, edit, reorder, and remove links and link groups",
			officers: "Can add, edit, and remove officers from the \"About\" page",
			users: "Can add, remove, and modify permissions of other users"
		};
		
		$scope.newUser = function()
		{
			$scope.selectUser({
				name: "",
				email: "",
				permissions: {
					shows: false,
					classes: false,
					pictures: false,
					calendar: false,
					links: false,
					officers: false,
					users: false
				}
			})
		};
		
		$scope.selectUser = function(user)
		{
			$scope.selectedUserShadow = user;
			$scope.selectedUser = JSON.parse(JSON.stringify(user));
		};
		
		$scope.saveSelectedUser = function()
		{
			var promise = null;
			
			if($scope.selectedUserShadow._id)
			{
				promise = $http.put("/data2/users/" + $scope.selectedUserShadow._id, $scope.selectedUser)
					.success(function()
					{
						$scope.selectedUserShadow.name = $scope.selectedUser.name;
						$scope.selectedUserShadow.email = $scope.selectedUser.email;

						for(var permission in $scope.selectedUser.permissions)
						{
							if($scope.selectedUser.permissions.hasOwnProperty(permission))
							{
								$scope.selectedUserShadow.permissions[permission] = $scope.selectedUser.permissions[permission];
							}
						}
					});
			}
			else
			{
				promise = $http.post("/data2/users", $scope.selectedUser)
					.success(function(user)
					{
						$scope.users.list.push(user);
						$scope.selectUser(user);
					});
			}
			
			promise.error(function()
			{
				alert("There was an error saving the user.");
			});
		};
		
		$scope.resetSelectedUser = function()
		{
			$scope.selectedUser.name = $scope.selectedUserShadow.name;
			$scope.selectedUser.email = $scope.selectedUserShadow.email;

			for(var permission in $scope.selectedUser.permissions)
			{
				if($scope.selectedUser.permissions.hasOwnProperty(permission))
				{
					$scope.selectedUser.permissions[permission] = $scope.selectedUserShadow.permissions[permission];
				}
			}
		};
		
		$scope.resetSelectedPassword = function()
		{
			//if(confirm("Are you sure you wish to reset " + $scope.selectedUserShadow.name + "'s password?  They will receive an email instructing them to reset it."))
			//{
			//}
		};
		
		$scope.deleteSelectedUser = function()
		{
			if(confirm("Are you sure you wish to remove " + $scope.selectedUserShadow.name + " as a user?"))
			{
				if(confirm("Please confirm again.  " + $scope.selectedUserShadow.name + " will be permanently removed from the system."))
				{
					$http.delete("/data2/users/" + $scope.selectedUserShadow._id)
					.success(function()
					{
						for(var i in $scope.users.list)
						{
							if($scope.users.list[i]._id === $scope.selectedUserShadow._id)
							{
								$scope.users.list.splice(i, 1);
								break;
							}
						}
						
						$scope.selectedUserShadow = null;
						$scope.selectedUser = null;
					})
					.error(function()
					{
						alert("There was an error deleting the user.");
					});
				}
			}
		};
	}]);