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
var __1 = require("..");
var test;
(function (test_1) {
    var _this = this;
    var counts = {
        total: 0,
        ok: 0,
        ng: 0,
    };
    var resultCount = function (result) {
        ++counts.total;
        result.isSucceeded ? ++counts.ok : ++counts.ng;
        return result;
    };
    var makeHeading = function (tag, text) {
        return ({
            tag: tag,
            children: text,
        });
    };
    var makeResultTable = function (result) {
        return ({
            tag: "table",
            className: "details",
            children: [
                {
                    tag: "tr",
                    children: [
                        {
                            tag: "th",
                            children: "result",
                        },
                        {
                            tag: "th",
                            children: "type",
                        },
                        {
                            tag: "th",
                            children: "expression",
                        },
                        {
                            tag: "th",
                            children: "data",
                        },
                    ],
                },
            ].concat(result
                .map(resultCount)
                .map(function (i) {
                return ({
                    tag: "tr",
                    className: i.isSucceeded ? undefined : "error",
                    children: [
                        {
                            tag: "td",
                            children: i.isSucceeded ? "✅ OK" : "🚫 NG",
                        },
                        {
                            tag: "td",
                            children: i.testType,
                        },
                        {
                            tag: "td",
                            children: i.expression,
                        },
                        {
                            tag: "td",
                            children: undefined === i ?
                                "undefined" :
                                JSON.stringify(i.data),
                        },
                    ]
                });
            }))
        });
    };
    test_1.tryTest = function (expression) {
        var result = {
            isSucceeded: false,
            result: undefined,
            error: undefined,
        };
        try {
            console.log("try " + expression);
            result.result = eval(expression);
            result.isSucceeded = true;
        }
        catch (error) {
            result.error = error instanceof Error ?
                {
                    name: error.name,
                    message: error.message,
                } :
                error;
        }
        return result;
    };
    test_1.evalAsync = function (expression) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, eval(expression)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); };
    test_1.tryTestAsync = function (expression) { return __awaiter(_this, void 0, void 0, function () {
        var result, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    result = {
                        isSucceeded: false,
                        result: undefined,
                        error: undefined,
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    console.log("try " + expression);
                    _a = result;
                    return [4 /*yield*/, test_1.evalAsync(expression)];
                case 2:
                    _a.result = _b.sent();
                    result.isSucceeded = true;
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    result.error = error_1 instanceof Error ?
                        {
                            name: error_1.name,
                            message: error_1.message,
                        } :
                        error_1;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, result];
            }
        });
    }); };
    test_1.test = function (expression) {
        var result = test_1.tryTest(expression);
        return {
            isSucceeded: result.isSucceeded,
            testType: "success",
            expression: expression,
            data: result.isSucceeded ?
                { result: result.result, } :
                { error: result.error, },
        };
    };
    test_1.testAsync = function (expression) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.tryTestAsync(expression)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, {
                            isSucceeded: result.isSucceeded,
                            testType: "success",
                            expression: "await " + expression,
                            data: result.isSucceeded ?
                                { result: result.result, } :
                                { error: result.error, },
                        }];
            }
        });
    }); };
    test_1.errorTest = function (expression) {
        var result = test_1.tryTest(expression);
        return {
            isSucceeded: !result.isSucceeded,
            testType: "error",
            expression: expression,
            data: result.isSucceeded ?
                { result: result.result, } :
                { error: result.error, },
        };
    };
    test_1.errorTestAsync = function (expression) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.tryTestAsync(expression)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, {
                            isSucceeded: !result.isSucceeded,
                            testType: "error",
                            expression: "await " + expression,
                            data: result.isSucceeded ?
                                { result: result.result, } :
                                { error: result.error, },
                        }];
            }
        });
    }); };
    test_1.equalTest = function (expression, predicted) {
        var result = test_1.tryTest(expression);
        return {
            isSucceeded: result.isSucceeded && JSON.stringify(predicted) === JSON.stringify(result.result),
            testType: "equal",
            expression: JSON.stringify(predicted) + " === " + expression,
            data: result.isSucceeded ?
                { predicted: predicted, result: result.result, } :
                { predicted: predicted, error: result.error, },
        };
    };
    test_1.equalTestAsync = function (expression, predicted) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_1.tryTestAsync(expression)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, {
                            isSucceeded: result.isSucceeded && JSON.stringify(predicted) === JSON.stringify(result.result),
                            testType: "equal",
                            expression: JSON.stringify(predicted) + " === await " + expression,
                            data: result.isSucceeded ?
                                { predicted: predicted, result: result.result, } :
                                { predicted: predicted, error: result.error, },
                        }];
            }
        });
    }); };
    test_1.start = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _b = (_a = __1.minamo.dom).appendChildren;
                    _c = [document.body];
                    _d = [makeHeading("h1", document.title),
                        {
                            tag: "p",
                            children: [
                                "minamo.js is a necessary, sufficient, simple and compact JavaScript/TypeScript library.",
                                { tag: "a", className: "github", href: "https://github.com/wraith13/minamo.js", children: "GitHub", },
                            ],
                        },
                        makeHeading("h2", "summary"),
                        makeHeading("h2", "minamo.core"),
                        makeHeading("h3", "minamo.core.exists"),
                        makeResultTable([
                            test_1.equalTest("minamo.core.exists({})", true),
                            test_1.equalTest("minamo.core.exists([])", true),
                            test_1.equalTest("minamo.core.exists(\"abc\")", true),
                            test_1.equalTest("minamo.core.exists(true)", true),
                            test_1.equalTest("minamo.core.exists(false)", true),
                            test_1.equalTest("minamo.core.exists(\"0\")", true),
                            test_1.equalTest("minamo.core.exists(0)", true),
                            test_1.equalTest("minamo.core.exists(\"\")", true),
                            test_1.equalTest("minamo.core.exists(null)", false),
                            test_1.equalTest("minamo.core.exists(undefined)", false),
                        ]),
                        makeHeading("h3", "minamo.core.existsOrThrow"),
                        makeResultTable([
                            test_1.equalTest("minamo.core.existsOrThrow({})", {}),
                            test_1.equalTest("minamo.core.existsOrThrow([])", []),
                            test_1.equalTest("minamo.core.existsOrThrow(\"abc\")", "abc"),
                            test_1.equalTest("minamo.core.existsOrThrow(true)", true),
                            test_1.equalTest("minamo.core.existsOrThrow(false)", false),
                            test_1.equalTest("minamo.core.existsOrThrow(\"0\")", "0"),
                            test_1.equalTest("minamo.core.existsOrThrow(0)", 0),
                            test_1.equalTest("minamo.core.existsOrThrow(\"\")", ""),
                            test_1.errorTest("minamo.core.existsOrThrow(null)"),
                            test_1.errorTest("minamo.core.existsOrThrow(undefined)"),
                        ]),
                        makeHeading("h3", "minamo.core.getOrCall"),
                        makeResultTable([
                            test_1.equalTest("minamo.core.getOrCall(\"abc\")", "abc"),
                            test_1.equalTest("minamo.core.getOrCall(true)", true),
                            test_1.equalTest("minamo.core.getOrCall(false)", false),
                            test_1.equalTest("minamo.core.getOrCall(\"0\")", "0"),
                            test_1.equalTest("minamo.core.getOrCall(0)", 0),
                            test_1.equalTest("minamo.core.getOrCall(\"\")", ""),
                            test_1.equalTest("minamo.core.getOrCall(null)", null),
                            test_1.equalTest("minamo.core.getOrCall(undefined)", undefined),
                            test_1.equalTest("minamo.core.getOrCall(()=>\"abc\")", "abc"),
                            test_1.equalTest("minamo.core.getOrCall(()=>true)", true),
                            test_1.equalTest("minamo.core.getOrCall(()=>false)", false),
                            test_1.equalTest("minamo.core.getOrCall(()=>\"0\")", "0"),
                            test_1.equalTest("minamo.core.getOrCall(()=>0)", 0),
                            test_1.equalTest("minamo.core.getOrCall(()=>\"\")", ""),
                            test_1.equalTest("minamo.core.getOrCall(()=>null)", null),
                            test_1.equalTest("minamo.core.getOrCall(()=>undefined)", undefined),
                        ]),
                        makeHeading("h3", "minamo.core.getOrCallAsync")];
                    _e = makeResultTable;
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(\"abc\")", "abc")];
                case 1:
                    _f = [
                        _j.sent()
                    ];
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(true)", true)];
                case 2:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(false)", false)];
                case 3:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(\"0\")", "0")];
                case 4:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(0)", 0)];
                case 5:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(\"\")", "")];
                case 6:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(null)", null)];
                case 7:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(undefined)", undefined)];
                case 8:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(async ()=>\"abc\")", "abc")];
                case 9:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(async ()=>true)", true)];
                case 10:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(async ()=>false)", false)];
                case 11:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(async ()=>\"0\")", "0")];
                case 12:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(async ()=>0)", 0)];
                case 13:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(async ()=>\"\")", "")];
                case 14:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(async ()=>null)", null)];
                case 15:
                    _f = _f.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getOrCallAsync(async ()=>undefined)", undefined)];
                case 16:
                    _d = _d.concat([
                        _e.apply(void 0, [_f.concat([
                                _j.sent()
                            ])]),
                        makeHeading("h3", "minamo.core.getLast")
                    ]);
                    _g = makeResultTable;
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast(\"abc\")", "abc")];
                case 17:
                    _h = [
                        _j.sent()
                    ];
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast(true)", true)];
                case 18:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast(false)", false)];
                case 19:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast(\"0\")", "0")];
                case 20:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast(0)", 0)];
                case 21:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast(\"\")", "")];
                case 22:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast(null)", null)];
                case 23:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast(undefined)", undefined)];
                case 24:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([\"abc\"])", "abc")];
                case 25:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([true])", true)];
                case 26:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([false])", false)];
                case 27:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([\"0\"])", "0")];
                case 28:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([0])", 0)];
                case 29:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([\"\"])", "")];
                case 30:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([null])", null)];
                case 31:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([undefined])", undefined)];
                case 32:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([123,\"abc\"])", "abc")];
                case 33:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([123,true])", true)];
                case 34:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([123,false])", false)];
                case 35:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([123,\"0\"])", "0")];
                case 36:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([123,0])", 0)];
                case 37:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([123,\"\"])", "")];
                case 38:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([123,null])", null)];
                case 39:
                    _h = _h.concat([
                        _j.sent()
                    ]);
                    return [4 /*yield*/, test_1.equalTestAsync("minamo.core.getLast([123,undefined])", undefined)];
                case 40:
                    _b.apply(_a, _c.concat([_d.concat([
                            _g.apply(void 0, [_h.concat([
                                    _j.sent()
                                ])]),
                            makeHeading("h3", "minamo.core.separate"),
                            makeResultTable([
                                test_1.equalTest("minamo.core.separate(\"abcdefghi\", \"efg\")", { head: "abcd", tail: "hi" }),
                                test_1.equalTest("minamo.core.separate(\"abc@def\", \"@\")", { head: "abc", tail: "def" }),
                                test_1.equalTest("minamo.core.separate(\"abc@\", \"@\")", { head: "abc", tail: "" }),
                                test_1.equalTest("minamo.core.separate(\"@def\", \"@\")", { head: "", tail: "def" }),
                                test_1.equalTest("minamo.core.separate(\"abc\", \"@\")", { head: "abc", tail: null }),
                                test_1.equalTest("minamo.core.separate(\"\", \"@\")", { head: "", tail: null }),
                                test_1.errorTest("minamo.core.separate(null, \"@\")"),
                                test_1.errorTest("minamo.core.separate(undefined, \"@\")"),
                                test_1.equalTest("minamo.core.separate(\"abc@def\", null)", { head: "abc@def", tail: null }),
                                test_1.equalTest("minamo.core.separate(\"abc@def\", undefined)", { head: "abc@def", tail: null }),
                            ]),
                            makeHeading("h3", "minamo.core.bond"),
                            makeResultTable([
                                test_1.equalTest("minamo.core.bond(\"abcd\", \"efg\", \"hi\")", "abcdefghi"),
                                test_1.equalTest("minamo.core.bond(\"abc\", \"@\", \"def\")", "abc@def"),
                                test_1.equalTest("minamo.core.bond(\"abc\", \"@\", \"\")", "abc@"),
                                test_1.equalTest("minamo.core.bond(\"\", \"@\", \"def\")", "@def"),
                                test_1.equalTest("minamo.core.bond(\"abc\", \"@\", null)", "abc"),
                                test_1.equalTest("minamo.core.bond(\"abc\", \"@\", undefined)", "abc"),
                                test_1.errorTest("minamo.core.bond(null, null, null)"),
                                test_1.errorTest("minamo.core.bond(null, \"@\", null)"),
                                test_1.errorTest("minamo.core.bond(null, \"@\", \"def\")"),
                                test_1.errorTest("minamo.core.bond(\"abc\", null, \"def\")"),
                                test_1.errorTest("minamo.core.bond(undefined, undefined, undefined)"),
                                test_1.errorTest("minamo.core.bond(undefined, \"@\", undefined)"),
                                test_1.errorTest("minamo.core.bond(undefined, \"@\", \"def\")"),
                                test_1.errorTest("minamo.core.bond(\"abc\", undefined, \"def\")"),
                            ]),
                            makeHeading("h3", "minamo.core.loopMap"),
                            makeResultTable([
                                test_1.equalTest("minamo.core.loopMap(i => i < 3 ? i: null)", [0, 1, 2]),
                                test_1.equalTest("minamo.core.loopMap(i => i < 3 ? i *2: null)", [0, 2, 4]),
                                test_1.equalTest("minamo.core.loopMap(i => i < 3 ? {i:i}: null)", [{ i: 0 }, { i: 1 }, { i: 2 }]),
                                test_1.equalTest("minamo.core.loopMap(i => null)", []),
                                test_1.errorTest("minamo.core.loopMap(null)"),
                                test_1.errorTest("minamo.core.loopMap(i => true)"),
                            ]),
                            makeHeading("h3", "minamo.core.countMap"),
                            makeResultTable([
                                test_1.equalTest("minamo.core.countMap(3, \"A\")", ["A", "A", "A"]),
                                test_1.equalTest("minamo.core.countMap(3, i => i)", [0, 1, 2]),
                                test_1.equalTest("minamo.core.countMap(3, i => i *2)", [0, 2, 4]),
                                test_1.equalTest("minamo.core.countMap(3, i => ({i:i}))", [{ i: 0 }, { i: 1 }, { i: 2 }]),
                                test_1.equalTest("minamo.core.countMap(0, i => i)", []),
                                test_1.equalTest("minamo.core.countMap(3, null)", [null, null, null]),
                            ]),
                            makeHeading("h3", "minamo.core.zeroPadding"),
                            makeResultTable([
                                test_1.equalTest("minamo.core.zeroPadding(3, 123)", "123"),
                                test_1.equalTest("minamo.core.zeroPadding(3, 1)", "001"),
                                test_1.equalTest("minamo.core.zeroPadding(3, 0)", "000"),
                                test_1.equalTest("minamo.core.zeroPadding(3, 1234)", "1234"),
                                test_1.equalTest("minamo.core.zeroPadding(3, -12)", "-12"),
                                test_1.equalTest("minamo.core.zeroPadding(3, -123)", "-123"),
                                test_1.equalTest("minamo.core.zeroPadding(0, 123)", "123"),
                                test_1.equalTest("minamo.core.zeroPadding(-1, 123)", "123"),
                                test_1.equalTest("minamo.core.zeroPadding(5, 123.45)", "00123"),
                                test_1.errorTest("minamo.core.zeroPadding(30, 123)"),
                                test_1.errorTest("minamo.core.zeroPadding(20, 12345678901234567890123)"),
                                test_1.errorTest("minamo.core.zeroPadding(20, -12345678901234567890123)"),
                            ])
                        ])]));
                    __1.minamo.dom.appendChildren(document.body, {
                        tag: "table",
                        className: "summary",
                        children: [
                            {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "th",
                                        children: "total",
                                    },
                                    {
                                        tag: "th",
                                        children: "✅ OK",
                                    },
                                    {
                                        tag: "th",
                                        children: "🚫 NG",
                                    },
                                ],
                            },
                            {
                                tag: "tr",
                                children: [
                                    {
                                        tag: "td",
                                        children: counts.total.toLocaleString(),
                                    },
                                    {
                                        tag: "td",
                                        children: counts.ok.toLocaleString(),
                                    },
                                    {
                                        tag: "td",
                                        children: counts.ng.toLocaleString(),
                                    },
                                ],
                            },
                        ],
                    }, document.getElementsByTagName("h2")[1]);
                    if (counts.ng) {
                        document.title = "(" + counts.ng + ") " + document.title;
                    }
                    setTimeout(function () {
                        var hashRaw = __1.minamo.core.separate(location.href, "#").tail;
                        if (hashRaw) {
                            var hash_1 = decodeURIComponent(hashRaw);
                            var target = Array.from(document.body.children).filter(function (i) { return i.textContent === hash_1; })[0];
                            if (target) {
                                document.body.scrollTop = target.offsetTop;
                            }
                            else {
                                console.error("Not found hash " + hash_1);
                            }
                        }
                    }, 0);
                    return [2 /*return*/];
            }
        });
    }); };
})(test = exports.test || (exports.test = {}));
//# sourceMappingURL=test.js.map