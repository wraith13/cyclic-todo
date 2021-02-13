var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("minamo.js/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.minamo = void 0;
    var minamo;
    (function (minamo) {
        var core;
        (function (core_1) {
            var _this = this;
            core_1.timeout = function (wait) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, wait); })];
            }); }); };
            core_1.tryOrThrough = function (title, f) {
                try {
                    f();
                }
                catch (err) {
                    console.error("\uD83D\uDEAB " + title + ": " + err);
                }
            };
            core_1.tryOrThroughAsync = function (title, f) {
                return __awaiter(this, void 0, void 0, function () {
                    var err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, f()];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                err_1 = _a.sent();
                                console.error("\uD83D\uDEAB " + title + ": " + err_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            core_1.simpleDeepCopy = function (source) { return JSON.parse(JSON.stringify(source)); };
            core_1.recursiveAssign = function (target, source) { return core_1.objectForEach(source, function (key, value) {
                if ("object" === core_1.practicalTypeof(value)) {
                    if (undefined === target[key]) {
                        target[key] = {};
                    }
                    core_1.recursiveAssign(target[key], value);
                }
                else if ("array" === core_1.practicalTypeof(value)) {
                    if (undefined === target[key]) {
                        target[key] = [];
                    }
                    core_1.recursiveAssign(target[key], value);
                }
                else {
                    target[key] = value;
                }
            }); };
            core_1.practicalTypeof = function (obj) {
                if (undefined === obj) {
                    return "undefined";
                }
                if (null === obj) {
                    return "null";
                }
                if ("[object Array]" === Object.prototype.toString.call(obj)) {
                    return "array";
                }
                return typeof obj;
            };
            core_1.exists = function (i) { return undefined !== i && null !== i; };
            core_1.existsOrThrow = function (i) {
                if (!core_1.exists(i)) {
                    throw new ReferenceError("minamo.core.existsOrThrow() encountered a unexist value.");
                }
                return i;
            };
            var Url = /** @class */ (function () {
                function Url(url) {
                    var _this = this;
                    this.url = url;
                    this.rawParams = null;
                    this.set = function (url) {
                        _this.url = url;
                        _this.rawParams = null;
                        return _this;
                    };
                    this.getWithoutParams = function () { return core_1.separate(_this.url, "?").head; };
                    this.getRawParamsString = function () { return core_1.separate(_this.url, "?").tail; };
                    this.getRawParams = function () {
                        if (!_this.rawParams) {
                            _this.rawParams = {};
                            _this.getRawParamsString().split("&")
                                .forEach(function (i) {
                                var _a = core.separate(i, "="), head = _a.head, tail = _a.tail;
                                _this.rawParams[head] = tail;
                            });
                        }
                        return _this.rawParams;
                    };
                    this.getParam = function (key) { return decodeURIComponent(_this.getRawParams()[key]); };
                    this.updateParams = function () { return _this.setRawParamsString(core_1.objectToArray(_this.rawParams, function (k, v) { return core_1.bond(k, "=", v); })
                        .join("&")); };
                    this.setRawParamsString = function (rawParamsString) {
                        _this.url = core_1.bond(_this.getWithoutParams(), "?", rawParamsString);
                        return _this;
                    };
                    this.setRawParam = function (key, rawValue) {
                        _this.getRawParams()[key] = rawValue;
                        return _this.updateParams();
                    };
                    this.setParam = function (key, value) { return _this.setRawParam(key, encodeURIComponent(value)); };
                    this.setRawParams = function (params) {
                        _this.rawParams = params;
                        return _this.updateParams();
                    };
                    this.setParams = function (params) {
                        return _this.setRawParams(core_1.objectMap(params, function (_key, value) { return encodeURIComponent(value); }));
                    };
                    this.toString = function () { return _this.url; };
                }
                return Url;
            }());
            core_1.Url = Url;
            var Listener = /** @class */ (function () {
                function Listener() {
                    var _this = this;
                    this.members = [];
                    this.push = function (member) {
                        _this.members.push(member);
                        return _this;
                    };
                    this.remove = function (member) {
                        _this.members = _this.members.filter(function (i) { return member !== i; });
                        return _this;
                    };
                    this.clear = function () {
                        _this.members = [];
                        return _this;
                    };
                    this.fireAsync = function (value, options) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.all(this.members.map(function (i) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, i(value, options)];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                }
                return Listener;
            }());
            core_1.Listener = Listener;
            var Property = /** @class */ (function () {
                function Property(updater) {
                    var _this = this;
                    this.updater = updater;
                    this.value = null;
                    this.onUpdate = new Listener();
                    this.onUpdateOnce = new Listener();
                    this.exists = function () { return core_1.exists(_this.value); };
                    this.get = function () { return _this.value; };
                    this.setAsync = function (value, options) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(this.value !== value)) return [3 /*break*/, 3];
                                    this.value = value;
                                    return [4 /*yield*/, this.onUpdate.fireAsync(this, options)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, this.onUpdateOnce.fireAsync(this, options)];
                                case 2:
                                    _a.sent();
                                    this.onUpdateOnce.clear();
                                    _a.label = 3;
                                case 3: return [2 /*return*/, value];
                            }
                        });
                    }); };
                    this.updateAsync = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this.setAsync;
                                return [4 /*yield*/, this.updater()];
                            case 1: return [4 /*yield*/, _a.apply(this, [_b.sent()])];
                            case 2: return [2 /*return*/, _b.sent()];
                        }
                    }); }); };
                    this.getOrUpdateAsync = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!this.exists()) return [3 /*break*/, 1];
                                _a = this.get();
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, this.updateAsync()];
                            case 2:
                                _a = _b.sent();
                                _b.label = 3;
                            case 3: return [2 /*return*/, _a];
                        }
                    }); }); };
                }
                return Property;
            }());
            core_1.Property = Property;
            core_1.getOrCall = function (i) {
                return "function" === typeof i ?
                    i() :
                    i;
            }; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
            core_1.getOrCallAsync = function (i) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!("function" === typeof i)) return [3 /*break*/, 2];
                            return [4 /*yield*/, i()];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = i;
                            _b.label = 3;
                        case 3: return [2 /*return*/, _a];
                    }
                });
            }); }; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
            core_1.getLast = function (x) { return Array.isArray(x) ? x[x.length - 1] : x; };
            core_1.arrayOrToArray = function (x) { return Array.isArray(x) ? x : [x]; };
            core_1.singleOrArray = function (x, singleFunction, arrayFunction) { return Array.isArray(x) ? arrayFunction(x) : singleFunction(x); };
            core_1.flatMap = function (source, mapFunction) {
                var result = [];
                core.arrayOrToArray(source).forEach(function (i) { return result = result.concat(mapFunction(i)); });
                return result;
            };
            core_1.objectForEach = function (source, eachFunction) {
                Object.keys(source).forEach(function (key) { return eachFunction(key, source[key], source); });
            };
            core_1.objectMap = function (source, mapFunction) {
                var result = {};
                core_1.objectForEach(source, function (key) { return result[key] = mapFunction(key, source[key], source); });
                return result;
            };
            core_1.objectFilter = function (source, filterFunction) {
                var result = {};
                core_1.objectForEach(source, function (key) {
                    var value = source[key];
                    if (filterFunction(key, value, source)) {
                        result[key] = value;
                    }
                });
                return result;
            };
            core_1.objectToArray = function (source, mapFunction) {
                var result = [];
                core_1.objectForEach(source, function (key, value) { return result.push(mapFunction(key, value, source)); });
                return result;
            };
            core_1.separate = function (text, separator) {
                var index = text.indexOf(separator);
                return 0 <= index ?
                    {
                        head: text.substring(0, index),
                        tail: text.substring(index + separator.length),
                    } :
                    {
                        head: text,
                        tail: null,
                    };
            };
            core_1.bond = function (head, separator, tail) {
                return core_1.exists(tail) ?
                    "" + core_1.existsOrThrow(head) + core_1.existsOrThrow(separator) + tail :
                    core_1.existsOrThrow(head);
            };
            core_1.loopMap = function (mapFunction, limit) {
                var result = [];
                var index = 0;
                if (!core_1.exists(limit)) {
                    limit = 100000;
                }
                while (true) {
                    if (limit <= index) {
                        throw new RangeError("minamo.core.loopMap() overs the limit(" + limit + ")");
                    }
                    var current = mapFunction(index++, result);
                    if (core_1.exists(current)) {
                        result.push(current);
                    }
                    else {
                        break;
                    }
                }
                return result;
            };
            core_1.countMap = function (count, mapFunction) {
                var result = [];
                var index = 0;
                while (index < count) {
                    result.push("function" === typeof mapFunction ?
                        mapFunction(index, result) :
                        mapFunction);
                    ++index;
                }
                return result;
            };
            core_1.zeroPadding = function (length, n) {
                if (21 < length) {
                    throw new RangeError("length(" + length + ") in minamo.core.zeroPadding() overs 21.");
                }
                if (1e+21 <= n) {
                    throw new RangeError("n(" + n + ") in minamo.core.zeroPadding() is 1e+21 or more.");
                }
                if (n <= -1e+21) {
                    throw new RangeError("n(" + n + ") in minamo.core.zeroPadding() is -1e+21 or less.");
                }
                var sign = n < 0 ? "-" : "";
                var core = "" + Math.abs(Math.round(n));
                var paddingLength = length - (sign.length + core.length);
                var padding = 0 < paddingLength ? "00000000000000000000".substr(-paddingLength) : "";
                return "" + sign + padding + core;
            };
            core_1.NYI = function (_) {
                if (_ === void 0) { _ = null; }
                throw new Error("Not Yet Implement!");
            };
            var comparer;
            (function (comparer) {
                comparer.basic = function (a, b) {
                    return a < b ? -1 :
                        b < a ? 1 :
                            0;
                };
                comparer.make = function (source) {
                    var _a;
                    var invoker = function (i) {
                        var f = i;
                        if ("function" === typeof f) {
                            return function (a, b) { return comparer.basic(f(a), f(b)); };
                        }
                        var r = i;
                        if (undefined !== (r === null || r === void 0 ? void 0 : r.raw)) {
                            return r.raw;
                        }
                        var s = i;
                        if (undefined !== (s === null || s === void 0 ? void 0 : s.getter)) {
                            var body_1 = function (a, b) { return comparer.basic(s.getter(a), s.getter(b)); };
                            if (undefined === s.condition) {
                                return body_1;
                            }
                            else {
                                var f_1 = s.condition;
                                if ("function" === typeof f_1) {
                                    return function (a, b) { return f_1(a, b) ? body_1(a, b) : 0; };
                                }
                                else {
                                    var t_1 = s.condition;
                                    var getter_1 = t_1.getter;
                                    if (undefined === getter_1) {
                                        return function (a, b) { return t_1.type === typeof a && t_1.type === typeof b ? body_1(a, b) : 0; };
                                    }
                                    else {
                                        return function (a, b) { return t_1.type === typeof getter_1(a) && t_1.type === typeof getter_1(b) ? body_1(a, b) : 0; };
                                    }
                                }
                            }
                        }
                        return undefined;
                    };
                    if (Array.isArray(source)) {
                        var comparerList_1 = source.map(invoker).filter(function (i) { return undefined !== i; });
                        return function (a, b) {
                            var result = 0;
                            for (var i = 0; i < comparerList_1.length && 0 === result; ++i) {
                                result = comparerList_1[i](a, b);
                            }
                            return result;
                        };
                    }
                    else {
                        return (_a = invoker(source)) !== null && _a !== void 0 ? _a : (function () { return 0; });
                    }
                };
                comparer.lowerCase = comparer.make([function (a) { return a.toLowerCase(); }, { raw: comparer.basic }]);
            })(comparer = core_1.comparer || (core_1.comparer = {}));
        })(core = minamo.core || (minamo.core = {}));
        var environment;
        (function (environment) {
            environment.isIE = function () { return core.NYI(false); };
            environment.isEdge = function () { return core.NYI(false); };
            environment.isSafari = function () { return core.NYI(false); };
            environment.isFirefox = function () { return core.NYI(false); };
            environment.isChrome = function () { return core.NYI(false); };
            environment.isPC = function () { return core.NYI(false); };
            environment.isWindows = function () { return core.NYI(false); };
            environment.isMac = function () { return core.NYI(false); };
            environment.isLinux = function () { return core.NYI(false); };
            environment.isiOs = function () { return core.NYI(false); };
            environment.isiAndroid = function () { return core.NYI(false); };
        })(environment = minamo.environment || (minamo.environment = {}));
        var cookie;
        (function (cookie) {
            cookie.defaultMaxAge = 30 * 24 * 60 * 60;
            var cache = null;
            cookie.setRaw = function (key, value, maxAge) {
                document.cookie = core.exists(maxAge) ?
                    key + "=" + value + "; max-age=" + maxAge :
                    key + "=" + value;
                cookie.cacheOrUpdate()[key] = value;
                return value;
            };
            cookie.set = function (key, value, maxAge) {
                if (maxAge === void 0) { maxAge = cookie.defaultMaxAge; }
                cookie.setRaw(key, encodeURIComponent(JSON.stringify(value)), maxAge);
                return value;
            };
            cookie.setAsTemporary = function (key, value) { return cookie.set(key, value, null); };
            cookie.setAsDaily = function (key, value) { return cookie.set(key, value, 24 * 60 * 60); };
            cookie.setAsWeekly = function (key, value) { return cookie.set(key, value, 7 * 24 * 60 * 60); };
            cookie.setAsMonthly = function (key, value) { return cookie.set(key, value, 30 * 24 * 60 * 60); };
            cookie.setAsAnnually = function (key, value) { return cookie.set(key, value, 365 * 24 * 60 * 60); };
            cookie.remove = function (key) { return cookie.setRaw(key, null, 0); };
            cookie.update = function () {
                cache = {};
                document.cookie
                    .split(";")
                    .map(function (i) { return i.trim(); })
                    .forEach(function (i) {
                    var _a = core.separate(i, "="), head = _a.head, tail = _a.tail;
                    cache[head] = tail;
                });
                return cache;
            };
            cookie.cacheOrUpdate = function () { return cache || cookie.update(); };
            cookie.getRaw = function (key) { return cookie.cacheOrUpdate()[key]; };
            cookie.getOrNull = function (key) {
                return core.exists(cookie.getRaw(key)) ? JSON.parse(decodeURIComponent(cache[key])) : null;
            };
            var Property = /** @class */ (function (_super) {
                __extends(Property, _super);
                function Property(params) {
                    var _this = _super.call(this, params.updater) || this;
                    _this.save = function () {
                        cookie.set(core.getOrCall(_this.key), _this.get(), _this.maxAge);
                        return _this;
                    };
                    _this.loadAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.setAsync(cookie.getOrNull(core.getOrCall(this.key)), { onLoadAsync: true })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                    _this.loadOrUpdateAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.loadAsync()];
                                case 1:
                                    result = _a.sent();
                                    if (!!core.exists(result)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.updateAsync()];
                                case 2:
                                    result = _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/, result];
                            }
                        });
                    }); };
                    _this.key = params.key;
                    _this.maxAge = params.maxAge;
                    return _this;
                }
                return Property;
            }(core.Property));
            cookie.Property = Property;
            var AutoSaveProperty = /** @class */ (function (_super) {
                __extends(AutoSaveProperty, _super);
                function AutoSaveProperty(params) {
                    var _this = _super.call(this, params) || this;
                    _this.onUpdate.push(function (_value, options) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (!options || !options.onLoadAsync) {
                                this.save();
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    return _this;
                }
                return AutoSaveProperty;
            }(Property));
            cookie.AutoSaveProperty = AutoSaveProperty;
        })(cookie = minamo.cookie || (minamo.cookie = {}));
        var localStorage;
        (function (localStorage) {
            localStorage.setRaw = function (key, value) {
                window.localStorage.setItem(key, value);
                return value;
            };
            localStorage.set = function (key, value) {
                localStorage.setRaw(key, encodeURIComponent(JSON.stringify(value)));
                return value;
            };
            localStorage.remove = function (key) { return window.localStorage.removeItem(key); };
            localStorage.getRaw = function (key) { return window.localStorage.getItem(key); };
            localStorage.getOrNull = function (key) {
                var rawValue = localStorage.getRaw(key);
                return core.exists(rawValue) ? JSON.parse(decodeURIComponent(rawValue)) : null;
            };
            var Property = /** @class */ (function (_super) {
                __extends(Property, _super);
                function Property(params) {
                    var _this = _super.call(this, params.updater) || this;
                    _this.save = function () {
                        cookie.set(core.getOrCall(_this.key), _this.get());
                        return _this;
                    };
                    _this.loadAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.setAsync(cookie.getOrNull(core.getOrCall(this.key)), { onLoadAsync: true })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                    _this.loadOrUpdateAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.loadAsync()];
                                case 1:
                                    result = _a.sent();
                                    if (!!core.exists(result)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.updateAsync()];
                                case 2:
                                    result = _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/, result];
                            }
                        });
                    }); };
                    _this.key = params.key;
                    return _this;
                }
                return Property;
            }(core.Property));
            localStorage.Property = Property;
            var AutoSaveProperty = /** @class */ (function (_super) {
                __extends(AutoSaveProperty, _super);
                function AutoSaveProperty(params) {
                    var _this = _super.call(this, params) || this;
                    _this.onUpdate.push(function (_value, options) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (!options || !options.onLoadAsync) {
                                this.save();
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    return _this;
                }
                return AutoSaveProperty;
            }(Property));
            localStorage.AutoSaveProperty = AutoSaveProperty;
        })(localStorage = minamo.localStorage || (minamo.localStorage = {}));
        var sessionStorage;
        (function (sessionStorage) {
            sessionStorage.setRaw = function (key, value) {
                window.sessionStorage.setItem(key, value);
                return value;
            };
            sessionStorage.set = function (key, value) {
                sessionStorage.setRaw(key, encodeURIComponent(JSON.stringify(value)));
                return value;
            };
            sessionStorage.remove = function (key) { return window.sessionStorage.removeItem(key); };
            sessionStorage.getRaw = function (key) { return window.sessionStorage.getItem(key); };
            sessionStorage.getOrNull = function (key) {
                var rawValue = sessionStorage.getRaw(key);
                return core.exists(rawValue) ? JSON.parse(decodeURIComponent(rawValue)) : null;
            };
            var Property = /** @class */ (function (_super) {
                __extends(Property, _super);
                function Property(params) {
                    var _this = _super.call(this, params.updater) || this;
                    _this.save = function () {
                        cookie.set(core.getOrCall(_this.key), _this.get());
                        return _this;
                    };
                    _this.loadAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.setAsync(cookie.getOrNull(core.getOrCall(this.key)), { onLoadAsync: true })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                    _this.loadOrUpdateAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.loadAsync()];
                                case 1:
                                    result = _a.sent();
                                    if (!!core.exists(result)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.updateAsync()];
                                case 2:
                                    result = _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/, result];
                            }
                        });
                    }); };
                    _this.key = params.key;
                    return _this;
                }
                return Property;
            }(core.Property));
            sessionStorage.Property = Property;
            var AutoSaveProperty = /** @class */ (function (_super) {
                __extends(AutoSaveProperty, _super);
                function AutoSaveProperty(params) {
                    var _this = _super.call(this, params) || this;
                    _this.onUpdate.push(function (_value, options) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (!options || !options.onLoadAsync) {
                                this.save();
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    return _this;
                }
                return AutoSaveProperty;
            }(Property));
            sessionStorage.AutoSaveProperty = AutoSaveProperty;
        })(sessionStorage = minamo.sessionStorage || (minamo.sessionStorage = {}));
        var http;
        (function (http) {
            var _this = this;
            http.request = function (method, url, body, headers) { return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open(method, url, true);
                if (headers) {
                    console.log("headers: " + JSON.stringify(headers));
                    Object.keys(headers).forEach(function (key) { return request.setRequestHeader(key, headers[key]); });
                }
                request.onreadystatechange = function () {
                    if (4 === request.readyState) {
                        if (200 <= request.status && request.status < 300) {
                            resolve(request.responseText);
                        }
                        else {
                            reject({
                                url: url,
                                request: request
                            });
                        }
                    }
                };
                console.log("body: " + JSON.stringify(body));
                request.send(body);
            }); };
            http.get = function (url, headers) { return http.request("GET", url, undefined, headers); };
            http.post = function (url, body, headers) { return http.request("POST", url, body, headers); };
            http.getJson = function (url, headers) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, http.get(url, headers)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            }); }); };
            http.postJson = function (url, body, headers) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, http.post(url, body, headers)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            }); }); };
        })(http = minamo.http || (minamo.http = {}));
        var file;
        (function (file_1) {
            file_1.readAsText = function (file) { return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function () { return resolve(reader.result); };
                reader.onerror = function () { return reject(reader.error); };
                reader.readAsText(file);
            }); };
        })(file = minamo.file || (minamo.file = {}));
        var dom;
        (function (dom) {
            function make(arg, level) {
                core.existsOrThrow(arg);
                if (arg instanceof Node) {
                    return arg;
                }
                if ("string" === core.practicalTypeof(arg)) {
                    return document.createTextNode(arg);
                }
                if (arg.prototype) {
                    var tag_1 = arg.name.replace(/HTML(.*)Element/, "$1".toLowerCase());
                    switch (tag_1) {
                        case "anchor":
                            tag_1 = "a";
                            break;
                        case "heading":
                            tag_1 = "h" + level;
                            break;
                        case "dlist":
                            tag_1 = "dl";
                            break;
                        case "olist":
                            tag_1 = "ol";
                            break;
                        case "ulist":
                            tag_1 = "ol";
                            break;
                    }
                    return function (arg2) { return dom.set(document.createElement(tag_1), arg2); };
                }
                if (arg.outerHTML) {
                    return make(HTMLDivElement)({ innerHTML: arg.outerHTML }).firstChild;
                }
                return dom.set(document.createElement(arg.tag), arg);
            }
            dom.make = make;
            dom.set = function (element, arg) {
                core.objectForEach(arg, function (key, value) {
                    switch (key) {
                        case "tag":
                        case "parent":
                        case "children":
                        case "attributes":
                        case "eventListener":
                            //  nop
                            break;
                        default:
                            if (undefined !== value) {
                                if ("object" === core.practicalTypeof(value)) {
                                    core.recursiveAssign(element[key], value);
                                }
                                else {
                                    element[key] = value;
                                }
                            }
                            break;
                    }
                });
                if (undefined !== arg.attributes) {
                    //  memo: value を持たない attribute を設定したい場合には value として "" を指定すれば良い。
                    core.objectForEach(arg.attributes, function (key, value) { return element.setAttribute(key, value); });
                }
                if (undefined !== arg.children) {
                    core.arrayOrToArray(arg.children).forEach(function (i) { return core.arrayOrToArray(i).forEach(function (j) { return element.appendChild(make(j)); }); });
                }
                if (undefined !== arg.eventListener) {
                    core.objectForEach(arg.eventListener, function (key, value) { return element.addEventListener(key, value); });
                }
                if (undefined !== arg.parent) {
                    dom.appendChildren(arg.parent, element);
                }
                return element;
            };
            dom.remove = function (node) { return node.parentNode.removeChild(node); };
            dom.removeChildren = function (parent, isRemoveChild) {
                if (isRemoveChild) {
                    parent.childNodes.forEach(function (i) {
                        if (isRemoveChild(i)) {
                            parent.removeChild(i);
                        }
                    });
                }
                else {
                    parent.innerHTML = "";
                }
                return parent;
            };
            dom.appendChildren = function (parent, newChildren, refChild) {
                core.singleOrArray(newChildren, function (i) { return undefined === refChild ?
                    parent.appendChild(make(i)) :
                    parent.insertBefore(make(i), refChild); }, function (a) { return a.forEach(function (i) { return dom.appendChildren(parent, i, refChild); }); });
                return parent;
            };
            dom.replaceChildren = function (parent, newChildren, isRemoveChild, refChild) {
                dom.removeChildren(parent, isRemoveChild);
                dom.appendChildren(parent, newChildren, refChild);
                return parent;
            };
        })(dom = minamo.dom || (minamo.dom = {}));
    })(minamo = exports.minamo || (exports.minamo = {}));
});
define("lang.en", [], {
    "previous": "previous",
    "expected next": "expected next",
    "expected interval": "expected interval",
    "elapsed time": "elapsed time",
    "count": "count",
    "Done": "Done",
    "days": "days",
    "@overall": "Overall",
    "@unoverall": "Excluded in the Overall",
    "@untagged": "Untagged",
    "@deleted": "Recycle Bin",
    "@new": "New tag",
    "New ToDo": "New ToDo",
    "New ToDo List": "New ToDo List",
    "Import List": "Import List",
    "timestamp": "timestamp",
    "interval": "interval",
    "Rename": "Rename",
    "Delete": "Delete",
    "Restore": "Restore",
    "History": "History",
    "Back to List": "Back to List",
    "Add/Remove Tag": "Add/Remove Tag",
    "Export": "Export",
    "Import": "Import",
    "Recycle Bin is empty.": "Recycle Bin is empty.",
    "Back to Home": "Back to Home"
});
define("lang.ja", [], {
    "previous": "前回",
    "expected next": "次回予想",
    "expected interval": "予想間隔",
    "elapsed time": "経過時間",
    "count": "回数",
    "Done": "完了",
    "days": "日",
    "@overall": "総合",
    "@unoverall": "総合から除外",
    "@untagged": "タグ付けされてない",
    "@deleted": "ごみ箱",
    "@new": "新しいタグ",
    "New ToDo": "新しい ToDo",
    "New ToDo List": "新しい ToDo リスト",
    "Import List": "リストをインポート",
    "timestamp": "日時",
    "interval": "間隔",
    "Rename": "名前を変更",
    "Delete": "削除",
    "Restore": "復元",
    "History": "履歴",
    "Back to List": "リストに戻る",
    "Add/Remove Tag": "タグの追加/削除",
    "Export": "エクスポート",
    "Import": "インポート",
    "Recycle Bin is empty.": "ごみ箱は空です。",
    "Back to Home": "ホーム画面に戻る"
});
define("index", ["require", "exports", "minamo.js/index", "lang.en", "lang.ja"], function (require, exports, minamo_js_1, lang_en_json_1, lang_ja_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CyclicToDo = exports.Calculate = exports.localeParallel = exports.localeSingle = exports.uniqueFilter = exports.simpleReverseComparer = exports.simpleComparer = exports.makeObject = void 0;
    lang_en_json_1 = __importDefault(lang_en_json_1);
    lang_ja_json_1 = __importDefault(lang_ja_json_1);
    exports.makeObject = function (items) {
        var result = {};
        items.forEach(function (i) { return result[i.key] = i.value; });
        return result;
    };
    exports.simpleComparer = minamo_js_1.minamo.core.comparer.basic;
    exports.simpleReverseComparer = function (a, b) { return -exports.simpleComparer(a, b); };
    exports.uniqueFilter = function (value, index, list) { return index === list.indexOf(value); };
    var localeSingle;
    (function (localeSingle) {
        var localeTableKey = navigator.language;
        var localeTable = Object.assign(JSON.parse(JSON.stringify(lang_en_json_1.default)), ({
            ja: lang_ja_json_1.default
        }[localeTableKey] || {}));
        localeSingle.string = function (key) { return localeTable[key] || key; };
        localeSingle.map = function (key) { return localeSingle.string(key); };
    })(localeSingle = exports.localeSingle || (exports.localeSingle = {}));
    var localeParallel;
    (function (localeParallel) {
        var _a;
        var firstLocale = lang_en_json_1.default;
        var secondLocale = (_a = {
            //en : localeEn,
            ja: lang_ja_json_1.default,
        }[navigator.language]) !== null && _a !== void 0 ? _a : lang_ja_json_1.default;
        localeParallel.map = function (key) { return firstLocale[key] + " / " + secondLocale[key]; };
    })(localeParallel = exports.localeParallel || (exports.localeParallel = {}));
    var Calculate;
    (function (Calculate) {
        Calculate.phi = 1.618033988749894;
        Calculate.intervals = function (ticks) {
            var result = [];
            ticks.forEach(function (value, index, list) {
                if (0 < index) {
                    result.push(list[index - 1] - value);
                }
            });
            return result;
        };
        Calculate.sign = function (n) { return 0 <= n ? 1 : -1; }; // Math.sign() とは挙動が異なるので注意。
        Calculate.sum = function (ticks) { return ticks.length <= 0 ?
            null :
            ticks.reduce(function (a, b) { return a + b; }, 0); };
        Calculate.average = function (ticks) { return ticks.length <= 0 ?
            null :
            Calculate.sum(ticks) / ticks.length; };
        Calculate.standardDeviation = function (ticks, average) {
            if (average === void 0) { average = Calculate.average(ticks); }
            return Math.sqrt(Calculate.average(ticks.map(function (i) { return Math.pow((i - average), 2); })));
        };
        Calculate.standardScore = function (average, standardDeviation, target) {
            return (10 * (target - average) / standardDeviation) + 50;
        };
        Calculate.expectedNextByTransverseWare = function (task, ticks) {
            var intervals = Calculate.intervals(ticks).reverse();
            var average = Calculate.average(intervals);
            var standardDeviation = Calculate.standardDeviation(intervals, average);
            if (10 <= intervals.length && (average * 0.1) < standardDeviation) {
                var waveLenghResolution_1 = 50;
                var angleResolution_1 = 50;
                var base_1 = 2 * standardDeviation;
                var regulatedIntervals_1 = intervals.map(function (i) { return Math.min(1.0, Math.max(-1.0, (i - average) / base_1)); });
                // const regulatedAverage = Calculate.average(regulatedIntervals);
                // const regulatedStandardDeviation = Calculate.standardDeviation(regulatedIntervals, regulatedAverage);
                var primeWaveLength_1 = Math.pow(Calculate.phi, Math.ceil(Math.log(regulatedIntervals_1.length) / Math.log(Calculate.phi)));
                var diff = regulatedIntervals_1.map(function (i) { return i; });
                var rates = [];
                //const calcLevel = (_offset: number, waveLength: number, index: number) => Math.sin((index /waveLength) *(Math.PI *2));
                //const calcLevel = (angle: number, waveLength: number, index: number) => Math.sin(((index /waveLength) +(angle /angleResolution)) *(Math.PI *2));
                var calcLevel_1 = function (angle, waveLength, index) { return 0 === Math.floor(((index / waveLength) + (angle / angleResolution_1)) * 2) % 2 ? 1.0 : -1.0; };
                //const calcRate = (values: number[], offset: number, waveLength: number) => Math.min(1.0, Math.max(0.0, Calculate.average(values.map((value, index) => 1.0 - (calcLevel(offset, waveLength, index) -value)))));
                var calcRate = function (values, offset, waveLength) { return Calculate.average(values.map(function (value, index) { return value * calcLevel_1(offset, waveLength, index); })); };
                var calcAccuracy = function (values) { return Calculate.average(values.map(function (i) { return 1 - Math.abs(i); })); };
                var calcWorstAccuracy = function (values) { return values.map(function (i) { return 1 - Math.abs(i); }).reduce(function (a, b) { return a < b ? a : b; }, 1); };
                var initAccuracy = calcAccuracy(diff);
                var initWorstAccuracy = calcWorstAccuracy(diff);
                console.log(diff);
                var wave = 0;
                var _loop_1 = function () {
                    var waveLength = primeWaveLength_1 / Math.pow(Calculate.phi, wave / waveLenghResolution_1);
                    var currentRates = [];
                    // for(let angle = 0; angle < angleResolution; ++angle)
                    // {
                    //     const rate = calcRate(diff, angle, waveLength);
                    //     const nextDiff = diff.map((value, index) => value -(rate *calcLevel(angle, waveLength, index)));
                    //     //console.log(`rate: ${rate}, accuracy: ${calcAccuracy(diff).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}`);
                    //     //console.log({ waveLength, diff, });
                    //     // let nextAccuracy = calcAccuracy(nextDiff);
                    //     // let nextWorstAccuracy = calcWorstAccuracy(nextDiff);
                    //     // if (previousAccuracy < nextAccuracy && previousWorstAccuracy < nextWorstAccuracy)
                    //     if (0.001 < Math.abs(rate))
                    //     {
                    //         // previousAccuracy = nextAccuracy;
                    //         // previousWorstAccuracy = nextWorstAccuracy;
                    //         diff = nextDiff;
                    //         currentRates.push(rate);
                    //     }
                    //     else
                    //     {
                    //         currentRates.push(0);
                    //     }
                    // }
                    var maxRate = 0;
                    var maxAngle = -1;
                    for (var angle = 0; angle < angleResolution_1; ++angle) {
                        var rate = calcRate(diff, angle, waveLength);
                        if (Math.abs(maxRate) < Math.abs(rate)) {
                            maxRate = rate;
                            maxAngle = angle;
                        }
                    }
                    for (var angle = 0; angle < angleResolution_1; ++angle) {
                        if (maxAngle === angle) {
                            currentRates.push(maxRate);
                        }
                        else {
                            currentRates.push(0);
                        }
                    }
                    if (0 <= maxAngle) {
                        diff = diff.map(function (value, index) { return value - (maxRate * calcLevel_1(maxAngle, waveLength, index)); });
                    }
                    rates.push(currentRates);
                    ++wave;
                };
                //while(Math.pow(Calculate.phi, offset /resolution) <= primeWaveLength)
                // let previousAccuracy = initAccuracy;
                // let previousWorstAccuracy = initWorstAccuracy;
                while (wave < waveLenghResolution_1) {
                    _loop_1();
                }
                var finalAccuracy = calcAccuracy(diff);
                var finalWorstAccuracy = calcWorstAccuracy(diff);
                console.log(diff);
                console.log(rates);
                console.log("init accuracy: " + initAccuracy.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 }) + ", " + initWorstAccuracy.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 }));
                console.log("final accuracy: " + finalAccuracy.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 }) + ", " + finalWorstAccuracy.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 }));
                if (initAccuracy < finalAccuracy) {
                    var exptected = Calculate.sum(rates.map(function (currentRates, wave) {
                        return Calculate.sum(currentRates.map(function (rate, angle) { return 0 === rate ? 0 :
                            rate * calcLevel_1(angle, primeWaveLength_1 / Math.pow(Calculate.phi, wave / waveLenghResolution_1), regulatedIntervals_1.length); }));
                    }));
                    console.log({ task: task, exptected: exptected });
                    var exptectedRate = 0.5;
                    var next = ticks[0] + average + (Math.pow(Math.abs(exptected), exptectedRate) * (exptected < 0 ? -base_1 : base_1));
                    return next;
                }
                // console.log({intervals, average});
                //             const checkPoints: number[] = [];
                //             let i = 0;
                //             let previousDiffAccumulation = (intervals[i] -average);
                //             while(++i < intervals.length /2)
                //             {
                //                 const diffAccumulation = previousDiffAccumulation +(intervals[i] -average);
                // console.log({diffAccumulation, previousDiffAccumulation, current: (intervals[i] -average)});
                //                 if (Math.abs(previousDiffAccumulation + diffAccumulation) < Math.abs(previousDiffAccumulation) +Math.abs(diffAccumulation))
                //                 {
                //                     checkPoints.push(intervals[i]);
                //                     if (10 <= checkPoints.length)
                //                     {
                //                         break;
                //                     }
                //                     previousDiffAccumulation = 0;
                //                 }
                //                 else
                //                 {
                //                     previousDiffAccumulation = diffAccumulation;
                //                 }
                //             }
                // console.log(`checkPoints.length: ${checkPoints.length}, intervals.length: ${intervals.length}`);
                //             if (3 <= checkPoints.length)
                //             {
                //                 const checkPointsAverage = Calculate.average(intervals);
                //                 const checkPointsstandardDeviation = Calculate.standardDeviation(checkPoints, checkPointsAverage);
                // console.log({checkPointsstandardDeviation, standardDeviation});
                //                 if (checkPointsstandardDeviation < standardDeviation)
                //                 {
                //                     return ticks[0] +checkPointsAverage +checkPointsstandardDeviation;
                //                 }
                //             }
            }
            return null;
        };
        Calculate.expectedNextByLongitudinalWare = function (task, ticks) {
            var intervals = Calculate.intervals(ticks).reverse();
            var average = Calculate.average(intervals);
            var standardDeviation = Calculate.standardDeviation(intervals, average);
            if (5 <= intervals.length && (average * 0.3) < standardDeviation) {
                var biasIntervals_1 = [];
                var currentBias_1 = Calculate.sign(intervals[0]);
                var currentGroup_1 = [];
                intervals.forEach(function (interval) {
                    var bias = Calculate.sign(interval - average);
                    if (currentBias_1 !== bias) {
                        biasIntervals_1.push(currentGroup_1);
                        currentBias_1 = bias;
                        currentGroup_1 = [];
                    }
                    currentGroup_1.push(interval);
                });
                biasIntervals_1.push(currentGroup_1);
                if (biasIntervals_1.length <= 0) {
                    return null;
                }
                if (1 === biasIntervals_1.length) {
                    return ticks[0] + average;
                }
                if (2 === biasIntervals_1.length) {
                    return ticks[0] + Calculate.average(biasIntervals_1.filter(function (_, ix) { return 1 === ix % 2; }).reduce(function (a, b) { return a.concat(b); }, []));
                }
                var biasTerms = [
                    biasIntervals_1.filter(function (_, ix) { return 0 === ix % 2 && 0 < ix; }).map(function (i) { return Calculate.sum(i); }),
                    biasIntervals_1.filter(function (_, ix) { return 1 === ix % 2 && ix < biasIntervals_1.length - 1; }).map(function (i) { return Calculate.sum(i); }),
                ];
                var biasTermAverage = [
                    Calculate.average(biasTerms[0]),
                    Calculate.average(biasTerms[1]),
                ];
                var biasTermStandardDeviation = [
                    Calculate.standardDeviation(biasTerms[0], biasTermAverage[0]),
                    Calculate.standardDeviation(biasTerms[1], biasTermAverage[1]),
                ];
                var biasIntervalAverage = [
                    Calculate.average(biasIntervals_1.filter(function (_, ix) { return 0 === ix % 2; }).reduce(function (a, b) { return a.concat(b); }, [])),
                    Calculate.average(biasIntervals_1.filter(function (_, ix) { return 1 === ix % 2; }).reduce(function (a, b) { return a.concat(b); }, [])),
                ];
                var lastBiasIndex = (biasIntervals_1.length - 1) % 2;
                var lastTerm = Calculate.sum(biasIntervals_1[biasIntervals_1.length - 1]);
                var isTermContinue = lastTerm + biasIntervalAverage[lastBiasIndex] < biasTermAverage[lastBiasIndex] + (2 * biasTermStandardDeviation[lastBiasIndex]);
                var curentIntervalAverage = biasIntervalAverage[lastBiasIndex];
                var counterIntervalAverage = biasIntervalAverage[(lastBiasIndex + 1) % 2];
                console.log({ task: task, ticks: ticks, intervals: intervals, average: average, lastTerm: lastTerm, isTermContinue: isTermContinue, curentIntervalAverage: curentIntervalAverage, counterIntervalAverage: counterIntervalAverage, lastBiasIndex: lastBiasIndex, biasIntervals: biasIntervals_1, biasTerms: biasTerms, biasTermAverage: biasTermAverage, biasIntervalAverage: biasIntervalAverage, biasTermStandardDeviation: biasTermStandardDeviation, });
                return ticks[0] + (isTermContinue ? curentIntervalAverage : counterIntervalAverage);
            }
            if (null !== average) {
                return ticks[0] + average;
            }
            return null;
        };
        Calculate.expectedNext = Calculate.expectedNextByLongitudinalWare;
    })(Calculate = exports.Calculate || (exports.Calculate = {}));
    var CyclicToDo;
    (function (CyclicToDo) {
        var _this = this;
        var applicationTitle = "Cyclic ToDo";
        var locale;
        (function (locale) {
            locale.map = localeSingle.map;
            locale.parallel = localeParallel.map;
        })(locale = CyclicToDo.locale || (CyclicToDo.locale = {}));
        var Storage;
        (function (Storage) {
            Storage.sessionPassPrefix = "@Session";
            Storage.isSessionPass = function (pass) { return pass.startsWith(Storage.sessionPassPrefix); };
            Storage.getStorage = function (pass) { return Storage.isSessionPass(pass) ? minamo_js_1.minamo.sessionStorage : minamo_js_1.minamo.localStorage; };
            Storage.lastUpdate = 0;
            Storage.exportJson = function (pass) {
                var specification = "https://github.com/wraith13/cyclic-todo/README.md";
                var timeAccuracy = Domain.TimeAccuracy;
                var tags = {};
                [
                    //"@overall", todos でカバーされるのでここには含めない
                    "@unoverall",
                    "@deleted",
                ].concat(Tag.get(pass))
                    .forEach(function (tag) { return tags[tag] = TagMember.getRaw(pass, tag); });
                var todos = TagMember.getRaw(pass, "@overall");
                var histories = {};
                todos
                    .forEach(function (todo) { return histories[todo] = History.get(pass, todo); });
                var result = {
                    specification: specification,
                    timeAccuracy: timeAccuracy,
                    pass: pass,
                    todos: todos,
                    tags: tags,
                    histories: histories,
                };
                return JSON.stringify(result);
            };
            Storage.importJson = function (json) {
                try {
                    var data_1 = JSON.parse(json);
                    if ("https://github.com/wraith13/cyclic-todo/README.md" === data_1.specification &&
                        "number" === typeof data_1.timeAccuracy &&
                        "string" === typeof data_1.pass &&
                        Array.isArray(data_1.todos) &&
                        data_1.todos.filter(function (i) { return "string" !== typeof i; }).length <= 0 &&
                        "object" === typeof data_1.tags &&
                        "object" === typeof data_1.histories) {
                        Pass.add(data_1.pass);
                        TagMember.set(data_1.pass, "@overall", data_1.todos);
                        Tag.set(data_1.pass, Object.keys(data_1.tags));
                        Object.keys(data_1.tags).forEach(function (tag) { return TagMember.set(data_1.pass, tag, data_1.tags[tag]); });
                        Object.keys(data_1.histories).forEach(function (todo) { return History.set(data_1.pass, todo, data_1.histories[todo]); });
                        return data_1.pass;
                    }
                }
                catch (_a) {
                    //  JSON parse error
                }
                return null;
            };
            var Backup;
            (function (Backup) {
                Backup.key = "backup";
                Backup.get = function () { var _a; return (_a = minamo_js_1.minamo.localStorage.getOrNull(Backup.key)) !== null && _a !== void 0 ? _a : []; };
                var set = function (backupList) { return minamo_js_1.minamo.localStorage.set(Backup.key, backupList); };
                Backup.add = function (json) { return set(Backup.get().concat([json])); };
                Backup.remove = function (pass) { return set(Backup.get().filter(function (i) { return pass !== JSON.parse(i).pass; })); };
                Backup.clear = function () { return set([]); };
            })(Backup = Storage.Backup || (Storage.Backup = {}));
            var Pass;
            (function (Pass) {
                Pass.key = "pass.list";
                Pass.get = function () { var _a; return (_a = minamo_js_1.minamo.localStorage.getOrNull(Pass.key)) !== null && _a !== void 0 ? _a : []; };
                Pass.set = function (passList) { return minamo_js_1.minamo.localStorage.set(Pass.key, passList); };
                Pass.add = function (pass) {
                    Pass.set(Pass.get().concat([pass]).filter(exports.uniqueFilter));
                    Backup.remove(pass);
                };
                Pass.remove = function (pass) {
                    Backup.add(Storage.exportJson(pass));
                    Pass.set(Pass.get().filter(function (i) { return pass !== i; }));
                    TagMember.get(pass, "@overall").forEach(function (task) { return History.removeKey(pass, task); });
                    Tag.get(pass).filter(function (tag) { return !Tag.isSystemTag(tag) && !Tag.isSublist(tag); }).forEach(function (tag) { return TagMember.removeKey(pass, tag); });
                    Tag.removeKey(pass);
                };
                Pass.generate = function (seed) {
                    if (seed === void 0) { seed = new Date().getTime(); }
                    var result = ("" + ((seed * 13738217) ^ ((seed % 387960371999) >> 5))).slice(-8);
                    if (0 < Pass.get().filter(function (i) { return i === result; }).length) {
                        return Pass.generate(seed + parseInt(result));
                    }
                    Storage.Pass.add(result);
                    return result;
                };
            })(Pass = Storage.Pass || (Storage.Pass = {}));
            var Tag;
            (function (Tag) {
                Tag.isSystemTag = function (tag) { return tag.startsWith("@") && !tag.startsWith("@=") && !Tag.isSublist(tag); };
                Tag.isSublist = function (tag) { return tag.endsWith("@:"); };
                Tag.encode = function (tag) { return tag.replace(/@/, "@="); };
                Tag.decode = function (tag) { return tag.replace(/@=/, "@"); };
                Tag.makeKey = function (pass) { return "pass:(" + pass + ").tag.list"; };
                Tag.get = function (pass) { var _a; return (_a = Storage.getStorage(pass).getOrNull(Tag.makeKey(pass))) !== null && _a !== void 0 ? _a : []; };
                Tag.set = function (pass, list) {
                    return Storage.getStorage(pass).set(Tag.makeKey(pass), list.filter(function (i) { return !Tag.isSystemTag(i); }));
                }; // システムタグは万が一にも登録させない
                Tag.add = function (pass, tag) { return Tag.set(pass, Tag.get(pass).concat([tag]).filter(exports.uniqueFilter)); };
                Tag.remove = function (pass, tag) { return Tag.set(pass, Tag.get(pass).filter(function (i) { return tag !== i; })); };
                Tag.getByTodo = function (pass, todo) { return ["@overall"].concat(Tag.get(pass)).concat(["@unoverall", "@untagged"]).filter(function (tag) { return 0 < TagMember.get(pass, tag).filter(function (i) { return todo === i; }).length; }); };
                Tag.rename = function (pass, oldTag, newTag) {
                    if (0 < newTag.length && !Tag.isSystemTag(oldTag) && !Tag.isSystemTag(newTag) && oldTag !== newTag && Tag.get(pass).indexOf(newTag) < 0) {
                        Tag.add(pass, newTag);
                        TagMember.set(pass, newTag, TagMember.getRaw(pass, oldTag));
                        Tag.remove(pass, oldTag);
                        TagMember.removeKey(pass, oldTag);
                        return true;
                    }
                    return false;
                };
                Tag.removeKey = function (pass) { return Storage.getStorage(pass).remove(Tag.makeKey(pass)); };
            })(Tag = Storage.Tag || (Storage.Tag = {}));
            var TagMember;
            (function (TagMember) {
                TagMember.makeKey = function (pass, tag) { return "pass:(" + pass + ").tag:(" + tag + ")"; };
                TagMember.getRaw = function (pass, tag) { var _a; return (_a = Storage.getStorage(pass).getOrNull(TagMember.makeKey(pass, tag))) !== null && _a !== void 0 ? _a : []; };
                TagMember.get = function (pass, tag) {
                    var deleted = TagMember.getRaw(pass, "@deleted");
                    switch (tag) {
                        case "@overall":
                            {
                                var unoverall_1 = TagMember.getRaw(pass, "@unoverall").concat(deleted);
                                return TagMember.getRaw(pass, "@overall").filter(function (i) { return unoverall_1.indexOf(i) < 0; });
                            }
                        case "@untagged":
                            {
                                var tagged_1 = Tag.get(pass).map(function (tag) { return TagMember.get(pass, tag); }).reduce(function (a, b) { return a.concat(b); }, []).concat(deleted);
                                return TagMember.getRaw(pass, "@overall").filter(function (i) { return tagged_1.indexOf(i) < 0; });
                            }
                        case "@deleted":
                            return deleted;
                        case "@unoverall":
                        default:
                            return Tag.isSublist(tag) ?
                                TagMember.getRaw(pass, "@overall").filter(function (i) { return tag === Task.getSublist(i); }) :
                                TagMember.getRaw(pass, tag).filter(function (i) { return deleted.indexOf(i) < 0; });
                    }
                };
                TagMember.set = function (pass, tag, list) {
                    return Storage.getStorage(pass).set(TagMember.makeKey(pass, tag), list);
                };
                TagMember.removeKey = function (pass, tag) { return Storage.getStorage(pass).remove(TagMember.makeKey(pass, tag)); };
                TagMember.add = function (pass, tag, todo) {
                    if (Tag.isSublist(tag)) {
                        if (tag !== Task.getSublist(todo)) {
                            Task.rename(pass, todo, tag + "@:" + Task.getBody(todo));
                        }
                    }
                    else {
                        TagMember.set(pass, tag, TagMember.get(pass, tag).concat([todo]).filter(exports.uniqueFilter));
                    }
                };
                //export const merge = (pass: string, tag: string, list: string[]) => set(pass, tag, get(pass, tag).concat(list).filter(uniqueFilter));
                TagMember.remove = function (pass, tag, todo) {
                    if (Tag.isSublist(tag)) {
                        if (null !== Task.getSublist(todo)) {
                            Task.rename(pass, todo, Task.getBody(todo));
                        }
                    }
                    else {
                        TagMember.set(pass, tag, TagMember.get(pass, tag).filter(function (i) { return todo !== i; }));
                    }
                };
            })(TagMember = Storage.TagMember || (Storage.TagMember = {}));
            var Task;
            (function (Task) {
                Task.encode = function (task) { return task.replace(/@/, "@="); };
                Task.decode = function (task) { return task.replace(/@=/, "@").replace(/@:/, ": "); };
                Task.getSublist = function (task) {
                    var split = task.split("@:");
                    return 2 <= split.length ? split[0] + "@:" : null;
                };
                Task.getBody = function (task) {
                    var split = task.split("@:");
                    return 2 <= split.length ? split[split.length - 1] : task;
                };
                Task.add = function (pass, task) {
                    Storage.TagMember.remove(pass, "@deleted", task);
                    Storage.TagMember.add(pass, "@overall", task);
                };
                Task.rename = function (pass, oldTask, newTask) {
                    if (0 < newTask.length && oldTask !== newTask && TagMember.getRaw(pass, "@overall").indexOf(newTask) < 0) {
                        Tag.getByTodo(pass, oldTask).forEach(function (tag) {
                            TagMember.remove(pass, tag, oldTask);
                            TagMember.add(pass, tag, newTask);
                        });
                        History.set(pass, newTask, History.get(pass, oldTask));
                        History.removeKey(pass, oldTask);
                        return true;
                    }
                    return false;
                };
            })(Task = Storage.Task || (Storage.Task = {}));
            var History;
            (function (History) {
                History.makeKey = function (pass, task) { return "pass:(" + pass + ").task:" + task + ".history"; };
                History.get = function (pass, task) { var _a; return (_a = Storage.getStorage(pass).getOrNull(History.makeKey(pass, task))) !== null && _a !== void 0 ? _a : []; };
                History.set = function (pass, task, list) {
                    return Storage.getStorage(pass).set(History.makeKey(pass, task), list);
                };
                History.removeKey = function (pass, task) {
                    return Storage.getStorage(pass).remove(History.makeKey(pass, task));
                };
                History.add = function (pass, task, tick) {
                    return History.set(pass, task, History.get(pass, task).concat(tick).filter(exports.uniqueFilter).sort(exports.simpleReverseComparer));
                };
                History.remove = function (pass, task, tick) {
                    return History.set(pass, task, History.get(pass, task).filter(function (i) { return tick !== i; }).sort(exports.simpleReverseComparer));
                };
                // export const rename = (pass: string, oldTask: string, newTask: string) =>
                // {
                //     if (0 < newTask.length && oldTask !== newTask && undefined === getStorage(pass).getRaw(makeKey(pass, newTask)))
                //     {
                //         set(pass, newTask, get(pass, oldTask));
                //         remove(pass, oldTask);
                //         return true;
                //     }
                //     return false;
                // };
            })(History = Storage.History || (Storage.History = {}));
            var Removed;
            (function (Removed) {
                Removed.makeKey = function (pass) { return "pass:(" + pass + ").removed"; };
                Removed.get = function (pass) { var _a; return (_a = minamo_js_1.minamo.localStorage.getOrNull(Removed.makeKey(pass))) !== null && _a !== void 0 ? _a : []; };
                var set = function (pass, list) { return minamo_js_1.minamo.localStorage.set(Removed.makeKey(pass), list); };
                Removed.add = function (pass, target) { return set(pass, Removed.get(pass).concat([JSON.stringify(target)])); };
                Removed.remove = function (pass, target) { return set(pass, Removed.get(pass).filter(function (i) { return target !== i; })); };
                Removed.clear = function (pass) { return set(pass, []); };
            })(Removed = Storage.Removed || (Storage.Removed = {}));
        })(Storage = CyclicToDo.Storage || (CyclicToDo.Storage = {}));
        var Domain;
        (function (Domain) {
            var _this = this;
            // export const merge = (pass: string, tag: string, todo: string[], _ticks: (number | null)[]) =>
            // {
            //     Storage.Pass.add(pass);
            //     Storage.Tag.add(pass, tag);
            //     Storage.TagMember.merge(pass, tag, todo);
            //     // const temp:{ [task:string]: number[]} = { };
            //     // todo.forEach(task => temp[task] = []);
            //     // ticks.forEach
            //     // (
            //     //     (tick, index) =>
            //     //     {
            //     //         if (null !== tick)
            //     //         {
            //     //             temp[todo[index % todo.length]].push(tick);
            //     //         }
            //     //     }
            //     // );
            //     // todo.forEach(task => Storage.History.add(pass, task, temp[task]));
            // };
            Domain.standardDeviationRate = 1.5;
            Domain.standardDeviationOverRate = 2.5;
            Domain.TimeAccuracy = 60 * 1000;
            Domain.getTicks = function (date) {
                if (date === void 0) { date = new Date(); }
                return Math.floor(date.getTime() / Domain.TimeAccuracy);
            };
            Domain.dateStringFromTick = function (tick) {
                if (null === tick) {
                    return "N/A";
                }
                else {
                    var date = new Date(tick * Domain.TimeAccuracy);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setMilliseconds(0);
                    return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).substr(-2) + "-" + ("0" + date.getDate()).substr(-2) + " " + Domain.timeCoreStringFromTick(tick - Domain.getTicks(date));
                }
            };
            Domain.timeCoreStringFromTick = function (tick) {
                if (null === tick) {
                    return "N/A";
                }
                else if (tick < 0) {
                    return "-" + Domain.timeCoreStringFromTick(-tick);
                }
                else {
                    var time = Math.floor(tick) % (24 * 60);
                    var hour = Math.floor(time / 60);
                    var minute = time % 60;
                    return ("00" + hour).slice(-2) + ":" + ("00" + minute).slice(-2);
                }
            };
            Domain.timeShortStringFromTick = function (tick) {
                if (null === tick) {
                    return "N/A";
                }
                else if (tick < 0) {
                    return "-" + Domain.timeShortStringFromTick(-tick);
                }
                else {
                    var days = Math.floor(tick / (24 * 60));
                    return 10 <= days ?
                        days.toLocaleString() + " " + locale.map("days") :
                        0 < days ?
                            days.toLocaleString() + " " + locale.map("days") + " " + Domain.timeCoreStringFromTick(tick) :
                            Domain.timeCoreStringFromTick(tick);
                }
            };
            Domain.timeLongStringFromTick = function (tick) {
                if (null === tick) {
                    return "N/A";
                }
                else if (tick < 0) {
                    return "-" + Domain.timeLongStringFromTick(-tick);
                }
                else {
                    var days = Math.floor(tick / (24 * 60));
                    return 0 < days ?
                        days.toLocaleString() + " " + locale.map("days") + " " + Domain.timeCoreStringFromTick(tick) :
                        Domain.timeCoreStringFromTick(tick);
                }
            };
            Domain.timeRangeStringFromTick = function (a, b) {
                return Domain.timeShortStringFromTick(a) + " \u301C " + Domain.timeShortStringFromTick(b);
            };
            Domain.tagMap = function (tag) {
                switch (tag) {
                    case "@overall":
                    case "@unoverall":
                    case "@untagged":
                    case "@deleted":
                    case "@new":
                        return locale.map(tag);
                    default:
                        return Storage.Tag.decode(tag);
                }
            };
            Domain.getLastTick = function (pass, task) { var _a; return (_a = Storage.History.get(pass, task)[0]) !== null && _a !== void 0 ? _a : 0; };
            Domain.getDoneTicks = function (pass, key) {
                var _a;
                if (key === void 0) { key = "pass:(" + pass + ").last.done.ticks"; }
                return minamo_js_1.minamo.localStorage.set(key, Math.max((_a = minamo_js_1.minamo.localStorage.getOrNull(key)) !== null && _a !== void 0 ? _a : 0, Domain.getTicks() - 1) + 1);
            };
            Domain.done = function (pass, task) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, Storage.History.add(pass, task, Domain.getDoneTicks(pass))];
            }); }); };
            Domain.tagComparer = function (pass) { return minamo_js_1.minamo.core.comparer.make(function (tag) { return -Storage.TagMember.get(pass, tag).map(function (todo) { return Storage.History.get(pass, todo).length; }).reduce(function (a, b) { return a + b; }, 0); }); };
            Domain.todoComparer1 = function (entry) {
                return function (a, b) {
                    var _a, _b;
                    if (null !== a.progress && null !== b.progress) {
                        if (Math.abs(a.elapsed - b.elapsed) <= 12 * 60) {
                            var rate = Math.min(a.count, b.count) < 5 ? Domain.standardDeviationRate : 1.2;
                            if (a.RecentlySmartAverage < b.RecentlySmartAverage * rate && b.RecentlySmartAverage < a.RecentlySmartAverage * rate) {
                                if (a.elapsed < b.elapsed) {
                                    return 1;
                                }
                                if (b.elapsed < a.elapsed) {
                                    return -1;
                                }
                            }
                        }
                        if (Math.min(a.progress, b.progress) <= 1.0 / 3.0) {
                            if (a.progress < b.progress) {
                                return 1;
                            }
                            if (b.progress < a.progress) {
                                return -1;
                            }
                        }
                        var a_restTime = (a.RecentlySmartAverage + ((_a = a.RecentlyStandardDeviation) !== null && _a !== void 0 ? _a : 0) * Domain.standardDeviationRate) - a.elapsed;
                        var b_restTime = (b.RecentlySmartAverage + ((_b = b.RecentlyStandardDeviation) !== null && _b !== void 0 ? _b : 0) * Domain.standardDeviationRate) - b.elapsed;
                        if (a_restTime < b_restTime) {
                            return -1;
                        }
                        if (b_restTime < a_restTime) {
                            return 1;
                        }
                    }
                    if (null === a.progress && null !== b.progress) {
                        return 1;
                    }
                    if (null !== a.progress && null === b.progress) {
                        return -1;
                    }
                    if (1 < a.count && 1 < b.count) {
                        if (null === a.progress && null === b.progress) {
                            if (null !== a.elapsed && null !== b.elapsed) {
                                if (a.elapsed < b.elapsed) {
                                    return -1;
                                }
                                if (b.elapsed < a.elapsed) {
                                    return 1;
                                }
                            }
                        }
                    }
                    if (1 === a.count && 1 === b.count) {
                        if (a.elapsed < b.elapsed) {
                            return 1;
                        }
                        if (b.elapsed < a.elapsed) {
                            return -1;
                        }
                    }
                    if (a.count < b.count) {
                        return 1;
                    }
                    if (b.count < a.count) {
                        return -1;
                    }
                    var aTodoIndex = entry.todo.indexOf(a.task);
                    var bTodoIndex = entry.todo.indexOf(a.task);
                    if (0 <= aTodoIndex && 0 <= bTodoIndex) {
                        if (aTodoIndex < bTodoIndex) {
                            return 1;
                        }
                        if (bTodoIndex < aTodoIndex) {
                            return -1;
                        }
                    }
                    if (a.task < b.task) {
                        return 1;
                    }
                    if (b.task < a.task) {
                        return -1;
                    }
                    return 0;
                };
            };
            Domain.todoComparer2 = function (list, todoList) {
                if (todoList === void 0) { todoList = list.map(function (i) { return i.task; }); }
                return function (a, b) {
                    if (null !== a.progress && null !== b.progress) {
                        if (Math.abs(a.elapsed - b.elapsed) <= 12 * 60) {
                            var rate = Math.min(a.count, b.count) < 5 ? 1.5 : 1.2;
                            if (a.RecentlySmartAverage < b.RecentlySmartAverage * rate && b.RecentlySmartAverage < a.RecentlySmartAverage * rate) {
                                if (a.elapsed < b.elapsed) {
                                    return 1;
                                }
                                if (b.elapsed < a.elapsed) {
                                    return -1;
                                }
                            }
                        }
                    }
                    var aTodoIndex = todoList.indexOf(a.task);
                    var bTodoIndex = todoList.indexOf(a.task);
                    if (0 <= aTodoIndex && 0 <= bTodoIndex) {
                        if (aTodoIndex < bTodoIndex) {
                            return 1;
                        }
                        if (bTodoIndex < aTodoIndex) {
                            return -1;
                        }
                    }
                    return 0;
                };
            };
            // export const todoComparer2 = (list: ToDoEntry[], todoList: string[] = list.map(i => i.todo)) =>
            // minamo.core.comparer.make<ToDoEntry>
            // ([
            //     { condition: (a, b) => null !== a.progress && null !== b.progress ......., getter: a => -a.elapsed },
            //     { getter: a => todoList.indexOf(a.todo), valueCondition: (a, b) => 0 <= a && 0 <= b, }
            // ]);
            Domain.getRecentlyHistory = function (pass, task) {
                var full = Storage.History.get(pass, task);
                var result = {
                    recentries: full.filter(function (_, index) { return index < 25; }),
                    previous: full.length <= 0 ? null : full[0],
                    //average: full.length <= 1 ? null: (full[0] -full[full.length -1]) / (full.length -1),
                    count: full.length,
                };
                return result;
            };
            Domain.getToDoEntry = function (_pass, task, history) {
                var inflateRecentrly = function (intervals) { return 20 <= intervals.length ?
                    intervals.filter(function (_, ix) { return ix < 5; }).concat(intervals.filter(function (_, ix) { return ix < 10; }), intervals) :
                    intervals.filter(function (_, ix) { return ix < 5; }).concat(intervals); };
                var calcAverage = function (ticks, maxLength, length) {
                    if (maxLength === void 0) { maxLength = ticks.length; }
                    if (length === void 0) { length = Math.min(maxLength, ticks.length); }
                    return ((ticks[0] - ticks[length - 1]) / (length - 1));
                };
                var result = {
                    task: task,
                    isDefault: false,
                    progress: null,
                    //decayedProgress: null,
                    previous: history.previous,
                    //expectedNext: Calculate.expectedNext(task, Storage.History.get(_pass, task)),
                    elapsed: null,
                    overallAverage: history.recentries.length <= 1 ? null : calcAverage(history.recentries),
                    RecentlyStandardDeviation: history.recentries.length <= 1 ?
                        null :
                        history.recentries.length <= 2 ?
                            calcAverage(history.recentries) * 0.05 : // この値を標準偏差として代用
                            Calculate.standardDeviation(inflateRecentrly(Calculate.intervals(history.recentries))),
                    count: history.count,
                    RecentlySmartAverage: history.recentries.length <= 1 ?
                        null :
                        Calculate.average(inflateRecentrly(Calculate.intervals(history.recentries))),
                };
                return result;
            };
            Domain.updateProgress = function (item, now) {
                var _a, _b, _c, _d;
                if (now === void 0) { now = Domain.getTicks(); }
                if (0 < item.count) {
                    // todo の順番が前後にブレるのを避ける為、１分以内に複数の todo が done された場合、二つ目以降は +1 分ずつズレた時刻で打刻され( getDoneTicks() 関数の実装を参照 )、直後は素直に計算すると経過時間がマイナスになってしまうので、マイナスの場合はゼロにする。
                    item.elapsed = Math.max(0.0, now - item.previous);
                    if (null !== item.RecentlySmartAverage) {
                        item.isDefault = Math.max(item.RecentlySmartAverage / 10, item.RecentlySmartAverage - ((_a = item.RecentlyStandardDeviation) !== null && _a !== void 0 ? _a : 180)) <= item.elapsed;
                        var short = Math.max(item.RecentlySmartAverage / 10, item.RecentlySmartAverage - (((_b = item.RecentlyStandardDeviation) !== null && _b !== void 0 ? _b : 0) * Domain.standardDeviationRate));
                        var long = item.RecentlySmartAverage + (((_c = item.RecentlyStandardDeviation) !== null && _c !== void 0 ? _c : 0) * Domain.standardDeviationRate);
                        var shortOneThird = short / 3.0;
                        if (item.elapsed < shortOneThird) {
                            item.progress = item.elapsed / short;
                        }
                        else if (item.elapsed < long) {
                            item.progress = (1.0 / 3.0) + (((item.elapsed - shortOneThird) / (long - shortOneThird)) * 2.0 / 3.0);
                        }
                        else {
                            item.progress = 1.0 + ((item.elapsed - long) / item.RecentlySmartAverage);
                        }
                        //item.progress = item.elapsed /(item.RecentlySmartAverage +(item.RecentlyStandardDeviation ?? 0) *Domain.standardDeviationRate);
                        //item.decayedProgress = item.elapsed /(item.smartAverage +(item.standardDeviation ?? 0) *2.0);
                        var overrate = (item.elapsed - (item.RecentlySmartAverage + ((_d = item.RecentlyStandardDeviation) !== null && _d !== void 0 ? _d : 0) * Domain.standardDeviationOverRate)) / item.RecentlySmartAverage;
                        if (0.0 < overrate) {
                            //item.decayedProgress = 1.0 / (1.0 +Math.log2(1.0 +overrate));
                            item.progress = null;
                            item.RecentlySmartAverage = null;
                            item.RecentlyStandardDeviation = null;
                            item.isDefault = false;
                        }
                    }
                }
            };
            Domain.updateListProgress = function (_entry, list, now) {
                if (now === void 0) { now = Domain.getTicks(); }
                list.forEach(function (item) { return Domain.updateProgress(item, now); });
                //const sorted = (<ToDoEntry[]>JSON.parse(JSON.stringify(list))).sort(todoComparer1(entry));
                // const defaultTodo = sorted.sort(todoComparer2(sorted))[0]?.task;
                // list.forEach(item => item.isDefault = defaultTodo === item.task);
            };
        })(Domain = CyclicToDo.Domain || (CyclicToDo.Domain = {}));
        var Render;
        (function (Render) {
            var _this = this;
            Render.internalLink = function (data) {
                return ({
                    tag: "a",
                    className: data.className,
                    href: CyclicToDo.makeUrl(data.href),
                    children: data.children,
                    onclick: function () {
                        CyclicToDo.showUrl(data.href);
                        return false;
                    }
                });
            };
            Render.heading = function (tag, text) {
                return ({
                    tag: tag,
                    children: text,
                });
            };
            Render.backgroundLinerGradient = function (leftPercent, leftColor, rightColor) {
                return "background: linear-gradient(to right, " + leftColor + " " + leftPercent + ", " + rightColor + " " + leftPercent + ");";
            };
            Render.progressStyle = function (progress) { return null === progress ?
                "background-color: rgba(128,128,128,0.4);" :
                1 <= progress ?
                    "background: #22884466;" :
                    Render.backgroundLinerGradient(progress.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 }), "#22884466", "rgba(128,128,128,0.2)"); };
            Render.label = function (label) {
                return ({
                    tag: "span",
                    className: "label",
                    children: [
                        {
                            tag: "span",
                            className: "locale-parallel",
                            children: locale.parallel(label),
                        },
                        {
                            tag: "span",
                            className: "locale-map",
                            children: locale.map(label),
                        }
                    ],
                });
            };
            Render.prompt = function (message, _default) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, minamo_js_1.minamo.core.timeout(100)];
                        case 1:
                            _a.sent(); // この wait をかましてないと呼び出し元のポップアップメニューが window.prompt が表示されてる間、ずっと表示される事になる。
                            return [4 /*yield*/, new Promise(function (resolve) { var _a, _b; return resolve((_b = (_a = window.prompt(message, _default)) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : null); })];
                        case 2: // この wait をかましてないと呼び出し元のポップアップメニューが window.prompt が表示されてる間、ずっと表示される事になる。
                        return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            Render.alert = function (message) { return window.alert(message); };
            Render.screenCover = function (onclick) {
                var dom = minamo_js_1.minamo.dom.make(HTMLDivElement)({
                    tag: "div",
                    className: "screen-cover fade-in",
                    onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("screen-cover.click!");
                                    dom.onclick = undefined;
                                    dom.classList.remove("fade-in");
                                    dom.classList.add("fade-out");
                                    onclick();
                                    return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                case 1:
                                    _a.sent();
                                    minamo_js_1.minamo.dom.remove(dom);
                                    return [2 /*return*/];
                            }
                        });
                    }); }
                });
                minamo_js_1.minamo.dom.appendChildren(document.body, dom);
            };
            Render.popup = function (data) {
                var dom = minamo_js_1.minamo.dom.make(HTMLDivElement)({
                    tag: "div",
                    className: "popup",
                    children: data.children,
                    onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.log("popup.click!");
                            Array.from(document.getElementsByClassName("screen-cover")).forEach(function (i) { return i.click(); });
                            return [2 /*return*/];
                        });
                    }); },
                });
                minamo_js_1.minamo.dom.appendChildren(document.body, dom);
                Render.screenCover(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (data === null || data === void 0 ? void 0 : data.onClose())];
                            case 1:
                                _a.sent();
                                minamo_js_1.minamo.dom.remove(dom);
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
            Render.menuButton = function (menu) { return __awaiter(_this, void 0, void 0, function () {
                var popup, button, _a, _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            popup = minamo_js_1.minamo.dom.make(HTMLDivElement)({
                                tag: "div",
                                className: "menu-popup",
                                children: menu,
                                onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        console.log("menu-popup.click!");
                                        Array.from(document.getElementsByClassName("screen-cover")).forEach(function (i) { return i.click(); });
                                        return [2 /*return*/];
                                    });
                                }); },
                            });
                            _a = minamo_js_1.minamo.dom.make(HTMLButtonElement);
                            _b = {
                                tag: "button",
                                className: "menu-button"
                            };
                            return [4 /*yield*/, loadSvgOrCache("./ellipsis.1024.svg")];
                        case 1:
                            button = _a.apply(void 0, [(_b.children = [
                                    _c.sent()
                                ],
                                    _b.onclick = function () {
                                        console.log("menu-button.click!");
                                        popup.classList.add("show");
                                        Render.screenCover(function () { return popup.classList.remove("show"); });
                                    },
                                    _b)]);
                            return [2 /*return*/, [button, popup,]];
                    }
                });
            }); };
            Render.menuItem = function (children, onclick, className) {
                return ({
                    tag: "button",
                    className: className,
                    children: children,
                    onclick: onclick,
                });
            };
            Render.information = function (item) {
                return ({
                    tag: "div",
                    className: "item-information",
                    attributes: {
                        style: Render.progressStyle(item.progress),
                    },
                    children: [
                        {
                            tag: "div",
                            className: "task-last-timestamp",
                            children: [
                                Render.label("previous"),
                                {
                                    tag: "span",
                                    className: "value monospace",
                                    children: Domain.dateStringFromTick(item.previous),
                                }
                            ],
                        },
                        // {
                        //     tag: "div",
                        //     className: "task-expected-next",
                        //     children:
                        //     [
                        //         label("expected next"),
                        //         {
                        //             tag: "span",
                        //             className: "value  monospace",
                        //             children: Domain.dateStringFromTick(item.expectedNext),
                        //         }
                        //     ],
                        // },
                        {
                            tag: "div",
                            className: "task-interval-average",
                            children: [
                                Render.label("expected interval"),
                                {
                                    tag: "span",
                                    className: "value monospace",
                                    children: null === item.RecentlyStandardDeviation ?
                                        Domain.timeLongStringFromTick(item.RecentlySmartAverage) :
                                        Domain.timeRangeStringFromTick(Math.max(item.RecentlySmartAverage / 10, item.RecentlySmartAverage - (item.RecentlyStandardDeviation * Domain.standardDeviationRate)), item.RecentlySmartAverage + (item.RecentlyStandardDeviation * Domain.standardDeviationRate)),
                                }
                            ],
                        },
                        {
                            tag: "div",
                            className: "task-elapsed-time",
                            children: [
                                Render.label("elapsed time"),
                                {
                                    tag: "span",
                                    className: "value monospace",
                                    children: Domain.timeLongStringFromTick(item.elapsed),
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
                                    className: "value monospace",
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
                                    className: "value monospace",
                                    children: renderTime(item.average),
                                }
                            ],
                        },
                        */
                        {
                            tag: "div",
                            className: "task-count",
                            children: [
                                Render.label("count"),
                                {
                                    tag: "span",
                                    className: "value monospace",
                                    children: item.count.toLocaleString(),
                                }
                            ],
                        },
                    ],
                });
            };
            Render.todoRenameMenu = function (pass, item, onRename) {
                if (onRename === void 0) { onRename = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, CyclicToDo.reload()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); }; }
                return Render.menuItem(locale.parallel("Rename"), function () { return __awaiter(_this, void 0, void 0, function () {
                    var newTask;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Render.prompt("ToDo の名前を入力してください。", item.task)];
                            case 1:
                                newTask = _a.sent();
                                if (!(null !== newTask && 0 < newTask.length && newTask !== item.task)) return [3 /*break*/, 4];
                                if (!Storage.Task.rename(pass, item.task, newTask)) return [3 /*break*/, 3];
                                return [4 /*yield*/, onRename(newTask)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                Render.alert("その名前の ToDo は既に存在しています。");
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
            };
            Render.todoTagMenu = function (_pass, _item) { return Render.menuItem(locale.parallel("Add/Remove Tag"), function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            }); }); };
            Render.todoDeleteMenu = function (pass, item) {
                return 0 <= Storage.TagMember.get(pass, "@deleted").indexOf(item.task) ?
                    Render.menuItem(locale.parallel("Restore"), function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Storage.TagMember.remove(pass, "@deleted", item.task);
                                    return [4 /*yield*/, CyclicToDo.reload()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }) :
                    Render.menuItem(locale.parallel("Delete"), function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    Storage.TagMember.add(pass, "@deleted", item.task);
                                    return [4 /*yield*/, CyclicToDo.reload()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
            };
            Render.todoItem = function (entry, item) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                var _this = this;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "task-item flex-item"
                            };
                            _b = {
                                tag: "div",
                                className: "item-header"
                            };
                            _c = [Render.internalLink({
                                    className: "item-title",
                                    href: { pass: entry.pass, todo: item.task, },
                                    children: item.task
                                })];
                            _d = {
                                tag: "div",
                                className: "item-operator"
                            };
                            _e = [{
                                    tag: "button",
                                    className: item.isDefault ? "default-button main-button" : "main-button",
                                    children: [
                                        {
                                            tag: "span",
                                            className: "locale-parallel",
                                            children: locale.parallel("Done"),
                                        },
                                        {
                                            tag: "span",
                                            className: "locale-map",
                                            children: locale.map("Done"),
                                        }
                                    ],
                                    onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                        var fxxkingTypeScriptCompiler;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    fxxkingTypeScriptCompiler = Storage.isSessionPass(entry.pass);
                                                    if (!fxxkingTypeScriptCompiler) return [3 /*break*/, 1];
                                                    Render.alert("This is view mode. If this is your to-do list, open the original URL instead of the sharing URL. If this is not your to-do list, you can copy this to-do list from edit mode.\n"
                                                        + "\n"
                                                        + "これは表示モードです。これが貴方が作成したToDoリストならば、共有用のURLではなくオリジナルのURLを開いてください。これが貴方が作成したToDoリストでない場合、編集モードからこのToDoリストをコピーできます。");
                                                    return [3 /*break*/, 3];
                                                case 1:
                                                    Domain.done(entry.pass, item.task);
                                                    return [4 /*yield*/, CyclicToDo.reload()];
                                                case 2:
                                                    _a.sent();
                                                    _a.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); }
                                }];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.todoRenameMenu(entry.pass, item),
                                    Render.todoTagMenu(entry.pass, item),
                                    Render.todoDeleteMenu(entry.pass, item),
                                ])];
                        case 1: return [2 /*return*/, (_a.children = [
                                (_b.children = _c.concat([
                                    (_d.children = _e.concat([
                                        _f.sent()
                                    ]),
                                        _d)
                                ]),
                                    _b),
                                {
                                    tag: "div",
                                    className: "item-tags",
                                    children: Storage.Tag.getByTodo(entry.pass, item.task).map(function (tag) { return Render.internalLink({
                                        className: "tag",
                                        href: { pass: entry.pass, tag: tag, },
                                        children: Domain.tagMap(tag),
                                    }); })
                                },
                                Render.information(item)
                            ],
                                _a)];
                    }
                });
            }); };
            Render.historyItem = function (entry, item) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                var _this = this;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "history-item flex-item "
                            };
                            _b = [{
                                    tag: "div",
                                    className: "item-information",
                                    children: [
                                        Render.internalLink({
                                            className: "item-title",
                                            href: { pass: entry.pass, todo: item.task, },
                                            children: item.task
                                        }),
                                        {
                                            tag: "span",
                                            className: "value monospace",
                                            children: Domain.dateStringFromTick(item.tick),
                                        },
                                    ]
                                }];
                            _c = {
                                tag: "div",
                                className: "item-operator"
                            };
                            if (!(null !== item.tick)) return [3 /*break*/, 2];
                            // {
                            //     tag: "button",
                            //     className: "default-button main-button",
                            //     children: "開く",
                            //     onclick: async () => { }
                            // },
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem("🚫 編集", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/];
                                    }); }); }),
                                    Render.menuItem("🚫 削除", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/];
                                    }); }); })
                                ])];
                        case 1:
                            _d = [
                                // {
                                //     tag: "button",
                                //     className: "default-button main-button",
                                //     children: "開く",
                                //     onclick: async () => { }
                                // },
                                _e.sent()
                            ];
                            return [3 /*break*/, 3];
                        case 2:
                            _d = [];
                            _e.label = 3;
                        case 3: return [2 /*return*/, (_a.children = _b.concat([
                                (_c.children = _d,
                                    _c)
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.tickItem = function (_pass, _item, tick, interval, max) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "tick-item flex-item ",
                                style: Render.progressStyle(null === interval ? null : interval / max)
                            };
                            _b = [{
                                    tag: "div",
                                    className: "item-information",
                                    children: [
                                        {
                                            tag: "div",
                                            className: "tick-timestamp",
                                            children: [
                                                Render.label("timestamp"),
                                                {
                                                    tag: "span",
                                                    className: "value monospace",
                                                    children: Domain.dateStringFromTick(tick),
                                                }
                                            ],
                                        },
                                        {
                                            tag: "div",
                                            className: "tick-interval",
                                            children: [
                                                Render.label("interval"),
                                                {
                                                    tag: "span",
                                                    className: "value monospace",
                                                    children: Domain.timeLongStringFromTick(interval),
                                                }
                                            ],
                                        },
                                    ],
                                }];
                            _c = {
                                tag: "div",
                                className: "item-operator"
                            };
                            // {
                            //     tag: "button",
                            //     className: "default-button main-button",
                            //     children: "開く",
                            //     onclick: async () => { }
                            // },
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem("🚫 編集", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/];
                                    }); }); }),
                                    Render.menuItem("🚫 削除", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/];
                                    }); }); })
                                ])];
                        case 1: return [2 /*return*/, (_a.children = _b.concat([
                                (_c.children = [
                                    // {
                                    //     tag: "button",
                                    //     className: "default-button main-button",
                                    //     children: "開く",
                                    //     onclick: async () => { }
                                    // },
                                    _d.sent()
                                ],
                                    _c)
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.dropDownLabel = function (options) {
                var _a;
                var dropdown = minamo_js_1.minamo.dom.make(HTMLSelectElement)({
                    className: options.className,
                    children: Array.isArray(options.list) ?
                        options.list.map(function (i) { return ({ tag: "option", value: i, children: i, selected: options.value === i ? true : undefined, }); }) :
                        Object.keys(options.list).map(function (i) { var _a; return ({ tag: "option", value: i, children: (_a = options.list[i]) !== null && _a !== void 0 ? _a : i, selected: options.value === i ? true : undefined, }); }),
                    onchange: function () {
                        var _a, _b;
                        if (labelSoan.innerText !== dropdown.value) {
                            labelSoan.innerText = Array.isArray(options.list) ?
                                dropdown.value :
                                ((_a = options.list[dropdown.value]) !== null && _a !== void 0 ? _a : dropdown.value);
                            (_b = options.onChange) === null || _b === void 0 ? void 0 : _b.call(options, dropdown.value);
                        }
                    },
                });
                var labelSoan = minamo_js_1.minamo.dom.make(HTMLSpanElement)({
                    children: Array.isArray(options.list) ?
                        options.value :
                        ((_a = options.list[options.value]) !== null && _a !== void 0 ? _a : options.value),
                });
                var result = {
                    tag: "label",
                    className: options.className,
                    children: [
                        dropdown,
                        labelSoan
                    ]
                };
                return result;
            };
            Render.listScreen = function (entry, list) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                var _this = this;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "list-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = Render.internalLink;
                            _e = {
                                href: "@overall" === entry.tag ? {} : { pass: entry.pass, tag: "@overall" }
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _f = [
                                _d.apply(void 0, [(_e.children = _j.sent(),
                                        _e)]),
                                Render.dropDownLabel({
                                    list: exports.makeObject(["@overall"].concat(Storage.Tag.get(entry.pass).sort(Domain.tagComparer(entry.pass))).concat(["@unoverall", "@untagged", "@deleted", "@new"])
                                        .map(function (i) { return ({ key: i, value: Domain.tagMap(i) + " (" + Storage.TagMember.get(entry.pass, i).length + ")", }); })),
                                    value: entry.tag,
                                    onChange: function (tag) { return __awaiter(_this, void 0, void 0, function () {
                                        var _a, newTag, tag_2;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _a = tag;
                                                    switch (_a) {
                                                        case "@new": return [3 /*break*/, 1];
                                                    }
                                                    return [3 /*break*/, 7];
                                                case 1: return [4 /*yield*/, Render.prompt("タグの名前を入力してください", "")];
                                                case 2:
                                                    newTag = _b.sent();
                                                    if (!(null === newTag || newTag.length <= 0)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, CyclicToDo.reload()];
                                                case 3:
                                                    _b.sent();
                                                    return [3 /*break*/, 6];
                                                case 4:
                                                    tag_2 = Storage.Tag.encode(newTag.trim());
                                                    Storage.Tag.add(entry.pass, tag_2);
                                                    return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: newTag, })];
                                                case 5:
                                                    _b.sent();
                                                    _b.label = 6;
                                                case 6: return [3 /*break*/, 9];
                                                case 7: return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: tag, })];
                                                case 8:
                                                    _b.sent();
                                                    _b.label = 9;
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                })
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem(locale.parallel("History"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: entry.tag, hash: "history" })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Storage.Tag.isSystemTag(entry.tag) ? [] :
                                        Render.menuItem(locale.parallel("Rename"), function () { return __awaiter(_this, void 0, void 0, function () {
                                            var newTag;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, Render.prompt("タグの名前を入力してください", entry.tag)];
                                                    case 1:
                                                        newTag = _a.sent();
                                                        if (!(null !== newTag && 0 < newTag.length && newTag !== entry.tag)) return [3 /*break*/, 4];
                                                        if (!Storage.Tag.rename(entry.pass, entry.tag, newTag)) return [3 /*break*/, 3];
                                                        return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: newTag })];
                                                    case 2:
                                                        _a.sent();
                                                        return [3 /*break*/, 4];
                                                    case 3:
                                                        Render.alert("その名前のタグは既に存在しています。");
                                                        _a.label = 4;
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        }); }),
                                    "@deleted" === entry.tag ?
                                        [
                                            Render.menuItem("🚫 完全に削除", function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    return [2 /*return*/];
                                                });
                                            }); }),
                                        ] :
                                        [
                                            Render.menuItem(locale.parallel("New ToDo"), function () { return __awaiter(_this, void 0, void 0, function () {
                                                var newTask;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, Render.prompt("ToDo の名前を入力してください")];
                                                        case 1:
                                                            newTask = _a.sent();
                                                            if (!(null !== newTask)) return [3 /*break*/, 3];
                                                            Storage.Task.add(entry.pass, newTask);
                                                            Storage.TagMember.add(entry.pass, entry.tag, newTask);
                                                            return [4 /*yield*/, CyclicToDo.reload()];
                                                        case 2:
                                                            _a.sent();
                                                            _a.label = 3;
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); }),
                                            {
                                                tag: "button",
                                                children: "🚫 リストをシェア",
                                            }
                                        ],
                                    Render.menuItem(locale.parallel("Export"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, hash: "export", })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Storage.Tag.isSystemTag(entry.tag) ? [] :
                                        Render.menuItem(locale.parallel("Delete"), function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/];
                                            });
                                        }); }),
                                ])];
                        case 2:
                            _g = [
                                _b.apply(void 0, _c.concat([_f.concat([
                                        _j.sent()
                                    ])]))
                            ];
                            _h = {
                                tag: "div",
                                className: "column-flex-list todo-list"
                            };
                            return [4 /*yield*/, Promise.all(list.map(function (item) { return Render.todoItem(entry, item); }))];
                        case 3: return [2 /*return*/, (_a.children = _g.concat([
                                (_h.children = _j.sent(),
                                    _h),
                                "@deleted" !== entry.tag ?
                                    {
                                        tag: "div",
                                        className: "button-list",
                                        children: [
                                            {
                                                tag: "button",
                                                className: list.length <= 0 ? "default-button main-button long-button" : "main-button long-button",
                                                children: locale.parallel("New ToDo"),
                                                onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                    var newTask;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, Render.prompt("ToDo の名前を入力してください")];
                                                            case 1:
                                                                newTask = _a.sent();
                                                                if (!(null !== newTask)) return [3 /*break*/, 3];
                                                                Storage.Task.add(entry.pass, newTask);
                                                                Storage.TagMember.add(entry.pass, entry.tag, newTask);
                                                                return [4 /*yield*/, CyclicToDo.reload()];
                                                            case 2:
                                                                _a.sent();
                                                                _a.label = 3;
                                                            case 3: return [2 /*return*/];
                                                        }
                                                    });
                                                }); }
                                            },
                                            {
                                                tag: "button",
                                                className: "main-button long-button",
                                                children: locale.parallel("History"),
                                                onclick: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: entry.tag, hash: "history", })];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                }); }); },
                                            },
                                        ]
                                    } :
                                    0 < list.length ?
                                        {
                                            tag: "div",
                                            className: "button-list",
                                            children: {
                                                tag: "button",
                                                className: "default-button main-button long-button",
                                                children: "🚫 完全に削除",
                                                onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/];
                                                    });
                                                }); }
                                            },
                                        } :
                                        {
                                            tag: "div",
                                            className: "button-list",
                                            children: locale.parallel("Recycle Bin is empty."),
                                        }
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.showListScreen = function (entry) { return __awaiter(_this, void 0, void 0, function () {
                var list, lastUpdate, updateWindow, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = Domain.tagMap(entry.tag) + " " + applicationTitle;
                            list = entry.todo.map(function (task) { return Domain.getToDoEntry(entry.pass, task, Domain.getRecentlyHistory(entry.pass, task)); });
                            Domain.updateListProgress(entry, list);
                            list.sort(Domain.todoComparer1(entry));
                            list.sort(Domain.todoComparer2(list));
                            lastUpdate = Storage.lastUpdate;
                            updateWindow = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            Domain.updateListProgress(entry, list);
                                            if (!(lastUpdate === Storage.lastUpdate)) return [3 /*break*/, 1];
                                            Array.from(document
                                                .getElementsByClassName("list-screen")[0]
                                                .getElementsByClassName("todo-list")[0].childNodes).forEach(function (dom, index) {
                                                var item = list[index];
                                                var button = dom.getElementsByClassName("item-operator")[0].getElementsByClassName("main-button")[0];
                                                button.classList.toggle("default-button", item.isDefault);
                                                var information = dom.getElementsByClassName("item-information")[0];
                                                information.setAttribute("style", Render.progressStyle(item.progress));
                                                information.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0].innerText = Domain.timeLongStringFromTick(item.elapsed);
                                            });
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, CyclicToDo.reload()];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.listScreen(entry, list)];
                        case 1:
                            _a.apply(void 0, [_b.sent(), updateWindow]);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.historyScreen = function (entry, list) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                var _this = this;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "history-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = Render.internalLink;
                            _e = {
                                href: { pass: entry.pass, tag: entry.tag, }
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _f = [
                                _d.apply(void 0, [(_e.children = _j.sent(),
                                        _e)]),
                                Render.dropDownLabel({
                                    list: exports.makeObject(["@overall"].concat(Storage.Tag.get(entry.pass).sort(Domain.tagComparer(entry.pass))).concat(["@unoverall", "@untagged", "@deleted", "@new"])
                                        .map(function (i) { return ({ key: i, value: Domain.tagMap(i) + " (" + Storage.TagMember.get(entry.pass, i).length + ")", }); })),
                                    value: entry.tag,
                                    onChange: function (tag) { return __awaiter(_this, void 0, void 0, function () {
                                        var _a, newTag, tag_3;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _a = tag;
                                                    switch (_a) {
                                                        case "@new": return [3 /*break*/, 1];
                                                    }
                                                    return [3 /*break*/, 7];
                                                case 1: return [4 /*yield*/, Render.prompt("タグの名前を入力してください", "")];
                                                case 2:
                                                    newTag = _b.sent();
                                                    if (!(null === newTag)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, CyclicToDo.reload()];
                                                case 3:
                                                    _b.sent();
                                                    return [3 /*break*/, 6];
                                                case 4:
                                                    tag_3 = Storage.Tag.encode(newTag.trim());
                                                    Storage.Tag.add(entry.pass, tag_3);
                                                    return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: newTag, hash: "history", })];
                                                case 5:
                                                    _b.sent();
                                                    _b.label = 6;
                                                case 6: return [3 /*break*/, 9];
                                                case 7: return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: tag, hash: "history", })];
                                                case 8:
                                                    _b.sent();
                                                    _b.label = 9;
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                })
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem(locale.parallel("Back to List"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: entry.tag, })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Storage.Tag.isSystemTag(entry.tag) ? [] :
                                        Render.menuItem(locale.parallel("Rename"), function () { return __awaiter(_this, void 0, void 0, function () {
                                            var newTag;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, Render.prompt("タグの名前を入力してください", entry.tag)];
                                                    case 1:
                                                        newTag = _a.sent();
                                                        if (!(null !== newTag && 0 < newTag.length && newTag !== entry.tag)) return [3 /*break*/, 4];
                                                        if (!Storage.Tag.rename(entry.pass, entry.tag, newTag)) return [3 /*break*/, 3];
                                                        return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: newTag, hash: "history", })];
                                                    case 2:
                                                        _a.sent();
                                                        return [3 /*break*/, 4];
                                                    case 3:
                                                        Render.alert("その名前のタグは既に存在しています。");
                                                        _a.label = 4;
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        }); }),
                                    "@deleted" === entry.tag ?
                                        [
                                            Render.menuItem("🚫 完全に削除", function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    return [2 /*return*/];
                                                });
                                            }); }),
                                        ] :
                                        [
                                            Render.menuItem(locale.parallel("New ToDo"), function () { return __awaiter(_this, void 0, void 0, function () {
                                                var newTask;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, Render.prompt("ToDo の名前を入力してください")];
                                                        case 1:
                                                            newTask = _a.sent();
                                                            if (!(null !== newTask)) return [3 /*break*/, 3];
                                                            Storage.Task.add(entry.pass, newTask);
                                                            Storage.TagMember.add(entry.pass, entry.tag, newTask);
                                                            return [4 /*yield*/, CyclicToDo.reload()];
                                                        case 2:
                                                            _a.sent();
                                                            _a.label = 3;
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); }),
                                            {
                                                tag: "button",
                                                children: "🚫 リストをシェア",
                                            }
                                        ],
                                    Render.menuItem(locale.parallel("Export"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, hash: "export", })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Storage.Tag.isSystemTag(entry.tag) ? [] :
                                        Render.menuItem(locale.parallel("Delete"), function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/];
                                            });
                                        }); }),
                                ])];
                        case 2:
                            _g = [
                                _b.apply(void 0, _c.concat([_f.concat([
                                        _j.sent()
                                    ])]))
                            ];
                            _h = {
                                tag: "div",
                                className: "column-flex-list history-list"
                            };
                            return [4 /*yield*/, Promise.all(list.map(function (item) { return Render.historyItem(entry, item); }))];
                        case 3: return [2 /*return*/, (_a.children = _g.concat([
                                (_h.children = _j.sent(),
                                    _h),
                                {
                                    tag: "div",
                                    className: "button-list",
                                    children: {
                                        tag: "button",
                                        className: "default-button main-button long-button",
                                        children: locale.parallel("Back to List"),
                                        onclick: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: entry.pass, tag: entry.tag, })];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        }); }); }
                                    },
                                }
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.showHistoryScreen = function (entry) { return __awaiter(_this, void 0, void 0, function () {
                var histories, list, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = locale.map("History") + ": " + Domain.tagMap(entry.tag) + " " + applicationTitle;
                            histories = {};
                            list = entry.todo.map(function (task) { return (histories[task] = Storage.History.get(entry.pass, task)).map(function (tick) { return ({ task: task, tick: tick }); }); }).reduce(function (a, b) { return a.concat(b); }, []);
                            list.sort(minamo_js_1.minamo.core.comparer.make(function (a) { return -a.tick; }));
                            list = list.concat(entry.todo.filter(function (task) { return histories[task].length <= 0; }).map(function (task) { return ({ task: task, tick: null }); }));
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.historyScreen(entry, list)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.removedScreen = function (pass) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "removed-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = Render.internalLink;
                            _e = {
                                href: { pass: pass, tag: "@overall", }
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _f = [
                                _d.apply(void 0, [(_e.children = _g.sent(),
                                        _e)]),
                                locale.map("@deleted")
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem(locale.parallel("Back to List"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: pass, tag: "@overall", })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Render.menuItem("🚫 完全に削除", function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/];
                                        });
                                    }); }),
                                ])];
                        case 2: return [2 /*return*/, (_a.children = [
                                _b.apply(void 0, _c.concat([_f.concat([
                                        _g.sent()
                                    ])])),
                                {
                                    tag: "div",
                                    className: "column-flex-list removed-list",
                                },
                                {
                                    tag: "div",
                                    className: "button-list",
                                    children: {
                                        tag: "button",
                                        className: "default-button main-button long-button",
                                        children: locale.parallel("Back to List"),
                                        onclick: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: pass, tag: "@overall", })];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        }); }); }
                                    },
                                }
                            ],
                                _a)];
                    }
                });
            }); };
            Render.showRemovedScreen = function (pass) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = locale.map("@deleted") + " " + applicationTitle;
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.removedScreen(pass)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.todoScreen = function (pass, item, ticks) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                var _this = this;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "todo-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = Render.internalLink;
                            _e = {
                                href: { pass: pass, tag: "@overall", }
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _f = [
                                _d.apply(void 0, [(_e.children = _j.sent(),
                                        _e)]),
                                "" + item.task
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.todoRenameMenu(pass, item, function (newTask) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: pass, todo: newTask, })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Render.todoTagMenu(pass, item),
                                    Render.todoDeleteMenu(pass, item),
                                    {
                                        tag: "button",
                                        children: "🚫 ToDo をシェア",
                                    },
                                    Render.menuItem(locale.parallel("Export"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: pass, hash: "export", })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                ])];
                        case 2:
                            _g = [
                                _b.apply(void 0, _c.concat([_f.concat([
                                        _j.sent()
                                    ])])),
                                {
                                    tag: "div",
                                    className: "row-flex-list todo-list",
                                    children: [
                                        {
                                            tag: "div",
                                            className: "task-item flex-item",
                                            children: [
                                                {
                                                    tag: "div",
                                                    className: "item-tags",
                                                    children: Storage.Tag.getByTodo(pass, item.task).map(function (tag) { return Render.internalLink({
                                                        className: "tag",
                                                        href: { pass: pass, tag: tag, },
                                                        children: Domain.tagMap(tag),
                                                    }); })
                                                },
                                                Render.information(item),
                                            ],
                                        },
                                    ],
                                }
                            ];
                            _h = {
                                tag: "div",
                                className: "column-flex-list tick-list"
                            };
                            return [4 /*yield*/, Promise.all(ticks.map(function (tick, index) { return Render.tickItem(pass, item, tick, "number" === typeof ticks[index + 1] ? tick - ticks[index + 1] : null, ticks.length < 2 ? null : Math.max.apply(null, Calculate.intervals(ticks))); }))];
                        case 3: return [2 /*return*/, (_a.children = _g.concat([
                                (_h.children = _j.sent(),
                                    _h),
                                0 <= Storage.TagMember.get(pass, "@deleted").indexOf(item.task) || Storage.isSessionPass(pass) ?
                                    [] :
                                    {
                                        tag: "div",
                                        className: "button-list",
                                        children: {
                                            tag: "button",
                                            className: "default-button main-button long-button",
                                            children: locale.parallel("Done"),
                                            onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            Domain.done(pass, item.task);
                                                            return [4 /*yield*/, CyclicToDo.reload()];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }
                                        },
                                    }
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.showTodoScreen = function (pass, task) { return __awaiter(_this, void 0, void 0, function () {
                var item, lastUpdate, updateWindow, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = task + " " + applicationTitle;
                            item = Domain.getToDoEntry(pass, task, Domain.getRecentlyHistory(pass, task));
                            Domain.updateProgress(item);
                            lastUpdate = Storage.lastUpdate;
                            updateWindow = function () { return __awaiter(_this, void 0, void 0, function () {
                                var dom, information_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            Domain.updateProgress(item);
                                            if (!(lastUpdate === Storage.lastUpdate)) return [3 /*break*/, 1];
                                            dom = document
                                                .getElementsByClassName("todo-screen")[0]
                                                .getElementsByClassName("task-item")[0];
                                            information_1 = dom.getElementsByClassName("item-information")[0];
                                            information_1.setAttribute("style", Render.progressStyle(item.progress));
                                            information_1.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0].innerText = Domain.timeLongStringFromTick(item.elapsed);
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, CyclicToDo.reload()];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.todoScreen(pass, item, Storage.History.get(pass, task))];
                        case 1:
                            _a.apply(void 0, [_b.sent(), updateWindow]);
                            return [2 /*return*/];
                    }
                });
            }); };
            var loadSvg = function (path) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var request = new XMLHttpRequest();
                            request.open('GET', path, true);
                            request.onreadystatechange = function () {
                                if (4 === request.readyState) {
                                    if (200 <= request.status && request.status < 300) {
                                        try {
                                            resolve(request.responseText);
                                        }
                                        catch (err) {
                                            reject(err);
                                        }
                                    }
                                    else {
                                        reject(request);
                                    }
                                }
                            };
                            request.send(null);
                        })];
                });
            }); };
            var svgCache = {};
            var loadSvgOrCache = function (path) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c, _d, _e; var _f; return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _b = (_a = new DOMParser()).parseFromString;
                        if (!((_f = svgCache[path]) !== null && _f !== void 0)) return [3 /*break*/, 1];
                        _c = _f;
                        return [3 /*break*/, 3];
                    case 1:
                        _d = svgCache;
                        _e = path;
                        return [4 /*yield*/, loadSvg(path)];
                    case 2:
                        _c = (_d[_e] = _g.sent());
                        _g.label = 3;
                    case 3: return [2 /*return*/, _b.apply(_a, [_c, "image/svg+xml"]).documentElement];
                }
            }); }); };
            Render.showExportScreen = function (pass) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = applicationTitle;
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.exportScreen(pass)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.exportScreen = function (pass) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "export-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = Render.internalLink;
                            _e = {
                                href: { pass: pass, tag: "@overall", }
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _f = [
                                _d.apply(void 0, [(_e.children = _g.sent(),
                                        _e)]),
                                "" + document.title
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem(locale.parallel("Back to List"), function () { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: pass, tag: "@overall", })];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                }); }); }];
                                        });
                                    }); })
                                ])];
                        case 2: return [2 /*return*/, (_a.children = [
                                _b.apply(void 0, _c.concat([_f.concat([
                                        _g.sent()
                                    ])])),
                                {
                                    tag: "textarea",
                                    className: "json",
                                    children: Storage.exportJson(pass),
                                }
                            ],
                                _a)];
                    }
                });
            }); };
            Render.showImportScreen = function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = applicationTitle;
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.importScreen()];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.importScreen = function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "import-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = Render.internalLink;
                            _e = {
                                href: {}
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _f = [
                                _d.apply(void 0, [(_e.children = _g.sent(),
                                        _e)]),
                                "" + document.title
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem(locale.parallel("Back to Home"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({})];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); })
                                ])];
                        case 2: return [2 /*return*/, (_a.children = [
                                _b.apply(void 0, _c.concat([_f.concat([
                                        _g.sent()
                                    ])])),
                                {
                                    tag: "textarea",
                                    className: "json",
                                    placeholder: "エクスポートした JSON をペーストしてください。"
                                },
                                {
                                    tag: "div",
                                    className: "button-list",
                                    children: {
                                        tag: "button",
                                        className: "default-button main-button long-button",
                                        children: locale.parallel("Import"),
                                        onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                            var textarea, pass;
                                            return __generator(this, function (_a) {
                                                textarea = document.getElementsByClassName("json")[0];
                                                pass = Storage.importJson(textarea.value);
                                                if (null !== pass) {
                                                    CyclicToDo.showUrl({ pass: pass, tag: "@overall", });
                                                }
                                                return [2 /*return*/];
                                            });
                                        }); },
                                    },
                                }
                            ],
                                _a)];
                    }
                });
            }); };
            Render.removedListItem = function (list) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, ({
                            tag: "div",
                            className: "list-item flex-item",
                            children: [
                                {
                                    tag: "div",
                                    className: "item-header",
                                    children: [
                                        Render.internalLink({
                                            className: "item-title",
                                            href: { pass: list.pass, tag: "@overall", },
                                            children: "ToDo \u30EA\u30B9\u30C8 ( pass: " + list.pass.substr(0, 2) + "****" + list.pass.substr(-2) + " )"
                                        }),
                                        {
                                            tag: "div",
                                            className: "item-operator",
                                            children: [
                                                {
                                                    tag: "button",
                                                    className: "default-button main-button",
                                                    children: "復元",
                                                    onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                        var pass;
                                                        return __generator(this, function (_a) {
                                                            pass = Storage.importJson(JSON.stringify(list));
                                                            if (null !== pass) {
                                                                CyclicToDo.showUrl({ pass: pass, tag: "@overall", });
                                                            }
                                                            return [2 /*return*/];
                                                        });
                                                    }); }
                                                },
                                            ]
                                        }
                                    ]
                                },
                            ]
                        })];
                });
            }); };
            Render.showRemovedListScreen = function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = locale.map("@deleted") + " " + document.title;
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.removedListScreen()];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.removedListScreen = function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                var _this = this;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "remove-list-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = Render.internalLink;
                            _e = {
                                href: {}
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _f = [
                                _d.apply(void 0, [(_e.children = _j.sent(),
                                        _e)]),
                                "" + document.title
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem(locale.parallel("Back to Home"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({})];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); })
                                ])];
                        case 2:
                            _g = [
                                _b.apply(void 0, _c.concat([_f.concat([
                                        _j.sent()
                                    ])]))
                            ];
                            _h = {
                                tag: "div",
                                className: "column-flex-list removed-list-list"
                            };
                            return [4 /*yield*/, Promise.all(Storage.Backup.get().map(function (json) { return Render.removedListItem(JSON.parse(json)); }))];
                        case 3: return [2 /*return*/, (_a.children = _g.concat([
                                (_h.children = _j.sent(),
                                    _h),
                                0 < Storage.Backup.get().length ?
                                    {
                                        tag: "div",
                                        className: "button-list",
                                        children: {
                                            tag: "button",
                                            className: "default-button main-button long-button",
                                            children: "完全に削除",
                                            onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            Storage.Backup.clear();
                                                            return [4 /*yield*/, CyclicToDo.reload()];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }
                                        },
                                    } :
                                    {
                                        tag: "div",
                                        className: "button-list",
                                        children: locale.parallel("Recycle Bin is empty."),
                                    }
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.applicationIcon = function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "application-icon icon"
                            };
                            return [4 /*yield*/, loadSvgOrCache("./cyclictodohex.1024.svg")];
                        case 1: return [2 /*return*/, (_a.children = _b.sent(),
                                _a)];
                    }
                });
            }); };
            Render.listItem = function (list) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                var _this = this;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "list-item flex-item"
                            };
                            _b = {
                                tag: "div",
                                className: "item-header"
                            };
                            _c = [Render.internalLink({
                                    className: "item-title",
                                    href: { pass: list.pass, tag: "@overall", },
                                    children: "ToDo \u30EA\u30B9\u30C8 ( pass: " + list.pass.substr(0, 2) + "****" + list.pass.substr(-2) + " )"
                                })];
                            _d = {
                                tag: "div",
                                className: "item-operator"
                            };
                            _e = [{
                                    tag: "button",
                                    className: "default-button main-button",
                                    children: "開く",
                                    onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            CyclicToDo.showUrl({ pass: list.pass, tag: "@overall", });
                                            return [2 /*return*/];
                                        });
                                    }); }
                                }];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem(locale.parallel("Export"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: list.pass, hash: "export", })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Render.menuItem(locale.parallel("Delete"), function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    Storage.Pass.remove(list.pass);
                                                    return [4 /*yield*/, CyclicToDo.showUrl({})];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })
                                ])];
                        case 1: return [2 /*return*/, (_a.children = [
                                (_b.children = _c.concat([
                                    (_d.children = _e.concat([
                                        _f.sent()
                                    ]),
                                        _d)
                                ]),
                                    _b)
                            ],
                                _a)];
                    }
                });
            }); };
            Render.welcomeScreen = function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "welcome-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _d = [
                                _g.sent(),
                                "" + document.title
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem(locale.parallel("New ToDo List"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: Storage.Pass.generate(), tag: "@overall", })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Render.menuItem(locale.parallel("@deleted"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ hash: "removed", })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Render.menuItem(locale.parallel("Import List"), function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, CyclicToDo.showUrl({ hash: "import", })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); }),
                                    Render.menuItem("GitHub", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, location.href = "https://github.com/wraith13/cyclic-todo/"];
                                    }); }); }),
                                ])];
                        case 2:
                            _e = [
                                _b.apply(void 0, _c.concat([_d.concat([
                                        _g.sent()
                                    ])])),
                                {
                                    tag: "div",
                                    style: "text-align: center; padding: 0.5rem;",
                                    children: "🚧 This static web application is under development. / この Static Web アプリは開発中です。",
                                }
                            ];
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 3:
                            _e = _e.concat([
                                _g.sent()
                            ]);
                            _f = {
                                tag: "div",
                                className: "row-flex-list list-list"
                            };
                            return [4 /*yield*/, Promise.all(Storage.Pass.get().map(function (pass) { return Render.listItem(JSON.parse(Storage.exportJson(pass))); }))];
                        case 4: return [2 /*return*/, (_a.children = _e.concat([
                                (_f.children = _g.sent(),
                                    _f),
                                {
                                    tag: "div",
                                    className: "button-list",
                                    children: [
                                        {
                                            tag: "button",
                                            className: Storage.Pass.get().length <= 0 ? "default-button main-button long-button" : "main-button long-button",
                                            children: locale.parallel("New ToDo List"),
                                            onclick: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, CyclicToDo.showUrl({ pass: Storage.Pass.generate(), tag: "@overall", })];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); },
                                        },
                                        {
                                            tag: "button",
                                            className: "main-button long-button",
                                            children: locale.parallel("Import"),
                                            onclick: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, CyclicToDo.showUrl({ hash: "import", })];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); },
                                        },
                                        {
                                            tag: "button",
                                            className: "main-button long-button",
                                            children: locale.parallel("@deleted"),
                                            onclick: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, CyclicToDo.showUrl({ hash: "removed", })];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); },
                                        },
                                    ]
                                }
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.showWelcomeScreen = function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = applicationTitle;
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.welcomeScreen()];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); };
            var updateWindowTimer = undefined;
            Render.showWindow = function (screen, updateWindow) { return __awaiter(_this, void 0, void 0, function () {
                var lastUpdate_1;
                var _this = this;
                return __generator(this, function (_a) {
                    if (undefined !== updateWindow) {
                        Render.updateWindow = updateWindow;
                    }
                    else {
                        lastUpdate_1 = Storage.lastUpdate;
                        Render.updateWindow = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(lastUpdate_1 !== Storage.lastUpdate)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, CyclicToDo.reload()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); };
                    }
                    if (undefined === updateWindowTimer) {
                        setInterval(function () { var _a; return (_a = Render.updateWindow) === null || _a === void 0 ? void 0 : _a.call(Render); }, Domain.TimeAccuracy);
                    }
                    minamo_js_1.minamo.dom.replaceChildren(document.getElementById("body"), screen);
                    Render.resizeFlexList();
                    return [2 /*return*/];
                });
            }); };
            Render.resizeFlexList = function () {
                var minColumns = 1 + Math.floor(window.innerWidth / 780);
                var maxColumns = Math.min(12, Math.max(minColumns, Math.floor(window.innerWidth / 450)));
                var FontRemUnit = parseFloat(getComputedStyle(document.documentElement).fontSize);
                var border = FontRemUnit * 26 + 10;
                Array.from(document.getElementsByClassName("column-flex-list")).forEach(function (list) {
                    var length = list.childNodes.length;
                    list.classList.forEach(function (i) {
                        if (/^max-column-\d+$/.test(i)) {
                            list.classList.remove(i);
                        }
                    });
                    if (length <= 1 || maxColumns <= 1) {
                        list.style.height = undefined;
                    }
                    else {
                        var height = window.innerHeight - list.offsetTop;
                        var itemHeight = list.childNodes[0].offsetHeight;
                        var columns = Math.min(maxColumns, Math.ceil(length / Math.max(1.0, Math.floor(height / itemHeight))));
                        var row = Math.max(Math.ceil(length / columns), Math.min(length, Math.floor(height / itemHeight)));
                        list.style.height = row * itemHeight + "px";
                        list.classList.add("max-column-" + columns);
                    }
                    if (0 < length) {
                        var itemWidth = Math.min(window.innerWidth, list.childNodes[0].offsetWidth);
                        list.classList.toggle("locale-parallel-on", border < itemWidth);
                        list.classList.toggle("locale-parallel-off", itemWidth <= border);
                    }
                    list.classList.toggle("empty-list", length <= 0);
                });
                Array.from(document.getElementsByClassName("row-flex-list")).forEach(function (list) {
                    var length = list.childNodes.length;
                    list.classList.forEach(function (i) {
                        if (/^max-column-\d+$/.test(i)) {
                            list.classList.remove(i);
                        }
                    });
                    var columns = Math.min(maxColumns, Math.max(1, length));
                    list.classList.add("max-column-" + columns);
                    if (0 < length) {
                        var itemWidth = Math.min(window.innerWidth, list.childNodes[0].offsetWidth);
                        list.classList.toggle("locale-parallel-on", border < itemWidth);
                        list.classList.toggle("locale-parallel-off", itemWidth <= border);
                    }
                    list.classList.toggle("empty-list", length <= 0);
                });
            };
            var onWindowResizeTimestamp = 0;
            Render.onWindowResize = function () {
                var timestamp = onWindowResizeTimestamp = new Date().getTime();
                setTimeout(function () {
                    if (timestamp === onWindowResizeTimestamp) {
                        Render.resizeFlexList();
                    }
                }, 100);
            };
            var onUpdateStorageCount = 0;
            Render.onUpdateStorage = function () {
                var lastUpdate = Storage.lastUpdate = new Date().getTime();
                var onUpdateStorageCountCopy = onUpdateStorageCount = onUpdateStorageCount + 1;
                setTimeout(function () {
                    if (lastUpdate === Storage.lastUpdate && onUpdateStorageCountCopy === onUpdateStorageCount) {
                        Render.updateWindow === null || Render.updateWindow === void 0 ? void 0 : Render.updateWindow();
                    }
                }, 50);
            };
        })(Render = CyclicToDo.Render || (CyclicToDo.Render = {}));
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
        CyclicToDo.makeUrl = function (args, href) {
            var _a;
            if (href === void 0) { href = location.href; }
            return href
                .replace(/\?.*/, "")
                .replace(/#.*/, "")
                + "?"
                + Object.keys(args).filter(function (i) { return "hash" !== i; }).map(function (i) { return i + "=" + encodeURIComponent(args[i]); }).join("&")
                + ("#" + ((_a = args["hash"]) !== null && _a !== void 0 ? _a : ""));
        };
        // export const makeUrl =
        // (
        //     args: {[key: string]: string},
        //     hash: string = getUrlHash(),
        //     href: string = location.href
        // ) =>
        //     href
        //         .replace(/\?.*/, "")
        //         .replace(/#.*/, "")
        //         +"?"
        //         +Object.keys(args).map(i => `${i}=${encodeURIComponent(args[i])}`).join("&")
        //         +`#${hash}`;
        // export const makeSharingUrl = (url: string = location.href) =>
        // {
        //     const urlParams = getUrlParams(url);
        //     if (undefined !== urlParams["pass"])
        //     {
        //         delete urlParams["pass"];
        //     }
        //     return makeUrl
        //     (
        //         urlParams,
        //         getUrlHash(url),
        //         url
        //     );
        // };
        CyclicToDo.start = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("start!!!");
                        window.onpopstate = function () { return CyclicToDo.showPage(); };
                        return [4 /*yield*/, CyclicToDo.showPage()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        CyclicToDo.showPage = function (url) {
            if (url === void 0) { url = location.href; }
            return __awaiter(_this, void 0, void 0, function () {
                var urlParams, hash, tag, todo, pass, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            window.scrollTo(0, 0);
                            urlParams = CyclicToDo.getUrlParams(url);
                            hash = CyclicToDo.getUrlHash(url);
                            tag = urlParams["tag"];
                            todo = urlParams["todo"];
                            pass = (_b = urlParams["pass"]) !== null && _b !== void 0 ? _b : Storage.sessionPassPrefix + ":" + new Date().getTime();
                            // const todo = JSON.parse(urlParams["todo"] ?? "null") as string[] | null;
                            // const history = JSON.parse(urlParams["history"] ?? "null") as (number | null)[] | null;
                            window.addEventListener('resize', Render.onWindowResize);
                            window.addEventListener('storage', Render.onUpdateStorage);
                            if (!(pass && todo)) return [3 /*break*/, 2];
                            console.log("show todo screen");
                            return [4 /*yield*/, Render.showTodoScreen(pass, todo)];
                        case 1:
                            _c.sent();
                            return [3 /*break*/, 9];
                        case 2:
                            if (!(Storage.isSessionPass(pass) && !tag)) return [3 /*break*/, 8];
                            _a = hash;
                            switch (_a) {
                                case "import": return [3 /*break*/, 3];
                                case "removed": return [3 /*break*/, 4];
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            console.log("show import screen");
                            Render.showImportScreen();
                            return [3 /*break*/, 7];
                        case 4:
                            console.log("show removed-list screen");
                            Render.showRemovedListScreen();
                            return [3 /*break*/, 7];
                        case 5:
                            console.log("show welcome screen");
                            return [4 /*yield*/, Render.showWelcomeScreen()];
                        case 6:
                            _c.sent();
                            return [3 /*break*/, 7];
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            //Domain.merge(pass, tag, todo, history);
                            switch (hash) {
                                case "history":
                                    console.log("show history screen");
                                    Render.showHistoryScreen({ tag: tag, pass: pass, todo: Storage.TagMember.get(pass, tag) });
                                    break;
                                // case "statistics":
                                //     dom.updateStatisticsScreen(title, pass, todo);
                                //     break;
                                case "removed":
                                    console.log("show removed screen");
                                    Render.showRemovedScreen(pass);
                                    break;
                                case "import":
                                    console.log("show import screen");
                                    Render.showImportScreen();
                                    break;
                                case "export":
                                    console.log("show export screen");
                                    Render.showExportScreen(pass);
                                    break;
                                default:
                                    console.log("show list screen");
                                    Render.showListScreen({ tag: tag !== null && tag !== void 0 ? tag : "@overall", pass: pass, todo: Storage.TagMember.get(pass, tag) });
                                    break;
                            }
                            _c.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        CyclicToDo.showUrl = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = CyclicToDo.makeUrl(data);
                        return [4 /*yield*/, CyclicToDo.showPage(url)];
                    case 1:
                        _a.sent();
                        history.pushState(null, applicationTitle, url);
                        return [2 /*return*/];
                }
            });
        }); };
        CyclicToDo.reload = CyclicToDo.showPage;
    })(CyclicToDo = exports.CyclicToDo || (exports.CyclicToDo = {}));
});
//# sourceMappingURL=index.js.map