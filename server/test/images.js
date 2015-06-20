var should = require("should");
var request = require("request");

request.delete = request.del;

var createdGalleryID;
function getCreatedGalleryID() {
	return createdGalleryID;
};

var createdImageID;
function getCreatedImageID() {
	return createdImageID;
};

var lib = require("./lib");
lib.init();

describe("Images API", function() {
	describe("Create a gallery", function() {
		describe("Unauthenticated", lib.statusAndJSON("post", "/galleries", null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("post", "/galleries", lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With no gallery", lib.statusAndJSON("post", "/galleries", lib.getCookie(true), null, 400));
			describe("With an empty object", lib.statusAndJSON("post", "/galleries", lib.getCookie(true), { }, 400));
			describe("With a non-string name", lib.statusAndJSON("post", "/galleries", lib.getCookie(true), { name: 7 }, 400));
			describe("With a valid gallery object", lib.statusAndJSON("post", "/galleries", lib.getCookie(true), { name: "Test Gallery" }, 200, function(response, body) {
				describe("returns a valid gallery object", function() {
					it("has an _id", function() {
						body()._id.should.match(/[0-9a-zA-Z]{24}/);
						createdGalleryID = body()._id;
					});
					it("has a name", function() {
						body().name.should.be.a.string;
						body().name.should.be.ok;
					});
					it("should have a created date", function() {
						body().created.should.be.a.string;
						Date.parse(body().created).should.not.be.NaN;
					});
					it("should have an empty images array", function() {
						body().images.should.be.instanceOf(Array);
						body().images.length.should.be.exactly(0);
					});
				});
			}));
		});
	});

	describe("Edit a gallery", function() {
		var urlFn = function() {
			return "/galleries/" + getCreatedGalleryID();
		};
		
		describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With an invalid gallery ID", lib.statusAndJSON("put", "/galleries/abcd1234", lib.getCookie(true), { name: "Test Gallery Rename" }, 400));
			describe("With a valid but fake gallery ID", lib.statusAndJSON("put", "/galleries/abcd1234abcd1234abcd1234", lib.getCookie(true), { name: "Test Gallery Rename" }, 404));
			describe("With a valid and real gallery ID", function() {
				describe("With no gallery", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
				describe("With an empty object", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
				describe("With a non-string name", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 7 }, 400));
				describe("With a valid gallery object", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test Gallery Rename" }, 200));
			});
		});
	});
	
	describe("Post a picture", function() {
		var urlFn = function() {
			return "/galleries/" + getCreatedGalleryID() + "/image";
		};
		
		describe("Unauthenticated", lib.statusAndJSON("post", urlFn, null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("post", urlFn, lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With an invalid gallery ID", lib.statusAndJSON("post", "/galleries/abcd1234/image", lib.getCookie(true), null, 400));
			describe("With a valid but fake gallery ID", lib.statusAndJSON("post", "/galleries/abcd1234abcd1234abcd1234/image", lib.getCookie(true), null, 404));
			describe("With a valid and real gallery ID", function() {

				var _response;
				var _body;
				
				before(function(done) {
					require("fs").createReadStream("./test/test.jpeg")
						.pipe(request.post({ url: lib.getFullURL(urlFn()), headers: { Cookie: lib.getCookie(true)() } }, function(err, res, body) {
							_response = res;
							_body = body;
							done();
						}));
				});
				
				it("should return a 200 status code", function() {
					_response.statusCode.should.be.exactly(200);
				});
		
				it("should return a JSON content-type", function() {
					_response.headers["content-type"].toLowerCase().should.be.exactly("application/json");
					_body = JSON.parse(_body);
				});
				
				describe("should return a valid image object", function() {
					it("has an _id", function() {
						_body._id.should.match(/[0-9a-zA-Z]{24}/);
						createdImageID = _body._id;
					});
					
					it("has an added date", function() {
						_body.added.should.be.a.string;
						Date.parse(_body.added).should.not.be.NaN;
					});
					
					it("has a path", function() {
						_body.path.should.be.a.string;
						_body.path.should.be.ok;
					})
				});
			});
		});
	});
	
	describe("Edit a picture", function() {
		var urlFn = function() {
			return "/galleries/" + getCreatedGalleryID() + "/image/" + getCreatedImageID();
		};
		
		describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With invalid gallery ID and invalid picture ID", lib.statusAndJSON("put", "/galleries/abcd1234/image/abcd1234", lib.getCookie(true), { description: "Edited" }, 400));
			describe("With invalid gallery ID and valid but fake picture ID", lib.statusAndJSON("put", "/galleries/abcd1234/image/abcd1234abcd1234abcd1234", lib.getCookie(true), { description: "Edited" }, 400));
			describe("With valid but fake gallery ID and invalid picture ID", lib.statusAndJSON("put", "/galleries/abcd1234abcd1234abcd1234/image/abcd1234", lib.getCookie(true), { description: "Edited" }, 400));
			describe("With valid but fake gallery ID and valid but fake picture ID", lib.statusAndJSON("put", "/galleries/abcd1234abcd1234abcd1234/image/abcd1234abcd1234abcd1234", lib.getCookie(true), { description: "Edited" }, 404));
			describe("With valid gallery ID and picture ID", function() {
				describe("With no image metadata", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
				describe("With empty image metadata", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
				describe("With valid image metadata", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { description: "Edited image" }, 200));
			});
		});
	});
	
	describe("Get a list of galleries", lib.statusAndJSON("get", "/galleries", null, null, 200, function(response, body) {
		it("returns an array", function() {
			body().should.be.instanceOf(Array);
			body().length.should.be.above(0);
		});
		
		describe("returns valid gallery objects", function() {
			it("each has an _id", function() {
				body().forEach(function(gallery) {
					gallery._id.should.match(/[0-9a-zA-Z]{24}/);
				});
			});

			it("each has a name", function() {
				body().forEach(function(gallery) {
					gallery.name.should.be.a.string;
					gallery.name.should.be.ok;
				});
			});
			
			it("each has a created date", function() {
				body().forEach(function(gallery) {
					gallery.created.should.be.a.string;
					Date.parse(gallery.created).should.not.be.NaN;
				});
			});
			
			it("each has an images array", function() {
				body().forEach(function(gallery) {
					gallery.images.should.be.instanceOf(Array);
				});
			});
			
			describe("each image is valid", function() {
				it("each has an _id", function() {
					body().forEach(function(gallery) {
						gallery.images.forEach(function(image) {
							image._id.should.match(/[0-9a-zA-Z]{24}/);
						});
					});
				});

				it("each has an added date", function() {
					body().forEach(function(gallery) {
						gallery.images.forEach(function(image) {
							image.added.should.be.ok;
							Date.parse(image.added).should.not.be.NaN;
						});
					});
				});

				it("each has a path", function() {
					body().forEach(function(gallery) {
						gallery.images.forEach(function(image) {
							image.path.should.be.a.string;
							image.path.should.be.ok;
						});
					});
				});
			});
		});
	}));
	
	describe("Delete a picture", function() {
		var urlFn = function() {
			return specialUrlFn(getCreatedGalleryID, getCreatedImageID)();
		};
		
		var specialUrlFn = function(galleryID, imageID) {			
			return function() {
				if(typeof galleryID === "function") {
					galleryID = galleryID();
				}
				if(typeof imageID === "function") {
					imageID = imageID();
				}

				return "/galleries/" + galleryID + "/image/" + imageID;
			};
		};
		
		describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With invalid gallery ID and invalid picture ID", lib.statusAndJSON("delete", "/galleries/abcd1234/image/abcd1234", lib.getCookie(true), null, 400));
			describe("With invalid gallery ID and valid but fake picture ID", lib.statusAndJSON("delete", "/galleries/abcd1234/image/abcd1234abcd1234abcd1234", lib.getCookie(true), null, 400));
			describe("With valid but fake gallery ID and invalid picture ID", lib.statusAndJSON("delete", "/galleries/abcd1234abcd1234abcd1234/image/abcd1234", lib.getCookie(true), null, 400));
			describe("With valid but fake gallery ID and valid but fake picture ID", lib.statusAndJSON("delete", "/galleries/abcd1234abcd1234abcd1234/image/abcd1234abcd1234abcd1234", lib.getCookie(true), null, 404));
			describe("With real gallery ID and valid but fake picture ID", lib.statusAndJSON("delete", specialUrlFn(getCreatedGalleryID, "abcd1234abcd1234abcd1234"), lib.getCookie(true), null, 404));
			describe("With valid gallery ID and picture ID", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 200));
		});	
	});
	
	describe("Delete a gallery", function() {
		var urlFn = function() {
			return "/galleries/" + getCreatedGalleryID();
		};
		
		// For the sake of coverage, upload another
		// picture before deleting the gallery.
		before(function(done) {
			require("fs").createReadStream("./test/test.jpeg")
				.pipe(request.post({ url: lib.getFullURL(urlFn()), headers: { Cookie: lib.getCookie(true)() } }, function() {
					done();
				}));
		});
		
		describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With an invalid gallery ID", lib.statusAndJSON("delete", "/galleries/abcd1234", lib.getCookie(true), null, 400));
			describe("With a valid but fake gallery ID", lib.statusAndJSON("delete", "/galleries/abcd1234abcd1234abcd1234", lib.getCookie(true), null, 404));
			describe("With a valid and real gallery ID", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 200));
		});		
	});
});