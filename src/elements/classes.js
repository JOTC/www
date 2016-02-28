import React from "react";
import Sidebar from "./sidebar";
import Paper from 'material-ui/lib/paper';

module.exports = React.createClass({
  render() {
    return (
      <div className="container classes-container">
        <div className="main">
          <h1 className="title">Classes</h1>
        </div>

        <Sidebar />
      </div>
    );
  }
});
