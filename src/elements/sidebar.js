import React from "react";
import ShowCard from "./card-show";
import Paper from 'material-ui/lib/paper';
import ShowStore from '../stores/shows';

module.exports = React.createClass({
  getInitialState() {
    return {
      shows: ShowStore.getShows()
    };
  },

  componentDidMount() {
    this.storeListenerToken = ShowStore.addListener(this._showStoreChanged);
  },

  componentWillUnmount() {
    this.storeListenerToken.remove();
  },

  _showStoreChanged() {
    this.setState({ shows: ShowStore.getShows() });
  },

  render() {
    return (
      <div className="sidebar">
        <h3>Upcoming Events</h3>
        { this.state.shows.upcoming.map(show => <ShowCard showObj={show} key={show._id}/>) }
      </div>
    );
  }
});
