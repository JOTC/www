angular.module("jotc")
	.controller("links", [ "$scope", "$modal", "jotc-auth", "jotc-api.linkGroups", function($scope, $modal, $auth, $linkGroups)
	{
		$scope.groups = $linkGroups.list;
		$scope.auth = $auth.permissions;
		
		var halves = [ [], [] ];
		$scope.getHalves = function()
		{
			Array.prototype.splice.apply(halves[0], [0, halves[0].length].concat($scope.groups.slice(0, Math.ceil($scope.groups.length / 2))));
			Array.prototype.splice.apply(halves[1], [0, halves[1].length].concat($scope.groups.slice(Math.ceil($scope.groups.length / 2))));

			return halves;
		};
		
		$scope.up = {
			group: function(group)
			{
				$linkGroups.group(group._id).up();
			},
			link: function(group, link)
			{
				$linkGroups.group(group._id).link(link._id).up();
			}
		};

		$scope.down = {
			group: function(group)
			{
				$linkGroups.group(group._id).down();
			},
			link: function(group, link)
			{
				$linkGroups.group(group._id).link(link._id).down();
			}
		};
		
		$scope.edit = {
			group: function(group)
			{
				if(!group)
				{
					group = {
						name: ""
					};
				}
				
				$modal.open({
					templateUrl: "jotc/sections/links/links.group.edit.html",
					controller: "links-edit-group",
					backdrop: "static",
					size: "lg",
					resolve: {
						group: function()
						{
							return group;
						}
					}
				});				
			},
			link: function(group, link)
			{
				if(!group)
				{
					return;
				}
				
				if(!link)
				{
					link = {
						name: "",
						url: ""
					};
				}
				
				$modal.open({
					templateUrl: "jotc/sections/links/links.edit.html",
					controller: "links-edit",
					backdrop: "static",
					size: "lg",
					resolve: {
						group: function()
						{
							return group;
						},
						link: function()
						{
							return link;
						}
					}
				});
			}
		};
		
		$scope.delete = {
			group: function(group)
			{
				if(confirm("Are you sure you wish to delete the group '" + group.name + "'?  This will also delete the " + group.links.length + " links inside the group.  This is permanent and cannot be undone."))
				{
					if(confirm("Please confirm.  This will permanently delete the link.  Are you sure?"))
					{
						$linkGroups.group(group._id).delete();
					}
				}
			},
			link: function(group, link)
			{
				if(confirm("Are you sure you wish to delete the link to '" + link.name + "'?  This is permanent and cannot be undone."))
				{
					if(confirm("Please confirm.  This will permanently delete the link.  Are you sure?"))
					{
						$linkGroups.group(group._id).link(link._id).delete(function()
						{
							$scope.getHalves();
						});
					}
				}
			}
		};
	}])
	.controller("links-edit-group", [ "$scope", "$modalInstance", "jotc-api.linkGroups", "group", function($scope, $self, $linkGroups, group)
	{
		$scope.action = (group.name === "" ? "New" : "Edit");
		$scope.group = JSON.parse(JSON.stringify(group));
		
		$scope.save = function()
		{
			if($scope.group.name === "")
			{
				return;
			}
			
			if($scope.group._id)
			{
				$linkGroups.group(group._id).update($scope.group, $self.dismiss);
			}
			else
			{
				$linkGroups.create($scope.group, $self.dismiss);
			}
		};
		
		$scope.cancel = $self.dismiss;
	}])
	.controller("links-edit", [ "$scope", "$modalInstance", "jotc-api.linkGroups", "group", "link", function($scope, $self, $linkGroups, group, link)
	{
		$scope.action = (link.name === "" ? "New" : "Edit");
		$scope.link = JSON.parse(JSON.stringify(link));
		
		$scope.save = function()
		{
			if($scope.link.name === "" || $scope.link.url === "")
			{
				return;
			}
			
			if($scope.link._id)
			{
				$linkGroups.group(group._id).link(link._id).update($scope.link, $self.dismiss);
			}
			else
			{
				$linkGroups.group(group._id).createLink($scope.link, $self.dismiss);
			}
		};
		
		$scope.cancel = $self.dismiss;
	}]);