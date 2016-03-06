import React from "react";
import Paper from "material-ui/lib/paper";
import LinkStore from "../stores/links";

module.exports = React.createClass({
  getInitialState() {
    return {
      links: LinkStore.getLinks()
    };
  },

  componentDidMount() {
    this.storeListenerToken = LinkStore.addListener(this._linkStoreChanged);
  },

  componentWillUnmount() {
    this.storeListenerToken.remove();
  },

  _linkStoreChanged() {
    this.setState({ links: LinkStore.getLinks() });
  },

  getFirstHalf() {
    return this.state.links.slice(0, Math.ceil(this.state.links.length / 2));
  },

  getSecondHalf() {
    return this.state.links.slice(Math.ceil(this.state.links.length / 2));
  },

  mapLinkGroup(group) {
    return (
      <Paper className="link-group" key={group._id}>
        <h3>{group.name}</h3>
        <ul>
          { group.links.map(link => <li key={link._id}><a href={link.url}>{link.name}</a></li>) }
        </ul>
      </Paper>
    )
  },

  render() {
    return (
      <div className="links-container">
        <h1 className="title">Useful Links</h1>
        <div className="halves">
          <div className="half">
            { this.getFirstHalf().map(group => this.mapLinkGroup(group)) }
          </div>
          <div className="half">
            { this.getSecondHalf().map(group => this.mapLinkGroup(group)) }
          </div>
        </div>
      </div>
    );
  }
});
