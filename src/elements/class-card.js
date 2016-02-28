import React from "react";

import Card from "material-ui/lib/card/card";
import CardActions from "material-ui/lib/card/card-actions";
import CardHeader from "material-ui/lib/card/card-header";
import CardMedia from "material-ui/lib/card/card-media";
import CardTitle from "material-ui/lib/card/card-title";
import RaisedButton from "material-ui/lib/raised-button";
import CardText from "material-ui/lib/card/card-text";

module.exports = React.createClass({
  getLocationImageURL() {
    let locationPiece = encodeURIComponent(`${this.props.classObj.location.name}, ${this.props.classObj.location.place}`);
    return `https://maps.googleapis.com/maps/api/staticmap?sensor=false&zoom=11&size=500x250&center=${locationPiece}&markers=${locationPiece}`;
  },

  getMediaOverlay() {
    return (
      <CardTitle title={this.props.classObj.location.name}
        style={{ padding: "8px" }}
        titleStyle={{ fontSize: "1rem", lineHeight: "1em" }}
        subtitle={this.props.classObj.location.place} />
    );
  },

  getMediaComponent() {
    return (
      <CardMedia
        expandable={true}
        overlay={this.getMediaOverlay()}
      >
        <img src={this.getLocationImageURL()} />
      </CardMedia>
    )
  },

  render() {
    return (
      <Card className="class-card">
        <CardHeader
          title={this.props.classObj.name}
          subtitle={this.props.classObj.shortDate}
          actAsExpander={true}
          showExpandableButton={true}
          style={{ background: "#205493", color: "white" }}
          titleColor="white"
          subtitleColor="#ddd"
        />
        {this.getMediaComponent()}
        <CardText expandable={true} style={{ background: "#e4e2e0" }}>
          {this.props.classObj.description}<br/><br/>
          The following competition classes are included:<br/>
          <ul>
            {this.props.classObj.competitionClasses.map(c => <li>{c}</li>)}
          </ul>
        </CardText>
        <CardActions expandable={true} className="card-actions">
          <RaisedButton secondary={true} label="Download Premium List" className="action-button" />
          <RaisedButton secondary={true} label="Action2" className="action-button" />
        </CardActions>
      </Card>
    );
  }
});
