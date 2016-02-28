import React from "react";
import OfficerStore from "../stores/officers";
import Contact from "./contact";

module.exports = React.createClass({
  getInitialState() {
    return {
      officers: OfficerStore.getOfficers()
    };
  },

  componentDidMount() {
    this.storeListenerToken = OfficerStore.addListener(this._officerStoreChanged);
  },

  componentWillUnmount() {
    this.storeListenerToken.remove();
  },

  _officerStoreChanged() {
    this.setState({ officers: OfficerStore.getOfficers() });
  },

  render() {
    return (
      <div className="about-container">
        <h1 className="title">About JOTC</h1>
        <div className="halves">
          <div className="half">
            <h3>Club Activities</h3>
            <ul>
              <li>Monthly Member Meetings</li>
              <li>Training classes held twice in the spring and twice in the fall</li>
              <li>Two-day AKC Obedience trials held in the summer of each year</li>
              <li>Annual awards banquet to honor members who have achieved new titles in various dog events during the year</li>
              <li>Christmas party and "fun match," a "practice trial" for club members to enjoy the holidays together</li>
            </ul>
          </div>

          <div className="half">
            <h3>Newsletter and Meetings</h3>
            The Jackson Obedience Training Club sponsors a monthly newsletter for
            its members. The newsletter incldues club news, upcoming events, and
            informative articles of interest to all dog owners. The club has been
            publishing its newsletter since 1987. Non-members may subscribe to the
            newsletter by sending $12 in check, payable to JOTC, to:
            <br/><br/>
            Jackson Obedience Training Club<br/>
            PO Box 193<br/>
            Jackson, MS 39205
            <br/><br/>
            Meetings are held on the second Monday of the month. For information
            about meeting places, times and directions, call the Dog Line at
            <a href="tel:+16013523647"><strong>(601) 352-DOGS (3647)</strong></a>.
          </div>
        </div>
        <h3>JOTC Officers</h3>
        <div className="officer-list-container">
          <div className="officer-list">
            <table>
              {this.state.officers.map(officer => {
                return (
                  <tr className="officer" key={officer._id}>
                    <td className="officer-titles">
                      { officer.titles.map(title => <div className="officer-title" key={`${officer._id}-title-${title}`}>{title}</div>) }
                    </td>
                    <td className="officer-name">{officer.name}</td>
                    <td className="officer-contacts">
                      { officer.contacts.map(contact => <Contact contact={contact} key={`${officer._id}-contact-${contact.value}`} />) }
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    );
  }
});
