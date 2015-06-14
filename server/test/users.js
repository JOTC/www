var should = require("should");
var request = require("request");
request.delete = request.del;

var createdOfficerID;
function getCreatedOfficerID() {
	return createdOfficerID;
};

var lib = require("./lib");
lib.init();

describe("Users API", function() {
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

    describe("Create a user", function() {
        describe("Unauthenticated", lib.statusAndJSON("post", "/users", null, null, 401));
        describe("Valid user without permission", lib.statusAndJSON("post", "/users", lib.getCookie(false), null, 401));

        describe("Valid user with permission", function() {

            var validUser = {
                name: "test-created-user",
                email: "em@il.com",
                permissions: {
                    shows: false,
                    classes: false,
                    pictures: false,
                    calendar: false,
                    links: false,
                    officers: false,
                    users: false
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
            describe("With a valid user", lib.statusAndJSON("post", "/users", lib.getCookie(true), validUser, 200));
        });
    });
});
