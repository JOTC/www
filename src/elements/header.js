import React from "react";
import Headroom from "react-headroom";
import { Link } from "react-router";

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
          <a href="#/"><button>Home</button></a>
          <a href="#/shows"><button>Shows</button></a>
          <a href="#/classes"><button>Classes</button></a>
          <a href="#/pictures"><button>Pictures</button></a>
          <a href="#/calendar"><button>Calendar</button></a>
          <a href="#/links"><button>Links</button></a>
          <a href="#/about"><button>About JOTC</button></a>
        </nav>
      </Headroom>
    );
  }
});
