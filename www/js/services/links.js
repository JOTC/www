angular.module("jotc")
	.service("jotc-api.links", [ "$http", function($http)
	{
		var links = [ ];
		
		$http.get("old/data/links.php")
			.success(function(data)
			{
				if(data.success)
				{
					Array.prototype.splice.apply(links, [0, links.length].concat(data.groups));
				}
			});
		
		return {
			list: links
		};
	}]);
