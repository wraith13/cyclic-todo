import pomeJson from "../resource/poem.json";
const fs = require("fs");
const https = require("https");
const makePath = (key: string) => `./emoji/noto-emoji/${key}.svg`;
const makeUrl = (key: string) => `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_${key}.svg`;
const download = (url: string) => new Promise<string>
(
    (resolve, reject) => https.get
    (
        url, (response: any) =>
        {
            if (200 <= response.statusCode && response.statusCode < 300)
            {
                let buffer = "";
                response.on("data", (chunk: string) => buffer += chunk);
                response.on("end", () => resolve(buffer));
            }
            else
            {
                reject();
            }
        }
    )
    .on("error", () => reject())
);
const extractIdList = (svg: string): string[] =>
{
    const regex = /<[^>]+id="([^"]*)"/g;
    const result: string[] = [];
    let match;
    while(null !== (match = regex.exec(svg)))
    {
        if (match[1])
        {
            result.push(match[1]);
        }
    }
    return result;
};
const regulateSvg = (filename:string, svg: string): string =>
{
    let result = svg.replace(/(<svg[^>]*)(\sid="(?:[^"]*)")([^>]*>)/g, "$1$3");
    extractIdList(result).forEach
    (
        id =>
        {
            result = result.replace(new RegExp(id, "g"), `${filename}_${id}`)
        }
    );
    return result;
};
const resource: { [key:string]: string; } = { };
const step = async (key: string) =>
{
    const filename = `u${key.codePointAt(0)?.toString(16).toLowerCase()}`;
    const path = makePath(filename);
    fs.writeFileSync
    (
        path,
        regulateSvg(filename, await download(makeUrl(filename)))
    );
    resource[filename] = path;
};
const main = async () =>
{
    await Promise.all(Object.values(pomeJson.image).map(key => step(key)));
    fs.writeFileSync(`./emoji/noto-emoji/index.json`, JSON.stringify(resource, null, 4));
};
main();
