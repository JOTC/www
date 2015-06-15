var should = require("should");
var request = require("request");

request.delete = request.del;

var createdEventID;
function getCreatedEventID() {
	return createdEventID;
};

var lib = require("./lib");
lib.init();

describe("Calendar API", function() {
	describe("Create calendar event", function() {
		
		describe("Unauthenticated", lib.statusAndJSON("post", "/calendar", null, null, 401));
		describe("Real user without permission", lib.statusAndJSON("post", "/calendar", lib.getCookie(false), null, 401));

		describe("Real user with permission", function() {		
			[
				{ name: "No event", value: null },
				{ name: "Empty object", value: { } },
				{ name: "Valid start date, non-string title", value: { title: 7, startDate: new Date() }},
				{ name: "Valid title, non-date start date", value: { title: "Title", startDate: "bob" }},
				{ name: "Valid title and start date, non-date end date", value: { title: "Title", startDate: new Date(), endDate: "bob" }},
			].forEach(function(event) {
				describe(event.name, lib.statusAndJSON("post", "/calendar", lib.getCookie(true), event.value, 400));
			});
			
			describe("Valid event", lib.statusAndJSON("post", "/calendar", lib.getCookie(true), { title: "Test Calendar Event", startDate: new Date() }, 200, function(response, body) {

				describe("Returns a valid event", function() {
					it("has an _id", function() {
						body()._id.should.match(/[0-9a-zA-Z]{24}/);
						createdEventID = body()._id;
					});
					
					it("has a title", function() {
						body().title.should.be.ok;
						body().title.should.be.a.string;
					});
					
					it("has a start date", function() {
						body().startDate.should.be.ok;
						body().startDate.should.be.a.string;
						Date.parse(body().startDate).should.not.be.NaN;
					});
					
					it("has an end date", function() {
						body().endDate.should.be.ok;
						body().endDate.should.be.a.string;
						Date.parse(body().endDate).should.not.be.NaN;
					});
				});
			}));
		});
	});
	
	describe("Get list", lib.statusAndJSON("get", "/calendar", null, null, 200, function(response, body) {		
		it("returns an array", function() {
			body().should.be.instanceOf(Array);
		});
		
		describe("Returns valid events", function() {
			it("each has an _id", function() {
				body().forEach(function(event) {
					event._id.should.match(/[0-9a-zA-Z]{24}/);
				});
			});
			
			it("each has a title", function() {
				body().forEach(function(event) {
					event.title.should.be.okay;
					event.title.should.be.a.string;
				});
			});
			
			it("each has a start date", function() {
				body().forEach(function(event) {
					event.startDate.should.be.ok;
					event.startDate.should.be.a.string;
					Date.parse(event.startDate).should.not.be.NaN;
				});
			});

			it("each has a end date", function() {
				body().forEach(function(event) {
					event.endDate.should.be.ok;
					event.endDate.should.be.a.string;
					Date.parse(event.endDate).should.not.be.NaN;
				});
			});
		});
	}));
	
	describe("Delete event", function() {
		var urlFn = function() { return "/calendar/" + getCreatedEventID(); }
		
		describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
		describe("Real user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
		describe("Real user with permissions", function() {
			describe("Invalid event ID", lib.statusAndJSON("delete", "/calendar/abcd1234", lib.getCookie(true), null, 400));
			describe("Valid but fake event ID", lib.statusAndJSON("delete", "/calendar/abcd1234abcd1234abcd1234", lib.getCookie(true), null, 404));
			describe("Valid but fake event ID", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 200));
		});
	});
});