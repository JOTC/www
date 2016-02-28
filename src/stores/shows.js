const dispatcher = require('../dispatcher');
import { Store } from 'flux/utils';

class ShowStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);
    let shows = {
      upcoming: [
        {
          _id: "56d0509d1a71d4a45f6005f4",
          dateRange: "Jun 25-26",
          description: "2 Obedience and Two Rally Trials Each Day.\nSee \"Save the Date\" for More Info.",
          endDate: "2016-06-26T23:59:59.000Z",
          location: "TradeMart, MS State Fairgrounds, Jackson, MS",
          registrationDeadline: "2016-06-08T23:59:59.000Z",
          registrationLink: "",
          startDate: "2016-06-25T23:59:59.000Z",
          title: "2016 Trials",
          files: [
            {
              name: "2016 June Save the Date",
              path: "/files/shows/56d0509d1a71d4a45f6005f4/2016 Trials File 1456494788828.pdf",
              _id: "56d058c41a71d4a45f6005f5"
            }
          ],
          classes: [
            "Novice A & B",
            "Beginner Novice A & B",
            "Preferred-Novice",
            "Team Open Relay (Non-Regular Class)"
          ]

          /*
          name: "February Novice Obedience and Rally Trials",
          shortDate: "February 20-21",
          location: {
            name: "McKenzie Arena, Hinds Community College",
            place: "Raymond, MS"
          },
          description: "OC Matches held Friday, February 19.  Entries close February 3.",
          competitionClasses: [
            "Novice A & B",
            "Beginner Novice A & B",
            "Preferred-Novice",
            "Team Open Relay (Non-Regular Class)",
            "Rally Novice A & B",
            "Rally Advanced A & B",
            "Rally Excellent A & B",
            "Rally Challenge (Non-Regular Class)"
          ]*/
        }
      ]
    };

    shows.upcoming = shows.upcoming.map(this.getProcessedShow);
    this._shows = shows;
  }

  getShows() {
    return this._shows;
  }

  getProcessedShow(show) {
    const bits = show.location.match(/^(.*), ([A-Za-z]+, [A-Z]{2})$/);
    if(bits) {
      show.location = { name: bits[1], place: bits[2] };
    } else {
      show.location.name = { name: show.location, place: "" };
    }
    return show;
  }

  __onDispatch(event) {
    switch(event.type) {
      case 'shows-in':
        this._shows = event.payload;
        this.__emitChange();
        break;
      case 'new-show':
        break;
    }
  }
}

module.exports = new ShowStore(dispatcher);
