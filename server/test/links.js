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

var groups = [
	{
		name: "With an invalid group ID",
		groupID: function() { return "abcd1234" },
		successCase: 400,
		links: [
			{
				name: "With an invalid link ID",
				linkID: function() { return "abcd1234"; },
				successCase: 400
			},
			{
				name: "With a valid but fake link ID",
				linkID: function() { return "abcd1234abcd1234abcd1234"; },
				successCase: 400
			},
			{
				name: "With an valid and real link ID",
				linkID: function() { return getCreatedLinkID(); },
				successCase: 400
			}
		]
	},
	{
		name: "With a valid but fake group ID",
		groupID: function() { return "abcd1234abcd1234abcd1234"; },
		successCase: 404,
		links: [
			{
				name: "With an invalid link ID",
				linkID: function() { return "abcd1234"; },
				successCase: 400
			},
			{
				name: "With a valid but fake link ID",
				linkID: function() { return "abcd1234abcd1234abcd1234"; },
				successCase: 404
			},
			{
				name: "With an valid and real link ID",
				linkID: function() { return getCreatedLinkID(); },
				successCase: 404
			}
		]
	},
	{
		name: "With a valid and real group ID",
		groupID: function() { return getCreatedLinkGroupID(); },
		successCase: 200,
		links: [
			{
				name: "With an invalid link ID",
				linkID: function() { return "abcd1234"; },
				successCase: 400
			},
			{
				name: "With a valid but fake link ID",
				linkID: function() { return "abcd1234abcd1234abcd1234"; },
				successCase: 404
			},
			{
				name: "With an valid and real link ID",
				linkID: function() { return getCreatedLinkID(); },
				successCase: 200
			}
		]
	}
];

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
		groups.forEach(function(group) {
			describe(group.name, function() {
				var urlFn = function() {
					return function() { return "/links/" + group.groupID(); };
				};

				describe("Unauthenticated", lib.statusAndJSON("put", urlFn(), null, { }, 401));
				describe("As real user without permission", lib.statusAndJSON("put", urlFn(), lib.getCookie(false), { }, 401));

				describe("As real user with permission", function() {
					describe("With an empty group", lib.statusAndJSON("put", urlFn(), lib.getCookie(true), { }, 400));
					describe("With an empty name", lib.statusAndJSON("put", urlFn(), lib.getCookie(true), { name: "" }, 400));
					describe("With a non-string name", lib.statusAndJSON("put", urlFn(), lib.getCookie(true), { name: 2 }, 400));
					describe("With a valid group", lib.statusAndJSON("put", urlFn(), lib.getCookie(true), { name: "Test Link Group Rename" }, group.successCase));
				});
			});
		});
	});

	describe("Add a link to a group", function() {
		groups.forEach(function(group) {
			describe(group.name, function() {
				var urlFn = function(groupID) {
					return function() { return "/links/" + group.groupID(); };
				};
				describe("Unauthenticated", lib.statusAndJSON("post", urlFn(group.groupID), null, { }, 401));
				describe("As a real user without permission", lib.statusAndJSON("post", urlFn(group.groupID), lib.getCookie(false), { }, 401));

				describe("As a real user with permission", function() {
					describe("With an empty link", lib.statusAndJSON("post", urlFn(group.groupID), lib.getCookie(true), { }, 400));
					describe("With a name but no URL", lib.statusAndJSON("post", urlFn(group.groupID), lib.getCookie(true), { name: "Test link" }, 400));
					describe("With no name but a URL", lib.statusAndJSON("post", urlFn(group.groupID), lib.getCookie(true), { url: "test-url" }, 400));
					describe("With a name and a non-string URL", lib.statusAndJSON("post", urlFn(group.groupID), lib.getCookie(true), { name: "Test link", url: 7 }, 400));
					describe("With a non-string name and a URL", lib.statusAndJSON("post", urlFn(group.groupID), lib.getCookie(true), { name: 4, url: "test-url" }, 400));
					describe("With a non-string name and a non-string URL", lib.statusAndJSON("post", urlFn(group.groupID), lib.getCookie(true), { name: 4, url: 7 }, 400));
					describe("With a name and a URL", lib.statusAndJSON("post", urlFn(group.groupID), lib.getCookie(true), { name: "Test link", url: "test-url" }, group.successCase, function(response, body) {
						if(group.successCase === 200) {
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
						}
					}));
				});
			});
		});
	});

	describe("Edit a link", function() {
		groups.forEach(function(group) {
			describe(group.name, function() {
				group.links.forEach(function(link) {
					describe(link.name, function() {
						var urlFn = function(groupID, linkID) {
							return function() { return "/links/" + group.groupID() + "/" + link.linkID(); };
						};

						describe("Unauthenticated", lib.statusAndJSON("put", urlFn(group.groupID, link.linkID), null, { }, 401));
						describe("As a real user without permission", lib.statusAndJSON("put", urlFn(group.groupID, link.linkID), null, { }, 401));

						describe("As a real user with permission", function() {
							describe("With an empty link", lib.statusAndJSON("put", urlFn(group.groupID, link.linkID), lib.getCookie(true), { }, 400));
							describe("With a name but no URL", lib.statusAndJSON("put", urlFn(group.groupID, link.linkID), lib.getCookie(true), { name: "Test link" }, 400));
							describe("With no name but a URL", lib.statusAndJSON("put", urlFn(group.groupID, link.linkID), lib.getCookie(true), { url: "test-url" }, 400));
							describe("With a name and a non-string URL", lib.statusAndJSON("put", urlFn(group.groupID, link.linkID), lib.getCookie(true), { name: "Test link", url: 7 }, 400));
							describe("With a non-string name and a URL", lib.statusAndJSON("put", urlFn(group.groupID, link.linkID), lib.getCookie(true), { name: 4, url: "test-url" }, 400));
							describe("With a non-string name and a non-string URL", lib.statusAndJSON("put", urlFn(group.groupID, link.linkID), lib.getCookie(true), { name: 4, url: 7 }, 400));
							describe("With a name and a URL", lib.statusAndJSON("put", urlFn(group.groupID, link.linkID), lib.getCookie(true), { name: "Test link rename", url: "test-url-change" }, link.successCase));
						});
					});
				});
			});
		});
	});

	var noBodyNoReturnTests = [
		{
			groupName: "Move a link group up",
			linkName: "Move a link up",
			verb: "put",
			urlPostfix: "/up"
		},
		{
			groupName: "Move a link group down",
			linkName: "Move a link down",
			verb: "put",
			urlPostfix: "/down"
		},
		{
			groupName: "Delete a link group",
			linkName: "Delete a link",
			verb: "delete",
			urlPostfix: ""
		}
	];

	noBodyNoReturnTests.forEach(function(test) {
		describe(test.linkName, function() {
			var urlFn = function(groupID, linkID) {
				return function() { return "/links/" + groupID() + "/" + linkID() + test.urlPostfix; };
			}

			groups.forEach(function(group) {
				describe(group.name, function() {
					group.links.forEach(function(link) {
						describe(link.name, function() {
							describe("Unauthenticated", lib.statusAndJSON(test.verb, urlFn(group.groupID, link.linkID), null, null, 401));
							describe("As a real user without permission", lib.statusAndJSON(test.verb, urlFn(group.groupID, link.linkID), lib.getCookie(false), null, 401));
							describe("As a real user with permission", lib.statusAndJSON(test.verb, urlFn(group.groupID, link.linkID), lib.getCookie(true), null, link.successCase));
						});
					});
				});
			});
		});

		describe(test.groupName, function() {
			var urlFn = function(groupID) {
				return function() { return "/links/" + groupID() + test.urlPostfix; };
			};

			groups.forEach(function(group) {
				describe(group.name, function() {
					describe("Unauthenticated", lib.statusAndJSON(test.verb, urlFn(group.groupID), null, null, 401));
					describe("As a real user without permission", lib.statusAndJSON(test.verb, urlFn(group.groupID), lib.getCookie(false), null, 401));
					describe("As a real user with permission", lib.statusAndJSON(test.verb, urlFn(group.groupID), lib.getCookie(true), null, group.successCase));
				});
			});
		});
	});
});
