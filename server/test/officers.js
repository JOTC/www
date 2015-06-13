var dbUsers = require("../model/db").users;
var should = require("should");
var request = require("request");
var crypto = require("crypto");

request.delete = request.del;

var _users = {
	withoutPermission: {
		db: null,
		username: "test1",
		password: crypto.createHash("sha256").update("test-password-1").digest("hex").toString(16),
		cookie: ""
	},
	withPermission: {
		db: null,
		username: "test2",
		password: crypto.createHash("sha256").update("test-password-2").digest("hex"),
		cookie: ""
	}
};

var createdOfficerID;
function getCreatedOfficerID() {
	return createdOfficerID;
};

before(function(done) {
	_users.withoutPermission.db = new dbUsers({ name: "Test User 1", email: "", local: { username: "test1", secret: "$2a$10$YZR8NMyyDzFY5ixvNerUneTr/2qGkxVgi.uzGBQxhv9koEj//6zrK" }, permissions: { "links": false, "officers": false, "shows": false, "classes": false, "pictures": false, "calendar": false, "users": false }});
	_users.withPermission.db = new dbUsers({ name: "Test User 2", email: "", local: { username: "test2", secret: "$2a$10$X/zlr3SzwNgTnKLs/YztQeZxbxTJwy0GZelyJPrrjbFIzyRFvm9Z2" }, permissions: { "links": true, "officers": true, "shows": true, "classes": true, "pictures": true, "calendar": true, "users": true }});
	
	_users.withoutPermission.db.save(function() {
		_users.withPermission.db.save(done);
	});
});

before(function(done) {
	request.post("http://127.0.0.1:9931/auth/local", { form: { username: _users.withoutPermission.username, password: _users.withoutPermission.password }}, function(err, response, body) {
		var cookie = response.headers["set-cookie"].toString();
		_users.withoutPermission.cookie = cookie.substr(0, cookie.indexOf(";"));
		done();
	});
});

before(function(done) {
	request.post("http://127.0.0.1:9931/auth/local", { form: { username: _users.withPermission.username, password: _users.withPermission.password }}, function(err, response, body) {
		var cookie = response.headers["set-cookie"].toString();
		_users.withPermission.cookie = cookie.substr(0, cookie.indexOf(";"));
		done();
	});
});

after(function(done) {
	_users.withoutPermission.db.remove(function() {
		_users.withPermission.db.remove(done);
	});
});

function getCookie(withPermission) {
	return function() {
		return _users[withPermission ? "withPermission" : "withoutPermission"].cookie;
	};
};

function statusAndJSON(verb, url, cookieFn, body, expectedStatus, after) {
	return function() {
		var _response;
		var _body;

		before(function(done) {
			
			if(typeof url === "function") {
				url = url();
			}
			
			var urlOptions = { url: "http://127.0.0.1:9931" + url, json: true };
			if(body && typeof body === "object") {
				urlOptions.body = body;
			};

			if(typeof cookieFn === "function") {
				urlOptions.headers = { Cookie: cookieFn() };
			}

			request[verb](urlOptions, function(err, res, body) {
				_response = res;
				_body = body;
				done();
			});
		});

		it("should return a " + expectedStatus + " status code", function() {
			_response.statusCode.should.be.exactly(expectedStatus);
		});

		it("should return a JSON content-type", function() {
			_response.headers["content-type"].toLowerCase().should.be.exactly("application/json");
		});

		if(typeof after === "function") {
			after(function() { return _response; }, function() { return _body; });
		};
	};
}

