var should = require("should");
var request = require("request");

request.delete = request.del;

var createdLinkGroupID;
function getCreatedLinkGroupID() {
	return createdLinkGroupID;
};

var createdLinkID;
function getCreatedLinkID() {
	return createdLinkID;
};

var lib = require("./lib");
lib.init();

describe("Links API", function() {
	describe("Get list", lib.statusAndJSON("get", "/links", null, null, 200, function(response, body) {
		it("should return an array", function() {
			body().should.be.instanceOf(Array);
		});

		describe("each link group must be valid", function() {
			it("each has an _id", function() {
				body().forEach(function(group) {
					group._id.should.match(/[0-9a-zA-Z]{24}/);
				})
			});

			it("each has a name", function() {
				body().forEach(function(group) {
					group.name.should.exist;
					group.name.should.be.a.string;
				});
			});

			it("each has an ordering", function() {
				body().forEach(function(group) {
					group.ordering.should.be.a.number;
				})
			});

			it("each has a list of links", function() {
				body().forEach(function(group) {
					group.links.should.be.instanceOf(Array);
				});
			});

			describe("each link is valid", function() {
				it("each has an _id", function() {
					body().forEach(function(group) {
						group.links.forEach(function(link) {
							link._id.should.match(/[0-9a-zA-Z]{24}/);
						});
					});
				});

				it("each has a URL", function() {
					body().forEach(function(group) {
						group.links.forEach(function(link) {
							link.url.should.exist;
							link.url.should.be.a.string;
						});
					});
				});

				it("each has a name", function() {
					body().forEach(function(group) {
						group.links.forEach(function(link) {
							link.name.should.exist;
							link.name.should.be.a.string;
						});
					});
				});
			});
		});
	}));

	describe("Add link group", function() {
		describe("Unauthenticated", lib.statusAndJSON("post", "/links", null, { }, 401));

		describe("As real user without permission", lib.statusAndJSON("post", "/links", lib.getCookie(false), { }, 401));

		describe("As real user with permission", function() {
			describe("With an empty group", lib.statusAndJSON("post", "/links", lib.getCookie(true), { }, 400));
			describe("With an empty name", lib.statusAndJSON("post", "/links", lib.getCookie(true), { name: "" }, 400));
			describe("With a non-string name", lib.statusAndJSON("post", "/links", lib.getCookie(true), { name: 2 }, 400));

			describe("With a valid group", lib.statusAndJSON("post", "/links", lib.getCookie(true), { name: "Test Link Group" }, 200, function(response, body) {
				describe("returns a valid link group", function() {
					it("has an _id", function() {
						body()._id.should.match(/[0-9a-zA-Z]{24}/);
						createdLinkGroupID = body()._id;
					});

					it("has a name", function() {
						body().name.should.exist;
						body().name.should.be.a.string;
					});

					it("has an ordering", function() {
						body().ordering.should.be.a.number;
					});

					it("has a list of links", function() {
						body().links.should.be.instanceOf(Array);
					});
				});
			}));
		});
	});

	describe("Edit link group", function() {
		describe("With an invalid ID", function() {
			var urlFn = function() {
				return "/links/abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
			describe("As real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), { }, 401));

			describe("As real user with permission", function() {
				describe("With an empty group", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
				describe("With an empty name", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "" }, 400));
				describe("With a non-string name", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 2 }, 400));
				describe("With a valid group", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test Link Group Rename" }, 400));
			});
		});

		describe("With a valid but fake ID", function() {
			var urlFn = function() {
				return "/links/abcd1234abcd1234abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
			describe("As real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), { }, 401));

			describe("As real user with permission", function() {
				describe("With an empty group", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
				describe("With an empty name", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "" }, 400));
				describe("With a non-string name", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 2 }, 400));
				describe("With a valid group", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test Link Group Rename" }, 404));
			});
		});

		describe("With a valid and real ID", function() {
			var urlFn = function() {
				return "/links/" + getCreatedLinkGroupID();
			};

			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
			describe("As real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), { }, 401));

			describe("As real user with permission", function() {
				describe("With an empty group", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
				describe("With an empty name", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "" }, 400));
				describe("With a non-string name", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 2 }, 400));
				describe("With a valid group", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test Link Group Rename" }, 200));
			});
		});
	});

	describe("Add a link to a group", function() {
		describe("With an invalid group ID", function() {
			var urlFn = function() {
				return "/links/abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("post", urlFn, null, { }, 401));
			describe("As a real user without permission", lib.statusAndJSON("post", urlFn, lib.getCookie(false), { }, 401));

			describe("As a real user with permission", function() {
				describe("With an empty link", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { }, 400));
				describe("With a name but no URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
				describe("With no name but a URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
				describe("With a name and a non-string URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
				describe("With a non-string name and a URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
				describe("With a non-string name and a non-string URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
				describe("With a name and a URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: "Test link", url: "test-url" }, 400));
			});
		});

		describe("With a valid but fake group ID", function() {
			var urlFn = function() {
				return "/links/abcd1234abcd1234abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("post", urlFn, null, { }, 401));
			describe("As a real user without permission", lib.statusAndJSON("post", urlFn, lib.getCookie(false), { }, 401));

			describe("As a real user with permission", function() {
				describe("With an empty link", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { }, 400));
				describe("With a name but no URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
				describe("With no name but a URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
				describe("With a name and a non-string URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
				describe("With a non-string name and a URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
				describe("With a non-string name and a non-string URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
				describe("With a name and a URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: "Test link", url: "test-url" }, 404));
			});
		});

		describe("With a valid and real group ID", function() {
			var urlFn = function() {
				return "/links/" + getCreatedLinkGroupID();
			};

			describe("Unauthenticated", lib.statusAndJSON("post", urlFn, null, { }, 401));
			describe("As a real user without permission", lib.statusAndJSON("post", urlFn, lib.getCookie(false), { }, 401));

			describe("As a real user with permission", function() {
				describe("With an empty link", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { }, 400));
				describe("With a name but no URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
				describe("With no name but a URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
				describe("With a name and a non-string URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
				describe("With a non-string name and a URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
				describe("With a non-string name and a non-string URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
				describe("With a name and a URL", lib.statusAndJSON("post", urlFn, lib.getCookie(true), { name: "Test link", url: "test-url" }, 200, function(response, body) {
					describe("returns a valid link", function() {
						it("has an _id", function() {
							body()._id.should.match(/[0-9a-zA-Z]{24}/);
							createdLinkID = body()._id;
						});

						it("has a name", function() {
							body().name.should.exist;
							body().name.should.be.a.string;
						});

						it("has a URL", function() {
							body().url.should.exist;
							body().url.should.be.a.string;
						});
					});

				}));
			});
		});
	});

	describe("Edit a link", function() {
		describe("With an invalid group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, null, { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, 400));
				});
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/abcd1234abcd1234abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, null, { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, 400));
				});
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/" + getCreatedLinkID();
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, null, { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, 400));
				});
			});
		});

		describe("With a valid but fake group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, null, { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, 400));
				});
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/abcd1234abcd1234abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, null, { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, 404));
				});
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/" + getCreatedLinkID();
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, null, { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, 404));
				});
			});
		});

		describe("With a valid and real group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/abc1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, null, { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, 400));
				});
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/abcd1234abcd1234abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, null, { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, 404));
				});
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/" + getCreatedLinkID();
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, null, { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, 200));
				});
			});
		});
	});

	describe("Move a link group up", function() {
		describe("With an invalid group ID", function() {
			var urlFn = function() {
				return "/links/abcd1234/up";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
			describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
			describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
		});

		describe("With a valid but fake group ID", function() {
			var urlFn = function() {
				return "/links/abcd1234abcd1234abcd1234/up";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
			describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
			describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 404));
		});

		describe("With a valid and real group ID", function() {
			var urlFn = function() {
				return "/links/" + getCreatedLinkGroupID() + "/up";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
			describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
			describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 200));
		});
	});

	describe("Move a link group down", function() {
		describe("With an invalid group ID", function() {
			var urlFn = function() {
				return "/links/abcd1234/down";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
			describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
			describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
		});

		describe("With a valid but fake group ID", function() {
			var urlFn = function() {
				return "/links/abcd1234abcd1234abcd1234/down";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
			describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
			describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 404));
		});

		describe("With a valid and real group ID", function() {
			var urlFn = function() {
				return "/links/" + getCreatedLinkGroupID() + "/down";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
			describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
			describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 200));
		});
	});

	describe("Move a link up", function() {
		describe("With an invalid group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/abcd1234/up";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/abcd1234abcd1234abcd1234/up";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/" + getCreatedLinkID() + "/up";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});
		});

		describe("With a valid but fake group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/abcd1234/up";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/abcd1234abcd1234abcd1234/up";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 404));
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/" + getCreatedLinkID() + "/up";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 404));
			});
		});

		describe("With a valid group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/abcd1234/up";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/abcd1234abcd1234abcd1234/up";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 404));
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/" + getCreatedLinkID() + "/up";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 200));
			});
		});
	});

	describe("Move a link down", function() {
		describe("With an invalid group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/abcd1234/down";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/abcd1234abcd1234abcd1234/down";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/" + getCreatedLinkID() + "/down";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});
		});

		describe("With a valid but fake group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/abcd1234/down";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/abcd1234abcd1234abcd1234/down";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 404));
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/" + getCreatedLinkID() + "/down";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 404));
			});
		});

		describe("With a valid group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/abcd1234/down";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/abcd1234abcd1234abcd1234/down";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 404));
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/" + getCreatedLinkID() + "/down";
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 200));
			});
		});
	});

	describe("Delete a link", function() {
		describe("With an invalid group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/abcd1234abcd1234abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234/" + getCreatedLinkID();
				};

				describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 400));
			});
		});

		describe("With a valid but fake group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/abcd1234abcd1234abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 404));
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/abcd1234abcd1234abcd1234/" + getCreatedLinkID();
				};

				describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 404));
			});
		});

		describe("With a valid group ID", function() {
			describe("With an invalid link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 400));
			});

			describe("With a valid but fake link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/abcd1234abcd1234abcd1234";
				};

				describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 404));
			});

			describe("With a valid and real link ID", function() {
				var urlFn = function() {
					return "/links/" + getCreatedLinkGroupID() + "/" + getCreatedLinkID();
				};

				describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
				describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
				describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 200));
			});
		});
	});

	describe("Delete a link group", function() {
		describe("With an invalid group ID", function() {
			var urlFn = function() {
				return "/links/abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
			describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
			describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 400));
		});

		describe("With a valid but fake group ID", function() {
			var urlFn = function() {
				return "/links/abcd1234abcd1234abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
			describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
			describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 404));
		});

		describe("With a valid and real group ID", function() {
			var urlFn = function() {
				return "/links/" + getCreatedLinkGroupID();
			};

			describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
			describe("As a real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
			describe("As a real user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 200));
		});
	});
});
