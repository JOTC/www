const React = require("react");
const ReactDOM = require("react-dom");

const Header = require("./elements/header");

console.log(document.getElementById("header"));
ReactDOM.render(
  <Header/>,
  document.getElementById("header")
)
