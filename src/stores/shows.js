const dispatcher = require('../dispatcher');
import { Store } from 'flux/utils';

class ShowStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);
    this._shows = {
      upcoming: [
        {
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
          ]
        }
      ]
    };
  }

  getShows() {
    return this._shows;
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
