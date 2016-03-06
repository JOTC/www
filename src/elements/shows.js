import React from "react";
import Sidebar from "./sidebar";
import Paper from 'material-ui/lib/paper';

module.exports = React.createClass({
  render() {
    return (
      <div className="shows-container">
        <div className="main">
          <h1 className="title">Shows and Trials</h1>
          The Jackson Obedience Training Club sponsors two AKC Sanctioned
          Obedience and Rally events each year. Both shows are held
          indoors, with enclosed, fully-matted rings and usually include
          four back-to-back Obedience and four Rally Trials over the weekend.

          <br/><br/>

          In February of each year, the two day show is a Novice Obedience
          and Rally event with one ring, held indoors at the McKenzie Arena
          on the campus of Hinds Community College in Raymond, MS. Classes
          offered at this event usually include:
          <ul>
            <li>
              <strong>Obedience Classes:</strong><br/>
              Novice A & B, Beginner Novice A & B, Preferred Novice
            </li>
            <li>
              <strong>Rally Classes:</strong><br/>
              Rally Novice A & B, Rally Advanced A & B, Rally Excellent A & B
            </li>
          </ul>

          <br/><br/>

          In June of each year, a two day show is held in the Trademart
          Building at the Mississippi State Fairgrounds in Jackson. With
          four fully-matted and enclosed rings, this show offers a full
          range of Obedience and Rally competition. Classes at this event
          usually include:
          <ul>
            <li>
              <strong>Regular Obedience Classes:</strong><br/>
              Novice A & B, Open A & B, Utility A & B
            </li>
            <li>
              <strong>Optional Titling Classes:</strong><br/>
              Beginner Novice A & B, Graduate Novice, Graduate Open,
              Versatility, Preferred Novice, Preferred Open, Preferred
              Utility
            </li>
            <li>
              <strong>Non-Regular Obedience Classes:</strong><br/>
              Wildcard Novice, Wildcard Open, Wildcard Utility, Veterans
            </li>
            <li>
              <strong>Rally Classes:</strong><br/>
              Rally Novice A & B, Rally Advanced A & B, Rally Excellent A & B
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
