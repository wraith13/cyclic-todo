import { minamo } from "./minamo.js";
export module CyclicToDo
{
    interface TaskEntry
    {
        task: string;
        tick: number;
    }
    export const makeTaskEntryComparer = (todo: string[]) => (a: TaskEntry, b: TaskEntry) =>
    {
        if (a.tick < b.tick)
        {
            return 1;
        }
        if (b.tick < a.tick)
        {
            return -1;
        }
        const aTaskIndex = todo.indexOf(a.task);
        const bTaskIndex = todo.indexOf(a.task);
        if (aTaskIndex < 0 && bTaskIndex < 0)
        {
            if (a.task < b.task)
            {
                return -1;
            }
            if (b.task < a.task)
            {
                return 1;
            }
        }
        else
        {
            if (aTaskIndex < bTaskIndex)
            {
                return -1;
            }
            if (bTaskIndex < aTaskIndex)
            {
                return 1;
            }
        }
        return 0;
    };
    export const simpleComparer = <T>(a: T, b: T) =>
    {
        if (a < b)
        {
            return -1;
        }
        if (b < a)
        {
            return 1;
        }
        return 0;
    };
    export const simpleReverseComparer = <T>(a: T, b: T) => -simpleComparer(a, b);
    export const TimeAccuracy = 100000;
    export const getTicks = (date: Date = new Date()) => Math.floor(date.getTime() / TimeAccuracy);
    export const DateFromTick = (tick: number) => new Date(tick *TimeAccuracy);
    export const getHistory = (task: string): number[] => minamo.localStorage.getOrNull<number[]>(`task:${task}.history`) ?? [];
    export const setHistory = (task: string, list: number[]) => minamo.localStorage.set(`task:${task}.history`, list);
    export const addHistory = (task: string, tick: number | number[]) =>
    {
        const list = getHistory(task).concat(tick).filter((i, index, array) => index === array.indexOf(i));
        list.sort(simpleReverseComparer);
        setHistory(task, list);
    };
    export const getLastTick = (task: string) => getHistory(task)[0];
    export const getToDoHistory = (todo: string[]): TaskEntry[] => todo
        .map(task => getHistory(task).map(tick => ({ task, tick})))
        .reduce((a, b) => a.concat(b), [])
        .sort(makeTaskEntryComparer(todo));
    export const getToDoEntries = (todo: string[]) => todo
        .map(task => ({ task, tick: getLastTick(task)}))
        .sort(makeTaskEntryComparer(todo));
    export const done = async (task: string) => addHistory(task, getTicks());
    export module dom
    {
        const renderHeading = ( tag: string, text: minamo.dom.Source ) =>
        ({
            tag,
            children: text,
        });
        const renderDoneButton = (task: string, isDefault: boolean) =>
        ({
            tag: "button",
            className: isDefault ? "default-button": undefined,
            children:
            [
                {
                    tag: "div",
                    className: "task-title",
                    children: task,
                },
                renderLastInformation(task),
            ],
            onclick: async () =>
            {
                done(task);
                updateTodoScreen();
            }
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

        const screen =
        [
            renderHeading ( "h1", document.title ),
            {
                tag: "a",
                className: "github",
                children: "GitHub",
                href: "https://github.com/wraith13/slac-fixed-phrase"
            },
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
