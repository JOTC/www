var should = require("should");
var request = require("request");

request.delete = request.del;

var createdClassID;
function getCreatedClassID() {
	return createdClassID;
};

var classType;
function getClassType() {
	return classType;
};

var lib = require("./lib");
lib.init();

describe("Classes API", function() {
	describe("List class types", lib.statusAndJSON("get", "/classes/types", null, null, 200, function(response, body) {
		describe("Returns valid class types", function() {
			it("returns an array", function() {
				body().should.be.instanceOf(Array);
				body().length.should.be.above(0);
				classType = body()[0];
			});
			
			it("each has an _id", function() {
				body().forEach(function(classType) {
					classType._id.should.match(/[0-9a-zA-Z]{24}/);
				});
			});
			
			it("each has a name", function() {
				body().forEach(function(classType) {
					classType.name.should.be.ok;
					classType.name.should.be.a.string;
				});
			});
			
			it("each has a description", function() {
				body().forEach(function(classType) {
					classType.description.should.be.ok;
					classType.description.should.be.a.string;
				});
			});
			
			it("each has an advanced flag", function() {
				body().forEach(function(classType) {
					classType.isAdvanced.should.be.a.bool;
				});
			});
		});
	}));
	
	describe("Create a class", function() {
		var validClass = {
			location: "A place",
			startDate: new Date(),
			numberOfWeeks: 6,
			hoursPerWeek: 1,
			classTypes: [ ]
		};
		
		before(function() {
			validClass.classTypes.push(getClassType());
		});
		
		describe("Unauthenticated", lib.statusAndJSON("post", "/classes", null, validClass, 401));
		describe("As a valid user without permission", lib.statusAndJSON("post", "/classes", lib.getCookie(false), validClass, 401));
		describe("As a valid user with permission", function() {
			
			var invalidCases = {
				"with no class": null,
				"with empty class": { },
				"missing location": { startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"non-string location": { location: 7, startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"missing startDate": { location: "place", numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"non-date startDate": { location: "place", startDate: "bob", numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"missing numberOfWeeks": { location: "place", startDate: new Date(), hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"non-numeric numberOfWeeks": { location: "place", startDate: new Date(), numberOfWeeks: "hello", hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"missing hoursPerWeek": { location: "place", startDate: new Date(), numberOfWeeks: 6, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"non-numeric hoursPerWeek": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: "hello", classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"missing classTypes": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1 },
				"class type missing _id": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ name: "asdf", description: "asdf", isAdvanced: false }] },
				"class type missing name": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", description: "asdf", isAdvanced: false }] },
				"class type missing description": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", isAdvanced: false }] },
				"class type missing isAdvanced": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf" }] }
			};
			
			Object.keys(invalidCases).forEach(function(name) {
				describe(name, lib.statusAndJSON("post", "/classes", lib.getCookie(true), invalidCases[name], 400));
			});
			
			describe("with a valid class", lib.statusAndJSON("post", "/classes", lib.getCookie(true), validClass, 200, function(response, body) {
				describe("returns a valid class", function() {
					it("has an _id", function() {
						body()._id.should.match(/[0-9a-zA-Z]{24}/);
						createdClassID = body()._id;
					});
					
					it("has a location", function() {
						body().location.should.be.ok;
						body().location.should.be.a.string;
					});
					
					it("has a number of weeks", function() {
						body().numberOfWeeks.should.be.a.number;
					});
					
					it("has a number of hours per week", function() {
						body().hoursPerWeek.should.be.a.number;
					});
					
					it("has a valid start date", function() {
						body().startDate.should.be.a.string;
						Date.parse(body().startDate).should.be.ok;
					});
					
					it("has a valid end date", function() {
						body().endDate.should.be.a.string;
						Date.parse(body().endDate).should.be.ok;
					});
					
					describe("it has valid class types", function() {
						it("each has an _id", function() {
							body().classTypes.forEach(function(classType) {
								classType._id.should.match(/[0-9a-zA-Z]{24}/);
							});
						});

						it("each has a name", function() {
							body().classTypes.forEach(function(classType) {
								classType.name.should.be.ok;
								classType.name.should.be.a.string;
							});
						});

						it("each has a description", function() {
							body().classTypes.forEach(function(classType) {
								classType.description.should.be.ok;
								classType.description.should.be.a.string;
							});
						});

						it("each has an isAdvanced flag", function() {
							body().classTypes.forEach(function(classType) {
								classType.isAdvanced.should.be.a.bool;
							});
						});
					});
				});
			}));
		});
	});
	
	describe("Get list of classes", lib.statusAndJSON("get", "/classes", null, null, 200, function(response, body) {
		it("returns a list", function() {
			body().should.be.instanceOf(Array);
		});
		
		describe("each is valid", function() {
			it("each has an _id", function() {
				body().forEach(function(cl) {
					cl._id.should.match(/[0-9a-zA-Z]{24}/);
				});
			});
			
			it("each has a location", function() {
				body().forEach(function(cl) {
					cl.location.should.be.ok;
					cl.location.should.be.a.string;
				});
			});
		});
	}));
	
	describe("Edit a class", function() {
		var validClass = {
			location: "A place",
			startDate: new Date(),
			numberOfWeeks: 6,
			hoursPerWeek: 1,
			classTypes: [ ]
		};
		
		var urlFn = function() {
			return "/classes/" + getCreatedClassID();
		};
		
		before(function() {
			validClass.classTypes.push(getClassType());
		});
		
		describe("Unauthenticated", lib.statusAndJSON("put", urlFn, null, validClass, 401));
		describe("As a valid user without permission", lib.statusAndJSON("put", urlFn, lib.getCookie(false), validClass, 401));
		describe("As a valid user with permission", function() {
			
			var invalidCases = {
				"with no class": null,
				"with empty class": { },
				"missing location": { startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"non-string location": { location: 7, startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"missing startDate": { location: "place", numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"non-date startDate": { location: "place", startDate: "bob", numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"missing numberOfWeeks": { location: "place", startDate: new Date(), hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"non-numeric numberOfWeeks": { location: "place", startDate: new Date(), numberOfWeeks: "hello", hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"missing hoursPerWeek": { location: "place", startDate: new Date(), numberOfWeeks: 6, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"non-numeric hoursPerWeek": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: "hello", classTypes: [{ _id: "asdf", name: "asdf", description: "asdf", isAdvanced: false }] },
				"missing classTypes": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1 },
				"class type missing _id": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ name: "asdf", description: "asdf", isAdvanced: false }] },
				"class type missing name": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", description: "asdf", isAdvanced: false }] },
				"class type missing description": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", isAdvanced: false }] },
				"class type missing isAdvanced": { location: "place", startDate: new Date(), numberOfWeeks: 6, hoursPerWeek: 1, classTypes: [{ _id: "asdf", name: "asdf", description: "asdf" }] }
			};
			
			Object.keys(invalidCases).forEach(function(name) {
				describe(name, lib.statusAndJSON("put", urlFn, lib.getCookie(true), invalidCases[name], 400));
			});
			
			describe("with a valid class", function() {
				describe("with an invalid ID", lib.statusAndJSON("put", "/classes/abcd1234", lib.getCookie(true), validClass, 400));
				describe("with a valid but fake ID", lib.statusAndJSON("put", "/classes/abcd1234abcd1234abcd1234", lib.getCookie(true), validClass, 404));
				describe("with a valid and real ID", lib.statusAndJSON("put", urlFn, lib.getCookie(true), validClass, 200));
			});
		});
	});
	
	describe("Add a registration form to a class", function() { });
	
	describe("Delete a registration form from a class", function() { });
	
	describe("Delete a class", function() {
		var urlFn = function() {
			return "/classes/" + getCreatedClassID();
		};

		describe("Unauthenticated", lib.statusAndJSON("delete", urlFn, null, null, 401));
		describe("As a valid user without permission", lib.statusAndJSON("delete", urlFn, lib.getCookie(false), null, 401));
		describe("As a valid user with permission", function() {
			describe("With invalid ID", lib.statusAndJSON("delete", "/classes/abcd1234", lib.getCookie(true), null, 400));
			describe("With a valid but fake ID", lib.statusAndJSON("delete", "/classes/abcd1234abcd1234abcd1234", lib.getCookie(true), null, 404));
			describe("With a valid and real ID", lib.statusAndJSON("delete", urlFn, lib.getCookie(true), null, 200));
		});
	});
});