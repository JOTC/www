var dbUsers = require("../model/db").users;
var should = require("should");
var request = require("request");
var crypto = require("crypto");
var bcrypt = require("bcryptjs");

var _user = {
	db: null,
	username: "test",
	password: crypto.createHash("sha256").update("test-password").digest("hex"),
	cookie: ""
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
	var pwHash = bcrypt.hashSync(_user.password);
	_user.db = new dbUsers({ name: "Test User 1", email: "em@il.com", local: { username: _user.username, secret: pwHash }, permissions: { "links": false, "officers": false, "shows": false, "classes": false, "pictures": false, "calendar": false, "users": false }});
	_user.db.save(done);
});

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
