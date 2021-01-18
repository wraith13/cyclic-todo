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
export const simpleComparer = minamo.core.comparer.basic;
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
    export const sum = (ticks: number[]) => ticks.length <= 0 ?
        null:
        ticks.reduce((a, b) => a +b, 0);
    export const average = (ticks: number[]) => ticks.length <= 0 ?
        null:
        sum(ticks) /ticks.length;
    export const standardDeviation = (ticks: number[], average: number = Calculate.average(ticks)) =>
        Math.sqrt(Calculate.average(ticks.map(i => (i -average) ** 2)));
    export const standardScore = (average: number, standardDeviation: number, target: number) =>
        (10 * (target -average) /standardDeviation) +50;
    export const expectedNext = (ticks: number[]) =>
    {
        const intervals: number[] = Calculate.intervals(ticks).reverse();
        const average: number = Calculate.average(intervals);
        const standardDeviation: number = Calculate.standardDeviation(intervals, average);
        if (10 <= intervals.length && (average *0.1) < standardDeviation)
        {
            const waveLenghResolution = 10;
            const angleResolution = 10;
            const base = 2 *standardDeviation;
            const regulatedIntervals = intervals.map(i => Math.min(1.0, Math.max(-1.0, (i -average) /base)));
            // const regulatedAverage = Calculate.average(regulatedIntervals);
            // const regulatedStandardDeviation = Calculate.standardDeviation(regulatedIntervals, regulatedAverage);
            const primeWaveLength = Math.pow(Calculate.phi, Math.ceil(Math.log(regulatedIntervals.length) /Math.log(Calculate.phi)));
            let diff = regulatedIntervals.map(i => i);
            const rates: number[][] = [];
            const calcLevel = (angle: number, waveLength: number, index: number) => Math.sin(((index /waveLength) +(angle /angleResolution)) *(Math.PI *2));
            //const calcLevel = (_offset: number, waveLength: number, index: number) => Math.sin((index /waveLength) *(Math.PI *2));
            const calcRate = (values: number[], offset: number, waveLength: number) => Calculate.average(values.map((value, index) => Math.min(1.0, Math.max(-1.0, value / calcLevel(offset, waveLength, index)))));
            const calcAccuracy = (values: number[]) => Calculate.average(values.map(i => 1 -Math.abs(i)));
            const calcWorstAccuracy = (values: number[]) => values.map(i => 1 -Math.abs(i)).reduce((a, b) => a < b ? a: b, 1);
            const initAccuracy = calcAccuracy(diff);
            const initWorstAccuracy = calcWorstAccuracy(diff);
            console.log(diff);
            let wave = 0;
            //while(Math.pow(Calculate.phi, offset /resolution) <= primeWaveLength)
            let previousAccuracy = initAccuracy;
            let previousWorstAccuracy = initWorstAccuracy;
            while(wave < waveLenghResolution)
            {
                const waveLength = primeWaveLength /Math.pow(Calculate.phi, wave /waveLenghResolution);
                const currentRates: number[] = [];
                for(let angle = 0; angle < angleResolution; ++angle)
                {
                    const rate = calcRate(diff, angle, waveLength);
                    const nextDiff = diff.map((value, index) => value -(rate *calcLevel(angle, waveLength, index)));
                    //console.log(`rate: ${rate}, accuracy: ${calcAccuracy(diff).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}`);
                    //console.log({ waveLength, diff, });
                    let nextAccuracy = calcAccuracy(nextDiff);
                    let nextWorstAccuracy = calcWorstAccuracy(nextDiff);
                    if (previousAccuracy < nextAccuracy && previousWorstAccuracy < nextWorstAccuracy)
                    {
                        previousAccuracy = nextAccuracy;
                        previousWorstAccuracy = nextWorstAccuracy;
                        diff = nextDiff;
                        currentRates.push(rate);
                    }
                    else
                    {
                        currentRates.push(0);
                    }
                }
                rates.push(currentRates);
                ++wave;
            }
            const finalAccuracy = calcAccuracy(diff);
            const finalWorstAccuracy = calcWorstAccuracy(diff);
            console.log(diff);
            console.log(rates);
            console.log(`init accuracy: ${initAccuracy.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}, ${initWorstAccuracy.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}`);
            console.log(`final accuracy: ${finalAccuracy.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}, ${finalWorstAccuracy.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}`);
            if (initAccuracy < finalAccuracy)
            {
                const next = ticks[0] +average +
                (
                    Calculate.sum
                    (
                        rates.map
                        (
                            (currentRates, wave) =>
                            Calculate.sum
                            (
                                currentRates.map
                                (
                                    (rate, angle) => 0 === rate ? 0:
                                        rate *calcLevel(angle, primeWaveLength /Math.pow(Calculate.phi, wave /waveLenghResolution), regulatedIntervals.length)
                                )
                            )
                        )
                    ) *base
                );
                return next;
            }
// console.log({intervals, average});
//             const checkPoints: number[] = [];
//             let i = 0;
//             let previousDiffAccumulation = (intervals[i] -average);
//             while(++i < intervals.length /2)
//             {
//                 const diffAccumulation = previousDiffAccumulation +(intervals[i] -average);
// console.log({diffAccumulation, previousDiffAccumulation, current: (intervals[i] -average)});
//                 if (Math.abs(previousDiffAccumulation + diffAccumulation) < Math.abs(previousDiffAccumulation) +Math.abs(diffAccumulation))
//                 {
//                     checkPoints.push(intervals[i]);
//                     if (10 <= checkPoints.length)
//                     {
//                         break;
//                     }
//                     previousDiffAccumulation = 0;
//                 }
//                 else
//                 {
//                     previousDiffAccumulation = diffAccumulation;
//                 }
//             }
// console.log(`checkPoints.length: ${checkPoints.length}, intervals.length: ${intervals.length}`);
//             if (3 <= checkPoints.length)
//             {
//                 const checkPointsAverage = Calculate.average(intervals);
//                 const checkPointsstandardDeviation = Calculate.standardDeviation(checkPoints, checkPointsAverage);
// console.log({checkPointsstandardDeviation, standardDeviation});
//                 if (checkPointsstandardDeviation < standardDeviation)
//                 {
//                     return ticks[0] +checkPointsAverage +checkPointsstandardDeviation;
//                 }
//             }
        }
        return null;
    };
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
        pass: string;
        tag: string;
        todo: string[];
    }
    interface ToDoEntry
    {
        task: string;
        isDefault: boolean;
        progress: null | number;
        //decayedProgress: null | number;
        previous: null | number;
        //expectedNext: null | number;
        elapsed: null | number;
        overallAverage: null | number;
        RecentlyStandardDeviation: null | number;
        RecentlySmartAverage: null | number;
        count: number;
    }
    export module Storage
    {
        export const sessionPassPrefix = "@Session";
        export const isSessionPass = (pass: string) => pass.startsWith(sessionPassPrefix);
        export const getStorage = (pass: string) => isSessionPass(pass) ? minamo.sessionStorage: minamo.localStorage;
        export let lastUpdate = 0;
        export const exportJson = (pass: string) =>
        {
            const specification = "https://github.com/wraith13/cyclic-todo/README.md";
            const tags: { [tag: string]: string[] } = { };
            [
                "@overall",
                "@unoverall",
                "@deleted",
            ].concat(Tag.get(pass))
            .forEach
            (
                tag => tags[tag] = TagMember.getRaw(pass, tag)
            );
            const todos = TagMember.getRaw(pass, "@overall");
            const histories: { [todo: string]: number[] } = { };
            todos
            .forEach
            (
                todo => histories[todo] = History.get(pass, todo)
            );
            const json =
            {
                specification,
                pass,
                todos,
                tags,
                histories,
            };
            return JSON.stringify(json);
        };
        export const importJson = (_json: string) =>
        {
        };
        export module Pass
        {
            export const key = `pass.list`;
            export const get = () => minamo.localStorage.getOrNull<string[]>(key) ?? [];
            export const set = (passList: string[]) => minamo.localStorage.set(key, passList);
            export const add = (pass: string) => set(get().concat([ pass ]).filter(uniqueFilter));
            export const remove = (pass: string) => set(get().filter(i => pass !== i));
            export const generate = (seed: number = new Date().getTime()): string =>
            {
                const result = ("" +((seed *13738217) ^ ((seed %387960371999) >> 5 ))).slice(-8);
                if (0 < Pass.get().filter(i => i === result).length)
                {
                    return generate(seed +parseInt(result));
                }
                Storage.Pass.add(result);
                return result;
            };
        }
        export module Tag
        {
            export const isSystemTag = (tag: string) => tag.startsWith("@") && ! tag.startsWith("@=") && ! isSublist(tag);
            export const isSublist = (tag: string) => tag.startsWith("@:");
            export const encode = (tag: string) => tag.replace(/@/, "@=");
            export const decode = (tag: string) => tag.replace(/@=/, "@");
            export const makeKey = (pass: string) => `pass:(${pass}).tag.list`;
            export const get = (pass: string) =>
                getStorage(pass).getOrNull<string[]>(makeKey(pass)) ?? [];
            export const set = (pass: string, list: string[]) =>
                getStorage(pass).set(makeKey(pass), list.filter(i => ! isSystemTag(i))); // システムタグは万が一にも登録させない
            export const add = (pass: string, tag: string) => set(pass, get(pass).concat([ tag ]).filter(uniqueFilter));
            export const remove = (pass: string, tag: string) => set(pass, get(pass).filter(i => tag !== i));
            export const getByTodo = (pass: string, todo: string) => ["@overall"].concat(get(pass)).concat(["@unoverall", "@untagged"]).filter(tag => 0 < TagMember.get(pass, tag).filter(i => todo === i).length);
            export const rename = (pass: string, oldTag: string, newTag: string) =>
            {
                if (0 < newTag.length && ! isSystemTag(oldTag) && ! isSystemTag(newTag) && oldTag !== newTag && get(pass).indexOf(newTag) < 0)
                {
                    add(pass, newTag);
                    TagMember.set(pass, newTag, TagMember.getRaw(pass, oldTag));
                    remove(pass, oldTag);
                    TagMember.removeKey(pass, oldTag);
                    return true;
                }
                return false;
            };
        }
        export module TagMember
        {
            export const makeKey = (pass: string, tag: string) => `pass:(${pass}).tag:(${tag})`;
            export const getRaw = (pass: string, tag: string) =>
                getStorage(pass).getOrNull<string[]>(makeKey(pass, tag)) ?? [];
            export const get = (pass: string, tag: string): string[] =>
            {
                const deleted = getRaw(pass, "@deleted");
                switch(tag)
                {
                case "@overall":
                    {
                        const unoverall = getRaw(pass, "@unoverall").concat(deleted);
                        return getRaw(pass, "@overall").filter(i => unoverall.indexOf(i) < 0);
                    }
                case "@untagged":
                    {
                        const tagged = Tag.get(pass).map(tag => get(pass, tag)).reduce((a, b) => a.concat(b), []).concat(deleted);
                        return getRaw(pass, "@overall").filter(i => tagged.indexOf(i) < 0);
                    }
                case "@deleted":
                    return deleted;
                case "@unoverall":
                default:
                    return getRaw(pass, tag).filter(i => deleted.indexOf(i) < 0);
                }
            };
            export const set = (pass: string, tag: string, list: string[]) =>
                getStorage(pass).set(makeKey(pass, tag), list);
            export const removeKey = (pass: string, tag: string) => getStorage(pass).remove(makeKey(pass, tag));
            export const add = (pass: string, tag: string, todo: string) => set(pass, tag, get(pass, tag).concat([ todo ]).filter(uniqueFilter));
            export const merge = (pass: string, tag: string, list: string[]) => set(pass, tag, get(pass, tag).concat(list).filter(uniqueFilter));
            export const remove = (pass: string, tag: string, todo: string) => set(pass, tag, get(pass, tag).filter(i => todo !== i));
        }
        export module Task
        {
            export const encode = (task: string) => task.replace(/@/, "@=");
            export const decode = (task: string) => task.replace(/@=/, "@").replace(/@:/, ": ");
            export const getSublist = (task: string) =>
            {
                const split = task.split("@:");
                return 2 <= split.length ? split[0]: null;
            };
            export const getBody = (task: string) =>
            {
                const split = task.split("@:");
                return 2 <= split.length ? split[1]: task;
            };
            export const add = (pass: string, task: string) =>
            {
                Storage.TagMember.remove(pass, "@deleted", task);
                Storage.TagMember.add(pass, "@overall", task);
            };
            export const rename = (pass: string, oldTask: string, newTask: string) =>
            {
                if (0 < newTask.length && oldTask !== newTask && TagMember.getRaw(pass, "@overall").indexOf(newTask) < 0)
                {
                    Tag.getByTodo(pass, oldTask).forEach
                    (
                        tag =>
                        {
                            TagMember.remove(pass, tag, oldTask);
                            TagMember.add(pass, tag, newTask);
                        }
                    );
                    History.set(pass, newTask, History.get(pass, oldTask));
                    History.remove(pass, oldTask);
                    return true;
                }
                return false;
            };
        }
        export module History
        {
            export const makeKey = (pass: string, task: string) => `pass:(${pass}).task:${task}.history`;
            export const get = (pass: string, task: string): number[] =>
                getStorage(pass).getOrNull<number[]>(makeKey(pass, task)) ?? [];
            export const set = (pass: string, task: string, list: number[]) =>
                getStorage(pass).set(makeKey(pass, task), list);
            export const remove = (pass: string, task: string) =>
                getStorage(pass).remove(makeKey(pass, task));
            export const add = (pass: string, task: string, tick: number | number[]) =>
                set(pass, task, get(pass, task).concat(tick).filter(uniqueFilter).sort(simpleReverseComparer));
            // export const rename = (pass: string, oldTask: string, newTask: string) =>
            // {
            //     if (0 < newTask.length && oldTask !== newTask && undefined === getStorage(pass).getRaw(makeKey(pass, newTask)))
            //     {
            //         set(pass, newTask, get(pass, oldTask));
            //         remove(pass, oldTask);
            //         return true;
            //     }
            //     return false;
            // };
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
                return `${date.getFullYear()}-${("0" +(date.getMonth() +1)).substr(-2)}-${("0" +date.getDate()).substr(-2)} ${timeStringFromTick(tick -getTicks(date))}`;
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
                    `${days.toLocaleString()} ${locale.map("days")}`:
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
            case "@deleted":
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
        export const tagComparer = (pass: string) => minamo.core.comparer.make<string>
        (
            tag => -Storage.TagMember.get(pass, tag).map(todo => Storage.History.get(pass, todo).length).reduce((a, b) => a +b, 0)
        );
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
            const aTodoIndex = entry.todo.indexOf(a.task);
            const bTodoIndex = entry.todo.indexOf(a.task);
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
            if (a.task < b.task)
            {
                return 1;
            }
            if (b.task < a.task)
            {
                return -1;
            }
            return 0;
        };
        export const todoComparer2 = (list: ToDoEntry[], todoList: string[] = list.map(i => i.task)) =>
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
            const aTodoIndex = todoList.indexOf(a.task);
            const bTodoIndex = todoList.indexOf(a.task);
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
        // export const todoComparer2 = (list: ToDoEntry[], todoList: string[] = list.map(i => i.todo)) =>
        // minamo.core.comparer.make<ToDoEntry>
        // ([
        //     { condition: (a, b) => null !== a.progress && null !== b.progress ......., getter: a => -a.elapsed },
        //     { getter: a => todoList.indexOf(a.todo), valueCondition: (a, b) => 0 <= a && 0 <= b, }
        // ]);
        export const getRecentlyHistory = (pass: string, task: string) =>
        {
            const full = Storage.History.get(pass, task);
            const result =
            {
                recentries: full.filter((_, index) => index < 25),
                previous: full.length <= 0 ? null: full[0],
                //average: full.length <= 1 ? null: (full[0] -full[full.length -1]) / (full.length -1),
                count: full.length,
            };
            return result;
        };
        export const getToDoEntry = (task: string, history: { recentries: number[], previous: null | number, count: number, }) =>
        {
            const calcAverage = (ticks: number[], maxLength: number = ticks.length, length = Math.min(maxLength, ticks.length)) =>
                ((ticks[0] -ticks[length -1]) /(length -1));
            const result: ToDoEntry =
            {
                task,
                isDefault: false,
                progress: null,
                //decayedProgress: null,
                previous: history.previous,
                //expectedNext: Calculate.expectedNext(Storage.History.get(entry.pass, todo)),
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
        };
        export const updateProgress = (item: ToDoEntry, now: number = Domain.getTicks()) =>
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
        };
        export const updateListProgress = (entry: ToDoTagEntry, list: ToDoEntry[], now: number = Domain.getTicks()) =>
        {
            list.forEach(item => updateProgress(item, now));
            const sorted = (<ToDoEntry[]>JSON.parse(JSON.stringify(list))).sort(todoComparer1(entry));
            const defaultTodo = sorted.sort(todoComparer2(sorted))[0]?.task;
            list.forEach(item => item.isDefault = defaultTodo === item.task);
        };
    }
    export module Render
    {
        export const internalLink = (data: { className?: string, href: string, children: minamo.dom.Source}) =>
        ({
            tag: "a",
            className: data.className,
            href: data.href,
            children: data.children,
            onclick: () =>
            {
                showUrl(data.href);
                return false;
            }
        });
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
                    await loadSvgOrCache("./ellipsis.1024.svg"),
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
                            className: "value monospace",
                            children: Domain.dateStringFromTick(item.previous),
                        }
                    ],
                },
                // {
                //     tag: "div",
                //     className: "task-expected-next",
                //     children:
                //     [
                //         label("expected next"),
                //         {
                //             tag: "span",
                //             className: "value  monospace",
                //             children: Domain.dateStringFromTick(item.expectedNext),
                //         }
                //     ],
                // },
                {
                    tag: "div",
                    className: "task-interval-average",
                    children:
                    [
                        label("expected interval"),
                        {
                            tag: "span",
                            className: "value monospace",
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
                            className: "value monospace",
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
                            className: "value monospace",
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
                            className: "value monospace",
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
                            className: "value monospace",
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
                        internalLink
                        ({
                            className: "task-title",
                            href: location.href.split("?")[0] +`?pass=${entry.pass}&todo=${item.task}`,
                            children: item.task
                        }),
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
                                            Domain.done(entry.pass, item.task);
                                            await showListScreen(entry);
                                        }
                                    }
                                },
                                await menuButton
                                ([
                                    {
                                        tag: "button",
                                        children: "🚫 最後の完了を取り消す",
                                    },
                                    menuItem
                                    (
                                        "名前を編集",
                                        async () =>
                                        {
                                            await minamo.core.timeout(500);
                                            const newTask = (await prompt("ToDo の名前を入力してください", item.task)).trim();
                                            if (0 < newTask.length && newTask !== item.task)
                                            {
                                                if (Storage.Task.rename(entry.pass, item.task, newTask))
                                                {
                                                    await showListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag)});
                                                }
                                                else
                                                {
                                                    window.alert("その名前の ToDo は既に存在しています。");
                                                }
                                            }
                                        }
                                    ),
                                    "@deleted" === entry.tag ?
                                        menuItem
                                        (
                                            "復元",
                                            async () =>
                                            {
                                                Storage.TagMember.remove(entry.pass, "@deleted", item.task);
                                                await showListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag)});
                                            }
                                        ):
                                        menuItem
                                        (
                                            "削除",
                                            async () =>
                                            {
                                                Storage.TagMember.add(entry.pass, "@deleted", item.task);
                                                await showListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag)});
                                            }
                                        ),
                                ]),
                            ],
                        },
                    ],
                },
                {
                    tag: "div",
                    className: "task-tags",
                    children: Storage.Tag.getByTodo(entry.pass, item.task).map
                    (
                        tag => internalLink
                        ({
                            className: "tag",
                            href: location.href.split("?")[0] +`?pass=${entry.pass}&tag=${tag}`,
                            children: Domain.tagMap(tag),
                        })
                    )
                },
                information(item),
            ],
        });
        export const tickItem = async (_pass: string, _item: ToDoEntry, tick: number) =>
        ({
            tag: "div",
            className: "tick-item flex-item  monospace",
            children: Domain.dateStringFromTick(tick),
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
        export const listScreen = async (entry: ToDoTagEntry, list: ToDoEntry[]) =>
        ({
            tag: "div",
            className: "list-screen screen",
            children:
            [
                heading
                (
                    "h1",
                    [
                        internalLink
                        ({
                            href: "@overall" === entry.tag ? "./": `./?pass=${entry.pass}&tag=@overall`,
                            children: await applicationIcon(),
                        }),
                        dropDownLabel
                        ({
                            list: makeObject
                            (
                                ["@overall"].concat(Storage.Tag.get(entry.pass).sort(Domain.tagComparer(entry.pass))).concat(["@unoverall", "@untagged", "@deleted", "@new"])
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
                                            await showListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag)});
                                        }
                                        else
                                        {
                                            const tag = Storage.Tag.encode(newTag.trim());
                                            Storage.Tag.add(entry.pass, tag);
                                            await showListScreen({ pass: entry.pass, tag, todo: Storage.TagMember.get(entry.pass, tag)});
                                        }
                                    }
                                    break;
                                default:
                                    await showListScreen({ pass: entry.pass, tag, todo: Storage.TagMember.get(entry.pass, tag)});
                                }
                            },
                        }),
                        await menuButton
                        ([
                            Storage.Tag.isSystemTag(entry.tag) ? []:
                                menuItem
                                (
                                    "名前を編集",
                                    async () =>
                                    {
                                        await minamo.core.timeout(500);
                                        const newTag = await prompt("タグの名前を入力してください", entry.tag);
                                        if (0 < newTag.length && newTag !== entry.tag)
                                        {
                                            if (Storage.Tag.rename(entry.pass, entry.tag, newTag))
                                            {
                                                await showListScreen({ pass: entry.pass, tag: newTag, todo: Storage.TagMember.get(entry.pass, newTag)});
                                            }
                                            else
                                            {
                                                window.alert("その名前のタグは既に存在しています。");
                                            }
                                        }
                                    }
                                ),
                            "@deleted" === entry.tag ?
                            [
                                menuItem
                                (
                                    "🚫 完全に削除",
                                    async () =>
                                    {
                                    }
                                ),
                            ]:
                            [
                                menuItem
                                (
                                    locale.parallel("New ToDo"),
                                    async () =>
                                    {
                                        await minamo.core.timeout(500);
                                        const newTask = await prompt("ToDo の名前を入力してください");
                                        if (null !== newTask)
                                        {
                                            Storage.Task.add(entry.pass, newTask);
                                            Storage.TagMember.add(entry.pass, entry.tag, newTask);
                                            await showListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag)});
                                        }
                                    }
                                ),
                                {
                                    tag: "button",
                                    children: "🚫 リストをシェア",
                                }
                            ],
                            menuItem
                            (
                                "エクスポート",
                                async () =>
                                {
                                    await showExportScreen(entry.pass);
                                }
                            ),
                        ]),
                    ]
                ),
                {
                    tag: "div",
                    className: "column-flex-list todo-list",
                    children: await Promise.all(list.map(item => todoItem(entry, item))),
                },
                "@deleted" !== entry.tag ?
                    {
                        tag: "div",
                        className: "button-list",
                        children:
                        {
                            tag: "button",
                            className: list.length <= 0 ? "default-button main-button long-button":  "main-button long-button",
                            children: locale.parallel("New ToDo"),
                            onclick: async () =>
                            {
                                const newTask = await prompt("ToDo の名前を入力してください");
                                if (null !== newTask)
                                {
                                    Storage.Task.add(entry.pass, newTask);
                                    Storage.TagMember.add(entry.pass, entry.tag, newTask);
                                    await showListScreen({ pass: entry.pass, tag: entry.tag, todo: Storage.TagMember.get(entry.pass, entry.tag)});
                                }
                            }
                        },
                    }:
                    0 < list.length ?
                        {
                            tag: "div",
                            className: "button-list",
                            children:
                            {
                                tag: "button",
                                className: "default-button main-button long-button",
                                children: "🚫 完全に削除",
                                onclick: async () =>
                                {
                                }
                            },
                        }:
                        {
                            tag: "div",
                            className: "button-list",
                            children: "ごみ箱は空です。",
                        }
            ]
        });
        export const showListScreen = async (entry: ToDoTagEntry) =>
        {
            document.title = `${Domain.tagMap(entry.tag)} ${applicationTitle}`;
            const list = entry.todo.map(task => Domain.getToDoEntry(task, Domain.getRecentlyHistory(entry.pass, task)));
            Domain.updateListProgress(entry, list);
            list.sort(Domain.todoComparer1(entry));
            list.sort(Domain.todoComparer2(list));
            let lastUpdate = Storage.lastUpdate;
            const updateWindow = async () =>
            {
                Domain.updateListProgress(entry, list);
                if (lastUpdate === Storage.lastUpdate)
                {
                    (
                        Array.from
                        (
                            (
                                document
                                    .getElementsByClassName("list-screen")[0]
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
                    showListScreen(entry);
                }
            };
            showWindow(await listScreen(entry, list), updateWindow);
        };
        export const todoScreen = async (pass: string, item: ToDoEntry, ticks: number[]) =>
        ({
            tag: "div",
            className: "todo-screen screen",
            children:
            [
                heading
                (
                    "h1",
                    [
                        internalLink
                        ({
                            href: `./?pass=${pass}&tag=@overall`,
                            children: await applicationIcon(),
                        }),
                        `${item.task}`,
                        await menuButton
                        ([
                            menuItem
                            (
                                "名前を編集",
                                async () =>
                                {
                                    await minamo.core.timeout(500);
                                    const newTask = (await prompt("ToDo の名前を入力してください", item.task)).trim();
                                    if (0 < newTask.length && newTask !== item.task)
                                    {
                                        if (Storage.Task.rename(pass, item.task, newTask))
                                        {
                                            await todoScreen(pass, Domain.getToDoEntry(newTask, Domain.getRecentlyHistory(pass, newTask)), Storage.History.get(pass, newTask));
                                        }
                                        else
                                        {
                                            window.alert("その名前の ToDo は既に存在しています。");
                                        }
                                    }
                                }
                            ),
                            0 <= Storage.TagMember.get(pass, "@deleted").indexOf(item.task) ?
                                menuItem
                                (
                                    "復元",
                                    async () =>
                                    {
                                        Storage.TagMember.remove(pass, "@deleted", item.task);
                                        await todoScreen(pass, Domain.getToDoEntry(item.task, Domain.getRecentlyHistory(pass, item.task)), Storage.History.get(pass, item.task));
                                    }
                                ):
                                menuItem
                                (
                                    "削除",
                                    async () =>
                                    {
                                        Storage.TagMember.add(pass, "@deleted", item.task);
                                        await todoScreen(pass, Domain.getToDoEntry(item.task, Domain.getRecentlyHistory(pass, item.task)), Storage.History.get(pass, item.task));
                                    }
                                ),
                            {
                                tag: "button",
                                children: "🚫 ToDo をシェア",
                            },
                            menuItem
                            (
                                "エクスポート",
                                async () =>
                                {
                                    await showExportScreen(pass);
                                }
                            ),
                        ]),
                    ]
                ),
                {
                    tag: "div",
                    className: "task-item",
                    children:
                    [
                        {
                            tag: "div",
                            className: "task-tags",
                            children: Storage.Tag.getByTodo(pass, item.task).map
                            (
                                tag => internalLink
                                ({
                                    className: "tag",
                                    href: location.href.split("?")[0] +`?pass=${pass}&tag=${tag}`,
                                    children: Domain.tagMap(tag),
                                })
                            )
                        },
                        information(item),
                    ],
                },
                {
                    tag: "div",
                    className: "column-flex-list tick-list",
                    children: await Promise.all(ticks.map(tick => tickItem(pass, item, tick))),
                },
                0 <= Storage.TagMember.get(pass, "@deleted").indexOf(item.task) || Storage.isSessionPass(pass) ?
                    []:
                    {
                        tag: "div",
                        className: "button-list",
                        children:
                        {
                            tag: "button",
                            className: "default-button main-button long-button",
                            children: locale.parallel("Done"),
                            onclick: async () =>
                            {
                                Domain.done(pass, item.task);
                                await showTodoScreen(pass, item.task);
                            }
                        },
                    }
            ]
        });
        export const showTodoScreen = async (pass: string, task: string) =>
        {
            document.title = `${task} ${applicationTitle}`;
            const item = Domain.getToDoEntry(task, Domain.getRecentlyHistory(pass, task));
            Domain.updateProgress(item);
            let lastUpdate = Storage.lastUpdate;
            const updateWindow = async () =>
            {
                Domain.updateProgress(item);
                if (lastUpdate === Storage.lastUpdate)
                {
                    const dom = document
                        .getElementsByClassName("todo-screen")[0]
                        .getElementsByClassName("task-item")[0] as HTMLDivElement;
                    const information = dom.getElementsByClassName("task-information")[0] as HTMLDivElement;
                    information.setAttribute("style", Render.progressStyle(item));
                    (information.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0] as HTMLSpanElement).innerText = Domain.timeStringFromTick(item.elapsed);
                }
                else
                {
                    showTodoScreen(pass, task);
                }
            };
            showWindow(await todoScreen(pass, item, Storage.History.get(pass, task)), updateWindow);
        };
        const loadSvg = async (path : string): Promise<string> => new Promise<string>
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
                                resolve(request.responseText);
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
        const svgCache: { [path: string]: string} = { };
        const loadSvgOrCache = async (path : string): Promise<SVGElement> =>
            new DOMParser().parseFromString(svgCache[path] ?? (svgCache[path] = await loadSvg(path)), "image/svg+xml").documentElement as any;
        export const showExportScreen = async (pass: string) =>
        {
            document.title = applicationTitle;
            showWindow(await exportScreen(pass), () => { });
        };
        export const exportScreen = async (pass: string) =>
        ({
            tag: "div",
            className: "export-screen screen",
            children:
            [
                heading
                (
                    "h1",
                    [
                        internalLink
                        ({
                            href: "./",
                            children: await applicationIcon(),
                        }),
                        `${document.title}`,
                        await menuButton
                        ([
                            menuItem
                            (
                                "リストに戻る",
                                async () => await showListScreen({ pass: pass, tag: "@overall", todo: Storage.TagMember.get(pass, "@overall")}),
                            )
                        ]),
                    ]
                ),
                {
                    tag: "textarea",
                    className: "json",
                    children: Storage.exportJson(pass),
                }
            ],
        });
        export const showImportScreen = async () =>
        {
            document.title = applicationTitle;
            showWindow(await importScreen(), () => { });
        };
        export const importScreen = async () =>
        ({
            tag: "div",
            className: "import-screen screen",
            children:
            [
                heading
                (
                    "h1",
                    [
                        internalLink
                        ({
                            href: "./",
                            children: await applicationIcon(),
                        }),
                        `${document.title}`,
                        await menuButton
                        ([
                            menuItem
                            (
                                "トップ画面に戻る",
                                async () => await showWelcomeScreen(),
                            )
                        ]),
                    ]
                ),
                {
                    tag: "textarea",
                    className: "json",
                    placeholder: "エクスポートした JSON をペーストしてください。"
                },
                {
                    tag: "div",
                    className: "button-list",
                    children:
                    {
                        tag: "button",
                        className: "default-button main-button long-button",
                        children: `🚫 インポート`,
                        onclick: async () =>
                        {
                            const textarea = document.getElementsByClassName("json")[0] as HTMLTextAreaElement;
                            Storage.importJson(textarea.value);
                        },
                    },
                },
            ],
        });
        export const applicationIcon = async () =>
        ({
            tag: "div",
            className: "application-icon icon",
            children: await loadSvgOrCache("./cyclictodohex.1024.svg"),
        });
        export const welcomeScreen = async () =>
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
                        await menuButton
                        ([
                            menuItem
                            (
                                "GitHub",
                                async () => location.href = "https://github.com/wraith13/cyclic-todo/",
                            ),
                        ]),
                    ]
                ),
                {
                    tag: "div",
                    style: "text-align: center; padding: 0.5rem;",
                    children: "🚧 This static web application is under development. / この Static Web アプリは開発中です。",
                },
                await applicationIcon(),
                {
                    tag: "div",
                    className: "button-list",
                    children: Storage.Pass.get().map
                    (
                        pass =>
                        ({
                            tag: "button",
                            className: "default-button main-button long-button",
                            children: `ToDo リスト ( pass: ${pass.substr(0, 2)}****${pass.substr(-2)} )`,
                            onclick: async () =>　await showListScreen({ pass: pass, tag: "@overall", todo: Storage.TagMember.get(pass, "@overall")}),
                        })
                    ).concat
                    ([
                        {
                            tag: "button",
                            className: Storage.Pass.get().length <= 0 ? "default-button main-button long-button": "main-button long-button",
                            children: locale.parallel("New ToDo List"),
                            onclick: async () =>
                            {
                                const pass = Storage.Pass.generate();
                                await showListScreen({ pass: pass, tag: "@overall", todo: Storage.TagMember.get(pass, "@overall")});
                            },
                        },
                        {
                            tag: "button",
                            className: "main-button long-button",
                            children:  locale.parallel("Import List"),
                            onclick: async () => await showImportScreen(),
                        },
                    ])
                },
            ],
        });
        export const showWelcomeScreen = async () =>
        {
            document.title = applicationTitle;
            showWindow(await welcomeScreen(), () => { });
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
            let maxColumns = Math.min(12, Math.max(minColumns, Math.floor(window.innerWidth / 390)));
            let minItemWidth = window.innerWidth;
            (Array.from(document.getElementsByClassName("column-flex-list")) as HTMLDivElement[]).forEach
            (
                list =>
                {
                    const length = list.childNodes.length;
                    list.classList.forEach
                    (
                        i =>
                        {
                            if (/^max-column-\d+$/.test(i))
                            {
                                list.classList.remove(i);
                            }
                        }
                    );
                    if (length <= 1 || maxColumns <= 1)
                    {
                        list.style.height = undefined;
                    }
                    else
                    {
                        const height = window.innerHeight -list.offsetTop;
                        const itemHeight = (list.childNodes[0] as HTMLElement).offsetHeight -0.5;
                        const columns = Math.min(maxColumns, Math.ceil(length / Math.max(1.0, Math.floor(height / itemHeight))));
                        const row = Math.max(Math.ceil(length /columns), Math.min(length, Math.floor(height / itemHeight)));
                        list.style.height = `${row *(itemHeight)}px`;
                        list.classList.add(`max-column-${columns}`);
                    }
                    const itemWidth = (list.childNodes[0] as HTMLElement).offsetWidth;
                    if (itemWidth < minItemWidth)
                    {
                        minItemWidth = itemWidth;
                    }
                }
            );
            const FontRemUnit = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const border = FontRemUnit *26;
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
        window.onpopstate = showPage;
        await showPage();
    };
    export const showPage = async () =>
    {
        const urlParams = getUrlParams();
        const hash = getUrlHash();
        const tag = urlParams["tag"];
        const todo = urlParams["todo"];
        const pass = urlParams["pass"] ?? `${Storage.sessionPassPrefix}:${new Date().getTime()}`;
        // const todo = JSON.parse(urlParams["todo"] ?? "null") as string[] | null;
        // const history = JSON.parse(urlParams["history"] ?? "null") as (number | null)[] | null;
        window.addEventListener('resize', Render.onWindowResize);
        window.addEventListener('storage', Render.onUpdateStorage);
        if (pass && todo)
        {
            await Render.showTodoScreen(pass, todo);
        }
        if (Storage.isSessionPass(pass) && ! tag)
        {
            switch(hash)
            {
            // case "import":
            //     dom.updateImportScreen(pass);
            //     break;
            default:
                console.log("show welcome screen");
                await Render.showWelcomeScreen();
                break;
            }
        }
        else
        {
            //Domain.merge(pass, tag, todo, history);
            switch(hash)
            {
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
                Render.showListScreen({ tag: tag, pass, todo: Storage.TagMember.get(pass, tag) });
                break;
            }
        }
    };
    export const showUrl = async (url: string) =>
    {
        history.pushState(null, applicationTitle, url);
        await showPage();
        history.replaceState(null, document.title, url);
    };
}
