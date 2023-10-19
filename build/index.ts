import pomeJson from "../resource/poem.json";
import { locale } from "../script/locale.js";
const fs = require("fs");
const escapeHtml = (text: string) => text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const makeAttributes = (source: any): string =>
    Object.keys(source)
    .map
    (
        (key: string) =>
        {
            const value = source[key];
            switch(key)
            {
            case "tag":
                return null;
            case "children":
                return null;
            case "className":
                return `class="${value}"`;
            }
            return `${key}="${encodeURI(value)}"`;
        }
    )
    .filter(i => null !== i)
    .join(" ");
const makeHtml = (source: any): string =>
{
    if ("string" === typeof source)
    {
        return escapeHtml(source);
    }
    if (Array.isArray(source))
    {
        return source.map(i => makeHtml(i)).join("");
    }
    if ("object" === typeof source && "tag" in source)
    {
        if ("children" in source)
        {
            var result = "<";
            result += (`${source.tag} ` +makeAttributes(source)).trim();
            result += ">";
            result += makeHtml(source.children);
            result += `</${source.tag}>`;
            return result;
        }
        else
        {
            var result = "<";
            result += (`${source.tag} ` +makeAttributes(source)).trim();
            result += "/>";
            return result;
        }
    }
    return `${source}`;
};
export const JsonHeader = "JSON:";
const stringOrJson = (text: string): string =>
    text.startsWith(JsonHeader) ? makeHtml(JSON.parse(text.substring(JsonHeader.length))): text;
const makePoem = (key: keyof typeof pomeJson.image) =>
{
    var result = "";
    result += "<div class=\"poem\">\r\n";
    result += `<span class=\"poem-title\">${locale.string(`poem.${key}.title`)}</span>\r\n`;
    result += `<span class=\"poem-subtitle\">${locale.string(`poem.${key}.subtitle`)}</span>\r\n`;
    result += `<span class=\"poem-description\">${stringOrJson(locale.string(`poem.${key}.description`))}</span>\r\n`;
    result += `<span class=\"poem-image\">${pomeJson.image[key]}</span>\r\n`;
    result += "</div>\r\n";
    return result;
}
const makePoemList = (lang: locale.LocaleType) =>
{
    locale.setLocale(lang);
    var result = "";
    result += "<div class=\"poem-list\">\r\n";
    pomeJson.list.static.map(key => result += makePoem(key as keyof typeof pomeJson.image));
    result += "</div>\r\n";
    return result;
};
const makePoemAll = () => locale.locales.map(i => makePoemList(i)).join("");
fs.writeFileSync
(
    "./poem.html",
    makePoemAll()
);
