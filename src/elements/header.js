const React = require("react");
const Headroom = require("react-headroom");

module.exports = React.createClass({
  render() {
    return (
      <Headroom>
        <img src="media/logo.svg" className="logo"/>
        <h1>
          Jackson Obedience<br/>Training Club
          <small>
            Teaching You to Train Your Dog
          </small>
        </h1>
        <nav>
          <button>Home</button>
          <button>Shows</button>
          <button>Classes</button>
          <button>Pictures</button>
          <button>Calendar</button>
          <button>Links</button>
          <button>About JOTC</button>
        </nav>
      </Headroom>
    );
  }
});
