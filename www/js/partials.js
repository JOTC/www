angular.module('jotc-partials', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('jotc/sections/about/edit-officer.template.html',
    "<div class=\"modal-header\">{{ action }} Officer</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "<form>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Name</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"officer.name\">\n" +
    "\t\t<div class=\"alert alert-danger\" ng-show=\"officer.name === ''\">Name is required</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Titles</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-repeat=\"title in titles\" ng-model=\"title.value\">\n" +
    "\t\t<button class=\"btn btn-primary\" ng-click=\"addTitle()\">Add Title</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Contacts</label>\n" +
    "\t\t<div ng-repeat=\"contact in officer.contacts\">\n" +
    "\t\t\t<hr ng-if=\"$index > 0\">\n" +
    "\t\t\t<label><input type=\"radio\" name=\"contact-type-{{ $index }}\" ng-model=\"contact.type\" value=\"email\"> Email</label>\n" +
    "\t\t\t<label><input type=\"radio\" name=\"contact-type-{{ $index }}\" ng-model=\"contact.type\" value=\"phone\"> Phone</label>\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"contact.value\">\n" +
    "\t\t</div>\n" +
    "\t\t<button class=\"btn btn-primary\" ng-click=\"addContact()\">Add Contact</button>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/about/template.html',
    "<div id=\"about\">\n" +
    "\t<div class=\"title\">About JOTC</div>\n" +
    "\n" +
    "\t<div class=\"table\" style=\"width: 100%; table-layout: fixed;\">\n" +
    "\t\t<div class=\"cell\" style=\"padding-right: 10px;\">\n" +
    "\t\t\t<div style=\"text-align: center; margin-bottom: 15px; font-size: 1.5em; \">Club Activities</div>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>Monthly Member Meetings</li>\n" +
    "\t\t\t\t<li>Training classes held twice in the spring and twice in the fall</li>\n" +
    "\t\t\t\t<li>Two-day AKC Obedience trials held in the summer of each year</li>\n" +
    "\t\t\t\t<li>Annual awards banquet to honor members who have achieved new titles in various dog events during the year</li>\n" +
    "\t\t\t\t<li>Christmas party and \"fun match,\" a \"practice trial\" for club members to enjoy the holidays together</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"cell\" style=\"padding-left: 10px; border-left: 1px solid #AAA;\">\n" +
    "\t\t\t<div style=\"text-align: center; margin-bottom: 15px; font-size: 1.5em;\">Newsletter and Meetings</div>\n" +
    "\n" +
    "\t\t\tThe Jackson Obedience Training Club sponsors a monthly newsletter for its members.  The newsletter incldues\n" +
    "\t\t\tclub news, upcoming events, and informative articles of interest to all dog owners.  The club has been\n" +
    "\t\t\tpublishing its newsletter since 1987.  Non-members may subscribe to the newsletter by sending $12 in check,\n" +
    "\t\t\tpayable to JOTC, to:\n" +
    "\t\t\t<br><br>\n" +
    "\t\t\tJackson Obedience Training Club<br>\n" +
    "\t\t\tPO Box 193<br>\n" +
    "\t\t\tJackson, MS 39205\n" +
    "\t\t\t<br><br>\n" +
    "\t\t\tMeetings are held on the second Monday of the month.  For information about meeting places, times and\n" +
    "\t\t\tdirections, call the Dog Line at <span class=\"bold\">(601) 352-DOGS (3647)</span>.\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div>\n" +
    "\t\t<div style=\"text-align: center; margin: 15px 0; font-size: 1.5em; \">JOTC Officers</div>\n" +
    "\t\t<div ng-show=\"auth.officers\" class=\"center\">\n" +
    "\t\t\t<button class=\"btn btn-success\" ng-click=\"editOfficer()\">New Officer</button>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"officers table\">\n" +
    "\t\t\t<div ng-repeat=\"officer in officers\" class=\"row officer\">\n" +
    "\t\t\t\t<div ng-if=\"auth.officers\" class=\"editBox cell\">\n" +
    "\t\t\t\t\t<button class=\"btn btn-primary\" ng-click=\"editOfficer(officer);\">Edit</button>\n" +
    "\t\t\t\t\t<button class=\"btn btn-danger\" ng-click=\"deleteOfficer(officer);\">Delete</button>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"cell officerTitle\">\n" +
    "\t\t\t\t\t<div ng-repeat=\"title in officer.titles\">{{ title }}</div>\n" +
    "\t\t\t\t\t<span ng-if=\"officer.titles.length === 0\">&nbsp;</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"cell officerName\">{{ officer.name }}</div>\n" +
    "\t\t\t\t<div class=\"cell officerContact\">\n" +
    "\t\t\t\t\t<div ng-repeat=\"contact in officer.contacts\">\n" +
    "\t\t\t\t\t\t<a ng-show=\"contact.type == 'email'\" href=\"mailto:{{ contact.value }}\">Email ({{ contact.value }})</a>\n" +
    "\t\t\t\t\t\t<span ng-show=\"contact.type == 'phone'\">Phone ({{ contact.value }})</span>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<span ng-if=\"officer.contacts.length === 0\">&nbsp;</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('jotc/sections/calendar/edit-calendar.template.html',
    "<div class=\"modal-header\">{{ action }} Calendar Event</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "<form>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Title</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"event.title\">\n" +
    "\t\t<div class=\"alert alert-danger\" ng-show=\"event.title === ''\">Title is required</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Description</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"event.description\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Location</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"event.location\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Link</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"event.link\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Start Date</label>\n" +
    "\t\t<div class=\"input-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"event.startDate\" disabled datepicker-popup=\"dd MMM yyyy\" is-open=\"dateOpen.start\" min-date=\"\">\n" +
    "\t\t\t<span class=\"input-group-btn\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" style=\"height: 34px;\" ng-click=\"dateOpen.open('start', $event);\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"alert alert-danger\" ng-show=\"event.startDate === null\">Start date is required</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>End Date</label>\n" +
    "\t\t<div class=\"input-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"event.endDate\" disabled datepicker-popup=\"dd MMM yyyy\" is-open=\"dateOpen.end\" min-date=\"event.startDate\">\n" +
    "\t\t\t<span class=\"input-group-btn\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" style=\"height: 34px;\" ng-click=\"dateOpen.open('end', $event);\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/calendar/popup.template.html',
    "<div class=\"modal-header\">{{ event.title }} - {{ dateRange }}</div>\n" +
    "\n" +
    "<div class=\"modal-body calendar-popup\">\n" +
    "\n" +
    "\t<div class=\"date\">{{ dateRange }}</div>\n" +
    "\n" +
    "\t<div class=\"description\" ng-if=\"event.description\">{{ event.description }}</div>\n" +
    "\n" +
    "\t<div class=\"map\" ng-if=\"event.location\">\n" +
    "\t\t{{ event.location }}<br><br>\n" +
    "\t\t<a href=\"{{ $location.getDirectionsURLForLocation(event.location) }}\" target=\"_blank\">\n" +
    "\t\t\t<img ng-src=\"{{ $location.getImageURLForLocation(event.location); }}\">\n" +
    "\t\t\t<br>\n" +
    "\t\t\tClick for directions\n" +
    "\t\t</a>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"link\" ng-if=\"event.link\"><a ng-href=\"{{ event.link }}\">Click for more information<br>{{ event.link }}</a></div>\n" +
    "\t\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"close()\">Close</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/calendar/template.html',
    "<div id=\"calendar\">\n" +
    "\t<div class=\"title\">Calendar of Events</div>\n" +
    "\t\n" +
    "\t<div class=\"center auth\" ng-if=\"auth.calendar\">\n" +
    "\t\t<button class=\"btn btn-success\" ng-click=\"editEvent()\">New Event</button>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"table\">\n" +
    "\t\t<div class=\"cal-row\">\n" +
    "\t\t\t<div class=\"cell header\" ng-repeat=\"day in daysOfTheWeek\">{{ day }}</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"cal-row\" ng-repeat=\"week in weeks\">\n" +
    "\t\t\t<div class=\"cell value\" ng-repeat=\"day in week\">\n" +
    "\t\t\t\t<div class=\"date\">{{ day.date }}</div>\n" +
    "\t\t\t\t<div class=\"month\" ng-if=\"day.month\">{{ day.month }}</div>\n" +
    "\t\t\t\t<div class=\"event\" ng-repeat=\"event in events[day.do]\" ng-class=\"event.type\" ng-click=\"gotoEvent(event)\">\n" +
    "\t\t\t\t\t{{ event.title }}\n" +
    "\t\t\t\t\t<div ng-if=\"auth.calendar && event.type === 'calendar'\">\n" +
    "\t\t\t\t\t\t<button class=\"btn btn-primary\" ng-click=\"editEvent(event, $event)\">Edit</button>\n" +
    "\t\t\t\t\t\t<button class=\"btn btn-danger\" ng-click=\"deleteEvent(event, $event)\">Delete</button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/classes/edit-class.template.html',
    "<div class=\"modal-header\">{{ action }} Show</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "<form>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Start Date</label>\n" +
    "\t\t<div class=\"input-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"editClass.startDate\" disabled datepicker-popup=\"dd MMM yyyy\" is-open=\"date.start\" min-date=\"\">\n" +
    "\t\t\t<span class=\"input-group-btn\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" style=\"height: 34px;\" ng-click=\"date.open('start', $event)\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Location</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"editClass.location\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Weeks</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"editClass.numberOfWeeks\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Hours</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"editClass.hoursPerWeek\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Time</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"editClass.timeOfDay\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Day</label>\n" +
    "\t\t{{ getDayOfWeek() }}\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Classes</label>\n" +
    "\t\t<div class=\"input-group container\">\n" +
    "\t\t\t<div class=\"row\" ng-repeat=\"row in getClassesByRow()\">\n" +
    "\t\t\t\t<div class=\"col-md-4\" ng-repeat=\"class in row\">\n" +
    "\t\t\t\t\t<label class=\"control-label\" style=\"margin-left: 1em; text-indent: -1em;\"><input type=\"checkbox\" ng-model=\"classesChecked[class._id]\" ng-change=\"toggleClass(class)\"> {{ class.name }}</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/classes/template.html',
    "<div id=\"classes\">\n" +
    "\t<div class=\"title\">JOTC Obedience Classes</div>\n" +
    "\n" +
    "\t<div class=\"container-flud\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<div class=\"col-md-6\">\n" +
    "\t\t\t\t<div class=\"header\">JOTC Class Times and Locations</div>\n" +
    "\n" +
    "\t\t\t\tJOTC currently offers classes four times a year: twice in the spring and twice in the fall.  North\n" +
    "\t\t\t\tclasses are conducted through the city of Ridgeland and are held at the Old Trace Park on the\n" +
    "\t\t\t\tReservoir at Fowler Lodge.  These classes usually begin the last Tuesday in March and the last\n" +
    "\t\t\t\tTuesday in August.  South classes are currently being held at the old Home Depot location\n" +
    "\t\t\t\ton Robinson Road in Jackson.  These usually begin the first Thursday in April and the second Thursday\n" +
    "\t\t\t\tin September.  These classes last about an hour one night a week for 6 weeks, including a graduation\n" +
    "\t\t\t\tnight.\n" +
    "\t\t\t\t<br><br>\n" +
    "\t\t\t\tFor more information about JOTC classes, please call the Dog Line at <span class=\"bold\">(601) 352-DOGS (3647)</span>.\n" +
    "\n" +
    "\t\t\t\t<div class=\"header\">JOTC Classes</div>\n" +
    "\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li ng-repeat=\"type in classTypes\"><span class=\"bold\">{{ type.name }}</span> ({{ type.prerequisite }}): {{ type.description }}</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t\n" +
    "\t\t\t<div class=\"col-md-6\">\n" +
    "\t\t\t\t<div class=\"header\">Upcoming Classes</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t<div ng-if=\"auth.classes\" class=\"auth\">\n" +
    "\t\t\t\t\t<button class=\"btn btn-success\" ng-click=\"editClass()\">New Class</button>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div ng-repeat=\"class in classes\" class=\"class\">\n" +
    "\t\t\t\t\t<div class=\"date\">\n" +
    "\t\t\t\t\t\tStarting {{ getStartDate(class); }}\n" +
    "\t\t\t\t\t\t<span ng-if=\"auth.canEditClasses\" class=\"editBox\">[ <span ng-click=\"classes.edit(class);\">edit</span> | <span ng-click=\"classes.remove(class);\">delete</span> ]</span>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"map\">\n" +
    "\t\t\t\t\t\t<a href=\"{{ $location.getDirectionsURLForLocation(class.location) }}\" target=\"_blank\">\n" +
    "\t\t\t\t\t\t\t<img ng-src=\"{{ $location.getImageURLForLocation(class.location); }}\">\n" +
    "\t\t\t\t\t\t\t<br>\n" +
    "\t\t\t\t\t\t\tClick for directions\n" +
    "\t\t\t\t\t\t</a>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"location\">\n" +
    "\t\t\t\t\t\t{{ class.location }}\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"description\">\n" +
    "\t\t\t\t\t\t<span ng-repeat=\"description in getDescriptionBlocks(class)\">\n" +
    "\t\t\t\t\t\t\t<span ng-if=\"$index > 0\"><br><br></span>\n" +
    "\t\t\t\t\t\t\t{{ description }}\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t<div ng-if=\"class.registrationFormPath\" class=\"premiumList\">\n" +
    "\t\t\t\t\t\t<a class=\"btn btn-success download\" ng-href=\"{{ class.registrationFormPath }}\">Download Registration Form</a>\n" +
    "\t\t\t\t\t\t<button ng-if=\"auth.classes\" class=\"btn btn-danger\" ng-click=\"deleteRegistrationForm(class)\">Delete Registration Form</button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\n" +
    "\t\t\t\t\t<div drag-drop-file-uploader ng-if=\"auth.classes && !class.registrationFormPath\" obj-type=\"classes\" obj=\"class\" doc-type=\"registrationForm\" doc-name=\"registration form\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<div ng-if=\"auth.classes\" style=\"text-align: right; padding: 10px;\">\n" +
    "\t\t\t\t\t\t<button class=\"btn btn-primary\" ng-click=\"editClass(class)\">Edit</button> <button class=\"btn btn-danger\" ng-click=\"deleteClass(class)\">Delete</button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<div class=\"col-md-12\">\n" +
    "\t\t\t\t<div class=\"clear header\" style=\"margin-top: 25px;\">General Information</div>\n" +
    "\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li>Instructors for all classes are required to meet specific criteria, must hold at least\n" +
    "\t\t\t\t\t\tone obedience title on a dog, and attend continuing education seminars and training.</li>\n" +
    "\t\t\t\t\t<li>Pre-registration is requested for all classes in order to ensure proper class sizes.</li>\n" +
    "\t\t\t\t\t<li>Proof of vaccination is required.  Rabies vaccination must have been given by a\n" +
    "\t\t\t\t\t\tlicensed veterinarian.</li>\n" +
    "\t\t\t\t\t<li>All Basic Obedience classes are divided according to dogs' sizes.  Classes include small,\n" +
    "\t\t\t\t\t\tmedium, and large dogs.  This way, your small dog will not be intimidated by a larger\n" +
    "\t\t\t\t\t\tdog, and your large dog won't be distracted by a smaller one.</li>\n" +
    "\t\t\t\t\t<li>Our classes are small, usually with about 12 dogs per class.  Each student will receive\n" +
    "\t\t\t\t\t\tthe individual attention necessary to help you fully understand each exercise as well\n" +
    "\t\t\t\t\t\tas successfully work through any training problems you encounter.</li>\n" +
    "\t\t\t\t\t<li>Obedience classes last six weeks and are held for one hour a night, one night a week.\n" +
    "\t\t\t\t\t\tRally classes last eight weeks.</li>\n" +
    "\t\t\t\t\t<li>During class, you will be the one to train you dog, under the guidance of our\n" +
    "\t\t\t\t\t\tinstructors.  We feel this approach is better for you and your dog than sending\n" +
    "\t\t\t\t\t\tyour dog to a boarding school to be trained by someone else for the following reasons:\n" +
    "\n" +
    "\t\t\t\t\t\t<ul>\n" +
    "\t\t\t\t\t\t\t<li>If your dog is trained by someone else, he will learn to respond and respect\n" +
    "\t\t\t\t\t\t\t\tthem, but will still need to learn to mind you.  You will have to learn how\n" +
    "\t\t\t\t\t\t\t\tto communicate with your dog and enforce your commands before the dog will\n" +
    "\t\t\t\t\t\t\t\ttake you seriously.  The easiest way to accomplish this is to learn what to\n" +
    "\t\t\t\t\t\t\t\tdo and train the dog yourself.</li>\n" +
    "\t\t\t\t\t\t\t<li>Sending your dog to live with someone else for several weeks or months is\n" +
    "\t\t\t\t\t\t\t\tstressful for you and your dog.  Training with your dog is fun for both of\n" +
    "\t\t\t\t\t\t\t\tyou.</li>\n" +
    "\t\t\t\t\t\t\t<li>If you are the one training your dog, you can be assured that your dog is\n" +
    "\t\t\t\t\t\t\t\tlearning through a consistent and positive approach.</li>\n" +
    "\t\t\t\t\t\t\t<li>Training builds a relationship between you and your dog.  You will find that\n" +
    "\t\t\t\t\t\t\t\tyou become closer and enjoy your dog's company more when he is under control\n" +
    "\t\t\t\t\t\t\t\tand you can make him behave.  If you send your dog to be trained, you lose\n" +
    "\t\t\t\t\t\t\t\tthe bonding that comes with learning.</li>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<li>Training your dog in a group setting will give him the opportunity to learn\n" +
    "\t\t\t\t\t\t\t\thow to behave aground a number of people and dogs.  You will also learn how\n" +
    "\t\t\t\t\t\t\t\tto read your dog.</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t<li>JOTC welcomes all breeds of dogs to classes, regardless of whether the dog is a purebreed\n" +
    "\t\t\t\t\t\tor mixed.  <span class=\"bold\">HOWEVER, JOTC does not allow wolves or wolf hybrids\n" +
    "\t\t\t\t\t\t\t\tin any of its classes.</span></li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<!--div class=\"table\">\n" +
    "\t\t<div class=\"cell\">\n" +
    "\n" +
    "\t\t\t<div class=\"header\">JOTC Class Times and Locations</div>\n" +
    "\n" +
    "\t\t\tJOTC currently offers classes four times a year: twice in the spring and twice in the fall.  North\n" +
    "\t\t\tclasses are conducted through the city of Ridgeland and are held at the Old Trace Park on the\n" +
    "\t\t\tReservoir at Fowler Lodge.  These classes usually begin the last Tuesday in March and the last\n" +
    "\t\t\tTuesday in August.  South classes are currently being held at the old Home Depot location\n" +
    "\t\t\ton Robinson Road in Jackson.  These usually begin the first Thursday in April and the second Thursday\n" +
    "\t\t\tin September.  These classes last about an hour one night a week for 6 weeks, including a graduation\n" +
    "\t\t\tnight.\n" +
    "\t\t\t<br><br>\n" +
    "\t\t\tFor more information about JOTC classes, please call the Dog Line at <span class=\"bold\">(601) 352-DOGS (3647)</span>.\n" +
    "\n" +
    "\t\t\t<div class=\"header\">JOTC Classes</div>\n" +
    "\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li ng-repeat=\"type in classTypes\"><span class=\"bold\">{{ type.name }}</span> ({{ type.prerequisite }}): {{ type.description }}</li>\n" +
    "\t\t\t</ul>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"cell right\">\n" +
    "\t\t\t<div class=\"header\">Upcoming Classes</div>\n" +
    "\t\t\t<div ng-show=\"auth.canEditClasses\" class=\"addContentButton\">\n" +
    "\t\t\t\t<span ng-click=\"classes.edit();\">[+] new class</span>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div ng-repeat=\"class in classes\" class=\"class\">\n" +
    "\t\t\t\t<div class=\"date\">\n" +
    "\t\t\t\t\tStarting {{ class.startDate | date }}\n" +
    "\t\t\t\t\t<span ng-if=\"auth.canEditClasses\" class=\"editBox\">[ <span ng-click=\"classes.edit(class);\">edit</span> | <span ng-click=\"classes.remove(class);\">delete</span> ]</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"map\">\n" +
    "\t\t\t\t\t<a href=\"{{ $location.getDirectionsURLForLocation(class.location) }}\" target=\"_blank\">\n" +
    "\t\t\t\t\t\t<img ng-src=\"{{ $location.getImageURLForLocation(class.location); }}\">\n" +
    "\t\t\t\t\t\t<br>\n" +
    "\t\t\t\t\t\tClick for directions\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"location\">\n" +
    "\t\t\t\t\t{{ class.location }}\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"description\">\n" +
    "\t\t\t\t\t<span ng-repeat=\"description in getDescriptionBlocks(class)\">\n" +
    "\t\t\t\t\t\t<span ng-if=\"$index > 0\"><br><br></span>\n" +
    "\t\t\t\t\t\t{{ description }}\n" +
    "\t\t\t\t\t</span>\n" +
    "\n" +
    "\t\t\t\t\t<br><br>\n" +
    "\n" +
    "\t\t\t\t\t<span ng-if=\"class.files.length > 0\" class=\"button\"><a href=\"old/data/classes.php?file={{ class.files[0].id }}\" style=\"text-decoration: none; color: black;\">Download Application</a></span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div-->\n" +
    "\n" +
    "\t<div>\n" +
    "\n" +
    "\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/home/template.html',
    "<div id=\"landing\">\n" +
    "\t<div class=\"title\">Welcome to JOTC</div>\n" +
    "\n" +
    "\t<div class=\"table\">\n" +
    "\t\t<div class=\"cell\" style=\"width: 20%;\">\n" +
    "\t\t\t<img style=\"width: 90%; border: 1px solid black; box-shadow: 3px 3px 10px #666;\" ng-src=\"/galleryImages/{{ getRandomImage() }}\"><!--src=\"http://i.imgur.com/pWHNIVMh.jpg\"-->\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<div class=\"cell\">\n" +
    "\t\t\tThe Jackson Obedience Training Club, Inc. (JOTC) is a non-profit organization established\n" +
    "\t\t\tin 1969 and licensed by the American Kennel Club.  The club is dedicated to the advancement\n" +
    "\t\t\tof dog obedience as a sport and the promotion of responsible pet ownership.  JOTC's belief\n" +
    "\t\t\tis that any dog, purebred or mixed-breed, can learn basic obedience commands when taught\n" +
    "\t\t\twith a consistent and positive approach.\n" +
    "\t\t\t<br><br>\n" +
    "\t\t\tJOTC sponsors obedience and rally trials, as well as offering training classes at various\n" +
    "\t\t\ttimes throughout the year.\n" +
    "\t\t\t<br><br>\n" +
    "\t\t\t<span style=\"font-weight: bold;\">Why should you train your dog?</span>\n" +
    "\t\t\t<br>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>To have your dog under control and responsive to your commands.  Wouldn't it be nice\n" +
    "\t\t\t\t\tto call your dog and have him come running to you?</li>\n" +
    "\t\t\t\t<li>To learn how to communicate with your dog so that he knows what you expect of him.\n" +
    "\t\t\t\t\tThis will make the dog's life happier and less stressful.</li>\n" +
    "\t\t\t\t<li>Your dog's quick response to an obedience command could save his life.  If your dog\n" +
    "\t\t\t\t\tis about to rush into traffic or eat something deadly, you want him to understand\n" +
    "\t\t\t\t\tand obey when you tell him to stop.</li>\n" +
    "\t\t\t\t<li>You will build a better, stronger relationship with your dog through training.</li>\n" +
    "\t\t\t\t<li>Your dog will learn to be polite and under control at all times, even in public,\n" +
    "\t\t\t\t\taround other dogs, and with many distractions.</li>\n" +
    "\t\t\t\t<li>Training your dog will reduce the risk of him biting someone, which could result in\n" +
    "\t\t\t\t\ta lawsuit and even your dog being euthanized.  A well-mannered, trained dog teamed\n" +
    "\t\t\t\t\twith a responsible pet owner is absolutely necessary.  Obedience training is a very\n" +
    "\t\t\t\t\tsubtle, non-threatening way of gaining control over a dog that is prone to aggression.\n" +
    "\t\t\t\t\tOnce your dog has been properly socialized and trained, the chances of him biting\n" +
    "\t\t\t\t\tsomeone are significantly reduced.</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"cell calendar\">\n" +
    "\t\t\t<div class=\"header\">Upcoming Events</div>\n" +
    "\t\t\t<div class=\"eventGroup\" ng-repeat=\"eventGroup in events\" ng-if=\"isFuture(eventGroup)\">\n" +
    "\t\t\t\t<div class=\"date\">{{ eventGroup.date | date : 'MMMM d' }}</div>\n" +
    "\t\t\t\t<div class=\"body\" ng-click=\"click(event)\" ng-repeat=\"event in eventGroup.events\">\n" +
    "\t\t\t\t\t{{ event.title }}\n" +
    "\t\t\t\t\t<div class=\"link\">More Information</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/links/edit-group.template.html',
    "<div class=\"modal-header\">{{ action }} Link Group</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "<form>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Name</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"group.name\">\n" +
    "\t\t<div class=\"alert alert-danger\" ng-show=\"group.name === ''\">Name is required</div>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/links/edit-link.template.html',
    "<div class=\"modal-header\">{{ action }} Link</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "<form>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Name</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"link.name\">\n" +
    "\t\t<div class=\"alert alert-danger\" ng-show=\"link.name === ''\">Name is required</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>URL</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"link.url\">\n" +
    "\t\t<div class=\"alert alert-danger\" ng-show=\"link.url === ''\">URL is required</div>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/links/template.html',
    "<div id=\"links\">\n" +
    "\t<div class=\"title\">Useful Links</div>\n" +
    "\t\n" +
    "\t<div ng-if=\"auth.links\" class=\"newButton\">\n" +
    "\t\t<button class=\"btn btn-success\" ng-click=\"edit.group()\">New Group</button>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div id=\"links\" class=\"container-fluid\">\n" +
    "\t\t<div ng-repeat=\"half in getHalves()\" class=\"col-md-6\">\n" +
    "\t\t\t<div ng-repeat=\"group in half\" class=\"linkGroup\">\n" +
    "\t\t\t\t<div class=\"header\">\n" +
    "\t\t\t\t\t{{ group.name }}\n" +
    "\t\t\t\t\t<div class=\"admin\" ng-if=\"auth.links\">\n" +
    "\t\t\t\t\t\t<button class=\"btn btn-success\" ng-click=\"edit.link(group)\">New Link</button>\n" +
    "\t\t\t\t\t\t<button class=\"btn btn-primary\" ng-click=\"edit.group(group)\">Edit</button>\n" +
    "\t\t\t\t\t\t<button class=\"btn btn-danger\" ng-click=\"delete.group(group)\">Delete</button>\n" +
    "\t\t\t\t\t\t<button ng-if=\"group.ordering > 0\" class=\"btn btn-success\" ng-click=\"up.group(group)\"><i class=\"fa fa-arrow-up\"></i></button>\n" +
    "\t\t\t\t\t\t<button ng-if=\"group.ordering < (groups.length - 1)\" class=\"btn btn-success\" ng-click=\"down.group(group)\"><i class=\"fa fa-arrow-down\"></i></button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li ng-repeat=\"link in group.links\">\n" +
    "\t\t\t\t\t\t<button ng-if=\"auth.links\" class=\"btn btn-primary\" ng-click=\"edit.link(group, link)\">Edit</button>\n" +
    "\t\t\t\t\t\t<button ng-if=\"auth.links\" class=\"btn btn-danger\" ng-click=\"delete.link(group, link)\">Delete</button>\n" +
    "\t\t\t\t\t\t<button ng-if=\"auth.links && $index > 0\" class=\"btn btn-success\" ng-click=\"up.link(group, link)\"><i class=\"fa fa-arrow-up\"></i></button>\n" +
    "\t\t\t\t\t\t<button ng-if=\"auth.links && $index < (group.links.length - 1)\" class=\"btn btn-success\" ng-click=\"down.link(group, link)\"><i class=\"fa fa-arrow-down\"></i></button>\n" +
    "\t\t\t\t\t\t<a href=\"{{ link.url }}\">{{ link.name }}</a>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('jotc/sections/login/template.html',
    "<div class=\"modal-header\">Login</div>\n" +
    "\n" +
    "<form ng-submit=\"formSubmit()\">\n" +
    "\t<div class=\"modal-body\">\n" +
    "\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label>Email</label>\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"credentials.username\">\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\" ng-if=\"!inReset\">\n" +
    "\t\t\t<label>Password</label>\n" +
    "\t\t\t<input type=\"password\" class=\"form-control\" ng-model=\"credentials.password\">\n" +
    "\t\t\t<a ng-click=\"forgotPassword()\">Forgot Password</a>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"modal-footer\">\n" +
    "\t\t<button class=\"btn btn-primary\" type=\"submit\" ng-if=\"!inReset\">Login</button>\n" +
    "\t\t<button class=\"btn btn-primary\" type=\"submit\" ng-if=\"inReset\">Reset Password</button>\n" +
    "\t\t<a class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</a>\n" +
    "\t</div>\n" +
    "</form>\n"
  );


  $templateCache.put('jotc/sections/pictures/edit-gallery.template.html',
    "<div class=\"modal-header\">{{ action }} Gallery</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "<form>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Name</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"gallery.name\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Description</label>\n" +
    "\t\t<textarea class=\"form-control\" rows=\"5\" ng-model=\"gallery.description\"></textarea>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/pictures/gallery.template.html',
    "<div class=\"gallery-modal\">\n" +
    "\t<div class=\"modal-header\">\n" +
    "\t\t{{ gallery.name }}\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"modal-body\">\n" +
    "\t\t<img ng-src=\"/galleryImages/{{ gallery.images[index].path }}\">\n" +
    "\t\t<div>\n" +
    "\t\t\t<div class=\"control prev\" ng-click=\"previous()\" ng-if=\"index > 0\"><i class=\"fa fa-step-backward\"></i> Previous</div>\n" +
    "\t\t\t<div class=\"control next\" ng-click=\"next()\" ng-if=\"index < gallery.images.length - 1\">Next <i class=\"fa fa-step-forward\"></i></div>\n" +
    "\t\t\t<div class=\"metadata\">\n" +
    "\t\t\t\t<span ng-hide=\"editing\">{{ gallery.images[index].description }}</span>\n" +
    "\t\t\t\t<textarea ng-show=\"editing\" ng-model=\"gallery.images[index].description\"></textarea>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"modal-footer\">\n" +
    "\t\t<div class=\"page\">{{ index + 1 }} of {{ gallery.images.length }}</div>\n" +
    "\t\t<button class=\"btn btn-primary\" ng-if=\"auth.pictures && editing\" ng-click=\"saveEditing()\">Save</button>\n" +
    "\t\t<button class=\"btn btn-warning\" ng-if=\"auth.pictures\" ng-click=\"beginEditing()\">Edit</button>\n" +
    "\t\t<button class=\"btn btn-danger\" ng-if=\"auth.pictures\" ng-click=\"delete()\">Delete</button>\n" +
    "\t\t<button class=\"btn btn-primary\" ng-click=\"close()\">Close</button>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/pictures/template.html',
    "<div id=\"pictures\">\n" +
    "\t<div class=\"title\">Pictures</div>\n" +
    "\t\n" +
    "\t<div ng-if=\"auth.pictures\" style=\"text-align: center;\">\n" +
    "\t\t<button ng-if=\"auth.pictures\" class=\"btn btn-primary\" ng-click=\"openEditor(null, $event)\">New Gallery</button>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"galleries container-fluid\">\n" +
    "\t\t<div class=\"galleryRow\" ng-repeat=\"row in getRows()\">\n" +
    "\t\t\t<div class=\"col-md-6\" ng-repeat=\"gallery in row\">\n" +
    "\t\t\t\t<div class=\"gallery\" ng-click=\"showGallery(gallery)\">\n" +
    "\t\t\t\t\t<div class=\"preview\">\n" +
    "\t\t\t\t\t\t<img ng-src=\"/galleryImages/{{ gallery.images[0].path }}\" ng-if=\"gallery.images.length > 0\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"name\">{{ gallery.name }}</div>\n" +
    "\t\t\t\t\t<div class=\"description\">{{ gallery.description }}</div>\n" +
    "\t\t\t\t\t<div class=\"metadata\">Created {{ gallery.created | date }} | {{ gallery.images.length }} images</div>\n" +
    "\t\t\t\t\t<div ng-if=\"auth.pictures\" ng-controller=\"pictures.dragdrop\" gallery-id=\"{{ gallery._id }}\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<button class=\"btn btn-warning\" ng-click=\"openEditor(gallery, $event)\">Edit</button>\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<button class=\"btn btn-danger\" ng-click=\"deleteGallery(gallery, $event)\">Delete</button>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div ng-file-drop ng-model=\"files\" class=\"upload-box\" drag-over-class=\"dragover\" multiple=\"true\" allow-dir=\"true\" accept=\".jpg,.jpeg,.png,.gif\">\n" +
    "\t\t\t\t\t\t\tDrop pictures here to add them to this gallery\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div class=\"uploading\" ng-if=\"uploadingFiles.length > 0\">\n" +
    "\t\t\t\t\t\t\t<span>Currently uploading...</span>\n" +
    "\t\t\t\t\t\t\t<div ng-repeat=\"file in uploadingFiles\" class=\"c---ell\">\n" +
    "\t\t\t\t\t\t\t\t<img ng-src=\"{{ file.objUrl }}\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"uploadProgress\" style=\"width: {{ file.progress }}%\">\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/resetPassword/template.html',
    "<div class=\"title\">Reset Password</div>\n" +
    "\n" +
    "<div class=\"resetPassword\">\n" +
    "\t<form>\n" +
    "\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label>New Password</label>\n" +
    "\t\t\t<input type=\"password\" class=\"form-control\" ng-model=\"reset.password1\">\n" +
    "\t\t\t<div class=\"alert alert-danger\" ng-hide=\"passwordIsSufficient()\">Password must be at least 8 characters longs and contain at least one letter and one number.</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<label>Confirm New Password</label>\n" +
    "\t\t\t<input type=\"password\" class=\"form-control\" ng-model=\"reset.password2\">\n" +
    "\t\t\t<div class=\"alert alert-danger\" ng-hide=\"passwordsMatch()\">Passwords do not match</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<button class=\"btn btn-primary\" ng-click=\"resetPassword()\">Reset Password</button>\n" +
    "\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/shows/edit-recurring.template.html',
    "<div class=\"modal-header\">{{ action }} Recurring Show</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "<form>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Description</label>\n" +
    "\t\t<textarea class=\"form-control\" rows=\"5\" ng-model=\"recurringShow.description\"></textarea>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"showClassCategory\" ng-repeat=\"category in recurringShow.categories\">\n" +
    "\t\t<div class=\"form-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"category.name\">\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<div class=\"classes\">\n" +
    "\t\t\t<div class=\"form-group\" ng-repeat=\"class in category.classes\">\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"class.name\">\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<button class=\"btn btn-success\" ng-click=\"addClass(category)\">Add Class</button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<button class=\"btn btn-success\" ng-click=\"addClassCategory()\">Add Class Category</button>\n" +
    "\t\n" +
    "\t<!--div class=\"form-group\">\n" +
    "\t\t<label>Location</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.location\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Registration Close Date</label>\n" +
    "\t\t<div class=\"input-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.registrationDeadline\" disabled datepicker-popup=\"dd MMM yyyy\" is-open=\"dateOpen.reg\">\n" +
    "\t\t\t<span class=\"input-group-btn\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" style=\"height: 34px;\" ng-click=\"dateOpen.open('reg', $event);\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Start Date</label>\n" +
    "\t\t<div class=\"input-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.startDate\" disabled datepicker-popup=\"dd MMM yyyy\" is-open=\"dateOpen.start\" min-date=\"show.registrationDeadline\">\n" +
    "\t\t\t<span class=\"input-group-btn\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" style=\"height: 34px;\" ng-click=\"dateOpen.open('start', $event);\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>End Date</label>\n" +
    "\t\t<div class=\"input-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.endDate\" disabled datepicker-popup=\"dd MMM yyyy\" is-open=\"dateOpen.end\" min-date=\"show.startDate\">\n" +
    "\t\t\t<span class=\"input-group-btn\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" style=\"height: 34px;\" ng-click=\"dateOpen.open('end', $event);\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Description</label>\n" +
    "\t\t<textarea class=\"form-control\" rows=\"5\" ng-model=\"show.description\"></textarea>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Registration Link</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.registrationLink\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Classes</label>\n" +
    "\t\t<div class=\"input-group container\">\n" +
    "\t\t\t<div class=\"row\" ng-repeat=\"row in getClassesByRow()\">\n" +
    "\t\t\t\t<div class=\"col-md-6\" ng-repeat=\"class in row\">\n" +
    "\t\t\t\t\t<label class=\"control-label\" style=\"margin-left: 1em; text-indent: -1em;\"><input type=\"checkbox\" ng-model=\"classesChecked[class._id]\" ng-change=\"toggleClass(class)\"> {{ class.name }}</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div-->\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/shows/edit-show.template.html',
    "<div class=\"modal-header\">{{ action }} Show</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "<form>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Show Title</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.title\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Location</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.location\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Entries Close Date</label>\n" +
    "\t\t<div class=\"input-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.registrationDeadline\" disabled datepicker-popup=\"dd MMM yyyy\" is-open=\"dateOpen.reg\">\n" +
    "\t\t\t<span class=\"input-group-btn\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" style=\"height: 34px;\" ng-click=\"dateOpen.open('reg', $event);\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Start Date</label>\n" +
    "\t\t<div class=\"input-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.startDate\" disabled datepicker-popup=\"dd MMM yyyy\" is-open=\"dateOpen.start\" min-date=\"show.registrationDeadline\">\n" +
    "\t\t\t<span class=\"input-group-btn\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" style=\"height: 34px;\" ng-click=\"dateOpen.open('start', $event);\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>End Date</label>\n" +
    "\t\t<div class=\"input-group\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.endDate\" disabled datepicker-popup=\"dd MMM yyyy\" is-open=\"dateOpen.end\" min-date=\"show.startDate\">\n" +
    "\t\t\t<span class=\"input-group-btn\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" style=\"height: 34px;\" ng-click=\"dateOpen.open('end', $event);\"><i class=\"fa fa-calendar\"></i></button>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Description</label>\n" +
    "\t\t<textarea class=\"form-control\" rows=\"5\" ng-model=\"show.description\"></textarea>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Registration Link</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" ng-model=\"show.registrationLink\">\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>Classes</label>\n" +
    "\t\t<div class=\"classes\">\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" ng-model=\"class.name\" ng-repeat=\"class in show.classes\">\n" +
    "\t\t</div>\n" +
    "\t\t<button class=\"btn btn-success\" ng-click=\"addClass()\">Add Class</button>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/shows/template.html',
    "<div id=\"shows\">\n" +
    "\t<div class=\"title\">JOTC Shows and Trials</div>\n" +
    "\n" +
    "\t<div class=\"container-fluid\">\n" +
    "\n" +
    "\t\t<div class=\"col-md-6\">\n" +
    "\t\t\tThe Jackson Obedience Training Club sponsors two AKC Sanctioned Obedience and Rally events each year.\n" +
    "\t\t\tBoth shows are held indoors, with enclosed, fully-matted rings and usually include four back-to-back\n" +
    "\t\t\tObedience and four Rally Trials over the weekend.\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"recurring\" ng-repeat=\"show in recurring.list\">\n" +
    "\t\t\t\t<span class=\"description\">{{ show.description }}</span>\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li ng-repeat=\"category in show.categories\">\n" +
    "\t\t\t\t\t\t<span class=\"bold\">{{ category.name }}:</span><br>\n" +
    "\t\t\t\t\t\t<span ng-repeat=\"class in category.classes\"><span ng-if=\"$index > 0\">, </span>{{ class }}</span>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t\t<div ng-if=\"auth.shows\">\n" +
    "\t\t\t\t\t<button class=\"btn btn-warning\" ng-click=\"recurring.edit(show)\">Edit Recurring Show</button>\n" +
    "\t\t\t\t\t<button class=\"btn btn-danger\" ng-click=\"recurring.delete(show)\">Delete Recurring Show</button>\n" +
    "\t\t\t\t\t<button ng-if=\"auth.shows && $index > 0\" class=\"btn btn-success\" ng-click=\"recurring.up(show)\"><i class=\"fa fa-arrow-up\"></i></button>\n" +
    "\t\t\t\t\t<button ng-if=\"auth.shows && $index < (recurring.list.length - 1)\" class=\"btn btn-success\" ng-click=\"recurring.down(show)\"><i class=\"fa fa-arrow-down\"></i></button>\n" +
    "\t\t\t\t\t<hr>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div ng-if=\"auth.shows\">\n" +
    "\t\t\t\t<button class=\"btn btn-success\" ng-click=\"recurring.edit()\">Add Recurring Show</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"col-md-6\">\n" +
    "\n" +
    "\t\t\t<div class=\"header\">Upcoming Shows and Trials</div>\n" +
    "\t\t\t<div ng-show=\"auth.shows\" class=\"auth\">\n" +
    "\t\t\t\t<button class=\"btn btn-success\" ng-click=\"openEditor()\">New Show</button>\n" +
    "\t\t\t\t<br>&nbsp;\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div ng-repeat=\"show in shows.upcoming\" class=\"show\">\n" +
    "\t\t\t\t<div class=\"date\">{{ show.dateRange }}, {{ show.title }}</div>\n" +
    "\t\t\t\t<div class=\"map\">\n" +
    "\t\t\t\t\t<a href=\"{{ $location.getDirectionsURLForLocation(show.location) }}\" target=\"_blank\">\n" +
    "\t\t\t\t\t\t<img ng-src=\"{{ $location.getImageURLForLocation(show.location); }}\">\n" +
    "\t\t\t\t\t\t<br>\n" +
    "\t\t\t\t\t\tClick for directions\n" +
    "\t\t\t\t\t</a>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"location\">{{ show.location }}</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"description\">\n" +
    "\t\t\t\t\t{{ show.description }}<span ng-if=\"show.registrationDeadline\">  Entries close {{ show.registrationDeadline | date }}.</span>\n" +
    "\n" +
    "\t\t\t\t\t<br><br>\n" +
    "\t\t\t\t\tThe following competition classes are included:\n" +
    "\t\t\t\t\t<ul>\n" +
    "\t\t\t\t\t\t<li ng-repeat=\"class in show.classes\">{{ class }}</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\n" +
    "\t\t\t\t\t<div ng-repeat=\"file in show.files\" class=\"fileList\">\n" +
    "\t\t\t\t\t\t<a class=\"btn btn-success download\" ng-href=\"{{ file.path }}\">Download {{ file.name }}</a>\n" +
    "\t\t\t\t\t\t<button ng-if=\"auth.shows\" class=\"btn btn-danger\" ng-click=\"deleteFile(show, file)\">Delete {{ file.name }}</button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t\t<button ng-if=\"show.registrationLink.length > 0\" ng-click=\"openNewWindow(show.registrationLink)\" class=\"btn btn-warning register\">Register</button>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div drag-drop-file-uploader ng-if=\"auth.shows\" obj-type=\"shows\" obj=\"show\" doc-type=\"prompt\" doc-name=\"a file\"></div>\n" +
    "\n" +
    "\t\t\t\t<div ng-if=\"auth.shows\" style=\"text-align: right; padding: 10px;\">\n" +
    "\t\t\t\t\t<button class=\"btn btn-primary\" ng-click=\"openEditor(show)\">Edit</button> <button class=\"btn btn-danger\" ng-click=\"delete(show)\">Delete</button>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<hr>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"header\">Completed Shows</div>\n" +
    "\t\t\t<div ng-repeat=\"show in shows.past\" class=\"show\">\n" +
    "\t\t\t\t<div class=\"date\">{{ show.dateRange }}, {{ show.title }}</div>\n" +
    "\t\t\t\t<div class=\"location\">{{ show.location }}</div>\n" +
    "\t\t\t\t<div class=\"description\">\n" +
    "\t\t\t\t\t<div ng-repeat=\"file in show.files\" class=\"fileList\">\n" +
    "\t\t\t\t\t\t<a class=\"btn btn-success download\" ng-href=\"{{ file.path }}\">Download {{ file.name }}</a>\n" +
    "\t\t\t\t\t\t<button ng-if=\"auth.shows\" class=\"btn btn-danger\" ng-click=\"deleteFile(show, file)\">Delete {{ file.name }}</button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\n" +
    "\t\t\t\t\t<div drag-drop-file-uploader ng-if=\"auth.shows\" obj-type=\"shows\" obj=\"show\" doc-type=\"prompt\" doc-name=\"results\"></div>\n" +
    "\t\t\t\t\t\n" +
    "\t\t\t\t</div>\t\t\t\t\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('jotc/sections/uploader/prompt.template.html',
    "<div class=\"modal-header\">Upload File</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "<form>\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label>File title</label>\n" +
    "\t\t<input type=\"text\" class=\"form-control\" rows=\"5\" ng-model=\"file.name\">\n" +
    "\t</div>\t\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button class=\"btn btn-primary\" ng-click=\"upload()\">Upload</button>\n" +
    "\t<button class=\"btn btn-danger\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/uploader/template.html',
    "<div class=\"drag-drop-uploader-container\" ng-controller=\"dragDropFileUploader.controller\">\n" +
    "\t<div ng-file-drop ng-if=\"uploadingFiles.length === 0\" class=\"upload-box\" ng-model=\"files\" drag-over-class=\"dragover\" multiple=\"false\" allow-dir=\"false\" accept=\".pdf,.pdf\" ng-file-change=\"fileDropped($files, $event, $rejectedFiles)\">\n" +
    "\t\tDrag and drop a PDF to add {{ documentName }}\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"uploading\" ng-if=\"uploadingFiles.length > 0\">\n" +
    "\t\tUploading...\n" +
    "\t\t<div class=\"progress\" style=\"height: 20px; margin: 10px;\">\n" +
    "\t\t\t<div class=\"progress-bar progress-bar-striped progress-bar-success active\" role=\"progressbar\" aria-valuenow=\"45\" style=\"width: {{ uploadingFiles[0].progress }}%;\">\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('jotc/sections/users/template.html',
    "<div id=\"manageUsers\" ng-if=\"auth.permissions.users\">\n" +
    "\t<div class=\"title\">Manage Users</div>\n" +
    "\n" +
    "\t<div class=\"flex container\">\n" +
    "\t\t<div class=\"col-md-3 userList\">\n" +
    "\t\t\t<div ng-repeat=\"user in users.list\" ng-click=\"selectUser(user)\" class=\"user\" ng-class=\"{ selected: user === selectedUserShadow }\">\n" +
    "\t\t\t\t{{ user.name }}\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"center newUser\">\n" +
    "\t\t\t\t<button class=\"btn btn-info\" ng-click=\"newUser()\">New User</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t\t<div class=\"col-md-9 selectedUser\" ng-if=\"selectedUser\">\n" +
    "\t\t\t<div class=\"form-group\">\n" +
    "\t\t\t\t<label>Name</label>\n" +
    "\t\t\t\t<input type=\"text\" ng-model=\"selectedUser.name\" class=\"form-control\">\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"form-group\">\n" +
    "\t\t\t\t<label>Email</label>\n" +
    "\t\t\t\t<input type=\"text\" ng-model=\"selectedUser.email\" class=\"form-control\">\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div class=\"permissions\">\n" +
    "\t\t\t\t<div ng-repeat=\"(p,v) in selectedUser.permissions\" class=\"form-group permission\">\n" +
    "\t\t\t\t\t<label>\n" +
    "\t\t\t\t\t\t<input type=\"checkbox\" ng-model=\"selectedUser.permissions[p]\" ng-disabled=\"selectedUser._id === auth.getUserID() && p === 'users'\">\n" +
    "\t\t\t\t\t\t{{ permissions[p] }}\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<div ng-show=\"selectedUser._id === auth.getUserID() && p === 'users'\">You cannot remove this permission from yourself.</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<button class=\"btn btn-success\" ng-click=\"saveSelectedUser()\">Save</button>\n" +
    "\t\t\t<button class=\"btn btn-primary\" ng-if=\"selectedUser._id\" ng-click=\"resetSelectedUser()\">Reset</button>\n" +
    "\t\t\t\n" +
    "\t\t\t<div ng-if=\"selectedUser._id && selectedUser._id !== auth.getUserID()\">\n" +
    "\t\t\t\t<br>\n" +
    "\t\t\t\t<button class=\"btn btn-warning\" ng-click=\"resetSelectedPassword()\">Reset Password</button>\n" +
    "\t\t\t\t<button class=\"btn btn-danger\" ng-click=\"deleteSelectedUser()\">Delete</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );

}]);
