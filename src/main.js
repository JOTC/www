import React from "react";
import ReactDOM from "react-dom";

import Header from "./elements/header";
import Body from "./elements/body";

// Required by React Material. Can go away with React 1.0.
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(
  <Header/>,
  document.getElementById("header")
);

ReactDOM.render(
  <Body/>,
  document.getElementById("body")
);