describe("Officers API", function() {
	describe("Get list", statusAndJSON("get", "/officers", null, null, 200, function(response, body) {
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
		describe("Unauthenticated", statusAndJSON("post", "/officers", null, { }, 401));
		
		describe("As real user without permission", statusAndJSON("post", "/officers", getCookie(false), { }, 401));
		
		describe("As real user with permission", function() {
			
			describe("With an empty officer", statusAndJSON("post", "/officers", getCookie(true), { }, 400));
			describe("With an officer with a name but no titles or contacts", statusAndJSON("post", "/officers", getCookie(true), { name: "Test Officer" }, 400));
			describe("With an officer with a titles array but no name or contacts", statusAndJSON("post", "/officers", getCookie(true), { titles: [ ] }, 400));
			describe("With an officer with a contacts array but no name or titles", statusAndJSON("post", "/officers", getCookie(true), { contacts: [ ] }, 400));
			describe("With an officer with a name and titles array but no contacts", statusAndJSON("post", "/officers", getCookie(true), { name: "Test Officer", titles: [ ] }, 400));
			describe("With an officer with a name and contacts array but no titles", statusAndJSON("post", "/officers", getCookie(true), { name: "Test Officer", contacts: [ ] }, 400));
			describe("With an officer with a titles and contacts array but no name", statusAndJSON("post", "/officers", getCookie(true), { titles: [ ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts non-array", statusAndJSON("post", "/officers", getCookie(true), { name: "Test Officer", titles: [ ], contacts: { } }, 400));
			describe("With an officer with a name, a contacts array, and a titles non-array", statusAndJSON("post", "/officers", getCookie(true), { name: "Test Officer", titles: { }, contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array containing a non-string", statusAndJSON("post", "/officers", getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ 1 ] }, 400));
			describe("With an officer with a name, a titles array containing a non-string, and a contacts array", statusAndJSON("post", "/officers", getCookie(true), { name: "Test Officer", titles: [ 1 ], contacts: [ ] }, 400));
			
			describe("With an officer with a name, a titles array, and a contacts array", statusAndJSON("post", "/officers", getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ ] }, 200, function(response, body) {
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

			describe("Unauthenticated", statusAndJSON("put", officerURLfn, null, { }, 401));
			describe("As a real user without permission", statusAndJSON("put", officerURLfn, getCookie(false), { }, 401));
			describe("As a real user with permission and an empty officer", statusAndJSON("put", officerURLfn, getCookie(true), { }, 400));
			describe("With an officer with a name but no titles or contacts", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer" }, 400));
			describe("With an officer with a titles array but no name or contacts", statusAndJSON("put", officerURLfn, getCookie(true), { titles: [ ] }, 400));
			describe("With an officer with a contacts array but no name or titles", statusAndJSON("put", officerURLfn, getCookie(true), { contacts: [ ] }, 400));
			describe("With an officer with a name and titles array but no contacts", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ] }, 400));
			describe("With an officer with a name and contacts array but no titles", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", contacts: [ ] }, 400));
			describe("With an officer with a titles and contacts array but no name", statusAndJSON("put", officerURLfn, getCookie(true), { titles: [ ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts non-array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ], contacts: { } }, 400));
			describe("With an officer with a name, a contacts array, and a titles non-array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: { }, contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array containing a non-string", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ 1 ] }, 400));
			describe("With an officer with a name, a titles array containing a non-string, and a contacts array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ 1 ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ ] }, 400));
		});
		
		describe("with valid but fake ID", function() {
			var officerURLfn = function() {
				return "/officers/abcd1234abcd1234abcd1234";
			};

			describe("Unauthenticated", statusAndJSON("put", officerURLfn, null, { }, 401));
			describe("As a real user without permission", statusAndJSON("put", officerURLfn, getCookie(false), { }, 401));
			describe("As a real user with permission and an empty officer", statusAndJSON("put", officerURLfn, getCookie(true), { }, 400));
			describe("With an officer with a name but no titles or contacts", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer" }, 400));
			describe("With an officer with a titles array but no name or contacts", statusAndJSON("put", officerURLfn, getCookie(true), { titles: [ ] }, 400));
			describe("With an officer with a contacts array but no name or titles", statusAndJSON("put", officerURLfn, getCookie(true), { contacts: [ ] }, 400));
			describe("With an officer with a name and titles array but no contacts", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ] }, 400));
			describe("With an officer with a name and contacts array but no titles", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", contacts: [ ] }, 400));
			describe("With an officer with a titles and contacts array but no name", statusAndJSON("put", officerURLfn, getCookie(true), { titles: [ ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts non-array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ], contacts: { } }, 400));
			describe("With an officer with a name, a contacts array, and a titles non-array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: { }, contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array containing a non-string", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ 1 ] }, 400));
			describe("With an officer with a name, a titles array containing a non-string, and a contacts array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ 1 ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ ] }, 404));
		});
		
		describe("with valid but fake ID", function() {
			var officerURLfn = function() {
				return "/officers/" + createdOfficerID;
			};

			describe("Unauthenticated", statusAndJSON("put", officerURLfn, null, { }, 401));
			describe("As a real user without permission", statusAndJSON("put", officerURLfn, getCookie(false), { }, 401));
			describe("As a real user with permission and an empty officer", statusAndJSON("put", officerURLfn, getCookie(true), { }, 400));
			describe("With an officer with a name but no titles or contacts", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer" }, 400));
			describe("With an officer with a titles array but no name or contacts", statusAndJSON("put", officerURLfn, getCookie(true), { titles: [ ] }, 400));
			describe("With an officer with a contacts array but no name or titles", statusAndJSON("put", officerURLfn, getCookie(true), { contacts: [ ] }, 400));
			describe("With an officer with a name and titles array but no contacts", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ] }, 400));
			describe("With an officer with a name and contacts array but no titles", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", contacts: [ ] }, 400));
			describe("With an officer with a titles and contacts array but no name", statusAndJSON("put", officerURLfn, getCookie(true), { titles: [ ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts non-array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ], contacts: { } }, 400));
			describe("With an officer with a name, a contacts array, and a titles non-array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: { }, contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array containing a non-string", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ 1 ] }, 400));
			describe("With an officer with a name, a titles array containing a non-string, and a contacts array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ 1 ], contacts: [ ] }, 400));
			describe("With an officer with a name, a titles array, and a contacts array", statusAndJSON("put", officerURLfn, getCookie(true), { name: "Test Officer", titles: [ ], contacts: [ ] }, 200));
		});
	});
	//*/
	
	describe("Delete officer", function() {
		
		describe("With invalid ID", function() {
			var officerURLfn = function() {
				return "/officers/abcd1234";
			};

			describe("Unauthenticated", statusAndJSON("delete", officerURLfn, null, { }, 401));
			describe("As a real user without permission", statusAndJSON("delete", officerURLfn, getCookie(false), { }, 401));
			describe("As a real user with permission", statusAndJSON("delete", officerURLfn, getCookie(true), { }, 400));
		});

		describe("With valid but fake ID", function() {
			var officerURLfn = function() {
				return "/officers/abcd1234abcd1234abcd1234";
			};

			describe("Unauthenticated", statusAndJSON("delete", officerURLfn, null, { }, 401));
			describe("As a real user without permission", statusAndJSON("delete", officerURLfn, getCookie(false), { }, 401));
			describe("As a real user with permission", statusAndJSON("delete", officerURLfn, getCookie(true), { }, 404));
		});

		describe("With valid and real ID", function() {
			var officerURLfn = function() {
				return "/officers/" + getCreatedOfficerID();
			};

			describe("Unauthenticated", statusAndJSON("delete", officerURLfn, null, { }, 401));
			describe("As a real user without permission", statusAndJSON("delete", officerURLfn, getCookie(false), { }, 401));
			describe("As a real user with permission", statusAndJSON("delete", officerURLfn, getCookie(true), { }, 200));
		});
});
});