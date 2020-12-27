import { minamo } from "./minamo.js";
import localeEn from "./lang.en.json";
import localeJa from "./lang.ja.json";
export module localeSingle
{
    export type LocaleKeyType = keyof typeof localeEn;
    interface LocaleEntry
    {
        [key : string] : string;
    }
    const localeTableKey = navigator.language;
    const localeTable = Object.assign(JSON.parse(JSON.stringify(localeEn)), ((<{[key : string] : LocaleEntry}>{
        ja : localeJa
    })[localeTableKey] || { }));
    export const string = (key : string) : string => localeTable[key] || key;
    export const map = (key : LocaleKeyType) : string => string(key);
}
export module localeParallel
{
    export type LocaleKeyType = keyof typeof localeEn & keyof typeof localeJa;
    const firstLocale = localeEn;
    const secondLocale =
    {
        //en : localeEn,
        ja: localeJa,
    }[navigator.language] ?? localeJa;
    export const map = (key : LocaleKeyType) : string => `${firstLocale[key]} / ${secondLocale[key]}`;
}export module Calculate
{
    export const phi = 1.618033988749894;
    export const average = (ticks: number[]) => ticks.reduce((a, b) => a +b, 0) /ticks.length;
    export const standardDeviation = (ticks: number[], average: number = Calculate.average(ticks)) =>
        Math.sqrt(Calculate.average(ticks.map(i => (i -average) ** 2)));
    export const standardScore = (average: number, standardDeviation: number, target: number) =>
        (10 * (target -average) /standardDeviation) +50;
}
export module CyclicToDo
{
    const applicationTitle = "Cyclic ToDo";

