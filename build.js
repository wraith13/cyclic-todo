'use strict';
const fs = require("fs");
const fget = path => fs.readFileSync(path, { encoding: "utf-8" });
const json = require("./build.json");
fs.writeFileSync
(
    json.output.path,
    Object.keys(json.parameters).map
    (
        key =>
        {
            const value = json.parameters[key];
            let work = null;
            if ("string" === typeof value)
            {
                work = value;
            }
            else
            if ("string" === typeof value.path)
            {
                work = fget(value.path);
            }
            else
            if ("string" === typeof value.resource)
            {
                const resource = require(value.resource);
                work = Object.keys(resource)
                    .map(id => `<div id="${id}">${fget(resource[id]).replace(/[\w\W]*(<svg)/g, "$1")}</div>`)
                    .join("");
            }
            else
            if (undefined !== value.call)
            {
                if ("timestamp" === value.call)
                {
                    work = `${new Date()}`;
                }
                else
                {
                    console.error(`unknown call: ${key}: ${JSON.stringify(value)}`);
                }
            }
            else
            {
                console.error(`unknown parameter: ${key}: ${JSON.stringify(value)}`);
            }
            return { key, work };
            //html = html.replace(new RegExp(key, "g"), value);
        }
    )
    .reduce
    (
        (r, p) => "string" === typeof p.work ? r.replace(new RegExp(p.key, "g"), p.work): r,
        fget(json.template.path)
    )
)

// how to run: `node ./build.js`
