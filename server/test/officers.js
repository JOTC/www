var should = require("should");
var request = require("request");
request.delete = request.del;

var createdOfficerID;
function getCreatedOfficerID() {
	return createdOfficerID;
};

var lib = require("./lib");
lib.init();

describe("Officers API", function() {
	describe("Get list", lib.statusAndJSON("get", "/officers", null, null, 200, function(response, body) {
		it("should return an array", function() {
			body().should.be.instanceOf(Array);
		});

		describe("each officer must be valid", function() {

			it("each has an _id", function() {
				body().forEach(function(officer) {
					officer._id.should.match(/[0-9a-zA-Z]{24}/);
				});
			});

			it("each has a name", function() {
				body().forEach(function(officer) {
					officer.name.should.exist;
					officer.name.should.be.a.string;
				});
			});

			it("each has an ordering", function() {
				body().forEach(function(officer) {
					officer.ordering.should.be.a.number;
				});
			});

			it("each has a contacts array", function() {
				body().forEach(function(officer) {
					officer.contacts.should.be.instanceOf(Array);
				});
			});

			describe("each contact is valid", function() {
				it("each has an _id", function() {
					body().forEach(function(officer) {
						officer.contacts.forEach(function(contact) {
							contact._id.should.match(/[0-9a-zA-Z]{24}/);
						});
					});
				});

				it("each has a type", function() {
					body().forEach(function(officer) {
						officer.contacts.forEach(function(contact) {
							contact.type.should.be.a.string;
						});
					});
				});

				it("each has a value", function() {
					body().forEach(function(officer) {
						officer.contacts.forEach(function(contact) {
							contact.value.should.be.a.string;
						});
					});
				});
			});

			it("each has a titles array of strings", function() {
				body().forEach(function(officer) {
					officer.titles.should.be.instanceOf(Array);
					officer.titles.forEach(function(titles) {
						titles.should.be.a.string;
					});
				});
			});
		});
	}));

	describe("Add officer", function() {
		describe("Unauthenticated", lib.statusAndJSON("post", "/officers", null, { }, 401));

		describe("As real user without permission", lib.statusAndJSON("post", "/officers", lib.getCookie(false), { }, 401));

		describe("As real user with permission", function() {

			describe("With an empty officer", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { }, 400));
			describe("With an officer with a name but no titles or contacts", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { name: "Test Officer" }, 400));
			describe("With an officer with a titles array but no name or contacts", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { titles: [ ] }, 400));
			describe("With an officer with a contacts array but no name or titles", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { contacts: [ ] }, 400));
			describe("With an officer with a name and titles array but no contacts", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { name: "Test Officer", titles: [ ] }, 400));
			describe("With an officer with a name and contacts array but no titles", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { name: "Test Officer", contacts: [ ] }, 400));
			describe("With an officer with a titles and contacts array but no name", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { titles: [ ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts non-array", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: { } }, 400));
			describe("With an officer with a name, a contacts array, and a titles non-array", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { name: "Test Officer", titles: { }, contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array containing a non-string", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ 1 ] }, 400));
			describe("With an officer with a name, a titles array containing a non-string, and a contacts array", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { name: "Test Officer", titles: [ 1 ], contacts: [ ] }, 400));

			describe("With an officer with a name, a titles array, and a contacts array", lib.statusAndJSON("post", "/officers", lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ ] }, 200, function(response, body) {
				describe("returns a valid officer", function() {

					it("has an _id", function() {
						body()._id.should.match(/[0-9a-zA-Z]{24}/);
						createdOfficerID = body()._id;
					});

					it("has a name", function() {
						body().name.should.exist;
						body().name.should.be.a.string;
					});

					it("has an ordering", function() {
						body().ordering.should.be.a.number;
					});

					it("has a contacts array", function() {
						body().contacts.should.be.instanceOf(Array);
					});

					it("has a titles array", function() {
						body().titles.should.be.instanceOf(Array);
					});
				})
			}));
		});
	});

	/* */
	describe("Edit an officer", function() {
		describe("with invalid ID", function() {
			var officerURLfn = function() {
				return "/officers/abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", officerURLfn, null, { }, 401));
			describe("As a real user without permission", lib.statusAndJSON("put", officerURLfn, lib.getCookie(false), { }, 401));
			describe("As a real user with permission and an empty officer", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { }, 400));
			describe("With an officer with a name but no titles or contacts", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer" }, 400));
			describe("With an officer with a titles array but no name or contacts", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { titles: [ ] }, 400));
			describe("With an officer with a contacts array but no name or titles", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { contacts: [ ] }, 400));
			describe("With an officer with a name and titles array but no contacts", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ] }, 400));
			describe("With an officer with a name and contacts array but no titles", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", contacts: [ ] }, 400));
			describe("With an officer with a titles and contacts array but no name", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { titles: [ ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts non-array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: { } }, 400));
			describe("With an officer with a name, a contacts array, and a titles non-array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: { }, contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array containing a non-string", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ 1 ] }, 400));
			describe("With an officer with a name, a titles array containing a non-string, and a contacts array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ 1 ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ ] }, 400));
		});

		describe("with valid but fake ID", function() {
			var officerURLfn = function() {
				return "/officers/abcd1234abcd1234abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("put", officerURLfn, null, { }, 401));
			describe("As a real user without permission", lib.statusAndJSON("put", officerURLfn, lib.getCookie(false), { }, 401));
			describe("As a real user with permission and an empty officer", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { }, 400));
			describe("With an officer with a name but no titles or contacts", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer" }, 400));
			describe("With an officer with a titles array but no name or contacts", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { titles: [ ] }, 400));
			describe("With an officer with a contacts array but no name or titles", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { contacts: [ ] }, 400));
			describe("With an officer with a name and titles array but no contacts", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ] }, 400));
			describe("With an officer with a name and contacts array but no titles", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", contacts: [ ] }, 400));
			describe("With an officer with a titles and contacts array but no name", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { titles: [ ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts non-array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: { } }, 400));
			describe("With an officer with a name, a contacts array, and a titles non-array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: { }, contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array containing a non-string", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ 1 ] }, 400));
			describe("With an officer with a name, a titles array containing a non-string, and a contacts array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ 1 ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ ] }, 404));
		});

		describe("with valid and real ID", function() {
			var officerURLfn = function() {
				return "/officers/" + createdOfficerID;
			};

			describe("Unauthenticated", lib.statusAndJSON("put", officerURLfn, null, { }, 401));
			describe("As a real user without permission", lib.statusAndJSON("put", officerURLfn, lib.getCookie(false), { }, 401));
			describe("As a real user with permission and an empty officer", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { }, 400));
			describe("With an officer with a name but no titles or contacts", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer" }, 400));
			describe("With an officer with a titles array but no name or contacts", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { titles: [ ] }, 400));
			describe("With an officer with a contacts array but no name or titles", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { contacts: [ ] }, 400));
			describe("With an officer with a name and titles array but no contacts", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ] }, 400));
			describe("With an officer with a name and contacts array but no titles", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", contacts: [ ] }, 400));
			describe("With an officer with a titles and contacts array but no name", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { titles: [ ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts non-array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: { } }, 400));
			describe("With an officer with a name, a contacts array, and a titles non-array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: { }, contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array containing a non-string", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ 1 ] }, 400));
			describe("With an officer with a name, a titles array containing a non-string, and a contacts array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ 1 ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array", lib.statusAndJSON("put", officerURLfn, lib.getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ ] }, 200));
		});
	});
	//*/

	describe("Delete officer", function() {

		describe("With invalid ID", function() {
			var officerURLfn = function() {
				return "/officers/abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("delete", officerURLfn, null, { }, 401));
			describe("As a real user without permission", lib.statusAndJSON("delete", officerURLfn, lib.getCookie(false), { }, 401));
			describe("As a real user with permission", lib.statusAndJSON("delete", officerURLfn, lib.getCookie(true), { }, 400));
		});

		describe("With valid but fake ID", function() {
			var officerURLfn = function() {
				return "/officers/abcd1234abcd1234abcd1234";
			};

			describe("Unauthenticated", lib.statusAndJSON("delete", officerURLfn, null, { }, 401));
			describe("As a real user without permission", lib.statusAndJSON("delete", officerURLfn, lib.getCookie(false), { }, 401));
			describe("As a real user with permission", lib.statusAndJSON("delete", officerURLfn, lib.getCookie(true), { }, 404));
		});

		describe("With valid and real ID", function() {
			var officerURLfn = function() {
				return "/officers/" + getCreatedOfficerID();
			};

			describe("Unauthenticated", lib.statusAndJSON("delete", officerURLfn, null, { }, 401));
			describe("As a real user without permission", lib.statusAndJSON("delete", officerURLfn, lib.getCookie(false), { }, 401));
			describe("As a real user with permission", lib.statusAndJSON("delete", officerURLfn, lib.getCookie(true), { }, 200));
		});
});
});
