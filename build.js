'use strict';
const fs = require("fs");
const fget = path => fs.readFileSync(path, { encoding: "utf-8" });
fs.writeFileSync
(
    "./index.html",
    fget("./index.template.html")
        .replace(/__STYLE__/g, fget("./css/index.css"))
        .replace(/__SCRIPT__/g, fget("./index.js"))
);

// how to run: node ./build.js
