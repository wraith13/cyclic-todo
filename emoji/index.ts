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
const step = async (key: string) =>
{
    const codePoint = key.codePointAt(0) as Number;
    const filename = `u${codePoint.toString(16).toLowerCase()}`;
    const path = makePath(filename);
    if (fs.existsSync(path))
    {
        console.log(`➡️ ${key}:${filename} has already been downloaded.`);
    }
    else
    {
        try
        {
            fs.writeFileSync
            (
                path,
                regulateSvg(filename, await download(makeUrl(filename)))
            );
            console.log(`✅ Successful download of ${key}:${filename}.`);
        }
        catch(error)
        {
            console.log(`🚫 ${key}:${filename} download failed.`);
            throw error;
        }
    }
    const result =
    {
        codePoint,
        filename,
        path,
    };
    return result;
    
};
const uniqueFilter = <T>(i: T, ix: number, list: T[]) => ix === list.indexOf(i);
const main = async () =>
{
    const resource: { [key:string]: string; } = { };
    (await Promise.all(Object.values(pomeJson.image).filter(uniqueFilter).map(key => step(key))))
        .sort((a, b) => a.codePoint < b.codePoint ? -1: a.codePoint === b.codePoint ? 0: 1)
        .forEach(i => resource[i.filename] = i.path);
    fs.writeFileSync(`./emoji/noto-emoji/index.json`, JSON.stringify(resource, null, 4));
};
main();
