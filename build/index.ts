import pomeJson from "../resource/poem.json";
import { locale } from "../script/locale.js";

const fs = require("fs");
const makePoem = (key: keyof typeof pomeJson) =>
{
    var result = "";
    result += "<div class=\"poem\">\r\n";
    result += `<span class=\"poem-title\">${locale.string(`poem.${key}.title`)}</span>\r\n`;
    result += `<span class=\"poem-subtitle\">${locale.string(`poem.${key}.subtitle`)}</span>\r\n`;
    result += `<span class=\"poem-description\">${locale.string(`poem.${key}.description`)}</span>\r\n`;
    result += `<span class=\"poem-image\">${pomeJson[key]}</span>\r\n`;
    result += "</div>\r\n";
    return result;
}
const makePoemList = (lang: locale.LocaleType) =>
{
    locale.setLocale(lang);
    var result = "";
    result += "<div class=\"poem-list\">\r\n";
    Object.keys(pomeJson).map(key => result += makePoem(key as keyof typeof pomeJson));
    result += "</div>\r\n";
    return result;
};
const makePoemAll = () => locale.locales.map(i => makePoemList(i)).join("");
fs.writeFileSync
(
    "./poem.html",
    makePoemAll()
);
