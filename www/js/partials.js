angular.module('jotc-partials', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('jotc/sections/about/about.html',
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
    "\t\t<div ng-show=\"auth.canEditOfficers\" class=\"addContentButton\">\n" +
    "\t\t\t<span ng-click=\"about.edit()\">[+] new officer</span>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"officers table\">\n" +
    "\t\t\t<div ng-repeat=\"officer in officers\" class=\"row officer\">\n" +
    "\t\t\t\t<div ng-if=\"auth.canEditOfficers\" class=\"editBox\">[ <span ng-click=\"about.edit(officer);\">edit</span> | <span ng-click=\"about.remove(officer);\">delete</span> ]</div>\n" +
    "\t\t\t\t<div class=\"cell officerTitle\">\n" +
    "\t\t\t\t\t<div ng-repeat=\"position in officer.positions\">{{ position.title }}</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"cell officerName\">{{ officer.name }}</div>\n" +
    "\t\t\t\t<div class=\"cell officerContact\">\n" +
    "\t\t\t\t\t<div ng-repeat=\"contact in officer.contacts\">\n" +
    "\t\t\t\t\t\t<a ng-show=\"contact.type == 'email'\" href=\"mailto:{{ contact.contact }}\">Email ({{ contact.contact }})</a>\n" +
    "\t\t\t\t\t\t<span ng-show=\"contact.type == 'phone'\">Phone ({{ contact.contact }})</span>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<span ng-if=\"officer.contacts.length === 0\">&nbsp;</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('jotc/sections/classes/classes.html',
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
    "\t\t\t\t<div ng-show=\"auth.canEditClasses\" class=\"addContentButton\">\n" +
    "\t\t\t\t\t<span ng-click=\"classes.edit();\">[+] new class</span>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div ng-repeat=\"class in classes\" class=\"class\">\n" +
    "\t\t\t\t\t<div class=\"date\">\n" +
    "\t\t\t\t\t\tStarting {{ class.startDate | date }}\n" +
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
    "\n" +
    "\t\t\t\t\t\t<br><br>\n" +
    "\n" +
    "\t\t\t\t\t\t<span ng-if=\"class.files.length > 0\" class=\"button\"><a href=\"old/data/classes.php?file={{ class.files[0].id }}\" style=\"text-decoration: none; color: black;\">Download Application</a></span>\n" +
    "\t\t\t\t\t</div>\n" +
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


  $templateCache.put('jotc/sections/home/home.html',
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
    "\t\t\t<div class=\"event\" ng-repeat=\"event in calendar\">\n" +
    "\t\t\t\t<div class=\"date\">{{ event.start | date : 'MMMM d' : UTC }}</div>\n" +
    "\t\t\t\t<div class=\"body\" ng-click=\"click(event)\">\n" +
    "\t\t\t\t\t{{ event.title }}\n" +
    "\t\t\t\t\t<div class=\"link\">More Information</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('jotc/sections/links/links.html',
    "<div id=\"links\">\n" +
    "\t<div class=\"title\">Useful Links</div>\n" +
    "\t<div ng-show=\"auth.canEditLinks\" class=\"addContentButton\">\n" +
    "\t\t<span ng-click=\"links.edit()\">[+] new link</span>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div id=\"links\" class=\"table\">\n" +
    "\t\t<div ng-repeat=\"half in getHalves()\" class=\"cell linksColumn\">\n" +
    "\t\t\t<div ng-repeat=\"group in half\">\n" +
    "\t\t\t\t<div class='linkGroup'>{{ group.name }}</div>\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li ng-repeat=\"link in group.links\">\n" +
    "\t\t\t\t\t\t<a href=\"{{ link.url }}\">{{ link.name }}</a>\n" +
    "\t\t\t\t\t\t\t\t<span ng-show=\"auth.canEditLinks\" class=\"editBox\">[\n" +
    "\t\t\t\t\t\t\t\t\t<span ng-click=\"links.edit(link, group);\">edit</span> |\n" +
    "\t\t\t\t\t\t\t\t\t<span ng-click=\"links.remove(link);\">delete</span>\n" +
    "\t\t\t\t\t\t\t\t\t<span ng-show=\"!$first\"> | </span><span ng-show=\"!$first\" ng-click=\"links.move(link, group, true);\">&#x2191;</span>\n" +
    "\t\t\t\t\t\t\t\t\t<span ng-show=\"!$last\"> | </span><span ng-show=\"!$last\" ng-click=\"links.move(link, group, false);\">&#x2193;</span> ]\n" +
    "\t\t\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('jotc/sections/pictures/pictures.edit.html',
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


  $templateCache.put('jotc/sections/pictures/pictures.gallery.html',
    "<div class=\"gallery-modal\">\n" +
    "\t<div class=\"modal-header\">\n" +
    "\t\t{{ gallery.name }}\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"modal-body\">\n" +
    "\t\t<div class=\"image\">\n" +
    "\t\t\t<img ng-src=\"/galleryImages/{{ gallery.images[index].path }}\">\n" +
    "\t\t</div>\n" +
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


  $templateCache.put('jotc/sections/pictures/pictures.html',
    "<div id=\"pictures\">\n" +
    "\t<div class=\"title\">Pictures</div>\n" +
    "\t\n" +
    "\t<div ng-if=\"auth.pictures\" style=\"text-align: center;\">\n" +
    "\t\t<button ng-if=\"auth.pictures\" class=\"btn btn-primary\" ng-click=\"openEditor(null, $event)\">New Gallery</button>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"galleries container-fluid\">\n" +
    "\t\t<div class=\"galleryRow\" ng-repeat=\"row in getRows()\">\n" +
    "\t\t\t<div class=\"col-md-4\" ng-repeat=\"gallery in row\">\n" +
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


  $templateCache.put('jotc/sections/shows/shows.edit.html',
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


  $templateCache.put('jotc/sections/shows/shows.html',
    "<div id=\"shows\">\n" +
    "\t<div class=\"title\">JOTC Shows and Trials</div>\n" +
    "\n" +
    "\t<div class=\"table\">\n" +
    "\n" +
    "\t\t<div class=\"cell\">\n" +
    "\t\t\tThe Jackson Obedience Training Club sponsors annual back-to-back obedience and rally trials.  The\n" +
    "\t\t\ttrials are held indoors at the Jackson Fairgrounds.  Competition obedience classes usually include:\n" +
    "\n" +
    "\t\t\t<ul><li ng-repeat=\"class in getShowClasses()\">{{ class.name }}</li></ul>\n" +
    "\n" +
    "\t\t\t<br>We also offer all levels of rally competition:\n" +
    "\t\t\t<ul><li ng-repeat=\"class in getRallyClasses()\">{{ class.name }}</li></ul>\n" +
    "\n" +
    "\t\t\t<br>Ribbons and trophies are awarded in all classes.  The trials are licensed by the American Kennel\n" +
    "\t\t\tClub and all qualifying scores in Novice, Open, and Utility may be counted towards AKC\n" +
    "\t\t\tObedience titles.  Additionally, qualifying scores in the regular Rally competition may\n" +
    "\t\t\tcount towards AKC Rally titles.\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"cell right\">\n" +
    "\n" +
    "\t\t\t<div class=\"header\">Upcoming Shows and Trials</div>\n" +
    "\t\t\t<div ng-show=\"auth.shows\" class=\"addContentButton\" style=\"text-align: center;\">\n" +
    "\t\t\t\t<button class=\"btn btn-success\" ng-click=\"openEditor()\">New Show</button>\n" +
    "\t\t\t\t<br>&nbsp;\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div ng-repeat=\"show in shows\" class=\"show\">\n" +
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
    "\t\t\t\t\t{{ show.description }}<span ng-if=\"show.registrationDeadline\">  Registration ends {{ show.registrationDeadline | date }}.</span>\n" +
    "\n" +
    "\t\t\t\t\t<br><br>\n" +
    "\t\t\t\t\tThe following competition classes are included:\n" +
    "\t\t\t\t\t<ul>\n" +
    "\t\t\t\t\t\t<li ng-repeat=\"class in show.classes\">{{ class.name }}</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\n" +
    "\t\t\t\t\t<span ng-if=\"show.files.length > 0\">\n" +
    "\t\t\t\t\t\t<br>\n" +
    "\t\t\t\t\t\tDownloads:\n" +
    "\t\t\t\t\t\t<ul>\n" +
    "\t\t\t\t\t\t\t<li ng-repeat=\"file in show.files\"><a ng-href=\"data/shows.php?file={{ file.id }}\">{{ file.name }}</a> ({{ file.size }})</li>\n" +
    "\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t</span>\n" +
    "\n" +
    "\t\t\t\t\t<button ng-if=\"show.registrationLink.length > 0\" ng-click=\"openNewWindow(show.registrationLink)\" class=\"btn btn-warning register\">Register</button>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div ng-if=\"auth.shows\" style=\"text-align: right; padding: 10px;\">\n" +
    "\t\t\t\t\t<button class=\"btn btn-primary\" ng-click=\"openEditor(show)\">Edit</button> <button class=\"btn btn-danger\" ng-click=\"delete(show)\">Delete</button>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "</div>\n"
  );

}]);
