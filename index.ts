import { minamo } from "./minamo.js";
export module CyclicToDo
{
    export const TimeAccuracy = 100000;
    export const getTicks = (date: Date = new Date()) => Math.floor(date.getTime() / TimeAccuracy);
    export const DateFromTick = (tick: number) => new Date(tick *TimeAccuracy);
    export const getHistory = (task: string): number[] => minamo.localStorage.getOrNull<number[]>(`task:${task}.history`) ?? [];
    export const setHistory = (task: string, list: number[]) => minamo.localStorage.set(`task:${task}.history`, list);
    export const addHistory = (task: string, tick: number | number[]) =>
    {
        const list = getHistory(task).concat(tick).filter((i, index, array) => index === array.indexOf(i));
        list.sort
        (
            (a, b) =>
            {
                if (a < b)
                {
                    return 1;
                }
                if (b < a)
                {
                    return -1;
                }
                return 0;
            }
        );
        setHistory(task, list);
    };
    export const getLastTick = (task: string) => getHistory(task)[0];
    export const getToDoHistory = (todo: string[]) => todo
        .map(task => getHistory(task).map(tick => ({ task, tick})))
        .reduce((a, b) => a.concat(b), [])
        .sort
        (
            (a, b) =>
            {
                if (a.tick < b.tick)
                {
                    return 1;
                }
                if (b.tick < a.tick)
                {
                    return -1;
                }
                if (a.task < b.task)
                {
                    return 1;
                }
                if (b.task < a.task)
                {
                    return -1;
                }
                return 0;
            }
        );
    export const done = async (task: string) => addHistory(task, getTicks());
    export module dom
    {
        const renderHeading = ( tag: string, text: minamo.dom.Source ) =>
        ({
            tag,
            children: text,
        });
        const renderUser = (user: Slack.User) =>
        ({
            tag: "div",
            className: "user",
            children:
            [
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
        const renderTeam = (team: Slack.Team) =>
        ({
            tag: "div",
            className: "team",
            children:
            [
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
        const renderIdentity = (identity: Identity) =>
        ({
            tag: "div",
            className: "identity",
            children:
            [
                renderTeam(identity.team),
                renderUser(identity.user),
            ]
        });
        const renderItemCore = (item: HistoryItem) =>
        {
            switch(item.api)
            {
            case "chatPostMessage":
                return JSON.stringify(item);
            case "usersProfileSet":
                return JSON.stringify(item);
            }
            return JSON.stringify(item);
        };
        const renderItem = (item: HistoryItem) =>
        ({
            tag: "div",
            className: "item",
            children:
            [
                renderIdentity(getIdentity(item.user)),
                renderItemCore(item),
            ],
            onclick: async () =>
            {
                await execute(item);
                updateIdentityList();
            },
        });
        const renderPostMessageForm = (identity: Identity) =>
        {
            const channel = minamo.dom.make(HTMLInputElement)
            ({
                tag: "input",
                className: "post-message-channel",
            });
            const text = minamo.dom.make(HTMLInputElement)
            ({
                tag: "input",
                className: "post-message-text",
            });
            return minamo.dom.make(HTMLDivElement)
            ({
                tag: "div",
                className: "application-form",
                children:
                [
                    {
                        tag: "label",
                        children:
                        [
                            {
                                tag: "span",
                                children: "channel",
                            },
                            channel,
                        ],
                    },
                    {
                        tag: "label",
                        children:
                        [
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
                        onclick: async () =>
                        {
                            await execute
                            ({
                                user: identity.user.id,
                                api: "chatPostMessage",
                                data: { channel: channel.value, text: text.value},
                            });
                            updateIdentityList();
                        }
                    },
                ]
            });
        };
        const renderSetStatusForm = (identity: Identity) =>
        {
            const status_emoji = minamo.dom.make(HTMLInputElement)
            ({
                tag: "input",
                className: "application-name",
            });
            const status_text = minamo.dom.make(HTMLInputElement)
            ({
                tag: "input",
                className: "application-client-id",
            });
            const status_expiration = minamo.dom.make(HTMLInputElement)
            ({
                tag: "input",
                className: "application-client-secret",
            });
            return minamo.dom.make(HTMLDivElement)
            ({
                tag: "div",
                className: "application-form",
                children:
                [
                    {
                        tag: "label",
                        children:
                        [
                            {
                                tag: "span",
                                children: "emoji",
                            },
                            status_emoji,
                        ],
                    },
                    {
                        tag: "label",
                        children:
                        [
                            {
                                tag: "span",
                                children: "text",
                            },
                            status_text,
                        ],
                    },
                    {
                        tag: "label",
                        children:
                        [
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
                        onclick: async () =>
                        {
                            await execute
                            ({
                                user: identity.user.id,
                                api: "usersProfileSet",
                                data:
                                {
                                    status_emoji: status_emoji.value,
                                    status_text: status_text.value,
                                    status_expiration: parseInt(status_expiration.value),
                                },
                            });
                            updateIdentityList();
                        }
                    },
                ]
            });
        };
        const identityList = minamo.dom.make(HTMLDivElement)({ });
        export const updateIdentityList = () => minamo.dom.replaceChildren
        (
            identityList,
            getIdentityList().map
            (
                i =>
                [
                    renderHeading
                    (
                        "h2",
                        [
                            renderIdentity(i),
                            {
                                tag: "button",
                                className: "sub",
                                children: `…`,
                                onclick: () =>
                                {
                                    if (window.confirm("🗑 Remove this user?"))
                                    {
                                        removeIdentity(i);
                                        updateIdentityList();
                                    }
                                },
                            }
                        ]
                    ),
                    renderHeading ( "h3", "Post Message" ),
                    renderPostMessageForm(i),
                    renderHeading ( "h3", "Set Status" ),
                    renderSetStatusForm(i),
                    renderHeading ( "h3", "History" ),
                    getHistory(i.user.id).map(renderItem),
                ],
            )
        );
        const applicationList = minamo.dom.make(HTMLDivElement)({ });
        export const updateApplicationList = () => minamo.dom.replaceChildren
        (
            applicationList,
            getApplicationList().map
            (
                i =>
                [
                    {
                        tag: "div",
                        children:
                        [
                            {
                                tag: "button",
                                children: `OAuth by ${i.name} API Key`,
                                onclick: () =>
                                {
                                    setCurrentApplication(i);
                                    Slack.authorize(i, user_scope, redirect_uri);
                                },
                            },
                            {
                                tag: "button",
                                className: "sub",
                                children: `…`,
                                onclick: () =>
                                {
                                    if (window.confirm("🗑 Remove this application?"))
                                    {
                                        removeApplication(i);
                                        updateApplicationList();
                                    }
                                },
                            },
                        ]
                    }
                ],
            )
        );
        const applicationName = minamo.dom.make(HTMLInputElement)
        ({
            tag: "input",
            className: "application-name",
        });
        const applicationClientId = minamo.dom.make(HTMLInputElement)
        ({
            tag: "input",
            className: "application-client-id",
        });
        const applicationClientSecret = minamo.dom.make(HTMLInputElement)
        ({
            tag: "input",
            className: "application-client-secret",
        });
        const applicationForm = minamo.dom.make(HTMLDivElement)
        ({
            tag: "div",
            className: "application-form",
            children:
            [
                {
                    tag: "label",
                    children:
                    [
                        {
                            tag: "span",
                            children: "name",
                        },
                        applicationName,
                    ],
                },
                {
                    tag: "label",
                    children:
                    [
                        {
                            tag: "span",
                            children: "client_id",
                        },
                        applicationClientId,
                    ],
                },
                {
                    tag: "label",
                    children:
                    [
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
                    onclick: () =>
                    {
                        addApplication
                        ({
                            name: applicationName.value,
                            client_id: applicationClientId.value,
                            client_secret: applicationClientSecret.value,
                        });
                        updateApplicationList();
                        applicationName.value = "";
                        applicationClientId.value = "";
                        applicationClientSecret.value = "";
                    }
                },
            ]
        });
        const screen =
        [
            renderHeading ( "h1", document.title ),
            {
                tag: "a",
                className: "github",
                children: "GitHub",
                href: "https://github.com/wraith13/slac-fixed-phrase"
            },
            updateIdentityList(),
            renderHeading ( "h2", `Register User` ),
            updateApplicationList(),
            renderHeading ( "h2", `Register API Key` ),
            renderHeading ( "h3", `Requirement` ),
            {
                tag: "dl",
                children:
                [
                    {
                        tag: "dt",
                        children: "Redirect URLs",
                    },
                    {
                        tag: "dd",
                        children: redirect_uri,
                    },
                    {
                        tag: "dt",
                        children: "User Token Scopes",
                    },
                    {
                        tag: "dd",
                        children:
                        {
                            tag: "ul",
                            children: user_scope.map
                            (
                                i =>
                                ({
                                    tag: "li",
                                    children: i
                                })
                            )
                        }
                    },
                ],
            },
            applicationForm,
        ];
        export const showWindow = async ( ) => minamo.dom.appendChildren
        (
            document.body,
            screen
        );
    }
    export const getUrlParams = (key: string) =>
    {
        const raw = location.href
            .replace(/.*\?/, "")
            .replace(/#.*/, "")
            .split("&").
            find(i => new RegExp(`^${key}=`).test(i))
            ?.replace(new RegExp(`^${key}=`), "");
        if (null !== raw && undefined !== raw)
        {
            return decodeURIComponent(raw);
        }
        return null;
    };
    export const makeUrl =
    (
        args: {[key: string]: string},
        hash: string = location.href.replace(/[^#]*#?/, ""),
        href: string = location.href
    ) =>
        href
            .replace(/\?.*/, "")
            .replace(/#.*/, "")
            +"?"
            +Object.keys(args).map(i => `${i}=${encodeURIComponent(args[i])}`).join("&")
            +`#${hash}`;
    export const start = async ( ) =>
    {
        const todo = getUrlParams("todo");
        const history = getUrlParams("history");
        await dom.showWindow();
    };
}
