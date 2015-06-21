var should = require("should");
var request = require("request");

request.delete = request.del;

var createdShowID;
function getCreatedShowID() {
	return createdShowID;
}

var createdShowFileID;
function getCreatedShowFileID() {
	return createdShowFileID;
}

var createdRecurringShowID;
function getCreatedRecurringShowID() {
	return createdRecurringShowID;
}

var lib = require("./lib");
lib.init();

var validShow = {
	title: "Test Show",
	location: "A place",
	startDate: new Date(),
	endDate: new Date((new Date()).valueOf() + 259200000),
	registrationDeadline: new Date(),
	classes: [ "Class 1" ],
	clone: function(obj) {
		var clone = JSON.parse(JSON.stringify(this));
		Object.keys(obj).forEach(function(p) {
			clone[p] = obj[p];
		});
		return clone;
	}
};

var invalidShows = [
	{ name: "With no show", value: null },
	{ name: "With an empty show", value: { } },
	{ name: "With a non-string title", value: validShow.clone({ title: 3 }) },
	{ name: "With a non-string location", value: validShow.clone({ location: 3 }) },
	{ name: "With a non-date start date", value: validShow.clone({ startDate: "Bob" })},
	{ name: "With a non-date end date", value: validShow.clone({ endDate: "Bob" })},
	{ name: "With a non-date registration date", value: validShow.clone({ registrationDeadline: "Bob" })},
	{ name: "With a non-array classes", value: validShow.clone({ classes: 3 })}
];

var validRecurringShow = {
	description: "About",
	categories: [
		{
			name: "Category 1",
			classes: [ "About 1" ]
		}
	]
};

var invalidRecurringShows = [
	{ name: "With no show", value: null },
	{ name: "With an empty show", value: { } },
	{ name: "With a non-string description", value: { description: 5, categories: [ ] }},
	{ name: "With a non-array categories", value: { description: "About", categories: 7 }},
	{ name: "With a non-string category name", value: { description: "About", categories: [ { name: 7, classes: [ ] }]}},
	{ name: "With a non-array category classes", value: { description: "About", categories: [ { name: 7, classes: 7 }]}},
	{ name: "With a non-string category class", value: { description: "About", categories: [ { name: 7, classes: [ 7 ] }]}},
];


