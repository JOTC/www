import dispatcher from "../dispatcher";
import { Store } from "flux/utils";
import services from "../services";

class OfficerStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);
    this._officers = [ ];
    services.officers.refresh();
  }

  getOfficers() {
    return this._officers;
  }

  __onDispatch(event) {
    switch(event.type) {
      case "officers-in":
        this._officers = event.payload;
        this.__emitChange();
        break;
      case "new-officer":
        break;
    }
  }
}

module.exports = new OfficerStore(dispatcher);
