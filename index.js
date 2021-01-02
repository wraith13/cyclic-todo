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
    "expected interval": "expected interval",
    "elapsed time": "elapsed time",
    "count": "count",
    "Done": "Done",
    "days": "days",
    "@overall": "Overall",
    "@unoverall": "Excluded in the Overall",
    "@untagged": "Untagged",
    "@new": "New tag"
});
define("lang.ja", [], {
    "previous": "前回",
    "expected interval": "予想間隔",
    "elapsed time": "経過時間",
    "count": "回数",
    "Done": "完了",
    "days": "日",
    "@overall": "総合",
    "@unoverall": "総合から除外",
    "@untagged": "タグ付けされてない",
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
    exports.simpleComparer = function (a, b) {
        if (a < b) {
            return -1;
        }
        if (b < a) {
            return 1;
        }
        return 0;
    };
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
        Calculate.average = function (ticks) { return ticks.length <= 0 ?
            null :
            ticks.reduce(function (a, b) { return a + b; }, 0) / ticks.length; };
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
            var Pass;
            (function (Pass) {
                Pass.key = "pass.list";
                Pass.get = function () { var _a; return (_a = minamo_js_1.minamo.localStorage.getOrNull(Pass.key)) !== null && _a !== void 0 ? _a : []; };
                Pass.set = function (passList) { return minamo_js_1.minamo.localStorage.set(Pass.key, passList); };
                Pass.add = function (pass) { return Pass.set(Pass.get().concat([pass]).filter(exports.uniqueFilter)); };
                Pass.remove = function (pass) { return Pass.set(Pass.get().filter(function (i) { return pass !== i; })); };
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
            })(Tag = Storage.Tag || (Storage.Tag = {}));
            var TagMember;
            (function (TagMember) {
                TagMember.makeKey = function (pass, tag) { return "pass:(" + pass + ").tag:(" + tag + ")"; };
                TagMember.getRaw = function (pass, tag) { var _a; return (_a = Storage.getStorage(pass).getOrNull(TagMember.makeKey(pass, tag))) !== null && _a !== void 0 ? _a : []; };
                TagMember.get = function (pass, tag) {
                    switch (tag) {
                        case "@overall":
                            {
                                var unoverall_1 = TagMember.getRaw(pass, "@unoverall");
                                return TagMember.getRaw(pass, "@overall").filter(function (i) { return unoverall_1.indexOf(i) < 0; });
                            }
                        case "@untagged":
                            {
                                var tagged_1 = Tag.get(pass).map(function (tag) { return TagMember.get(pass, tag); }).reduce(function (a, b) { return a.concat(b); }, []);
                                return TagMember.getRaw(pass, "@overall").filter(function (i) { return tagged_1.indexOf(i) < 0; });
                            }
                        case "@unoverall":
                        default:
                            return TagMember.getRaw(pass, tag);
                    }
                };
                TagMember.set = function (pass, tag, list) {
                    return Storage.getStorage(pass).set(TagMember.makeKey(pass, tag), list);
                };
                TagMember.add = function (pass, tag, todo) { return TagMember.set(pass, tag, TagMember.get(pass, tag).concat([todo]).filter(exports.uniqueFilter)); };
                TagMember.merge = function (pass, tag, list) { return TagMember.set(pass, tag, TagMember.get(pass, tag).concat(list).filter(exports.uniqueFilter)); };
                TagMember.remove = function (pass, tag, todo) { return TagMember.set(pass, tag, TagMember.get(pass, tag).filter(function (i) { return todo !== i; })); };
            })(TagMember = Storage.TagMember || (Storage.TagMember = {}));
            var History;
            (function (History) {
                History.makeKey = function (pass, task) { return "pass:(" + pass + ").task:" + task + ".history"; };
                History.get = function (pass, task) { var _a; return (_a = Storage.getStorage(pass).getOrNull(History.makeKey(pass, task))) !== null && _a !== void 0 ? _a : []; };
                History.set = function (pass, task, list) {
                    return Storage.getStorage(pass).set(History.makeKey(pass, task), list);
                };
                History.add = function (pass, task, tick) {
                    return History.set(pass, task, History.get(pass, task).concat(tick).filter(exports.uniqueFilter).sort(exports.simpleReverseComparer));
                };
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
                    return 10 <= days ?
                        days.toLocaleString() + " d" :
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
            Domain.todoSorter = function (entry) {
                return function (a, b) {
                    var _a, _b;
                    if (null !== a.progress && null !== b.progress) {
                        if (Math.abs(a.elapsed - b.elapsed) <= 12 * 60) {
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
                        if (a.progress * Calculate.phi <= 1.0 || b.progress * Calculate.phi <= 1.0) {
                            if (a.progress < b.progress) {
                                return 1;
                            }
                            if (b.progress < a.progress) {
                                return -1;
                            }
                        }
                        var a_restTime = (a.smartAverage + ((_a = a.standardDeviation) !== null && _a !== void 0 ? _a : 0) * 2.0) - a.elapsed;
                        var b_restTime = (b.smartAverage + ((_b = b.standardDeviation) !== null && _b !== void 0 ? _b : 0) * 2.0) - b.elapsed;
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
                    var aTodoIndex = entry.todo.indexOf(a.todo);
                    var bTodoIndex = entry.todo.indexOf(a.todo);
                    if (0 <= aTodoIndex && 0 <= bTodoIndex) {
                        if (aTodoIndex < bTodoIndex) {
                            return 1;
                        }
                        if (bTodoIndex < aTodoIndex) {
                            return -1;
                        }
                    }
                    if (a.todo < b.todo) {
                        return 1;
                    }
                    if (b.todo < a.todo) {
                        return -1;
                    }
                    return 0;
                };
            };
            Domain.getRecentlyHistories = function (entry) {
                var histories = {};
                entry.todo.forEach(function (todo) {
                    var full = Storage.History.get(entry.pass, todo);
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
            Domain.getToDoEntries = function (entry, histories) { return entry.todo.map(function (todo) {
                var history = histories[todo];
                var result = {
                    todo: todo,
                    isDefault: false,
                    progress: null,
                    decayedProgress: null,
                    previous: history.previous,
                    elapsed: null,
                    average: history.recentries.length <= 1 ? null : (history.recentries[0] - history.recentries[history.recentries.length - 1]) / (history.recentries.length - 1),
                    standardDeviation: history.recentries.length <= 2 ?
                        null :
                        Calculate.standardDeviation(Calculate.intervals(history.recentries)),
                    count: history.count,
                    smartAverage: history.recentries.length <= 1 ?
                        null :
                        (((history.recentries[0] - history.recentries[Math.min(5, history.recentries.length) - 1]) / (Math.min(5, history.recentries.length) - 1))
                            + ((history.recentries[0] - history.recentries[Math.min(25, history.recentries.length) - 1]) / (Math.min(25, history.recentries.length) - 1))) / 2,
                };
                return result;
            }); };
            Domain.updateProgress = function (entry, list, now) {
                var _a;
                if (now === void 0) { now = Domain.getTicks(); }
                list.forEach(function (item) {
                    var _a, _b, _c;
                    if (0 < item.count) {
                        // todo の順番が前後にブレるのを避ける為、１分以内に複数の todo が done された場合、二つ目以降は +1 分ずつズレた時刻で打刻され( getDoneTicks() 関数の実装を参照 )、直後は素直に計算すると経過時間がマイナスになってしまうので、マイナスの場合はゼロにする。
                        item.elapsed = Math.max(0.0, now - item.previous);
                        if (null !== item.smartAverage) {
                            item.progress = item.elapsed / (item.smartAverage + ((_a = item.standardDeviation) !== null && _a !== void 0 ? _a : 0) * 2.0);
                            item.decayedProgress = item.elapsed / (item.smartAverage + ((_b = item.standardDeviation) !== null && _b !== void 0 ? _b : 0) * 2.0);
                            var overrate = (item.elapsed - (item.smartAverage + ((_c = item.standardDeviation) !== null && _c !== void 0 ? _c : 0) * 3.0)) / item.smartAverage;
                            if (0.0 < overrate) {
                                item.decayedProgress = 1.0 / (1.0 + Math.log2(1.0 + overrate));
                                item.progress = null;
                                item.smartAverage = null;
                                item.standardDeviation = null;
                            }
                        }
                    }
                });
                var defaultTodo = (_a = JSON.parse(JSON.stringify(list)).sort(Domain.todoSorter(entry))[0]) === null || _a === void 0 ? void 0 : _a.todo;
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
                "background-color: rgba(128,128,128,0.4);" :
                1 <= item.progress ?
                    "background: #22884466;" :
                    Render.backgroundLinerGradient(item.progress.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 }), "#22884466", "rgba(128,128,128,0.2)"); };
            Render.label = function (label) {
                return ({
                    tag: "span",
                    className: "label",
                    children: locale.parallel(label),
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
                                        Domain.timeStringFromTick(Math.max(item.smartAverage / 10, item.smartAverage - (item.standardDeviation * 2.0))) + " \u301C " + Domain.timeStringFromTick(item.smartAverage + (item.standardDeviation * 2.0)),
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
                                    tag: "div",
                                    className: "task-title",
                                    children: item.todo,
                                }];
                            _d = {
                                tag: "div",
                                className: "task-operator"
                            };
                            _e = [{
                                    tag: "button",
                                    className: item.isDefault ? "default-button main-button" : "main-button",
                                    children: locale.parallel("Done"),
                                    //children: locale.map("Done"),
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
                                }];
                            return [4 /*yield*/, Render.menuButton([
                                    {
                                        tag: "button",
                                        children: "最後の完了を取り消す",
                                    },
                                    Render.menuItem("名前を編集", function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, Render.prompt("ToDo の名前を入力してください", item.todo)];
                                                case 2:
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
                                Render.information(item)
                            ],
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
            Render.todoScreen = function (entry, list) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _a = {
                                tag: "div",
                                className: "todo-screen screen"
                            };
                            _b = Render.heading;
                            _c = ["h1"];
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 1:
                            _d = [
                                _g.sent(),
                                Render.dropDownLabel({
                                    list: exports.makeObject(["@overall"].concat(Storage.Tag.get(entry.pass)).concat(["@unoverall", "@untagged", "@new"])
                                        .map(function (i) { return ({ key: i, value: Domain.tagMap(i), }); })),
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
                                                    return [4 /*yield*/, Render.updateTodoScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag) })];
                                                case 5:
                                                    _b.sent();
                                                    return [3 /*break*/, 8];
                                                case 6:
                                                    tag_2 = Storage.Tag.encode(newTag.trim());
                                                    Storage.Tag.add(entry.pass, tag_2);
                                                    return [4 /*yield*/, Render.updateTodoScreen({ pass: entry.pass, tag: tag_2, todo: Storage.TagMember.get(entry.pass, tag_2) })];
                                                case 7:
                                                    _b.sent();
                                                    _b.label = 8;
                                                case 8: return [3 /*break*/, 11];
                                                case 9: return [4 /*yield*/, Render.updateTodoScreen({ pass: entry.pass, tag: tag, todo: Storage.TagMember.get(entry.pass, tag) })];
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
                                    {
                                        tag: "button",
                                        children: "リストを更新",
                                        onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                console.log("リストを更新");
                                                return [2 /*return*/];
                                            });
                                        }); }
                                    },
                                    Render.menuItem("名前を編集", function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, Render.prompt("リストの名前を入力してください", entry.tag)];
                                                case 2:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }),
                                    {
                                        tag: "button",
                                        children: "リストを編集",
                                    },
                                    Render.menuItem("ToDoを追加", function () { return __awaiter(_this, void 0, void 0, function () {
                                        var newTodo;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, minamo_js_1.minamo.core.timeout(500)];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, Render.prompt("ToDo の名前を入力してください")];
                                                case 2:
                                                    newTodo = _a.sent();
                                                    if (!(null !== newTodo)) return [3 /*break*/, 4];
                                                    Storage.TagMember.remove(entry.pass, "@deleted", newTodo);
                                                    Storage.TagMember.add(entry.pass, "@overall", newTodo);
                                                    Storage.TagMember.add(entry.pass, entry.tag, newTodo);
                                                    return [4 /*yield*/, Render.updateTodoScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag) })];
                                                case 3:
                                                    _a.sent();
                                                    _a.label = 4;
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); }),
                                    {
                                        tag: "button",
                                        children: "リストをシェア",
                                    }
                                ])];
                        case 2:
                            _e = [
                                _b.apply(void 0, _c.concat([_d.concat([
                                        _g.sent()
                                    ])]))
                            ];
                            _f = {
                                tag: "div",
                                className: "column-flex-list todo-list"
                            };
                            return [4 /*yield*/, Promise.all(list.map(function (item) { return Render.todoItem(entry, item); }))];
                        case 3: return [2 /*return*/, (_a.children = _e.concat([
                                (_f.children = _g.sent(),
                                    _f)
                            ]),
                                _a)];
                    }
                });
            }); };
            var updateTodoScreenTimer = undefined;
            Render.updateTodoScreen = function (entry) { return __awaiter(_this, void 0, void 0, function () {
                var histories, list, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            document.title = Domain.tagMap(entry.tag) + " " + applicationTitle;
                            if (undefined !== updateTodoScreenTimer) {
                                clearInterval(updateTodoScreenTimer);
                            }
                            histories = Domain.getRecentlyHistories(entry);
                            list = Domain.getToDoEntries(entry, histories);
                            Domain.updateProgress(entry, list);
                            list.sort(Domain.todoSorter(entry));
                            console.log({ histories: histories, list: list }); // これは消さない！！！
                            _a = Render.showWindow;
                            return [4 /*yield*/, Render.todoScreen(entry, list)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            Render.resizeFlexList();
                            updateTodoScreenTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (0 < document.getElementsByClassName("todo-screen").length) {
                                        Domain.updateProgress(entry, list);
                                        Array.from(document
                                            .getElementsByClassName("todo-screen")[0]
                                            .getElementsByClassName("todo-list")[0].childNodes).forEach(function (dom, index) {
                                            var item = list[index];
                                            var button = dom.getElementsByClassName("task-operator")[0].getElementsByClassName("main-button")[0];
                                            button.classList.toggle("default-button", item.isDefault);
                                            var information = dom.getElementsByClassName("task-information")[0];
                                            information.setAttribute("style", Render.progressStyle(item));
                                            information.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0].innerText = Domain.timeStringFromTick(item.elapsed);
                                        });
                                        // showWindow(await todoScreen(entry, list));
                                        // resizeFlexList();
                                    }
                                    else {
                                        clearInterval(updateTodoScreenTimer);
                                        updateTodoScreenTimer = undefined;
                                    }
                                    return [2 /*return*/];
                                });
                            }); }, Domain.TimeAccuracy);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.editScreen = function (tag, pass, todo) {
                var tagDiv = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                    tag: "input",
                    className: "edit-tag-input",
                    value: tag,
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
                                tagDiv,
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
                            className: "default-button",
                            children: "save",
                            onclick: function () {
                                Render.updateTodoScreen({
                                    tag: tagDiv.value,
                                    pass: passDiv.value,
                                    todo: todoDom.value.split("\n").map(function (i) { return i.trim(); })
                                });
                            }
                        },
                    ]
                };
                return result;
            };
            Render.updateEditScreen = function (tag, pass, todo) {
                return Render.showWindow(Render.editScreen(tag, pass, todo));
            };
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
                            return [4 /*yield*/, Render.menuButton("ポップアップメニュー")];
                        case 2:
                            _e = [
                                _b.apply(void 0, _c.concat([_d.concat([
                                        _f.sent()
                                    ])]))
                            ];
                            return [4 /*yield*/, Render.applicationIcon()];
                        case 3: return [2 /*return*/, (_a.children = _e.concat([
                                _f.sent()
                            ]),
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
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            }); };
            Render.showWindow = function (screen) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, minamo_js_1.minamo.dom.replaceChildren(document.getElementById("body"), screen)];
                });
            }); };
            Render.resizeFlexList = function () {
                var minColumns = 1 + Math.floor(window.innerWidth / 780);
                var maxColumns = Math.max(minColumns, Math.floor(window.innerWidth / 390));
                Array.from(document.getElementsByClassName("column-flex-list")).forEach(function (list) {
                    var length = list.childNodes.length;
                    if (length <= 1 || maxColumns <= 1) {
                        list.style.height = undefined;
                    }
                    else {
                        var height = window.innerHeight - list.offsetTop;
                        var itemHeight = list.childNodes[0].offsetHeight;
                        var columns = Math.min(maxColumns, Math.ceil(length / Math.max(1.0, Math.floor(height / itemHeight))));
                        var row = Math.max(Math.ceil(length / columns), Math.floor(height / itemHeight));
                        console.log({ "window.innerHeight": window.innerHeight, "list.offsetTop": list.offsetTop, height: height, itemHeight: itemHeight, columns: columns, row: row });
                        list.style.height = row * (itemHeight - 1) + "px";
                    }
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
            var urlParams, hash, tag, pass, todo, history, _a;
            var _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        console.log("start!!!");
                        urlParams = CyclicToDo.getUrlParams();
                        hash = CyclicToDo.getUrlHash();
                        tag = (_b = urlParams["title"]) !== null && _b !== void 0 ? _b : "untitled";
                        pass = (_c = urlParams["pass"]) !== null && _c !== void 0 ? _c : Storage.sessionPassPrefix + ":" + new Date().getTime();
                        todo = JSON.parse((_d = urlParams["todo"]) !== null && _d !== void 0 ? _d : "null");
                        history = JSON.parse((_e = urlParams["history"]) !== null && _e !== void 0 ? _e : "null");
                        window.addEventListener('resize', Render.onWindowResize);
                        if (!(((_f = todo === null || todo === void 0 ? void 0 : todo.length) !== null && _f !== void 0 ? _f : 0) <= 0)) return [3 /*break*/, 5];
                        _a = hash;
                        switch (_a) {
                            case "edit": return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 2];
                    case 1:
                        console.log("show edit screen");
                        Render.updateEditScreen(tag, pass, []);
                        return [3 /*break*/, 4];
                    case 2:
                        console.log("show welcome screen");
                        return [4 /*yield*/, Render.updateWelcomeScreen(pass)];
                    case 3:
                        _g.sent();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        Domain.merge(pass, tag, todo, history);
                        switch (hash) {
                            case "edit":
                                console.log("show edit screen");
                                Render.updateEditScreen(tag, pass, todo);
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
                                Render.updateTodoScreen({ tag: tag, pass: pass, todo: todo });
                                break;
                        }
                        _g.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
    })(CyclicToDo = exports.CyclicToDo || (exports.CyclicToDo = {}));
});
//# sourceMappingURL=index.js.map