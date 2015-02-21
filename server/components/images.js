var restify = require("restify");

var db = require("../model/db.js");
var fs = require("fs");
var log = require("bunyan").createLogger({ name: "image component", level: "debug" });

var imageMagick = require("gm").subClass({ imageMagick: true });

//process.env.TMPDIR = '/vagrant/server/tmp_upload'
var __SAVE_PATH = "/vagrant/www/galleryImages/";

module.exports = {
	name: "images",
	paths: {
		"/galleries": {
			"get": function(req, res, next)
			{
				db.images.galleries.find().exec(function(err, galleries)
				{
					if(err)
					{
						log.error(err);
						res.send(500);
					}
					else
					{
						res.send(galleries);
					}
				});
				next();
			},
			"post": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.pictures)
				{
					return next(new restify.UnauthorizedError());
				}
				
				var gallery = req.body;
				if(gallery && typeof gallery === 'object' && gallery.name && typeof gallery.name === 'string')
				{
					gallery = new db.images.galleries(gallery);
					gallery.save(function(err)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else
						{
							res.send(gallery);
						}
					});
				}
				else
				{
					log.error("Invalid gallery object");
					log.error(gallery);
					res.send(400);
				}
				
				next();
			}
		},
		"/galleries/:galleryID": {
			"put": function(req, res, next)
			{
				if(!req.user || !req.user.permissions.pictures)
				{
					return next(new restify.UnauthorizedError());
				}
				
				var gallery = req.body;
				if(gallery && typeof gallery === 'object' && gallery.name && typeof gallery.name === 'string' && typeof gallery.description === 'string')
				{
					gallery = { name: gallery.name, description: gallery.description };
					
					db.images.galleries.update({ _id: req.params.galleryID }, gallery, { upsert: true }).exec(function(err)
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
				}
				else
				{
					log.error("Invalid gallery object");
					log.error(gallery);
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

					db.images.galleries.remove({ _id: req.params.galleryID }).exec(function(err)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
						}
						else
						{
							for(var i = 0; i < gallery.images.length; i++)
							{
								fs.unlinkSync(__SAVE_PATH + gallery.images[i]._id + gallery.images[i].path.replace(/.*\.(png|jpg|jpeg|gif)/g, ".$1"));
							}
							
							res.send(200);
						}
					});
				});
				
				next();
			}
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
						return;
					}
					
					var img = new db.images.images();

					var ext = req.files.file.name.replace(/.*\.(jpg|jpeg|png|gif)$/, ".$1");				
					img.path = img._id + ext;
					
					imageMagick(req.files.file.path).resize(1024, 1024, ">").write(__SAVE_PATH + img.path, function(err)
					{
						if(err)
						{
							log.error(err);
							res.send(500);
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
							});
						}
					});					
				});
				next();
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
							fs.unlinkSync(__SAVE_PATH + gallery.images[i]._id + gallery.images[i].path.replace(/.*\.(png|jpg|jpeg|gif)/g, ".$1"));
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