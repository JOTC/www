import dispatcher from "../dispatcher";
import { Store } from "flux/utils";
import request from "browser-request";

class OfficerService extends Store {
  constructor(dispatcher) {
    super(dispatcher);
  }

  __onDispatch(event) {
    switch(event.type) {
      case "new-officer":
        break;
    }
  }

  refreshOfficers() {
    request.get("/data2/officers", (err, res, body) => {
      if(!err) {
        if(typeof body === "string") {
          body = JSON.parse(body);
        }

        dispatcher.dispatch({
          type: "officers-in",
          payload: body
        });
      }
    });
  }
}

module.exports = new OfficerService(dispatcher);
