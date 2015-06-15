var db = require("../model/db");
var should = require("should");
var request = require("request");
var bcrypt = require("bcryptjs");
request.delete = request.del;

var createdUserID;
function getCreatedUserID() {
	return createdUserID;
};

var lib = require("./lib");
lib.init();

var validUser = {
    name: "test-created-user",
    email: "em@il.com",
    permissions: {
        shows: true,
        classes: true,
        pictures: true,
        calendar: true,
        links: true,
        officers: true,
        users: true
    },
    mod: function(o) {
        var clone = JSON.parse(JSON.stringify(this));
        var merge = function(o1, o2) {
            Object.keys(o2).forEach(function(p) {
                if(typeof o2[p] === "object") {
                    o1[p] = merge(o1[p], o2[p]);
                } else {
                    o1[p] = o2[p];
                }
            });
        }
        return merge(clone, o);
    }
};

var userIDs = [
    { fn: function() { return "abcd1234"; }, successStatus: 400 },
    { fn: function() { return "abcd1234abcd1234abcd1234" }, successStatus: 404 },
    { fn: function() { return getCreatedUserID(); }, successStatus: 200 }
];

var resetSessionCookie;

describe("Users API", function() {
    // This tests adding a new user to the database
    // with a randomized password.  The server will
    // email the user with instructions of how to
    // proceed, which will include resetting the
    // generated password.
    describe("Create a user", function() {
        describe("Unauthenticated", lib.statusAndJSON("post", "/users", null, null, 401));
        describe("Valid user without permission", lib.statusAndJSON("post", "/users", lib.getCookie(false), null, 401));

        describe("Valid user with permission", function() {
            describe("With no user", lib.statusAndJSON("post", "/users", lib.getCookie(true), null, 400));
            describe("With an empty user", lib.statusAndJSON("post", "/users", lib.getCookie(true), { }, 400));
            describe("With a non-string name", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ name: 7 }), 400));
            describe("With a zero-length name", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ name: "" }), 400));
            describe("With a non-string email", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ email: 7 }), 400));
            describe("With a zero-length email", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ email: "" }), 400));
            describe("With an invalid email", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ email: "bob" }), 400));
            describe("With a non-object permissions", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ permissions: 0 }), 400));
            describe("With a non-boolean shows permission", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ permissions: { shows: 7 } }), 400));
            describe("With a non-boolean classes permission", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ permissions: { classes: 7 } }), 400));
            describe("With a non-boolean pictures permission", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ permissions: { pictures: 7 } }), 400));
            describe("With a non-boolean calendar permission", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ permissions: { calendar: 7 } }), 400));
            describe("With a non-boolean links permission", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ permissions: { links: 7 } }), 400));
            describe("With a non-boolean officers permission", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ permissions: { officers: 7 } }), 400));
            describe("With a non-boolean users permission", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser.mod({ permissions: { users: 7 } }), 400));
            describe("With a valid user", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser, 200, function(response, body) {
                describe("Returns a valid user object", function() {
                    it("has a valid id", function() {
                        body()._id.should.match(/[0-9a-zA-Z]{24}/);
                        createdUserID = body()._id;
                    });

                    it("has a name", function() {
                        body().name.should.be.a.string;
                        body().name.should.be.ok;
                    });

                    it("has an email", function() {
                        body().email.should.be.a.string;
                        body().email.should.be.ok;
                    });

                    it("has valid permissions", function() {
                        body().permissions.should.be.an.object;
                        Object.keys(body().permissions).forEach(function(p) {
                            body().permissions[p].should.be.a.boolean;
                        });
                    });
                });
            }));
        });
    });

    describe("Get list", function() {
        describe("Unauthenticated", lib.statusAndJSON("get", "/users", null, null, 200, function(response, body) {
            it("should be an empty array", function() {
                body().should.be.instanceOf(Array);
                body().length.should.be.exactly(0);
            });
        }));
        describe("Valid user without permission", lib.statusAndJSON("get", "/users", lib.getCookie(false), null, 200, function(response, body) {
            it("should be an empty array", function() {
                body().should.be.instanceOf(Array);
                body().length.should.be.exactly(0);
            });
        }));
        describe("Valid user with permission", lib.statusAndJSON("get", "/users", lib.getCookie(true), null, 200, function(response, body) {
            it("should be an array", function() {
                body().should.be.instanceOf(Array);
            });

            describe("each user is valid", function() {
                it("each has an _id", function() {
                    body().forEach(function(user) {
                        user._id.should.match(/[0-9a-zA-Z]{24}/);
                    });
                });

                it("each has a name", function() {
                    body().forEach(function(user) {
                        user.name.should.be.a.string;
                        user.name.should.be.ok;
                    });
                });

                it("each has an email", function() {
                    body().forEach(function(user) {
                        user.email.should.be.a.string;
                        user.email.should.be.ok;
                    });
                });

                it("each has valid permissions", function() {
                    body().forEach(function(user) {
                        user.permissions.should.be.instanceOf(Object);
                        Object.keys(user.permissions).forEach(function(p) {
                            user.permissions[p].should.be.a.boolean;
                        });
                    });
                });
            });
        }));
    });

    describe("Edit a user", function() {
        userIDs.forEach(function(userID) {
            var urlFn = function() {
                return "/users/" + userID.fn();
            };

            describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, null, 401));
            describe("Valid user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), null, 401));

            describe("Valid user with permission", function() {
                describe("With no user", lib.statusAndJSON("put", urlFn, lib.getCookie(true), null, 400));
                describe("With an empty user", lib.statusAndJSON("put", urlFn, lib.getCookie(true), { }, 400));
                describe("With a non-string name", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ name: 7 }), 400));
                describe("With a zero-length name", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ name: "" }), 400));
                describe("With a non-string email", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ email: 7 }), 400));
                describe("With a zero-length email", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ email: "" }), 400));
                describe("With an invalid email", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ email: "bob" }), 400));
                describe("With a non-object permissions", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ permissions: 0 }), 400));
                describe("With a non-boolean shows permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ permissions: { shows: 7 } }), 400));
                describe("With a non-boolean classes permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ permissions: { classes: 7 } }), 400));
                describe("With a non-boolean pictures permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ permissions: { pictures: 7 } }), 400));
                describe("With a non-boolean calendar permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ permissions: { calendar: 7 } }), 400));
                describe("With a non-boolean links permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ permissions: { links: 7 } }), 400));
                describe("With a non-boolean officers permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ permissions: { officers: 7 } }), 400));
                describe("With a non-boolean users permission", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser.mod({ permissions: { users: 7 } }), 400));
                describe("With a valid user", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validUser, userID.successStatus));
            });
        });
    });
    //*/

    // This tests the first step of a user resetting
    // their password.  It generates a new initialization
    // password and sends them an email.  They will be
    // instructed to reset their password.
    describe("Request a user password reset", function() {
        describe("With no object", lib.statusAndJSON("put", "/auth/local/reset", null, null, 400));
        describe("With an empty object", lib.statusAndJSON("put", "/auth/local/reset", null, { }, 400));
        describe("With a fake email", lib.statusAndJSON("put", "/auth/local/reset", null, { email: "bob" }, 404));
        describe("With a real email", lib.statusAndJSON("put", "/auth/local/reset", null, { email: lib.getEmail() }, 200));
    });

    // This tests email validation, basically.  The
    // initialization token is emailed when a user
    // is created.  This does NOT change the user's
    // password, but sets up the state necessary
    // for them to do the reset.
    describe("Validate a user initialization token", function() {
        //"/auth/local/validate/:userID/:validationCode"
        var token;
        var userID;

        var getToken = function() {
            return token;
        };

        before(function(done) {
            db.users.findOne({ _id: getCreatedUserID() }, function(err, user) {
                token = require("crypto").randomBytes(16).toString("hex");
                user.local.secret = "---init---" + bcrypt.hashSync(token);
                user.save(function() {
                    userID = user._id;
                    done();
                });
            });
        });

        var urlFn = function(withToken) {
            return function() {
                return "/auth/local/validate/" + getCreatedUserID() + "/" + (withToken ? getToken() : "abcd1234abcd1234abcd1234abcd1234");
            };
        };

        describe("With an invalid user ID and fake token", lib.statusAndJSON("get", "/auth/local/validate/abcd1234/abcd1234", null, null, 400));
        describe("With a valid but fake user ID and fake token", lib.statusAndJSON("get", "/auth/local/validate/abcd1234abcd1234abcd1234/abcd1234", null, null, 404));
        describe("With a valid and real user ID but fake token", lib.statusAndJSON("get", urlFn(false), null, null, 403));
        describe("With a valid and real user ID and real token", function() {

            var _response;
            var _body;

            before(function(done) {
                request.get({ url: lib.getFullURL(urlFn(true)()), followRedirect: false }, function(err, res, body) {
                    _response = res;
                    _body = body;
                    done();
                });
            });

            it("should return a 302 status code", function() {
                _response.statusCode.should.be.exactly(302);
            });

            it("returns a session", function() {
                _response.headers["set-cookie"].should.be.instanceOf(Array);
                _response.headers["set-cookie"].length.should.be.ok;
                var cookie = _response.headers["set-cookie"][0];
                cookie = cookie.substr(0, cookie.indexOf(";"));
                cookie.should.be.ok;
                resetSessionCookie = cookie;
            });

            it("redirects to /#/resetPassword", function() {
                _response.headers["location"].should.be.exactly("/#/resetPassword");
            });
        });
    });

    // This tests actually resetting the password,
    // which requires having validated a token
    // previously.  The session on the server retains
    // the information about the reset process, so
    // that session must be restored for this to
    // work.
    describe("Reset a user's password", function() {
        function getCookie(valid) {
            return function() {
                return (valid ? resetSessionCookie : "session=asdfasdfasdf");
            }
        }

        describe("With no session or body", lib.statusAndJSON("put", "/auth/local/resetPassword", null, null, 400));
        describe("With an invalid session and no body", lib.statusAndJSON("put", "/auth/local/resetPassword", getCookie(false), null, 400));
        describe("With a valid session", function() {
            describe("With no body", lib.statusAndJSON("put", "/auth/local/resetPassword", getCookie(true), null, 400));
            describe("With an empty body", lib.statusAndJSON("put", "/auth/local/resetPassword", getCookie(true), { }, 400));
            describe("With a new secret", lib.statusAndJSON("put", "/auth/local/resetPassword", getCookie(true), { secret: "asdf" }, 200));
        });
        describe("With a valid session that is not in reset mode", lib.statusAndJSON("put", "/auth/local/resetPassword", getCookie(true), null, 403));
    });

    describe("Delete a user", function() {
        userIDs.forEach(function(userID) {
            var urlFn = function() {
                return "/users/" + userID.fn();
            };

            describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
            describe("Valid user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
            describe("Valid user with permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, userID.successStatus));
        });
    });
});
