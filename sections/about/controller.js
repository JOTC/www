angular.module("jotc")
	.controller("about", [ "$scope", "$modal", "jotc-auth", "jotc-api.officers", function($scope, $modal, $auth, $officers)
	{
		$scope.auth = $auth.permissions;
		
		$scope.officers = $officers.list;
		
		$scope.editOfficer = function(officer)
		{
			if(!officer)
			{
				officer = {
					name: "",
					titles: [ ],
					contacts: [ ]
				};
			}
			
			$modal.open({
				templateUrl: "jotc/sections/about/edit-officer.template.html",
				controller: "editOfficer",
				backdrop: "static",
				size: "lg",
				resolve: {
					officer: function()
					{
						return officer;
					}
				}
			});
		};
		
		$scope.deleteOfficer = function(officer)
		{
			if(confirm("Are you sure you wish to delete the officer '" + officer.name + "'?  This is permanent and cannot be undone."))
			{
				if(confirm("Please confirm.  Are you sure wish to delete this officer?"))
				{
					$officers.officer(officer._id).delete();
				}
			}
		};
	}])
	.controller("editOfficer", [ "$scope", "$modalInstance", "jotc-api.officers", "officer", function($scope, $self, $officers, officer)
	{
		$scope.action = (officer.name === "" ? "New" : "Edit");
		$scope.officer = JSON.parse(JSON.stringify(officer));
		
		$scope.titles = [ ];
		for(var i = 0; i < $scope.officer.titles.length; i++)
		{
			$scope.titles.push({ value: $scope.officer.titles[i] });
		}
		
		$scope.addTitle = function()
		{
			if($scope.titles.length === 0 || $scope.titles[$scope.titles.length - 1].value !== "")
			{
				$scope.titles.push({ value: "" });
			}
		};
		
		$scope.addContact = function()
		{
			if($scope.officer.contacts.length === 0 || $scope.officer.contacts[$scope.officer.contacts.length - 1].value !== "")
			{
				$scope.officer.contacts.push({
					type: "email",
					value: ""
				});
			}
		};
		
		$scope.save = function()
		{
			var i = 0;
			
			if($scope.officer.name === "")
			{
				return;
			}
			
			$scope.officer.titles = [ ];
			for(i = 0; i < $scope.titles.length; i++)
			{
				if($scope.titles[i].value)
				{
					$scope.officer.titles.push($scope.titles[i].value);
				}
			}
			
			for(i = 0; i < $scope.officer.contacts.length; i++)
			{
				if($scope.officer.contacts[i].value === "")
				{
					$scope.officer.contacts.splice(i, 1);
				}
			}
			
			if($scope.officer._id)
			{
				$officers.officer($scope.officer._id).update($scope.officer, $self.dismiss);
			}
			else
			{
				$officers.create($scope.officer, $self.dismiss);
			}
		};
		
		$scope.cancel = $self.dismiss;
	}]);