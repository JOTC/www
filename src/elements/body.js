import React from "react";
import { Router, Route, hashHistory } from "react-router";

import Home from "./home";
import Shows from "./shows";
import Classes from "./classes";
import Pictures from "./pictures";
import Calendar from "./calendar";
import Links from "./Links";
import About from "./about";

module.exports = React.createClass({
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Home} />
        <Route path="/shows" component={Shows} />
        <Route path="/classes" component={Classes} />
        <Route path="/pictures" component={Pictures} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/links" component={Links} />
        <Route path="/about" component={About} />
      </Router>
    )
    //return (
    //  <div id="content">
    //    { this.getActiveComponent() }
    //  </div>
    //);
  }
});
