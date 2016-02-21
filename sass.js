"use strict";
const path = require("path");

let paths = [ ];
paths = paths.concat(require("bourbon").includePaths);
paths = paths.concat(require("node-reset-scss").includePath);

console.log(paths.join(":"));
