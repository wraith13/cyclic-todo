'use strict';
const fs = require("fs");
const fget = path => fs.readFileSync(path, { encoding: "utf-8" });
const images = require("./resource/images.json");
fs.writeFileSync
(
    "./index.html",
    fget("./index.template.html")
        .replace
        (
            /__BUILD_MESSAGE__/g,
            "This file is genereted by build.js. See README.md. このファイルは build.js によって生成されました。README.md を参照してください。"
        )
        .replace
        (
            /__STYLE__/g,
            fget("./css/index.css")
        )
        .replace
        (
            /__EVIL_COMMONJS__/g,
            fget("./evil-commonjs/index.js")
        )
        .replace
        (
            /__SCRIPT__/g,
            fget("./script/index.js")
        )
        .replace
        (
            /__IMAGES__/g,
            Object.keys(images)
                .map(id => `<div id="${id}">${fget(images[id]).replace(/[\w\W]*(<svg)/g, "$1")}</div>`)
                .join("")
        )
);

// how to run: node ./build.js
