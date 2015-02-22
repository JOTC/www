angular.module("jotc")
	.service("jotc-api.linkGroups", [ "$http", function($http)
	{
		var linkGroups = [ ];
		
		$http.get("/data2/links")
			.success(function(data)
			{
				Array.prototype.splice.apply(linkGroups, [0, linkGroups.length].concat(data));
			});
			
		var swapGroups = function(groupID, direction, callback)
		{
			if(direction < 0)
			{
				direction = -1;
			}
			else
			{
				direction = 1;
			}
			
			var group1 = null;
			var index1 = -1;
			var group2 = null;
			var index2 = -1;
			
			for(var i = 0; i < linkGroups.length; i++)
			{
				if(linkGroups[i]._id === groupID)
				{
					group1 = linkGroups[i];
					index1 = i;
					
					if((i + direction) >= 0 && (i + direction) < linkGroups.length)
					{
						group2 = linkGroups[i + direction];
						index2 = i + direction;
					}
					break;
				}
			}
			
			if(group1 && group2)
			{
				linkGroups[index1] = group2;
				linkGroups[index2] = group1;
				
				group1.ordering = index2;
				group2.ordering = index1;
			}
			
			if(callback)
			{
				callback();
			}
		};
		
		var swapLinks = function(groupID, linkID, direction, callback)
		{
			if(direction < 0)
			{
				direction = -1;
			}
			else
			{
				direction = 1;
			}
			
			for(var i = 0; i < linkGroups.length; i++)
			{
				if(linkGroups[i]._id == groupID)
				{
					for(var j = 0; j < linkGroups[i].links.length; j++)
					{
						if(linkGroups[i].links[j]._id == linkID)
						{
							if((j + direction) >= 0 && (j + direction) < linkGroups[i].links.length)
							{
								var tmp = linkGroups[i].links[j];
								linkGroups[i].links[j] = linkGroups[i].links[j + direction];
								linkGroups[i].links[j + direction] = tmp;
							}
							break;
						}
					}
					break;
				}
			}
			
			if(callback)
			{
				callback();
			}
		};

		var group = function(groupID)
		{
			return Object.freeze({
				up: function(callback)
				{
					$http.put("/data2/links/" + groupID + "/up")
					.success(function()
					{
						swapGroups(groupID, -1, callback);
					});
				},
				down: function(callback)
				{
					$http.put("/data2/links/" + groupID + "/down")
					.success(function()
					{
						swapGroups(groupID, 1, callback);
					});
				},
				update: function(newGroup, callback)
				{
					$http.put("/data2/links/" + groupID, newGroup)
					.success(function()
					{
						for(var i = 0; i < linkGroups.length; i++)
						{
							if(linkGroups[i]._id === groupID)
							{
								linkGroups[i].name = newGroup.name;
								break;
							}
						}
						
						if(callback)
						{
							callback();
						}
					});
				},
				delete: function(callback)
				{
					$http.delete("/data2/links/" + groupID)
					.success(function()
					{
						for(var i = 0; i < linkGroups.length; i++)
						{
							if(linkGroups[i]._id === groupID)
							{
								linkGroups.splice(i, 1);
								break;
							}
						}
						
						if(callback)
						{
							callback();
						}
					});
				},
				createLink: function(newLink, callback)
				{
					$http.post("/data2/links/" + groupID, newLink)
					.success(function(link)
					{
						for(var i = 0; i < linkGroups.length; i++)
						{
							if(linkGroups[i]._id === groupID)
							{
								linkGroups[i].links.push(link);
								break;
							}
						}

						if(callback)
						{
							callback();
						}
					});
				},
				link: function(linkID)
				{
					return Object.freeze({
						up: function(callback)
						{
							$http.put("/data2/links/" + groupID + "/" + linkID + "/up")
							.success(function()
							{
								swapLinks(groupID, linkID, -1, callback);
							});
						},
						down: function(callback)
						{
							$http.put("/data2/links/" + groupID + "/" + linkID + "/down")
							.success(function()
							{
								swapLinks(groupID, linkID, 1, callback);
							});
						},
						update: function(newLink, callback)
						{
							$http.put("/data2/links/" + groupID + "/" + linkID, newLink)
							.success(function()
							{
								for(var i = 0; i < linkGroups.length; i++)
								{
									if(linkGroups[i]._id === groupID)
									{
										for(var j = 0; j < linkGroups[i].links.length; j++)
										{
											if(linkGroups[i].links[j]._id === linkID)
											{
												linkGroups[i].links[j].name = newLink.name;
												linkGroups[i].links[j].url = newLink.url;
												break;
											}
										}
										break;
									}
								}
						
								if(callback)
								{
									callback();
								}
							});
						},
						delete: function(callback)
						{
							$http.delete("/data2/links/" + groupID + "/" + linkID)
							.success(function()
							{
								for(var i = 0; i < linkGroups.length; i++)
								{
									if(linkGroups[i]._id === groupID)
									{
										for(var j = 0; j < linkGroups[i].links.length; j++)
										{
											if(linkGroups[i].links[j]._id === linkID)
											{
												linkGroups[i].links.splice(j, 1);
												break;
											}
										}
										break;
									}
								}
								
								if(callback)
								{
									callback;
								}
							});
						}
					});
				}
			});
		};
		
		var createGroup = function(newGroup, callback)
		{
			$http.post("/data2/links", newGroup)
			.success(function(group)
			{
				linkGroups.push(group);
				if(callback)
				{
					callback();
				}
			});
		};
		
		return {
			list: linkGroups,
			group: group,
			create: createGroup
		};
	}]);
