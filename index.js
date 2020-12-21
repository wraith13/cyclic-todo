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
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyclicToDo = void 0;
var minamo_js_1 = require("./minamo.js");
var CyclicToDo;
(function (CyclicToDo) {
    var _this = this;
    CyclicToDo.makeTaskEntryComparer = function (todo) { return function (a, b) {
        if (a.tick < b.tick) {
            return -1;
        }
        if (b.tick < a.tick) {
            return 1;
        }
        var aTaskIndex = todo.indexOf(a.task);
        var bTaskIndex = todo.indexOf(a.task);
        if (aTaskIndex < 0 && bTaskIndex < 0) {
            if (a.task < b.task) {
                return 1;
            }
            if (b.task < a.task) {
                return -1;
            }
        }
        else {
            if (aTaskIndex < bTaskIndex) {
                return 1;
            }
            if (bTaskIndex < aTaskIndex) {
                return -1;
            }
        }
        return 0;
    }; };
    CyclicToDo.simpleComparer = function (a, b) {
        if (a < b) {
            return -1;
        }
        if (b < a) {
            return 1;
        }
        return 0;
    };
    CyclicToDo.simpleReverseComparer = function (a, b) { return -CyclicToDo.simpleComparer(a, b); };
    CyclicToDo.TimeAccuracy = 100000;
    CyclicToDo.getTotalMinutes = function (tick) { return (tick * CyclicToDo.TimeAccuracy) / (60 * 1000); };
    CyclicToDo.getTicks = function (date) {
        if (date === void 0) { date = new Date(); }
        return Math.floor(date.getTime() / CyclicToDo.TimeAccuracy);
    };
    CyclicToDo.DateFromTick = function (tick) { return new Date(tick * CyclicToDo.TimeAccuracy); };
    CyclicToDo.makeElapsedTime = function (tick) {
        var totalMinutes = Math.floor(CyclicToDo.getTotalMinutes(CyclicToDo.getTicks() - tick));
        var days = Math.floor(totalMinutes / (24 * 60));
        var time = totalMinutes % (24 * 60);
        var hour = Math.floor(time / 60);
        var minute = time % 60;
        var timePart = ("00" + hour).slice(-2) + ":" + ("00" + minute).slice(-2);
        return 0 < days ? days.toLocaleString() + " days " + timePart : timePart;
    };
    CyclicToDo.sessionPassPrefix = "@Session";
    CyclicToDo.generatePass = function (seed) {
        if (seed === void 0) { seed = new Date().getTime(); }
        return ("" + ((seed * 13738217) ^ ((seed % 387960371999) >> 5))).slice(-8);
    };
    CyclicToDo.isSessionPass = function (pass) { return pass.startsWith(CyclicToDo.sessionPassPrefix); };
    CyclicToDo.getStorage = function (pass) { return CyclicToDo.isSessionPass(pass) ? minamo_js_1.minamo.sessionStorage : minamo_js_1.minamo.localStorage; };
    CyclicToDo.makeHistoryKey = function (pass, task) { return "pass:(" + pass + ").task:" + task + ".history"; };
    CyclicToDo.getHistory = function (pass, task) { var _a; return (_a = CyclicToDo.getStorage(pass).getOrNull(CyclicToDo.makeHistoryKey(pass, task))) !== null && _a !== void 0 ? _a : []; };
    CyclicToDo.setHistory = function (pass, task, list) {
        return CyclicToDo.getStorage(pass).set(CyclicToDo.makeHistoryKey(pass, task), list);
    };
    CyclicToDo.addHistory = function (pass, task, tick) {
        var list = CyclicToDo.getHistory(pass, task).concat(tick).filter(function (i, index, array) { return index === array.indexOf(i); });
        list.sort(CyclicToDo.simpleReverseComparer);
        CyclicToDo.setHistory(pass, task, list);
    };
    CyclicToDo.mergeHistory = function (pass, todo, ticks) {
        var temp = {};
        todo.forEach(function (task) { return temp[task] = []; });
        ticks.forEach(function (tick, index) {
            if (null !== tick) {
                temp[todo[index % todo.length]].push(tick);
            }
        });
        todo.forEach(function (task) { return CyclicToDo.addHistory(pass, task, temp[task]); });
    };
    CyclicToDo.getLastTick = function (pass, task) { var _a; return (_a = CyclicToDo.getHistory(pass, task)[0]) !== null && _a !== void 0 ? _a : 0; };
    CyclicToDo.getToDoHistory = function (pass, todo) { return todo
        .map(function (task) { return CyclicToDo.getHistory(pass, task).map(function (tick) { return ({ task: task, tick: tick }); }); })
        .reduce(function (a, b) { return a.concat(b); }, [])
        .sort(CyclicToDo.makeTaskEntryComparer(todo)); };
    CyclicToDo.getToDoEntries = function (pass, todo) { return todo
        .map(function (task) { return ({ task: task, tick: CyclicToDo.getLastTick(pass, task) }); })
        .sort(CyclicToDo.makeTaskEntryComparer(todo)); };
    CyclicToDo.done = function (pass, task) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, CyclicToDo.addHistory(pass, task, CyclicToDo.getTicks())];
    }); }); };
    var dom;
    (function (dom) {
        var _this = this;
        dom.renderHeading = function (tag, text) {
            return ({
                tag: tag,
                children: text,
            });
        };
        dom.renderLastInformation = function (entry) {
            return ({
                tag: "div",
                className: "task-last-information",
                children: entry.tick <= 0 ? [] :
                    [
                        {
                            tag: "div",
                            className: "task-last-timestamp",
                            children: "previous (\u524D\u56DE): " + CyclicToDo.DateFromTick(entry.tick).toLocaleString()
                        },
                        {
                            tag: "div",
                            className: "task-last-elapsed-time",
                            children: "elapsed time (\u7D4C\u904E\u6642\u9593): " + CyclicToDo.makeElapsedTime(entry.tick),
                        },
                    ],
            });
        };
        dom.renderDoneButton = function (title, pass, list, entry, isDefault) {
            return ({
                tag: "button",
                className: isDefault ? "default-button" : undefined,
                children: [
                    {
                        tag: "div",
                        className: "button-title",
                        children: entry.task,
                    },
                    dom.renderLastInformation(entry),
                ],
                onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (CyclicToDo.isSessionPass(pass)) {
                            window.alert("This is view mode. If this is your to-do list, open the original URL instead of the sharing URL. If this is not your to-do list, you can copy this to-do list from edit mode.\n"
                                + "\n"
                                + "これは表示モードです。これが貴方が作成したToDoリストならば、共有用のURLではなくオリジナルのURLを開いてください。これが貴方が作成したToDoリストでない場合、編集モードからこのToDoリストをコピーできます。");
                        }
                        else {
                            CyclicToDo.done(pass, entry.task);
                            dom.updateTodoScreen(title, pass, CyclicToDo.getToDoEntries(pass, list.map(function (i) { return i.task; })));
                        }
                        return [2 /*return*/];
                    });
                }); }
            });
        };
        dom.renderTodoScreen = function (title, pass, list) {
            return ({
                tag: "div",
                className: "todo-screen screen",
                children: [
                    dom.renderHeading("h2", title),
                ].concat(list.map(function (entry, index) { return dom.renderDoneButton(title, pass, list, entry, 0 === index); })),
            });
        };
        dom.updateTodoScreen = function (title, pass, list) { return minamo_js_1.minamo.dom.replaceChildren(
        //document.getElementById("screen"),
        document.body, dom.renderTodoScreen(title, pass, list)); };
        dom.renderEditScreen = function (title, pass, todo) {
            var titleDiv = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                tag: "input",
                className: "edit-title-input",
                value: title,
            });
            var passDiv = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                tag: "input",
                className: "edit-pass-input",
                children: CyclicToDo.isSessionPass(pass) ? CyclicToDo.generatePass() : pass,
            });
            var todoDom = minamo_js_1.minamo.dom.make(HTMLTextAreaElement)({
                tag: "textarea",
                className: "edit-todo-input",
                children: todo.join("\n"),
            });
            var result = {
                tag: "div",
                className: "application-form",
                children: [
                    {
                        tag: "label",
                        children: [
                            {
                                tag: "span",
                                children: "channel",
                            },
                            titleDiv,
                        ],
                    },
                    {
                        tag: "label",
                        children: [
                            {
                                tag: "span",
                                children: "channel",
                            },
                            passDiv,
                        ],
                    },
                    {
                        tag: "label",
                        children: [
                            {
                                tag: "span",
                                children: "text",
                            },
                            todoDom,
                        ],
                    },
                    {
                        tag: "button",
                        children: "default-button",
                        onclick: function () {
                            dom.updateTodoScreen(titleDiv.value, passDiv.value, CyclicToDo.getToDoEntries(passDiv.value, todoDom.value.split("\n").map(function (i) { return i.trim(); })));
                        }
                    },
                ]
            };
            return result;
        };
        dom.updateEditScreen = function (title, pass, todo) { return minamo_js_1.minamo.dom.replaceChildren(
        //document.getElementById("screen"),
        document.body, dom.renderEditScreen(title, pass, todo)); };
        dom.renderWelcomeScreen = function (_pass) {
            return ({
                tag: "div",
                className: "welcome-screen screen",
                children: [
                    dom.renderHeading("h2", "title"),
                ],
            });
        };
        dom.updateWelcomeScreen = function (pass) { return minamo_js_1.minamo.dom.replaceChildren(
        //document.getElementById("screen"),
        document.body, dom.renderWelcomeScreen(pass)); };
        var screen = [
            dom.renderHeading("h1", document.title),
            {
                tag: "a",
                className: "github",
                children: "GitHub",
                href: "https://github.com/wraith13/cyclic-todo"
            },
        ];
        dom.showWindow = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, minamo_js_1.minamo.dom.appendChildren(document.body, screen)];
            });
        }); };
    })(dom = CyclicToDo.dom || (CyclicToDo.dom = {}));
    CyclicToDo.getUrlParams = function (url) {
        if (url === void 0) { url = location.href; }
        var result = {};
        url
            .replace(/.*\?/, "")
            .replace(/#.*/, "")
            .split("&")
            .map(function (kvp) { return kvp.split("="); })
            .filter(function (kvp) { return 2 <= kvp.length; })
            .forEach(function (kvp) { return result[kvp[0]] = decodeURIComponent(kvp[1]); });
        return result;
    };
    CyclicToDo.getUrlHash = function (url) {
        if (url === void 0) { url = location.href; }
        return url.replace(/[^#]*#?/, "");
    };
    CyclicToDo.makeUrl = function (args, hash, href) {
        if (hash === void 0) { hash = CyclicToDo.getUrlHash(); }
        if (href === void 0) { href = location.href; }
        return href
            .replace(/\?.*/, "")
            .replace(/#.*/, "")
            + "?"
            + Object.keys(args).map(function (i) { return i + "=" + encodeURIComponent(args[i]); }).join("&")
            + ("#" + hash);
    };
    CyclicToDo.makeSharingUrl = function (url) {
        if (url === void 0) { url = location.href; }
        var urlParams = CyclicToDo.getUrlParams(url);
        if (undefined !== urlParams["pass"]) {
            delete urlParams["pass"];
        }
        return CyclicToDo.makeUrl(urlParams, CyclicToDo.getUrlHash(url), url);
    };
    CyclicToDo.start = function () { return __awaiter(_this, void 0, void 0, function () {
        var urlParams, hash, title, pass, todo, history;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    console.log("start!!!");
                    urlParams = CyclicToDo.getUrlParams();
                    hash = CyclicToDo.getUrlHash();
                    title = (_a = urlParams["title"]) !== null && _a !== void 0 ? _a : "untitled";
                    pass = (_b = urlParams["pass"]) !== null && _b !== void 0 ? _b : CyclicToDo.sessionPassPrefix + ":" + new Date().getTime();
                    todo = JSON.parse((_c = urlParams["todo"]) !== null && _c !== void 0 ? _c : "null");
                    history = JSON.parse((_d = urlParams["history"]) !== null && _d !== void 0 ? _d : "null");
                    return [4 /*yield*/, dom.showWindow()];
                case 1:
                    _g.sent();
                    document.title = title + " Cyclic ToDo";
                    if (((_e = todo === null || todo === void 0 ? void 0 : todo.length) !== null && _e !== void 0 ? _e : 0) <= 0) {
                        switch (hash) {
                            // case "import":
                            //     dom.updateImportScreen(pass);
                            //     break;
                            case "edit":
                                console.log("show edit screen");
                                dom.updateEditScreen(title, pass, []);
                                break;
                            default:
                                console.log("show welcome screen");
                                dom.updateWelcomeScreen(pass);
                                break;
                        }
                    }
                    else {
                        if (0 < ((_f = history === null || history === void 0 ? void 0 : history.length) !== null && _f !== void 0 ? _f : 0)) {
                            CyclicToDo.mergeHistory(pass, todo, history);
                        }
                        switch (hash) {
                            case "edit":
                                console.log("show edit screen");
                                dom.updateEditScreen(title, pass, todo);
                                break;
                            // case "history":
                            //     dom.updateHistoryScreen(pass, getToDoHistory(pass, todo));
                            //     break;
                            // case "statistics":
                            //     dom.updateStatisticsScreen(title, pass, todo);
                            //     break;
                            // case "import":
                            //     dom.updateImportScreen(pass);
                            //     break;
                            // case "export":
                            //     dom.updateExportScreen(title, pass, getToDoHistory(pass, todo));
                            //     break;
                            default:
                                console.log("show todo screen");
                                dom.updateTodoScreen(title, pass, CyclicToDo.getToDoEntries(pass, todo));
                                break;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); };
})(CyclicToDo = exports.CyclicToDo || (exports.CyclicToDo = {}));
//# sourceMappingURL=index.js.map