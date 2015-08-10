angular.module("jotc")
	.service("jotc-api.pictures", [ "$http", function($http)
	{
		var galleries = [ ];
	
		$http.get("/data2/galleries")
		.success(function(data)
		{
			Array.prototype.splice.apply(galleries, [0, galleries.length].concat(data));
		});
	
		var gallery = function(galleryID)
		{
			return Object.freeze({
				update: function(newGallery, callback)
				{
					$http.put("/data2/galleries/" + galleryID, newGallery)
					.success(function()
					{
						for(var i = 0; i < galleries.length; i++)
						{
							if(galleries[i]._id === galleryID)
							{
								galleries[i].name = newGallery.name;
								galleries[i].description = newGallery.description;
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
					$http.delete("/data2/galleries/" + galleryID)
					.success(function()
					{
						for(var i = 0; i < galleries.length; i++)
						{
							if(galleries[i]._id === galleryID)
							{
								galleries.splice(i, 1);
								break;
							}
						}
						if(callback)
						{
							callback();
						}
					});
				},
			
				image: function(imageID)
				{
					return Object.freeze({
						update: function(newImage, callback)
						{
							$http.put("/data2/galleries/" + galleryID + "/image/" + imageID, newImage)
							.success(function()
							{
								if(callback)
								{
									callback();
								}
							});
						},
						delete: function(callback)
						{
							$http.delete("/data2/galleries/" + galleryID + "/image/" + imageID)
							.success(function()
							{
								for(var i = 0; i < galleries.length; i++)
								{
									if(galleries[i]._id === galleryID)
									{
										for(var j = 0; j < galleries[i].images.length; j++)
										{
											if(galleries[i].images[j]._id === imageID)
											{
												galleries[i].images.splice(j, 1);
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
						}
					});
				}
			});
		};
	
		var createGallery = function(gallery, callback)
		{
			$http.post("/data2/galleries", gallery)
			.success(function(gallery)
			{
				galleries.push(gallery);
				if(callback)
				{
					callback();
				}
			});
		};
	
		return {
			list: galleries,
			gallery: gallery,
			create: createGallery
		};
	}]);
