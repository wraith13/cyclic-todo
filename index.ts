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
            return -1;
        }
        if (b.tick < a.tick)
        {
            return 1;
        }
        const aTaskIndex = todo.indexOf(a.task);
        const bTaskIndex = todo.indexOf(a.task);
        if (aTaskIndex < 0 && bTaskIndex < 0)
        {
            if (a.task < b.task)
            {
                return 1;
            }
            if (b.task < a.task)
            {
                return -1;
            }
        }
        else
        {
            if (aTaskIndex < bTaskIndex)
            {
                return 1;
            }
            if (bTaskIndex < aTaskIndex)
            {
                return -1;
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
        const totalMinutes = Math.floor(getTotalMinutes(getTicks() -tick));
        const days = Math.floor(totalMinutes / (24 *60));
        const time = totalMinutes % (24 *60);
        const hour = Math.floor(time /60);
        const minute = time % 60;
        const timePart = `${("00" +hour).slice(-2)}:${("00" +minute).slice(-2)}`;
        return 0 < days ? `${days.toLocaleString()} days ${timePart}`: timePart;
    };
    export const sessionPassPrefix = "@Session";
    export const generatePass = (seed: number = new Date().getTime()) => ("" +((seed *13738217) ^ ((seed %387960371999) >> 5 ))).slice(-8);
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
                    tag: "div",
                    className: "task-last-timestamp",
                    children: `previous (前回): ${DateFromTick(entry.tick).toLocaleString()}`
                },
                {
                    tag: "div",
                    className: "task-last-elapsed-time",
                    children: `elapsed time (経過時間): ${makeElapsedTime(entry.tick)}`,
                },
            ],
        });
        export const renderDoneButton = (title: string, pass: string, list: TaskEntry[], entry: TaskEntry, isDefault: boolean) =>
        ({
            tag: "button",
            className: isDefault ? "default-button": undefined,
            children:
            [
                {
                    tag: "div",
                    className: "button-title",
                    children: entry.task,
                },
                renderLastInformation(entry),
            ],
            onclick: async () =>
            {
                if (isSessionPass(pass))
                {
                    window.alert
                    (
                        "This is view mode. If this is your to-do list, open the original URL instead of the sharing URL. If this is not your to-do list, you can copy this to-do list from edit mode.\n"
                        +"\n"
                        +"これは表示モードです。これが貴方が作成したToDoリストならば、共有用のURLではなくオリジナルのURLを開いてください。これが貴方が作成したToDoリストでない場合、編集モードからこのToDoリストをコピーできます。"
                    );
                }
                else
                {
                    done(pass, entry.task);
                    updateTodoScreen(title, pass, getToDoEntries(pass, list.map(i => i.task)));
                }
            }
        });
        export const renderTodoScreen = (title: string, pass: string, list: TaskEntry[]) =>
        ({
            tag: "div",
            className: "todo-screen screen",
            children:
            [
                renderHeading("h2", title),
            ].concat(list.map((entry, index) => renderDoneButton(title, pass, list, entry, 0 === index)) as any),
        });
        export const updateTodoScreen = (title: string, pass: string, list: TaskEntry[]) => minamo.dom.replaceChildren
        (
            //document.getElementById("screen"),
            document.body,
            renderTodoScreen(title, pass, list)
        );
        export const renderEditScreen = (title: string, pass: string, todo: string[]) =>
        {
            const titleDiv = minamo.dom.make(HTMLInputElement)
            ({
                tag: "input",
                className: "edit-title-input",
                value: title,
            });
            const passDiv = minamo.dom.make(HTMLInputElement)
            ({
                tag: "input",
                className: "edit-pass-input",
                children: isSessionPass(pass) ? generatePass(): pass,
            });
            const todoDom = minamo.dom.make(HTMLTextAreaElement)
            ({
                tag: "textarea",
                className: "edit-todo-input",
                children: todo.join("\n"),
            });
            const result =
            {
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
                            titleDiv,
                        ],
                    },
                    {
                        tag: "label",
                        children:
                        [
                            {
                                tag: "span",
                                children: "channel",
                            },
                            passDiv,
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
                            todoDom,
                        ],
                    },
                    {
                        tag: "button",
                        children: "default-button",
                        onclick: () =>
                        {
                            updateTodoScreen
                            (
                                titleDiv.value,
                                passDiv.value,
                                getToDoEntries
                                (
                                    passDiv.value,
                                    todoDom.value.split("\n").map(i => i.trim())
                                )
                            );
                        }
                    },
                ]
            };
            return result;
        };
        export const updateEditScreen = (title: string, pass: string, todo: string[]) => minamo.dom.replaceChildren
        (
            //document.getElementById("screen"),
            document.body,
            renderEditScreen(title, pass, todo)
        );
        export const renderWelcomeScreen = (_pass: string) =>
        ({
            tag: "div",
            className: "welcome-screen screen",
            children:
            [
                renderHeading("h2", "title"),
            ],
        });
        export const updateWelcomeScreen = (pass: string) => minamo.dom.replaceChildren
        (
            //document.getElementById("screen"),
            document.body,
            renderWelcomeScreen(pass)
        );
        const screen =
        [
            renderHeading("h1", document.title),
            {
                tag: "a",
                className: "github",
                children: "GitHub",
                href: "https://github.com/wraith13/cyclic-todo"
            },
        ];
        export const showWindow = async ( ) => minamo.dom.appendChildren
        (
            document.body,
            screen
        );
    }
    export const getUrlParams = (url: string = location.href) =>
    {
        const result: { [key: string]: string } = { };
        url
            .replace(/.*\?/, "")
            .replace(/#.*/, "")
            .split("&")
            .map(kvp => kvp.split("="))
            .filter(kvp => 2 <= kvp.length)
            .forEach(kvp => result[kvp[0]] = decodeURIComponent(kvp[1]));
        return result;
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
    export const makeSharingUrl = (url: string = location.href) =>
    {
        const urlParams = getUrlParams(url);
        if (undefined !== urlParams["pass"])
        {
            delete urlParams["pass"];
        }
        return makeUrl
        (
            urlParams,
            getUrlHash(url),
            url
        );
    };
    export const start = async () =>
    {
        console.log("start!!!");
        const urlParams = getUrlParams();
        const hash = getUrlHash();
        const title = urlParams["title"] ?? "untitled";
        const pass = urlParams["pass"] ?? `${sessionPassPrefix}:${new Date().getTime()}`;
        const todo = JSON.parse(urlParams["todo"] ?? "null") as string[] | null;
        const history = JSON.parse(urlParams["history"] ?? "null") as (number | null)[] | null;
        await dom.showWindow();
        document.title = `${title} Cyclic ToDo`;
        if ((todo?.length ?? 0) <= 0)
        {
            switch(hash)
            {
            // case "import":
            //     dom.updateImportScreen(pass);
            //     break;
            case "edit":
                console.log("show edit screen");
                dom.updateEditScreen(title, pass, []);
                break;
            default:
                console.log("show welcome screen");
                dom.updateWelcomeScreen(pass);
                break;
            }
        }
        else
        {
            if (0 < (history?.length ?? 0))
            {
                mergeHistory(pass, todo, history);
            }
            switch(hash)
            {
            case "edit":
                console.log("show edit screen");
                dom.updateEditScreen(title, pass, todo);
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
                dom.updateTodoScreen(title, pass, getToDoEntries(pass, todo));
                break;
            }
        }
    };
}