    export module locale
    {
        export type LocaleKeyType = localeParallel.LocaleKeyType;
        export const map = localeSingle.map;
        export const parallel = localeParallel.map;
    }
    
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
        decayedProgress: null | number;
        previous: null | number;
        elapsed: null | number;
        average: null | number;
        standardDeviation: null | number;
        count: number;
        smartAverage: null | number;
    }
    export module Storage
    {
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
            list.sort(Domain.simpleReverseComparer);
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
    }
    export module Domain
    {
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
        export const dateStringFromTick = (tick: null | number) =>
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
                return `${date.toLocaleDateString()} ${timeStringFromTick(tick -getTicks(date))}`;
            }
        };
        export const timeStringFromTick = (tick: null | number) =>
        {
            if (null === tick)
            {
                return "N/A";
            }
            else
            if (tick < 0)
            {
                return `-${timeStringFromTick(-tick)}`;
            }
            else
            {
                const days = Math.floor(tick / (24 *60));
                const time = Math.floor(tick) % (24 *60);
                const hour = Math.floor(time /60);
                const minute = time % 60;
                const timePart = `${("00" +hour).slice(-2)}:${("00" +minute).slice(-2)}`;
                return 1000 <= days ?
                    `${days.toLocaleString()}`:
                    0 < days ?
                        `${days.toLocaleString()} ${timePart}`:
                        timePart;
            }
        };
        export const getLastTick = (pass: string, task: string) => Storage.getHistory(pass, task)[0] ?? 0;
        export const getToDoHistory = (pass: string, todo: string[]): TaskEntry[] => todo
            .map(task => Storage.getHistory(pass, task).map(tick => ({ task, tick})))
            .reduce((a, b) => a.concat(b), [])
            .sort(makeTaskEntryComparer(todo));
        // export const getToDoEntries = (pass: string, todo: string[]) => todo
        //     .map(task => ({ task, tick: getLastTick(pass, task)}))
        //     .sort(makeTaskEntryComparer(todo));
        export const getDoneTicks = (pass: string, key: string = `pass:(${pass}).last.done.ticks`) =>
            minamo.localStorage.set
            (
                key,
                Math.max
                (
                    minamo.localStorage.getOrNull<number>(key) ?? 0,
                    getTicks() -1
                ) +1
            );
        export const done = async (pass: string, task: string) =>
            Storage.addHistory(pass, task, getDoneTicks(pass));
        const todoSorter = (entry: ToDoTitleEntry) => (a: ToDoEntry, b: ToDoEntry) =>
        {
            if (1 < a.count)
            {
                if (null !== a.smartAverage && null !== b.smartAverage)
                {
                    const rate = Math.min(a.count, b.count) < 5 ? 1.5: 1.2;
                    if (a.smartAverage < b.smartAverage *rate && b.smartAverage < a.smartAverage *rate)
                    {
                        if (a.elapsed < b.elapsed)
                        {
                            return 1;
                        }
                        if (b.elapsed < a.elapsed)
                        {
                            return -1;
                        }
                    }
                }
                const a_progress = a.decayedProgress;
                const b_progress = 1 < b.count ? b.decayedProgress: 1.0 -(1.0 / Calculate.phi);
                if (a_progress < b_progress)
                {
                    return 1;
                }
                if (b_progress < a_progress)
                {
                    return -1;
                }
            }
            else
            if (1 < b.count)
            {
                return -todoSorter(entry)(b, a);
            }
            if (1 === a.count && b.count)
            {
                if (a.elapsed < b.elapsed)
                {
                    return 1;
                }
                if (b.elapsed < a.elapsed)
                {
                    return -1;
                }
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
        export const getRecentlyHistories = (entry: ToDoTitleEntry) =>
        {
            const histories: { [todo: string]: { recentries: number[], previous: null | number, count: number, } } = { };
            entry.todo.forEach
            (
                todo =>
                {
                    const full = Storage.getHistory(entry.pass, todo);
                    histories[todo] =
                    {
                        recentries: full.filter((_, index) => index < 25),
                        previous: full.length <= 0 ? null: full[0],
                        //average: full.length <= 1 ? null: (full[0] -full[full.length -1]) / (full.length -1),
                        count: full.length,
                    };
                }
            );
            return histories;
        };
        export const calculateTitleRecentrlyAverage = (entry: ToDoTitleEntry, histories: { [todo: string]: { recentries: number[], previous: null | number, count: number, } }) =>
        {
            const titleRecentrly = entry.todo.map(todo => histories[todo].recentries).reduce((a, b) => a.concat(b), []).sort(Domain.simpleReverseComparer);
            return titleRecentrly.length <= 1 ? null: (titleRecentrly[0] -titleRecentrly[titleRecentrly.length -1]) / (titleRecentrly.length -1);
        };
        export const getToDoEntries = (entry: ToDoTitleEntry, histories: { [todo: string]: { recentries: number[], previous: null | number, count: number, } }, titleRecentrlyAverage:number, now: number = Domain.getTicks()) =>
        {
            const firstStageRecentries = entry.todo.map(todo => histories[todo]).filter(history => 1 === history.count).map(history => history.recentries[0]).sort(Domain.simpleReverseComparer);
            const firstStage =
            {
                nones: entry.todo.map(todo => histories[todo]).filter(history => 0 === history.count).length,
                singles: firstStageRecentries.length,
                average: firstStageRecentries.length <= 1 ? null: (firstStageRecentries[0] -firstStageRecentries[firstStageRecentries.length -1]) / (firstStageRecentries.length -1),
                standardDeviation: firstStageRecentries.length <= 1 ? null: Calculate.standardDeviation(firstStageRecentries),
            };
            const secondStageTarget = entry.todo.map(todo => histories[todo]).filter(history => 2 <= history.count && history.count <= 5);
            const secondStageRecentries = secondStageTarget.map(history => history.recentries).reduce((a, b) => a.concat(b), []).sort(Domain.simpleReverseComparer);
            const secondStage =
            {
                average: secondStageRecentries.length <= 1 ? null: (secondStageRecentries[0] -secondStageRecentries[secondStageRecentries.length -1]) / (secondStageRecentries.length -1) *secondStageTarget.length,
                standardDeviation: secondStageRecentries.length <= 1 ? null: Calculate.standardDeviation(secondStageRecentries),
                //count: secondStageRecentries.length,
            };
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
                        decayedProgress: null,
                        previous: history.previous,
                        elapsed: null,
                        average: history.recentries.length <= 1 ? null: (history.recentries[0] -history.recentries[history.recentries.length -1]) / (history.recentries.length -1),
                        standardDeviation: history.recentries.length <= 1 ?
                            null:
                            (5 < history.recentries.length || null === secondStage.standardDeviation) ?
                                Calculate.standardDeviation(history.recentries):
                                Calculate.average([Calculate.standardDeviation(history.recentries), secondStage.standardDeviation]),
                        count: history.count,
                        smartAverage: null,
                    };
                    return result;
                }
            );
            list.forEach
            (
                item =>
                {
                    const history = histories[item.todo];
                    if (0 < history.count)
                    {
                        // todo の順番が前後にブレるのを避ける為、１分以内に複数の todo が done された場合、二つ目以降は +1 分ずつズレた時刻で打刻され( getDoneTicks() 関数の実装を参照 )、直後は素直に計算すると経過時間がマイナスになってしまうので、マイナスの場合はゼロにする。
                        if (5 < history.count)
                        {
                            item.smartAverage =
                            (
                                ((history.recentries[0] -history.recentries[Math.min(5, history.recentries.length) -1]) /(Math.min(5, history.recentries.length) -1))
                                +((history.recentries[0] -history.recentries[Math.min(25, history.recentries.length) -1]) /(Math.min(25, history.recentries.length) -1))
                            ) /2;
                        }
                        else
                        if (2 <= history.count)
                        {
                            item.smartAverage =
                            (
                                ((history.recentries[0] -history.recentries[Math.min(5, history.recentries.length) -1]) /(Math.min(5, history.recentries.length) -1))
                                +secondStage.average
                            ) /2;
                        }
                        else
                        if (null !== firstStage.average)
                        {
                            item.smartAverage = firstStage.average *(firstStage.nones +firstStage.singles);
                            item.standardDeviation = firstStage.standardDeviation;
                        }
                        else
                        if (null !== secondStage.average)
                        {
                            item.smartAverage = secondStage.average;
                            item.standardDeviation = secondStage.standardDeviation;
                        }
                    }
                }
            );
            updateProgress(entry, list, titleRecentrlyAverage, now);
            list.sort(todoSorter(entry));
            console.log(list); // これは消さない！！！
            return list;
        };
        export const updateProgress = (entry: ToDoTitleEntry, list: ToDoEntry[], titleRecentrlyAverage: number, now: number = Domain.getTicks()) =>
        {
            list.forEach
            (
                item =>
                {
                    if (0 < item.count)
                    {
                        // todo の順番が前後にブレるのを避ける為、１分以内に複数の todo が done された場合、二つ目以降は +1 分ずつズレた時刻で打刻され( getDoneTicks() 関数の実装を参照 )、直後は素直に計算すると経過時間がマイナスになってしまうので、マイナスの場合はゼロにする。
                        item.elapsed = Math.max(0.0, now -item.previous);
                        if (null !== item.smartAverage)
                        {
                            item.progress = item.elapsed /(item.smartAverage +(item.standardDeviation ?? 0));
                            item.decayedProgress = item.elapsed /(item.smartAverage +(item.standardDeviation ?? 0));
                            if (null !== titleRecentrlyAverage)
                            {
                                const overrate = (item.elapsed -(item.smartAverage +(item.standardDeviation ?? 0))) / titleRecentrlyAverage;
                                if (0.0 < overrate)
                                {
                                    item.decayedProgress = 1.0 / (1.0 +Math.log2(1.0 +overrate));
                                    item.progress = null;
                                    item.smartAverage = null;
                                    item.standardDeviation = null;
                                }
                            }
                        }
                    }
                }
            );
            const defaultTodo = (<ToDoEntry[]>JSON.parse(JSON.stringify(list))).sort(todoSorter(entry))[0].todo;
            list.forEach(item => item.isDefault = defaultTodo === item.todo);
        };
    }
    export module Render
    {
        export const heading = (tag: string, text: minamo.dom.Source) =>
        ({
            tag,
            children: text,
        });
        export const backgroundLinerGradient = (leftPercent: string, leftColor: string, rightColor: string) =>
            `background: linear-gradient(to right, ${leftColor} ${leftPercent}, ${rightColor} ${leftPercent});`;
        export const progressStyle = (item: ToDoEntry) => null === item.progress ?
            undefined:
            1 <= item.progress ?
                `background: #22884455`:
                backgroundLinerGradient(Math.pow(item.progress, 0.8).toLocaleString("en", { style: "percent" }), "#22884466", "rgba(128,128,128,0.2)");
        export const label = (label: locale.LocaleKeyType) =>
        ({
            tag: "span",
            className: "label",
            children: locale.parallel(label),
        });
        export const information = (item: ToDoEntry) =>
        ({
            tag: "div",
            className: null === item.progress ? "task-information no-progress": "task-information",
            attributes:
            {
                style: progressStyle(item),
            },
            children:
            [
                {
                    tag: "div",
                    className: "task-last-timestamp",
                    children:
                    [
                        label("previous"),
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
                    children:
                    [
                        label("expected interval"),
                        {
                            tag: "span",
                            className: "value",
                            children: null === item.standardDeviation ?
                                Domain.timeStringFromTick(item.smartAverage):
                                `${Domain.timeStringFromTick(Math.max(item.smartAverage /10, item.smartAverage -item.standardDeviation))} 〜 ${Domain.timeStringFromTick(item.smartAverage +item.standardDeviation)}`,
                        }
                    ],
                },
                {
                    tag: "div",
                    className: "task-elapsed-time",
                    children:
                    [
                        label("elapsed time"),
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
                    children:
                    [
                        label("count"),
                        {
                            tag: "span",
                            className: "value",
                            children: item.count.toLocaleString(),
                        }
                    ],
                },
            ],
        });
        export const todoItem = (entry: ToDoTitleEntry, item: ToDoEntry) =>
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
                            children: locale.parallel("Done"),
                            onclick: async () =>
                            {
                                //if (isSessionPass(pass))
                                const fxxkingTypeScriptCompiler = Storage.isSessionPass(entry.pass);
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
                                    Domain.done(entry.pass, item.todo);
                                    await updateTodoScreen(entry);
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
                information(item),
            ],
        });
        export const todoScreen = async (entry: ToDoTitleEntry, list: ToDoEntry[]) =>
        ({
            tag: "div",
            className: "todo-screen screen",
            children:
            [
                heading("h1", [await applicationIcon(), `${document.title}`]),
                {
                    tag: "div",
                    className: "list",
                    children: list.map(item => todoItem(entry, item)),
                }
            ]
        });
        let updateTodoScreenTimer = undefined;
        export const updateTodoScreen = async (entry: ToDoTitleEntry) =>
        {
            document.title = `${entry.title} ${applicationTitle}`;
            if (undefined !== updateTodoScreenTimer)
            {
                clearInterval(updateTodoScreenTimer);
            }
            const histories = Domain.getRecentlyHistories(entry);
            const titleRecentrlyAverage = Domain.calculateTitleRecentrlyAverage(entry, histories);
            const list = Domain.getToDoEntries(entry, histories, titleRecentrlyAverage);
            minamo.dom.replaceChildren
            (
                //document.getElementById("screen"),
                document.body,
                await todoScreen(entry, list),
            );
            updateTodoScreenTimer = setInterval
            (
                async () =>
                {
                    if (0 < document.getElementsByClassName("todo-screen").length)
                    {
                        Domain.updateProgress(entry, list, titleRecentrlyAverage);
                        minamo.dom.replaceChildren
                        (
                            //document.getElementById("screen"),
                            document.body,
                            await todoScreen(entry, list),
                        );
                    }
                    else
                    {
                        clearInterval(updateTodoScreenTimer);
                        updateTodoScreenTimer = undefined;
                    }
                },
                Domain.TimeAccuracy
            );
        };
        export const editScreen = (title: string, pass: string, todo: string[]) =>
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
                children: Storage.isSessionPass(pass) ? Storage.generatePass(): pass,
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
            editScreen(title, pass, todo)
        );
        const loadSvg = async (path : string) : Promise<SVGElement> => new Promise<SVGElement>
        (
            (resolve, reject) =>
            {
                const request = new XMLHttpRequest();
                request.open('GET', path, true);
                request.onreadystatechange = function()
                {
                    if (4 === request.readyState)
                    {
                        if (200 <= request.status && request.status < 300)
                        {
                            try
                            {
                                resolve(new DOMParser().parseFromString(request.responseText, "image/svg+xml").documentElement as any);
                            }
                            catch(err)
                            {
                                reject(err);
                            }
                        }
                        else
                        {
                            reject(request);
                        }
                    }
                };
                request.send(null);
            }
        );
        export const applicationIcon = async () =>
        ({
            tag: "div",
            className: "application-icon icon",
            children: await loadSvg("./cyclictodohex.1024.svg"),
        });
        export const welcomeScreen = async (_pass: string) =>
        ({
            tag: "div",
            className: "welcome-screen screen",
            children:
            [
                heading("h1", [await applicationIcon(), `${document.title}`]),
                await applicationIcon(),
            ],
        });
        export const updateWelcomeScreen = async (pass: string) =>
        {
            document.title = applicationTitle;
            minamo.dom.replaceChildren
            (
                //document.getElementById("screen"),
                document.body,
                await welcomeScreen(pass)
            );
        };
        const screen =
        [
            heading("h1", document.title),
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
        const pass = urlParams["pass"] ?? `${Storage.sessionPassPrefix}:${new Date().getTime()}`;
        const todo = JSON.parse(urlParams["todo"] ?? "null") as string[] | null;
        const history = JSON.parse(urlParams["history"] ?? "null") as (number | null)[] | null;
        await Render.showWindow();
        if ((todo?.length ?? 0) <= 0)
        {
            switch(hash)
            {
            // case "import":
            //     dom.updateImportScreen(pass);
            //     break;
            case "edit":
                console.log("show edit screen");
                Render.updateEditScreen(title, pass, []);
                break;
            default:
                console.log("show welcome screen");
                await Render.updateWelcomeScreen(pass);
                break;
            }
        }
        else
        {
            if (0 < (history?.length ?? 0))
            {
                Storage.mergeHistory(pass, todo, history);
            }
            switch(hash)
            {
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
                Render.updateTodoScreen({ title, pass, todo });
                break;
            }
        }
    };
}
