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
    "@new": "New tag"
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
    "@new": "新しいタグ"
});
define("index", ["require", "exports", "minamo.js/index", "lang.en", "lang.ja"], function (require, exports, minamo_js_1, lang_en_json_1, lang_ja_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CyclicToDo = exports.Calculate = exports.localeParallel = exports.localeSingle = exports.uniqueFilter = exports.simpleReverseComparer = exports.simpleComparer = exports.makeObject = void 0;
    lang_en_json_1 = __importDefault(lang_en_json_1);
    lang_ja_json_1 = __importDefault(lang_ja_json_1);
    // export const timeout = <T>(wait: number = 0, action?: () => T) =>
    //     undefined === action ?
    //         new Promise(resolve => setTimeout(resolve, wait)):
    //         new Promise(resolve => setTimeout(() => resolve(action()), wait));
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
        Calculate.expectedNext = function (ticks) {
            var intervals = Calculate.intervals(ticks).reverse();
            var average = Calculate.average(intervals);
            var standardDeviation = Calculate.standardDeviation(intervals, average);
            if (10 <= intervals.length && (average * 0.1) < standardDeviation) {
                var waveLenghResolution_1 = 10;
                var angleResolution_1 = 10;
                var base_1 = 2 * standardDeviation;
                var regulatedIntervals_1 = intervals.map(function (i) { return Math.min(1.0, Math.max(-1.0, (i - average) / base_1)); });
                // const regulatedAverage = Calculate.average(regulatedIntervals);
                // const regulatedStandardDeviation = Calculate.standardDeviation(regulatedIntervals, regulatedAverage);
                var primeWaveLength_1 = Math.pow(Calculate.phi, Math.ceil(Math.log(regulatedIntervals_1.length) / Math.log(Calculate.phi)));
                var diff = regulatedIntervals_1.map(function (i) { return i; });
                var rates = [];
                var calcLevel_1 = function (angle, waveLength, index) { return Math.sin(((index / waveLength) + (angle / angleResolution_1)) * (Math.PI * 2)); };
                //const calcLevel = (_offset: number, waveLength: number, index: number) => Math.sin((index /waveLength) *(Math.PI *2));
                var calcRate = function (values, offset, waveLength) { return Calculate.average(values.map(function (value, index) { return Math.min(1.0, Math.max(-1.0, value / calcLevel_1(offset, waveLength, index))); })); };
                var calcAccuracy = function (values) { return Calculate.average(values.map(function (i) { return 1 - Math.abs(i); })); };
                var calcWorstAccuracy = function (values) { return values.map(function (i) { return 1 - Math.abs(i); }).reduce(function (a, b) { return a < b ? a : b; }, 1); };
                var initAccuracy = calcAccuracy(diff);
                var initWorstAccuracy = calcWorstAccuracy(diff);
                console.log(diff);
                var wave = 0;
                //while(Math.pow(Calculate.phi, offset /resolution) <= primeWaveLength)
                var previousAccuracy = initAccuracy;
                var previousWorstAccuracy = initWorstAccuracy;
                var _loop_1 = function () {
                    var waveLength = primeWaveLength_1 / Math.pow(Calculate.phi, wave / waveLenghResolution_1);
                    var currentRates = [];
                    var _loop_2 = function (angle) {
                        var rate = calcRate(diff, angle, waveLength);
                        var nextDiff = diff.map(function (value, index) { return value - (rate * calcLevel_1(angle, waveLength, index)); });
                        //console.log(`rate: ${rate}, accuracy: ${calcAccuracy(diff).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}`);
                        //console.log({ waveLength, diff, });
                        var nextAccuracy = calcAccuracy(nextDiff);
                        var nextWorstAccuracy = calcWorstAccuracy(nextDiff);
                        if (previousAccuracy < nextAccuracy && previousWorstAccuracy < nextWorstAccuracy) {
                            previousAccuracy = nextAccuracy;
                            previousWorstAccuracy = nextWorstAccuracy;
                            diff = nextDiff;
                            currentRates.push(rate);
                        }
                        else {
                            currentRates.push(0);
                        }
                    };
                    for (var angle = 0; angle < angleResolution_1; ++angle) {
                        _loop_2(angle);
                    }
                    rates.push(currentRates);
                    ++wave;
                };
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
                    var next = ticks[0] + average +
                        (Calculate.sum(rates.map(function (currentRates, wave) {
                            return Calculate.sum(currentRates.map(function (rate, angle) { return 0 === rate ? 0 :
                                rate * calcLevel_1(angle, primeWaveLength_1 / Math.pow(Calculate.phi, wave / waveLenghResolution_1), regulatedIntervals_1.length); }));
                        })) * base_1);
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
                var tags = {};
                [
                    "@overall",
                    "@unoverall",
                    "@deleted",
                ].concat(Tag.get(pass))
                    .forEach(function (tag) { return tags[tag] = TagMember.getRaw(pass, tag); });
                var todos = TagMember.getRaw(pass, "@overall");
                var histories = {};
                todos
                    .forEach(function (todo) { return histories[todo] = History.get(pass, todo); });
                var json = {
                    specification: specification,
                    pass: pass,
                    todos: todos,
                    tags: tags,
                    histories: histories,
                };
                return JSON.stringify(json);
            };
            var Pass;
            (function (Pass) {
                Pass.key = "pass.list";
                Pass.get = function () { var _a; return (_a = minamo_js_1.minamo.localStorage.getOrNull(Pass.key)) !== null && _a !== void 0 ? _a : []; };
                Pass.set = function (passList) { return minamo_js_1.minamo.localStorage.set(Pass.key, passList); };
                Pass.add = function (pass) { return Pass.set(Pass.get().concat([pass]).filter(exports.uniqueFilter)); };
                Pass.remove = function (pass) { return Pass.set(Pass.get().filter(function (i) { return pass !== i; })); };
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
                Tag.isSystemTag = function (tag) { return tag.startsWith("@") && !tag.startsWith("@@"); };
                Tag.encode = function (tag) { return tag.replace(/^@/, "@@"); };
                Tag.decode = function (tag) { return tag.replace(/^@@/, "@"); };
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
                            return TagMember.getRaw(pass, tag).filter(function (i) { return deleted.indexOf(i) < 0; });
                    }
                };
                TagMember.set = function (pass, tag, list) {
                    return Storage.getStorage(pass).set(TagMember.makeKey(pass, tag), list);
                };
                TagMember.removeKey = function (pass, tag) { return Storage.getStorage(pass).remove(TagMember.makeKey(pass, tag)); };
                TagMember.add = function (pass, tag, todo) { return TagMember.set(pass, tag, TagMember.get(pass, tag).concat([todo]).filter(exports.uniqueFilter)); };
                TagMember.merge = function (pass, tag, list) { return TagMember.set(pass, tag, TagMember.get(pass, tag).concat(list).filter(exports.uniqueFilter)); };
                TagMember.remove = function (pass, tag, todo) { return TagMember.set(pass, tag, TagMember.get(pass, tag).filter(function (i) { return todo !== i; })); };
            })(TagMember = Storage.TagMember || (Storage.TagMember = {}));
            var Task;
            (function (Task) {
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
                        History.remove(pass, oldTask);
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
                History.remove = function (pass, task) {
                    return Storage.getStorage(pass).remove(History.makeKey(pass, task));
                };
                History.add = function (pass, task, tick) {
                    return History.set(pass, task, History.get(pass, task).concat(tick).filter(exports.uniqueFilter).sort(exports.simpleReverseComparer));
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
        })(Storage = CyclicToDo.Storage || (CyclicToDo.Storage = {}));
        var Domain;
        (function (Domain) {
            var _this = this;
            Domain.merge = function (pass, tag, todo, _ticks) {
                Storage.Pass.add(pass);
                Storage.Tag.add(pass, tag);
                Storage.TagMember.merge(pass, tag, todo);
                // const temp:{ [task:string]: number[]} = { };
                // todo.forEach(task => temp[task] = []);
                // ticks.forEach
                // (
                //     (tick, index) =>
                //     {
                //         if (null !== tick)
                //         {
                //             temp[todo[index % todo.length]].push(tick);
                //         }
                //     }
                // );
                // todo.forEach(task => Storage.History.add(pass, task, temp[task]));
            };
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
                    return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).substr(-2) + "-" + ("0" + date.getDate()).substr(-2) + " " + Domain.timeStringFromTick(tick - Domain.getTicks(date));
                }
            };
            Domain.timeStringFromTick = function (tick) {
                if (null === tick) {
                    return "N/A";
                }
                else if (tick < 0) {
                    return "-" + Domain.timeStringFromTick(-tick);
                }
                else {
                    var days = Math.floor(tick / (24 * 60));
                    var time = Math.floor(tick) % (24 * 60);
                    var hour = Math.floor(time / 60);
                    var minute = time % 60;
                    var timePart = ("00" + hour).slice(-2) + ":" + ("00" + minute).slice(-2);
                    return 10 <= days ?
                        days.toLocaleString() + " " + locale.map("days") :
                        0 < days ?
                            days.toLocaleString() + " " + locale.map("days") + " " + timePart :
                            timePart;
                }
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
                        if (Math.min(a.progress, b.progress) <= 1.0 / 3.0) {
                            if (a.progress < b.progress) {
                                return 1;
                            }
                            if (b.progress < a.progress) {
                                return -1;
                            }
                        }
                        var a_restTime = (a.RecentlySmartAverage + ((_a = a.RecentlyStandardDeviation) !== null && _a !== void 0 ? _a : 0) * 2.0) - a.elapsed;
                        var b_restTime = (b.RecentlySmartAverage + ((_b = b.RecentlyStandardDeviation) !== null && _b !== void 0 ? _b : 0) * 2.0) - b.elapsed;
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
            Domain.getToDoEntry = function (task, history) {
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
                    //expectedNext: Calculate.expectedNext(Storage.History.get(entry.pass, todo)),
                    elapsed: null,
                    overallAverage: history.recentries.length <= 1 ? null : calcAverage(history.recentries),
                    RecentlyStandardDeviation: history.recentries.length <= 1 ?
                        null :
                        history.recentries.length <= 2 ?
                            calcAverage(history.recentries) * 0.05 : // この値を標準偏差として代用
                            Calculate.standardDeviation(Calculate.intervals(history.recentries)),
                    count: history.count,
                    RecentlySmartAverage: history.recentries.length <= 1 ?
                        null :
                        calcAverage(history.recentries, 25),
                };
                return result;
            };
            Domain.updateProgress = function (item, now) {
                var _a, _b;
                if (now === void 0) { now = Domain.getTicks(); }
                if (0 < item.count) {
                    // todo の順番が前後にブレるのを避ける為、１分以内に複数の todo が done された場合、二つ目以降は +1 分ずつズレた時刻で打刻され( getDoneTicks() 関数の実装を参照 )、直後は素直に計算すると経過時間がマイナスになってしまうので、マイナスの場合はゼロにする。
                    item.elapsed = Math.max(0.0, now - item.previous);
                    if (null !== item.RecentlySmartAverage) {
                        item.progress = item.elapsed / (item.RecentlySmartAverage + ((_a = item.RecentlyStandardDeviation) !== null && _a !== void 0 ? _a : 0) * 2.0);
                        //item.decayedProgress = item.elapsed /(item.smartAverage +(item.standardDeviation ?? 0) *2.0);
                        var overrate = (item.elapsed - (item.RecentlySmartAverage + ((_b = item.RecentlyStandardDeviation) !== null && _b !== void 0 ? _b : 0) * 3.0)) / item.RecentlySmartAverage;
                        if (0.0 < overrate) {
                            //item.decayedProgress = 1.0 / (1.0 +Math.log2(1.0 +overrate));
                            item.progress = null;
                            item.RecentlySmartAverage = null;
                            item.RecentlyStandardDeviation = null;
                        }
                    }
                }
            };
            Domain.updateListProgress = function (entry, list, now) {
                var _a;
                if (now === void 0) { now = Domain.getTicks(); }
                list.forEach(function (item) { return Domain.updateProgress(item, now); });
                var sorted = JSON.parse(JSON.stringify(list)).sort(Domain.todoComparer1(entry));
                var defaultTodo = (_a = sorted.sort(Domain.todoComparer2(sorted))[0]) === null || _a === void 0 ? void 0 : _a.task;
                list.forEach(function (item) { return item.isDefault = defaultTodo === item.task; });
            };
        })(Domain = CyclicToDo.Domain || (CyclicToDo.Domain = {}));
        var Render;
        (function (Render) {
            var _this = this;
            Render.heading = function (tag, text) {
                return ({
                    tag: tag,
                    children: text,
                });
            };
            Render.backgroundLinerGradient = function (leftPercent, leftColor, rightColor) {
                return "background: linear-gradient(to right, " + leftColor + " " + leftPercent + ", " + rightColor + " " + leftPercent + ");";
            };
            Render.progressStyle = function (item) { return null === item.progress ?
                "background-color: rgba(128,128,128,0.4);" :
                1 <= item.progress ?
                    "background: #22884466;" :
                    Render.backgroundLinerGradient(item.progress.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 }), "#22884466", "rgba(128,128,128,0.2)"); };
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
            Render.prompt = function (message, _default) {
                return new Promise(function (resolve) { return resolve(window.prompt(message, _default)); });
            };
            Render.screenCover = function (onclick) {
                var dom = minamo_js_1.minamo.dom.make(HTMLDivElement)({
                    tag: "div",
                    className: "screen-cover",
                    onclick: function () {
                        minamo_js_1.minamo.dom.remove(dom);
                        onclick();
                    }
                });
                minamo_js_1.minamo.dom.appendChildren(document.body, dom);
            };
            Render.menuButton = function (menu) { return __awaiter(_this, void 0, void 0, function () {
                var popup, button, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            popup = minamo_js_1.minamo.dom.make(HTMLDivElement)({
                                tag: "div",
                                className: "menu-popup",
                                children: {
                                    tag: "div",
                                    className: "menu-popup-body",
                                    children: menu
                                },
                            });
                            _a = minamo_js_1.minamo.dom.make(HTMLButtonElement);
                            _b = {
                                tag: "button",
                                className: "menu-button"
                            };
                            return [4 /*yield*/, loadSvg("./ellipsis.1024.svg")];
                        case 1:
                            button = _a.apply(void 0, [(_b.children = [
                                    _c.sent(),
                                    {
                                        tag: "div",
                                        className: "screen-cover",
                                    },
                                    popup
                                ],
                                    _b)]);
                            return [2 /*return*/, button];
                    }
                });
            }); };
            Render.menuItem = function (children, onclick, className) {
                return ({
                    tag: "button",
                    className: className,
                    children: children,
                    eventListener: {
                        "mousedown": onclick,
                        "click": onclick,
                        "touchstart": onclick,
                    },
                });
            };
            Render.information = function (item) {
                return ({
                    tag: "div",
                    className: "task-information",
                    attributes: {
                        style: Render.progressStyle(item),
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
                                        Domain.timeStringFromTick(item.RecentlySmartAverage) :
                                        Domain.timeStringFromTick(Math.max(item.RecentlySmartAverage / 10, item.RecentlySmartAverage - (item.RecentlyStandardDeviation * 2.0))) + " \u301C " + Domain.timeStringFromTick(item.RecentlySmartAverage + (item.RecentlyStandardDeviation * 2.0)),
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
                                    children: Domain.timeStringFromTick(item.elapsed),
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
                                className: "task-header"
                            };
                            _c = [{
                                    tag: "a",
                                    className: "task-title",
                                    href: location.href.split("?")[0] + ("?pass=" + entry.pass + "&todo=" + item.task),
                                    children: item.task
                                }];
                            _d = {
                                tag: "div",
                                className: "task-operator"
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
                                                    window.alert("This is view mode. If this is your to-do list, open the original URL instead of the sharing URL. If this is not your to-do list, you can copy this to-do list from edit mode.\n"
                                                        + "\n"
                                                        + "これは表示モードです。これが貴方が作成したToDoリストならば、共有用のURLではなくオリジナルのURLを開いてください。これが貴方が作成したToDoリストでない場合、編集モードからこのToDoリストをコピーできます。");
                                                    return [3 /*break*/, 3];
                                                case 1:
                                                    Domain.done(entry.pass, item.task);
                                                    return [4 /*yield*/, Render.updateListScreen(entry)];
                                                case 2:
                                                    _a.sent();
                                                    _a.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); }
                                }];
                            return [4 /*yield*/, Render.menuButton([
                                    {
                                        tag: "button",
                                        children: "🚫 最後の完了を取り消す",
                                    },
                                    Render.menuItem("名前を編集", function () { return __awaiter(_this, void 0, void 0, function () {
                                        var newTask;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, Render.prompt("ToDo の名前を入力してください", item.task)];
                                                case 2:
                                                    newTask = (_a.sent()).trim();
                                                    if (!(0 < newTask.length && newTask !== item.task)) return [3 /*break*/, 5];
                                                    if (!Storage.Task.rename(entry.pass, item.task, newTask)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, Render.updateListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag) })];
                                                case 3:
                                                    _a.sent();
                                                    return [3 /*break*/, 5];
                                                case 4:
                                                    window.alert("その名前の ToDo は既に存在しています。");
                                                    _a.label = 5;
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    }); }),
                                    "@deleted" === entry.tag ?
                                        Render.menuItem("復元", function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        Storage.TagMember.remove(entry.pass, "@deleted", item.task);
                                                        return [4 /*yield*/, Render.updateListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag) })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }) :
                                        Render.menuItem("削除", function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        Storage.TagMember.add(entry.pass, "@deleted", item.task);
                                                        return [4 /*yield*/, Render.updateListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag) })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }),
                                ])];
                        case 1: return [2 /*return*/, (_a.children = [
                                (_b.children = _c.concat([
                                    (_d.children = _e.concat([
                                        _f.sent()
                                    ]),
                                        _d)
                                ]),
                                    _b),
                                // {
                                //     tag: "div",
                                //     className: "task-tags",
                                //     children: Storage.Tag.getByTodo(entry.pass, item.task).map
                                //     (
                                //         tag =>
                                //         ({
                                //             tag: "a",
                                //             className: "tag",
                                //             href: location.href.split("?")[0] +`?pass=${entry.pass}&tag=${tag}`,
                                //             children: Domain.tagMap(tag),
                                //         })
                                //     )
                                // },
                                Render.information(item)
                            ],
                                _a)];
                    }
                });
            }); };
            Render.tickItem = function (_pass, _item, tick) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, ({
                            tag: "div",
                            className: "tick-item flex-item  monospace",
                            children: Domain.dateStringFromTick(tick),
                        })];
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
                var _a, _b, _c, _d, _e, _f, _g;
                var _this = this;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "list-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = {
                                tag: "a",
                                href: "@overall" === entry.tag ? "./" : "./?pass=" + entry.pass + "&tag=@overall"
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _e = [
                                (_d.children = _h.sent(),
                                    _d),
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
                                                    return [3 /*break*/, 9];
                                                case 1: return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                                case 2:
                                                    _b.sent();
                                                    return [4 /*yield*/, Render.prompt("タグの名前を入力してください", "")];
                                                case 3:
                                                    newTag = _b.sent();
                                                    if (!(null === newTag)) return [3 /*break*/, 6];
                                                    return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                                case 4:
                                                    _b.sent();
                                                    return [4 /*yield*/, Render.updateListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag) })];
                                                case 5:
                                                    _b.sent();
                                                    return [3 /*break*/, 8];
                                                case 6:
                                                    tag_2 = Storage.Tag.encode(newTag.trim());
                                                    Storage.Tag.add(entry.pass, tag_2);
                                                    return [4 /*yield*/, Render.updateListScreen({ pass: entry.pass, tag: tag_2, todo: Storage.TagMember.get(entry.pass, tag_2) })];
                                                case 7:
                                                    _b.sent();
                                                    _b.label = 8;
                                                case 8: return [3 /*break*/, 11];
                                                case 9: return [4 /*yield*/, Render.updateListScreen({ pass: entry.pass, tag: tag, todo: Storage.TagMember.get(entry.pass, tag) })];
                                                case 10:
                                                    _b.sent();
                                                    _b.label = 11;
                                                case 11: return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                })
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Storage.Tag.isSystemTag(entry.tag) ? [] :
                                        Render.menuItem("名前を編集", function () { return __awaiter(_this, void 0, void 0, function () {
                                            var newTag;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, Render.prompt("タグの名前を入力してください", entry.tag)];
                                                    case 2:
                                                        newTag = _a.sent();
                                                        if (!(0 < newTag.length && newTag !== entry.tag)) return [3 /*break*/, 5];
                                                        if (!Storage.Tag.rename(entry.pass, entry.tag, newTag)) return [3 /*break*/, 4];
                                                        return [4 /*yield*/, Render.updateListScreen({ pass: entry.pass, tag: newTag, todo: Storage.TagMember.get(entry.pass, newTag) })];
                                                    case 3:
                                                        _a.sent();
                                                        return [3 /*break*/, 5];
                                                    case 4:
                                                        window.alert("その名前のタグは既に存在しています。");
                                                        _a.label = 5;
                                                    case 5: return [2 /*return*/];
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
                                            Render.menuItem("新しい ToDo", function () { return __awaiter(_this, void 0, void 0, function () {
                                                var newTask;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                                        case 1:
                                                            _a.sent();
                                                            return [4 /*yield*/, Render.prompt("ToDo の名前を入力してください")];
                                                        case 2:
                                                            newTask = _a.sent();
                                                            if (!(null !== newTask)) return [3 /*break*/, 4];
                                                            Storage.Task.add(entry.pass, newTask);
                                                            Storage.TagMember.add(entry.pass, entry.tag, newTask);
                                                            return [4 /*yield*/, Render.updateListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag) })];
                                                        case 3:
                                                            _a.sent();
                                                            _a.label = 4;
                                                        case 4: return [2 /*return*/];
                                                    }
                                                });
                                            }); }),
                                            {
                                                tag: "button",
                                                children: "🚫 リストをシェア",
                                            }
                                        ],
                                    Render.menuItem("エクスポート", function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, Render.updateExportScreen(entry.pass)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }),
                                ])];
                        case 2:
                            _f = [
                                _b.apply(void 0, _c.concat([_e.concat([
                                        _h.sent()
                                    ])]))
                            ];
                            _g = {
                                tag: "div",
                                className: "column-flex-list todo-list"
                            };
                            return [4 /*yield*/, Promise.all(list.map(function (item) { return Render.todoItem(entry, item); }))];
                        case 3: return [2 /*return*/, (_a.children = _f.concat([
                                (_g.children = _h.sent(),
                                    _g),
                                "@deleted" !== entry.tag ?
                                    {
                                        tag: "div",
                                        className: "button-list",
                                        children: {
                                            tag: "button",
                                            className: list.length <= 0 ? "default-button main-button long-button" : "main-button long-button",
                                            children: "新しい ToDo",
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
                                                            return [4 /*yield*/, Render.updateListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag) })];
                                                        case 2:
                                                            _a.sent();
                                                            _a.label = 3;
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); }
                                        },
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
                                            children: "ごみ箱は空です。",
                                        }
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.updateListScreen = function (entry) { return __awaiter(_this, void 0, void 0, function () {
                var list, lastUpdate, updateWindow, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = Domain.tagMap(entry.tag) + " " + applicationTitle;
                            list = entry.todo.map(function (task) { return Domain.getToDoEntry(task, Domain.getRecentlyHistory(entry.pass, task)); });
                            Domain.updateListProgress(entry, list);
                            list.sort(Domain.todoComparer1(entry));
                            list.sort(Domain.todoComparer2(list));
                            lastUpdate = Storage.lastUpdate;
                            updateWindow = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    Domain.updateListProgress(entry, list);
                                    if (lastUpdate === Storage.lastUpdate) {
                                        Array.from(document
                                            .getElementsByClassName("list-screen")[0]
                                            .getElementsByClassName("todo-list")[0].childNodes).forEach(function (dom, index) {
                                            var item = list[index];
                                            var button = dom.getElementsByClassName("task-operator")[0].getElementsByClassName("main-button")[0];
                                            button.classList.toggle("default-button", item.isDefault);
                                            var information = dom.getElementsByClassName("task-information")[0];
                                            information.setAttribute("style", Render.progressStyle(item));
                                            information.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0].innerText = Domain.timeStringFromTick(item.elapsed);
                                        });
                                    }
                                    else {
                                        Render.updateListScreen(entry);
                                    }
                                    return [2 /*return*/];
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
            Render.todoScreen = function (pass, item, ticks) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g;
                var _this = this;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "todo-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = {
                                tag: "a",
                                href: "./?pass=" + pass + "&tag=@overall"
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _e = [
                                (_d.children = _h.sent(),
                                    _d),
                                "" + item.task
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem("名前を編集", function () { return __awaiter(_this, void 0, void 0, function () {
                                        var newTask;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, Render.prompt("ToDo の名前を入力してください", item.task)];
                                                case 2:
                                                    newTask = (_a.sent()).trim();
                                                    if (!(0 < newTask.length && newTask !== item.task)) return [3 /*break*/, 5];
                                                    if (!Storage.Task.rename(pass, item.task, newTask)) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, Render.todoScreen(pass, Domain.getToDoEntry(newTask, Domain.getRecentlyHistory(pass, newTask)), Storage.History.get(pass, newTask))];
                                                case 3:
                                                    _a.sent();
                                                    return [3 /*break*/, 5];
                                                case 4:
                                                    window.alert("その名前の ToDo は既に存在しています。");
                                                    _a.label = 5;
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    }); }),
                                    0 <= Storage.TagMember.get(pass, "@deleted").indexOf(item.task) ?
                                        Render.menuItem("復元", function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        Storage.TagMember.remove(pass, "@deleted", item.task);
                                                        return [4 /*yield*/, Render.todoScreen(pass, Domain.getToDoEntry(item.task, Domain.getRecentlyHistory(pass, item.task)), Storage.History.get(pass, item.task))];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }) :
                                        Render.menuItem("削除", function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        Storage.TagMember.add(pass, "@deleted", item.task);
                                                        return [4 /*yield*/, Render.todoScreen(pass, Domain.getToDoEntry(item.task, Domain.getRecentlyHistory(pass, item.task)), Storage.History.get(pass, item.task))];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }),
                                    {
                                        tag: "button",
                                        children: "🚫 ToDo をシェア",
                                    },
                                    Render.menuItem("エクスポート", function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, Render.updateExportScreen(pass)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }),
                                ])];
                        case 2:
                            _f = [
                                _b.apply(void 0, _c.concat([_e.concat([
                                        _h.sent()
                                    ])])),
                                {
                                    tag: "div",
                                    className: "task-item",
                                    children: [
                                        {
                                            tag: "div",
                                            className: "task-tags",
                                            children: Storage.Tag.getByTodo(pass, item.task).map(function (tag) {
                                                return ({
                                                    tag: "a",
                                                    className: "tag",
                                                    href: location.href.split("?")[0] + ("?pass=" + pass + "&tag=" + tag),
                                                    children: Domain.tagMap(tag),
                                                });
                                            })
                                        },
                                        Render.information(item),
                                    ],
                                }
                            ];
                            _g = {
                                tag: "div",
                                className: "column-flex-list tick-list"
                            };
                            return [4 /*yield*/, Promise.all(ticks.map(function (tick) { return Render.tickItem(pass, item, tick); }))];
                        case 3: return [2 /*return*/, (_a.children = _f.concat([
                                (_g.children = _h.sent(),
                                    _g),
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
                                                            return [4 /*yield*/, Render.updateTodoScreen(pass, item.task)];
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
            Render.updateTodoScreen = function (pass, task) { return __awaiter(_this, void 0, void 0, function () {
                var item, lastUpdate, updateWindow, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = task + " " + applicationTitle;
                            item = Domain.getToDoEntry(task, Domain.getRecentlyHistory(pass, task));
                            Domain.updateProgress(item);
                            lastUpdate = Storage.lastUpdate;
                            updateWindow = function () { return __awaiter(_this, void 0, void 0, function () {
                                var dom, information_1;
                                return __generator(this, function (_a) {
                                    Domain.updateProgress(item);
                                    if (lastUpdate === Storage.lastUpdate) {
                                        dom = document
                                            .getElementsByClassName("todo-screen")[0]
                                            .getElementsByClassName("task-item")[0];
                                        information_1 = dom.getElementsByClassName("task-information")[0];
                                        information_1.setAttribute("style", Render.progressStyle(item));
                                        information_1.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0].innerText = Domain.timeStringFromTick(item.elapsed);
                                    }
                                    else {
                                        Render.updateTodoScreen(pass, task);
                                    }
                                    return [2 /*return*/];
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
                                            resolve(new DOMParser().parseFromString(request.responseText, "image/svg+xml").documentElement);
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
            Render.applicationIcon = function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "application-icon icon"
                            };
                            return [4 /*yield*/, loadSvg("./cyclictodohex.1024.svg")];
                        case 1: return [2 /*return*/, (_a.children = _b.sent(),
                                _a)];
                    }
                });
            }); };
            Render.welcomeScreen = function (_pass) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                var _this = this;
                return __generator(this, function (_f) {
                    switch (_f.label) {
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
                                _f.sent(),
                                "" + document.title
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem("GitHub", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, location.href = "https://github.com/wraith13/cyclic-todo/"];
                                    }); }); }),
                                ])];
                        case 2:
                            _e = [
                                _b.apply(void 0, _c.concat([_d.concat([
                                        _f.sent()
                                    ])])),
                                {
                                    tag: "div",
                                    style: "text-align: center; padding: 0.5rem;",
                                    children: "🚧 This static web application is under development. / この Static Web アプリは開発中です。",
                                }
                            ];
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 3: return [2 /*return*/, (_a.children = _e.concat([
                                _f.sent(),
                                {
                                    tag: "div",
                                    className: "button-list",
                                    children: Storage.Pass.get().map(function (pass) {
                                        return ({
                                            tag: "button",
                                            className: "default-button main-button long-button",
                                            children: "ToDo \u30EA\u30B9\u30C8 ( pass: " + pass.substr(0, 2) + "****" + pass.substr(-2) + " )",
                                            onclick: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, Render.updateListScreen({ pass: pass, tag: "@overall", todo: Storage.TagMember.get(pass, "@overall") })];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); },
                                        });
                                    }).concat({
                                        tag: "button",
                                        className: Storage.Pass.get().length <= 0 ? "default-button main-button long-button" : "main-button long-button",
                                        children: "\u65B0\u3057\u3044 ToDo \u30EA\u30B9\u30C8",
                                        onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                            var pass;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        pass = Storage.Pass.generate();
                                                        return [4 /*yield*/, Render.updateListScreen({ pass: pass, tag: "@overall", todo: Storage.TagMember.get(pass, "@overall") })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); },
                                    })
                                }
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.updateExportScreen = function (pass) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = applicationTitle;
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.exportScreen(pass)];
                        case 1:
                            _a.apply(void 0, [_b.sent(), function () { }]);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.exportScreen = function (pass) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                var _this = this;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "export-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            _d = {
                                tag: "a",
                                href: "./"
                            };
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _e = [
                                (_d.children = _f.sent(),
                                    _d),
                                "" + document.title
                            ];
                            return [4 /*yield*/, Render.menuButton([
                                    Render.menuItem("リストに戻る", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, Render.updateListScreen({ pass: pass, tag: "@overall", todo: Storage.TagMember.get(pass, "@overall") })];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); })
                                ])];
                        case 2: return [2 /*return*/, (_a.children = [
                                _b.apply(void 0, _c.concat([_e.concat([
                                        _f.sent()
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
            Render.updateWelcomeScreen = function (pass) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = applicationTitle;
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.welcomeScreen(pass)];
                        case 1:
                            _a.apply(void 0, [_b.sent(), function () { }]);
                            return [2 /*return*/];
                    }
                });
            }); };
            var updateWindowTimer = undefined;
            Render.showWindow = function (screen, updateWindow) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    Render.updateWindow = updateWindow;
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
                var maxColumns = Math.min(12, Math.max(minColumns, Math.floor(window.innerWidth / 390)));
                var minItemWidth = window.innerWidth;
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
                        var itemHeight = list.childNodes[0].offsetHeight - 0.5;
                        var columns = Math.min(maxColumns, Math.ceil(length / Math.max(1.0, Math.floor(height / itemHeight))));
                        var row = Math.max(Math.ceil(length / columns), Math.min(length, Math.floor(height / itemHeight)));
                        list.style.height = row * (itemHeight) + "px";
                        list.classList.add("max-column-" + columns);
                    }
                    var itemWidth = list.childNodes[0].offsetWidth;
                    if (itemWidth < minItemWidth) {
                        minItemWidth = itemWidth;
                    }
                });
                var FontRemUnit = parseFloat(getComputedStyle(document.documentElement).fontSize);
                var border = FontRemUnit * 26;
                minItemWidth -= 18; // padding & borer
                document.body.classList.toggle("locale-parallel-on", border < minItemWidth);
                document.body.classList.toggle("locale-parallel-off", minItemWidth <= border);
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
            var urlParams, hash, tag, todo, pass, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("start!!!");
                        urlParams = CyclicToDo.getUrlParams();
                        hash = CyclicToDo.getUrlHash();
                        tag = urlParams["tag"];
                        todo = urlParams["todo"];
                        pass = (_b = urlParams["pass"]) !== null && _b !== void 0 ? _b : Storage.sessionPassPrefix + ":" + new Date().getTime();
                        // const todo = JSON.parse(urlParams["todo"] ?? "null") as string[] | null;
                        // const history = JSON.parse(urlParams["history"] ?? "null") as (number | null)[] | null;
                        window.addEventListener('resize', Render.onWindowResize);
                        window.addEventListener('storage', Render.onUpdateStorage);
                        if (!(pass && todo)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Render.updateTodoScreen(pass, todo)];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        if (!(Storage.isSessionPass(pass) && !tag)) return [3 /*break*/, 6];
                        _a = hash;
                        return [3 /*break*/, 3];
                    case 3:
                        console.log("show welcome screen");
                        return [4 /*yield*/, Render.updateWelcomeScreen(pass)];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        //Domain.merge(pass, tag, todo, history);
                        switch (hash) {
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
                                Render.updateListScreen({ tag: tag, pass: pass, todo: Storage.TagMember.get(pass, tag) });
                                break;
                        }
                        _c.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); };
    })(CyclicToDo = exports.CyclicToDo || (exports.CyclicToDo = {}));
});
//# sourceMappingURL=index.js.map