describe("Shows API", function() {
	
	describe("Create show", function() {
		describe("Unauthenticated", lib.statusAndJSON("post", "/shows", null, validShow, 401));
		describe("Valid user without permission", lib.statusAndJSON("post", "/shows", lib.getCookie(false), validShow, 401));
		describe("Valid user with permission", function() {
			invalidShows.forEach(function(show) {
				describe(show.name, lib.statusAndJSON("post", "/shows", lib.getCookie(true), show.value, 400));
			});
			describe("With a valid show", lib.statusAndJSON("post", "/shows", lib.getCookie(true), validShow, 200, function(response, body) {
				describe("returns a valid show", function() {
					it("has an _id", function() {
						body()._id.should.match(/[0-9a-zA-Z]{24}/);
						createdShowID = body()._id;
					});
					
					it("has a title", function() {
						body().title.should.be.a.string;
						body().title.should.be.ok;
					});
					
					it("has a location", function() {
						body().location.should.be.a.string;
						body().location.should.be.ok;
					});
					
					it("has a start date", function() {
						body().startDate.should.be.a.string;
						Date.parse(body().startDate).should.not.be.NaN;
					});
					
					it("has an end date", function() {
						body().endDate.should.be.a.string;
						Date.parse(body().endDate).should.not.be.NaN;
					});
					
					it("has a registration deadline", function() {
						body().registrationDeadline.should.be.a.string;
						Date.parse(body().registrationDeadline).should.not.be.NaN;
					});
					
					it("has a classes array", function() {
						body().classes.should.be.instanceOf(Array);
					});
				});
			}));
		});
	});

	describe("Edit show", function() {
		var urlFn = function() {
			return "/shows/" + getCreatedShowID();
		};
		
		describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, validShow, 401));
		describe("Valid user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), validShow, 401));
		describe("Valid user with permission", function() {
			describe("With an invalid show ID", lib.statusAndJSON("put", "/shows/abcd1234", lib.getCookie(true), validShow, 400));
			describe("With a valid but fake show ID", lib.statusAndJSON("put", "/shows/abcd1234abcd1234abcd1234", lib.getCookie(true), validShow, 404));
			describe("With a valid and real show ID", function() {
				invalidShows.forEach(function(show) {
					describe(show.name, lib.statusAndJSON("put", urlFn, lib.getCookie(true), show.value, 400));
				});
				describe("With a valid show", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validShow, 200));
			});
		});
	});
	
	describe("Upload show file", function() {
		var urlFn = function() {
			return "/shows/" + getCreatedShowID() + "/file?name=Test%20File";
		};
		
		describe("Unauthenticated", lib.statusAndJSON("post", urlFn, null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("post", urlFn, lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With an invalid show ID", lib.statusAndJSON("post", "/shows/abcd1234/file?name=Test%20File", lib.getCookie(true), null, 400));
			describe("With a valid but fake show ID", lib.statusAndJSON("post", "/shows/abcd1234abcd1234abcd1234/file?name=Test%20File", lib.getCookie(true), null, 404));
			describe("With a valid and real show ID but no name", lib.statusAndJSON("post", function() { return urlFn().replace(/\?name=.*/, ""); }, lib.getCookie(true), null, 400));
			describe("With a valid and real show ID and valid name", function() {
				var _response;
				var _body;
				
				before(function(done) {
					var formData = {
						file: require("fs").createReadStream("./test/test.pdf")
					};
					
					request.post({ url: lib.getFullURL(urlFn()), headers: { Cookie: lib.getCookie(true)() }, formData: formData }, function(err, res, body) {
						_response = res;
						_body = JSON.parse(body);
						done();
					});
				});
				
				it("should return a 200 status code", function() {
					_response.statusCode.should.be.exactly(200);
				});
		
				it("should return a JSON content-type", function() {
					_response.headers["content-type"].toLowerCase().should.be.exactly("application/json");
				});
				
				describe("returns a valid show", function() {
					it("has an _id", function() {
						_body._id.should.match(/[0-9a-zA-Z]{24}/);
					});
					
					it("has a title", function() {
						_body.title.should.be.a.string;
						_body.title.should.be.ok;
					});
					
					it("has a location", function() {
						_body.location.should.be.a.string;
						_body.location.should.be.ok;
					});
					
					it("has a start date", function() {
						_body.startDate.should.be.a.string;
						Date.parse(_body.startDate).should.not.be.NaN;
					});
					
					it("has an end date", function() {
						_body.endDate.should.be.a.string;
						Date.parse(_body.endDate).should.not.be.NaN;
					});
					
					it("has a registration deadline", function() {
						_body.registrationDeadline.should.be.a.string;
						Date.parse(_body.registrationDeadline).should.not.be.NaN;
					});
					
					it("has a classes array", function() {
						_body.classes.should.be.instanceOf(Array);
					});
					
					it("has a files array", function() {
						_body.files.should.be.instanceOf(Array);
					});
					
					describe("with valid files", function() {
						it("each file has an _id", function() {
							_body.files.forEach(function(file) {
								file._id.should.match(/[0-9a-zA-Z]{24}/);
								createdShowFileID = file._id;
							});
						});
						
						it("each file has a name", function() {
							_body.files.forEach(function(file) {
								file.name.should.be.a.string;
								file.name.should.be.ok;
							});
						});

						it("each file has a path", function() {
							_body.files.forEach(function(file) {
								file.path.should.be.a.string;
								file.path.should.be.ok;
							});
						});
					});
				});
			});
		});
	});
	
	describe("List shows", lib.statusAndJSON("get", "/shows", null, null, 200, function(response, body) {
		it("returns an object with past and upcoming arrays", function() {
			body().should.be.an.object;
			body().past.should.be.instanceOf(Array);
			body().upcoming.should.be.instanceOf(Array);
		});
		
		describe("each is a valid show", function() {
			it("each has an _id", function() {
				body().past.forEach(function(show) {
					show._id.should.match(/[0-9a-zA-Z]{24}/);
				});
				body().upcoming.forEach(function(show) {
					show._id.should.match(/[0-9a-zA-Z]{24}/);
				});
			});
			
			it("each has a title", function() {
				body().past.forEach(function(show) {
					show.title.should.be.a.string;
					show.title.should.be.ok;
				});
				body().upcoming.forEach(function(show) {
					show.title.should.be.a.string;
					show.title.should.be.ok;
				});
			});
			
			it("each has a description", function() {
				body().past.forEach(function(show) {
					if(show.description) {
						show.description.should.be.a.string;
					}
				});
				body().upcoming.forEach(function(show) {
					if(show.description) {
						show.description.should.be.a.string;
					}
				});
			});

			it("each has a start date", function() {
				body().past.forEach(function(show) {
					show.startDate.should.be.a.string;
					Date.parse(show.startDate).should.not.be.NaN;
				});
				body().upcoming.forEach(function(show) {
					show.startDate.should.be.a.string;
					Date.parse(show.startDate).should.not.be.NaN;
				});
			});

			it("each has a end date", function() {
				body().past.forEach(function(show) {
					show.endDate.should.be.a.string;
					Date.parse(show.endDate).should.not.be.NaN;
				});
				body().upcoming.forEach(function(show) {
					show.endDate.should.be.a.string;
					Date.parse(show.endDate).should.not.be.NaN;
				});
			});

			it("each has a registration end date", function() {
				body().past.forEach(function(show) {
					show.registrationDeadline.should.be.a.string;
					Date.parse(show.registrationDeadline).should.not.be.NaN;
				});
				body().upcoming.forEach(function(show) {
					show.registrationDeadline.should.be.a.string;
					Date.parse(show.registrationDeadline).should.not.be.NaN;
				});
			});
			
			describe("each has a list of files", function() {
				it("each has a name", function() {
					body().past.forEach(function(show) {
						show.files.forEach(function(file) {
							file.name.should.be.a.string;
							file.name.should.be.ok;
						});
					});
					body().upcoming.forEach(function(show) {
						show.files.forEach(function(file) {
							file.name.should.be.a.string;
							file.name.should.be.ok;
						});
					});
				});
				
				it("each has a path", function() {
					body().past.forEach(function(show) {
						show.files.forEach(function(file) {
							file.path.should.be.a.string;
							file.path.should.be.ok;
						});
					});
					body().upcoming.forEach(function(show) {
						show.files.forEach(function(file) {
							file.path.should.be.a.string;
							file.path.should.be.ok;
						});
					});
				});
			});

			describe("each has a list of classes", function() {
				it("is an array of strings", function() {
					body().past.forEach(function(show) {
						show.classes.should.be.instanceOf(Array);
						show.classes.forEach(function(c) {
							c.should.be.a.string;
							c.should.be.ok;
						});
					});
					body().upcoming.forEach(function(show) {
						show.classes.should.be.instanceOf(Array);
						show.classes.forEach(function(c) {
							c.should.be.a.string;
							c.should.be.ok;
						});
					});
				});
			});
		});
	}));

	describe("Delete show file", function() {
		var urlFn = function() {
			return "/shows/" + getCreatedShowID() + "/file/" + getCreatedShowFileID();
		};
		
		describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With an invalid show ID and invalid file ID", lib.statusAndJSON("delete", "/shows/abcd1234/file/abcd1234", lib.getCookie(true), null, 400));
			describe("With an invalid show ID and a valid but fake file ID", lib.statusAndJSON("delete", "/shows/abcd1234/file/abcd1234abcd1234abcd1234", lib.getCookie(true), null, 400));
			describe("With a valid but fake show ID and an invalid file ID", lib.statusAndJSON("delete", "/shows/abcd1234abcd1234abcd1234/file/abcd1234", lib.getCookie(true), null, 400));
			describe("With valid but fake show and file IDs", lib.statusAndJSON("delete", "/shows/abcd1234abcd1234abcd1234/file/abcd1234abcd1234abcd1234", lib.getCookie(true), null, 404));
			describe("With valid and real show ID and valid but fake file ID", lib.statusAndJSON("delete", function() { return "/shows/" + getCreatedShowID() + "/file/abcd1234abcd1234abcd1234"; }, lib.getCookie(true), null, 404, function(response, body) {
				it("thing", function() { console.log(body()); });
			}));
			describe("With valid and real show and file IDs", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 200));
		});
	});
	
	describe("Delete show", function() {
		var urlFn = function() {
			return "/shows/" + getCreatedShowID();
		};

		// Upload a file so we get test coverage of the
		// show file cleanup code		
		before(function(done) {
			var formData = {
				file: require("fs").createReadStream("./test/test.pdf")
			};
			
			request.post({ url: lib.getFullURL("/shows/" + getCreatedShowID() + "/file?name=Delete"), headers: { Cookie: lib.getCookie(true)() }, formData: formData }, done);
		});
		
		describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With an invalid show ID", lib.statusAndJSON("delete", "/shows/abcd1234", lib.getCookie(true), null, 400));
			describe("With a valid but fake show ID", lib.statusAndJSON("delete", "/shows/abcd1234abcd1234abcd1234", lib.getCookie(true), null, 404));
			describe("With a valid and real show ID", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 200));
		});
	});
	
	describe("Create recurring show", function() {		
		describe("Unauthenticated", lib.statusAndJSON("post", "/shows/recurring", null, validRecurringShow, 401));
		describe("Valid user without permission", lib.statusAndJSON("post", "/shows/recurring", lib.getCookie(false), validRecurringShow, 401));
		describe("Valid user with permission", function() {
			invalidRecurringShows.forEach(function(show) {
				describe(show.name, lib.statusAndJSON("post", "/shows/recurring", lib.getCookie(true), show.value, 400));
			});
			describe("Valid recurring show", lib.statusAndJSON("post", "/shows/recurring", lib.getCookie(true), validRecurringShow, 200, function(response, body) {
				describe("Returns a valid recurring show", function() {
					it("has an _id", function() {
						body()._id.should.match(/[0-9a-zA-Z]{24}/);
						createdRecurringShowID = body()._id;
					});
					
					it("has a description", function() {
						body().description.should.be.a.string;
						body().description.should.be.ok;
					});
					
					it("has categories", function() {
						body().categories.should.be.instanceOf(Array);
					});
					
					describe("each category is valid", function() {
						it("each has a name", function() {
							body().categories.forEach(function(category) {
								category.name.should.be.a.string;
								category.name.should.be.ok;
							});
						});
						
						it("each has classes", function() {
							body().categories.forEach(function(category) {
								category.classes.should.be.instanceOf(Array);
							});
						});
						
						it("each class is a string", function() {
							body().categories.forEach(function(category) {
								category.classes.forEach(function(c) {
									c.should.be.a.string;
									c.should.be.ok;
								});
							});
						});
					});
				});
			}));
		});

	});
	
	describe("Edit recurring show", function() {
		var urlFn = function() {
			return "/shows/recurring/" + getCreatedRecurringShowID(); 
		};
		
		describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, validRecurringShow, 401));
		describe("Valid user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), validRecurringShow, 401));
		describe("Valid user with permission", function() {
			describe("With an invalid show ID", lib.statusAndJSON("put", "/shows/recurring/abcd1234", lib.getCookie(true), validRecurringShow, 400));
			describe("With a valid but fake show ID", lib.statusAndJSON("put", "/shows/recurring/abcd1234abcd1234abcd1234", lib.getCookie(true), validRecurringShow, 404));
			describe("With a valid and real show ID", function() {
				invalidRecurringShows.forEach(function(show) {
					describe(show.name, lib.statusAndJSON("put", urlFn, lib.getCookie(true), show.value, 400));
				});
				describe("Valid recurring show", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validRecurringShow, 200));
			});
		});
	});

	[ "up", "down" ].forEach(function(dir) {
		var urlFn = function() {
			return "/shows/recurring/" + getCreatedRecurringShowID() + "/" + dir;
		};
		
		describe("Move recurring show " + dir, function() {
			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
			describe("Valid user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
			describe("Valid user with permission", function() {
				describe("With an invalid show ID", lib.statusAndJSON("put", "/shows/recurring/abcd1234/" + dir, lib.getCookie(true), null, 400));
				describe("With a valid but fake show ID", lib.statusAndJSON("put", "/shows/recurring/abcd1234abcd1234abcd1234/" + dir, lib.getCookie(true), null, 404));
				describe("With a valid and real show ID", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 200));
			});
		});
	});

	describe("List recurring shows", lib.statusAndJSON("get", "/shows/recurring", null, null, 200, function(response, body) {
		it("returns a list", function() {
			body().should.be.instanceOf(Array);
		});
		
		describe("each recurring show is valid", function() {
			it("each has an _id", function() {
				body().forEach(function(show) {
					show._id.should.match(/[0-9a-zA-Z]{24}/);
				});
			});

			it("each has a description", function() {
				body().forEach(function(show) {
					show.description.should.be.a.string;
					show.description.should.be.ok;
				});
			});

			it("each has categories", function() {
				body().forEach(function(show) {
					show.categories.should.be.instanceOf(Array);
				});
			});
			
			describe("each category is valid", function() {
				it("each has a name", function() {
					body().forEach(function(show) {
						show.categories.forEach(function(cat) {
							cat.name.should.be.a.string;
							cat.name.should.be.ok;
						});
					});
				});

				it("each has a name", function() {
					body().forEach(function(show) {
						show.categories.forEach(function(cat) {
							if(cat.description) {
								cat.description.should.be.a.string;
							}
						});
					});
				});
								
				it("each has a list of classes", function() {
					body().forEach(function(show) {
						show.categories.forEach(function(cat) {
							cat.classes.should.be.instanceOf(Array);
							cat.classes.forEach(function(c) {
								c.should.be.a.string;
								c.should.be.ok;
							});
						});
					});
				});
			})
		});
	}));
	
	describe("Delete recurring show", function() {
		var urlFn = function() {
			return "/shows/recurring/" + getCreatedRecurringShowID();
		};
		
		describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
		describe("Valid user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
		describe("Valid user with permission", function() {
			describe("With an invalid show ID", lib.statusAndJSON("delete", "/shows/recurring/abcd1234", lib.getCookie(true), null, 400));
			describe("With a valid but fake show ID", lib.statusAndJSON("delete", "/shows/recurring/abcd1234abcd1234abcd1234", lib.getCookie(true), null, 404));
			describe("With a valid and real show ID", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 200));
		});		
	});
});
