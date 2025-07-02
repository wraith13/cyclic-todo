"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var sourceDirectory = "./resource/lang";
var outputDirectory = "./locale/generated";
var description = {
    template: "<meta name=\"description\" lang=\"__LANG__\" content=\"__DESCRIPTION__\">",
    separetor: "\n",
    output: "".concat(outputDirectory, "/description.html"),
};
var twitterDescription = {
    template: "<meta name=\"twitter:description\" lang=\"__LANG__\" content=\"__DESCRIPTION__\">",
    separetor: "\n",
    output: "".concat(outputDirectory, "/twitter-description.html"),
};
var makeMasterFromSource = function () { return __awaiter(void 0, void 0, void 0, function () {
    var temporaryMaster, master;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                temporaryMaster = {};
                return [4 /*yield*/, Promise.all(fs_1.default.readdirSync(sourceDirectory)
                        .filter(function (file) { return file.endsWith(".json"); })
                        .sort()
                        .map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                        var lang, json, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    lang = file.replace(/\.json$/, "");
                                    _b = (_a = JSON).parse;
                                    return [4 /*yield*/, fs_1.default.promises.readFile("".concat(sourceDirectory, "/").concat(file), "utf8")];
                                case 1:
                                    json = _b.apply(_a, [_c.sent()]);
                                    temporaryMaster[lang] = json;
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                _a.sent();
                master = {};
                Object.keys(temporaryMaster)
                    .sort()
                    .forEach(function (key) { return master[key] = temporaryMaster[key]; });
                return [2 /*return*/, master];
        }
    });
}); };
var checkMaster = function (master) {
    var allUniqueKeys = Object.values(master)
        .reduce(function (previous, current) { return previous.concat(Object.keys(current)); }, [])
        .filter(function (i, ix, list) { return list.indexOf(i) === ix; });
    var commonUniqueKeys = Object.values(master)
        .reduce(function (previous, current) { return previous.filter(function (key) { return key in current; }); }, allUniqueKeys);
    Object.keys(master).forEach(function (lang) {
        var langKeys = Object.keys(master[lang]);
        var missingKeys = allUniqueKeys.filter(function (key) { return !langKeys.includes(key); });
        var extraKeys = langKeys.filter(function (key) { return !commonUniqueKeys.includes(key); });
        if (0 < missingKeys.length) {
            if (0 < extraKeys.length) {
                console.error("\uD83D\uDEAB ".concat(sourceDirectory, "/").concat(lang, ".json: Missing keys: ").concat(missingKeys.join(", "), ", Extra keys: ").concat(extraKeys.join(", ")));
            }
            else {
                console.error("\uD83D\uDEAB ".concat(sourceDirectory, "/").concat(lang, ".json: Missing keys: ").concat(missingKeys.join(", ")));
            }
        }
        else if (0 < extraKeys.length) {
            console.error("\uD83D\uDEAB ".concat(sourceDirectory, "/").concat(lang, ".json: Extra keys: ").concat(extraKeys.join(", ")));
        }
    });
};
var writeHtmlPart = function (master, data) { return fs_1.default.writeFileSync(data.output, Object.keys(master).map(function (lang) { return data.template
    .replace(/__LANG__/g, lang)
    .replace(/__LANG_DIRECTION__/g, master[lang]["lang-direction"])
    .replace(/__DESCRIPTION__/g, master[lang]["description"])
    .replace(/__NOSCRIPT_MESSAGE__/g, master[lang]["noscript-message"])
    .replace(/__NOSCRIPT_INTRODUCTION_TITLE__/g, master[lang]["noscript-introduction-title"])
    .replace(/__NOSCRIPT_INTRODUCTION_DESCRIPTION__/g, master[lang]["noscript-introduction-description"]); })
    .join(data.separetor), "utf8"); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var master;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, makeMasterFromSource()];
            case 1:
                master = _a.sent();
                checkMaster(master);
                fs_1.default.writeFileSync("".concat(outputDirectory, "/master.ts"), "export const localeMaster = ".concat(JSON.stringify(master, null, 4), ";"), "utf8");
                fs_1.default.writeFileSync("".concat(outputDirectory, "/manifest.langs.json"), JSON.stringify(Object.keys(master).map(function (lang) { return ({ "__LOCALE__": lang }); }), null, 4), "utf8");
                writeHtmlPart(master, description);
                writeHtmlPart(master, twitterDescription);
                return [2 /*return*/];
        }
    });
}); };
main();
//# sourceMappingURL=index.js.map