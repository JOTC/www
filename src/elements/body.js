import React from "react";
import { Router, Route, hashHistory } from "react-router";

import Home from "./home";
import Shows from "./shows";
import Classes from "./classes";
import Pictures from "./pictures";
import Calendar from "./calendar";
import Links from "./Links";
import About from "./about";
import Sidebar from "./sidebar";

module.exports = React.createClass({
  render() {
    return (
      <div>
        <div className="container">
          <Router history={hashHistory}>
            <Route path="/" component={Home} />
            <Route path="/shows" component={Shows} />
            <Route path="/classes" component={Classes} />
            <Route path="/pictures" component={Pictures} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/links" component={Links} />
            <Route path="/about" component={About} />
          </Router>
        </div>
        <Sidebar />
      </div>
    )
  }
});
