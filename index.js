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
exports.CyclicToDo = exports.Slack = void 0;
var minamo_js_1 = require("./minamo.js");
var Slack;
(function (Slack) {
    var _this = this;
    Slack.authorize = function (application, user_scope, redirect_uri) {
        return location.href = "https://slack.com/oauth/v2/authorize?client_id=" + application.client_id + "&user_scope=" + user_scope.join(",") + "&redirect_uri=" + redirect_uri;
    };
    Slack.oauthV2Access = function (application, code, redirect_uri) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, minamo_js_1.minamo.http.getJson("https://slack.com/api/oauth.v2.access?client_id=" + application.client_id + "&client_secret=" + application.client_secret + "&code=" + code + "&redirect_uri=" + redirect_uri)];
    }); }); };
    Slack.usersInfo = function (token, user) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, minamo_js_1.minamo.http.getJson("https://slack.com/api/users.info?token=" + token + "&user=" + user)];
    }); }); };
    Slack.teamInfo = function (token) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, minamo_js_1.minamo.http.getJson("https://slack.com/api/team.info?token=" + token)];
    }); }); };
    Slack.channelsList = function (token) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, minamo_js_1.minamo.http.getJson("https://slack.com/api/channels.list?token=" + token)];
    }); }); };
    Slack.emojiList = function (token, limit) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, minamo_js_1.minamo.http.getJson("https://slack.com/api/emoji.list?token=" + token + "&limit=" + limit)];
    }); }); };
    Slack.chatPostMessage = function (token, data) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, minamo_js_1.minamo.http.postJson("https://slack.com/api/chat.postMessage", JSON.stringify(data), { Authorization: "Bearer " + token })];
        });
    }); };
    Slack.usersProfileSet = function (token, data) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, minamo_js_1.minamo.http.postJson("https://slack.com/api/users.profile.set", JSON.stringify(data), { Authorization: "Bearer " + token })];
        });
    }); };
})(Slack = exports.Slack || (exports.Slack = {}));
var CyclicToDo;
(function (CyclicToDo) {
    var _this = this;
    CyclicToDo.user_scope = [
        "users.profile:write",
        "chat:write",
        "channels:read",
        "team:read",
        "emoji:read",
        "users:read",
    ];
    CyclicToDo.redirect_uri = location.href.replace(/\?.*/, "");
    var getCurrentApplication = function () { return minamo_js_1.minamo.localStorage.getOrNull("current-application"); };
    var setCurrentApplication = function (application) { return minamo_js_1.minamo.localStorage.set("current-application", application); };
    var getApplicationList = function () { var _a; return (_a = minamo_js_1.minamo.localStorage.getOrNull("application-list")) !== null && _a !== void 0 ? _a : []; };
    var setApplicationList = function (list) { return minamo_js_1.minamo.localStorage.set("application-list", list); };
    var addApplication = function (item) { return setApplicationList([item].concat(removeApplication(item))); };
    var removeApplication = function (item) { return setApplicationList(getApplicationList().filter(function (i) { return i.name !== item.name || i.client_id !== item.client_id || i.client_secret !== item.client_secret; })); };
    var getIdentityList = function () { var _a; return (_a = minamo_js_1.minamo.localStorage.getOrNull("identities")) !== null && _a !== void 0 ? _a : []; };
    var setIdentityList = function (list) { return minamo_js_1.minamo.localStorage.set("identities", list); };
    var addIdentity = function (item) { return setIdentityList([item].concat(removeIdentity(item))); };
    var removeIdentity = function (item) { return setIdentityList(getIdentityList().filter(function (i) { return i.user.id !== item.user.id || i.team.id !== item.team.id; })); };
    var getHistory = function (user) { var _a; return (_a = minamo_js_1.minamo.localStorage.getOrNull("user:" + user + ".history")) !== null && _a !== void 0 ? _a : []; };
    var setHistory = function (user, list) { return minamo_js_1.minamo.localStorage.set("user:" + user + ".history", list); };
    var addHistory = function (item) { return setHistory(item.user, [item].concat(getHistory(item.user)
        .filter(function (i) { return JSON.stringify(i) !== JSON.stringify(item); }))); };
    var getIdentity = function (id) { return getIdentityList().filter(function (i) { return i.user.id === id; })[0]; };
    var execute = function (item) { return __awaiter(_this, void 0, void 0, function () {
        var token, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = getIdentity(item.user).token;
                    _a = item.api;
                    switch (_a) {
                        case "chatPostMessage": return [3 /*break*/, 1];
                        case "usersProfileSet": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, Slack.chatPostMessage(token, item.data)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, Slack.usersProfileSet(token, item.data)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5:
                    addHistory(item);
                    return [2 /*return*/, null];
            }
        });
    }); };
    var dom;
    (function (dom) {
        var _this = this;
        var renderIcon = function (icon) {
            return ({
                tag: "img",
                src: icon.image_original ||
                    icon["image_" + Object.keys(icon)
                        .filter(function (i) { return /image_\d+/.test(i); })
                        .map(function (i) { return parseInt(i.replace(/^image_/, "")); })
                        .reduce(function (a, b) { return a < b ? b : a; }, 0)],
            });
        };
        var renderHeading = function (tag, text) {
            return ({
                tag: tag,
                children: text,
            });
        };
        var renderUser = function (user) {
            return ({
                tag: "div",
                className: "user",
                children: [
                    renderIcon(user.profile),
                    {
                        tag: "span",
                        className: "real_name",
                        children: user.real_name
                    },
                    {
                        tag: "span",
                        className: "name",
                        children: user.name
                    },
                ],
            });
        };
        var renderTeam = function (team) {
            return ({
                tag: "div",
                className: "team",
                children: [
                    renderIcon(team.icon),
                    {
                        tag: "span",
                        className: "name",
                        children: team.name,
                    },
                    {
                        tag: "span",
                        className: "domain",
                        children: team.domain,
                    },
                ],
            });
        };
        var renderIdentity = function (identity) {
            return ({
                tag: "div",
                className: "identity",
                children: [
                    renderTeam(identity.team),
                    renderUser(identity.user),
                ]
            });
        };
        var renderItemCore = function (item) {
            switch (item.api) {
                case "chatPostMessage":
                    return JSON.stringify(item);
                case "usersProfileSet":
                    return JSON.stringify(item);
            }
            return JSON.stringify(item);
        };
        var renderItem = function (item) {
            return ({
                tag: "div",
                className: "item",
                children: [
                    renderIdentity(getIdentity(item.user)),
                    renderItemCore(item),
                ],
                onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, execute(item)];
                            case 1:
                                _a.sent();
                                dom.updateIdentityList();
                                return [2 /*return*/];
                        }
                    });
                }); },
            });
        };
        var renderPostMessageForm = function (identity) {
            var channel = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                tag: "input",
                className: "post-message-channel",
            });
            var text = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                tag: "input",
                className: "post-message-text",
            });
            return minamo_js_1.minamo.dom.make(HTMLDivElement)({
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
                            channel,
                        ],
                    },
                    {
                        tag: "label",
                        children: [
                            {
                                tag: "span",
                                children: "text",
                            },
                            text,
                        ],
                    },
                    {
                        tag: "button",
                        children: "Post",
                        onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, execute({
                                            user: identity.user.id,
                                            api: "chatPostMessage",
                                            data: { channel: channel.value, text: text.value },
                                        })];
                                    case 1:
                                        _a.sent();
                                        dom.updateIdentityList();
                                        return [2 /*return*/];
                                }
                            });
                        }); }
                    },
                ]
            });
        };
        var renderSetStatusForm = function (identity) {
            var status_emoji = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                tag: "input",
                className: "application-name",
            });
            var status_text = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                tag: "input",
                className: "application-client-id",
            });
            var status_expiration = minamo_js_1.minamo.dom.make(HTMLInputElement)({
                tag: "input",
                className: "application-client-secret",
            });
            return minamo_js_1.minamo.dom.make(HTMLDivElement)({
                tag: "div",
                className: "application-form",
                children: [
                    {
                        tag: "label",
                        children: [
                            {
                                tag: "span",
                                children: "emoji",
                            },
                            status_emoji,
                        ],
                    },
                    {
                        tag: "label",
                        children: [
                            {
                                tag: "span",
                                children: "text",
                            },
                            status_text,
                        ],
                    },
                    {
                        tag: "label",
                        children: [
                            {
                                tag: "span",
                                children: "expiration",
                            },
                            status_expiration,
                        ],
                    },
                    {
                        tag: "button",
                        children: "Apply",
                        onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, execute({
                                            user: identity.user.id,
                                            api: "usersProfileSet",
                                            data: {
                                                status_emoji: status_emoji.value,
                                                status_text: status_text.value,
                                                status_expiration: parseInt(status_expiration.value),
                                            },
                                        })];
                                    case 1:
                                        _a.sent();
                                        dom.updateIdentityList();
                                        return [2 /*return*/];
                                }
                            });
                        }); }
                    },
                ]
            });
        };
        var identityList = minamo_js_1.minamo.dom.make(HTMLDivElement)({});
        dom.updateIdentityList = function () { return minamo_js_1.minamo.dom.replaceChildren(identityList, getIdentityList().map(function (i) {
            return [
                renderHeading("h2", [
                    renderIdentity(i),
                    {
                        tag: "button",
                        className: "sub",
                        children: "\u2026",
                        onclick: function () {
                            if (window.confirm("🗑 Remove this user?")) {
                                removeIdentity(i);
                                dom.updateIdentityList();
                            }
                        },
                    }
                ]),
                renderHeading("h3", "Post Message"),
                renderPostMessageForm(i),
                renderHeading("h3", "Set Status"),
                renderSetStatusForm(i),
                renderHeading("h3", "History"),
                getHistory(i.user.id).map(renderItem),
            ];
        })); };
        var applicationList = minamo_js_1.minamo.dom.make(HTMLDivElement)({});
        dom.updateApplicationList = function () { return minamo_js_1.minamo.dom.replaceChildren(applicationList, getApplicationList().map(function (i) {
            return [
                {
                    tag: "div",
                    children: [
                        {
                            tag: "button",
                            children: "OAuth by " + i.name + " API Key",
                            onclick: function () {
                                setCurrentApplication(i);
                                Slack.authorize(i, CyclicToDo.user_scope, CyclicToDo.redirect_uri);
                            },
                        },
                        {
                            tag: "button",
                            className: "sub",
                            children: "\u2026",
                            onclick: function () {
                                if (window.confirm("🗑 Remove this application?")) {
                                    removeApplication(i);
                                    dom.updateApplicationList();
                                }
                            },
                        },
                    ]
                }
            ];
        })); };
        var applicationName = minamo_js_1.minamo.dom.make(HTMLInputElement)({
            tag: "input",
            className: "application-name",
        });
        var applicationClientId = minamo_js_1.minamo.dom.make(HTMLInputElement)({
            tag: "input",
            className: "application-client-id",
        });
        var applicationClientSecret = minamo_js_1.minamo.dom.make(HTMLInputElement)({
            tag: "input",
            className: "application-client-secret",
        });
        var applicationForm = minamo_js_1.minamo.dom.make(HTMLDivElement)({
            tag: "div",
            className: "application-form",
            children: [
                {
                    tag: "label",
                    children: [
                        {
                            tag: "span",
                            children: "name",
                        },
                        applicationName,
                    ],
                },
                {
                    tag: "label",
                    children: [
                        {
                            tag: "span",
                            children: "client_id",
                        },
                        applicationClientId,
                    ],
                },
                {
                    tag: "label",
                    children: [
                        {
                            tag: "span",
                            children: "client_secret",
                        },
                        applicationClientSecret,
                    ],
                },
                {
                    tag: "button",
                    children: "Add",
                    onclick: function () {
                        addApplication({
                            name: applicationName.value,
                            client_id: applicationClientId.value,
                            client_secret: applicationClientSecret.value,
                        });
                        dom.updateApplicationList();
                        applicationName.value = "";
                        applicationClientId.value = "";
                        applicationClientSecret.value = "";
                    }
                },
            ]
        });
        var screen = [
            renderHeading("h1", document.title),
            {
                tag: "a",
                className: "github",
                children: "GitHub",
                href: "https://github.com/wraith13/slac-fixed-phrase"
            },
            dom.updateIdentityList(),
            renderHeading("h2", "Register User"),
            dom.updateApplicationList(),
            renderHeading("h2", "Register API Key"),
            renderHeading("h3", "Requirement"),
            {
                tag: "dl",
                children: [
                    {
                        tag: "dt",
                        children: "Redirect URLs",
                    },
                    {
                        tag: "dd",
                        children: CyclicToDo.redirect_uri,
                    },
                    {
                        tag: "dt",
                        children: "User Token Scopes",
                    },
                    {
                        tag: "dd",
                        children: {
                            tag: "ul",
                            children: CyclicToDo.user_scope.map(function (i) {
                                return ({
                                    tag: "li",
                                    children: i
                                });
                            })
                        }
                    },
                ],
            },
            applicationForm,
        ];
        dom.showScreen = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, minamo_js_1.minamo.dom.appendChildren(document.body, screen)];
            });
        }); };
    })(dom = CyclicToDo.dom || (CyclicToDo.dom = {}));
    CyclicToDo.start = function () { return __awaiter(_this, void 0, void 0, function () {
        var code, application, result, token, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    code = (_c = location.href.replace(/.*\?/, "").split("&").find(function (i) { return /^code=/.test(i); })) === null || _c === void 0 ? void 0 : _c.replace(/^code=/, "");
                    application = getCurrentApplication();
                    if (!(application && code)) return [3 /*break*/, 4];
                    return [4 /*yield*/, Slack.oauthV2Access(application, code, CyclicToDo.redirect_uri)];
                case 1:
                    result = _d.sent();
                    token = result.authed_user.access_token;
                    _a = addIdentity;
                    _b = {};
                    return [4 /*yield*/, Slack.usersInfo(token, result.authed_user.id)];
                case 2:
                    _b.user = (_d.sent()).user;
                    return [4 /*yield*/, Slack.teamInfo(token)];
                case 3:
                    _a.apply(void 0, [(_b.team = (_d.sent()).team,
                            _b.token = token,
                            _b)]);
                    dom.updateIdentityList();
                    history.replaceState(null, document.title, CyclicToDo.redirect_uri);
                    _d.label = 4;
                case 4: return [4 /*yield*/, dom.showScreen()];
                case 5:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); };
})(CyclicToDo = exports.CyclicToDo || (exports.CyclicToDo = {}));
//# sourceMappingURL=index.js.map