const dispatcher = require('../dispatcher');
import { Store } from 'flux/utils';

class OfficerStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);
    this._officers = [{"name":"James Evans","_id":"5500f57f453eeef259cee96c","__v":0,"contacts":[],"titles":["President"]},{"name":"Betty Hutchinson","_id":"5500f59a453eeef259cee96d","__v":0,"contacts":[{"type":"email","value":"bettybh@bellsouth.net","_id":"5500f59a453eeef259cee96e"}],"titles":["Vice President"]},{"name":"Theresa Hanna","_id":"5500f5a6453eeef259cee96f","__v":0,"contacts":[],"titles":["Secretary"]},{"name":"MaryJo Anderson","_id":"5500f5c3453eeef259cee970","__v":0,"contacts":[{"type":"email","value":"MJA47@bellsouth.net","_id":"5500f5c3453eeef259cee971"}],"titles":["Treasurer","Training Coordinator"]},{"name":"Donna Webb","_id":"5500f5d2453eeef259cee972","__v":0,"contacts":[],"titles":["Board Member"]},{"name":"Joan Moran","_id":"5500f5da453eeef259cee973","__v":0,"contacts":[],"titles":["Board Member"]},{"name":"Randy Kahlaf","_id":"5500f5e6453eeef259cee974","__v":0,"contacts":[],"titles":["Board Member"]}];
  }

  getOfficers() {
    return this._officers;
  }

  __onDispatch(event) {
    switch(event.type) {
      case 'officers-in':
        this._officers = event.payload;
        this.__emitChange();
        break;
      case 'new-officer':
        break;
    }
  }
}

module.exports = new OfficerStore(dispatcher);
