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
    export const getTotalMinutes = (tick: number) => (tick *TimeAccuracy) / (60 *1000);
    export const getTicks = (date: Date = new Date()) => Math.floor(date.getTime() / TimeAccuracy);
    export const DateFromTick = (tick: number) => new Date(tick *TimeAccuracy);
    export const makeElapsedTime = (tick: number) =>
    {
        const totalMinutes = getTotalMinutes(tick);
        const days = Math.floor(totalMinutes / (24 *60));
        const time = tick % (24 *60);
        const hour = Math.floor(time /60);
        const minute = time % 60;
        const timePart = `${("00" +hour).slice(-2)}:${("00" +minute).slice(-2)}`;
        return 0 < days ? `${days.toLocaleString()} days ${timePart}`: timePart;
    };
    export const sessionPassPrefix = "@Session";
    export const isSessionPass = (pass: string) => pass.startsWith(sessionPassPrefix);
    export const getStorage = (pass: string) => isSessionPass(pass) ? minamo.sessionStorage: minamo.localStorage;
    export const makeHistoryKey = (pass: string, task: string) => `pass:(${pass}).task:${task}.history`;
    export const getHistory = (pass: string, task: string): number[] =>
        getStorage(pass).getOrNull<number[]>(makeHistoryKey(pass, task)) ?? [];
    export const setHistory = (pass: string, task: string, list: number[]) =>
        getStorage(pass).set(makeHistoryKey(pass, task), list);
    export const addHistory = (pass: string, task: string, tick: number | number[]) =>
    {
        const list = getHistory(pass, task).concat(tick).filter((i, index, array) => index === array.indexOf(i));
        list.sort(simpleReverseComparer);
        setHistory(pass, task, list);
    };
    export const mergeHistory = (pass: string, todo: string[], ticks: (number | null)[]) =>
    {
        const temp:{ [task:string]: number[]} = { };
        todo.forEach(task => temp[task] = []);
        ticks.forEach
        (
            (tick, index) =>
            {
                if (null !== tick)
                {
                    temp[todo[index % todo.length]].push(tick);
                }
            }
        );
        todo.forEach(task => addHistory(pass, task, temp[task]));
    };
    export const getLastTick = (pass: string, task: string) => getHistory(pass, task)[0] ?? 0;
    export const getToDoHistory = (pass: string, todo: string[]): TaskEntry[] => todo
        .map(task => getHistory(pass, task).map(tick => ({ task, tick})))
        .reduce((a, b) => a.concat(b), [])
        .sort(makeTaskEntryComparer(todo));
    export const getToDoEntries = (pass: string, todo: string[]) => todo
        .map(task => ({ task, tick: getLastTick(pass, task)}))
        .sort(makeTaskEntryComparer(todo));
    export const done = async (pass: string, task: string) => addHistory(pass, task, getTicks());
    export module dom
    {
        export const renderHeading = (tag: string, text: minamo.dom.Source) =>
        ({
            tag,
            children: text,
        });
        export const renderLastInformation = (entry: TaskEntry) =>
        ({
            tag: "div",
            className: "task-last-information",
            children: entry.tick <= 0 ? [ ]:
            [
                {
                    tag: "span",
                    className: "task-last-timestamp",
                    children: DateFromTick(entry.tick).toLocaleString()
                },
                {
                    tag: "span",
                    className: "task-last-elapsed-time",
                    children: makeElapsedTime(entry.tick),
                },
            ],
        });
        export const renderDoneButton = (pass: string, list: TaskEntry[], entry: TaskEntry, isDefault: boolean) =>
        ({
            tag: "button",
            className: isDefault ? "default-button": undefined,
            children:
            [
                {
                    tag: "div",
                    className: "task-title",
                    children: entry.task,
                },
                renderLastInformation(entry),
            ],
            onclick: async () =>
            {
                done(pass, entry.task);
                updateTodoScreen(pass, getToDoEntries(pass, list.map(i => i.task)));
            }
        });
        export const renderTodoScreen = (pass, list: TaskEntry[]) => list.map((entry, index) => renderDoneButton(pass, list, entry, 0 === index));
        export const updateTodoScreen = (pass, list: TaskEntry[]) => minamo.dom.replaceChildren
        (
            document.getElementById("screen"),
            renderTodoScreen(pass, list)
        );
        export const renderEditScreen = (pass: string, list: TaskEntry[]) => list.map((entry, index) => renderDoneButton(pass, list, entry, 0 === index));
        export const renderPostMessageForm = (identity: Identity) =>
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
    export const getUrlHash = (url: string = location.href) => url.replace(/[^#]*#?/, "");
    export const makeUrl =
    (
        args: {[key: string]: string},
        hash: string = getUrlHash(),
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
        const hash = getUrlHash();
        const pass = getUrlParams("pass") ?? `${sessionPassPrefix}:${new Date().getTime()}`;
        const todo = JSON.parse(getUrlParams("todo") ?? "null") as string[] | null;
        const history = JSON.parse(getUrlParams("history") ?? "null") as (number | null)[] | null;
        await dom.showWindow();
        if ((todo?.length ?? 0) <= 0)
        {
            switch(hash)
            {
            case "import":
                dom.updateImportScreen();
                break;
            case "edit":
                dom.updateEditScreen([]);
                break;
            }
        }
        else
        {
            if ((history?.length ?? 0) <= 0)
            {
                mergeHistory(pass, todo, history);
            }
            switch(hash)
            {
            case "edit":
                dom.updateEditScreen(pass, todo);
                break;
            case "history":
                dom.updateHistoryScreen(pass, getToDoHistory(pass, todo));
                break;
            case "statistics":
                dom.updateStatisticsScreen();
                break;
            case "import":
                dom.updateImportScreen();
                break;
            case "export":
                dom.updateExportScreen(pass, getToDoHistory(pass, todo));
                break;
            default:
                dom.updateTodoScreen(pass, getToDoEntries(pass, todo));
                break;
            }
        }
    };
}
