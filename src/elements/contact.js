import React from "react";

module.exports = React.createClass({
  getLink() {
    if(this.props.contact.type === "email") {
      return (<a href={`mailto:${this.props.contact.value}`}>Email {this.props.contact.value}</a>);
    } else {
      return (<a href={`tel:${this.props.contact.value}`}>Phone {this.props.contact.value}</a>);
    }
  },

  render() {
    return (
      <div>
        {this.getLink()}
      </div>
    );
  }
});
