var restify = require("restify");
var db = require("../model/db.js");
var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var log = require("bunyan").createLogger({ name: "image component", level: "debug" });
var fn = require("../common-fn.js");
var config = require("../config");

var ImageProcessor = require("./images.processor.js")();

var __FILE_PATH = config.www.getPath("galleryImages");

var isValidGallery = function(gallery) {
	var valid = false;
	if(gallery) {
		valid = true;
		valid = valid && (gallery.name && typeof gallery.name === "string");
	}

	return valid;
};

function validatePermissionsAndParameters(req, res, params) {
	if(!req.user || !req.user.permissions.pictures) {
		res.send(new restify.UnauthorizedError());
		return false;
	}
	
	return params.every(function(param) {
		if(/[0-9a-zA-Z]{24}/.test(req.params[param])) {
			 return true;
		}
		res.send(new restify.BadRequestError());
		return false;
	});
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
			"delete": fn.getModelDeleter(db.images.galleries, "galleryID", "pictures", log, function(gallery) {
				for(var i = 0; i < gallery.images.length; i++) {
					fs.unlinkSync(path.join(__FILE_PATH, gallery.images[i].path));
				}
			})
		},
		"/galleries/:galleryID/image": {
			"post": {
				options: {
					useBodyParser: false
				},
				function: function(req, res, next) {
					
					if(!validatePermissionsAndParameters(req, res, [ "galleryID" ])) {
						return next();
					}

					db.images.galleries.findOne({ _id: req.params.galleryID }).exec(function(err, gallery) {
						if(err) {
							log.error(err);
							return next(new restify.InternalServerError());
						}
						
						if(!gallery) {
							return next(new restify.NotFoundError());
						}

						var img = new db.images.images();

						var ext = req.headers["content-type"].replace(/image\//, "");
						img.path = img._id + "." + ext;

						var filePath = path.join(__FILE_PATH, "temp");
						if(!fs.existsSync(filePath)) {
							mkdirp.sync(filePath);
						}
						filePath = path.join(filePath, img.path);
						var out = fs.createWriteStream(filePath);
						req.pipe(out);

						req.once("end", function() {
							if(err) {
								log.error(err);
								res.send(new restify.InternalServerError());
							} else {
								ImageProcessor.process(filePath, path.join(__FILE_PATH, img.path), function(err) {
									fs.unlink(filePath);

									if(err) {
										log.error(err);
										res.send(new restify.InternalServerError());
									} else {
										gallery.images.push(img);
										gallery.save(function(err) {
											if(err) {
												log.error(err);
												res.send(new restify.InternalServerError());
											} else {
												res.send(200, img);
											}
										});
									}
								});
							}
						});

						next();
					});
				}
			}
		},
		"/galleries/:galleryID/image/:imageID": {
			"put": function(req, res, next) {
				if(!validatePermissionsAndParameters(req, res, [ "galleryID", "imageID" ])) {
					return next();
				}

				var image = req.body;
				if(image && typeof image === 'object' && typeof image.description === 'string') {
					image = { description: image.description };

					db.images.galleries.findOne({ _id: req.params.galleryID }).exec(function(err, gallery) {
						if(err) {
							log.error(err);
							res.send(new restify.InternalServerError());
							return;
						}
						
						if(!gallery) {
							res.send(new restify.NotFoundError());
							return;
						}

						var foundImage = false;
						for(var i = 0; i < gallery.images.length; i++) {
							if(gallery.images[i]._id.toString() === req.params.imageID) {
								gallery.images[i].name = image.name;
								gallery.images[i].description = image.description;
								foundImage = true;
								break;
							}
						}
						
						if(!foundImage) {
							res.send(new restify.NotFoundError());
							return;
						}

						gallery.save(function(err) {
							if(err) {
								log.error(err);
								res.send(new restify.InternalServerError());
							} else {
								res.send(200, { });
							}
						});
					});
				}
				else
				{
					log.error("Invalid image object");
					log.error(image);
					res.send(new restify.BadRequestError());
				}
				next();
			},
			"delete": function(req, res, next) {
				if(!validatePermissionsAndParameters(req, res, [ "galleryID", "imageID" ])) {
					return next();
				}

				db.images.galleries.findOne({ _id: req.params.galleryID }).exec(function(err, gallery) {
					if(err) {
						log.error(err);
						res.send(new restify.InternalServerError());
						return;
					}
					
					if(!gallery) {
						res.send(new restify.NotFoundError());
						return;
					}

					var imageFound = false;
					for(var i = 0; i < gallery.images.length; i++) {
						if(gallery.images[i]._id.toString() === req.params.imageID) {
							fs.unlinkSync(path.join(__FILE_PATH, gallery.images[i].path));
							gallery.images.splice(i, 1);
							imageFound = true;
							break;
						}
					}
					if(!imageFound) {
						res.send(new restify.NotFoundError());
						return;
					}

					gallery.save(function(err) {
						if(err) {
							log.error(err);
							res.send(new restify.InternalServerError());
						} else {
							res.send(200, { });
						}
					});
				});
				next();
			}
		}
	}
};
