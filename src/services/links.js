import dispatcher from "../dispatcher";
import { Store } from "flux/utils";
import request from "browser-request";

class LinkService extends Store {
  constructor(dispatcher) {
    super(dispatcher);
  }

  __onDispatch(event) {
    switch(event.type) {
      case "new-link":
        break;
    }
  }

  refresh() {
    request.get("/data2/links", (err, res, body) => {
      if(!err) {
        if(typeof body === "string") {
          body = JSON.parse(body);
        }

        dispatcher.dispatch({
          type: "links-in",
          payload: body
        });
      }
    });
  }
}

module.exports = new LinkService(dispatcher);
