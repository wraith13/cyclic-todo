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
                    core.arrayOrToArray(arg.children).forEach(function (i) { return element.appendChild(make(i)); });
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
    "expected interval": "expected interval",
    "elapsed time": "elapsed time",
    "count": "count",
    "Done": "Done"
});
define("lang.ja", [], {
    "previous": "前回",
    "expected interval": "予想間隔",
    "elapsed time": "経過時間",
    "count": "回数",
    "Done": "完了"
});
define("index", ["require", "exports", "minamo.js/index", "lang.en", "lang.ja"], function (require, exports, minamo_js_1, lang_en_json_1, lang_ja_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CyclicToDo = exports.Calculate = exports.localeParallel = exports.localeSingle = void 0;
    lang_en_json_1 = __importDefault(lang_en_json_1);
    lang_ja_json_1 = __importDefault(lang_ja_json_1);
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
        Calculate.average = function (ticks) { return ticks.reduce(function (a, b) { return a + b; }, 0) / ticks.length; };
        Calculate.standardDeviation = function (ticks, average) {
            if (average === void 0) { average = Calculate.average(ticks); }
            return Math.sqrt(Calculate.average(ticks.map(function (i) { return Math.pow((i - average), 2); })));
        };
        Calculate.standardScore = function (average, standardDeviation, target) {
            return (10 * (target - average) / standardDeviation) + 50;
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
            Storage.generatePass = function (seed) {
                if (seed === void 0) { seed = new Date().getTime(); }
                return ("" + ((seed * 13738217) ^ ((seed % 387960371999) >> 5))).slice(-8);
            };
            Storage.isSessionPass = function (pass) { return pass.startsWith(Storage.sessionPassPrefix); };
            Storage.getStorage = function (pass) { return Storage.isSessionPass(pass) ? minamo_js_1.minamo.sessionStorage : minamo_js_1.minamo.localStorage; };
            Storage.makeHistoryKey = function (pass, task) { return "pass:(" + pass + ").task:" + task + ".history"; };
            Storage.getHistory = function (pass, task) { var _a; return (_a = Storage.getStorage(pass).getOrNull(Storage.makeHistoryKey(pass, task))) !== null && _a !== void 0 ? _a : []; };
            Storage.setHistory = function (pass, task, list) {
                return Storage.getStorage(pass).set(Storage.makeHistoryKey(pass, task), list);
            };
            Storage.addHistory = function (pass, task, tick) {
                var list = Storage.getHistory(pass, task).concat(tick).filter(function (i, index, array) { return index === array.indexOf(i); });
                list.sort(Domain.simpleReverseComparer);
                Storage.setHistory(pass, task, list);
            };
            Storage.mergeHistory = function (pass, todo, ticks) {
                var temp = {};
                todo.forEach(function (task) { return temp[task] = []; });
                ticks.forEach(function (tick, index) {
                    if (null !== tick) {
                        temp[todo[index % todo.length]].push(tick);
                    }
                });
                todo.forEach(function (task) { return Storage.addHistory(pass, task, temp[task]); });
            };
        })(Storage = CyclicToDo.Storage || (CyclicToDo.Storage = {}));
        var Domain;
        (function (Domain) {
            var _this = this;
            Domain.makeTaskEntryComparer = function (todo) { return function (a, b) {
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
            Domain.simpleComparer = function (a, b) {
                if (a < b) {
                    return -1;
                }
                if (b < a) {
                    return 1;
                }
                return 0;
            };
            Domain.simpleReverseComparer = function (a, b) { return -Domain.simpleComparer(a, b); };
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
                    return date.toLocaleDateString() + " " + Domain.timeStringFromTick(tick - Domain.getTicks(date));
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
                    return 1000 <= days ?
                        "" + days.toLocaleString() :
                        0 < days ?
                            days.toLocaleString() + " " + timePart :
                            timePart;
                }
            };
            Domain.getLastTick = function (pass, task) { var _a; return (_a = Storage.getHistory(pass, task)[0]) !== null && _a !== void 0 ? _a : 0; };
            Domain.getToDoHistory = function (pass, todo) { return todo
                .map(function (task) { return Storage.getHistory(pass, task).map(function (tick) { return ({ task: task, tick: tick }); }); })
                .reduce(function (a, b) { return a.concat(b); }, [])
                .sort(Domain.makeTaskEntryComparer(todo)); };
            // export const getToDoEntries = (pass: string, todo: string[]) => todo
            //     .map(task => ({ task, tick: getLastTick(pass, task)}))
            //     .sort(makeTaskEntryComparer(todo));
            Domain.getDoneTicks = function (pass, key) {
                var _a;
                if (key === void 0) { key = "pass:(" + pass + ").last.done.ticks"; }
                return minamo_js_1.minamo.localStorage.set(key, Math.max((_a = minamo_js_1.minamo.localStorage.getOrNull(key)) !== null && _a !== void 0 ? _a : 0, Domain.getTicks() - 1) + 1);
            };
            Domain.done = function (pass, task) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, Storage.addHistory(pass, task, Domain.getDoneTicks(pass))];
            }); }); };
            var todoSorter = function (entry) { return function (a, b) {
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
                    var a_progress = a.decayedProgress;
                    var b_progress = 1 < b.count ? b.decayedProgress : 1.0 - (1.0 / Calculate.phi);
                    if (a_progress < b_progress) {
                        return 1;
                    }
                    if (b_progress < a_progress) {
                        return -1;
                    }
                }
                else if (1 < b.count) {
                    return -todoSorter(entry)(b, a);
                }
                if (1 === a.count && b.count) {
                    if (a.elapsed < b.elapsed) {
                        return 1;
                    }
                    if (b.elapsed < a.elapsed) {
                        return -1;
                    }
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
            }; };
            Domain.getRecentlyHistories = function (entry) {
                var histories = {};
                entry.todo.forEach(function (todo) {
                    var full = Storage.getHistory(entry.pass, todo);
                    histories[todo] =
                        {
                            recentries: full.filter(function (_, index) { return index < 25; }),
                            previous: full.length <= 0 ? null : full[0],
                            //average: full.length <= 1 ? null: (full[0] -full[full.length -1]) / (full.length -1),
                            count: full.length,
                        };
                });
                return histories;
            };
            Domain.calculateTitleRecentrlyAverage = function (entry, histories) {
                var titleRecentrly = entry.todo.map(function (todo) { return histories[todo].recentries; }).reduce(function (a, b) { return a.concat(b); }, []).sort(Domain.simpleReverseComparer);
                return titleRecentrly.length <= 1 ? null : (titleRecentrly[0] - titleRecentrly[titleRecentrly.length - 1]) / (titleRecentrly.length - 1);
            };
            Domain.getToDoEntries = function (entry, histories, titleRecentrlyAverage, now) {
                if (now === void 0) { now = Domain.getTicks(); }
                var firstStageRecentries = entry.todo.map(function (todo) { return histories[todo]; }).filter(function (history) { return 1 === history.count; }).map(function (history) { return history.recentries[0]; }).sort(Domain.simpleReverseComparer);
                var firstStage = {
                    nones: entry.todo.map(function (todo) { return histories[todo]; }).filter(function (history) { return 0 === history.count; }).length,
                    singles: firstStageRecentries.length,
                    average: firstStageRecentries.length <= 1 ? null : (firstStageRecentries[0] - firstStageRecentries[firstStageRecentries.length - 1]) / (firstStageRecentries.length - 1),
                    standardDeviation: firstStageRecentries.length <= 1 ? null : Calculate.standardDeviation(firstStageRecentries),
                };
                var secondStageTarget = entry.todo.map(function (todo) { return histories[todo]; }).filter(function (history) { return 2 <= history.count && history.count <= 5; });
                var secondStageRecentries = secondStageTarget.map(function (history) { return history.recentries; }).reduce(function (a, b) { return a.concat(b); }, []).sort(Domain.simpleReverseComparer);
                var secondStage = {
                    average: secondStageRecentries.length <= 1 ? null : (secondStageRecentries[0] - secondStageRecentries[secondStageRecentries.length - 1]) / (secondStageRecentries.length - 1) * secondStageTarget.length,
                    standardDeviation: secondStageRecentries.length <= 1 ? null : Calculate.standardDeviation(secondStageRecentries),
                };
                var list = entry.todo.map(function (todo) {
                    var history = histories[todo];
                    var result = {
                        todo: todo,
                        isDefault: false,
                        progress: null,
                        decayedProgress: null,
                        previous: history.previous,
                        elapsed: null,
                        average: history.recentries.length <= 1 ? null : (history.recentries[0] - history.recentries[history.recentries.length - 1]) / (history.recentries.length - 1),
                        standardDeviation: history.recentries.length <= 1 ?
                            null :
                            (5 < history.recentries.length || null === secondStage.standardDeviation) ?
                                Calculate.standardDeviation(history.recentries) :
                                Calculate.average([Calculate.standardDeviation(history.recentries), secondStage.standardDeviation]),
                        count: history.count,
                        smartAverage: null,
                    };
                    return result;
                });
                list.forEach(function (item) {
                    var history = histories[item.todo];
                    if (0 < history.count) {
                        // todo の順番が前後にブレるのを避ける為、１分以内に複数の todo が done された場合、二つ目以降は +1 分ずつズレた時刻で打刻され( getDoneTicks() 関数の実装を参照 )、直後は素直に計算すると経過時間がマイナスになってしまうので、マイナスの場合はゼロにする。
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
                    }
                });
                Domain.updateProgress(entry, list, titleRecentrlyAverage, now);
                list.sort(todoSorter(entry));
                console.log(list); // これは消さない！！！
                return list;
            };
            Domain.updateProgress = function (entry, list, titleRecentrlyAverage, now) {
                if (now === void 0) { now = Domain.getTicks(); }
                list.forEach(function (item) {
                    var _a, _b, _c;
                    if (0 < item.count) {
                        // todo の順番が前後にブレるのを避ける為、１分以内に複数の todo が done された場合、二つ目以降は +1 分ずつズレた時刻で打刻され( getDoneTicks() 関数の実装を参照 )、直後は素直に計算すると経過時間がマイナスになってしまうので、マイナスの場合はゼロにする。
                        item.elapsed = Math.max(0.0, now - item.previous);
                        if (null !== item.smartAverage) {
                            item.progress = item.elapsed / (item.smartAverage + ((_a = item.standardDeviation) !== null && _a !== void 0 ? _a : 0));
                            item.decayedProgress = item.elapsed / (item.smartAverage + ((_b = item.standardDeviation) !== null && _b !== void 0 ? _b : 0));
                            if (null !== titleRecentrlyAverage) {
                                var overrate = (item.elapsed - (item.smartAverage + ((_c = item.standardDeviation) !== null && _c !== void 0 ? _c : 0))) / titleRecentrlyAverage;
                                if (0.0 < overrate) {
                                    item.decayedProgress = 1.0 / (1.0 + Math.log2(1.0 + overrate));
                                    item.progress = null;
                                    item.smartAverage = null;
                                    item.standardDeviation = null;
                                }
                            }
                        }
                    }
                });
                var defaultTodo = JSON.parse(JSON.stringify(list)).sort(todoSorter(entry))[0].todo;
                list.forEach(function (item) { return item.isDefault = defaultTodo === item.todo; });
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
                undefined :
                1 <= item.progress ?
                    "background: #22884455" :
                    Render.backgroundLinerGradient(Math.pow(item.progress, 0.8).toLocaleString("en", { style: "percent" }), "#22884466", "rgba(128,128,128,0.2)"); };
            Render.label = function (label) {
                return ({
                    tag: "span",
                    className: "label",
                    children: locale.parallel(label),
                });
            };
            Render.information = function (item) {
                return ({
                    tag: "div",
                    className: null === item.progress ? "task-information no-progress" : "task-information",
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
                                    className: "value",
                                    children: Domain.dateStringFromTick(item.previous),
                                }
                            ],
                        },
                        {
                            tag: "div",
                            className: "task-interval-average",
                            children: [
                                Render.label("expected interval"),
                                {
                                    tag: "span",
                                    className: "value",
                                    children: null === item.standardDeviation ?
                                        Domain.timeStringFromTick(item.smartAverage) :
                                        Domain.timeStringFromTick(Math.max(item.smartAverage / 10, item.smartAverage - item.standardDeviation)) + " \u301C " + Domain.timeStringFromTick(item.smartAverage + item.standardDeviation),
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
                                    className: "value",
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
                                Render.label("count"),
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
            Render.todoItem = function (entry, item) {
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
                                    children: locale.parallel("Done"),
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
                                                    Domain.done(entry.pass, item.todo);
                                                    return [4 /*yield*/, Render.updateTodoScreen(entry)];
                                                case 2:
                                                    _a.sent();
                                                    _a.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
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
                        Render.information(item),
                    ],
                });
            };
            Render.todoScreen = function (entry, list) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "todo-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1: return [2 /*return*/, (_a.children = [
                                _b.apply(void 0, _c.concat([[_d.sent(), "" + document.title]])),
                                {
                                    tag: "div",
                                    className: "flex-list",
                                    children: list.map(function (item) { return Render.todoItem(entry, item); }),
                                }
                            ],
                                _a)];
                    }
                });
            }); };
            var updateTodoScreenTimer = undefined;
            Render.updateTodoScreen = function (entry) { return __awaiter(_this, void 0, void 0, function () {
                var histories, titleRecentrlyAverage, list, _a, _b, _c;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            document.title = entry.title + " " + applicationTitle;
                            if (undefined !== updateTodoScreenTimer) {
                                clearInterval(updateTodoScreenTimer);
                            }
                            histories = Domain.getRecentlyHistories(entry);
                            titleRecentrlyAverage = Domain.calculateTitleRecentrlyAverage(entry, histories);
                            list = Domain.getToDoEntries(entry, histories, titleRecentrlyAverage);
                            _b = (_a = minamo_js_1.minamo.dom).replaceChildren;
                            _c = [
                                //document.getElementById("screen"),
                                document.body];
                            return [4 /*yield*/, Render.todoScreen(entry, list)];
                        case 1:
                            _b.apply(_a, _c.concat([_d.sent()]));
                            Render.onWindowResize();
                            updateTodoScreenTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            if (!(0 < document.getElementsByClassName("todo-screen").length)) return [3 /*break*/, 2];
                                            Domain.updateProgress(entry, list, titleRecentrlyAverage);
                                            _b = (_a = minamo_js_1.minamo.dom).replaceChildren;
                                            _c = [
                                                //document.getElementById("screen"),
                                                document.body];
                                            return [4 /*yield*/, Render.todoScreen(entry, list)];
                                        case 1:
                                            _b.apply(_a, _c.concat([_d.sent()]));
                                            Render.onWindowResize();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            clearInterval(updateTodoScreenTimer);
                                            updateTodoScreenTimer = undefined;
                                            _d.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, Domain.TimeAccuracy);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.editScreen = function (title, pass, todo) {
                var titleDiv = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                    tag: "input",
                    className: "edit-title-input",
                    value: title,
                });
                var passDiv = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                    tag: "input",
                    className: "edit-pass-input",
                    children: Storage.isSessionPass(pass) ? Storage.generatePass() : pass,
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
                                Render.updateTodoScreen({
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
            Render.updateEditScreen = function (title, pass, todo) { return minamo_js_1.minamo.dom.replaceChildren(
            //document.getElementById("screen"),
            document.body, Render.editScreen(title, pass, todo)); };
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
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
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
                                _b.apply(void 0, _c.concat([[_e.sent(), "" + document.title]]))
                            ];
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 2: return [2 /*return*/, (_a.children = _d.concat([
                                _e.sent()
                            ]),
                                _a)];
                    }
                });
            }); };
            Render.updateWelcomeScreen = function (pass) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            document.title = applicationTitle;
                            _b = (_a = minamo_js_1.minamo.dom).replaceChildren;
                            _c = [
                                //document.getElementById("screen"),
                                document.body];
                            return [4 /*yield*/, Render.welcomeScreen(pass)];
                        case 1:
                            _b.apply(_a, _c.concat([_d.sent()]));
                            return [2 /*return*/];
                    }
                });
            }); };
            var screen = [
                Render.heading("h1", document.title),
                {
                    tag: "a",
                    className: "github",
                    children: "GitHub",
                    href: "https://github.com/wraith13/cyclic-todo"
                },
            ];
            Render.showWindow = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, minamo_js_1.minamo.dom.appendChildren(document.body, screen)];
                });
            }); };
            Render.onWindowResize = function () {
                var minColumns = 1 + Math.floor(window.innerWidth / 780);
                var maxColumns = Math.max(minColumns, Math.floor(window.innerWidth / 390));
                Array.from(document.getElementsByClassName("flex-list")).forEach(function (list) {
                    var length = list.childNodes.length;
                    if (length <= 1 || maxColumns <= 1) {
                        list.style.height = undefined;
                    }
                    else {
                        var itemHeight = list.childNodes[0].offsetHeight;
                        var row = 1;
                        if (minColumns < length) {
                            var colums = Math.min(maxColumns, Math.max(minColumns, Math.ceil(length / Math.max(1.0, (window.innerHeight - 100) / itemHeight))));
                            row = Math.ceil(length / colums);
                        }
                        list.style.height = row * (itemHeight - 1) + "px";
                    }
                });
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
            var urlParams, hash, title, pass, todo, history, _a;
            var _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        console.log("start!!!");
                        urlParams = CyclicToDo.getUrlParams();
                        hash = CyclicToDo.getUrlHash();
                        title = (_b = urlParams["title"]) !== null && _b !== void 0 ? _b : "untitled";
                        pass = (_c = urlParams["pass"]) !== null && _c !== void 0 ? _c : Storage.sessionPassPrefix + ":" + new Date().getTime();
                        todo = JSON.parse((_d = urlParams["todo"]) !== null && _d !== void 0 ? _d : "null");
                        history = JSON.parse((_e = urlParams["history"]) !== null && _e !== void 0 ? _e : "null");
                        window.addEventListener('resize', Render.onWindowResize);
                        return [4 /*yield*/, Render.showWindow()];
                    case 1:
                        _h.sent();
                        if (!(((_f = todo === null || todo === void 0 ? void 0 : todo.length) !== null && _f !== void 0 ? _f : 0) <= 0)) return [3 /*break*/, 6];
                        _a = hash;
                        switch (_a) {
                            case "edit": return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("show edit screen");
                        Render.updateEditScreen(title, pass, []);
                        return [3 /*break*/, 5];
                    case 3:
                        console.log("show welcome screen");
                        return [4 /*yield*/, Render.updateWelcomeScreen(pass)];
                    case 4:
                        _h.sent();
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        if (0 < ((_g = history === null || history === void 0 ? void 0 : history.length) !== null && _g !== void 0 ? _g : 0)) {
                            Storage.mergeHistory(pass, todo, history);
                        }
                        switch (hash) {
                            case "edit":
                                console.log("show edit screen");
                                Render.updateEditScreen(title, pass, todo);
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
                                Render.updateTodoScreen({ title: title, pass: pass, todo: todo });
                                break;
                        }
                        _h.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); };
    })(CyclicToDo = exports.CyclicToDo || (exports.CyclicToDo = {}));
});
//# sourceMappingURL=index.js.map