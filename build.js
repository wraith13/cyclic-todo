'use strict';
const fs = require("fs");
fs.writeFileSync("./index.html", fs.readFileSync("./index.template.html", { encoding: "utf-8" }).replace(/__TICK__/g, new Date().getTime()));

// how to run: node ./build.js
