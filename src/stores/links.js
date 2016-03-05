import dispatcher from "../dispatcher";
import { Store } from "flux/utils";
import services from "../services";

class LinkStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);
    this._links = [ ];
    services.links.refresh();
  }

  getLinks() {
    return this._links;
  }

  __onDispatch(event) {
    switch(event.type) {
      case "links-in":
        this._links = event.payload;
        this._links.sort((a, b) => a.ordering - b.ordering);
        this.__emitChange();
        break;
      case "new-link":
        break;
    }
  }
}

module.exports = new LinkStore(dispatcher);
