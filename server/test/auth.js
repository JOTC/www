var dbUsers = require("../model/db").users;
var should = require("should");
var request = require("request");
var crypto = require("crypto");

var _user = {
	db: null,
	username: "test2",
	password: crypto.createHash("sha256").update("test-password-2").digest("hex"),
	cookie: ""
};

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

before(function(done) {
	_user.db = new dbUsers({ name: "Test User 1", email: "", local: { username: _user.username, secret: "$2a$10$YZR8NMyyDzFY5ixvNerUneTr/2qGkxVgi.uzGBQxhv9koEj//6zrK" }, permissions: { "links": false, "officers": false, "shows": false, "classes": false, "pictures": false, "calendar": false, "users": false }});
	_user.db.save(done);
});

/* * /
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
//*/

after(function(done) {
	_user.db.remove(done);
});

describe("Local Authentication API", function() {
    describe("Fake user", function() {
        var _response;
        var _body;

        before(function(done) {
            request.post("http://127.0.0.1:9931/auth/local", { form: { username: "fake", password: "fake" }}, function(err, response, body) {
                _response = response;
                _body = body;
                done();
            });
        });

        it("returns a 401 status code", function() {
            _response.statusCode.should.be.exactly(401);
        });
    });

    describe("Real user, fake password", function() {
        var _response;
        var _body;

        before(function(done) {
            request.post("http://127.0.0.1:9931/auth/local", { form: { username: _user.username, password: "fake" }}, function(err, response, body) {
                _response = response;
                _body = body;
                done();
            });
        });

        it("returns a 401 status code", function() {
            _response.statusCode.should.be.exactly(401);
        });
    });

    describe("Real user, real password", function() {
        var _response;
        var _body;

        before(function(done) {
            request.post("http://127.0.0.1:9931/auth/local", { form: { username: _user.username, password: _user.password }}, function(err, response, body) {
                _response = response;
                _body = body;
                done();
            });
        });

        it("returns a 200 status code", function() {
            _response.statusCode.should.be.exactly(200);
        });

        it("sets a session ID cookie", function() {
            var cookie = _response.headers["set-cookie"].toString();
            cookie = cookie.substr(0, cookie.indexOf(";"));
            cookie.should.match(/session=[a-zA-Z0-9.-_]+/);
        });
    });
});
