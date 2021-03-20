'use strict';
const fs = require("fs");
const fget = path => fs.readFileSync(path, { encoding: "utf-8" });
const resource = require("./resource.json");
fs.writeFileSync
(
    "./index.html",
    fget("./index.template.html")
        .replace(/__STYLE__/g, fget("./css/index.css"))
        .replace(/__EVIL_COMMONJS__/g, fget("./evil-commonjs/index.js"))
        .replace(/__SCRIPT__/g, fget("./index.js"))
        .replace(/__RESOURCE__/g, Object.keys(resource).map(id => `<div id="${id}">${fget(resource[id]).replace(/[\w\W]*(<svg)/g, "$1")}</div>`).join(""))
);

// how to run: node ./build.js
