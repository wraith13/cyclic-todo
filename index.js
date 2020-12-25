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
    CyclicToDo.TimeAccuracy = 60 * 1000;
    CyclicToDo.getTicks = function (date) {
        if (date === void 0) { date = new Date(); }
        return Math.floor(date.getTime() / CyclicToDo.TimeAccuracy);
    };
    CyclicToDo.DateStringFromTick = function (tick) {
        if (null === tick) {
            return "N/A";
        }
        else {
            var date = new Date(tick * CyclicToDo.TimeAccuracy);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date.toLocaleDateString() + " " + CyclicToDo.renderTime(tick - CyclicToDo.getTicks(date));
        }
    };
    CyclicToDo.renderTime = function (tick) {
        if (null === tick) {
            return "N/A";
        }
        else if (tick < 0) {
            return "-" + CyclicToDo.renderTime(-tick);
        }
        else {
            var days = Math.floor(tick / (24 * 60));
            var time = Math.floor(tick) % (24 * 60);
            var hour = Math.floor(time / 60);
            var minute = time % 60;
            var timePart = ("00" + hour).slice(-2) + ":" + ("00" + minute).slice(-2);
            return 10 <= days ?
                days.toLocaleString() + " days" :
                0 < days ?
                    days.toLocaleString() + " days " + timePart :
                    timePart;
        }
    };
    CyclicToDo.calulateAverage = function (ticks) { return ticks.reduce(function (a, b) { return a + b; }, 0) / ticks.length; };
    CyclicToDo.calculateStandardDeviation = function (ticks, average) {
        if (average === void 0) { average = CyclicToDo.calulateAverage(ticks); }
        return Math.sqrt(CyclicToDo.calulateAverage(ticks.map(function (i) { return Math.pow((i - average), 2); })));
    };
    CyclicToDo.calculateStandardScore = function (average, standardDeviation, target) {
        return (10 * (target - average) / standardDeviation) + 50;
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
        dom.renderProgressStyle = function (item) { return null === item.progress ?
            undefined :
            1 <= item.progress ?
                "background: #22884455" :
                "background: linear-gradient(to right, #22884466 " + item.progress.toLocaleString("en", { style: "percent" }) + ", rgba(128,128,128,0.2) " + item.progress.toLocaleString("en", { style: "percent" }) + ");"; };
        dom.renderInformation = function (item) {
            return ({
                tag: "div",
                className: null === item.progress ? "task-information no-progress" : "task-information",
                attributes: {
                    style: dom.renderProgressStyle(item),
                },
                children: [
                    {
                        tag: "div",
                        className: "task-last-timestamp",
                        children: [
                            {
                                tag: "span",
                                className: "label",
                                children: "previous (前回):",
                            },
                            {
                                tag: "span",
                                className: "value",
                                children: CyclicToDo.DateStringFromTick(item.previous),
                            }
                        ],
                    },
                    {
                        tag: "div",
                        className: "task-interval-average",
                        children: [
                            {
                                tag: "span",
                                className: "label",
                                children: "expected interval (予想間隔):",
                            },
                            {
                                tag: "span",
                                className: "value",
                                children: null === item.standardDeviation ?
                                    CyclicToDo.renderTime(item.smartAverage) :
                                    CyclicToDo.renderTime(Math.max(item.smartAverage / 10, item.smartAverage - item.standardDeviation)) + " \u301C " + CyclicToDo.renderTime(item.smartAverage + item.standardDeviation),
                            }
                        ],
                    },
                    {
                        tag: "div",
                        className: "task-elapsed-time",
                        children: [
                            {
                                tag: "span",
                                className: "label",
                                children: "elapsed time (経過時間):",
                            },
                            {
                                tag: "span",
                                className: "value",
                                children: CyclicToDo.renderTime(item.elapsed),
                            }
                        ],
                    },
                    /*
                    {
                        tag: "div",
                        className: "task-interval-average",
                        children:
                        [
                            {
                                tag: "span",
                                className: "label",
                                children: "expected interval average (予想間隔平均):",
                            },
                            {
                                tag: "span",
                                className: "value",
                                children: renderTime(item.smartAverage),
                            }
                        ],
                    },
                    {
                        tag: "div",
                        className: "task-interval-average",
                        children:
                        [
                            {
                                tag: "span",
                                className: "label",
                                children: "recentrly interval average (直近間隔平均):",
                            },
                            {
                                tag: "span",
                                className: "value",
                                children: renderTime(item.average),
                            }
                        ],
                    },
                    */
                    {
                        tag: "div",
                        className: "task-count",
                        children: [
                            {
                                tag: "span",
                                className: "label",
                                children: "count (回数):",
                            },
                            {
                                tag: "span",
                                className: "value",
                                children: item.count.toLocaleString(),
                            }
                        ],
                    },
                ],
            });
        };
        dom.renderTodoItem = function (entry, item) {
            return ({
                tag: "div",
                className: "task-item",
                children: [
                    {
                        tag: "div",
                        className: "task-header",
                        children: [
                            {
                                tag: "button",
                                className: item.isDefault ? "default-button" : undefined,
                                children: "Done (完了)",
                                onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var fxxkingTypeScriptCompiler;
                                    return __generator(this, function (_a) {
                                        fxxkingTypeScriptCompiler = CyclicToDo.isSessionPass(entry.pass);
                                        if (fxxkingTypeScriptCompiler) {
                                            window.alert("This is view mode. If this is your to-do list, open the original URL instead of the sharing URL. If this is not your to-do list, you can copy this to-do list from edit mode.\n"
                                                + "\n"
                                                + "これは表示モードです。これが貴方が作成したToDoリストならば、共有用のURLではなくオリジナルのURLを開いてください。これが貴方が作成したToDoリストでない場合、編集モードからこのToDoリストをコピーできます。");
                                        }
                                        else {
                                            CyclicToDo.done(entry.pass, item.todo);
                                            dom.updateTodoScreen(entry);
                                        }
                                        return [2 /*return*/];
                                    });
                                }); }
                            },
                            {
                                tag: "div",
                                className: "task-title",
                                children: item.todo,
                            },
                        ],
                    },
                    // DELETE_ME renderInformation(list, item, getHistory(pass, item.task)),
                    dom.renderInformation(item),
                ],
            });
        };
        dom.renderTodoScreen = function (entry, list) {
            return ({
                tag: "div",
                className: "todo-screen screen",
                children: [
                    dom.renderHeading("h1", entry.title + " Cyclic Todo"),
                ].concat(list.map(function (item) { return dom.renderTodoItem(entry, item); })),
            });
        };
        var updateTodoScreenTimer = undefined;
        dom.updateTodoScreen = function (entry) {
            if (undefined !== updateTodoScreenTimer) {
                clearInterval(updateTodoScreenTimer);
            }
            var histories = {};
            entry.todo.forEach(function (todo) {
                var full = CyclicToDo.getHistory(entry.pass, todo);
                histories[todo] =
                    {
                        recentries: full.filter(function (_, index) { return index < 25; }),
                        previous: full.length <= 0 ? null : full[0],
                        //average: full.length <= 1 ? null: (full[0] -full[full.length -1]) / (full.length -1),
                        count: full.length,
                    };
            });
            var firstStageRecentries = entry.todo.map(function (todo) { return histories[todo]; }).filter(function (history) { return 1 === history.count; }).map(function (history) { return history.recentries[0]; }).sort(CyclicToDo.simpleReverseComparer);
            var firstStage = {
                nones: entry.todo.map(function (todo) { return histories[todo]; }).filter(function (history) { return 0 === history.count; }).length,
                singles: firstStageRecentries.length,
                average: firstStageRecentries.length <= 1 ? null : (firstStageRecentries[0] - firstStageRecentries[firstStageRecentries.length - 1]) / (firstStageRecentries.length - 1),
                standardDeviation: firstStageRecentries.length <= 1 ? null : CyclicToDo.calculateStandardDeviation(firstStageRecentries),
            };
            var secondStageTarget = entry.todo.map(function (todo) { return histories[todo]; }).filter(function (history) { return 2 <= history.count && history.count <= 5; });
            var secondStageRecentries = secondStageTarget.map(function (history) { return history.recentries; }).reduce(function (a, b) { return a.concat(b); }, []).sort(CyclicToDo.simpleReverseComparer);
            var secondStage = {
                average: secondStageRecentries.length <= 1 ? null : (secondStageRecentries[0] - secondStageRecentries[secondStageRecentries.length - 1]) / (secondStageRecentries.length - 1) * secondStageTarget.length,
                standardDeviation: secondStageRecentries.length <= 1 ? null : CyclicToDo.calculateStandardDeviation(secondStageRecentries),
            };
            var titleRecentrly = entry.todo.map(function (todo) { return histories[todo].recentries; }).reduce(function (a, b) { return a.concat(b); }, []).sort(CyclicToDo.simpleReverseComparer);
            var titleRecentrlyAverage = titleRecentrly.length <= 1 ? null : (titleRecentrly[0] - titleRecentrly[titleRecentrly.length - 1]) / (titleRecentrly.length - 1);
            var list = entry.todo.map(function (todo) {
                var history = histories[todo];
                var result = {
                    todo: todo,
                    isDefault: false,
                    progress: null,
                    previous: history.previous,
                    elapsed: null,
                    average: history.recentries.length <= 1 ? null : (history.recentries[0] - history.recentries[history.recentries.length - 1]) / (history.recentries.length - 1),
                    standardDeviation: history.recentries.length <= 1 ?
                        null :
                        (5 < history.recentries.length || null === secondStage.standardDeviation) ?
                            CyclicToDo.calculateStandardDeviation(history.recentries) :
                            (CyclicToDo.calculateStandardDeviation(history.recentries) + secondStage.standardDeviation),
                    count: history.count,
                    smartAverage: null,
                };
                return result;
            });
            var phi = 1.6180339887;
            var calcDecayedProgress = function (item) {
                var _a, _b;
                if (((_a = item.progress) !== null && _a !== void 0 ? _a : 0) <= 1.0 || null === titleRecentrlyAverage) {
                    return item.progress;
                }
                else {
                    var overrate = (item.elapsed - (item.smartAverage + ((_b = item.standardDeviation) !== null && _b !== void 0 ? _b : 0))) / titleRecentrlyAverage;
                    if (overrate <= 1.0) {
                        return item.progress;
                    }
                    else {
                        return 1.0 / Math.log2(Math.sqrt(overrate * 4.0));
                    }
                }
            };
            var todoSorter = function (a, b) {
                if (1 < a.count) {
                    if (null !== a.smartAverage && null !== b.smartAverage) {
                        var rate = Math.min(a.count, b.count) < 5 ? 1.5 : 1.2;
                        if (a.smartAverage < b.smartAverage * rate && b.smartAverage < a.smartAverage * rate) {
                            if (a.elapsed < b.elapsed) {
                                return 1;
                            }
                            if (b.elapsed < a.elapsed) {
                                return -1;
                            }
                        }
                    }
                    else {
                        var a_progress = calcDecayedProgress(a);
                        var b_progress = 1 < b.count ? calcDecayedProgress(b) : (1 / phi);
                        if (a_progress < b_progress) {
                            return 1;
                        }
                        if (b_progress < a_progress) {
                            return -1;
                        }
                    }
                }
                else if (1 < b.count) {
                    return -todoSorter(b, a);
                }
                if (a.count < b.count) {
                    return -1;
                }
                if (b.count < a.count) {
                    return 1;
                }
                var aTodoIndex = entry.todo.indexOf(a.todo);
                var bTodoIndex = entry.todo.indexOf(a.todo);
                if (aTodoIndex < 0 && bTodoIndex < 0) {
                    if (a.todo < b.todo) {
                        return 1;
                    }
                    if (b.todo < a.todo) {
                        return -1;
                    }
                }
                else {
                    if (aTodoIndex < bTodoIndex) {
                        return 1;
                    }
                    if (bTodoIndex < aTodoIndex) {
                        return -1;
                    }
                }
                return 0;
            };
            var updateProgress = function () {
                var now = CyclicToDo.getTicks();
                list.forEach(function (item) {
                    var _a;
                    var history = histories[item.todo];
                    if (0 < history.count) {
                        item.elapsed = now - history.previous;
                        if (5 < history.count) {
                            item.smartAverage =
                                (((history.recentries[0] - history.recentries[Math.min(5, history.recentries.length) - 1]) / (Math.min(5, history.recentries.length) - 1))
                                    + ((history.recentries[0] - history.recentries[Math.min(25, history.recentries.length) - 1]) / (Math.min(25, history.recentries.length) - 1))) / 2;
                        }
                        else if (2 <= history.count) {
                            item.smartAverage =
                                (((history.recentries[0] - history.recentries[Math.min(5, history.recentries.length) - 1]) / (Math.min(5, history.recentries.length) - 1))
                                    + secondStage.average) / 2;
                        }
                        else if (null !== firstStage.average) {
                            item.smartAverage = firstStage.average * (firstStage.nones + firstStage.singles);
                            item.standardDeviation = firstStage.standardDeviation;
                        }
                        else if (null !== secondStage.average) {
                            item.smartAverage = secondStage.average;
                            item.standardDeviation = secondStage.standardDeviation;
                        }
                        if (null !== item.smartAverage) {
                            item.progress = item.elapsed / (item.smartAverage + ((_a = item.standardDeviation) !== null && _a !== void 0 ? _a : 0));
                        }
                    }
                });
                var defaultTodo = JSON.parse(JSON.stringify(list)).sort(todoSorter)[0].todo;
                list.forEach(function (item) { return item.isDefault = defaultTodo === item.todo; });
            };
            updateProgress();
            list.sort(todoSorter);
            minamo_js_1.minamo.dom.replaceChildren(
            //document.getElementById("screen"),
            document.body, dom.renderTodoScreen(entry, list));
            updateTodoScreenTimer = setInterval(function () {
                if (0 < document.getElementsByClassName("todo-screen").length) {
                    updateProgress();
                    minamo_js_1.minamo.dom.replaceChildren(
                    //document.getElementById("screen"),
                    document.body, dom.renderTodoScreen(entry, list));
                }
                else {
                    clearInterval(updateTodoScreenTimer);
                    updateTodoScreenTimer = undefined;
                }
            }, CyclicToDo.TimeAccuracy);
        };
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
                            dom.updateTodoScreen({
                                title: titleDiv.value,
                                pass: passDiv.value,
                                todo: todoDom.value.split("\n").map(function (i) { return i.trim(); })
                            });
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
                                dom.updateTodoScreen({ title: title, pass: pass, todo: todo });
                                break;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); };
})(CyclicToDo = exports.CyclicToDo || (exports.CyclicToDo = {}));
//# sourceMappingURL=index.js.map