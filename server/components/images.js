var restify = require("restify");
var db = require("../model/db.js");
var fs = require("fs");
var fn = require("../common-fn.js");
var log = require("bunyan").createLogger({ name: "image component", level: "debug" });
var config = require("../config");

var imageMagick = require("gm").subClass({ imageMagick: true });

var __FILE_PATH = config.www.getPath("galleryImages");
log.info(__FILE_PATH);

var isValidGallery = function(gallery)
{
	var valid = false;
	if(gallery)
	{
		valid = true;
		valid = valid && (gallery.name && typeof gallery.name === "string");
	}
	
	return valid;
};

module.exports = {
	name: "images",
	paths: {
		"/galleries": {
			"get": fn.getModelLister(db.images.galleries, log),
			"post": fn.getModelCreator(db.images.galleries, "pictures", log, isValidGallery)
		},
		"/galleries/:galleryID": {
			"put": fn.getModelUpdater(db.images.galleries, "galleryID", "pictures", log, isValidGallery),
			"delete": fn.getModelDeleter(db.images.galleries, "galleryID", "pictures", log, function(gallery)
			{
				for(var i = 0; i < gallery.images.length; i++)
				{
					fs.unlinkSync(path.join(__FILE_PATH, gallery.images[i]._id.valueOf() + gallery.images[i].path.replace(/.*\.(png|jpg|jpeg|gif)/g, ".$1")));
				}
			})
		},
		"/galleries/:galleryID/image": {
			"post": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.pictures)
				{
					return next(new restify.UnauthorizedError());
				}
				
				db.images.galleries.findOne({ _id: req.params.galleryID }).exec(function(err, gallery)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
						next();
						return;
					}
					
					var img = new db.images.images();

					var ext = req.files.file.name.replace(/.*\.(jpg|jpeg|png|gif)$/, ".$1");				
					img.path = img._id + ext;
					
					imageMagick(req.files.file.path).resize(1024, 1024, ">").write(path.join(__FILE_PATH, img.path), function(err)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
							next();
						}
						else
						{							
							gallery.images.push(img);
							gallery.save(function(err)
							{
								if(err)
								{
									log.error(err);
									res.send(500);
								}
								else
								{
									res.send(img);
								}
								next();
							});
						}
					});					
				});
			}
		},
		"/galleries/:galleryID/image/:imageID": {
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.pictures)
				{
					return next(new restify.UnauthorizedError());
				}
				
				var image = req.body;
				if(image && typeof image === 'object' && typeof image.description === 'string')
				{
					image = { description: image.description };
					
					db.images.galleries.findOne({ _id: req.params.galleryID }).exec(function(err, gallery)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
							return;
						}
					
						for(var i = 0; i < gallery.images.length; i++)
						{
							if(gallery.images[i]._id.toString() === req.params.imageID)
							{
								gallery.images[i].name = image.name;
								gallery.images[i].description = image.description;
								break;
							}
						}
					
						gallery.save(function(err)
						{
							if(err)
							{
								log.error(err);
								res.send(500);
							}
							else
							{
								res.send(200);
							}
						});
					});
				}
				else
				{
					log.error("Invalid image object");
					log.error(image);
					res.send(400);
				}
				next();
			},
			"delete": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.pictures)
				{
					return next(new restify.UnauthorizedError());
				}
				
				db.images.galleries.findOne({ _id: req.params.galleryID }).exec(function(err, gallery)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
						return;
					}
					
					for(var i = 0; i < gallery.images.length; i++)
					{
						if(gallery.images[i]._id.toString() === req.params.imageID)
						{
							fs.unlinkSync(path.join(__FILE_PATH, gallery.images[i]._id.valueOf() + gallery.images[i].path.replace(/.*\.(png|jpg|jpeg|gif)/g, ".$1")));
							gallery.images.splice(i, 1);
							break;
						}
					}
					
					gallery.save(function(err)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else
						{
							res.send(200);
						}
					});
				});
				next();
			}
		}
	}
};