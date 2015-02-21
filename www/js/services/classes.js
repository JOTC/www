angular.module("jotc")
	.service("jotc-api.classes", [ "$http", function($http)
	{
		var classes = [ ];
		var classTypes = [ ];
	
		$http.get("/data2/classes")
			.success(function(data)
			{
				Array.prototype.splice.apply(classes, [0, classes.length].concat(data));
			});
		$http.get("/data2/classes/types")
			.success(function(data)
			{
				Array.prototype.splice.apply(classTypes, [0, classTypes.length].concat(data));
			});
			
		return {
			list: classes,
			classTypes: classTypes
		};
	}]);
