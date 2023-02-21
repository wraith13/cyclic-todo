import { minamo } from "../nephila/minamo.js";
import config from "../resource/config.json";
import localeEn from "../resource/lang.en.json";
import localeJa from "../resource/lang.ja.json";
import resource from "../resource/images.json";
export const makeObject = <T>(items: { key: string, value: T}[]) =>
{
    const result: { [key: string]: T} = { };
    items.forEach(i => result[i.key] = i.value);
    return result;
};
export const simpleComparer = minamo.core.comparer.basic;
export const simpleReverseComparer = <T>(a: T, b: T) => -simpleComparer(a, b);
export const uniqueFilter = <T>(value: T, index: number, list: T[]) => index === list.indexOf(value);
export module locale
{
    export const master =
    {
        en: localeEn,
        ja: localeJa,
    };
    export type LocaleKeyType =
        keyof typeof localeEn &
        keyof typeof localeJa;
    export type LocaleType = keyof typeof master;
    export const locales = Object.keys(master) as LocaleType[];
    let masterKey: LocaleType = 0 <= locales.indexOf(navigator.language as LocaleType) ?
        navigator.language as LocaleType:
        locales[0];
    export const getLocaleName = (locale: LocaleType) => master[locale].$name;
    export const setLocale = (locale: LocaleType | null) =>
    {
        const key = locale ?? navigator.language as LocaleType;
        if (0 <= locales.indexOf(key))
        {
            masterKey = key;
        }
    };
    export const getPrimary = (key : LocaleKeyType) => master[masterKey][key];
    export const getSecondary = (key : LocaleKeyType) => master[locales.filter(locale => masterKey !== locale)[0]][key];
    export const string = (key : string) : string => getPrimary(key as LocaleKeyType) || key;
    export const map = (key : LocaleKeyType) : string => string(key);
    export const parallel = (key : LocaleKeyType) : string => `${getPrimary(key)} / ${getSecondary(key)}`;
}
export module Calculate
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
    export const sign = (n: number) => 0 <= n ? 1: -1; // Math.sign() とは挙動が異なるので注意。
    export function sum(ticks: [number, ...number[]]) : number;
    export function sum(ticks: number[]) : null | number;
    export function sum(ticks: number[]) : null | number
    {
        return ticks.length <= 0 ?
            null:
            ticks.reduce((a, b) => a +b, 0);
    }
    export function average(ticks: [number, ...number[]]) : number;
    export function average(ticks: number[]) : null | number;
    export function average(ticks: number[]) : null | number
    {
        return ticks.length <= 0 ?
            null:
            sum(<[number, ...number[]]>ticks) /ticks.length;
        }
    // export const standardDeviationOld = (ticks: number[], average: number = Calculate.average(ticks)) =>
    //     Math.sqrt(Calculate.average(ticks.map(i => (i -average) ** 2)));
    export function standardDeviation(ticks: [number, ...number[]], average?: number) : number;
    export function standardDeviation(ticks: number[], average?: number) : null | number;
    export function standardDeviation(ticks: number[], average: number | null = Calculate.average(ticks)) : null | number
    {
        if (null === average || ticks.length <= 0)
        {
            return null;
        }
        else
        {
            return Math.sqrt(Calculate.average(<[number, ...number[]]>ticks.map(i => i ** 2)) -(average ** 2));
        }
    }
    export const standardScore = (average: number, standardDeviation: number, target: number) =>
        (10 * (target -average) /standardDeviation) +50;
}
export module CyclicToDo
{
    export const applicationTitle = config.applicationTitle;
    export type ThemeType = "auto" | "light" | "dark";
    export interface SystemSettings extends minamo.core.JsonableObject
    {
        theme?: ThemeType;
        locale?: locale.LocaleType;
    }
    export interface ToDoTagEntryOld extends minamo.core.JsonableObject
    {
        pass: string;
        tag: string;
        todo: string[];
    }
    export interface ToDoEntry extends minamo.core.JsonableObject
    {
        task: string;
        isDefault: boolean;
        progress: null | number;
        first: null | number;
        previous: null | number;
        elapsed: null | number;
        rest: null | number;
        // overallAverage: null | number;
        RecentlyStandardDeviation: null | number;
        RecentlySmartAverage: null | number;
        RecentlyAverage: null | number;
        TotalAverage: null | number;
        smartRest: null | number;
        count: number;
        expectedInterval: null | { min: number; max:number; };
    }
    export interface ToDoEntryZero extends ToDoEntry
    {
        isDefault: false;
        progress: null;
        first: null;
        previous: null;
        elapsed: null;
        rest: null;
        // overallAverage: null;
        RecentlyStandardDeviation: null;
        RecentlySmartAverage: null;
        RecentlyAverage: null;
        TotalAverage: null;
        smartRest: null;
        count: 0;
        expectedInterval: null;
    }
    export interface ToDoEntryFirst extends ToDoEntry
    {
        isDefault: false;
        progress: null;
        first: number;
        previous: number;
        elapsed: number;
        rest: null;
        // overallAverage: null;
        RecentlyStandardDeviation: null;
        RecentlySmartAverage: null;
        RecentlyAverage: null;
        TotalAverage: null;
        smartRest: null;
        count: 1;
        expectedInterval: null;
    }
    export interface ToDoEntryMore extends ToDoEntry
    {
        first: number;
        previous: number;
        elapsed: number;
        rest: null | number;
        // overallAverage: number;
        RecentlyStandardDeviation: number;
        RecentlySmartAverage: number;
        RecentlyAverage: number;
        TotalAverage: number;
        smartRest: null | number;
        expectedInterval: { min: number; max:number; };
    }
    export const isZeroToDoEntry = (item: ToDoEntry): item is ToDoEntryZero =>
        item.count <= 0 || "number" !== typeof item.first;
    export const isFirstOrMoreToDoEntry = (item: ToDoEntry): item is ToDoEntryFirst | ToDoEntryMore =>
        1 <= item.count && "number" === typeof item.first;
    export const isMoreToDoEntry = (item: ToDoEntry): item is ToDoEntryMore =>
        2 <= item.count && "number" === typeof item.first && "number" === typeof item.previous && item.first !== item.previous;
    export interface TagSettings extends minamo.core.JsonableObject
    {
        // sort?: "smart" | "simple" | "limit";
        sort?: "smart" | "simple";
        displayStyle?: "@home" | "full" | "compact";
    }
    export interface PickupSettingBase extends minamo.core.JsonableObject
    {
        type: "always" | "elapsed-time" | "elapsed-time-standard-score" | "expired";
    }
    export interface PickupSettingAlways extends PickupSettingBase
    {
        type: "always";
    }
    export interface PickupSettingElapsedTime extends PickupSettingBase
    {
        type: "elapsed-time";
        elapsedTime: number;
    }
    export interface PickupSettingElapsedTimeStandardScore extends PickupSettingBase
    {
        type: "elapsed-time-standard-score";
        elapsedTimeStandardScore: number;
    }
    export interface PickupSettingExpired extends PickupSettingBase
    {
        type: "expired";
    }
    export type FlashSetting = PickupSettingAlways | PickupSettingElapsedTime | PickupSettingElapsedTimeStandardScore | PickupSettingExpired;
    export type PickupSetting = PickupSettingAlways | PickupSettingElapsedTime | PickupSettingElapsedTimeStandardScore | PickupSettingExpired;
    export type RestrictionSetting = PickupSettingAlways | PickupSettingElapsedTime | PickupSettingElapsedTimeStandardScore | PickupSettingExpired;
    export interface TodoSettings extends minamo.core.JsonableObject
    {
        flash?: FlashSetting;
        pickup?: PickupSetting;
        restriction?: RestrictionSetting;
    }
    export interface DocumentCard extends minamo.core.JsonableObject
    {
        type: "oldLocalDb" | "session" | "localDb" | "OneDrive" | "file";
        title: string;
        uri: string;
    }
    export interface HistoryEntry extends minamo.core.JsonableObject
    {
        histories: number[];
        first: number | null;
        count: number;
    }
    export interface HistoryEntryZero extends HistoryEntry
    {
        first: null;
        count: 0;
    }
    export interface HistoryEntryFirst extends HistoryEntry
    {
        histories: [number, ...number[]];
        first: number;
        count: 1;
    }
    export interface HistoryEntrySecond extends HistoryEntry
    {
        histories: [number, number, ...number[]];
        first: number;
        count: 2;
    }
    export interface HistoryEntryMore extends HistoryEntry
    {
        histories: [number, number, number, ...number[]];
        first: number;
        // count: 3 <=;
    }
    export const isZeroHistryEntry = (entry: HistoryEntry): entry is HistoryEntryZero =>
        entry.count <= 0 || "number" !== typeof entry.first || entry.histories.length <= 0;
    export const isFirstOrMoreHistryEntry = (entry: HistoryEntry): entry is HistoryEntryFirst | HistoryEntrySecond | HistoryEntryMore =>
        1 <= entry.count && "number" === typeof entry.first && 1 <= entry.histories.length;
    export const isSecondOrMoreHistryEntry = (entry: HistoryEntry): entry is HistoryEntrySecond | HistoryEntryMore =>
        2 <= entry.count && "number" === typeof entry.first && 2 <= entry.histories.length;
    export const isMoreHistryEntry = (entry: HistoryEntry): entry is HistoryEntryMore =>
        3 <= entry.count && "number" === typeof entry.first && 3 <= entry.histories.length;
    export function getPreviousFromHistryEntry(entry: HistoryEntryZero): null;
    export function getPreviousFromHistryEntry(entry: HistoryEntryFirst | HistoryEntrySecond | HistoryEntryMore): number;
    export function getPreviousFromHistryEntry(entry: HistoryEntry): number | null;
    export function getPreviousFromHistryEntry(entry: HistoryEntry): number | null
    {
        return isFirstOrMoreHistryEntry(entry) ? entry.histories[0]: null;
    }
    export interface Content extends minamo.core.JsonableObject
    {
        specification: "https://github.com/wraith13/cyclic-todo/README.md";
        title: string;
        timeAccuracy: number;
        pass: string;
        todos: string[];
        tags: { [tag: string]: string[] };
        tagSettings: { [tag: string]: TagSettings };
        todoSettings: { [tag: string]: TodoSettings };
        histories: { [todo: string]: HistoryEntry };
        removed: RemovedType[];
    }
    export type RemovedType = RemovedTag | RemovedSublist | RemovedTask | RemovedTick;
    export interface RemovedBase extends minamo.core.JsonableObject
    {
        type: "Tag" | "Sublist" | "Task" | "Tick";
        deteledAt: number;
    }
    export interface RemovedTag extends RemovedBase
    {
        type: "Tag";
        name: string;
        tasks: string[];
        settings: TagSettings;
    }
    export interface RemovedSublist extends RemovedBase
    {
        type: "Sublist";
        name: string;
        tasks: RemovedTask[];
        settings: TagSettings;
    }
    export interface RemovedTask extends RemovedBase
    {
        type: "Task";
        name: string;
        tags: string[];
        settings?: TodoSettings;
        ticks: HistoryEntry;
    }
    export interface RemovedTick extends RemovedBase
    {
        type: "Tick";
        task: string;
        tick: number;
    }
    export module OldStorage
    {
        export const sessionPassPrefix = "@Session";
        export const isSessionPass = (pass: string) => pass.startsWith(sessionPassPrefix);
        export const getStorage = (pass: string) => isSessionPass(pass) ? minamo.sessionStorage: minamo.localStorage;
        export let lastUpdate = 0;
        export const exportJson = (pass: string) =>
        {
            const specification = "https://github.com/wraith13/cyclic-todo/README.md";
            const title = Title.get(pass);
            const timeAccuracy = Domain.timeAccuracy;
            const tags: { [tag: string]: string[] } = { };
            const tagSettings: { [tag: string]: TagSettings } = { };
            [
                "@overall",
                "@flash",
                "@pickup",
                "@restriction",
                "@short-term",
                "@medium-term",
                "@long-term",
                "@unoverall",
                //"@deleted", 現状のヤツは廃止。ただ、別の形で復帰させるかも。
            ].concat(Tag.get(pass))
            .forEach
            (
                tag =>
                {
                    if ([ "@overall", "@short-term", "@medium-term", "@long-term", ].indexOf(tag) < 0) // @overall は todos でカバーされるし、 @short-term と @long-term は自動登録されるのでここには含めない
                    {
                        tags[tag] = TagMember.getRaw(pass, tag);
                    }
                    tagSettings[tag] = TagSettings.get(pass, tag);
                }
            );
            const todos = TagMember.getRaw(pass, "@overall");
            const todoSettings: { [tag: string]: TodoSettings } = { };
            todos.forEach(task => todoSettings[task] = TodoSettings.get(pass, task));
            const histories: { [todo: string]: HistoryEntry } = { };
            todos
            .forEach
            (
                todo => histories[todo] = History.get(pass, todo)
            );
            const removed = Removed.get(pass);
            const result: Content =
            {
                specification,
                title,
                timeAccuracy,
                pass,
                todos,
                todoSettings,
                tags,
                tagSettings,
                histories,
                removed,
            };
            return JSON.stringify(result);
        };
        export const importJson = (json: string) =>
        {
            try
            {
                const data = JSON.parse(json) as Content;
                if
                (
                    "https://github.com/wraith13/cyclic-todo/README.md" === data.specification &&
                    "string" === typeof data.title &&
                    "number" === typeof data.timeAccuracy &&
                    "string" === typeof data.pass &&
                    Array.isArray(data.todos) &&
                    "object" === typeof data.todoSettings &&
                    data.todos.filter(i => "string" !== typeof i).length <= 0 &&
                    "object" === typeof data.tags &&
                    "object" === typeof data.tagSettings &&
                    "object" === typeof data.histories
                )
                {
                    Pass.add(data.pass);
                    Title.set(data.pass, data.title);
                    TagMember.set(data.pass, "@overall", data.todos);
                    Tag.set(data.pass, Object.keys(data.tags));
                    Object.keys(data.tags).forEach(tag => TagMember.set(data.pass, tag, data.tags[tag]));
                    Object.keys(data.tagSettings).forEach(tag => TagSettings.set(data.pass, tag, data.tagSettings[tag]));
                    Object.keys(data.todoSettings).forEach(tag => TodoSettings.set(data.pass, tag, data.todoSettings[tag]));
                    Object.keys(data.histories).forEach
                    (
                        todo =>
                        {
                            const item = data.histories[todo];
                            const entry = Array.isArray(item) ? { histories: item, first: Math.min(...item), count: item.length, }: item;
                            History.set(data.pass, todo, entry);
                        }
                    );
                    Removed.set(data.pass, data.removed.map(i => JSON.stringify(i)));
                    return data.pass;
                }
            }
            catch(error)
            {
                //  JSON parse error
                console.error(error);
            }
            return null;
        };
        export module Backup
        {
            export const key = `backup`;
            export const get = () => minamo.localStorage.getOrNull<string[]>(key) ?? [];
            const set = (backupList: string[]) => minamo.localStorage.set(key, backupList);
            export const add = (json: string) => set(get().concat([ json ]));
            export const remove = (pass: string) => set(get().filter(i => pass !== (JSON.parse(i) as Content).pass));
            export const clear = () => set([]);
        }
        export module Pass
        {
            export const key = `pass.list`;
            export const get = () => minamo.localStorage.getOrNull<string[]>(key) ?? [];
            export const set = (passList: string[]) => minamo.localStorage.set(key, passList);
            export const add = (pass: string) =>
            {
                set(get().concat([ pass ]).filter(uniqueFilter));
                Backup.remove(pass);
            };
            export const remove = (pass: string) =>
            {
                Backup.add(exportJson(pass));
                set(get().filter(i => pass !== i));
                TagMember.getRaw(pass, "@overall").forEach(task => History.removeKey(pass, task));
                Tag.get(pass).filter(tag => ! Model.isSystemTagOld(tag) && ! Model.isSublistOld(tag)).forEach(tag => TagMember.removeKey(pass, tag));
                Tag.removeKey(pass);
                Removed.clear(pass);
            };
            export const generate = (seed: number = new Date().getTime()): string =>
            {
                const result = ("" +((seed *13738217) ^ ((seed %387960371999) >> 5 ))).slice(-8);
                if (0 < Pass.get().filter(i => i === result).length)
                {
                    return generate(seed +parseInt(result));
                }
                OldStorage.Pass.add(result);
                return result;
            };
        }
        export module Title
        {
            export const makeKey = (pass: string) => `pass:(${pass}).title`;
            export const get = (pass: string) =>
                getStorage(pass).getOrNull<string>(makeKey(pass)) ?? "ToDo リスト";
            export const set = (pass: string, title: string) =>
                getStorage(pass).set(makeKey(pass), title);
        }
        export module Tag
        {
            export const makeKey = (pass: string) => `pass:(${pass}).tag.list`;
            export const get = (pass: string) =>
                getStorage(pass).getOrNull<string[]>(makeKey(pass)) ?? [];
            export const set = (pass: string, list: string[]) =>
                getStorage(pass).set(makeKey(pass), list.filter(i => ! Model.isSystemTagOld(i))); // システムタグは万が一にも登録させない
            export const add = (pass: string, tag: string) => set(pass, get(pass).concat([ tag ]).filter(uniqueFilter));
            export const removeRaw = (pass: string, tag: string) => set(pass, get(pass).filter(i => tag !== i));
            export const remove = (pass: string, tag: string) =>
            {
                if ( ! Model.isSystemTagOld(tag))
                {
                    if (Model.isSublistOld(tag))
                    {
                        const tasks = TagMember.getRaw(pass, tag).map(task => Task.serialize(pass, task));
                        const settings = TagSettings.get(pass, tag);
                        Removed.add
                        (
                            pass,
                            {
                                type: "Sublist",
                                deteledAt: Domain.getTicks(),
                                name: tag,
                                tasks,
                                settings,
                            }
                        );
                        TagMember.getRaw(pass, tag).map(task => Task.removeRaw(pass, task));
                        removeRaw(pass, tag);
                        TagMember.removeKey(pass, tag);
                        TagSettings.remove(pass, tag);
                    }
                    else
                    {
                        const tasks = TagMember.getRaw(pass, tag);
                        const settings = TagSettings.get(pass, tag);
                        Removed.add
                        (
                            pass,
                            {
                                type: "Tag",
                                deteledAt: Domain.getTicks(),
                                name: tag,
                                tasks,
                                settings,
                            }
                        );
                        removeRaw(pass, tag);
                        TagMember.removeKey(pass, tag);
                        TagSettings.remove(pass, tag);
                    }
                }
            };
            export const restore = (pass: string, item: RemovedTag | RemovedSublist) =>
            {
                let result = ("Tag" === item.type || "Sublist" === item.type) && ! Model.isSystemTagOld(item.name) && get(pass).indexOf(item.name) < 0;
                if (result)
                {
                    switch(item.type)
                    {
                    case "Tag":
                        add(pass, item.name);
                        const allTasks = TagMember.getRaw(pass, "@overall");
                        TagMember.set(pass, item.name, item.tasks.filter(i => 0 <= allTasks.indexOf(i)));
                        TagSettings.set(pass, item.name, item.settings);
                        break;
                    case "Sublist":
                        add(pass, item.name);
                        item.tasks.forEach(task => Task.restore(pass, task));
                        TagSettings.set(pass, item.name, item.settings);
                        break;
                    }
                }
                return result;
            };
            export const getByTodo = (pass: string, todo: string) =>
                ["@overall", "@flash", "@pickup", "@restriction", "@short-term", "@medium-term", "@long-term", "@irregular-term"]
                    .concat(get(pass))
                    .concat(["@unoverall", "@untagged"])
                    .filter(tag => 0 < TagMember.get(pass, tag).filter(i => todo === i).length)
                    .sort(minamo.core.comparer.make(tag => Model.isSublistOld(tag) ? 0: 1));
            export const getByTodoRaw = (pass: string, todo: string) =>
                ["@overall", "@flash", "@pickup", "@restriction", "@short-term", "@medium-term", "@long-term", "@irregular-term"]
                    .concat(get(pass))
                    .concat(["@unoverall", "@untagged"])
                    .filter(tag => 0 < TagMember.getRaw(pass, tag).filter(i => todo === i).length);
            export const rename = (pass: string, oldTag: string, newTag: string) =>
            {
                if (0 < newTag.length && ! Model.isSystemTagOld(oldTag) && ! Model.isSystemTagOld(newTag) && oldTag !== newTag && get(pass).indexOf(newTag) < 0)
                {
                    add(pass, newTag);
                    TagMember.set(pass, newTag, TagMember.getRaw(pass, oldTag));
                    TagSettings.set(pass, newTag, TagSettings.get(pass, oldTag));
                    removeRaw(pass, oldTag);
                    TagMember.removeKey(pass, oldTag);
                    TagSettings.remove(pass, oldTag);
                    return true;
                }
                return false;
            };
            export const removeKey = (pass: string) => getStorage(pass).remove(makeKey(pass));
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
                case "@pickup-all":
                    return getRaw(pass, "@overall").filter(task => null !== (TodoSettings.get(pass, task).pickup ?? null));
                case "@untagged":
                    {
                        const tagged = Tag.get(pass).map(tag => get(pass, tag)).reduce((a, b) => a.concat(b), []);
                        return getRaw(pass, "@overall").filter(i => tagged.indexOf(i) < 0);
                    }
                case "@unoverall":
                default:
                    return Model.isSublistOld(tag) ?
                        getRaw(pass, "@overall").filter(i => tag === Task.getSublist(i)):
                        getRaw(pass, tag);
                }
            };
            export const set = (pass: string, tag: string, list: string[]) =>
                getStorage(pass).set(makeKey(pass, tag), list);
            export const removeKey = (pass: string, tag: string) => getStorage(pass).remove(makeKey(pass, tag));
            export const add = (pass: string, tag: string, todo: string) =>
            {
                if (Model.isSublistOld(tag))
                {
                    if (tag !== Task.getSublist(todo))
                    {
                        console.log(`Task.rename(${pass}, ${todo}, "${tag}${Task.getBody(todo)}")`);
                        Task.rename(pass, todo, `${tag}${Task.getBody(todo)}`);
                    }
                }
                else
                {
                    set(pass, tag, get(pass, tag).concat([ todo ]).filter(uniqueFilter));
                }
            };
            //export const merge = (pass: string, tag: string, list: string[]) => set(pass, tag, get(pass, tag).concat(list).filter(uniqueFilter));
            export const remove = (pass: string, tag: string, todo: string) =>
            {
                if (Model.isSublistOld(tag))
                {
                    if (null !== Task.getSublist(todo))
                    {
                        Task.rename(pass, todo, Task.getBody(todo));
                    }
                }
                else
                {
                    set(pass, tag, get(pass, tag).filter(i => todo !== i));
                }
            };
            export const isMember = (pass: string, tag: string, todo: string) => 0 <= get(pass, tag).indexOf(todo);
            export const isRestrictionTask = (pass: string, todo: string) => isMember(pass, "@restriction", todo);
            export const isPickupTask = (pass: string, todo: string) => isMember(pass, "@pickup", todo);
            export const isFlashTask = (pass: string, todo: string) => isMember(pass, "@flash", todo);
        }
        export module TagSettings
        {
            export const makeKey = (pass: string, tag: string) => `pass:(${pass}).tag:(${tag}).settings`;
            export const get = (pass: string, tag: string) =>
                getStorage(pass).getOrNull<CyclicToDo.TagSettings>(makeKey(pass, tag)) ?? { };
            export const set = (pass: string, tag: string, settings: CyclicToDo.TagSettings) =>
                getStorage(pass).set(makeKey(pass, tag), settings);
            export const remove = (pass: string, tag: string) => getStorage(pass).remove(makeKey(pass, tag));
            export const getSort = (pass: string, tag: string) =>
                (get(pass, tag).sort ?? (get(pass, "@overall").sort ?? "smart"));
            export const getDisplayStyle = (pass: string, tag: string): "full" | "compact" =>
            {
                const defaultResult = "full";
                const result = get(pass, tag).displayStyle ?? defaultResult;
                if ("@home" === result)
                {
                    if ("@overall" === tag)
                    {
                        return defaultResult;
                    }
                    else
                    {
                        return getDisplayStyle(pass, "@overall");
                    }
                }
                return result;
            };
        }
        export module Task
        {
            export const encode = (task: string) => task.replace(/@/, "@=");
            export const decode = (task: string) => task.replace(/@=/, "@").replace(/@:/, ": ");
            export const getSublist = (task: string) =>
            {
                const split = task.split("@:");
                return 2 <= split.length ? `${split[0]}@:`: null;
            };
            export const getBody = (task: string) =>
            {
                const split = task.split("@:");
                return 2 <= split.length ? split[split.length -1]: task;
            };
            export const add = (pass: string, task: string) =>
            {
                OldStorage.TagMember.add(pass, "@overall", task);
            };
            export const rename = (pass: string, oldTask: string, newTask: string) =>
            {
                if (0 < newTask.length && oldTask !== newTask && TagMember.getRaw(pass, "@overall").indexOf(newTask) < 0)
                {
                    const oldSublist = getSublist(oldTask);
                    const newSublist = getSublist(newTask);
                    Tag.getByTodoRaw(pass, oldTask).forEach
                    (
                        tag =>
                        {
                            TagMember.remove(pass, tag, oldTask);
                            if ( ! Model.isSublistOld(tag) || oldSublist === newSublist)
                            {
                                TagMember.add(pass, tag, newTask);
                            }
                        }
                    );
                    if (null !== newSublist && oldSublist !== newSublist)
                    {
                        TagMember.add(pass, newSublist, newTask);
                    }
                    TodoSettings.set(pass, newTask, TodoSettings.get(pass, oldTask));
                    TodoSettings.remove(pass, oldTask);
                    History.set(pass, newTask, History.get(pass, oldTask));
                    History.removeKey(pass, oldTask);
                    return true;
                }
                return false;
            };
            export const removeRaw = (pass: string, task: string) =>
            {
                const tags = Tag.getByTodoRaw(pass, task);
                tags.map(tag => OldStorage.TagMember.remove(pass, tag, task));
                History.removeKey(pass, task);
            };
            export const remove = (pass: string, task: string) =>
            {
                Removed.add
                (
                    pass,
                    serialize(pass, task),
                );
                removeRaw(pass, task);
            };
            export const restore = (pass: string, item: RemovedTask) =>
            {
                const sublist = Task.getSublist(item.name);
                let result = TagMember.getRaw(pass, "@overall").indexOf(item.name) < 0 && (null === sublist || 0 <= Tag.get(pass).indexOf(sublist));
                if (result)
                {
                    item.tags.map(tag => TagMember.add(pass, tag, item.name));
                    TodoSettings.set(pass, item.name, item.settings);
                    History.set(pass, item.name, item.ticks);
                }
                return result;
            };
            export const serialize = (pass: string, task: string) =>
            {
                const tags = Tag.getByTodoRaw(pass, task);
                const settings = TodoSettings.get(pass, task);
                const ticks = History.get(pass, task);
                const result: RemovedTask =
                {
                    type: "Task",
                    deteledAt: Domain.getTicks(),
                    name: task,
                    tags,
                    settings,
                    ticks,
                };
                return result;
            };
        }
        export module TodoSettings
        {
            export const makeKey = (pass: string, task: string) => `pass:(${pass}).todo:(${task}).settings`;
            export const get = (pass: string, task: string) =>
                getStorage(pass).getOrNull<CyclicToDo.TodoSettings>(makeKey(pass, task)) ?? { };
            export const set = (pass: string, task: string, settings: CyclicToDo.TodoSettings | undefined) =>
                undefined === settings ?
                    remove(pass, task):
                    getStorage(pass).set(makeKey(pass, task), settings);
            export const remove = (pass: string, task: string) => getStorage(pass).remove(makeKey(pass, task));
            export const isFlashTarget = (pass: string, item: ToDoEntry, elapsedTime = item.elapsed) =>
            {
                const flashSetting = get(pass, item.task)?.flash;
                if (flashSetting)
                {
                    switch(flashSetting.type)
                    {
                    case "always":
                        return true;
                    case "elapsed-time":
                        return null !== elapsedTime && flashSetting.elapsedTime <= elapsedTime;
                    case "elapsed-time-standard-score":
                        return null !== elapsedTime && flashSetting.elapsedTimeStandardScore <= (Domain.getStandardScore(item, elapsedTime) ?? 0);
                    case "expired":
                        return Domain.isExpired(item, elapsedTime);
                    }
                }
                return false;
            };
            export const isPickupTarget = (pass: string, item: ToDoEntry, elapsedTime = item.elapsed) =>
            {
                const pickupSetting = get(pass, item.task)?.pickup;
                if (pickupSetting)
                {
                    switch(pickupSetting.type)
                    {
                    case "always":
                        return true;
                    case "elapsed-time":
                        return null !== elapsedTime && pickupSetting.elapsedTime <= elapsedTime;
                    case "elapsed-time-standard-score":
                        return null !== elapsedTime && pickupSetting.elapsedTimeStandardScore <= (Domain.getStandardScore(item, elapsedTime) ?? 0);
                    case "expired":
                        return Domain.isExpired(item, elapsedTime);
                    }
                }
                return false;
            };
            export const isRestrictionTarget = (pass: string, item: ToDoEntry, elapsedTime = item.elapsed) =>
            {
                const restrictionSetting = get(pass, item.task)?.restriction;
                if (restrictionSetting)
                {
                    switch(restrictionSetting.type)
                    {
                    case "always":
                        return true;
                    case "elapsed-time":
                        return null !== elapsedTime && elapsedTime < restrictionSetting.elapsedTime;
                    case "elapsed-time-standard-score":
                        return null !== elapsedTime && (Domain.getStandardScore(item, elapsedTime) ?? 0) < restrictionSetting.elapsedTimeStandardScore;
                    case "expired":
                        return ! Domain.isExpired(item, elapsedTime);
                    }
                }
                return false;
            };
        }
        export module History
        {
            export const makeKey = (pass: string, task: string) => `pass:(${pass}).task:${task}.history`;
            export const get = (pass: string, task: string): HistoryEntry =>
            {
                const raw = getStorage(pass).getOrNull<number[] | HistoryEntry>(makeKey(pass, task)) ?? { histories: [], first: null, count: 0, };
                return Array.isArray(raw) ?
                    {
                        histories: raw.filter((_i, ix) => ix < config.maxHistories), // splice を使うと正しい count を取得し損ねるので、ここは filter にしている。
                        first: Math.min(...raw),
                        count: raw.length,
                    }:
                    raw;
            };
            export const getTicks = (pass: string, task: string): number[] => get(pass, task).histories;
            export const set = (pass: string, task: string, list: HistoryEntry) =>
                getStorage(pass).set(makeKey(pass, task), list);
            export const removeKey = (pass: string, task: string) =>
                getStorage(pass).remove(makeKey(pass, task));
            export const addTick = (pass: string, task: string, tick: number) =>
            {
                const item = get(pass, task);
                const oldLength = item.histories.length;
                const temporaryHistories = item.histories.filter(i => tick !== i).concat(tick).sort(simpleReverseComparer);
                item.histories = temporaryHistories.slice(0, config.maxHistories);
                item.count += temporaryHistories.length -oldLength;
                if (null === item.first || tick < item.first)
                {
                    item.first = tick;
                }
                set(pass, task, item);
            };
            export const removeTickRaw = (pass: string, task: string, tick: number | number[]) =>
            {
                const item = get(pass, task);
                const oldLength = item.histories.length;
                item.histories = item.histories.filter(i => tick !== i).sort(simpleReverseComparer);
                item.count += item.histories.length -oldLength;
                if (item.count <= 0)
                {
                    item.first = null;
                }
                else
                {
                    if (null === item.first || tick === item.first)
                    {
                        item.first = Math.min(...item.histories);
                    }
                }
                set(pass, task, item);
            };
            export const removeTick = (pass: string, task: string, tick: number) =>
            {
                Removed.add
                (
                    pass,
                    {
                        type: "Tick",
                        deteledAt: Domain.getTicks(),
                        task,
                        tick,
                    }
                );
                removeTickRaw(pass, task, tick);
            };
            export const restore = (pass: string, item: RemovedTick) =>
            {
                let result = getTicks(pass, item.task).indexOf(item.tick) < 0;
                if (result)
                {
                    addTick(pass, item.task, item.tick);
                }
                return result;
            };
        }
        export module Removed
        {
            export const makeKey = (pass: string) => `pass:(${pass}).removed`;
            export const getRaw = (pass: string) => minamo.localStorage.getOrNull<string[]>(makeKey(pass)) ?? [];
            export const get = (pass: string) => getRaw(pass).map(i => JSON.parse(i) as RemovedType);
            export const set = (pass: string, list: string[]) => minamo.localStorage.set(makeKey(pass), list);
            export const add = (pass: string, target: RemovedType) => set(pass, getRaw(pass).concat([ JSON.stringify(target) ]));
            const remove = (pass: string, target: string) => set(pass, getRaw(pass).filter(i => target !== i));
            export const clear = (pass: string) => set(pass, []);
            export const getTypeName = (item: RemovedType) => locale.map(item.type);
            export const getIcon = (item: RemovedType): keyof typeof resource =>
            {
                switch(item.type)
                {
                case "Tag":
                    return "tag-icon";
                case "Sublist":
                    return "folder-icon";
                case "Task":
                    return "task-icon";
                case "Tick":
                    return "tick-icon";
                }
            };
            export const getName = (item: RemovedType) =>
            {
                if ("Tick" === item.type)
                {
                    return `${item.task}: ${Domain.dateStringFromTick(item.tick)}`;
                }
                else
                {
                    return item.name;
                }
            };
            export const restore = (pass: string, item: RemovedType) =>
            {
                let result = false;
                switch(item.type)
                {
                case "Tag":
                case "Sublist":
                    result = Tag.restore(pass, item);
                    break;
                case "Task":
                    result = Task.restore(pass, item);
                    break;
                case "Tick":
                    result = History.restore(pass, item);
                    break;
                }
                if (result)
                {
                    remove(pass, JSON.stringify(item));
                }
                return true;
            };
        }
    }
    export module Storage
    {
        export module SystemSettings
        {
            export const makeKey = () => `settings`;
            export const get = () =>
                minamo.localStorage.getOrNull<CyclicToDo.SystemSettings>(makeKey()) ?? { };
            export const set = (settings: CyclicToDo.SystemSettings) =>
                minamo.localStorage.set(makeKey(), settings);
        }
        export module ToDoDocumentList
        {
            export const key = `document.list`;
            export const get = () => minamo.localStorage.getOrNull<DocumentCard[]>(key) ?? [];
            const set = (list: DocumentCard[]) => minamo.localStorage.set(key, list);
            export const add = (entry: DocumentCard) =>
            {
                set(get().filter(i => entry.uri !== i.uri).concat([ entry ]));
                Backup.remove(entry);
            };
            export const remove = (entry: DocumentCard) =>
            {
                Backup.add(entry);
                set(get().filter(i => entry.uri !== i.uri));
            };
            export const update = add;

            export module Backup
            {
                export const key = `document.list.backup`;
                export const get = () => minamo.localStorage.getOrNull<DocumentCard[]>(key) ?? [];
                const set = (backupList: DocumentCard[]) => minamo.localStorage.set(key, backupList);
                export const add = (card: DocumentCard) => set(get().filter(i => ! (card.type === i.type && card.uri === i.uri)).concat([ card ]));
                export const remove = (card: DocumentCard) => set(get().filter(i => ! (card.type === i.type && card.uri === i.uri)));
                export const clear = () => set([]);
            }
        }
        export module ToDoList
        {
            export const makeKey = (pass: string) => `document:(${pass})`;
            export const get = (pass: string) => minamo.localStorage.getOrNull<CyclicToDo.Content>(makeKey(pass));
            export const set = (pass: string, list: CyclicToDo.Content) => minamo.localStorage.set(makeKey(pass), list);
            export const remove = (pass: string) =>
            {
                minamo.localStorage.remove(makeKey(pass));
            };
        }
        export module Filter
        {
            export const key = `filter.recently`;
            export const get = () => minamo.localStorage.getOrNull<string[]>(key) ?? [];
            export const set = (filterList: string[]) => minamo.localStorage.set(key, filterList);
            export const add = (filter: string) =>
            {
                set
                (
                    [ filter ].concat(get())
                        .filter(uniqueFilter)
                        .filter((_i, ix) => ix < 30)
                );
            };
        }
    }
    export module SessionStorage
    {
        export module ToDoList
        {
            export const makeKey = (pass: string) => `document:(${pass})`;
            export const get = (pass: string) => minamo.sessionStorage.getOrNull<CyclicToDo.Content>(makeKey(pass));
            export const set = (pass: string, list: CyclicToDo.Content) => minamo.sessionStorage.set(makeKey(pass), list);
            export const remove = (pass: string) =>
            {
                minamo.sessionStorage.remove(makeKey(pass));
            };
        }
    }
    export module Model
    {
        export const isSystemTagOld = (tag: string) => tag.startsWith("@") && ! tag.startsWith("@=") && ! isSublistOld(tag);
        export const isSublistOld = (tag: string) => tag.endsWith("@:");
        export const encode = (tag: string) => tag.replace(/@/g, "@=");
        export const encodeSublist = (tag: string) => encode(tag) +"@:";
        export const decode = (tag: string) => tag.replace(/@\:/g, ": ").replace(/@=/g, "@");
        export interface Live
        {
            tasks: ToDoEntry[];
        }
        export type updator_type = (content: Content) => unknown;
        export class Transaction
        {
            updators: updator_type[] = [];
            public constructor(private document: Document)
            {
            }
            add = (updator: updator_type) => (this.updators.push(updator), this);
            commit = async () =>
            {
                if (0 < this.updators.length)
                {
                    const updators = this.updators;
                    this.updators = [];
                    const result = await this.document.save(async content => await Promise.all(updators.map(async i => await i(content))));
                    return result;
                }
                return null;
            }
        }
        export class Tag
        {
            public constructor(private document: Document, private name: string)
            {
            }
            getName = () => this.name;
            isSystemTag = () => this.name.startsWith("@") && ! this.name.startsWith("@=") && ! this.isSublist();
            isSublist = () => this.name.endsWith("@:");
            getSettings = () => this.document.tagSettings.get(this);
            setSettings = (settings: CyclicToDo.TagSettings) => this.document.tagSettings.set(this, settings);
            resetSettings = () => this.document.tagSettings.reset(this);
            getRawMember = () => this.document.tagMember.getRaw(this);
            getMember = () => this.document.tagMember.get(this);
        }
        export class Task
        {
            public constructor(private document: Document, private name: string)
            {
            }
            getName = () => this.name;
            getSublist = () =>
            {
                const split = this.name.split("@:");
                return 2 <= split.length ? new Tag(this.document, `${split[0]}@:`): null;
            }
            getBody = () =>
            {
                const split = this.name.split("@:");
                return 2 <= split.length ? split[split.length -1]: this.name;
            }
            getSettings = () => this.document.todoSettings.get(this);
            setSettings = (settings: CyclicToDo.TodoSettings) => this.document.todoSettings.set(this, settings);
            resetSettings = () => this.document.todoSettings.reset(this);
        }
        export class Document
        {
            private live: Live;
            public constructor(private card: DocumentCard, private content: Content)
            {
                const tasks = content.todos.map(task => Domain.getToDoEntryRaw(task, content.histories[task]));
                this.live =
                {
                    tasks,
                };
                this.update();
            }
            getToDoEntry = (task: string) => this.live.tasks.filter(i => task === i.task)[0];
            updateTermCategory = (item: ToDoEntry) =>
            {
                // 🔥 ここでイチイチ save するのはナンセンスだけど、 save しておかないと差分チェックの邪魔になる、、、
                // 🤔 "@short-term", "@long-term", "@irregular-term"　のタグメンバーは this.live に持たせるかねぇ、、、
                const term = Domain.getTermCategory(item);
                if ((this.content.tags[term] ?? []).indexOf(item.task) < 0)
                {
                    ["@short-term", "@medium-term", "@long-term", "@irregular-term"].forEach
                    (
                        tag =>
                        {
                            if (tag === term)
                            {
                                this.content.tags[term] = (this.content.tags[term] ?? []).concat([ item.task, ]);
                            }
                            else
                            {
                                if (0 <= (this.content.tags[tag] ?? []).indexOf(item.task))
                                {
                                    this.content.tags[term] = (this.content.tags[term] ?? []).filter(i => i !== item.task);
                                }
                            }
                        }
                    );
                }
            }
            update = () =>
            {
                this.card.title = this.content.title;
                if ("session" !== this.card.type)
                {
                    Storage.ToDoDocumentList.update(this.card);
                }
            }
            save = async (updator: updator_type): Promise<true | string> =>
            {
                const content = minamo.core.simpleDeepCopy(this.content);
                await updator(content);
                let result = await Model.saveContent(this.card, content);
                if (true === result)
                {
                    this.content = content;
                    this.update();
                }
                return result;
            }
            transaction =
            {
                make: () => new Transaction(this),
            };
            title =
            {
                get: () =>
                    this.content.title ?? "ToDo リスト",
                updator: (title: string) =>
                    (content: Content) => content.title = title,
            };
            tag =
            {
                get: (tag: string) => new Tag(this, tag),
                getList: () => Object.keys(this.content.tags).map(i => new Tag(this, i)),
                getByTask: (task: Task) =>
                    ["@overall", "@flash", "@pickup", "@restriction", "@short-term", "@medium-term", "@long-term", "@irregular-term"].map(i => this.tag.get(i))
                    .concat(this.tag.getList())
                    .concat(["@unoverall", "@untagged"].map(i => this.tag.get(i)))
                    .filter(tag => 0 < tag.getMember().filter(i => task.getName() === i.getName()).length)
                    .sort(minamo.core.comparer.make(tag => tag.isSublist() ? 0: 1)),
                getByTaskRaw: (task: Task) =>
                    ["@overall", "@flash", "@pickup", "@restriction", "@short-term", "@medium-term", "@long-term", "@irregular-term"].map(i => this.tag.get(i))
                    .concat(this.tag.getList())
                    .concat(["@unoverall", "@untagged"].map(i => this.tag.get(i)))
                    .filter(tag => 0 < tag.getRawMember().filter(i => task.getName() === i.getName()).length),
            };
            tagSettings =
            {
                get: (tag: Tag) => this.content.tagSettings[tag.getName()] ?? { },
                set: async (tag: Tag, settings: CyclicToDo.TagSettings) =>
                    await this.save(content => content.tagSettings[tag.getName()] = settings),
                reset: async (tag: Tag) =>
                    await this.save(content => delete content.tagSettings[tag.getName()]),
            };
            tagMember =
            {
                getRaw: (tag: Tag) => (this.content.tags[tag.getName()] ?? [ ]).map(i => this.task.get(i)),
                get: (tag: Tag) =>
                {
                    switch(tag.getName())
                    {
                    case "@overall":
                        {
                            const unoverall = new Tag(this, "@unoverall").getRawMember().map(i => i.getName());
                            return tag.getRawMember().filter(i => unoverall.indexOf(i.getName()) < 0);
                        }
                    case "@untagged":
                        {
                            const tagged = Object.keys(this.content.tags).map(tag => this.content.tags[tag]).reduce((a, b) => a.concat(b), []);
                            return new Tag(this, "@overall").getRawMember().filter(i => tagged.indexOf(i.getName()) < 0);
                        }
                    case "@unoverall":
                    default:
                        return tag.isSublist() ?
                            new Tag(this, "@overall").getRawMember().filter(i => tag.getName() === i.getSublist()?.getName()):
                            tag.getRawMember();
                    }
                },
                set: (tag: Tag, list: Task[]) => this.save(content => content.tags[tag.getName()] = list.map(i => i.getName())),
            };
            task =
            {
                get: (task: string) => new Task(this, task),
            };
            todoSettings =
            {
                get: (task: Task) => this.content.todoSettings[task.getName()] ?? { },
                set: async (task: Task, settings: CyclicToDo.TodoSettings) =>
                    await this.save(content => content.todoSettings[task.getName()] = settings),
                reset: async (task: Task) =>
                    await this.save(content => delete content.todoSettings[task.getName()]),
            };
            getDoneTicks = (): number =>
                Math.max.apply(null, minamo.core.existFilter(this.live.tasks.map(i => i.previous)).concat([Domain.getTicks() -1])) +1
            done = async (task: string, tick: number = this.getDoneTicks()) =>
                await this.save
                (
                    content =>
                    {
                        const item = this.content.histories[task] ?? { histories: [], first: null, count: 0, };
                        const oldLength = item.histories.length;
                        const temporaryHistories = item.histories.filter(i => tick !== i).concat(tick).sort(simpleReverseComparer);
                        item.histories = temporaryHistories.slice(0, config.maxHistories);
                        item.count += temporaryHistories.length -oldLength;
                        if (null === item.first || tick < item.first)
                        {
                            item.first = tick;
                        }
                        content.histories[task] = item;
                    }
                )
            tagComparer = () => minamo.core.comparer.make<string>
            (
                tag => -this.content.tags[tag].map(todo => this.content.histories[todo].count).reduce((a, b) => a +b, 0)
            )
            todoComparer = (entry: ToDoTagEntryOld, sort = OldStorage.TagSettings.getSort(entry.pass, entry.tag)): minamo.core.comparer.ComparerType<ToDoEntry> =>
            {
                switch(sort)
                {
                    case "smart":
                        return minamo.core.comparer.make<ToDoEntry>
                        ([
                            item => (2.0 /3.0) <= (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ? -1: 1,
                            item => (2.0 /3.0) <= (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ?
                                item.smartRest:
                                -(item.progress ?? -1),
                            item => 1 < item.count ? -2: -item.count,
                            item => 1 < item.count && null !== item.elapsed && null !== item.RecentlySmartAverage ?
                                (item.elapsed -item.RecentlySmartAverage +((item.RecentlyStandardDeviation ?? 0) *Domain.standardDeviationRate)):
                                -(item.elapsed ?? 0),
                            item => entry.todo.indexOf(item.task),
                            item => item.task,
                        ]);
                    case "simple":
                        return minamo.core.comparer.make<ToDoEntry>
                        ([
                            item => item.previous ?? 0,
                            item => item.count,
                            item => entry.todo.indexOf(item.task),
                            item => item.task,
                        ]);
                    // case "limit":
                    //     return minamo.core.comparer.make<ToDoEntry>
                    //     ([
                    //         item => 0 < (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ? -1: 1,
                    //         item => 0 < (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ?
                    //             item.rest:
                    //             -(item.progress ?? -1),
                    //         item => 1 < item.count ? -2: -item.count,
                    //         item => 1 < item.count ? (item.elapsed -item.RecentlySmartAverage +((item.RecentlyStandardDeviation ?? 0) *Domain.standardDeviationRate)): -(item.elapsed ?? 0),
                    //         item => entry.todo.indexOf(item.task),
                    //         item => item.task,
                    //     ]);
                    default:
                        return this.todoComparer(entry, "smart");
                }
            }
            exportJson = () => JSON.stringify(this.content);
            remove = () =>
            {
                let result: true | string = "";
                switch(this.card.type)
                {
                case "oldLocalDb":
                    OldStorage.Pass.remove(this.card.uri);
                    result = true;
                    break;
                case "session":
                    SessionStorage.ToDoList.remove(this.card.uri);
                    result = true;
                    break;
                case "localDb":
                    Storage.ToDoList.remove(this.card.uri);
                    result = true;
                    break;
                default:
                    result = "Unsupported storage type";
                    break;
                }
                if (true === result)
                {
                    Storage.ToDoDocumentList.remove(this.card);
                }
                return result;
            }
        }
        export const invokeFromOldStorage = (pass: string): Document =>
        {
            const content = JSON.parse(OldStorage.exportJson(pass)) as Content;
            const card: DocumentCard =
            {
                type: "oldLocalDb",
                title: content.title,
                uri: pass,
            };
            return new Document
            (
                card,
                content
            );
        };
        export const loadContent = async (card: DocumentCard): Promise<Content | undefined> =>
        {
            let result: Content | undefined;
            switch(card.type)
            {
            case "oldLocalDb":
                result = JSON.parse(OldStorage.exportJson(card.uri)) as Content;
                break;
            case "session":
                result = SessionStorage.ToDoList.get(card.uri) ?? undefined;
                break;
            case "localDb":
                result = Storage.ToDoList.get(card.uri) ?? undefined;
                break;
            }
            return result;
        };
        export const saveContent = async (card: DocumentCard, content: Content): Promise<true | string> =>
        {
            let result: true | string = "";
            switch(card.type)
            {
            case "oldLocalDb":
                OldStorage.importJson(JSON.stringify(content));
                result = true;
                break;
            case "session":
                SessionStorage.ToDoList.set(card.uri, content);
                result = true;
                break;
            case "localDb":
                Storage.ToDoList.set(card.uri, content);
                result = true;
                break;
            default:
                result = "Unsupported storage type";
                break;
            }
            return result;
        };
    }
    export module MigrateBridge
    {
        export type old_updator_type = () => unknown;
        export class OldTransaction
        {
            updators: old_updator_type[] = [];
            public constructor()
            {
            }
            add = (updator: old_updator_type) => (this.updators.push(updator), this);
            commit = async () =>
            {
                if (0 < this.updators.length)
                {
                    const updators = this.updators;
                    this.updators = [];
                    await Promise.all(updators.map(async i => await i()));
                    return true;
                }
                return null;
            }
        }
        export class Transaction
        {
            oldBody: OldTransaction;
            body: Model.Transaction;
            constructor(pass: string | Model.Document)
            {
                if ("string" !== typeof pass)
                {
                    this.body = pass.transaction.make();
                }
                else
                {
                    this.oldBody = new OldTransaction();
                }
            }
            add = (updator: Model.updator_type | old_updator_type) =>
            (
                this.body ?
                    this.body.add(updator):
                    this.oldBody.add(updator as old_updator_type),
                this
            )
            commit = async () => this.body ?
                await this.body.commit():
                await this.oldBody.commit()
        }
        export module Title
        {
            export const get = (pass: string | Model.Document) =>
                "string" === typeof pass ?
                    OldStorage.Title.get(pass):
                    pass.title.get();
            export const updator = (pass: string | Model.Document, title: string) =>
                "string" === typeof pass ?
                    () => (OldStorage.Title.set(pass, title), true):
                    pass.title.updator(title);
        }
        export const getDoneTicks = (pass: string | Model.Document) => "string" === typeof pass ?
            Domain.getDoneTicksOld(pass):
            pass.getDoneTicks();
        export const done = async (pass: string | Model.Document, task: string, tick: number = getDoneTicks(pass)) =>
            "string" === typeof pass ?
            Domain.doneOld(pass, task, tick):
                await pass.done(task, tick);
        export const updateTermCategory = (pass: string | Model.Document, item: ToDoEntry) =>
            "string" === typeof pass ?
                Domain.updateTermCategoryOld(pass, item):
                pass.updateTermCategory(item);
        export const getToDoEntry = (pass: string | Model.Document, task: string): ToDoEntry =>
            "string" === typeof pass ?
                Domain.getToDoEntryRaw(task, OldStorage.History.get(pass, task)):
                pass.getToDoEntry(task);
        export const getTagMember = (pass: string | Model.Document, tag: string) =>
            "string" === typeof pass ?
                OldStorage.TagMember.get(pass, tag):
                pass.tag.get(tag).getMember().map(i => i.getName());
        // export const addTagMember = (pass: string | Model.Document, tag: string, task: string) =>
        //     "string" === typeof pass ?
        //         OldStorage.TagMember.add(pass, tag, task):
        //         pass.tag.get(tag).addMember(task);
        export const exportJson = (pass: string | Model.Document) =>
            "string" === typeof pass ?
                OldStorage.exportJson(pass):
                pass.exportJson();
    }
    export module Domain
    {
        // export const merge = (pass: string, tag: string, todo: string[], _ticks: (number | null)[]) =>
        // {
        //     Storage.Pass.add(pass);
        //     Storage.Tag.add(pass, tag);
        //     Storage.TagMember.merge(pass, tag, todo);
        //     // const temp:{ [task:string]: number[]} = { };
        //     // todo.forEach(task => temp[task] = []);
        //     // ticks.forEach
        //     // (
        //     //     (tick, index) =>
        //     //     {
        //     //         if (null !== tick)
        //     //         {
        //     //             temp[todo[index % todo.length]].push(tick);
        //     //         }
        //     //     }
        //     // );
        //     // todo.forEach(task => Storage.History.add(pass, task, temp[task]));
        // };
        export const timeAccuracy = config.timeAccuracy;
        export const standardDeviationRate = config.standardDeviationRate;
        export const granceTime = (config.granceMinutes *60 *1000) / timeAccuracy;
        export const maxRestAdjustTime = (config.maxRestAdjustMinutes *60 *1000) / timeAccuracy;
        export const getTicks = (date: Date = new Date()) => Math.floor(date.getTime() / timeAccuracy);
        export const dateCoreStringFromTick = (tick: null | number) =>
        {
            if (null === tick)
            {
                return "N/A";
            }
            else
            {
                const date = new Date(tick *timeAccuracy);
                return `${date.getFullYear()}-${("0" +(date.getMonth() +1)).substr(-2)}-${("0" +date.getDate()).substr(-2)}`;
            }
        };
        export function getTime(tick: null): null;
        export function getTime(tick: number): number;
        export function getTime(tick: null | number): null | number;
        export function getTime(tick: null | number): null | number
        {
            if (null === tick)
            {
                return null;
            }
            else
            if (tick < 0)
            {
                return -getTime(tick);
            }
            else
            if (tick *timeAccuracy < 24 *60 *60 *1000)
            {
                return tick;
            }
            else
            {
                const date = new Date(tick *timeAccuracy);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return tick -getTicks(date);
            }
        }
        export function dateStringFromTick(tick: null | number): string
        {
            if (null === tick)
            {
                return "N/A";
            }
            else
            {
                return `${dateCoreStringFromTick(tick)} ${timeCoreStringFromTick(getTime(tick))}`;
            }
        }
        export const timeCoreStringFromTick = (tick: null | number): string =>
        {
            if (null === tick)
            {
                return "N/A";
            }
            else
            if (tick < 0)
            {
                return `-${timeCoreStringFromTick(-tick)}`;
            }
            else
            {
                const time = Math.floor(tick) % (24 *60);
                const hour = Math.floor(time /60);
                const minute = time % 60;
                return `${("00" +hour).slice(-2)}:${("00" +minute).slice(-2)}`;
            }
        };
        export const timeShortStringFromTick = (tick: null | number): string =>
        {
            if (null === tick)
            {
                return "N/A";
            }
            else
            if (tick < 0)
            {
                return `-${timeShortStringFromTick(-tick)}`;
            }
            else
            {
                const days = Math.floor(tick / (24 *60));
                return 10 <= days ?
                    `${days.toLocaleString()} ${locale.map("days")}`:
                    0 < days ?
                        `${days.toLocaleString()} ${locale.map("days")} ${timeCoreStringFromTick(tick)}`:
                        timeCoreStringFromTick(tick);
            }
        };
        export const timeLongStringFromTick = (tick: null | number): string =>
        {
            if (null === tick)
            {
                return "N/A";
            }
            else
            if (tick < 0)
            {
                return `-${timeLongStringFromTick(-tick)}`;
            }
            else
            {
                const days = Math.floor(tick / (24 *60));
                return 0 < days ?
                    `${days.toLocaleString()} ${locale.map("days")} ${timeCoreStringFromTick(tick)}`:
                    timeCoreStringFromTick(tick);
            }
        };
        export const timeRangeStringFromTick = (a: null | number, b: null | number): string =>
            `${Domain.timeShortStringFromTick(a)} 〜 ${Domain.timeShortStringFromTick(b)}`;
        export function parseDate(date: null): null;
        export function parseDate(date: string | null): Date | null;
        export function parseDate(date: string | null): Date | null
        {
            if (null !== date)
            {
                try
                {
                    return new Date(Date.parse(date));
                }
                catch
                {
                    return null;
                }
            }
            return null;
        }
        export const tagMap = (tag: string) =>
        {
            switch(tag)
            {
            case "@root":
            case "@overall":
            case "@unoverall":
            case "@flash":
            case "@pickup":
            case "@restriction":
            case "@short-term":
            case "@medium-term":
            case "@long-term":
            case "@irregular-term":
            case "@untagged":
            case "@deleted":
            case "@new":
            case "@new-sublist":
                return locale.map(tag);
            default:
                return Model.decode(tag);
            }
        };
        export const getStandardScore = (item: ToDoEntry, elapsedTime = item.elapsed) =>
            null !== item.RecentlySmartAverage &&
            null !== item.RecentlyStandardDeviation &&
            null !== elapsedTime ?
                Calculate.standardScore(item.RecentlySmartAverage, item.RecentlyStandardDeviation, elapsedTime):
                null;
        export const isExpired = (item: ToDoEntry, elapsedTime = item.elapsed) =>
            // null !== item.expectedInterval && item.expectedInterval.max < elapsedTime;
            (item.expectedInterval?.max ?? Infinity) < (elapsedTime ?? 0);
        export const getDoneTicksOld = (pass: string, key: string = `pass:(${pass}).last.done.ticks`) =>
            minamo.localStorage.set
            (
                key,
                Math.max
                (
                    minamo.localStorage.getOrNull<number>(key) ?? 0,
                    getTicks() -1
                ) +1
            );
        export const doneOld = async (pass: string, task: string, tick: number = getDoneTicksOld(pass)) =>
        {
            OldStorage.History.addTick(pass, task, tick);
            return tick;
        };
        export const tagComparerOld = (pass: string) => minamo.core.comparer.make<string>
        (
            tag => -OldStorage.TagMember.get(pass, tag).map(todo => OldStorage.History.getTicks(pass, todo).length).reduce((a, b) => a +b, 0)
        );
        export const todoComparerOld = (entry: ToDoTagEntryOld, sort = OldStorage.TagSettings.getSort(entry.pass, entry.tag)): minamo.core.comparer.ComparerType<ToDoEntry> =>
        {
            switch(sort)
            {
                case "smart":
                    return minamo.core.comparer.make<ToDoEntry>
                    ([
                        item => (2.0 /3.0) <= (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ? -1: 1,
                        item => (2.0 /3.0) <= (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ?
                            item.smartRest:
                            -(item.progress ?? -1),
                        item => 1 < item.count ? -2: -item.count,
                        item => 1 < item.count && null !== item.elapsed && null !== item.RecentlySmartAverage ?
                            (item.elapsed -item.RecentlySmartAverage +((item.RecentlyStandardDeviation ?? 0) *Domain.standardDeviationRate)):
                            -(item.elapsed ?? 0),
                        item => entry.todo.indexOf(item.task),
                        item => item.task,
                    ]);
                case "simple":
                    return minamo.core.comparer.make<ToDoEntry>
                    ([
                        item => item.previous ?? 0,
                        item => item.count,
                        item => entry.todo.indexOf(item.task),
                        item => item.task,
                    ]);
                // case "limit":
                //     return minamo.core.comparer.make<ToDoEntry>
                //     ([
                //         item => 0 < (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ? -1: 1,
                //         item => 0 < (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ?
                //             item.rest:
                //             -(item.progress ?? -1),
                //         item => 1 < item.count ? -2: -item.count,
                //         item => 1 < item.count ? (item.elapsed -item.RecentlySmartAverage +((item.RecentlyStandardDeviation ?? 0) *Domain.standardDeviationRate)): -(item.elapsed ?? 0),
                //         item => entry.todo.indexOf(item.task),
                //         item => item.task,
                //     ]);
                default:
                    return todoComparerOld(entry, "smart");
            }
        };
        export const getTermCategoryByAverage = (item: ToDoEntry) =>
            null !== item.smartRest && null !== item.RecentlySmartAverage ?
                (
                    item.RecentlySmartAverage < config.maxShortTermMinutes ?
                        "@short-term":
                        (
                            item.RecentlySmartAverage < config.maxMediumTermMinutes ?
                                "@medium-term":
                                "@long-term"
                        )
                ):
                "@irregular-term";
        export const getTermCategoryByRest = (item: ToDoEntry) =>
            null !== item.smartRest && null !== item.rest ?
                (
                    item.rest < 24 *60 ?
                        "@short-term":
                        "@long-term"
                ):
                "@irregular-term";
        export const getTermCategory = getTermCategoryByAverage;
        export const updateTermCategoryOld = (pass: string, item: ToDoEntry) =>
        {
            const term = getTermCategory(item);
            if ( ! OldStorage.TagMember.isMember(pass, term, item.task))
            {
                ["@short-term", "@medium-term", "@long-term", "@irregular-term"].forEach
                (
                    tag =>
                    {
                        if (tag === term)
                        {
                            OldStorage.TagMember.add(pass, term, item.task);
                        }
                        else
                        {
                            if (0 <= OldStorage.TagMember.get(pass, tag).indexOf(item.task))
                            {
                                OldStorage.TagMember.remove(pass, tag, item.task);
                            }
                        }
                    }
                );
            }
        };
        // export const getRecentlyHistory = (pass: string, task: string) =>
        // {
        //     const full = Storage.History.get(pass, task);
        //     const result =
        //     {
        //         recentries: full.filter((_, index) => index < 25),
        //         previous: full.length <= 0 ? null: full[0],
        //         //average: full.length <= 1 ? null: (full[0] -full[full.length -1]) / (full.length -1),
        //         count: full.length,
        //     };
        //     return result;
        // };
        export const getToDoEntryOld = (pass: string, task: string): ToDoEntry =>
                getToDoEntryRaw(task, OldStorage.History.get(pass, task));
        export const getToDoEntryRaw = (task: string, full: HistoryEntry) =>
        {
            // const history: { recentries: number[], previous: null | number, count: number, } = getRecentlyHistory(pass, task);
            // const full = OldStorage.History.get(pass, task);
            const longRecentries = Calculate.intervals(full.histories);
            const longRecentlyAverage = longRecentries.length <= 1 ? null: Calculate.average(longRecentries);
            const longRecentlyStandardDeviation = longRecentries.length <= 5 ?
                null:
                Calculate.standardDeviation(<[number, ...number[]]>longRecentries, <number>longRecentlyAverage);
            const history =
            {
                // full,
                intervals:
                    (
                        null === longRecentlyStandardDeviation || null === longRecentlyAverage ?
                            longRecentries:
                            // todo 毎の hisotry 画面では config.granceMinutes を使うが、ここでは予想間隔の精度の都合から使わない。 ( 整合性が無くなるが、特にそれでなんの影響も無いので気にしない。 )
                            //longRecentries.filter(i => (i -longRecentlyAverage -config.granceMinutes) / longRecentlyStandardDeviation <= config.sleepStandardDeviationRate)
                            longRecentries.filter(i => (i -longRecentlyAverage) / longRecentlyStandardDeviation <= config.sleepStandardDeviationRate)
                    )
                    .filter((_, index) => index < 25),
                // intervals: longRecentries.filter((_, index) => index < 25),
                // previous: full.histories.length <= 0 ? null: full.histories[0],
                //average: full.length <= 1 ? null: (full[0] -full[full.length -1]) / (full.length -1),
                count: full.count,
            };
            const inflateRecentrly = (intervals: number[]) => 20 <= intervals.length ?
                intervals.filter((_, ix) => ix < 5).concat(intervals.filter((_, ix) => ix < 10), intervals):
                intervals.filter((_, ix) => ix < 5).concat(intervals);
            // const calcAverage = (ticks: number[], maxLength: number = ticks.length, length = Math.min(maxLength, ticks.length)) =>
            //     ((ticks[0] -ticks[length -1]) /(length -1));
            const inflatedRecentrlyIntervals = inflateRecentrly(history.intervals);
            const item: ToDoEntry =
            {
                task,
                isDefault: false,
                progress: null,
                first: full.first,
                previous: getPreviousFromHistryEntry(full),
                elapsed: null,
                rest: null,
                RecentlyStandardDeviation: history.intervals.length <= 0 ?
                    null:
                    history.intervals.length <= 1 ?
                        Calculate.average(<[number, ...number[]]>history.intervals) *0.05: // この値を標準偏差として代用
                        Calculate.standardDeviation(inflatedRecentrlyIntervals),
                count: history.count,
                RecentlySmartAverage: history.intervals.length <= 0 ?
                    null:
                    Calculate.average(inflatedRecentrlyIntervals),
                RecentlyAverage: history.intervals.length <= 0 ?
                    null:
                    Calculate.average(longRecentries.filter((_, index) => index < 10)),
                TotalAverage: isSecondOrMoreHistryEntry(full) ?
                    (getPreviousFromHistryEntry(full) -full.first) / (full.count -1):
                    null,
                smartRest: null,
                expectedInterval: null,
            };
            if (isMoreToDoEntry(item))
            {
                const base = inflatedRecentrlyIntervals.length;
                const lows = (base /2) +Math.max(inflatedRecentrlyIntervals.filter(i => i < item.RecentlySmartAverage).length, 1);
                const highs = (base /2) +Math.max(inflatedRecentrlyIntervals.filter(i => item.RecentlySmartAverage < i).length, 1);
                item.expectedInterval =
                {
                    min: Math.max(item.RecentlySmartAverage /10, item.RecentlySmartAverage -((item.RecentlyStandardDeviation ?? 0) *Domain.standardDeviationRate *highs /base)),
                    max: item.RecentlySmartAverage +((item.RecentlyStandardDeviation ?? 0) *Domain.standardDeviationRate *lows /base),
                };
            }
            return item;
        };
        export const calcSmartRestCore =
        (
            span: number,
            standardDeviation: number,
            elapsed: number,
            rest: number = span -elapsed,
            delta: number = Math.min(maxRestAdjustTime, Math.max(rest /2, 0)),
            advancedRest: number = rest -delta,
        ) =>
            0 < rest ?
                advancedRest *Math.max(Math.log((advancedRest /standardDeviation) *100), 0.1):
                rest;
        export const calcSmartRest = (item: ToDoEntryMore) =>
            calcSmartRestCore
            (
                item.expectedInterval.max,
                item.RecentlyStandardDeviation ?? (item.RecentlySmartAverage *0.1),
                item.elapsed
            );
        export const updateProgress = (pass: string | Model.Document, item: ToDoEntry, now: number = Domain.getTicks()) =>
        {
            if (isFirstOrMoreToDoEntry(item))
            {
                // todo の順番が前後にブレるのを避ける為、１分以内に複数の todo が done された場合、二つ目以降は +1 分ずつズレた時刻で打刻され( getDoneTicks() 関数の実装を参照 )、直後は素直に計算すると経過時間がマイナスになってしまうので、マイナスの場合はゼロにする。
                item.elapsed = Math.max(0.0, now -item.previous);
                if (isMoreToDoEntry(item))
                {
                    const short = item.expectedInterval.min;
                    const long = item.expectedInterval.max;
                    item.rest = long -item.elapsed;
                    item.isDefault = short <= item.elapsed;
                    const shortOneThird = short /3.0;
                    if (item.elapsed < shortOneThird)
                    {
                        item.progress = item.elapsed /short;
                    }
                    else
                    if (item.elapsed < long)
                    {
                        item.progress = (1.0 /3.0) +(((item.elapsed -shortOneThird) /(long -shortOneThird)) *2.0 /3.0);
                    }
                    else
                    {
                        item.progress = 1.0 +((item.elapsed -long) /item.RecentlySmartAverage);
                    }
                    item.smartRest = calcSmartRest(item);
                    if (item.smartRest < 0)
                    {
                        item.progress = null;
                        item.isDefault = false;
                        if (Domain.granceTime < -item.smartRest)
                        {
                            // item.RecentlySmartAverage = null;
                            // item.RecentlyStandardDeviation = null;
                            item.smartRest = null;
                        }
                    }
                }
            }
            if ("string" === typeof pass)
            {
                const isFlashTarget = OldStorage.TodoSettings.isFlashTarget(pass, item);
                const isFlashed = OldStorage.TagMember.isFlashTask(pass, item.task);
                if (isFlashTarget && ! isFlashed)
                {
                    OldStorage.TagMember.add(pass, "@flash", item.task);
                    Render.updateWindow?.("dirty");
                }
                if ( ! isFlashTarget && isFlashed)
                {
                    OldStorage.TagMember.remove(pass, "@flash", item.task);
                    Render.updateWindow?.("dirty");
                }
                const isPickupTarget = OldStorage.TodoSettings.isPickupTarget(pass, item);
                const isPickuped = OldStorage.TagMember.isPickupTask(pass, item.task);
                if (isPickupTarget && ! isPickuped)
                {
                    OldStorage.TagMember.add(pass, "@pickup", item.task);
                    Render.updateWindow?.("dirty");
                }
                if ( ! isPickupTarget && isPickuped)
                {
                    OldStorage.TagMember.remove(pass, "@pickup", item.task);
                    Render.updateWindow?.("dirty");
                }
                const isRestrictionTarget = OldStorage.TodoSettings.isRestrictionTarget(pass, item);
                const isRestrictioned = OldStorage.TagMember.isRestrictionTask(pass, item.task);
                if (isRestrictionTarget && ! isRestrictioned)
                {
                    OldStorage.TagMember.add(pass, "@restriction", item.task);
                    Render.updateWindow?.("dirty");
                }
                if ( ! isRestrictionTarget && isRestrictioned)
                {
                    OldStorage.TagMember.remove(pass, "@restriction", item.task);
                    Render.updateWindow?.("dirty");
                }
            }
            MigrateBridge.updateTermCategory(pass, item);
            return item;
        };
        export const updateListProgress = (pass: string | Model.Document, list: ToDoEntry[], now: number = Domain.getTicks()) =>
            list.map(item => updateProgress(pass, item, now));
        export const sortList = (entry: ToDoTagEntryOld, list: ToDoEntry[]) =>
        {
            const tasks = JSON.stringify(list.map(i => i.task));
            list.sort(Domain.todoComparerOld(entry));
            return tasks === JSON.stringify(list.map(i => i.task));
        };
    }
    export module Render
    {
        export const fullscreenEnabled = () => document.fullscreenEnabled ?? (document as any).webkitFullscreenEnabled;
        export const fullscreenElement = () => (document.fullscreenElement ?? ((document as any).webkitFullscreenElement) ?? null);
        export const requestFullscreen = async (element: Element = document.documentElement) =>
        {
            if (element.requestFullscreen)
            {
                await element.requestFullscreen();
            }
            else
            if ((element as any).webkitRequestFullscreen)
            {
                await ((element as any).webkitRequestFullscreen)();
            }
        };
        export const exitFullscreen = async () =>
        {
            if (document.exitFullscreen)
            {
                await document.exitFullscreen();
            }
            else
            if ((document as any).webkitCancelFullScreen)
            {
                await ((document as any).webkitCancelFullScreen)();
            }
        };
        export module Operate
        {
            export const renameList = async (pass: string | Model.Document, newName: string, onCanceled: () => unknown = () => updateWindow("operate")) =>
            {
                const backup = MigrateBridge.Title.get(pass);
                await withUpdateProgress
                (
                    $span("")(locale.map("Storing")),
                    new MigrateBridge.Transaction(pass)
                        .add(MigrateBridge.Title.updator(pass, newName))
                        .commit()
                );
                const toast = makeToast
                ({
                    content: $span("")(`ToDo リストの名前を変更しました！： ${backup} → ${newName}`),
                    backwardOperator: cancelTextButton
                    (
                        async () =>
                        {
                            await withUpdateProgress
                            (
                                $span("")(locale.map("Storing")),
                                new MigrateBridge.Transaction(pass)
                                    .add(MigrateBridge.Title.updator(pass, backup))
                                    .commit()
                            );
                            await toast.hide();
                            onCanceled();
                        }
                    ),
                });
            };
            export const removeList = async (pass: string, onCanceled: () => unknown = () => updateWindow("operate")) =>
            {
                const list = JSON.parse(OldStorage.exportJson(pass));
                OldStorage.Pass.remove(list.pass);
                const toast = makeToast
                ({
                    content: $span("")(`ToDo リストを削除しました！: ${list.title}`),
                    backwardOperator: cancelTextButton
                    (
                        async () =>
                        {
                            OldStorage.importJson(JSON.stringify(list));
                            await toast.hide();
                            onCanceled();
                        }
                    ),
                });
            };
            export const done = async (pass: string, task: string, tick: number, onCanceled: () => unknown) =>
            {
                document.body.classList.add("flash");
                setTimeout(() => document.body.classList.remove("flash"), 1500);
                MigrateBridge.done(pass, task, tick);
                const isPickuped =
                    0 <= MigrateBridge.getTagMember(pass, "@pickup").indexOf(task) &&
                    "always" !== OldStorage.TodoSettings.get(pass, task).pickup?.type;
                if (isPickuped)
                {
                    OldStorage.TagMember.remove(pass, "@pickup", task);
                }
                const toast = makeToast
                ({
                    content: $span("")(`${locale.map("Done!")}: ${task}`),
                    backwardOperator: cancelTextButton
                    (
                        async () =>
                        {
                            OldStorage.History.removeTickRaw(pass, task, tick); // ごみ箱は利用せずに直に削除
                            if (isPickuped)
                            {
                                OldStorage.TagMember.add(pass, "@pickup", task);
                            }
                            await toast.hide();
                            onCanceled();
                        }
                    ),
                });
            };
            // export const addToPickup = async (pass: string, task: string, onCanceled: () => unknown) =>
            // {
            //     OldStorage.TagMember.add(pass, "@pickup", task);
            //     const toast = makeToast
            //     ({
            //         content: $span("")(`ピックアップに追加！: ${task}`),
            //         backwardOperator: cancelTextButton
            //         (
            //             async () =>
            //             {
            //                 OldStorage.TagMember.remove(pass, "@pickup", task);
            //                 await toast.hide();
            //                 onCanceled();
            //             }
            //         ),
            //     });
            // };
            // export const removeFromPickup = async (pass: string, task: string, onCanceled: () => unknown) =>
            // {
            //     OldStorage.TagMember.remove(pass, "@pickup", task);
            //     const toast = makeToast
            //     ({
            //         content: $span("")(`ピックアップからハズしました！: ${task}`),
            //         backwardOperator: cancelTextButton
            //         (
            //             async () =>
            //             {
            //                 OldStorage.TagMember.add(pass, "@pickup", task);
            //                 await toast.hide();
            //                 onCanceled();
            //             }
            //         ),
            //     });
            // };
            export const clearFilterHistory = async (onCanceled: () => unknown) =>
            {
                const backup = Storage.Filter.get();
                Storage.Filter.set([]);
                const toast = makeToast
                ({
                    content: $span("")(`絞り込みの履歴をクリアしました。`),
                    backwardOperator: cancelTextButton
                    (
                        async () =>
                        {
                            Storage.Filter.set(backup);
                            await toast.hide();
                            onCanceled();
                        }
                    ),
                });
            };
        }
        export const cancelTextButton = (onCanceled: () => unknown) =>
        ({
            tag: "button",
            className: "text-button",
            children: label("roll-back"),
            onclick: async () =>
            {
                onCanceled();
                makeToast
                ({
                    content: $span("")(label("roll-backed")),
                    wait: 3000,
                });
            },
        });
        export interface PageParamsRaw
        {
            pass?:string;
            tag?:string;
            todo?: string;
            hash?: string;
            filter?: string;
        }
        export type PageParams = PageParamsRaw & {[key: string]: string};
        export const internalLink = (data: { className?: string, href: PageParams, children: minamo.dom.Source}) =>
        ({
            tag: "a",
            className: data.className,
            href: makeUrl(data.href),
            children: data.children,
            onclick: (_event: MouseEvent) =>
            {
                // event.stopPropagation();
                showUrl(data.href);
                return false;
            }
        });
        export const externalLink = (data: { className?: string, href: string, children: minamo.dom.Source}) =>
        ({
            tag: "a",
            className: data.className,
            href: data.href,
            children: data.children,
        });
        export const linkButton = (data: { className?: string, children: minamo.dom.Source, onclick: (event: MouseEvent) => unknown}) =>
        ({
            tag: "a",
            className: data.className,
            href: "",
            children: data.children,
            onclick: data.onclick
        });
        export const $make = minamo.dom.make;
        export const $tag = minamo.dom.tag;
        export const $div = $tag("div");
        export const $span = $tag("span");
        export const disabledColorRGB = "128,128,128";
        export const accentProgressColor = "#22884466";
        export const flashProgressColor = "#0F469988";
        export const flashDisabledColor = "#0F469955";
        export const activeProgressColor = "#6F7F0088";
        export const activeDisabledColor = "#6F7F0055";
        export const deleteProgressColor = "#831B5088";
        export const deleteDisabledColor = "#831B5055";
        export const backgroundLinerGradient = (leftPercent: string, leftColor: string, rightColor: string) =>
            `background: linear-gradient(to right, ${leftColor} ${leftPercent}, ${rightColor} ${leftPercent});`;
        export const progressStyleCore = (progressColor: string, disabledColor: string, backgroundColor: string, progress: number | null) => null === progress ?
            `background-color: ${disabledColor};`:
            1 <= progress ?
                `background: ${progressColor};`:
                backgroundLinerGradient
                (
                    progress.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 }),
                    progressColor,
                    backgroundColor
                );
        export const progressDefaultTitleStyle = (progress: number | null) =>
            progressStyleCore
            (
                accentProgressColor,
                `rgba(${disabledColorRGB},0.2)`,
                `rgba(${disabledColorRGB},0.0)`,
                progress
            );
        export const progressFlashTitleStyle = (progress: number | null) =>
            progressStyleCore
            (
                flashProgressColor,
                flashDisabledColor,
                `rgba(${disabledColorRGB},0.0)`,
                progress
            ) +" repeat-flash";
        export const progressPickupTitleStyle = (progress: number | null) =>
            progressStyleCore
            (
                activeProgressColor,
                activeDisabledColor,
                `rgba(${disabledColorRGB},0.0)`,
                progress
            );
        export const progressRestrictionTitleStyle = (progress: number | null) =>
            progressStyleCore
            (
                deleteProgressColor,
                deleteDisabledColor,
                `rgba(${disabledColorRGB},0.0)`,
                progress
            );
        export const progressTitleStyle = (pass: string, item: ToDoEntry) =>
            OldStorage.TagMember.isRestrictionTask(pass, item.task) ?
                progressRestrictionTitleStyle(item.progress):
            OldStorage.TagMember.isFlashTask(pass, item.task) ?
                progressFlashTitleStyle(item.progress):
            OldStorage.TagMember.isPickupTask(pass, item.task) ?
                progressPickupTitleStyle(item.progress):
                progressDefaultTitleStyle(item.progress);
        export const progressDefaultInformationStyle = (progress: number | null) =>
            progressStyleCore
            (
                accentProgressColor,
                `rgba(${disabledColorRGB},0.4)`,
                `rgba(${disabledColorRGB},0.2)`,
                progress
            );
        export const progressFlashInformationStyle = (progress: number | null) =>
            progressStyleCore
            (
                flashProgressColor,
                flashDisabledColor,
                `rgba(${disabledColorRGB},0.2)`,
                progress
            ) +" repeat-flash";
        export const progressPickupInformationStyle = (progress: number | null) =>
            progressStyleCore
            (
                activeProgressColor,
                activeDisabledColor,
                `rgba(${disabledColorRGB},0.2)`,
                progress
            );
        export const progressRestrictionInformationStyle = (progress: number | null) =>
            progressStyleCore
            (
                deleteProgressColor,
                deleteDisabledColor,
                `rgba(${disabledColorRGB},0.2)`,
                progress
            );
        export const progressInformationStyle = (pass: string, item: ToDoEntry) =>
            OldStorage.TagMember.isRestrictionTask(pass, item.task) ?
                progressRestrictionInformationStyle(item.progress):
            OldStorage.TagMember.isFlashTask(pass, item.task) ?
                progressFlashInformationStyle(item.progress):
            OldStorage.TagMember.isPickupTask(pass, item.task) ?
                progressPickupInformationStyle(item.progress):
                progressDefaultInformationStyle(item.progress);
        export const labelSpan = $span("label");
        export const label = (label: locale.LocaleKeyType) => labelSpan
        ([
            $span("locale-parallel")(locale.parallel(label)),
            $span("locale-map")(locale.map(label)),
        ]);
        export const monospace = (classNameOrValue: string | minamo.dom.Source, labelOrValue?: minamo.dom.Source, valueOrNothing?: minamo.dom.Source) =>
            "string" !== typeof classNameOrValue || undefined === labelOrValue ?
                $span("value monospace")(classNameOrValue):
                $div(classNameOrValue)
                ([
                    undefined !== valueOrNothing ? labelOrValue: [],
                    $span("value monospace")(valueOrNothing ?? labelOrValue),
                ]);
        export const systemPrompt = async (message?: string, _default?: string): Promise<string | null> =>
        {
            await minamo.core.timeout(100); // この wait をかましてないと呼び出し元のポップアップメニューが window.prompt が表示されてる間、ずっと表示される事になる。
            return await new Promise(resolve => resolve(window.prompt(message, _default)?.trim() ?? null));
        };
        export const customPrompt = async (message?: string, _default?: string): Promise<string | null> =>
        {
            const input = $make(HTMLInputElement)
            ({
                tag: "input",
                type: "text",
                value: _default,
            });
            return await new Promise
            (
                resolve =>
                {
                    let result: string | null = null;
                    const ui = popup
                    ({
                        children:
                        [
                            $tag("h2")("")(message ?? locale.map("please input")),
                            input,
                            $div("popup-operator")
                            ([
                                {
                                    tag: "button",
                                    className: "cancel-button",
                                    children: locale.map("Cancel"),
                                    onclick: () =>
                                    {
                                        result = null;
                                        ui.close();
                                    },
                                },
                                {
                                    tag: "button",
                                    className: "default-button",
                                    children: locale.map("OK"),
                                    onclick: () =>
                                    {
                                        result = input.value;
                                        ui.close();
                                    },
                                },
                            ]),
                        ],
                        onClose: async () => resolve(result),
                    });
                    input.setSelectionRange(0, _default?.length ?? 0);
                    input.focus();
                }
            );
        };
        // export const prompt = systemPrompt;
        export const prompt = customPrompt;
        // export const alert = (message: string) => window.alert(message);
        export const alert = (message: string) => makeToast({ content: message, });

        export const systemConfirm = (message: string) => window.confirm(message);
        export const confirm = systemConfirm;
        export const newListPrompt = async () =>
        {
            const newList = await prompt(locale.map("Input a ToDo list's name."), locale.map("ToDo List"));
            if (null !== newList)
            {
                const pass = OldStorage.Pass.generate();
                OldStorage.Title.set(pass, newList);
                await showUrl({ pass, tag: "@overall", });
            }
        };
        export const newTagPrompt = async (pass: string) =>
        {
            const newTag = await prompt(locale.map("Input a tag's name."), "");
            if (null !== newTag)
            {
                const tag = Model.encode(newTag.trim());
                OldStorage.Tag.add(pass, tag);
                return tag;
            }
            return null;
        };
        export const dateTimePrompt = async (message: string, _default: number): Promise<string | null> =>
        {
            const inputDate = $make(HTMLInputElement)
            ({
                tag: "input",
                type: "date",
                value: Domain.dateCoreStringFromTick(_default),
                required: "",
            });
            const inputTime = $make(HTMLInputElement)
            ({
                tag: "input",
                type: "time",
                value: Domain.timeCoreStringFromTick(Domain.getTime(_default)),
                required: "",
            });
            return await new Promise
            (
                resolve =>
                {
                    let result: string | null = null;
                    const ui = popup
                    ({
                        children:
                        [
                            $tag("h2")("")(message),
                            inputDate,
                            inputTime,
                            $div("popup-operator")
                            ([
                                {
                                    tag: "button",
                                    className: "cancel-button",
                                    children: locale.map("Cancel"),
                                    onclick: () =>
                                    {
                                        result = null;
                                        ui.close();
                                    },
                                },
                                {
                                    tag: "button",
                                    className: "default-button",
                                    children: locale.map("OK"),
                                    onclick: () =>
                                    {
                                        result = `${inputDate.value}T${inputTime.value}`;
                                        ui.close();
                                    },
                                },
                            ])
                        ],
                        onClose: async () => resolve(result),
                    });
                }
            );
        };
        export const addRemoveTagsPopup = async (pass: string, item: ToDoEntry, currentTags: string[]): Promise<boolean> =>
        {
            return await new Promise
            (
                async resolve =>
                {
                    let hasNewTag = false;
                    let result: string[] = currentTags.concat([]);
                    const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                    const tagButtonListUpdate = async () => minamo.dom.replaceChildren
                    (
                        tagButtonList,
                        [
                            await Promise.all
                            (
                                ["@pickup"].concat(OldStorage.Tag.get(pass).sort(Domain.tagComparerOld(pass))).concat("@unoverall").map
                                (
                                    async tag =>
                                    {
                                        const dom = $make(HTMLButtonElement)
                                        ({
                                            tag: "button",
                                            className: "check-button",
                                            children:
                                            [
                                                await Resource.loadSvgOrCache("check-icon"),
                                                $span("")(Domain.tagMap(tag)),
                                            ],
                                            onclick: () =>
                                            {
                                                if (0 <= result.indexOf(tag))
                                                {
                                                    result = result.filter(i => tag !== i);
                                                    OldStorage.TagMember.remove(pass, tag, item.task);
                                                }
                                                else
                                                {
                                                    result.push(tag);
                                                    OldStorage.TagMember.add(pass, tag, item.task);
                                                }
                                                update();
                                            }
                                        });
                                        const update = () =>
                                        {
                                            dom.classList.toggle("checked", 0 <= result.indexOf(tag));
                                        };
                                        update();
                                        return dom;
                                    },
                                )
                            ),
                            {
                                tag: "button",
                                className: "check-button",
                                children:
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    $span("")(Domain.tagMap("@new")),
                                ],
                                onclick: async () =>
                                {
                                    const tag = await newTagPrompt(pass);
                                    if (null !== tag)
                                    {
                                        result.push(tag);
                                        OldStorage.TagMember.add(pass, tag, item.task);
                                        hasNewTag = true;
                                        await tagButtonListUpdate();
                                    }
                                }
                            },
                        ]
                    );
                    await tagButtonListUpdate();
                    const ui = popup
                    ({
                        className: "add-remove-tags-popup",
                        children:
                        [
                            $tag("h2")("")(item.task),
                            tagButtonList,
                            $div("popup-operator")
                            ([{
                                tag: "button",
                                className: "default-button",
                                children: label("Close"),
                                onclick: () =>
                                {
                                    ui.close();
                                },
                            }])
                        ],
                        onClose: async () => resolve
                        (
                            JSON.stringify(result.sort()) !== JSON.stringify(currentTags.concat([]).sort()) || hasNewTag
                        ),
                    });
                }
            );
        };
        export const moveToSublistPopup = async (pass: string, item: ToDoEntry): Promise<boolean> =>
        {
            return await new Promise
            (
                async resolve =>
                {
                    let result = false;
                    const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                    minamo.dom.replaceChildren
                    (
                        tagButtonList,
                        [
                            await Promise.all
                            (
                                ["@root"].concat(OldStorage.Tag.get(pass).filter(tag => Model.isSublistOld(tag)).sort(Domain.tagComparerOld(pass))).map
                                (
                                    async sublist =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${sublist === (OldStorage.Task.getSublist(item.task) ?? "@root") ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")(Domain.tagMap(sublist)),
                                        ],
                                        onclick: () =>
                                        {
                                            OldStorage.TagMember.add(pass, sublist, item.task);
                                            result = true;
                                            ui.close();
                                        }
                                    }),
                                )
                            ),
                            {
                                tag: "button",
                                className: "check-button",
                                children:
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    $span("")(Domain.tagMap("@new-sublist")),
                                ],
                                onclick: async () =>
                                {
                                    const sublist = await prompt(locale.map("Input a Sublist's name."), "");
                                    if (null !== sublist)
                                    {
                                        const tag = Model.encodeSublist(sublist.trim());
                                        OldStorage.Tag.add(pass, tag);
                                        OldStorage.TagMember.add(pass, tag, item.task);
                                        result = true;
                                        ui.close();
                                    }
                                }
                            },
                        ]
                    );
                    const ui = popup
                    ({
                        className: "add-remove-tags-popup",
                        children:
                        [
                            $tag("h2")("")(item.task),
                            tagButtonList,
                            $div("popup-operator")
                            ([{
                                tag: "button",
                                className: "default-button",
                                children: label("Close"),
                                onclick: () =>
                                {
                                    ui.close();
                                },
                            }])
                        ],
                        onClose: async () => resolve(result),
                    });
                }
            );
        };
        export const themeSettingsPopup = async (settings: SystemSettings = Storage.SystemSettings.get()): Promise<boolean> =>
        {
            const init = settings.theme ?? "auto";
            return await new Promise
            (
                async resolve =>
                {
                    let result = false;
                    const checkButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                    const checkButtonListUpdate = async () => minamo.dom.replaceChildren
                    (
                        checkButtonList,
                        [
                            await Promise.all
                            (
                                (<ThemeType[]>["auto", "light", "dark"]).map
                                (
                                    async (key: ThemeType) =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${key === (settings.theme ?? "auto") ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")(label(<"theme.auto" | "theme.light" | "theme.dark">`theme.${key}`)),
                                        ],
                                        onclick: async () =>
                                        {
                                            if (key !== (settings.theme ?? "auto"))
                                            {
                                                settings.theme = key;
                                                Storage.SystemSettings.set(settings);
                                                await checkButtonListUpdate();
                                                updateStyle();
                                                result = init !== key;
                                            }
                                        }
                                    })
                                )
                            )
                        ]
                    );
                    await checkButtonListUpdate();
                    const ui = popup
                    ({
                        // className: "add-remove-tags-popup",
                        children:
                        [
                            $tag("h2")("")(label("Theme setting")),
                            checkButtonList,
                            $div("popup-operator")
                            ([{
                                tag: "button",
                                className: "default-button",
                                children: label("Close"),
                                onclick: () =>
                                {
                                    ui.close();
                                },
                            }])
                        ],
                        onClose: async () => resolve(result),
                    });
                }
            );
        };
        export const localeSettingsPopup = async (settings: SystemSettings = Storage.SystemSettings.get()): Promise<boolean> =>
        {
            return await new Promise
            (
                async resolve =>
                {
                    let result = false;
                    const checkButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                    const checkButtonListUpdate = async () => minamo.dom.replaceChildren
                    (
                        checkButtonList,
                        [
                            {
                                tag: "button",
                                className: `check-button ${"@auto" === (settings.locale ?? "@auto") ? "checked": ""}`,
                                children:
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    $span("")(label("language.auto")),
                                ],
                                onclick: async () =>
                                {
                                    if (null !== (settings.locale ?? null))
                                    {
                                        settings.locale = undefined;
                                        Storage.SystemSettings.set(settings);
                                        result = true;
                                        await checkButtonListUpdate();
                                    }
                                }
                            },
                            await Promise.all
                            (
                                locale.locales.map
                                (
                                    async key =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${key === (settings.locale ?? "@auto") ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")(labelSpan(locale.getLocaleName(key))),
                                        ],
                                        onclick: async () =>
                                        {
                                            if (key !== settings.locale ?? null)
                                            {
                                                settings.locale = key;
                                                Storage.SystemSettings.set(settings);
                                                result = true;
                                                await checkButtonListUpdate();
                                            }
                                        }
                                    })
                                )
                            )
                        ]
                    );
                    await checkButtonListUpdate();
                    const ui = popup
                    ({
                        // className: "add-remove-tags-popup",
                        children:
                        [
                            $tag("h2")("")(label("Language setting")),
                            checkButtonList,
                            $div("popup-operator")
                            ([{
                                tag: "button",
                                className: "default-button",
                                children: label("Close"),
                                onclick: () =>
                                {
                                    ui.close();
                                },
                            }])
                        ],
                        onClose: async () => resolve(result),
                    });
                }
            );
        };
        export const tagSortSettingsPopup = async (pass: string, tag: string, settings: TagSettings = OldStorage.TagSettings.get(pass, tag)): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const tagButtonListUpdate = async () => minamo.dom.replaceChildren
                (
                    tagButtonList,
                    [
                        "@overall" !== tag ?
                            {
                                tag: "button",
                                className: `check-button ${"@home" === (settings.sort ?? "@home") ? "checked": ""}`,
                                children:
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    $span("")(label("sort.home")),
                                ],
                                onclick: async () =>
                                {
                                    settings.sort = undefined;
                                    OldStorage.TagSettings.set(pass, tag, settings);
                                    result = true;
                                    await tagButtonListUpdate();
                                }
                            }:
                            [],
                        {
                            tag: "button",
                            className: `check-button ${"smart" === (settings.sort ?? ("@overall" === tag ? "smart": "@home")) ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("sort.smart")),
                            ],
                            onclick: async () =>
                            {
                                settings.sort = "smart";
                                OldStorage.TagSettings.set(pass, tag, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        {
                            tag: "button",
                            className: `check-button ${"simple" === (settings.sort ?? "smart") ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("sort.simple")),
                            ],
                            onclick: async () =>
                            {
                                settings.sort = "simple";
                                OldStorage.TagSettings.set(pass, tag, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        // {
                        //     tag: "button",
                        //     className: `check-button ${"limit" === (settings.sort ?? "smart") ? "checked": ""}`,
                        //     children:
                        //     [
                        //         await Resource.loadSvgOrCache("check-icon"),
                        //         $span("")(label("sort.limit")),
                        //     ],
                        //     onclick: async () =>
                        //     {
                        //         settings.sort = "limit";
                        //         OldStorage.TagSettings.set(pass, tag, settings);
                        //         result = true;
                        //         await tagButtonListUpdate();
                        //     }
                        // },
                    ]
                );
                await tagButtonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(`${locale.map("Sort order setting")}: ${Domain.tagMap(tag)}`),
                        tagButtonList,
                        $div("popup-operator")
                        ([{
                            tag: "button",
                            className: "default-button",
                            children: label("Close"),
                            onclick: () =>
                            {
                                ui.close();
                            },
                        }]),
                    ],
                    onClose: async () => resolve(result),
                });
            }
        );
        export const tagDisplayStyleSettingsPopup = async (pass: string, tag: string, settings: TagSettings = OldStorage.TagSettings.get(pass, tag)): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const defaultStyle = "full";
                const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const tagButtonListUpdate = async () => minamo.dom.replaceChildren
                (
                    tagButtonList,
                    [
                        "@overall" !== tag ?
                            {
                                tag: "button",
                                className: `check-button ${"@home" === (settings.displayStyle ?? defaultStyle) ? "checked": ""}`,
                                children:
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    $span("")(label("displayStyle.home")),
                                ],
                                onclick: async () =>
                                {
                                    settings.displayStyle = "@home";
                                    OldStorage.TagSettings.set(pass, tag, settings);
                                    result = true;
                                    await tagButtonListUpdate();
                                }
                            }:
                            [],
                        {
                            tag: "button",
                            className: `check-button ${"full" === (settings.displayStyle ?? defaultStyle) ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("displayStyle.full")),
                            ],
                            onclick: async () =>
                            {
                                settings.displayStyle = "full";
                                OldStorage.TagSettings.set(pass, tag, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        {
                            tag: "button",
                            className: `check-button ${"compact" === (settings.displayStyle ?? defaultStyle) ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("displayStyle.compact")),
                            ],
                            onclick: async () =>
                            {
                                settings.displayStyle = "compact";
                                OldStorage.TagSettings.set(pass, tag, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        // {
                        //     tag: "button",
                        //     className: `check-button ${"limit" === (settings.sort ?? "smart") ? "checked": ""}`,
                        //     children:
                        //     [
                        //         await Resource.loadSvgOrCache("check-icon"),
                        //         $span("")(label("sort.limit")),
                        //     ],
                        //     onclick: async () =>
                        //     {
                        //         settings.sort = "limit";
                        //         OldStorage.TagSettings.set(pass, tag, settings);
                        //         result = true;
                        //         await tagButtonListUpdate();
                        //     }
                        // },
                    ]
                );
                await tagButtonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(`${locale.map("Display style setting")}: ${Domain.tagMap(tag)}`),
                        tagButtonList,
                        $div("popup-operator")
                        ([{
                            tag: "button",
                            className: "default-button",
                            children: label("Close"),
                            onclick: () =>
                            {
                                ui.close();
                            },
                        }]),
                    ],
                    onClose: async () => resolve(result),
                });
            }
        );
        export const getTodoPickupSettingsElapsedTimePreset = (entry: ToDoEntry) =>
        {
            const sample = entry.RecentlyAverage ?? entry.elapsed;
            if (null !== sample)
            {
                if (sample < 3 *24 *60)
                {
                    return [ 1.0, 1.5, 2, 3, 4.5, 6, 9, 12, 15, 18, 21, 24, 1.5 *24, 2 *24, 2.5 *24, 3 *24, ].map(i => i *60);
                }
                if (sample < 10 *24 *60)
                {
                    return [ 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, ].map(i => i *24 *60);
                }
                return [ 3, 5, 7, 10, 14, 21, 30, 45, 60, 90, 180, 240, ].map(i => i *24 *60);
            }
            return [ ];
        };
        export const todoFlashSettingsPopup = async (pass: string, entry: ToDoEntry, settings: TodoSettings = OldStorage.TodoSettings.get(pass, entry.task)): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const tagButtonListUpdate = async () => minamo.dom.replaceChildren
                (
                    tagButtonList,
                    [
                        {
                            tag: "button",
                            className: `check-button ${"none" === (settings.flash ?? "none") ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("pickup.none")),
                            ],
                            onclick: async () =>
                            {
                                settings.flash = undefined;
                                OldStorage.TodoSettings.set(pass, entry.task, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        {
                            tag: "button",
                            className: `check-button ${"always" === settings.flash?.type ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("pickup.always")),
                            ],
                            onclick: async () =>
                            {
                                settings.flash = { type: "always" };
                                OldStorage.TodoSettings.set(pass, entry.task, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        await Promise.all
                        (
                            getTodoPickupSettingsElapsedTimePreset(entry)
                                .concat([(settings.pickup as PickupSettingElapsedTime)?.elapsedTime ?? 0])
                                .filter(i => 0 < i)
                                .filter(uniqueFilter)
                                .sort(minamo.core.comparer.basic)
                                .map
                                (
                                    async elapsedTime =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${("elapsed-time" === settings.flash?.type && elapsedTime === settings?.flash.elapsedTime) ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")([label("pickup.elapsed-time"), ": ", Domain.timeLongStringFromTick(elapsedTime)]),
                                        ],
                                        onclick: async () =>
                                        {
                                            settings.flash =
                                            {
                                                type: "elapsed-time",
                                                elapsedTime,
                                            };
                                            OldStorage.TodoSettings.set(pass, entry.task, settings);
                                            result = true;
                                            await tagButtonListUpdate();
                                        }
                                    })
                                )
                        ),
                        await Promise.all
                        (
                            [ 30, 40, 50, 60, 70, ].map
                            (
                                async elapsedTimeStandardScore =>
                                ({
                                    tag: "button",
                                    className: `check-button ${("elapsed-time-standard-score" === settings.flash?.type && elapsedTimeStandardScore === settings?.flash.elapsedTimeStandardScore) ? "checked": ""}`,
                                    children:
                                    [
                                        await Resource.loadSvgOrCache("check-icon"),
                                        $span("")([label("pickup.elapsed-time-standard-score"), `: ${elapsedTimeStandardScore}`]),
                                    ],
                                    onclick: async () =>
                                    {
                                        settings.flash =
                                        {
                                            type: "elapsed-time-standard-score",
                                            elapsedTimeStandardScore,
                                        };
                                        OldStorage.TodoSettings.set(pass, entry.task, settings);
                                        result = true;
                                        await tagButtonListUpdate();
                                    }
                                })
                            )
                        ),
                        {
                            tag: "button",
                            className: `check-button ${"expired" === settings.flash?.type ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("pickup.expired")),
                            ],
                            onclick: async () =>
                            {
                                settings.flash = { type: "expired" };
                                OldStorage.TodoSettings.set(pass, entry.task, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                    ]
                );
                await tagButtonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(`${locale.map("Flash setting")}: ${entry.task}`),
                        tagButtonList,
                        $div("popup-operator")
                        ([{
                            tag: "button",
                            className: "default-button",
                            children: label("Close"),
                            onclick: () =>
                            {
                                ui.close();
                            },
                        }]),
                    ],
                    onClose: async () => resolve(result),
                });
            }
        );
        export const todoPickupSettingsPopup = async (pass: string, entry: ToDoEntry, settings: TodoSettings = OldStorage.TodoSettings.get(pass, entry.task)): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const tagButtonListUpdate = async () => minamo.dom.replaceChildren
                (
                    tagButtonList,
                    [
                        {
                            tag: "button",
                            className: `check-button ${"none" === (settings.pickup ?? "none") ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("pickup.none")),
                            ],
                            onclick: async () =>
                            {
                                settings.pickup = undefined;
                                OldStorage.TodoSettings.set(pass, entry.task, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        {
                            tag: "button",
                            className: `check-button ${"always" === settings.pickup?.type ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("pickup.always")),
                            ],
                            onclick: async () =>
                            {
                                settings.pickup = { type: "always" };
                                OldStorage.TodoSettings.set(pass, entry.task, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        await Promise.all
                        (
                            getTodoPickupSettingsElapsedTimePreset(entry)
                                .concat([(settings.pickup as PickupSettingElapsedTime)?.elapsedTime ?? 0])
                                .filter(i => 0 < i)
                                .filter(uniqueFilter)
                                .sort(minamo.core.comparer.basic)
                                .map
                                (
                                    async elapsedTime =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${("elapsed-time" === settings.pickup?.type && elapsedTime === settings?.pickup.elapsedTime) ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")([label("pickup.elapsed-time"), ": ", Domain.timeLongStringFromTick(elapsedTime)]),
                                        ],
                                        onclick: async () =>
                                        {
                                            settings.pickup =
                                            {
                                                type: "elapsed-time",
                                                elapsedTime,
                                            };
                                            OldStorage.TodoSettings.set(pass, entry.task, settings);
                                            result = true;
                                            await tagButtonListUpdate();
                                        }
                                    })
                                )
                        ),
                        await Promise.all
                        (
                            [ 30, 40, 50, 60, 70, ].map
                            (
                                async elapsedTimeStandardScore =>
                                ({
                                    tag: "button",
                                    className: `check-button ${("elapsed-time-standard-score" === settings.pickup?.type && elapsedTimeStandardScore === settings?.pickup.elapsedTimeStandardScore) ? "checked": ""}`,
                                    children:
                                    [
                                        await Resource.loadSvgOrCache("check-icon"),
                                        $span("")([label("pickup.elapsed-time-standard-score"), `: ${elapsedTimeStandardScore}`]),
                                    ],
                                    onclick: async () =>
                                    {
                                        settings.pickup =
                                        {
                                            type: "elapsed-time-standard-score",
                                            elapsedTimeStandardScore,
                                        };
                                        OldStorage.TodoSettings.set(pass, entry.task, settings);
                                        result = true;
                                        await tagButtonListUpdate();
                                    }
                                })
                            )
                        ),
                        {
                            tag: "button",
                            className: `check-button ${"expired" === settings.pickup?.type ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("pickup.expired")),
                            ],
                            onclick: async () =>
                            {
                                settings.pickup = { type: "expired" };
                                OldStorage.TodoSettings.set(pass, entry.task, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                    ]
                );
                await tagButtonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(`${locale.map("Pickup setting")}: ${entry.task}`),
                        tagButtonList,
                        $div("popup-operator")
                        ([{
                            tag: "button",
                            className: "default-button",
                            children: label("Close"),
                            onclick: () =>
                            {
                                ui.close();
                            },
                        }]),
                    ],
                    onClose: async () => resolve(result),
                });
            }
        );
        export const todoRestrictionSettingsPopup = async (pass: string, entry: ToDoEntry, settings: TodoSettings = OldStorage.TodoSettings.get(pass, entry.task)): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const tagButtonListUpdate = async () => minamo.dom.replaceChildren
                (
                    tagButtonList,
                    [
                        {
                            tag: "button",
                            className: `check-button ${"none" === (settings.restriction ?? "none") ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("pickup.none")),
                            ],
                            onclick: async () =>
                            {
                                settings.restriction = undefined;
                                OldStorage.TodoSettings.set(pass, entry.task, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        {
                            tag: "button",
                            className: `check-button ${"always" === settings.restriction?.type ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("pickup.always")),
                            ],
                            onclick: async () =>
                            {
                                settings.restriction = { type: "always" };
                                OldStorage.TodoSettings.set(pass, entry.task, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                        await Promise.all
                        (
                            getTodoPickupSettingsElapsedTimePreset(entry)
                                .concat([(settings.pickup as PickupSettingElapsedTime)?.elapsedTime ?? 0])
                                .filter(i => 0 < i)
                                .filter(uniqueFilter)
                                .sort(minamo.core.comparer.basic)
                                .map
                                (
                                    async elapsedTime =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${("elapsed-time" === settings.restriction?.type && elapsedTime === settings?.restriction.elapsedTime) ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")([label("pickup.elapsed-time"), ": ", Domain.timeLongStringFromTick(elapsedTime)]),
                                        ],
                                        onclick: async () =>
                                        {
                                            settings.restriction =
                                            {
                                                type: "elapsed-time",
                                                elapsedTime,
                                            };
                                            OldStorage.TodoSettings.set(pass, entry.task, settings);
                                            result = true;
                                            await tagButtonListUpdate();
                                        }
                                    })
                                )
                        ),
                        await Promise.all
                        (
                            [ 30, 40, 50, 60, 70, ].map
                            (
                                async elapsedTimeStandardScore =>
                                ({
                                    tag: "button",
                                    className: `check-button ${("elapsed-time-standard-score" === settings.restriction?.type && elapsedTimeStandardScore === settings?.restriction.elapsedTimeStandardScore) ? "checked": ""}`,
                                    children:
                                    [
                                        await Resource.loadSvgOrCache("check-icon"),
                                        $span("")([label("pickup.elapsed-time-standard-score"), `: ${elapsedTimeStandardScore}`]),
                                    ],
                                    onclick: async () =>
                                    {
                                        settings.restriction =
                                        {
                                            type: "elapsed-time-standard-score",
                                            elapsedTimeStandardScore,
                                        };
                                        OldStorage.TodoSettings.set(pass, entry.task, settings);
                                        result = true;
                                        await tagButtonListUpdate();
                                    }
                                })
                            )
                        ),
                        {
                            tag: "button",
                            className: `check-button ${"expired" === settings.restriction?.type ? "checked": ""}`,
                            children:
                            [
                                await Resource.loadSvgOrCache("check-icon"),
                                $span("")(label("pickup.expired")),
                            ],
                            onclick: async () =>
                            {
                                settings.restriction = { type: "expired" };
                                OldStorage.TodoSettings.set(pass, entry.task, settings);
                                result = true;
                                await tagButtonListUpdate();
                            }
                        },
                    ]
                );
                await tagButtonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(`${locale.map("Restriction setting")}: ${entry.task}`),
                        tagButtonList,
                        $div("popup-operator")
                        ([{
                            tag: "button",
                            className: "default-button",
                            children: label("Close"),
                            onclick: () =>
                            {
                                ui.close();
                            },
                        }]),
                    ],
                    onClose: async () => resolve(result),
                });
            }
        );
        export const screenCover = (data: { parent?: HTMLElement | null, children?: minamo.dom.Source, onclick: () => unknown, }) =>
        {
            const dom = $make(HTMLDivElement)
            ({
                parent: data.parent ?? document.body,
                tag: "div",
                className: "screen-cover fade-in",
                children: data.children,
                onclick: async () =>
                {
                    console.log("screen-cover.click!");
                    dom.onclick = null;
                    data.onclick();
                    close();
                }
            });
            const close = async () =>
            {
                dom.classList.remove("fade-in");
                dom.classList.add("fade-out");
                await minamo.core.timeout(500);
                minamo.dom.remove(dom);
            };
            const result =
            {
                dom,
                close,
            };
            return result;
        };
        export const getScreenCoverList = () => Array.from(document.getElementsByClassName("screen-cover")) as HTMLDivElement[];
        export const getScreenCover = () => getScreenCoverList().filter((_i, ix, list) => (ix +1) === list.length)[0];
        export const hasScreenCover = () => 0 < getScreenCoverList().length;
        export const popup =
        (
            data:
            {
                className?: string,
                children: minamo.dom.Source,
                onClose?: () => Promise<unknown>
            }
        ) =>
        {
            const dom = $make(HTMLDivElement)
            ({
                tag: "div",
                className: `popup locale-parallel-off ${data.className ?? ""}`,
                children: data.children,
                onclick: async (event: MouseEvent) =>
                {
                    console.log("popup.click!");
                    event.stopPropagation();
                    //(Array.from(document.getElementsByClassName("screen-cover")) as HTMLDivElement[]).forEach(i => i.click());
                },
            });
            const close = async () =>
            {
                await data?.onClose?.();
                cover.close();
            };
            // minamo.dom.appendChildren(document.body, dom);
            const cover = screenCover
            ({
                children:
                [
                    dom,
                    { tag: "div", }, // レイアウト調整用のダミー要素 ( この調整がないとポップアップが小さく且つ入力要素がある場合に iPad でキーボードの下に dom が隠れてしまう。 )
                ],
                onclick: async () =>
                {
                    await data?.onClose?.();
                    //minamo.dom.remove(dom);
                },
            });
            const result =
            {
                dom,
                close,
            };
            return result;
        };
        export const menuButton = async (menu: minamo.dom.Source | (() => Promise<minamo.dom.Source>)) =>
        {
            let cover: { dom: HTMLDivElement, close: () => Promise<unknown> } | null = null;
            const close = () =>
            {
                popup.classList.remove("show");
                cover = null;
            };
            const popup = $make(HTMLDivElement)
            ({
                tag: "div",
                className: "menu-popup",
                children: "function" !== typeof menu ? menu: [ ],
                onclick: async (event: MouseEvent) =>
                {
                    event.stopPropagation();
                    console.log("menu-popup.click!");
                    cover?.close();
                    close();
                },
            });
            const button = $make(HTMLButtonElement)
            ({
                tag: "button",
                className: "menu-button",
                children:
                [
                    await Resource.loadSvgOrCache("ellipsis-icon"),
                ],
                onclick: async (event: MouseEvent) =>
                {
                    event.stopPropagation();
                    console.log("menu-button.click!");
                    if ("function" === typeof menu)
                    {
                        minamo.dom.replaceChildren(popup, await menu());
                    }
                    popup.classList.add("show");
                    cover = screenCover
                    ({
                        parent: popup.parentElement,
                        onclick: close,
                    });
                },
            });
            return [ button, popup, ];
        };
        export const menuItem = (children: minamo.dom.Source, onclick?: (event: MouseEvent | TouchEvent) => unknown, className?: string) =>
        ({
            tag: "button",
            className,
            children,
            onclick,
        });
        export const menuLinkItem = (children: minamo.dom.Source, href: PageParams, className?: string) => menuItem
        (
            children,
            () => showUrl(href),
            className,
        );
        // export const menuLinkItem = (children: minamo.dom.Source, href: PageParams, className?: string) => internalLink
        // ({
        //     className,
        //     href,
        //     children,
        // });
        export const informationDigest = (entry: ToDoTagEntryOld, item: ToDoEntry) => $div
        ({
            className: "item-information",
            attributes:
            {
                style: progressInformationStyle(entry.pass, item),
            }
        })
        ([
            monospace("task-last-timestamp", label("previous"), Domain.dateStringFromTick(item.previous)),
            monospace("task-elapsed-time", label("elapsed time"), Domain.timeLongStringFromTick(item.elapsed)),
            monospace("task-interval-average", label("recentrly interval average"), Domain.timeLongStringFromTick(item.RecentlyAverage)),
            monospace
            (
                "task-interval-average",
                label("expected interval"),
                isMoreToDoEntry(item) ?
                    Domain.timeRangeStringFromTick
                    (
                        item.expectedInterval.min,
                        item.expectedInterval.max
                        // Math.max(item.RecentlySmartAverage /10, item.RecentlySmartAverage -(item.RecentlyStandardDeviation *Domain.standardDeviationRate)),
                        // item.RecentlySmartAverage +(item.RecentlyStandardDeviation *Domain.standardDeviationRate)
                    ):
                    Domain.timeLongStringFromTick(item.RecentlySmartAverage)
            ),
            // monospace("task-interval-average", $span("label")("expected interval average (予想間隔平均):"), renderTime(item.smartAverage)),
            // monospace("task-count", "smartRest", null === item.smartRest ? "N/A": item.smartRest.toLocaleString()),
        ]);
        export const informationFull = (pass: string, item: ToDoEntry) => $div
        ({
            className: "item-information",
            attributes:
            {
                style: progressInformationStyle(pass, item),
            }
        })
        ([
            monospace("task-first-time", label("first time"), Domain.dateStringFromTick(item.first)),
            monospace("task-last-timestamp", label("previous"), Domain.dateStringFromTick(item.previous)),
            monospace("task-elapsed-time", label("elapsed time"), Domain.timeLongStringFromTick(item.elapsed)),
            monospace("task-interval-average", label("recentrly interval average"), Domain.timeLongStringFromTick(item.RecentlyAverage)),
            monospace
            (
                "task-interval-average",
                label("expected interval"),
                isMoreToDoEntry(item) ?
                    Domain.timeRangeStringFromTick
                    (
                        item.expectedInterval.min,
                        item.expectedInterval.max
                        // Math.max(item.RecentlySmartAverage /10, item.RecentlySmartAverage -(item.RecentlyStandardDeviation *Domain.standardDeviationRate)),
                        // item.RecentlySmartAverage +(item.RecentlyStandardDeviation *Domain.standardDeviationRate)
                    ):
                    Domain.timeLongStringFromTick(item.RecentlySmartAverage)
            ),
            // monospace("task-interval-average", $span("label")("expected interval average (予想間隔平均):"), renderTime(item.smartAverage)),
            monospace("task-interval-average", label("total interval average"), Domain.timeLongStringFromTick(item.TotalAverage)),
            monospace("task-count", label("count"), item.count.toLocaleString()),
            // monospace("task-count", "smartRest", null === item.smartRest ? "N/A": item.smartRest.toLocaleString()),
        ]);
        export const todoDoneMenu =
        (
            pass: string,
            item: ToDoEntry,
            onDone: () => Promise<unknown> = async () => await updateWindow("operate"),
            onCanceled: () => Promise<unknown> = async () => await updateWindow("operate")
        ) =>
        menuItem
        (
            label("Done with timestamp or memo"),
            async () =>
            {
                const result = Domain.parseDate(await dateTimePrompt(item.task, Domain.getTicks()));
                if (null !== result && Domain.getTicks(result) <= Domain.getTicks())
                {
                    await Operate.done
                    (
                        pass,
                        item.task,
                        Domain.getTicks(result),
                        onCanceled
                    );
                    await onDone();
                }
            }
        );
        export const todoRenameMenu =
        (
            pass: string,
            item: ToDoEntry,
            onRename: (newName: string) => Promise<unknown> = async () => await reload()
        ) =>
        menuItem
        (
            label("Rename"),
            async () =>
            {
                const newTask = await prompt(locale.map("Input a ToDo's name."), item.task);
                if (null !== newTask && 0 < newTask.length && newTask !== item.task)
                {
                    if (OldStorage.Task.rename(pass, item.task, newTask))
                    {
                        await onRename(newTask);
                        //await reload();
                    }
                    else
                    {
                        alert("その名前の ToDo は既に存在しています。");
                    }
                }
            }
        );
        export const todoTagMenu = (pass: string, item: ToDoEntry) =>
        [
            // OldStorage.TagMember.isPickupTask(pass, item.task) ?
            //     menuItem
            //     (
            //         label("Remove from Pickup"),
            //         async () =>
            //         {
            //             await Operate.removeFromPickup(pass, item.task, () => updateWindow("operate"));
            //             updateWindow("operate");
            //         }
            //     ):
            //     menuItem
            //     (
            //         label("Add to Pickup"),
            //         async () =>
            //         {
            //             await Operate.addToPickup(pass, item.task, () => updateWindow("operate"));
            //             updateWindow("operate");
            //         }
            //     ),
            menuItem
            (
                label("Flash setting"),
                async () =>
                {
                    if (await todoFlashSettingsPopup(pass, item))
                    {
                        updateWindow("timer");
                    }
                }
            ),
            menuItem
            (
                label("Pickup setting"),
                async () =>
                {
                    if (await todoPickupSettingsPopup(pass, item))
                    {
                        updateWindow("timer");
                    }
                }
            ),
            menuItem
            (
                label("Restriction setting"),
                async () =>
                {
                    if (await todoRestrictionSettingsPopup(pass, item))
                    {
                        updateWindow("timer");
                    }
                }
            ),
            menuItem
            (
                label("Add/Remove Tag"),
                async () =>
                {
                    if (await addRemoveTagsPopup(pass, item, OldStorage.Tag.getByTodo(pass, item.task)))
                    {
                        // await reload();
                        updateWindow("operate");
                    }
                }
            ),
            menuItem
            (
                label("Move to Sublist"),
                async () =>
                {
                    if (await moveToSublistPopup(pass, item))
                    {
                        // await reload();
                        updateWindow("operate");
                    }
                }
            )
        ];
        export const todoDeleteMenu = (pass: string, item: ToDoEntry) => menuItem
        (
            label("Delete"),
            async () =>
            {
                OldStorage.Task.remove(pass, item.task);
                //Storage.TagMember.add(pass, "@deleted", item.task);
                await reload();
            },
            "delete-button"
        );
        export const getTodoIcon = (entry: ToDoTagEntryOld, item: ToDoEntry): Resource.KeyType =>
        {
            if (OldStorage.TagMember.isRestrictionTask(entry.pass, item.task))
            {
                return "forbidden-icon";
            }
            if (OldStorage.TagMember.isFlashTask(entry.pass, item.task))
            {
                return "flash-icon";
            }
            if (OldStorage.TagMember.isPickupTask(entry.pass, item.task))
            {
                return "pickup-icon";
            }
            if (null === item.progress)
            {
                switch(item.count)
                {
                case 0:
                    return "zero-icon";
                case 1:
                    return "one-icon";
                default:
                    return "sleep-icon";
                }
            }
            if (OldStorage.TagMember.isMember(entry.pass, "@short-term", item.task))
            {
                return "short-term-icon";
            }
            if (OldStorage.TagMember.isMember(entry.pass, "@medium-term", item.task))
            {
                return "medium-term-icon";
            }
            if (OldStorage.TagMember.isMember(entry.pass, "@long-term", item.task))
            {
                return "long-term-icon";
            }
            return "task-icon";
        };
        export const todoItem = async (entry: ToDoTagEntryOld, item: ToDoEntry, displayStyle: "full" | "compact") =>
        {
            let isFirst = true;
            const onUpdate = async () =>
            {
                Object.assign(item, Domain.getToDoEntryOld(entry.pass, item.task));
                updateWindow("operate");
            };
            const onDone = async () =>
            {
                itemDom.classList.add("fade-and-slide-out");
                await minamo.core.timeout(500);
                onUpdate();
            };
            const itemDom = $make(HTMLDivElement)
            (
                (
                    "full" === displayStyle ?
                    $div("task-item flex-item"):
                    $div
                    ({
                        className: "task-item flex-item",
                        attributes:
                        {
                            style: progressTitleStyle(entry.pass, item),
                        }
                    })
                )
                ([
                    $div("item-header")
                    ([
                        internalLink
                        ({
                            className: "item-title",
                            href: { pass: entry.pass, todo: item.task, },
                            children:
                            [
                                await Resource.loadSvgOrCache(getTodoIcon(entry, item)),
                                Model.decode(item.task),
                            ]
                        }),
                        $div("item-operator")
                        ([
                            {
                                tag: "button",
                                className: item.isDefault ? "default-button main-button": "main-button",
                                children: label("Done"),
                                onclick: async () =>
                                {
                                    //if (isSessionPass(pass))
                                    const fxxkingTypeScriptCompiler = OldStorage.isSessionPass(entry.pass);
                                    if (fxxkingTypeScriptCompiler)
                                    {
                                        alert
                                        (
                                            "This is view mode. If this is your to-do list, open the original URL instead of the sharing URL. If this is not your to-do list, you can copy this to-do list from edit mode.\n"
                                            +"\n"
                                            +"これは表示モードです。これが貴方が作成したToDoリストならば、共有用のURLではなくオリジナルのURLを開いてください。これが貴方が作成したToDoリストでない場合、編集モードからこのToDoリストをコピーできます。"
                                        );
                                    }
                                    else
                                    {
                                        if (isFirst) // チャタリング防止
                                        {
                                            isFirst = false;
                                            await Operate.done
                                            (
                                                entry.pass,
                                                item.task,
                                                MigrateBridge.getDoneTicks(entry.pass),
                                                onUpdate
                                            );
                                            await onDone();
                                        }
                                    }
                                }
                            },
                            await menuButton
                            ([
                                todoDoneMenu(entry.pass, item, onDone, onUpdate),
                                todoRenameMenu(entry.pass, item),
                                todoTagMenu(entry.pass, item),
                                todoDeleteMenu(entry.pass, item),
                            ]),
                        ]),
                    ]),
                    "full" === displayStyle ?
                        [
                            $div("item-attribute")
                            ([
                                $div("item-tags")
                                (
                                    await Promise.all
                                    (
                                        OldStorage.Tag.getByTodo(entry.pass, item.task).map
                                        (
                                            async tag => internalLink
                                            ({
                                                className: "tag",
                                                href: { pass: entry.pass, tag, },
                                                children:
                                                [
                                                    await Resource.loadTagSvgOrCache(tag),
                                                    Domain.tagMap(tag)
                                                ],
                                            })
                                        )
                                    )
                                ),
                                $div("item-settings")
                                ([
                                    null !== (OldStorage.TodoSettings.get(entry.pass, item.task).flash ?? null) ?
                                        linkButton
                                        ({
                                            className: "tag",
                                            children: await Resource.loadTagSvgOrCache("@flash"),
                                            onclick: async (event: MouseEvent) =>
                                            {
                                                event.preventDefault();
                                                if (await todoFlashSettingsPopup(entry.pass, item))
                                                {
                                                    updateWindow("timer");
                                                }
                                            }
                                        }):
                                        [],
                                    null !== (OldStorage.TodoSettings.get(entry.pass, item.task).pickup ?? null) ?
                                        linkButton
                                        ({
                                            className: "tag",
                                            children: await Resource.loadTagSvgOrCache("@pickup"),
                                            onclick: async (event: MouseEvent) =>
                                            {
                                                event.preventDefault();
                                                if (await todoPickupSettingsPopup(entry.pass, item))
                                                {
                                                    updateWindow("timer");
                                                }
                                            }
                                        }):
                                        [],
                                    null !== (OldStorage.TodoSettings.get(entry.pass, item.task).restriction ?? null) ?
                                        linkButton
                                        ({
                                            className: "tag",
                                            children: await Resource.loadTagSvgOrCache("@restriction"),
                                            onclick: async (event: MouseEvent) =>
                                            {
                                                event.preventDefault();
                                                if (await todoRestrictionSettingsPopup(entry.pass, item))
                                                {
                                                    updateWindow("timer");
                                                }
                                            }
                                        }):
                                        [],
                                ]),
                            ]),
                            informationDigest(entry, item),
                        ]:
                        []
                ])
            );
            return itemDom;
        };
        export const historyItem = async (entry: ToDoTagEntryOld, item: { task: string, tick: number | null }) => $div("history-item flex-item ")
        ([
            $div("item-information")
            ([
                internalLink
                ({
                    className: "item-title",
                    href: { pass: entry.pass, todo: item.task, },
                    children: Model.decode(item.task)
                }),
                monospace(Domain.dateStringFromTick(item.tick)),
            ]),
            $div("item-operator")
            (
                null !== item.tick ?
                [
                    // {
                    //     tag: "button",
                    //     className: "default-button main-button",
                    //     children: "開く",
                    //     onclick: async () => { }
                    // },
                    await menuButton
                    ([
                        menuItem
                        (
                            label("Edit"),
                            async () =>
                            {
                                const result = Domain.parseDate(await dateTimePrompt(locale.map("Edit"), <number>item.tick));
                                if (null !== result && item.tick !== Domain.getTicks(result) && 0 <= Domain.getTicks(result) && Domain.getTicks(result) <= Domain.getTicks())
                                {
                                    OldStorage.History.removeTickRaw(entry.pass, item.task, <number>item.tick);
                                    OldStorage.History.addTick(entry.pass, item.task, Domain.getTicks(result));
                                    await reload();
                                }
                            }
                        ),
                        menuItem
                        (
                            label("Delete"),
                            async () =>
                            {
                                OldStorage.History.removeTick(entry.pass, item.task, <number>item.tick);
                                await reload();
                            },
                            "delete-button"
                        )
                    ]),
                ]:
                []
            ),
        ]);
        export const tickItem = async (pass: string, item: ToDoEntry, tick: number, interval: number | null, max: number | null, isFlashed: boolean = OldStorage.TodoSettings.isFlashTarget(pass, item, interval), isRestrictioned: boolean = OldStorage.TodoSettings.isRestrictionTarget(pass, item, interval)) => $div
        ({
            className: "tick-item flex-item ",
            style:
            (
                isRestrictioned ? Render.progressRestrictionTitleStyle:
                isFlashed ? Render.progressFlashTitleStyle:
                Render.progressDefaultTitleStyle
            )(null === interval || null === max || max < interval ? null: interval /max),
        })
        ([
            await Resource.loadSvgOrCache
            (
                isRestrictioned ? "forbidden-icon":
                isFlashed ? "flash-icon":
                null === interval || null === max ? "one-icon":
                max < interval ? "sleep-icon":
                "tick-icon"
            ),
            $div("item-information")
            ([
                monospace("tick-timestamp", label("timestamp"),Domain.dateStringFromTick(tick)),
                monospace("tick-interval", label("interval"), Domain.timeLongStringFromTick(interval)),
            ]),
            $div("item-operator")
            ([
                // {
                //     tag: "button",
                //     className: "default-button main-button",
                //     children: "開く",
                //     onclick: async () => { }
                // },
                await menuButton
                ([
                    menuItem
                    (
                        label("Edit"),
                        async () =>
                        {
                            const result = Domain.parseDate(await dateTimePrompt(locale.map("Edit"), tick));
                            if (null !== result && tick !== Domain.getTicks(result) && 0 <= Domain.getTicks(result) && Domain.getTicks(result) <= Domain.getTicks())
                            {
                                OldStorage.History.removeTickRaw(pass, item.task, tick);
                                OldStorage.History.addTick(pass, item.task, Domain.getTicks(result));
                                await reload();
                            }
                        }
                    ),
                    menuItem
                    (
                        label("Delete"),
                        async () =>
                        {
                            OldStorage.History.removeTick(pass, item.task, tick);
                            await reload();
                        },
                        "delete-button"
                    )
                ]),
            ])
        ]);
        export const dropDownLabel = (options: { list: string[] | { [value:string]:string }, value: string, onChange?: (value: string) => unknown, className?: string}) =>
        {
            const dropdown = $make(HTMLSelectElement)
            ({
                className: options.className,
                children: Array.isArray(options.list) ?
                    options.list.map(i => ({ tag: "option", value:i, children: i, selected: options.value === i ? true: undefined, })):
                    Object.keys(options.list).map(i => ({ tag: "option", value:i, children: (<{ [value:string]:string }>options.list)[i] ?? i, selected: options.value === i ? true: undefined, })),
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
            const labelSoan = $make(HTMLSpanElement)
            ({
                children: Array.isArray(options.list) ?
                    options.value:
                    (options.list[options.value] ?? options.value),
            });
            const result = $tag("label")(options.className ?? "")
            ([
                dropdown,
                labelSoan
            ]);
            return result;
        };
        export const historyBar = async (entry: ToDoTagEntryOld, list: ToDoEntry[]) => $div("horizontal-list history-bar")
        ([
            internalLink
            ({
                href: { pass: entry.pass, tag: entry.tag, hash: "history" },
                children: $span("history-bar-title")
                ([
                    await Resource.loadSvgOrCache("history-icon"),
                    locale.map("History"),
                ]),
            }),
            await Promise.all
            (
                list.concat([]).sort(minamo.core.comparer.make(i => -(i.previous ?? 0))).map
                (
                    async item => internalLink
                    ({
                        href: { pass: entry.pass, todo: item.task, },
                        children: $span("history-bar-item")
                        ([
                            await Resource.loadSvgOrCache("task-icon"),
                            Model.decode(item.task),
                            $span("monospace")(`(${Domain.timeShortStringFromTick(item.elapsed)})`),
                        ])
                    }),
                )
            ),
        ]);
        export interface HeaderSegmentSource
        {
            icon: Resource.KeyType;
            title: string;
            href?: PageParams;
            menu?: minamo.dom.Source | (() => Promise<minamo.dom.Source>);
        }
        export interface HeaderSource
        {
            items: HeaderSegmentSource[];
            menu?: minamo.dom.Source | (() => Promise<minamo.dom.Source>);
            operator?: minamo.dom.Source;
            parent?: PageParams;
        }
        export interface ScreenSource
        {
            className: string;
            header: HeaderSource;
            body: minamo.dom.Source;
        }
        const getLastSegmentClass = (data:HeaderSource, ix: number) => ix === data.items.length -1 ?
            //(! data.operator  ? "last-segment fill-header-segment": "last-segment"): undefined;
            "last-segment": undefined;
        export const screenSegmentedHeader = async (data:HeaderSource) =>
        [
            $div("progress-bar")([]),
            (
                await Promise.all
                (
                    data.items
                    .map
                    (
                        async (item, ix) =>
                            (item.href && screenHeaderLinkSegment(<any>item, getLastSegmentClass(data,ix))) ||
                            (item.menu && screenHeaderPopupSegment(item, getLastSegmentClass(data,ix))) ||
                            (true && screenHeaderLabelSegment(item, getLastSegmentClass(data,ix)))
                    )
                )
            ).reduce((a, b) => (a as any[]).concat(b), []),
            $div("header-operator")
            ([
                data.parent ?
                {
                    tag: "button",
                    className: "icon-button close-button",
                    children:
                    [
                        await Resource.loadSvgOrCache("cross-icon"),
                    ],
                    onclick: (event: MouseEvent) =>
                    {
                        event.stopPropagation();
                        if ("" !== getFilterText() || getHeaderElement().classList.contains("header-operator-has-focus"))
                        {
                            setFilterText("");
                            blurFilterInputElement();
                        }
                        else
                        {
                            showUrl(<PageParams>data.parent);
                        }
                    },
                }:
                [],
                data.menu ? await menuButton(data.menu): [],
                data.operator ? data.operator: [],
            ])
        ];
        export const getCloseButton = () => getHeaderElement().getElementsByClassName("close-button")[0] as HTMLButtonElement;
        export const screenHeaderSegmentCore = async (item: HeaderSegmentSource) =>
        [
            $div("icon")(await Resource.loadSvgOrCache(item.icon)),
            $div("segment-title")(item.title),
        ];
        export const screenHeaderLabelSegment = async (item: HeaderSegmentSource, className: string = "") =>
            $div(`segment label-segment ${className}`)(await screenHeaderSegmentCore(item));
        export const screenHeaderLinkSegment = async (item: HeaderSegmentSource & { href: PageParams; }, className: string = "") => internalLink
        ({
            className: `segment ${className}`,
            href: item.href,
            children: await screenHeaderSegmentCore(item),
        });
        export const screenHeaderPopupSegment = async (item: HeaderSegmentSource, className: string = "") =>
        {
            let cover: { dom: HTMLDivElement, close: () => Promise<unknown> } | null = null;
            const close = () =>
            {
                popup.classList.remove("show");
                cover = null;
            };
            const popup = $make(HTMLDivElement)
            ({
                tag: "div",
                className: "menu-popup segment-popup",
                children: "function" !== typeof item.menu ? item.menu: [ ],
                onclick: async (event: MouseEvent) =>
                {
                    event.stopPropagation();
                    console.log("menu-popup.click!");
                    cover?.close();
                    close();
                },
            });
            const segment = $make(HTMLDivElement)
            ({
                tag: "div",
                className: `segment ${className}`,
                children: await screenHeaderSegmentCore(item),
                onclick: async (event: MouseEvent) =>
                {
                    event.stopPropagation();
                    console.log("menu-button.click!");
                    if ("function" === typeof item.menu)
                    {
                        minamo.dom.replaceChildren(popup, await item.menu());
                    }
                    popup.classList.add("show");
                    //popup.style.height = `${popup.offsetHeight -2}px`;
                    popup.style.width = `${popup.offsetWidth -2}px`;
                    popup.style.top = `${segment.offsetTop +segment.offsetHeight}px`;
                    popup.style.left = `${Math.max(segment.offsetLeft, 4)}px`;
                    cover = screenCover
                    ({
                        parent: popup.parentElement,
                        onclick: close,
                    });
                },
            });
            return [ segment, popup, ];
        };
        export const screenHeaderHomeSegment = async (): Promise<HeaderSegmentSource> =>
        ({
            icon: "application-icon",
            href: { },
            title: CyclicToDo.applicationTitle,
        });
        export const screenHeaderListSegmentMenu = async (pass: string): Promise<minamo.dom.Source> =>
            (
                (
                    await Promise.all
                    (
                        OldStorage.Pass.get().map
                        (
                            async i => menuLinkItem
                            (
                                [
                                    await Resource.loadSvgOrCache("list-icon"),
                                    labelSpan(OldStorage.Title.get(i)),
                                    // labelSpan(`ToDo リスト ( pass: ${i.substr(0, 2)}****${i.substr(-2)} )`)
                                ],
                                { pass: i, tag: "@overall", },
                                pass === i ? "current-item": undefined
                            )
                        )
                    )
                ) as minamo.dom.Source[]
            )
            .concat
            ([
                menuItem
                (
                    [
                        await Resource.loadSvgOrCache("add-list-icon"),
                        label("New ToDo List"),
                    ],
                    newListPrompt,
                ),
                menuItem
                (
                    [
                        await Resource.loadSvgOrCache("import-icon"),
                        label("Import List"),
                    ],
                    async () => await showUrl({ hash: "import", }),
                    pass === "@import" ? "current-item": undefined
                ),
                menuLinkItem
                (
                    [
                        await Resource.loadSvgOrCache("recycle-bin-icon"),
                        labelSpan(locale.map("@deleted")),
                        monospace(`${OldStorage.Backup.get().length}`)
                    ],
                    { hash: "removed" },
                    pass === "@removed" ? "current-item": undefined
                )
            ]);
        export const screenHeaderListSegment = async (pass: string): Promise<HeaderSegmentSource> =>
        ({
            icon:
            {
                "@removed": "recycle-bin-icon" as Resource.KeyType,
                "@import": "import-icon" as Resource.KeyType,
            }[pass] ?? "list-icon",
            title:
            {
                "@removed": locale.map("@deleted"),
                "@import": locale.map("Import List"),
            }[pass] ?? OldStorage.Title.get(pass), // `ToDo リスト ( pass: ${pass.substr(0, 2)}****${pass.substr(-2)} )`,
            menu: await screenHeaderListSegmentMenu(pass),
        });
        export const screenHeaderTagSegment = async (pass: string, current: string): Promise<HeaderSegmentSource> =>
        ({
            icon: Resource.getTagIcon(current),
            title: Domain.tagMap(current),
            menu:
                (
                    (
                        await Promise.all
                        (
                            ["@overall", "@flash", "@pickup", "@restriction", "@short-term", "@medium-term", "@long-term", "@irregular-term"].concat(OldStorage.Tag.get(pass).sort(Domain.tagComparerOld(pass))).concat(["@unoverall", "@untagged"])
                            .map
                            (
                                async tag => menuLinkItem
                                (
                                    [
                                        await Resource.loadTagSvgOrCache(tag),
                                        labelSpan(Domain.tagMap(tag)),
                                        monospace(`${OldStorage.TagMember.get(pass, tag).length}`)
                                    ],
                                    { pass, tag, },
                                    current === tag ? "current-item": undefined
                                )
                            )
                        )
                    ) as minamo.dom.Source[]
                )
                .concat
                ([
                    menuItem
                    (
                        [
                            await Resource.loadSvgOrCache("add-tag-icon"),
                            label("@new"),
                        ],
                        async () =>
                        {
                            const tag = await newTagPrompt(pass);
                            if (null !== tag)
                            {
                                await showUrl({ pass, tag, });
                            }
                        }
                    ),
                    menuItem
                    (
                        [
                            await Resource.loadSvgOrCache("add-folder-icon"),
                            label("@new-sublist"),
                        ],
                        async () =>
                        {
                            const sublist = await prompt("サブリストの名前を入力してください", "");
                            if (null !== sublist)
                            {
                                const tag = Model.encodeSublist(sublist.trim());
                                OldStorage.Tag.add(pass, tag);
                                await showUrl({ pass, tag, });
                            }
                        }
                    ),
                    menuLinkItem
                    (
                        [
                            await Resource.loadSvgOrCache("recycle-bin-icon"),
                            labelSpan(locale.map("@deleted")),
                            monospace(`${OldStorage.Removed.get(pass).length}`)
                        ],
                        { pass, hash: "removed" },
                        current === "@deleted" ? "current-item": undefined
                    ),
                ])
        });
        export const screenHeaderTaskSegment = async (pass: string, tag: string, current: string): Promise<HeaderSegmentSource> =>
        ({
            icon: "@history" === current ? "history-icon": "task-icon",
            title: "@history" === current ? locale.map("History"): Model.decode(current),
            menu:
                (
                    (
                        await Promise.all
                        (
                            OldStorage.TagMember.get(pass, tag).map
                            (
                                async task => menuLinkItem
                                (
                                    [
                                        await Resource.loadSvgOrCache("task-icon"),
                                        labelSpan(Model.decode(task)),
                                    ],
                                    { pass, todo: task, },
                                    current === task ? "current-item": undefined
                                )
                            )
                        )
                    ) as minamo.dom.Source[]
                )
                .concat
                ([
                    menuItem
                    (
                        [
                            await Resource.loadSvgOrCache("add-task-icon"), // 本来は plus だけど、まだ作ってない
                            label("New ToDo"),
                        ],
                        async () =>
                        {
                            const newTask = await prompt(locale.map("Input a ToDo's name."));
                            if (null !== newTask)
                            {
                                OldStorage.Task.add(pass, newTask);
                                OldStorage.TagMember.add(pass, tag, newTask);
                                await showUrl({ pass, todo: newTask, });
                            }
                        }
                    ),
                    menuLinkItem
                    (
                        [
                            await Resource.loadSvgOrCache("history-icon"), // 本来は plus だけど、まだ作ってない
                            label("History"),
                        ],
                        { pass, tag: tag, hash: "history" },
                        "@history" === current ? "current-item": undefined
                    ),
                ])
        });
        export const replaceScreenBody = (body: minamo.dom.Source) => minamo.dom.replaceChildren
        (
            document.getElementsByClassName("screen-body")[0],
            body
        );
        export const listRenameMenu =
        (
            pass: string,
            onRename: (newName: string) => Promise<unknown> = async () => await reload()
        ) =>
        menuItem
        (
            label("Rename"),
            async () =>
            {
                const oldTitle = OldStorage.Title.get(pass);
                const newTitle = await prompt(locale.map("Input a ToDo list's name."), oldTitle);
                if (null !== newTitle && 0 < newTitle.length && newTitle !== oldTitle)
                {
                    Operate.renameList(pass, newTitle, async () => await onRename(oldTitle));
                    await onRename(newTitle);
                }
            }
        );
        export const fullscreenMenuItem = async () => fullscreenEnabled() ?
            (
                null === fullscreenElement() ?
                    menuItem
                    (
                        label("Full screen"),
                        async () => await requestFullscreen()
                    ):
                    menuItem
                    (
                        label("Cancel full screen"),
                        async () => await exitFullscreen()
                    )
            ):
            [];
        export const listScreenMenu = async (entry: ToDoTagEntryOld) =>
        [
            await fullscreenMenuItem(),
            internalLink
            ({
                href: { pass: entry.pass, tag: entry.tag, hash: "history" },
                children: menuItem(label("History")),
            }),
            menuItem
            (
                label("Display style setting"),
                async () =>
                {
                    if (await tagDisplayStyleSettingsPopup(entry.pass, entry.tag))
                    {
                        await reload();
                    }
                }
            ),
            menuItem
            (
                label("Sort order setting"),
                async () =>
                {
                    if (await tagSortSettingsPopup(entry.pass, entry.tag))
                    {
                        await reload();
                    }
                }
            ),
            "@overall" === entry.tag ? listRenameMenu(entry.pass): [],
            Model.isSystemTagOld(entry.tag) ? []:
                menuItem
                (
                    label("Rename"),
                    async () =>
                    {
                        const newTag = await prompt(locale.map("Input a tag's name."), entry.tag);
                        if (null !== newTag && 0 < newTag.length && newTag !== entry.tag)
                        {
                            if (OldStorage.Tag.rename(entry.pass, entry.tag, newTag))
                            {
                                await showUrl({ pass: entry.pass, tag: newTag });
                            }
                            else
                            {
                                alert("その名前のタグは既に存在しています。");
                            }
                        }
                    }
                ),
            internalLink
            ({
                href: { pass: entry.pass, hash: "removed" },
                children: menuItem(label("@deleted")),
            }),
            menuItem
            (
                label("New ToDo"),
                async () =>
                {
                    const newTask = await prompt(locale.map("Input a ToDo's name."));
                    if (null !== newTask)
                    {
                        OldStorage.Task.add(entry.pass, newTask);
                        OldStorage.TagMember.add(entry.pass, entry.tag, newTask);
                        await showUrl({ pass: entry.pass, todo: newTask, });
                    }
                }
            ),
            // {
            //     tag: "button",
            //     children: "🚫 リストをシェア",
            // },
            internalLink
            ({
                href: { pass: entry.pass, hash: "export" },
                children: menuItem(label("Export")),
            }),
            Model.isSystemTagOld(entry.tag) ? []:
                menuItem
                (
                    label("Delete"),
                    async () =>
                    {
                        OldStorage.Tag.remove(entry.pass, entry.tag);
                        await showUrl({ pass: entry.pass, tag: "@overall" });
                    },
                    "delete-button"
                ),
            "@overall" === entry.tag ?
                menuItem
                (
                    label("Delete this List"),
                    async () =>
                    {
                        // Storage.Pass.remove(entry.pass);
                        // await showUrl({ });
                        const backup = location.href;
                        Operate.removeList(entry.pass, () => showPage(backup));
                        await showUrl({ });
                    },
                    "delete-button"
                ):
                [],
        ];
        export const softRegulateFilterText = (filter: string) => filter
            .trim()
            .replace(/\s+/g, " ");
        export const regulateFilterText = (filter: string) => softRegulateFilterText(filter)
            .replace(/ or /ig, " or ")
            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, match => String.fromCharCode(match.charCodeAt(0) -0xFEE0)) // 全角 to 半角
            .replace(/[\u3041-\u3096]/g, match => String.fromCharCode(match.charCodeAt(0) +0x60)); // ひらがな to カタカナ
        let lastFilterUpdateAt = 0;
        export const filter = async (init: string, onUpdate: (text: string) => Promise<unknown>) =>
        {
            const context =
            {
                value: init,
            };
            const onchange = () =>
            {
                input.classList.toggle("empty", "" === input.value);
                const value = softRegulateFilterText(input.value);
                if (value !== context.value)
                {
                    if ("" !== value)
                    {
                        const timestamp = lastFilterUpdateAt = new Date().getTime();
                        setTimeout
                        (
                            () =>
                            {
                                if (timestamp === lastFilterUpdateAt)
                                {
                                    Storage.Filter.add(value);
                                }
                            },
                            3000,
                        );
                    }
                    context.value = value;
                    onUpdate(value);
                }
            };
            const onfocus = () =>
            {
                getHeaderElement().classList.add("header-operator-has-focus");
                updateDropdownlist();
            };
            const onblur = async () =>
            {
                await minamo.core.timeout(500);
                if ("" === softRegulateFilterText(input.value))
                {
                    getHeaderElement().classList.remove("header-operator-has-focus");
                }
            };
            const clear = () =>
            {
                getHeaderElement().classList.remove("header-operator-has-focus");
                input.value = "";
                input.blur();
                onchange();
            };
            const icon = $div
            ({
                className: "filter-icon",
                onclick: () =>
                {
                    onfocus();
                    input.focus();
                }
            })
            (await Resource.loadSvgOrCache("search-icon"));
            const clearIcon = $div
            ({
                className: "clear-icon",
                onclick: clear,
            })
            (await Resource.loadSvgOrCache("cross-icon"));
            const input = $make(HTMLInputElement)
            ({
                tag: "input",
                type: "text",
                value: init,
                className: "filter-text",
                placeholder: locale.map("Filter"),
                onfocus,
                onblur,
                onkeyup: () => onchange(),
            });
            input.addEventListener('change', onchange);
            input.addEventListener('compositionupdate', onchange);
            input.addEventListener('compositionend', onchange);
            const dropdownlist = $make(HTMLDivElement)($div("dropdownlist")([]));
            const updateDropdownlist = () =>
            {
                const history = Storage.Filter.get();
                minamo.dom.replaceChildren
                (
                    dropdownlist,
                    0 < history.length ?
                        history.map
                        (
                            i => <minamo.dom.Source>
                            {
                                tag: "button",
                                children: i,
                                onclick: () =>
                                {
                                    input.value = i;
                                    onchange();
                                    Storage.Filter.add(i);
                                }
                            }
                        )
                        .concat
                        ([{
                            tag: "button",
                            className: "delete-button",
                            children: locale.map("Clear Filter History"),
                            onclick: () =>
                            {
                                Operate.clearFilterHistory
                                (
                                    async () =>
                                    {
                                        // すぐに反映するとこの時点では .filter-text からフォーカスが外れておらず、一瞬だけドロップダウンが表示される事になるのでちょっと wait を入れておく。
                                        await minamo.core.timeout(500);
                                        updateDropdownlist();
                                    }
                                );
                                updateDropdownlist();
                            }
                        }]):
                        []
                );
            };
            const result = $div
            ({
                className: "filter-frame",
                onclick: (event: MouseEvent) => event.stopPropagation(),
            })
            ([
                icon,
                input,
                dropdownlist,
                clearIcon,
            ]);
            onchange();
            return result;
        };
        export const getFilterInputElement = () => Array.from(document.getElementsByClassName("filter-text"))[0] as HTMLInputElement;
        export const blurFilterInputElement = () =>
        {
            getFilterInputElement().blur();
            // 本当に FilterInputElement にフォーカスが当たっている時でないと上の blur() で "header-operator-has-focus" クラスがハズレない為。
            getHeaderElement().classList.remove("header-operator-has-focus");
        };
        export const getFilterText = () => regulateFilterText
        (
            getFilterInputElement()?.value ?? ""
        );
        export const setFilterText = (text: string) =>
        {
            const filterInputElement = getFilterInputElement();
            if (filterInputElement)
            {
                filterInputElement.value = text;
                updateUrlFilterParam(text);
                updateWindow("operate");
            }
        };
        regulateFilterText
        (
            (Array.from(document.getElementsByClassName("filter-text"))[0] as HTMLInputElement)?.value ?? ""
        );
        export const isMatchTest = (filter: string, target: string) =>
        {
            if ("" === filter)
            {
                return true;
            }
            const tokens = filter.split(" ");
            const conditions: string[][] = [];
            let i = 0;
            while(i < tokens.length)
            {
                const current = [ tokens[i] ];
                ++i;
                if ("" !== current[0])
                {
                    while(i < tokens.length && "or" === tokens[i])
                    {
                        ++i;
                        if (i < tokens.length && "" !== tokens[i])
                        {
                            current.push(tokens[i]);
                            ++i;
                        }
                    }
                    conditions.push(current);
                }
            }
            return ! conditions.some(current => ! current.some(t => new RegExp(t, "i").test(target)));
        };
        export const updateUrlFilterParam = (filter: string, urlParams: PageParams = getUrlParams()) =>
        {
            if ("" === filter)
            {
                delete urlParams.filter;
            }
            else
            {
                urlParams.filter = filter;
            }
            history.pushState(null, document.title, makeUrl(urlParams));
        };
        export const isMatchToDoEntry = (filter: string, entry: ToDoTagEntryOld, item: ToDoEntry) =>
            isMatchTest(filter, regulateFilterText(item.task)) ||
            OldStorage.Tag.getByTodo(entry.pass, item.task).some(tag => entry.tag !== tag && isMatchTest(filter, regulateFilterText(tag)));
        export const listScreenHeader = async (entry: ToDoTagEntryOld, _list: ToDoEntry[]): Promise<HeaderSource> =>
        ({
            items:
            [
                await screenHeaderHomeSegment(),
                await screenHeaderListSegment(entry.pass),
                await screenHeaderTagSegment(entry.pass, entry.tag),
            ],
            menu: () => listScreenMenu(entry),
            operator: await filter
            (
                getUrlParams().filter ?? "",
                async filter =>
                {
                    updateUrlFilterParam(filter);
                    updateWindow("operate");
                }
            ),
            parent: "@overall" === entry.tag ? { }: { pass: entry.pass, tag: "@overall", }
        });
        export const listScreenFooter = async (entry: ToDoTagEntryOld, list: ToDoEntry[]) => $div("button-list")
        ([
            "@overall" !== entry.tag ?
                internalLink
                ({
                    href: { pass: entry.pass, tag: "@overall", },
                    children: $tag("button")(list.length <= 0 ? "main-button long-button": "default-button main-button long-button")(label("Back to Home")),
                }):
                [],
            {
                tag: "button",
                className: list.length <= 0 ? "default-button main-button long-button":  "main-button long-button",
                children: label("New ToDo"),
                onclick: async () =>
                {
                    const newTask = await prompt(locale.map("Input a ToDo's name."));
                    if (null !== newTask)
                    {
                        OldStorage.Task.add(entry.pass, newTask);
                        OldStorage.TagMember.add(entry.pass, entry.tag, newTask);
                        await showUrl({ pass: entry.pass, todo: newTask, });
                    }
                }
            },
            internalLink
            ({
                href: { pass: entry.pass, tag: entry.tag, hash: "history" },
                children: $tag("button")("main-button long-button")(label("History")),
            }),
        ]);
        export const listScreenBody = async (entry: ToDoTagEntryOld, list: ToDoEntry[], displayStyle = OldStorage.TagSettings.getDisplayStyle(entry.pass, entry.tag)) =>
        ([
            await historyBar(entry, list),
            $div("column-flex-list todo-list")(await Promise.all(list.map(item => todoItem(entry, item, displayStyle)))),
            await listScreenFooter(entry, list)
        ]);
        export const listScreen = async (entry: ToDoTagEntryOld, list: ToDoEntry[], filter: string) =>
        ({
            className: "list-screen",
            header: await listScreenHeader(entry, list),
            body: await listScreenBody(entry, list.filter(item => isMatchToDoEntry(filter, entry, item))),
        });
        export const showListScreen = async (pass: string, tag: string, urlParams: PageParams) =>
        {
            let entry = { tag, pass, todo: OldStorage.TagMember.get(pass, tag) };
            let list = entry.todo.map(task => Domain.getToDoEntryOld(entry.pass, task));
            let pickupAll = "@pickup" === tag ? OldStorage.TagMember.get(entry.pass, "@pickup-all").map(task => Domain.getToDoEntryOld(entry.pass, task)): [];
            Domain.updateListProgress(entry.pass, list);
            Domain.sortList(entry, list);
            if ("@pickup" === tag)
            {
                Domain.updateListProgress(entry.pass, pickupAll);
                Domain.sortList(entry, pickupAll);
            }
            let isDirty = false;
            const displayStyle = OldStorage.TagSettings.getDisplayStyle(entry.pass, entry.tag);
            const updateWindow = async (event: UpdateWindowEventEype) =>
            {
                switch(event)
                {
                    case "timer":
                        Domain.updateListProgress(entry.pass, list);
                        if ("@pickup" === tag)
                        {
                            Domain.updateListProgress(entry.pass, pickupAll);
                        }
                        isDirty = isDirty || ( ! Domain.sortList(entry, minamo.core.simpleDeepCopy(list)));
                        if (isDirty)
                        {
                            setProgressStyle("obsolescence", 0);
                        }
                        // if
                        // (
                        //     isDirty &&
                        //     document.body.scrollTop <= 0 &&
                        //     (document.getElementsByClassName("screen-body")[0]?.scrollTop ?? 0) <= 0 &&
                        //     ! hasScreenCover() &&
                        //     ! (getHeaderElement().classList.contains("header-operator-has-focus") ?? false)
                        // )
                        // {
                        //     //await updateWindow("operate");
                        // }
                        // else
                        // {
                            const filter = getFilterText();
                            const filteredList = list.filter(item => isMatchToDoEntry(filter, entry, item));
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
                                    const item = filteredList[index];
                                    const button = dom.getElementsByClassName("item-operator")[0].getElementsByClassName("main-button")[0] as HTMLButtonElement;
                                    button.classList.toggle("default-button", item.isDefault);
                                    if ("full" === displayStyle)
                                    {
                                        const information = dom.getElementsByClassName("item-information")[0] as HTMLDivElement;
                                        information.setAttribute("style", Render.progressInformationStyle(entry.pass, item));
                                        (information.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0] as HTMLSpanElement).innerText = Domain.timeLongStringFromTick(item.elapsed);
                                    }
                                    else
                                    {
                                        dom.setAttribute("style", Render.progressTitleStyle(entry.pass, item));
                                    }
                                }
                            );
                            if ("@pickup" === tag)
                            {
                                const filteredList = pickupAll.filter(item => isMatchToDoEntry(filter, entry, item));
                                Array.from(document.getElementsByClassName("history-bar")).forEach
                                (
                                    async dom => minamo.dom.replaceChildren(dom, (await historyBar(entry, filteredList)).children)
                                );
                            }
                            else
                            {
                                Array.from(document.getElementsByClassName("history-bar")).forEach
                                (
                                    async dom => minamo.dom.replaceChildren(dom, (await historyBar(entry, filteredList)).children)
                                );
                            }
                        // }
                        break;
                    case "focus":
                    case "blur":
                    case "scroll":
                        Domain.updateListProgress(entry.pass, list);
                        isDirty = isDirty || ( ! Domain.sortList(entry, minamo.core.simpleDeepCopy(list)));
                        if (isDirty)
                        {
                            await updateWindow("operate");
                        }
                        break;
                    case "storage":
                        await reload();
                        break;
                    case "operate":
                        if (0 <= OldStorage.Pass.get().indexOf(entry.pass))
                        {
                            removeProgressStyle("obsolescence");
                            let entry = { tag, pass, todo: OldStorage.TagMember.get(pass, tag) };
                            list = entry.todo.map(task => Domain.getToDoEntryOld(entry.pass, task));
                            Domain.updateListProgress(entry.pass, list);
                            Domain.sortList(entry, list);
                            if ("@pickup" === tag)
                            {
                                pickupAll = "@pickup" === tag ? OldStorage.TagMember.get(entry.pass, "@pickup-all").map(task => Domain.getToDoEntryOld(entry.pass, task)): [];
                                Domain.updateListProgress(entry.pass, pickupAll);
                                Domain.sortList(entry, pickupAll);
                            }
                            isDirty = false;
                            const filter = getFilterText();
                            replaceScreenBody(await listScreenBody(entry, list.filter(item => isMatchToDoEntry(filter, entry, item))));
                            resizeFlexList();
                            if ("@pickup" === tag)
                            {
                                await updateWindow("timer");
                            }
                        }
                        else
                        {
                            await showUrl({ });
                        }
                        break;
                    case "dirty":
                        isDirty = true;
                        setProgressStyle("obsolescence", 0);
                        break;
                }
            };
            const filter = regulateFilterText(urlParams.filter ?? "");
            await showWindow(await listScreen(entry, list, filter), updateWindow);
            if ("@pickup" === tag)
            {
                await updateWindow("timer");
            }
        };
        export const historyScreenMenu = async (entry: ToDoTagEntryOld) =>
        [
            menuItem
            (
                label("Back to List"),
                async () => await showUrl({ pass: entry.pass, tag: entry.tag, })
            ),
            Model.isSystemTagOld(entry.tag) ? []:
                menuItem
                (
                    label("Rename"),
                    async () =>
                    {
                        const newTag = await prompt(locale.map("Input a tag's name."), entry.tag);
                        if (null !== newTag && 0 < newTag.length && newTag !== entry.tag)
                        {
                            if (OldStorage.Tag.rename(entry.pass, entry.tag, newTag))
                            {
                                await showUrl({ pass: entry.pass, tag: newTag, hash: "history", });
                            }
                            else
                            {
                                alert("その名前のタグは既に存在しています。");
                            }
                        }
                    }
                ),
            menuItem
            (
                label("New ToDo"),
                async () =>
                {
                    const newTask = await prompt(locale.map("Input a ToDo's name."));
                    if (null !== newTask)
                    {
                        OldStorage.Task.add(entry.pass, newTask);
                        OldStorage.TagMember.add(entry.pass, entry.tag, newTask);
                        await showUrl({ pass: entry.pass, todo: newTask, });
                    }
                }
            ),
            // {
            //     tag: "button",
            //     children: "🚫 リストをシェア",
            // },
            menuItem
            (
                label("Export"),
                async () => await showUrl({ pass: entry.pass, hash: "export", })
            ),
            // Storage.Tag.isSystemTag(entry.tag) ? []:
            //     menuItem
            //     (
            //         label("Delete"),
            //         async () =>
            //         {
            //         },
            //         "delete-button"
            //     ),
            // "@overall" === entry.tag ?
            //     menuItem
            //     (
            //         label("Delete"),
            //         async () =>
            //         {
            //             Storage.Pass.remove(entry.pass);
            //             await showUrl({ });
            //         },
            //         "delete-button"
            //     ):
            //     [],
        ];
        export const isMatchHistoryItem = (filter: string, _entry: ToDoTagEntryOld, item: { task: string, tick: number | null }) =>
            isMatchTest(filter, regulateFilterText(item.task)) ||
            isMatchTest(filter, regulateFilterText(Domain.dateStringFromTick(item.tick)));
        export const historyScreenHeader = async (entry: ToDoTagEntryOld, list: { task: string, tick: number | null }[]): Promise<HeaderSource> =>
        ({
            items:
            [
                await screenHeaderHomeSegment(),
                await screenHeaderListSegment(entry.pass),
                await screenHeaderTagSegment(entry.pass, entry.tag),
                await screenHeaderTaskSegment(entry.pass, entry.tag, "@history"),
            ],
            menu: await historyScreenMenu(entry),
            operator: await filter
            (
                getUrlParams().filter ?? "",
                async filter =>
                {
                    const regulatedFilter = regulateFilterText(filter);
                    replaceScreenBody(await historyScreenBody(entry, list.filter(item => isMatchHistoryItem(regulatedFilter, entry, item))));
                    resizeFlexList();
                    updateUrlFilterParam(filter);
                }
            ),
            parent: { pass: entry.pass, tag: entry.tag, },
        });
        export const historyScreenBody = async (entry: ToDoTagEntryOld, list: { task: string, tick: number | null }[]) =>
        ([
            $div("column-flex-list history-list")(await Promise.all(list.map(item => historyItem(entry, item)))),
            $div("button-list")
            (
                internalLink
                ({
                    href: { pass: entry.pass, tag: entry.tag, },
                    children: $tag("button")("default-button main-button long-button")(label("Back to List")),
                })
            ),
        ]);
        export const historyScreen = async (entry: ToDoTagEntryOld, list: { task: string, tick: number | null }[], filter: string): Promise<ScreenSource> =>
        ({
            className: "history-screen",
            header: await historyScreenHeader(entry, list),
            body: await historyScreenBody(entry, list.filter(item => isMatchHistoryItem(filter, entry, item)))
        });
        export const showHistoryScreen = async (urlParams: PageParams, entry: ToDoTagEntryOld) =>
        {
            const histories: { [task:string]:number[] } = { };
            let list = entry.todo.map(task => (histories[task] = OldStorage.History.getTicks(entry.pass, task)).map(tick => ({ task, tick:<number | null>tick, }))).reduce((a, b) => a.concat(b), []);
            list.sort(minamo.core.comparer.make(a => -(a.tick ?? 0)));
            list = list.concat(entry.todo.filter(task => histories[task].length <= 0).map(task => ({ task, tick: null })));
            const filter = regulateFilterText(urlParams.filter ?? "");
            await showWindow(await historyScreen(entry, list, filter));
        };
        export const removedItem = async (pass: string, item: RemovedType) => $div("removed-item flex-item")
        ([
            $div("item-header")
            ([
                $div("item-title")
                ([
                    await Resource.loadSvgOrCache(OldStorage.Removed.getIcon(item)),
                    `${OldStorage.Removed.getTypeName(item)}: ${OldStorage.Removed.getName(item)}`,
                ]),
                $div("item-operator")
                ([{
                    tag: "button",
                    className: "main-button",
                    children: label("Restore"),
                    onclick: async () =>
                    {
                        if (OldStorage.Removed.restore(pass, item))
                        {
                            await reload();
                        }
                        else
                        {
                            await alert("復元できませんでした。( 同名の項目が存在すると復元できません。また、サブリスト内の ToDo の場合、元のサブリストが存在している必要があります。 )");
                        }
                    }
                }])
            ]),
            $div("item-information")
            ([
                monospace("remoced-timestamp", label("deletedAt"), Domain.dateStringFromTick(item.deteledAt)),
            ]),
        ]);
        export const removedScreenMenu = async (pass: string) =>
        [
            menuItem
            (
                label("Back to List"),
                async () => await showUrl({ pass, tag: "@overall", })
            ),
            menuItem
            (
                label("Permanently Delete"),
                async () =>
                {
                    OldStorage.Removed.clear(pass);
                    await reload();
                },
                "delete-button"
            ),
        ];
        export const removedScreen = async (pass: string, list: RemovedType[]) =>
        ({
            className: "removed-screen",
            header:
            {
                items:
                [
                    await screenHeaderHomeSegment(),
                    await screenHeaderListSegment(pass),
                    await screenHeaderTagSegment(pass, "@deleted"),
                ],
                menu: await removedScreenMenu(pass),
                parent: { pass, tag: "@overall", },
            },
            body:
            [
                0 < list.length ?
                $div("column-flex-list removed-list")
                (
                    await Promise.all
                    (
                        list.concat([])
                            .sort(minamo.core.comparer.make(item => -item.deteledAt))
                            .map(item => removedItem(pass, item))
                    )
                ):
                $div("button-list")(label("Recycle Bin is empty.")),
                $div("button-list")
                ([
                    internalLink
                    ({
                        href: { pass, tag: "@overall", },
                        children: $tag("button")("default-button main-button long-button")(label("Back to Home")),
                    }),
                    0 < list.length ?
                        {
                            tag: "button",
                            className: "main-button long-button delete-button",
                            children: label("Permanently Delete"),
                            onclick: async () =>
                            {
                                if (systemConfirm(locale.map("This action cannot be undone. Do you want to continue?")))
                                {
                                    OldStorage.Removed.clear(pass);
                                    await reload();
                                }
                            },
                        }:
                        [],
                ]),
            ]
        });
        export const showRemovedScreen = async (pass: string) =>
            await showWindow(await removedScreen(pass, OldStorage.Removed.get(pass)));
        export const todoScreenMenu = async (pass: string, item: ToDoEntry) =>
        [
            todoDoneMenu(pass, item),
            todoRenameMenu(pass, item, async newTask => await showUrl({ pass, todo:newTask, })),
            todoTagMenu(pass, item),
            todoDeleteMenu(pass, item),
            // {
            //     tag: "button",
            //     children: "🚫 ToDo をシェア",
            // },
            menuItem
            (
                label("Export"),
                async () => await showUrl({ pass, hash: "export", })
            ),
        ];
        export const todoScreenHeader = async (pass: string, item: ToDoEntry, _ticks: number[], tag: string) =>
        ({
            items:
            [
                await screenHeaderHomeSegment(),
                await screenHeaderListSegment(pass),
                await screenHeaderTagSegment(pass, tag),
                await screenHeaderTaskSegment(pass, tag, item.task),
            ],
            menu: await todoScreenMenu(pass, item),
            parent: { pass, tag, },
        });
        export const getIntervalsMax = (intervals: number[]) =>
        {
            if (0 < intervals.length)
            {
                const i = <[number, ...number[]]>intervals;
                const average = Calculate.average(i);
                if (6 < intervals.length)
                {
                    const standardDeviation = Calculate.standardDeviation(i, average);
                    return Math.max.apply(null, intervals.filter(i => (i -average -config.granceMinutes) / standardDeviation <= config.sleepStandardDeviationRate));
                }
                else
                {
                    return Math.max.apply(null, intervals);
                }
            }
            else
            {
                return null;
            }
        };
        export const todoScreenBody = async (pass: string, item: ToDoEntry, ticks: number[], _tag: string, max: number | null = getIntervalsMax(Calculate.intervals(ticks))) =>
        ([
            OldStorage.isSessionPass(pass) ?
                []:
                $div("button-list")
                ({
                    tag: "button",
                    className: item.isDefault ? "default-button main-button long-button": "main-button long-button",
                    children: label("Done"),
                    onclick: async () =>
                    {
                        await Operate.done
                        (
                            pass,
                            item.task,
                            MigrateBridge.getDoneTicks(pass),
                            () => updateWindow("operate")
                        );
                        updateWindow("operate");
                    }
                }),
            $div("row-flex-list todo-list")
            ([
                $div("task-item flex-item")
                ([
                    $div("item-attribute")
                    ([
                        $div("item-tags")
                        (
                            await Promise.all
                            (
                                OldStorage.Tag.getByTodo(pass, item.task).map
                                (
                                    async tag => internalLink
                                    ({
                                        className: "tag",
                                        href: { pass, tag, },
                                        children:
                                        [
                                            await Resource.loadTagSvgOrCache(tag),
                                            Domain.tagMap(tag)
                                        ],
                                    })
                                )
                            )
                        ),
                        $div("item-settings")
                        ([
                            null !== (OldStorage.TodoSettings.get(pass, item.task).flash ?? null) ?
                                linkButton
                                ({
                                    className: "tag",
                                    children: await Resource.loadTagSvgOrCache("@flash"),
                                    onclick: async (event: MouseEvent) =>
                                    {
                                        event.preventDefault();
                                        if (await todoFlashSettingsPopup(pass, item))
                                        {
                                            updateWindow("timer");
                                        }
                                    }
                                }):
                                [],
                            null !== (OldStorage.TodoSettings.get(pass, item.task).pickup ?? null) ?
                                linkButton
                                ({
                                    className: "tag",
                                    children: await Resource.loadTagSvgOrCache("@pickup"),
                                    onclick: async (event: MouseEvent) =>
                                    {
                                        event.preventDefault();
                                        if (await todoPickupSettingsPopup(pass, item))
                                        {
                                            updateWindow("timer");
                                        }
                                    }
                                }):
                                [],
                            null !== (OldStorage.TodoSettings.get(pass, item.task).restriction ?? null) ?
                                linkButton
                                ({
                                    className: "tag",
                                    children: await Resource.loadTagSvgOrCache("@restriction"),
                                    onclick: async (event: MouseEvent) =>
                                    {
                                        event.preventDefault();
                                        if (await todoRestrictionSettingsPopup(pass, item))
                                        {
                                            updateWindow("timer");
                                        }
                                    }
                                }):
                                [],
                        ]),
                    ]),
                    informationFull(pass, item),
                ]),
            ]),
            $div("column-flex-list tick-list")
            (
                await Promise.all
                (
                    ticks.map
                    (
                        (tick, index) => tickItem
                        (
                            pass,
                            item,
                            tick,
                            "number" === typeof ticks[index +1] ? tick -ticks[index +1]: null,
                            max
                        )
                    )
                )
            ),
        ]);
        export const todoScreen = async (pass: string, item: ToDoEntry, ticks: number[], tag: string) =>
        ({
            className: "todo-screen",
            header: await todoScreenHeader(pass, item, ticks, tag),
            body: await todoScreenBody(pass, item, ticks, tag)
        });
        export const getPrimaryTag = (tags: string[]) => minamo.core.simpleDeepCopy(tags).sort
        (
            minamo.core.comparer.make
            (
                tag =>
                (
                    {
                        "@flash": 2,
                        "@pickup": 3,
                        "@short-term": 5,
                        "@medium-term": 5,
                        "@long-term": 5,
                        "@irregular-term": 5,
                        "@overall": 6,
                        "@untagged": 4,
                    }
                    [tag] ?? (Model.isSublistOld(tag) ? 0: 1)
                )
            )
        )[0];
        export const showTodoScreen = async (pass: string, task: string) =>
        {
            let item = Domain.getToDoEntryOld(pass, task);
            let tag: string = getPrimaryTag(OldStorage.Tag.getByTodo(pass, item.task));
            let ticks = OldStorage.History.getTicks(pass, task);
            let isDirty = false;
            Domain.updateProgress(pass, item);
            const updateWindow = async (event: UpdateWindowEventEype) =>
            {
                switch(event)
                {
                    case "timer":
                        Domain.updateProgress(pass, item);
                        const dom = document
                            .getElementsByClassName("todo-screen")[0]
                            .getElementsByClassName("task-item")[0] as HTMLDivElement;
                        const information = dom.getElementsByClassName("item-information")[0] as HTMLDivElement;
                        information.setAttribute("style", Render.progressInformationStyle(pass, item));
                        (information.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0] as HTMLSpanElement).innerText = Domain.timeLongStringFromTick(item.elapsed);
                        break;
                    case "focus":
                    case "blur":
                    case "scroll":
                        if (isDirty)
                        {
                            await updateWindow("operate");
                        }
                        break;
                    case "storage":
                        await reload();
                        break;
                    case "operate":
                        item = Domain.getToDoEntryOld(pass, task);
                        tag = OldStorage.Tag.getByTodo(pass, item.task).filter(tag => "@overall" !== tag).concat("@overall")[0];
                        ticks = OldStorage.History.getTicks(pass, task);
                        Domain.updateProgress(pass, item);
                        isDirty = false;
                        replaceScreenBody(await todoScreenBody(pass, item, ticks, tag));
                        resizeFlexList();
                        break;
                    case "dirty":
                        isDirty = true;
                        setProgressStyle("obsolescence", 0);
                        break;
                }
            };
            await showWindow(await todoScreen(pass, item, ticks, tag), updateWindow);
        };
        export module Resource
        {
            export type KeyType = keyof typeof resource;
            export const loadSvgOrCache = async (key: KeyType): Promise<SVGElement> =>
            {
                try
                {
                    return new DOMParser().parseFromString(minamo.core.existsOrThrow(document.getElementById(key)).innerHTML, "image/svg+xml").documentElement as any;
                }
                catch(error)
                {
                    console.log({key});
                    throw error;
                }
            };
            export const getTagIcon = (tag: string): keyof typeof resource =>
            {
                switch(tag)
                {
                    case "@overall":
                        return "home-icon";
                    case "@flash":
                        return "flash-icon";
                    case "@pickup":
                        return "pickup-icon";
                    case "@restriction":
                        return "forbidden-icon";
                    case "@short-term":
                        return "short-term-icon";
                    case "@medium-term":
                        return "medium-term-icon";
                    case "@long-term":
                        return "long-term-icon";
                    case "@irregular-term":
                        return "sleep-icon";
                    case "@unoverall":
                        return "anti-home-icon";
                    case "@untagged":
                        return "ghost-tag-icon";
                    case "@deleted":
                        return "recycle-bin-icon";
                    default:
                        return Model.isSublistOld(tag) ?
                            "folder-icon":
                            "tag-icon";
                }
            };
            export const loadTagSvgOrCache = async (tag: string): Promise<SVGElement> => loadSvgOrCache(getTagIcon(tag));
        }
        export const showExportScreen = async (pass: string) =>
            await showWindow(await exportScreen(pass));
        export const exportScreenMenu = async (pass: string) =>
        [
            menuItem
            (
                label("Back to List"),
                async () => async () => await showUrl({ pass, tag: "@overall", }),
            )
        ];
        export const exportScreen = async (pass: string): Promise<ScreenSource> =>
        ({
            className: "export-screen",
            header:
            {
                items:
                [
                    await screenHeaderHomeSegment(),
                    await screenHeaderListSegment(pass),
                    {
                        icon: "export-icon",
                        title: locale.map("Export"),
                    }
                ],
                menu: await exportScreenMenu(pass),
                parent: { pass: pass, tag: "@overall", },
            },
            body:
            [
                $tag("textarea")("json")(OldStorage.exportJson(pass)),
            ]
        });
        export const showImportScreen = async () =>
            await showWindow(await importScreen());
        export const importScreenMenu = async () =>
        [
            menuItem
            (
                label("Back to Top"),
                async () => await showUrl({ }),
            )
        ];
        export const importScreen = async () =>
        ({
            className: "import-screen",
            header:
            {
                items:
                [
                    await screenHeaderHomeSegment(),
                    await screenHeaderListSegment("@import")
                ],
                menu: await importScreenMenu(),
                parent: { },
            },
            body:
            [
                $tag("textarea")("json")("エクスポートした JSON をペーストしてください。"),
                $div("button-list")
                ({
                    tag: "button",
                    className: "default-button main-button long-button",
                    children: label("Import"),
                    onclick: async () =>
                    {
                        const textarea = document.getElementsByClassName("json")[0] as HTMLTextAreaElement;
                        const pass = OldStorage.importJson(textarea.value);
                        if (null !== pass)
                        {
                            showUrl({ pass, tag: "@overall", });
                        }
                    },
                }),
            ]
        });
        export const removedListItem = async (list: Content) => $div("list-item flex-item")
        ([
            $div("item-header")
            ([
                $div("item-title")
                ([
                    await Resource.loadSvgOrCache("list-icon"),
                    list.title ?? `ToDo リスト ( pass: ${list.pass.substr(0, 2)}****${list.pass.substr(-2)} )`,
                ]),
                $div("item-operator")
                ([{
                    tag: "button",
                    className: "default-button main-button",
                    children: label("Restore"),
                    onclick: async () =>
                    {
                        const pass = OldStorage.importJson(JSON.stringify(list));
                        if (null !== pass)
                        {
                            showUrl({ pass, tag: "@overall", });
                        }
                        else
                        {
                            console.error(JSON.stringify(list));
                        }
                    },
                }]),
            ]),
        ]);
        export const showRemovedListScreen = async () =>
            await showWindow(await removedListScreen(OldStorage.Backup.get().map(json => JSON.parse(json) as Content)));
        export const removedListScreenMenu = async () =>
        [
            menuItem
            (
                label("Back to Top"),
                async () => await showUrl({ }),
            )
        ];
        export const removedListScreen = async (list: Content[]) =>
        ({
            className: "remove-list-screen",
            header:
            {
                items:
                [
                    await screenHeaderHomeSegment(),
                    await screenHeaderListSegment("@removed")
                ],
                menu: await removedListScreenMenu(),
                parent: { },
            },
            body:
            [
                0 < list.length ?
                    $div("column-flex-list removed-list-list")(await Promise.all(list.map(item => removedListItem(item)))):
                    $div("button-list")(label("Recycle Bin is empty.")),
                $div("button-list")
                ([
                    internalLink
                    ({
                        href: {  },
                        children: $tag("button")("default-button main-button long-button")(label("Back to Top")),
                    }),
                    0 < list.length ?
                        {
                            tag: "button",
                            className: "main-button long-button delete-button",
                            children: label("Permanently Delete"),
                            onclick: async () =>
                            {
                                if (systemConfirm(locale.map("This action cannot be undone. Do you want to continue?")))
                                {
                                    OldStorage.Backup.clear();
                                    await reload();
                                }
                            },
                        }:
                        [],
                ]),
            ]
        });
        export const applicationIcon = async () =>
            $div("application-icon icon")(await Resource.loadSvgOrCache("application-icon"));
        // export const applicationColorIcon = async () =>
        //     $div("application-icon icon")(await Resource.loadSvgOrCache("application-color-icon"));
        export const listItem = async (list: Content) => $div("list-item flex-item")
        ([
            $div("item-header")
            ([
                internalLink
                ({
                    className: "item-title",
                    href: { pass: list.pass, tag: "@overall", },
                    children:
                    [
                        await Resource.loadSvgOrCache("list-icon"),
                        list.title,
                        // Storage.Title.get(list.pass),
                        // `ToDo リスト ( pass: ${list.pass.substr(0, 2)}****${list.pass.substr(-2)} )`,
                    ]
                }),
                $div("item-operator")
                ([
                    internalLink
                    ({
                        href: { pass: list.pass, tag: "@overall", },
                        children:
                        {
                            tag: "button",
                            className: "default-button main-button",
                            children: label("Open"),
                        },
                    }),
                    await menuButton
                    ([
                        listRenameMenu(list.pass),
                        internalLink
                        ({
                            href: { pass: list.pass, tag: "@overall", hash: "history" },
                            children: menuItem(label("History")),
                        }),
                        internalLink
                        ({
                            href: { pass: list.pass, hash: "export", },
                            children: menuItem(label("Export")),
                        }),
                        menuItem
                        (
                            label("Delete"),
                            async () =>
                            {
                                // Storage.Pass.remove(list.pass);
                                // await reload();
                                Operate.removeList(list.pass);
                                updateWindow("operate");
                            },
                            "delete-button"
                        )
                    ]),
                ]),
            ]),
        ]);
        export const welcomeScreenMenu = async () =>
        [
            menuItem
            (
                label("Reload screen"),
                async () =>
                {
                    minamo.dom.appendChildren
                    (
                        document.head,
                        {
                            tag: "meta",
                            attributes:
                            {
                                "http-equiv": "refresh",
                                "content": "0",
                            }
                        }
                    );
                }
            ),
            await fullscreenMenuItem(),
            menuItem
            (
                label("Theme setting"),
                async () =>
                {
                    if (await themeSettingsPopup())
                    {
                        // updateStyle();
                    }
                }
            ),
            menuItem
            (
                label("Language setting"),
                async () =>
                {
                    if (await localeSettingsPopup())
                    {
                        locale.setLocale(Storage.SystemSettings.get().locale ?? null);
                        await reload();
                    }
                }
            ),
            menuItem
            (
                label("New ToDo List"),
                newListPrompt,
            ),
            internalLink
            ({
                href: { hash: "import", },
                children: menuItem(label("Import List")),
            }),
            internalLink
            ({
                href: { hash: "removed", },
                children: menuItem(label("@deleted")),
            }),
            externalLink
            ({
                href: config.repositoryUrl,
                children: menuItem(labelSpan("GitHub")),
            }),
        ];
        export const welcomeScreen = async (): Promise<ScreenSource> =>
        ({
            className: "welcome-screen",
            header:
            {
                items:
                [
                    await screenHeaderHomeSegment(),
                ],
                menu: await welcomeScreenMenu()
            },
            body:
            [
                //$div("logo")([await applicationColorIcon(),$span("logo-text")(applicationTitle)]),
                $div("logo")([await applicationIcon(),$span("logo-text")(applicationTitle)]),
                $div({ style: "text-align: center; padding: 0.5rem;", })
                    ("🚧 This static web application is under development. / この Static Web アプリは開発中です。"),
                $div("button-line locale-parallel-on")
                ([
                    {
                        tag: "button",
                        className: OldStorage.Pass.get().length <= 0 ? "default-button main-button long-button": "main-button long-button",
                        children: label("New ToDo List"),
                        onclick: newListPrompt,
                    },
                    await menuButton
                    ([
                        internalLink
                        ({
                            href: { hash: "import", },
                            children: menuItem(label("Import List")),
                        }),
                        internalLink
                        ({
                            href: { hash: "removed", },
                            children: menuItem(label("@deleted")),
                        }),
                    ]),
                ]),
                $div("row-flex-list compact-flex-list list-list")
                    (await Promise.all(OldStorage.Pass.get().map(pass => listItem(JSON.parse(OldStorage.exportJson(pass)) as Content)))),
            ]
        });
        export const showWelcomeScreen = async () =>
            await showWindow(await welcomeScreen());
        export const updatingScreenMenu = async () =>
        [
            menuItem
            (
                label("Back to Top"),
                async () => await showUrl({ }),
            ),
            menuItem
            (
                "GitHub",
                async () => location.href = "https://github.com/wraith13/cyclic-todo/",
            ),
        ];
        export const updatingScreen = async (url: string = location.href): Promise<ScreenSource> =>
        ({
            className: "updating-screen",
            header:
            {
                items:
                [
                    await screenHeaderHomeSegment(),
                    {
                        icon: "list-icon",
                        title: "loading...",
                    },
                ],
                menu: await updatingScreenMenu(),
                parent: { },
            },
            body:
            [
                //await applicationColorIcon(),
                await applicationIcon(),
                // $div("message")(label("Updating...")),
                $div("button-list")
                ({
                    tag: "button",
                    className: "default-button main-button long-button",
                    children: label("Reload"),
                    onclick: async () => await showPage(url),
                }),
            ]
        });
        export const showUpdatingScreen = async (url: string = location.href) =>
            await showWindow(await updatingScreen(url));
        export const updateTitle = () =>
        {
            document.title = Array.from(getHeaderElement().getElementsByClassName("segment-title"))
                ?.map(div => (<HTMLDivElement>div).innerText)
                // ?.reverse()
                ?.join(" / ")
                ?? applicationTitle;
        };
        export type UpdateWindowEventEype = "timer" | "scroll" | "storage" | "focus" | "blur" | "operate" | "dirty";
        export let updateWindow: (event: UpdateWindowEventEype) => unknown;
        let updateWindowTimer: number;
        export const getHeaderElement = () => document.getElementById("screen-header") as HTMLDivElement;
        export const showWindow = async (screen: ScreenSource, updateWindow?: (event: UpdateWindowEventEype) => unknown) =>
        {
            removeProgressStyle("obsolescence");
            if (undefined !== updateWindow)
            {
                Render.updateWindow = updateWindow;
            }
            else
            {
                Render.updateWindow = async (event: UpdateWindowEventEype) =>
                {
                    if ("storage" === event || "operate" === event)
                    {
                        await reload();
                    }
                };
            }
            if (undefined === updateWindowTimer)
            {
                updateWindowTimer = setInterval
                (
                    () => Render.updateWindow?.("timer"),
                    Domain.timeAccuracy
                );
                document.getElementsByClassName("screen-body")[0]?.addEventListener
                (
                    "scroll",
                    () =>
                    {
                        if ((document.getElementsByClassName("screen-body")[0]?.scrollTop ?? 0) <= 0)
                        {
                            Render.updateWindow?.("scroll");
                        }
                    }
                );
            }
            minamo.core.existsOrThrow(document.getElementById("screen")).className = `${screen.className} screen`;
            minamo.dom.replaceChildren
            (
                getHeaderElement(),
                await screenSegmentedHeader(screen.header)
            );
            minamo.dom.replaceChildren
            (
                minamo.core.existsOrThrow(document.getElementById("screen-body")),
                screen.body
            );
            getHeaderElement().classList.toggle("header-operator-has-focus", "" !== getFilterText());
            updateTitle();
            //minamo.core.timeout(100);
            resizeFlexList();
        };
        export interface Toast
        {
            dom: HTMLDivElement;
            timer: number | null;
            hide: ()  => Promise<unknown>;
        }
        export const makeToast =
        (
            data:
            {
                content: minamo.dom.Source,
                backwardOperator?: minamo.dom.Source,
                forwardOperator?: minamo.dom.Source,
                isWideContent?: boolean,
                wait?: number,
            }
        ): Toast =>
        {
            const dom = $make(HTMLDivElement)
            ({
                tag: "div",
                className: "item slide-up-in",
                children: data.isWideContent ?
                [
                    data.backwardOperator,
                    data.content,
                    data.forwardOperator,
                ].filter(i => undefined !== i):
                [
                    data.backwardOperator ?? $span("dummy")([]),
                    data.content,
                    data.forwardOperator ?? $span("dummy")([]),
                ],
            });
            const hideRaw = async (className: string, wait: number) =>
            {
                if (null !== result.timer)
                {
                    clearTimeout(result.timer);
                    result.timer = null;
                }
                if (dom.parentElement)
                {
                    dom.classList.remove("slide-up-in");
                    dom.classList.add(className);
                    await minamo.core.timeout(wait);
                    minamo.dom.remove(dom);
                    // 以下は Safari での CSS バグをクリアする為の細工。本質的には必要の無い呼び出し。
                    if (minamo.core.existsOrThrow(document.getElementById("screen-toast")).getElementsByClassName("item").length <= 0)
                    {
                        await minamo.core.timeout(10);
                        updateWindow("operate");
                    }
                }
            };
            const wait = data.wait ?? 5000;
            const result =
            {
                dom,
                timer: 0 < wait ? setTimeout(() => hideRaw("slow-slide-down-out", 500), wait): null,
                hide: async () => await hideRaw("slide-down-out", 250),
            };
            minamo.core.existsOrThrow(document.getElementById("screen-toast")).appendChild(dom);
            setTimeout(() => dom.classList.remove("slide-up-in"), 250);
            return result;
        };
        export const getProgressElement = () => minamo.core.existsOrThrow(document.getElementById("screen-header"));
        export const setProgressStyleRaw = (className: string) => getProgressElement().className = `segmented ${className}`;
        let lastSetProgressAt = 0;
        export const setProgressStyle = async (className: string, timeout: number) =>
        {
            const timestamp = lastSetProgressAt = new Date().getTime();
            setProgressStyleRaw(className);
            if (0 < timeout)
            {
                await minamo.core.timeout(timeout);
                if (timestamp === lastSetProgressAt)
                {
                    setProgressStyleRaw("max-progress");
                    await minamo.core.timeout(100);
                    if (timestamp === lastSetProgressAt)
                    {
                        setProgressStyleRaw("");
                    }
                }
            }
        };
        export const removeProgressStyle = (className: string) => getProgressElement().classList.remove(className);
        export const withProgress = async <T>(className: string, content: minamo.dom.Source, task: Promise<T>): Promise<T> =>
        {
            setProgressStyle(className, 0);
            const toast = makeToast
            ({
                content,
                wait: 0,
            });
            const result = await task;
            setProgressStyle("", 0);
            toast.hide();
            return result;
        };
        export const withUpdateProgress = async <T>(content: minamo.dom.Source, task: Promise<T>): Promise<T> =>
            await withProgress("update", content, task);
        export const resizeFlexList = () =>
        {
            const minColumns = 1 +Math.floor(window.innerWidth / 780);
            const maxColumns = Math.min(12, Math.max(minColumns, Math.floor(window.innerWidth / 450)));
            const FontRemUnit = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const border = FontRemUnit *26 +10;
            (Array.from(document.getElementsByClassName("menu-popup")) as HTMLDivElement[]).forEach
            (
                header =>
                {
                    header.classList.toggle("locale-parallel-on", 2 <= minColumns);
                    header.classList.toggle("locale-parallel-off", minColumns < 2);
                }
            );
            [document.getElementById("screen-toast") as HTMLDivElement].forEach
            (
                header =>
                {
                    header.classList.toggle("locale-parallel-on", 2 <= minColumns);
                    header.classList.toggle("locale-parallel-off", minColumns < 2);
                }
            );
            (Array.from(document.getElementsByClassName("button-list")) as HTMLDivElement[]).forEach
            (
                header =>
                {
                    header.classList.toggle("locale-parallel-on", true);
                    header.classList.toggle("locale-parallel-off", false);
                }
            );
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
                        minamo.dom.removeCSSStyleProperty(list.style, "height");
                    }
                    else
                    {
                        const height = window.innerHeight -list.offsetTop;
                        const itemHeight = (list.childNodes[0] as HTMLElement).offsetHeight +1;
                        const columns = Math.min(maxColumns, Math.ceil(length / Math.max(1.0, Math.floor(height / itemHeight))));
                        const row = Math.max(Math.ceil(length /columns), Math.min(length, Math.floor(height / itemHeight)));
                        list.style.height = `${row *itemHeight}px`;
                        list.classList.add(`max-column-${columns}`);
                    }
                    if (0 < length)
                    {
                        const itemWidth = Math.min(window.innerWidth, (list.childNodes[0] as HTMLElement).offsetWidth);
                        list.classList.toggle("locale-parallel-on", border < itemWidth);
                        list.classList.toggle("locale-parallel-off", itemWidth <= border);
                    }
                    list.classList.toggle("empty-list", length <= 0);
                }
            );
            (Array.from(document.getElementsByClassName("row-flex-list")) as HTMLDivElement[]).forEach
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
                    if (0 < length)
                    {
                        // const columns = Math.min(maxColumns, Math.max(1, length));
                        // list.classList.add(`max-column-${columns}`);
                        const height = window.innerHeight -list.offsetTop;
                        const itemHeight = (list.childNodes[0] as HTMLElement).offsetHeight;
                        const columns = list.classList.contains("compact-flex-list") ?
                            Math.min(maxColumns, length):
                            Math.min(maxColumns, Math.ceil(length / Math.max(1.0, Math.floor(height / itemHeight))));
                        list.classList.add(`max-column-${columns}`);
                        const itemWidth = Math.min(window.innerWidth, (list.childNodes[0] as HTMLElement).offsetWidth);
                        list.classList.toggle("locale-parallel-on", border < itemWidth);
                        list.classList.toggle("locale-parallel-off", itemWidth <= border);
                    }
                    list.classList.toggle("empty-list", length <= 0);
                }
            );
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
        export const onWindowFocus = () =>
        {
            updateWindow?.("focus");
        };
        export const onWindowBlur = () =>
        {
            updateWindow?.("blur");
        };
        let onUpdateStorageCount = 0;
        export const onUpdateStorage = () =>
        {
            const lastUpdate = OldStorage.lastUpdate = new Date().getTime();
            const onUpdateStorageCountCopy = onUpdateStorageCount = onUpdateStorageCount +1;
            setTimeout
            (
                () =>
                {
                    if (lastUpdate === OldStorage.lastUpdate && onUpdateStorageCountCopy === onUpdateStorageCount)
                    {
                        updateWindow?.("storage");
                    }
                },
                50,
            );
        };
        let isInComposeSession: boolean = false;
        let lastestCompositionEndAt = 0;
        export const onCompositionStart = (_event: CompositionEvent) =>
        {
            isInComposeSession = true;
        };
        export const onCompositionEnd = (_event: CompositionEvent) =>
        {
            isInComposeSession = false;
            lastestCompositionEndAt = new Date().getTime();
        };
        export const isComposing = (event: KeyboardEvent) =>
        {
            return event.isComposing || isInComposeSession || new Date().getTime() < lastestCompositionEndAt +100;
        };
        export const onKeydown = (event: KeyboardEvent) =>
        {
            if ( ! isComposing(event))
            {
                switch(event.key)
                {
                    case "Enter":
                        (Array.from(document.getElementsByClassName("popup")) as HTMLDivElement[])
                            .filter((_i, ix, list) => (ix +1) === list.length)
                            .forEach(popup => (Array.from(popup.getElementsByClassName("default-button")) as HTMLButtonElement[])?.[0]?.click());
                        break;
                    case "Escape":
                        (getScreenCover() ?? getCloseButton())?.click();
                        break;
                }
                const focusedElementTagName = document.activeElement?.tagName?.toLowerCase() ?? "";
                if (["input", "textarea"].indexOf(focusedElementTagName) < 0)
                {
                    switch(event.key.toLowerCase())
                    {
                        case "f":
                            if (fullscreenEnabled())
                            {
                                if(null === fullscreenElement())
                                {
                                    requestFullscreen();
                                }
                                else
                                {
                                    exitFullscreen();
                                }
                            }
                            break;
                    }
                }
            }
        };
        export const onFullscreenChange = (_event: Event) =>
        {
            onWindowResize();
        };
        export const onWebkitFullscreenChange = (_event: Event) =>
        {
            onWindowResize();
            if (0 <= navigator.userAgent.indexOf("iPad") || (0 <= navigator.userAgent.indexOf("Macintosh") && "ontouchend" in document))
            {
                document.body.classList.toggle("fxxking-ipad-fullscreen", fullscreenElement());
            }
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
        return result as Render.PageParams;
    };
    export const getUrlHash = (url: string = location.href) => url.replace(/[^#]*#?/, "");
    export const regulateUrl = (url: string) => url.replace(/#$/, "").replace(/\?$/, "");
    export const makeUrl =
    (
        args: Render.PageParams,
        href: string = location.href
    ) => regulateUrl
    (
        href
            .replace(/\?.*/, "")
            .replace(/#.*/, "")
            +"?"
            +Object.keys(args)
                .filter(i => undefined !== i)
                .filter(i => "hash" !== i)
                .map(i => `${i}=${encodeURIComponent(args[i])}`)
                .join("&")
            +`#${args["hash"] ?? ""}`
    );
    // export const makeUrl =
    // (
    //     args: {[key: string]: string},
    //     hash: string = getUrlHash(),
    //     href: string = location.href
    // ) =>
    //     href
    //         .replace(/\?.*/, "")
    //         .replace(/#.*/, "")
    //         +"?"
    //         +Object.keys(args).map(i => `${i}=${encodeURIComponent(args[i])}`).join("&")
    //         +`#${hash}`;
    // export const makeSharingUrl = (url: string = location.href) =>
    // {
    //     const urlParams = getUrlParams(url);
    //     if (undefined !== urlParams["pass"])
    //     {
    //         delete urlParams["pass"];
    //     }
    //     return makeUrl
    //     (
    //         urlParams,
    //         getUrlHash(url),
    //         url
    //     );
    // };
    export const updateStyle = () =>
    {
        const setting = Storage.SystemSettings.get().theme ?? "auto";
        const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark": "light";
        const theme = "auto" === setting ? system: setting;
        [ "light", "dark", ].forEach
        (
            i => document.body.classList.toggle(i, i === theme)
        );
    };
    export const start = async (params:{ buildTimestamp: string, buildTimestampTick:number, }) =>
    {
        console.log(`start timestamp: ${new Date()}`);
        console.log(`${JSON.stringify(params)}`);
        locale.setLocale(Storage.SystemSettings.get().locale ?? null);
        window.onpopstate = () => showPage();
        window.addEventListener('resize', Render.onWindowResize);
        window.addEventListener('focus', Render.onWindowFocus);
        window.addEventListener('blur', Render.onWindowBlur);
        window.addEventListener('storage', Render.onUpdateStorage);
        window.addEventListener('compositionstart', Render.onCompositionStart);
        window.addEventListener('compositionend', Render.onCompositionEnd);
        window.addEventListener('keydown', Render.onKeydown);
        minamo.core.existsOrThrow(document.getElementById("screen-header")).addEventListener
        (
            'click',
            async () =>
            {
                const body = minamo.core.existsOrThrow(document.getElementById("screen-body"));
                let top = body.scrollTop;
                for(let i = 0; i < 25; ++i)
                {
                    top *= 0.6;
                    body.scrollTo(0, top);
                    await minamo.core.timeout(10);
                }
                body.scrollTo(0, 0);
            }
        );
        document.addEventListener('fullscreenchange', Render.onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', Render.onWebkitFullscreenChange);
        window.matchMedia('(prefers-color-scheme: dark)').addListener(updateStyle);
        updateStyle();
        await Render.showUpdatingScreen(location.href);
        await showPage();
        if ("reload" === (<any>performance.getEntriesByType("navigation"))?.[0]?.type)
        {
            Render.makeToast
            ({
                content: Render.$span("")(`ビルドタイムスタンプ: ${Domain.dateStringFromTick(params.buildTimestampTick /Domain.timeAccuracy)} ( ${Domain.timeLongStringFromTick((new Date().getTime() - params.buildTimestampTick) /Domain.timeAccuracy)} 前 )`),
                isWideContent: true,
            });
        }
    };
    export const showPage = async (url: string = location.href, _wait: number = 0) =>
    {
        window.scrollTo(0,0);
        minamo.core.existsOrThrow(document.getElementById("screen-body")).scrollTo(0,0);
        //await minamo.core.timeout(wait);
        const urlParams = getUrlParams(url);
        const hash = getUrlHash(url);
        const tag = urlParams["tag"] ?? "";
        const todo = urlParams["todo"];
        const pass = urlParams["pass"] ?? `${OldStorage.sessionPassPrefix}:${new Date().getTime()}`;
        // const todo = JSON.parse(urlParams["todo"] ?? "null") as string[] | null;
        // const history = JSON.parse(urlParams["history"] ?? "null") as (number | null)[] | null;
        if (pass && todo)
        {
            console.log("show todo screen");
            await Render.showTodoScreen(pass, todo);
        }
        else
        if (OldStorage.isSessionPass(pass) && ! tag)
        {
            switch(hash)
            {
            case "import":
                console.log("show import screen");
                Render.showImportScreen();
                break;
            case "removed":
                console.log("show removed-list screen");
                Render.showRemovedListScreen();
                break;
            case "loading": // for debug only
                console.log("show loading screen");
                // await Render.showUpdatingScreen(url);
                break;
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
            case "history":
                console.log("show history screen");
                Render.showHistoryScreen
                (
                    urlParams,
                    {
                        tag,
                        pass,
                        todo: OldStorage.TagMember.get(pass, "@pickup" === tag ? "@pickup-all": tag),
                    }
                );
                break;
            // case "statistics":
            //     dom.updateStatisticsScreen(title, pass, todo);
            //     break;
            case "removed":
                console.log("show removed screen");
                Render.showRemovedScreen(pass);
                break;
            case "import":
                console.log("show import screen");
                Render.showImportScreen();
                break;
            case "export":
                console.log("show export screen");
                Render.showExportScreen(pass);
                break;
            default:
                if (0 <= OldStorage.Pass.get().indexOf(pass))
                {
                    console.log("show list screen");
                    Render.showListScreen(pass, tag, urlParams);
                }
                else
                {
                    await showUrl({ });
                }
                break;
            }
        }
    };
    export const showUrl = async (data: { pass?:string, tag?:string, todo?: string, hash?: string}) =>
    {
        const url = makeUrl(data);
        await showPage(url);
        history.pushState(null, applicationTitle, url);
    };
    export const reload = async () => await showPage(location.href, 600);
}
