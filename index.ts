import { minamo } from "./minamo.js";
import localeEn from "./lang.en.json";
import localeJa from "./lang.ja.json";
// export const timeout = <T>(wait: number = 0, action?: () => T) =>
//     undefined === action ?
//         new Promise(resolve => setTimeout(resolve, wait)):
//         new Promise(resolve => setTimeout(() => resolve(action()), wait));
export const makeObject = <T>(items: { key: string, value: T}[]) =>
{
    const result: { [key: string]: T} = { };
    items.forEach(i => result[i.key] = i.value);
    return result;
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
export const uniqueFilter = <T>(value: T, index: number, list: T[]) => index === list.indexOf(value);
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
    export const intervals = (ticks: number[]) =>
    {
        const result: number[] = [];
        ticks.forEach
        (
            (value, index, list) =>
            {
                if (0 < index)
                {
                    result.push(list[index -1] -value);
                }
            }
        );
        return result;
    };
    export const average = (ticks: number[]) => ticks.length <= 0 ?
        null:
        ticks.reduce((a, b) => a +b, 0) /ticks.length;
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
    
    interface ToDoTagEntry
    {
        tag: string;
        pass: string;
        todo: string[];
    }
    interface ToDoEntry
    {
        todo: string;
        isDefault: boolean;
        progress: null | number;
        //decayedProgress: null | number;
        previous: null | number;
        elapsed: null | number;
        overallAverage: null | number;
        RecentlyStandardDeviation: null | number;
        RecentlySmartAverage: null | number;
        count: number;
    }
    export module Storage
    {
        export const sessionPassPrefix = "@Session";
        export const generatePass = (seed: number = new Date().getTime()) => ("" +((seed *13738217) ^ ((seed %387960371999) >> 5 ))).slice(-8);
        export const isSessionPass = (pass: string) => pass.startsWith(sessionPassPrefix);
        export const getStorage = (pass: string) => isSessionPass(pass) ? minamo.sessionStorage: minamo.localStorage;
        export let lastUpdate = 0;
        export module Pass
        {
            export const key = `pass.list`;
            export const get = () => minamo.localStorage.getOrNull<string[]>(key) ?? [];
            export const set = (passList: string[]) => minamo.localStorage.set(key, passList);
            export const add = (pass: string) => set(get().concat([ pass ]).filter(uniqueFilter));
            export const remove = (pass: string) => set(get().filter(i => pass !== i));
        }
        export module Tag
        {
            export const isSystemTag = (tag: string) => tag.startsWith("@") && ! tag.startsWith("@@");
            export const encode = (tag: string) => tag.replace(/^@/, "@@");
            export const decode = (tag: string) => tag.replace(/^@@/, "@");
            export const makeKey = (pass: string) => `pass:(${pass}).tag.list`;
            export const get = (pass: string) =>
                getStorage(pass).getOrNull<string[]>(makeKey(pass)) ?? [];
            export const set = (pass: string, list: string[]) =>
                getStorage(pass).set(makeKey(pass), list.filter(i => ! isSystemTag(i))); // システムタグは万が一にも登録させない
            export const add = (pass: string, tag: string) => set(pass, get(pass).concat([ tag ]).filter(uniqueFilter));
            export const remove = (pass: string, tag: string) => set(pass, get(pass).filter(i => tag !== i));
        }
        export module TagMember
        {
            export const makeKey = (pass: string, tag: string) => `pass:(${pass}).tag:(${tag})`;
            export const getRaw = (pass: string, tag: string) =>
                getStorage(pass).getOrNull<string[]>(makeKey(pass, tag)) ?? [];
            export const get = (pass: string, tag: string): string[] =>
            {
                switch(tag)
                {
                case "@overall":
                    {
                        const unoverall = getRaw(pass, "@unoverall");
                        return getRaw(pass, "@overall").filter(i => unoverall.indexOf(i) < 0);
                    }
                case "@untagged":
                    {
                        const tagged = Tag.get(pass).map(tag => get(pass, tag)).reduce((a, b) => a.concat(b), []);
                        return getRaw(pass, "@overall").filter(i => tagged.indexOf(i) < 0);
                    }
                case "@unoverall":
                default:
                    return getRaw(pass, tag);
                }
            };
            export const set = (pass: string, tag: string, list: string[]) =>
                getStorage(pass).set(makeKey(pass, tag), list);
            export const add = (pass: string, tag: string, todo: string) => set(pass, tag, get(pass, tag).concat([ todo ]).filter(uniqueFilter));
            export const merge = (pass: string, tag: string, list: string[]) => set(pass, tag, get(pass, tag).concat(list).filter(uniqueFilter));
            export const remove = (pass: string, tag: string, todo: string) => set(pass, tag, get(pass, tag).filter(i => todo !== i));
        }
        export module History
        {
            export const makeKey = (pass: string, task: string) => `pass:(${pass}).task:${task}.history`;
            export const get = (pass: string, task: string): number[] =>
                getStorage(pass).getOrNull<number[]>(makeKey(pass, task)) ?? [];
            export const set = (pass: string, task: string, list: number[]) =>
                getStorage(pass).set(makeKey(pass, task), list);
            export const add = (pass: string, task: string, tick: number | number[]) =>
                set(pass, task, get(pass, task).concat(tick).filter(uniqueFilter).sort(simpleReverseComparer));
        }
    }
    export module Domain
    {
        export const merge = (pass: string, tag: string, todo: string[], _ticks: (number | null)[]) =>
        {
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
                return 10 <= days ?
                    `${days.toLocaleString()} d`:
                    0 < days ?
                        `${days.toLocaleString()} ${locale.map("days")} ${timePart}`:
                        timePart;
            }
        };
        export const tagMap = (tag: string) =>
        {
            switch(tag)
            {
            case "@overall":
            case "@unoverall":
            case "@untagged":
            case "@new":
                return locale.map(tag);
            default:
                return Storage.Tag.decode(tag);
            }
        };
        export const getLastTick = (pass: string, task: string) => Storage.History.get(pass, task)[0] ?? 0;
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
            Storage.History.add(pass, task, getDoneTicks(pass));
        export const todoComparer1 = (entry: ToDoTagEntry) =>
        (a: ToDoEntry, b: ToDoEntry) =>
        {
            if (null !== a.progress && null !== b.progress)
            {
                if (Math.abs(a.elapsed -b.elapsed) <= 12 *60)
                {
                    const rate = Math.min(a.count, b.count) < 5 ? 1.5: 1.2;
                    if (a.RecentlySmartAverage < b.RecentlySmartAverage *rate && b.RecentlySmartAverage < a.RecentlySmartAverage *rate)
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
                if (Math.min(a.progress, b.progress) <= 1.0 / 3.0)
                {
                    if (a.progress < b.progress)
                    {
                        return 1;
                    }
                    if (b.progress < a.progress)
                    {
                        return -1;
                    }
                }
                const a_restTime = (a.RecentlySmartAverage +(a.RecentlyStandardDeviation ?? 0) *2.0) -a.elapsed;
                const b_restTime = (b.RecentlySmartAverage +(b.RecentlyStandardDeviation ?? 0) *2.0) -b.elapsed;
                if (a_restTime < b_restTime)
                {
                    return -1;
                }
                if (b_restTime < a_restTime)
                {
                    return 1;
                }
            }
            if (null === a.progress && null !== b.progress)
            {
                return 1;
            }
            if (null !== a.progress && null === b.progress)
            {
                return -1;
            }
            if (1 < a.count && 1 < b.count)
            {
                if (null === a.progress && null === b.progress)
                {
                    if (null !== a.elapsed && null !== b.elapsed)
                    {
                        if (a.elapsed < b.elapsed)
                        {
                            return -1;
                        }
                        if (b.elapsed < a.elapsed)
                        {
                            return 1;
                        }
                    }
                }
            }
            if (1 === a.count && 1 === b.count)
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
                return 1;
            }
            if (b.count < a.count)
            {
                return -1;
            }
            const aTodoIndex = entry.todo.indexOf(a.todo);
            const bTodoIndex = entry.todo.indexOf(a.todo);
            if (0 <= aTodoIndex && 0 <= bTodoIndex)
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
            if (a.todo < b.todo)
            {
                return 1;
            }
            if (b.todo < a.todo)
            {
                return -1;
            }
            return 0;
        };
        export const todoComparer2 = (list: ToDoEntry[], todoList: string[] = list.map(i => i.todo)) =>
        (a: ToDoEntry, b: ToDoEntry) =>
        {
            if (null !== a.progress && null !== b.progress)
            {
                if (Math.abs(a.elapsed -b.elapsed) <= 12 *60)
                {
                    const rate = Math.min(a.count, b.count) < 5 ? 1.5: 1.2;
                    if (a.RecentlySmartAverage < b.RecentlySmartAverage *rate && b.RecentlySmartAverage < a.RecentlySmartAverage *rate)
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
            }
            const aTodoIndex = todoList.indexOf(a.todo);
            const bTodoIndex = todoList.indexOf(a.todo);
            if (0 <= aTodoIndex && 0 <= bTodoIndex)
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
        export const getRecentlyHistories = (entry: ToDoTagEntry) =>
        {
            const histories: { [todo: string]: { recentries: number[], previous: null | number, count: number, } } = { };
            entry.todo.forEach
            (
                todo =>
                {
                    const full = Storage.History.get(entry.pass, todo);
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
        export const getToDoEntries = (entry: ToDoTagEntry, histories: { [todo: string]: { recentries: number[], previous: null | number, count: number, } }) => entry.todo.map
        (
            todo =>
            {
                const history = histories[todo];
                const calcAverage = (ticks: number[], maxLength: number = ticks.length, length = Math.min(maxLength, ticks.length)) =>
                    ((ticks[0] -ticks[length -1]) /(length -1));
                const result: ToDoEntry =
                {
                    todo,
                    isDefault: false,
                    progress: null,
                    //decayedProgress: null,
                    previous: history.previous,
                    elapsed: null,
                    overallAverage: history.recentries.length <= 1 ? null: calcAverage(history.recentries),
                    RecentlyStandardDeviation: history.recentries.length <= 1 ?
                        null:
                        history.recentries.length <= 2 ?
                            calcAverage(history.recentries) *0.05: // この値を標準偏差として代用
                            Calculate.standardDeviation(Calculate.intervals(history.recentries)),
                    count: history.count,
                    RecentlySmartAverage: history.recentries.length <= 1 ?
                        null:
                        calcAverage(history.recentries, 25),
                };
                return result;
            }
        );
        export const updateProgress = (entry: ToDoTagEntry, list: ToDoEntry[], now: number = Domain.getTicks()) =>
        {
            list.forEach
            (
                item =>
                {
                    if (0 < item.count)
                    {
                        // todo の順番が前後にブレるのを避ける為、１分以内に複数の todo が done された場合、二つ目以降は +1 分ずつズレた時刻で打刻され( getDoneTicks() 関数の実装を参照 )、直後は素直に計算すると経過時間がマイナスになってしまうので、マイナスの場合はゼロにする。
                        item.elapsed = Math.max(0.0, now -item.previous);
                        if (null !== item.RecentlySmartAverage)
                        {
                            item.progress = item.elapsed /(item.RecentlySmartAverage +(item.RecentlyStandardDeviation ?? 0) *2.0);
                            //item.decayedProgress = item.elapsed /(item.smartAverage +(item.standardDeviation ?? 0) *2.0);
                            const overrate = (item.elapsed -(item.RecentlySmartAverage +(item.RecentlyStandardDeviation ?? 0) *3.0)) / item.RecentlySmartAverage;
                            if (0.0 < overrate)
                            {
                                //item.decayedProgress = 1.0 / (1.0 +Math.log2(1.0 +overrate));
                                item.progress = null;
                                item.RecentlySmartAverage = null;
                                item.RecentlyStandardDeviation = null;
                            }
                        }
                    }
                }
            );
            const sorted = (<ToDoEntry[]>JSON.parse(JSON.stringify(list))).sort(todoComparer1(entry));
            const defaultTodo = sorted.sort(todoComparer2(sorted))[0]?.todo;
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
            "background-color: rgba(128,128,128,0.4);":
            1 <= item.progress ?
                `background: #22884466;`:
                backgroundLinerGradient
                (
                    item.progress.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 }),
                    "#22884466",
                    "rgba(128,128,128,0.2)"
                );
        export const label = (label: locale.LocaleKeyType) =>
        ({
            tag: "span",
            className: "label",
            children:
            [
                {
                    tag: "span",
                    className: "locale-parallel",
                    children: locale.parallel(label),
                },
                {
                    tag: "span",
                    className: "locale-map",
                    children: locale.map(label),
                }
            ],
        });
        export const prompt = (message?: string, _default?: string): Promise<string | null> =>
            new Promise(resolve => resolve(window.prompt(message, _default)));
        export const screenCover = (onclick: () => unknown) =>
        {
            const dom = minamo.dom.make(HTMLDivElement)
            ({
                tag: "div",
                className: "screen-cover",
                onclick: () =>
                {
                    minamo.dom.remove(dom);
                    onclick();
                }
            });
            minamo.dom.appendChildren(document.body, dom);
        };
        export const menuButton = async (menu: any) =>
        {
            const popup = minamo.dom.make(HTMLDivElement)
            ({
                tag: "div",
                className: "menu-popup",
                children:
                {
                    tag: "div",
                    className: "menu-popup-body",
                    children: menu
                },
                // onclick: async () =>
                // {
                //     (Array.from(document.getElementsByClassName("screen-cover")) as HTMLDivElement[]).forEach(i => i.click());
                //     popup.classList.add("active");
                //     await timeout(500);
                //     popup.classList.remove("active");
                // },
            });
            const button = minamo.dom.make(HTMLButtonElement)
            ({
                tag: "button",
                className: "menu-button",
                children:
                [
                    await loadSvg("./ellipsis.1024.svg"),
                    {
                        tag: "div",
                        className: "screen-cover",
                    },
                    popup,
                ],
                // onclick: () =>
                // {
                //     popup.classList.add("show");
                //     screenCover(() => popup.classList.remove("show"));
                // },
            });
            return button;
        };
        export const menuItem = (children: minamo.dom.Source, onclick: (event: MouseEvent | TouchEvent) => unknown, className?: string) =>
        ({
            tag: "button",
            className,
            children,
            eventListener:
            {
                "mousedown": onclick,
                "click": onclick,
                "touchstart": onclick,
            },
        });
        export const information = (item: ToDoEntry) =>
        ({
            tag: "div",
            className: "task-information",
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
                            children: null === item.RecentlyStandardDeviation ?
                                Domain.timeStringFromTick(item.RecentlySmartAverage):
                                `${Domain.timeStringFromTick(Math.max(item.RecentlySmartAverage /10, item.RecentlySmartAverage -(item.RecentlyStandardDeviation *2.0)))} 〜 ${Domain.timeStringFromTick(item.RecentlySmartAverage +(item.RecentlyStandardDeviation *2.0))}`,
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
        export const todoItem = async (entry: ToDoTagEntry, item: ToDoEntry) =>
        ({
            tag: "div",
            className: "task-item flex-item",
            children:
            [
                {
                    tag: "div",
                    className: "task-header",
                    children:
                    [
                        {
                            tag: "div",
                            className: "task-title",
                            children: item.todo,
                        },
                        {
                            tag: "div",
                            className: "task-operator",
                            children:
                            [
                                {
                                    tag: "button",
                                    className: item.isDefault ? "default-button main-button": "main-button",
                                    children:
                                    [
                                        {
                                            tag: "span",
                                            className: "locale-parallel",
                                            children: locale.parallel("Done"),
                                        },
                                        {
                                            tag: "span",
                                            className: "locale-map",
                                            children: locale.map("Done"),
                                        }
                                    ],
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
                                await menuButton
                                ([
                                    {
                                        tag: "button",
                                        children: "最後の完了を取り消す",
                                    },
                                    menuItem
                                    (
                                        "名前を編集",
                                        async () =>
                                        {
                                            await minamo.core.timeout(500);
                                            await prompt("ToDo の名前を入力してください", item.todo);
                                        }
                                    ),
                                ]),
                            ],
                        },
                    ],
                },
                information(item),
            ],
        });
        export const dropDownLabel = (options: { list: string[] | { [value:string]:string }, value: string, onChange?: (value: string) => unknown, className?: string}) =>
        {
            const dropdown = minamo.dom.make(HTMLSelectElement)
            ({
                className: options.className,
                children: Array.isArray(options.list) ?
                    options.list.map(i => ({ tag: "option", value:i, children: i, selected: options.value === i ? true: undefined, })):
                    Object.keys(options.list).map(i => ({ tag: "option", value:i, children: options.list[i] ?? i, selected: options.value === i ? true: undefined, })),
                onchange: () =>
                {
                    if (labelSoan.innerText !== dropdown.value)
                    {
                        labelSoan.innerText =Array.isArray(options.list) ?
                            dropdown.value:
                            (options.list[dropdown.value] ?? dropdown.value);
                        options.onChange?.(dropdown.value);
                    }
                },
            });
            const labelSoan = minamo.dom.make(HTMLSpanElement)
            ({
                children: Array.isArray(options.list) ?
                    options.value:
                    (options.list[options.value] ?? options.value),
            });
            const result =
            {
                tag: "label",
                className: options.className,
                children:
                [
                    dropdown,
                    labelSoan
                ]
            };
            return result;
        };
        export const todoScreen = async (entry: ToDoTagEntry, list: ToDoEntry[]) =>
        ({
            tag: "div",
            className: "todo-screen screen",
            children:
            [
                heading
                (
                    "h1",
                    [
                        await applicationIcon(),
                        dropDownLabel
                        ({
                            list: makeObject
                            (
                                ["@overall"].concat(Storage.Tag.get(entry.pass)).concat(["@unoverall", "@untagged", "@new"])
                                .map(i => ({ key:i, value: `${Domain.tagMap(i)} (${Storage.TagMember.get(entry.pass, i).length})`, }))
                            ),
                            value: entry.tag,
                            onChange: async (tag: string) =>
                            {
                                switch(tag)
                                {
                                case "@new":
                                    {
                                        await minamo.core.timeout(500);
                                        const newTag = await prompt("タグの名前を入力してください", "");
                                        if (null === newTag)
                                        {
                                            await minamo.core.timeout(500);
                                            await updateTodoScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag)});
                                        }
                                        else
                                        {
                                            const tag = Storage.Tag.encode(newTag.trim());
                                            Storage.Tag.add(entry.pass, tag);
                                            await updateTodoScreen({ pass: entry.pass, tag, todo: Storage.TagMember.get(entry.pass, tag)});
                                        }
                                    }
                                    break;
                                default:
                                    await updateTodoScreen({ pass: entry.pass, tag, todo: Storage.TagMember.get(entry.pass, tag)});
                                }
                            },
                        }),
                        await menuButton
                        ([
                            {
                                tag: "button",
                                children: "リストを更新",
                                onclick: async () =>
                                {
                                    await updateTodoScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag)});
                                }
                            },
                            Storage.Tag.isSystemTag(entry.tag) ? []:
                                menuItem
                                (
                                    "名前を編集",
                                    async () =>
                                    {
                                        await minamo.core.timeout(500);
                                        await prompt("タグの名前を入力してください", entry.tag);
                                    }
                                ),
                            menuItem
                            (
                                "ToDoを追加",
                                async () =>
                                {
                                    await minamo.core.timeout(500);
                                    const newTodo = await prompt("ToDo の名前を入力してください");
                                    if (null !== newTodo)
                                    {
                                        Storage.TagMember.remove(entry.pass, "@deleted", newTodo);
                                        Storage.TagMember.add(entry.pass, "@overall", newTodo);
                                        Storage.TagMember.add(entry.pass, entry.tag, newTodo);
                                        await updateTodoScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag)});
                                    }
                                }
                            ),
                            {
                                tag: "button",
                                children: "リストをシェア",
                            }
                        ]),
                    ]
                ),
                {
                    tag: "div",
                    className: "column-flex-list todo-list",
                    children: await Promise.all(list.map(item => todoItem(entry, item))),
                },
                // {
                //     tag: "div",
                //     className: "row-flex-list",
                //     children:
                //     [
                //         {
                //             tag: "div",
                //             className: "flex-item",
                //             children:
                //             {
                //                 tag: "button",
                //                 className: "long-button",
                //                 children: "Undo",
                //                 onclick: () =>
                //                 {
                //                 }
                //             },
                //         },
                //         {
                //             tag: "div",
                //             className: "flex-item",
                //             children:
                //             {
                //                 tag: "button",
                //                 className: "long-button",
                //                 children: "Add",
                //                 onclick: () =>
                //                 {
                //                 }
                //             },
                //         },
                //         {
                //             tag: "div",
                //             className: "flex-item",
                //             children:
                //             {
                //                 tag: "button",
                //                 className: "long-button",
                //                 children: "Edit",
                //                 onclick: () =>
                //                 {
                //                 }
                //             },
                //         },
                //     ],
                // }
            ]
        });
        export const updateTodoScreen = async (entry: ToDoTagEntry) =>
        {
            document.title = `${Domain.tagMap(entry.tag)} ${applicationTitle}`;
            const histories = Domain.getRecentlyHistories(entry);
            const list = Domain.getToDoEntries(entry, histories);
            Domain.updateProgress(entry, list);
            list.sort(Domain.todoComparer1(entry));
            list.sort(Domain.todoComparer2(list));
            console.log({histories, list}); // これは消さない！！！
            let lastUpdate = Storage.lastUpdate;
            const updateWindow = async () =>
            {
                Domain.updateProgress(entry, list);
                if (lastUpdate === Storage.lastUpdate)
                {
                    (
                        Array.from
                        (
                            (
                                document
                                    .getElementsByClassName("todo-screen")[0]
                                    .getElementsByClassName("todo-list")[0] as HTMLDivElement
                            ).childNodes
                        ) as HTMLDivElement[]
                    ).forEach
                    (
                        (dom, index) =>
                        {
                            const item = list[index];
                            const button = dom.getElementsByClassName("task-operator")[0].getElementsByClassName("main-button")[0] as HTMLButtonElement;
                            button.classList.toggle("default-button", item.isDefault);
                            const information = dom.getElementsByClassName("task-information")[0] as HTMLDivElement;
                            information.setAttribute("style", Render.progressStyle(item));
                            (information.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0] as HTMLSpanElement).innerText = Domain.timeStringFromTick(item.elapsed);
                        }
                    );
                }
                else
                {
                    updateTodoScreen(entry);
                }
            };
            showWindow(await todoScreen(entry, list), updateWindow);
        };
        export const editScreen = (tag: string, pass: string, todo: string[]) =>
        {
            const tagDiv = minamo.dom.make(HTMLInputElement)
            ({
                tag: "input",
                className: "edit-tag-input",
                value: tag,
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
                            tagDiv,
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
                        className: "default-button",
                        children: "save",
                        onclick: () =>
                        {
                            updateTodoScreen
                            ({
                                tag: tagDiv.value,
                                pass: passDiv.value,
                                todo: todoDom.value.split("\n").map(i => i.trim())
                            });
                        }
                    },
                ]
            };
            return result;
        };
        export const updateEditScreen = (tag: string, pass: string, todo: string[]) =>
            showWindow(editScreen(tag, pass, todo), () => { });
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
                heading
                (
                    "h1",
                    [
                        await applicationIcon(),
                        `${document.title}`,
                        await menuButton("ポップアップメニュー"),
                    ]
                ),
                await applicationIcon(),
            ],
        });
        export const updateWelcomeScreen = async (pass: string) =>
        {
            document.title = applicationTitle;
            showWindow(await welcomeScreen(pass), () => { });
        };
        export let updateWindow: () => unknown;
        let updateWindowTimer = undefined;
        export const showWindow = async (screen: any, updateWindow: () => unknown) =>
        {
            Render.updateWindow = updateWindow;
            if (undefined === updateWindowTimer)
            {
                setInterval
                (
                    () => Render.updateWindow?.(),
                    Domain.TimeAccuracy
                );
            }
            minamo.dom.replaceChildren
            (
                document.getElementById("body"),
                screen
            );
            resizeFlexList();
        };
        export const resizeFlexList = () =>
        {
            let minColumns = 1 +Math.floor(window.innerWidth / 780);
            let maxColumns = Math.max(minColumns, Math.floor(window.innerWidth / 390));
            let minItemWidth = window.innerWidth;
            (Array.from(document.getElementsByClassName("column-flex-list")) as HTMLDivElement[]).forEach
            (
                list =>
                {
                    const length = list.childNodes.length;
                    if (length <= 1 || maxColumns <= 1)
                    {
                        list.style.height = undefined;
                    }
                    else
                    {
                        const height = window.innerHeight -list.offsetTop;
                        const itemHeight = (list.childNodes[0] as HTMLElement).offsetHeight;
                        const columns = Math.min(maxColumns, Math.ceil(length / Math.max(1.0, Math.floor(height / itemHeight))));
                        const row = Math.max(Math.ceil(length /columns), Math.floor(height / itemHeight));
                        list.style.height = `${row *(itemHeight -1)}px`;
                    }
                    const itemWidth = (list.childNodes[0] as HTMLElement).offsetWidth;
                    if (itemWidth < minItemWidth)
                    {
                        minItemWidth = itemWidth;
                    }
                }
            );
            const FontRemUnit = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const border = FontRemUnit *23;
            minItemWidth -= 18; // padding & borer
            document.body.classList.toggle("locale-parallel-on", border < minItemWidth);
            document.body.classList.toggle("locale-parallel-off", minItemWidth <= border);
        };
        let onWindowResizeTimestamp = 0;
        export const onWindowResize = () =>
        {
            const timestamp = onWindowResizeTimestamp = new Date().getTime();
            setTimeout
            (
                () =>
                {
                    if (timestamp === onWindowResizeTimestamp)
                    {
                        resizeFlexList();
                    }
                },
                100,
            );
        };
        let onUpdateStorageCount = 0;
        export const onUpdateStorage = () =>
        {
            const lastUpdate = Storage.lastUpdate = new Date().getTime();
            const onUpdateStorageCountCopy = onUpdateStorageCount = onUpdateStorageCount +1;
            setTimeout
            (
                () =>
                {
                    if (lastUpdate === Storage.lastUpdate && onUpdateStorageCountCopy === onUpdateStorageCount)
                    {
                        updateWindow?.();
                    }
                },
                50,
            );
        };
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
        const tag = urlParams["title"] ?? "untitled";
        const pass = urlParams["pass"] ?? `${Storage.sessionPassPrefix}:${new Date().getTime()}`;
        const todo = JSON.parse(urlParams["todo"] ?? "null") as string[] | null;
        const history = JSON.parse(urlParams["history"] ?? "null") as (number | null)[] | null;
        window.addEventListener('resize', Render.onWindowResize);
        window.addEventListener('storage', Render.onUpdateStorage);
        if ((todo?.length ?? 0) <= 0)
        {
            switch(hash)
            {
            // case "import":
            //     dom.updateImportScreen(pass);
            //     break;
            case "edit":
                console.log("show edit screen");
                Render.updateEditScreen(tag, pass, []);
                break;
            default:
                console.log("show welcome screen");
                await Render.updateWelcomeScreen(pass);
                break;
            }
        }
        else
        {
            Domain.merge(pass, tag, todo, history);
            switch(hash)
            {
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
                Render.updateTodoScreen({ tag: tag, pass, todo });
                break;
            }
        }
    };
}
