angular.module("jotc")
	.service("jotc-api.officers", [ "$http", function($http)
	{
		var officers = [ ];
		
		$http.get("old/data/officers.php")
			.success(function(data)
			{
				if(data.success)
				{
					Array.prototype.splice.apply(officers, [0, officers.length].concat(data.officers));
				}
			});
		
		return {
			list: officers
		};
	}]);
