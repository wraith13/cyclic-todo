'use strict';
const child_process = require("child_process");
const fs = require("fs");
const fget = path => fs.readFileSync(path, { encoding: "utf-8" });
const evalValue = (value) =>
{
    if ("string" === typeof value)
    {
        return value;
    }
    else
    if ("string" === typeof value.path)
    {
        return fget(value.path);
    }
    else
    if ("string" === typeof value.resource)
    {
        const resource = require(value.resource);
        return Object.keys(resource)
            .map(id => `<div id="${id}">${fget(resource[id]).replace(/[\w\W]*(<svg)/g, "$1")}</div>`)
            .join("");
    }
    else
    if (undefined !== value.call)
    {
        if ("timestamp" === value.call)
        {
            return `${new Date()}`;
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
    return null;
};
const json = require("./build.json");
json.preprocesses.forEach
(
    command =>
    {
        console.log(command);
        child_process.execSync(command);
    }
);
const template = evalValue(json.template);
Object.keys(json.parameters).forEach
(
    key =>
    {
        if (template === template.replace(new RegExp(key, "g"), ""))
        {
            console.error(`${key} not found in ${JSON.stringify(json.template)}.`);
        }
    }
);
fs.writeFileSync
(
    json.output.path,
    Object.keys(json.parameters).map
    (
        key => ({ key, work: evalValue(json.parameters[key]) })
    )
    .reduce
    (
        (r, p) => "string" === typeof p.work ? r.replace(new RegExp(p.key, "g"), p.work): r,
        template
    )
)

// how to run: `node ./build.js`
