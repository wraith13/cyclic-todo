import { minamo } from "./minamo.js";
export module CyclicToDo
{
    interface ToDoTitleEntry
    {
        title: string;
        pass: string;
        todo: string[];
    }
    interface TaskEntry
    {
        task: string;
        tick: number;
    }
    interface ToDoEntry
    {
        todo: string;
        isDefault: boolean;
        progress: null | number;
        previous: null | number;
        elapsed: null | number;
        average: null | number;
        count: number;
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
    export const TimeAccuracy = 60 *1000;
    export const getTicks = (date: Date = new Date()) => Math.floor(date.getTime() / TimeAccuracy);
    export const DateStringFromTick = (tick: null | number) =>
    {
        if (null === tick)
        {
            return "N/A";
        }
        else
        {
            const date = new Date(tick *TimeAccuracy);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return `${date.toLocaleDateString()} ${renderTime(tick -getTicks(date))}`;
        }
    };
    export const renderTime = (tick: null | number) =>
    {
        if (null === tick)
        {
            return "N/A";
        }
        else
        {
            const days = Math.floor(tick / (24 *60));
            const time = Math.floor(tick) % (24 *60);
            const hour = Math.floor(time /60);
            const minute = time % 60;
            const timePart = `${("00" +hour).slice(-2)}:${("00" +minute).slice(-2)}`;
            return 0 < days ? `${days.toLocaleString()} days ${timePart}`: timePart;
        }
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
        export const renderProgressStyle = (item: ToDoEntry) => null === item.progress ?
            undefined:
            1 <= item.progress ?
                `background: #22884455`:
                `background: linear-gradient(to right, #22884455 ${item.progress.toLocaleString("en", { style: "percent" })}, rgba(128,128,128,0.2) ${item.progress.toLocaleString("en", { style: "percent" })});`;
        export const renderInformation = (item: ToDoEntry) =>
        ({
            tag: "div",
            className: null === item.progress ? "task-information no-progress": "task-information",
            attributes:
            {
                style: renderProgressStyle(item),
            },
            children:
            [
                {
                    tag: "div",
                    className: "task-last-timestamp",
                    children:
                    [
                        {
                            tag: "span",
                            className: "label",
                            children: "previous (前回):",
                        },
                        {
                            tag: "span",
                            className: "value",
                            children: DateStringFromTick(item.previous),
                        }
                    ],
                },
                {
                    tag: "div",
                    className: "task-elapsed-time",
                    children:
                    [
                        {
                            tag: "span",
                            className: "label",
                            children: "elapsed time (経過時間):",
                        },
                        {
                            tag: "span",
                            className: "value",
                            children: renderTime(item.elapsed),
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
                            children: "interval average (間隔平均):",
                        },
                        {
                            tag: "span",
                            className: "value",
                            children: renderTime(item.average),
                        }
                    ],
                },
                {
                    tag: "div",
                    className: "task-count",
                    children:
                    [
                        {
                            tag: "span",
                            className: "label",
                            children: "count (回数):",
                        },
                        {
                            tag: "span",
                            className: "value",
                            children: item.count.toLocaleString(),
                        }
                    ],
                },
            ],
        });
        export const renderTodoItem = (entry: ToDoTitleEntry, item: ToDoEntry) =>
        ({
            tag: "div",
            className: "task-item",
            children:
            [
                {
                    tag: "div",
                    className: "task-header",
                    children:
                    [
                        {
                            tag: "button",
                            className: item.isDefault ? "default-button": undefined,
                            children: "Done (完了)",
                            onclick: async () =>
                            {
                                //if (isSessionPass(pass))
                                const fxxkingTypeScriptCompiler = isSessionPass(entry.pass);
                                if (fxxkingTypeScriptCompiler)
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
                                    done(entry.pass, item.todo);
                                    updateTodoScreen(entry);
                                }
                            }
                        },
                        {
                            tag: "div",
                            className: "task-title",
                            children: item.todo,
                        },
                    ],
                },
                // DELETE_ME renderInformation(list, item, getHistory(pass, item.task)),
                renderInformation(item),
            ],
        });
        export const renderTodoScreen = (entry: ToDoTitleEntry, list: ToDoEntry[]) =>
        ({
            tag: "div",
            className: "todo-screen screen",
            children:
            [
                renderHeading("h1", `${entry.title} Cyclic Todo`),
            ].concat(list.map(item => renderTodoItem(entry, item)) as any),
        });
        let updateTodoScreenTimer = undefined;
        export const updateTodoScreen = (entry: ToDoTitleEntry) =>
        {
            if (undefined === updateTodoScreenTimer)
            {
                clearInterval(updateTodoScreenTimer);
            }
            const histories: { [todo: string]: { recentries: number[], previous: null | number, average: null | number, count: number, } } = { };
            entry.todo.forEach
            (
                todo =>
                {
                    const full = getHistory(entry.pass, todo);
                    histories[todo] =
                    {
                        recentries: full.filter((_, index) => index < 25),
                        previous: full.length <= 0 ? null: full[0],
                        average: full.length <= 1 ? null: (full[0] -full[full.length -1]) / (full.length -1),
                        count: full.length,
                    };
                }
            );
            console.log(histories);
            const firstStageRecentries = entry.todo.map(todo => histories[todo]).filter(history => 1 === history.count).map(history => history.recentries[0]).sort(simpleReverseComparer);
            console.log(firstStageRecentries);
            const firstStage =
            {
                nones: entry.todo.map(todo => histories[todo]).filter(history => 0 === history.count).length,
                singles: firstStageRecentries.length,
                average: firstStageRecentries.length <= 1 ? null: (firstStageRecentries[0] -firstStageRecentries[firstStageRecentries.length -1]) / (firstStageRecentries.length -1),
            };
            console.log(firstStage);
            const secondStageTarget = entry.todo.map(todo => histories[todo]).filter(history => 2 <= history.count && history.count <= 5);
            const secondStageRecentries = secondStageTarget.map(history => history.recentries).reduce((a, b) => a.concat(b), []).sort(simpleReverseComparer);
            console.log(secondStageRecentries);
            const secondStage =
            {
                average: secondStageRecentries.length <= 1 ? null: (secondStageRecentries[0] -secondStageRecentries[secondStageRecentries.length -1]) / (secondStageRecentries.length -1) *secondStageTarget.length,
                //count: secondStageRecentries.length,
            };
            console.log(secondStage);
            const list: ToDoEntry[] = entry.todo.map
            (
                todo =>
                {
                    const history = histories[todo];
                    const result: ToDoEntry =
                    {
                        todo,
                        isDefault: false,
                        progress: null,
                        previous: history.previous,
                        elapsed: null,
                        average: history.average,
                        count: history.count,
                    };
                    return result;
                }
            );
            const updateProgress = () =>
            {
                const now = getTicks();
                list.forEach
                (
                    item =>
                    {
                        const history = histories[item.todo];
                        if (0 < history.count)
                        {
                            item.elapsed = now -history.previous;
                            if (5 < history.count)
                            {
                                const smartAverage =
                                (
                                    ((history.recentries[0] -history.recentries[Math.min(5, history.recentries.length) -1]) /(Math.min(5, history.recentries.length) -1))
                                    +((history.recentries[0] -history.recentries[Math.min(25, history.recentries.length) -1]) /(Math.min(25, history.recentries.length) -1))
                                ) /2;
                                item.progress = item.elapsed /smartAverage;
console.log("3s", item, smartAverage);
                            }
                            else
                            if (2 <= history.count)
                            {
                                const smartAverage =
                                (
                                    ((history.recentries[0] -history.recentries[Math.min(5, history.recentries.length) -1]) /(Math.min(5, history.recentries.length) -1))
                                    +secondStage.average
                                ) /2;
                                item.progress = item.elapsed /smartAverage;
console.log("2s", item, smartAverage);
                            }
                            else
                            if (null !== firstStage.average)
                            {
                                const smartAverage = firstStage.average *(firstStage.nones +firstStage.singles);
                                item.progress = item.elapsed /smartAverage;
console.log("1s", item, smartAverage);
                            }
                        }
                    }
                );
                const defaultTodo = (<ToDoEntry[]>JSON.parse(JSON.stringify(list))).sort(todoSorter)[0].todo;
                list.forEach(item => item.isDefault = defaultTodo === item.todo);
            };
            updateProgress();
            const phi = 1.6180339887;
            const todoSorter = (a: ToDoEntry, b: ToDoEntry) =>
            {
                if (1 < a.count)
                {
                    const b_progress = 1 < b.count ? b.progress: phi;
                    if (a.progress < b_progress)
                    {
                        return 1;
                    }
                    if (b_progress < a.progress)
                    {
                        return -1;
                    }
                    else
                    {
                        return 0;
                    }
                }
                else
                if (1 < b.count)
                {
                    return -todoSorter(b, a);
                }
                if (a.count < b.count)
                {
                    return -1;
                }
                if (b.count < a.count)
                {
                    return 1;
                }
                const aTodoIndex = entry.todo.indexOf(a.todo);
                const bTodoIndex = entry.todo.indexOf(a.todo);
                if (aTodoIndex < 0 && bTodoIndex < 0)
                {
                    if (a.todo < b.todo)
                    {
                        return 1;
                    }
                    if (b.todo < a.todo)
                    {
                        return -1;
                    }
                }
                else
                {
                    if (aTodoIndex < bTodoIndex)
                    {
                        return 1;
                    }
                    if (bTodoIndex < aTodoIndex)
                    {
                        return -1;
                    }
                }
                return 0;
            };
            list.sort(todoSorter);
            minamo.dom.replaceChildren
            (
                //document.getElementById("screen"),
                document.body,
                renderTodoScreen(entry, list),
            );
            updateTodoScreenTimer = setInterval
            (
                () =>
                {
                    if (0 < document.getElementsByClassName("todo-screen").length)
                    {
                        updateProgress();
                        minamo.dom.replaceChildren
                        (
                            //document.getElementById("screen"),
                            document.body,
                            renderTodoScreen(entry, list),
                        );
                    }
                    else
                    {
                        clearInterval(updateTodoScreenTimer);
                        updateTodoScreenTimer = undefined;
                    }
                },
                TimeAccuracy
            );
        };
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
                            ({
                                title: titleDiv.value,
                                pass: passDiv.value,
                                todo: todoDom.value.split("\n").map(i => i.trim())
                            });
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
                dom.updateTodoScreen({ title, pass, todo });
                break;
            }
        }
    };
}
