angular.module("jotc")
	.service("jotc-api.officers", [ "$http", function($http)
	{
		var officers = [ ];
		
		$http.get("/data2/officers")
			.success(function(data)
			{
				Array.prototype.splice.apply(officers, [0, officers.length].concat(data));
			});
			
		var officer = function(officerID)
		{
			return Object.freeze({
				update: function(newOfficer, callback)
				{
					$http.put("/data2/officers/" + officerID, newOfficer)
					.success(function()
					{
						for(var i = 0; i < officers.length; i++)
						{
							if(officers[i]._id === officerID)
							{
								officers[i] = newOfficer;
								officers[i]._id = officerID;
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
					$http.delete("/data2/officers/" + officerID)
					.success(function()
					{
						for(var i = 0; i < officers.length; i++)
						{
							if(officers[i]._id === officerID)
							{
								officers.splice(i, 1);
								break;
							}
						}
						
						if(callback)
						{
							callback();
						}
					});
				}
			});
		};
		
		var create = function(newOfficer, callback)
		{
			$http.post("/data2/officers", newOfficer)
			.success(function(officer)
			{
				officers.push(officer);
				if(callback)
				{
					callback();
				}
			});
		};
		
		return {
			list: officers,
			officer: officer,
			create: create
		};
	}]);
