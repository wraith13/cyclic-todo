import pomeJson from "../resource/poem.json";
const fs = require("fs");
const https = require("https");
const makePath = (key: string) => `./emoji/${key}.svg`;
const makeUrl = (key: string) => `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_${key}.svg`;
const download = (path: string) => new Promise<string>
(
    (resolve, reject) => https.get
    (
        path, (response: any) =>
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
const step = async (key: string) =>
{
    const filename = `u${key.codePointAt(0)?.toString(16).toLowerCase()}`;
    fs.writeFileSync
    (
        makePath(filename),
        await download(makeUrl(filename))
    );
};
Object.values(pomeJson.image).map(key => step(key));
