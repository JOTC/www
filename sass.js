"use strict";
const path = require("path");

let paths = [ ];
paths.push(require("bourbon").includePaths);
paths.push(require("node-reset-scss").includePath);
paths.push(path.dirname(require.resolve("bourbon-neat")));

console.log(paths.join(":"));
