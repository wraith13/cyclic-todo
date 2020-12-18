import { minamo } from "./minamo.js";
export module Slack
{
    export interface Application
    {
        client_id: string;
        client_secret: string;
    }
    export type AppId = string;
    export type UserId = string;
    export type TeamId = string;
    export type ChannelId = string;
    export type BotId = string;
    export type AccessToken = string;
    export type UnixTime = number;
    export interface AuthedUser
    {
        id: UserId;
        scope: string;
        access_token: string;
        token_type: string;
    }
    export interface Icon
    {
        image_24?: string;
        image_32?: string;
        image_34?: string;
        image_44?: string;
        image_48?: string;
        image_68?: string;
        image_72?: string;
        image_88?: string;
        image_102?: string;
        image_132?: string;
        image_192?: string;
        image_230?: string;
        image_512?: string;
        image_original?: string;
    }
    export interface Team
    {
        id: TeamId;
        name: string;
        domain: string;
        email_domain: string;
        icon: Icon;
    }
    export interface Label
    {
        value: string;
        creator: UserId;
        last_set: UnixTime;
    }
    export interface Channel
    {
        id: ChannelId;
        name: string;
        is_channel: true;
        created: UnixTime;
        is_archived: boolean;
        is_general: boolean;
        unlinked: number;
        creator: UserId;
        name_normalized: string;
        is_shared: boolean;
        is_org_shared: boolean;
        is_member: boolean;
        is_private: boolean;
        is_mpim: boolean;
        members: UserId[];
        topic: Label;
        purpose: Label;
        previous_names: string[];
        num_members: number;
    }
    export interface Status
    {
        status_text: string;
        status_emoji: string;
        status_expiration: UnixTime;
    }
    export interface Profile extends Status, Icon
    {
        avatar_hash: string;
        real_name: string;
        display_name: string;
        real_name_normalized: string;
        display_name_normalized: string;
        email: string;
        team: TeamId;
    }
    export interface User
    {
        id: UserId;
        team_id: TeamId;
        name: string;
        deleted: boolean;
        color: string;
        real_name: string;
        tz: string;
        tz_label: string;
        tz_offset: number;
        profile: Profile;
        is_admin: boolean;
        is_owner: boolean;
        is_primary_owner: boolean;
        is_restricted: boolean;
        is_ultra_restricted: boolean;
        is_bot: boolean;
        is_app_user: boolean;
        updated: UnixTime;
        has_2fa: boolean;
    }
    export const authorize =
    (
        application: Application,
        user_scope: string[],
        redirect_uri: string
    ) =>
        location.href = `https://slack.com/oauth/v2/authorize?client_id=${ application.client_id }&user_scope=${ user_scope.join ( "," ) }&redirect_uri=${ redirect_uri }`;
    export const oauthV2Access =
        async (
            application: Application,
            code: string,
            redirect_uri: string
        ):
        Promise<{
            ok: boolean,
            app_id: AppId,
            authed_user: AuthedUser,
            team:
            {
                id: TeamId,
                name: string,
            },
            enterprise: unknown,
        }> =>
        minamo.http.getJson ( `https://slack.com/api/oauth.v2.access?client_id=${ application.client_id }&client_secret=${ application.client_secret }&code=${ code }&redirect_uri=${ redirect_uri }` );
    export const usersInfo = async ( token: AccessToken, user: UserId ): Promise<{ ok: boolean, user: User }> =>
    minamo.http.getJson ( `https://slack.com/api/users.info?token=${ token }&user=${ user }` );
    export const teamInfo = async ( token: AccessToken ): Promise<{ ok: boolean, team: Team }> =>
        minamo.http.getJson ( `https://slack.com/api/team.info?token=${ token }` );
    export const channelsList = async ( token: AccessToken ): Promise<{ ok: boolean, channels: Channel[] }> =>
        minamo.http.getJson ( `https://slack.com/api/channels.list?token=${ token }`);
    export const emojiList = async ( token: AccessToken, limit: string ): Promise<{ ok: boolean, emoji: { [name: string]: string } }> =>
        minamo.http.getJson ( `https://slack.com/api/emoji.list?token=${ token }&limit=${ limit }` );
    export const chatPostMessage = async (
            token: AccessToken,
            data:
            {
                channel: ChannelId,
                text: string,
            }
        ):
        Promise<{
            ok: boolean,
            channel: ChannelId,
            ts: string,
            message:
            {
                bot_id: BotId,
                type: string,
                text: string,
                user: UserId,
                ts: string,
                team: TeamId,
                bot_profile:
                {
                    id: BotId,
                    deleted: boolean,
                    name: string,
                    updated: UnixTime,
                    app_id: AppId,
                    icons: Icon,
                    team_id: TeamId,
                }
            },
        }> =>
        minamo.http.postJson
        (
            `https://slack.com/api/chat.postMessage`,
            JSON.stringify ( data ),
            { Authorization: `Bearer ${token}` }
        );
    export const usersProfileSet = async (
            token: AccessToken,
            data: { profile: Status, }
        ):
        Promise<{
            ok: boolean,
            username: string,
            profile: Profile,
        }> =>
        minamo.http.postJson
        (
            `https://slack.com/api/users.profile.set`,
            JSON.stringify ( data ),
            { Authorization: `Bearer ${token}` }
        );
}
export module CyclicToDo
{
    export const user_scope =
    [
        "users.profile:write",
        "chat:write",
        "channels:read",
        "team:read",
        "emoji:read",
        "users:read",
    ];
    export const redirect_uri = location.href.replace(/\?.*/, "");
    export interface Application extends Slack.Application
    {
        name: string;
    }
    export interface Identity
    {
        user: Slack.User;
        team: Slack.Team;
        token: Slack.AccessToken;
    }
    export interface HistoryItem
    {
        user: Slack.UserId;
        api: string;
        data: unknown;
    }
    const getCurrentApplication = (): Application => minamo.localStorage.getOrNull<Application>("current-application");
    const setCurrentApplication = (application: Application) => minamo.localStorage.set("current-application", application);
    const getApplicationList = (): Application[] => minamo.localStorage.getOrNull<Application[]>("application-list") ?? [];
    const setApplicationList = (list: Application[]) => minamo.localStorage.set("application-list", list);
    const addApplication = (item: Application) => setApplicationList([item].concat(removeApplication(item)));
    const removeApplication = (item: Application) => setApplicationList(getApplicationList().filter(i => i.name !== item.name || i.client_id !== item.client_id || i.client_secret !== item.client_secret));
    const getIdentityList = (): Identity[] => minamo.localStorage.getOrNull<Identity[]>("identities") ?? [];
    const setIdentityList = (list: Identity[]) => minamo.localStorage.set("identities", list);
    const addIdentity = (item: Identity) => setIdentityList([item].concat(removeIdentity(item)));
    const removeIdentity = (item: Identity) => setIdentityList(getIdentityList().filter(i => i.user.id !== item.user.id || i.team.id !== item.team.id));
    const getHistory = (user: Slack.UserId): HistoryItem[] => minamo.localStorage.getOrNull<HistoryItem[]>(`user:${user}.history`) ?? [];
    const setHistory = (user: Slack.UserId, list: HistoryItem[]) => minamo.localStorage.set(`user:${user}.history`, list);
    const addHistory = (item: HistoryItem) => setHistory
    (
        item.user,
        [item].concat
        (
            getHistory(item.user)
                .filter(i => JSON.stringify(i) !== JSON.stringify(item))
        )
    );
    const getIdentity = (id: Slack.UserId): Identity => getIdentityList().filter(i => i.user.id === id)[0];
    const execute = async (item: HistoryItem) =>
    {
        const token = getIdentity(item.user).token;
        switch(item.api)
        {
        case "chatPostMessage":
            return await Slack.chatPostMessage(token, <any>item.data);
        case "usersProfileSet":
            return await Slack.usersProfileSet(token, <any>item.data);
        }
        addHistory(item);
        return null;
    };
    export module dom
    {
        const renderIcon = (icon: Slack.Icon) =>
        ({
            tag: "img",
            src:
                icon.image_original ||
                icon
                [
                    "image_" +Object.keys(icon)
                        .filter(i => /image_\d+/.test(i))
                        .map(i => parseInt(i.replace(/^image_/, "")))
                        .reduce((a, b) => a < b ? b: a, 0)
                ],
        });
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
        export const showScreen = async ( ) => minamo.dom.appendChildren
        (
            document.body,
            screen
        );
    }
    export const start = async ( ) =>
    {
        const code = location.href.replace(/.*\?/, "").split("&").find(i => /^code=/.test(i))?.replace(/^code=/, "");
        const application = getCurrentApplication();
        if (application && code)
        {
            const result = await Slack.oauthV2Access(application, code, redirect_uri);
            const token = result.authed_user.access_token;
            addIdentity
            ({
                user: (await Slack.usersInfo(token, result.authed_user.id)).user,
                team: (await Slack.teamInfo(token)).team,
                token,
            });
            dom.updateIdentityList();
            history.replaceState(null, document.title, redirect_uri);
        }
        await dom.showScreen();
    };
}
