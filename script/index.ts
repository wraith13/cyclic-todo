import { minamo } from "minamo.js";
import { FlounderStyle } from "flounder.style.js";
import config from "@resource/config.json";
import pomeJson from "@resource/poem.json";
import style from "@resource/style.json";
// import { smartConsole } from "./smart-console";
import { locale } from "./locale";
import resource from "@resource/images.json";
export const setLocale = (lang: locale.LocaleType | null) =>
{
    locale.setLocale(lang ?? navigator.language as locale.LocaleType);
    document.getElementById("manifest")?.setAttribute("lang", locale.getLocale());
    document.getElementById("manifest")?.setAttribute("href", `web.manifest/generated/${locale.getLocale()}.json`);
};
import keyboardShortcutsJson from "@resource/keyboard.shortcuts.json";
export const keyboardShortcuts = keyboardShortcutsJson as keyboardShortcutsItem[];
export type KeyboardShortcutsContext = "whenever" | "with filter" | "with list" | "with tag";
export type KeyboardShortcutsCategory = "general" | "move" | "config";
export type KeyboardShortcutsCategoryLocale = `KeyboardShortcutsCategory.${KeyboardShortcutsCategory}`
export const getKeyboardShortcutsCategoryLocale = (key: KeyboardShortcutsCategory) =>
    <KeyboardShortcutsCategoryLocale>`KeyboardShortcutsCategory.${key}`;
export interface keyboardShortcutsItem
{
    key: string[];
    message: locale.Label;
    context: KeyboardShortcutsContext;
    category: KeyboardShortcutsCategory;
    reverseWithShiftKey?: boolean;
}
export const makeObject = <T>(items: { key: string, value: T}[]) =>
{
    const result: { [key: string]: T} = { };
    items.forEach(i => result[i.key] = i.value);
    return result;
};
export const JsonHeader = "JSON:";
export const stringOrJson = <T>(text: string): string | T =>
    text.startsWith(JsonHeader) ? JSON.parse(text.substring(JsonHeader.length)): text;
export const simpleComparer = minamo.core.comparer.basic;
export const simpleReverseComparer = minamo.core.comparer.reverse(minamo.core.comparer.basic);
export const uniqueFilter = <T>(value: T, index: number, list: T[]) => index === list.indexOf(value);
export const takeFilter = (max: number) => <T>(_value: T, index: number) => index < max;
export const toPercentSting = (value: number) => value.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 });
export const isNumber = (value: unknown): value is number => "number" === typeof value;
export const isValidNumber = (value: unknown) => isNumber(value) && ! isNaN(value);
export const currentItem = <T>(list: T[], current: T): T | undefined => 0 <= list.indexOf(current) ? current: undefined;
export const nextItem = <T>(list: T[], current: T): T => list[(list.indexOf(current) +1) %list.length];
export const previousItem = <T>(list: T[], current: T): T => list[(list.indexOf(current) +(list.length -1)) %list.length];
export const groupBy = <T, G>(list: T[], getGroup: (i: T) => G): { group: G, list: T[], }[] =>
    list.map(i => getGroup(i)).filter(uniqueFilter).map(group => ({ group, list: list.filter(i => group === getGroup(i))}));
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
    export const tickFromStandardScore = (average: number, standardDeviation: number, target: number) =>
        ((target -50) /10 *standardDeviation) +average;
    
    export const averageFactors = (span: number, count: number): CyclicToDo.AverageFactors =>
    {
        const average = span /count;
        const first = CyclicToDo.Domain.roundingScalePreset.filter(i => i *0.8 < average)[0];
        const rounding = Math.max(Math.floor(average /first) *first, first);
        const offset = span -(rounding *count);
        const result: CyclicToDo.AverageFactors =
        {
            rounding,
            offset,
        };
        return result;
    };
}
export module CyclicToDo
{
    export const applicationTitle = config.applicationTitle;
    export type ThemeType = "auto" | "light" | "dark";
    export type ThemeTypeLocale = `theme.${ThemeType}`
    export const getThemeLocale = (key: ThemeType) => <ThemeTypeLocale>`theme.${key}`;
    export type FlashStyleType = "gradation" | "breath" | "solid" | "none";
    export type FlashStyleTypeLocale = `flashStyle.${FlashStyleType}`
    export const getFlashStyleLocale = (key: FlashStyleType) => <FlashStyleTypeLocale>`flashStyle.${key}`;
    export type AnimationDurationType = "none" | "1m" | "10m" | "1h" | "auto" | "ever";
    export const getAnimationDurationOrDefaut = (settings: AnimationDurationType | { animationDuration?: AnimationDurationType } | undefined | null = Storage.SystemSettings.get()) =>
        "string" === typeof settings ?
            settings:
            (settings?.animationDuration ?? "none");
    export type AnimationDurationTypeLocale = `animationDuration.${AnimationDurationType}`
    export const getAnimationDurationLocale = (key?: AnimationDurationType) => <AnimationDurationTypeLocale>`animationDuration.${getAnimationDurationOrDefaut(key)}`;
    export type UiStyleType = "slide" | "fade" | "fixed";
    export type UiStyleTypeLocale = `uiStyle.${UiStyleType}`
    export const getUiStyleLocale = (key: UiStyleType) => <UiStyleTypeLocale>`uiStyle.${key}`;
    export type EmojiType = "auto" | "system" | "noto-emoji";
    export type EmojiTypeLocale = `emoji.${EmojiType}`
    export const getEmojiTypeLocale = (key: EmojiType) => <EmojiTypeLocale>`emoji.${key}`;
    export interface SystemLocalDb extends minamo.core.JsonableObject
    {
        latestShowUrl?: string;
    }
    export interface SystemSettings extends minamo.core.JsonableObject
    {
        theme?: ThemeType;
        uiStyle?: UiStyleType;
        flashStyle?: FlashStyleType;
        animationDuration?: AnimationDurationType;
        locale?: locale.LocaleType;
        emoji?: EmojiType;
    }
    export interface TermThreshold extends minamo.core.JsonableObject
    {
        maxShortTermTimespan?: number,
        maxMediumTermTimespan?: number,
    }
    export interface ListSettings extends minamo.core.JsonableObject
    {
        sort?: "smart" | "simple" | "simple-reverse";
        displayStyle?: "full" | "digest" | "simple" | "compact";
        progressScaleStyle?: "none" | "full";
        termThreshold?: TermThreshold;
        autoTagSettings?: AutoTagSettings;
    }
    export interface ToDoTagEntryOld extends minamo.core.JsonableObject
    {
        pass: string;
        tag: string;
        todo: string[];
    }
    export interface AverageFactors extends minamo.core.JsonableObject
    {
        rounding: number;
        offset: number;
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
        RecentlyAverageFactors: null | AverageFactors;
        TotalAverage: null | number;
        TotalAverageFactors: null | AverageFactors;
        smartRest: null | number;
        count: number;
        expectedInterval: null | { min: number; max: number; };
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
        RecentlyAverageFactors: null;
        TotalAverage: null;
        TotalAverageFactors: null;
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
        RecentlyAverageFactors: null;
        TotalAverage: null;
        TotalAverageFactors: null;
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
        RecentlyAverageFactors: AverageFactors;
        TotalAverage: number;
        TotalAverageFactors: AverageFactors;
        smartRest: null | number;
        expectedInterval: { min: number; max: number; };
    }
    export const isZeroToDoEntry = (item: ToDoEntry): item is ToDoEntryZero =>
        item.count <= 0 || "number" !== typeof item.first;
    export const isFirstOrMoreToDoEntry = (item: ToDoEntry): item is ToDoEntryFirst | ToDoEntryMore =>
        1 <= item.count && "number" === typeof item.first;
    export const isMoreToDoEntry = (item: ToDoEntry): item is ToDoEntryMore =>
        2 <= item.count && "number" === typeof item.first && "number" === typeof item.previous && item.first !== item.previous;
    export interface TagSettings extends minamo.core.JsonableObject
    {
        sort?: "smart" | "simple" | "simple-reverse";
        displayStyle?: "full" | "digest" | "simple" | "compact";
        progressScaleStyle?: "none" | "full";
        autoTagSettings?: AutoTagSettings;
    }
    export interface AutoTagConditionBase extends minamo.core.JsonableObject
    {
        type: AutoTagCondition["type"];
    }
    export interface AutoTagConditionNever extends AutoTagConditionBase
    {
        type: "never";
    }
    export interface AutoTagConditionAlways extends AutoTagConditionBase
    {
        type: "always";
    }
    export interface AutoTagConditionElapsedTime extends AutoTagConditionBase
    {
        type: "elapsed-time";
        elapsedTime: number;
    }
    export interface AutoTagConditionElapsedTimeStandardScore extends AutoTagConditionBase
    {
        type: "elapsed-time-standard-score";
        elapsedTimeStandardScore: number;
    }
    export interface AutoTagConditionExpired extends AutoTagConditionBase
    {
        type: "expired";
    }
    export type AutoTagConditionContext = "list" | "sublist" | "root-todo" | "sublist-todo";
    export type AutoTagCondition = AutoTagConditionNever | AutoTagConditionAlways | AutoTagConditionElapsedTime | AutoTagConditionElapsedTimeStandardScore | AutoTagConditionExpired;
    export interface AutoTagSettings extends minamo.core.JsonableObject
    {
        flash?: AutoTagCondition;
        pickup?: AutoTagCondition;
        restriction?: AutoTagCondition;
    }
    export interface TodoSettings extends AutoTagSettings
    {
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
        settings: ListSettings;
        todos: string[];
        tags: { [tag: string]: string[] };
        tagSettings: { [tag: string]: TagSettings };
        todoSettings: { [tag: string]: TodoSettings };
        histories: { [todo: string]: HistoryEntry };
        removed: RemovedType[];
    }
    export interface RemovedContent extends Content
    {
        deteledAt: number;
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
    export const isRemovedTag = (value: RemovedType): value is RemovedTag => "Tag" === value.type;
    export interface RemovedSublist extends RemovedBase
    {
        type: "Sublist";
        name: string;
        tasks: RemovedTask[];
        settings: TagSettings;
    }
    export const isRemovedSublist = (value: RemovedType): value is RemovedSublist => "Sublist" === value.type;
    export interface RemovedTask extends RemovedBase
    {
        type: "Task";
        name: string;
        tags: string[];
        settings?: TodoSettings;
        ticks: HistoryEntry;
    }
    export const isRemovedTask = (value: RemovedType): value is RemovedTask => "Task" === value.type;
    export interface RemovedTick extends RemovedBase
    {
        type: "Tick";
        task: string;
        tick: number;
    }
    export const isRemovedTick = (value: RemovedType): value is RemovedTick => "Tick" === value.type;
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
            const settings = ListSettings.get(pass);
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
                settings,
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
                    "object" === typeof data.settings &&
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
                    ListSettings.set(data.pass, data.settings);
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
                // JSON parse error
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
            export const decay = (expire = Domain.getTicks() -Domain.removedItemExpire) =>
            {
                const oldList = get();
                const newList = oldList.filter(i => expire < (JSON.parse(i) as RemovedContent).deteledAt);
                const result = oldList.length !== newList.length;
                if (result)
                {
                    set(newList);
                }
                return result;
            }
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
                const data: RemovedContent = JSON.parse(exportJson(pass));
                data.deteledAt = Domain.getTicks();
                Backup.add(JSON.stringify(data));
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
                getStorage(pass).getOrNull<string>(makeKey(pass)) ?? locale.map("ToDo List");
            export const set = (pass: string, title: string) =>
                getStorage(pass).set(makeKey(pass), title);
        }
        export module ListSettings
        {
            export const makeKey = (pass: string) => `pass:(${pass}).settings`;
            export const get = (pass: string) =>
                getStorage(pass).getOrNull<ListSettings>(makeKey(pass)) ?? { };
            export const set = (pass: string, settings: ListSettings) =>
                getStorage(pass).set(makeKey(pass), settings);
            export module TermThreshold
            {
                export const get = (pass: string) =>
                    ListSettings.get(pass).termThreshold ?? { };
                export const set = (pass: string, settings: TermThreshold) =>
                {
                    const listSettings = ListSettings.get(pass);
                    listSettings.termThreshold = settings;
                    ListSettings.set(pass, listSettings);
                };
                export const getMaxShortTermTimespan = (pass: string) =>
                    (ListSettings.get(pass).termThreshold ?? { }).maxShortTermTimespan ?? Domain.maxShortTermMinutes;
                export const setMaxShortTermTimespan = (pass: string, maxShortTermTimespan: number) =>
                {
                    const termThreshold = TermThreshold.get(pass);
                    termThreshold.maxShortTermTimespan = maxShortTermTimespan;
                    TermThreshold.set(pass, termThreshold);
                };
                export const getMaxMediumTermTimespan = (pass: string) =>
                    (ListSettings.get(pass).termThreshold ?? { }).maxMediumTermTimespan ?? Domain.maxMediumTermMinutes;
                export const setMaxMediumTermTimespan = (pass: string, maxMediumTermTimespan: number) =>
                {
                    const termThreshold = TermThreshold.get(pass);
                    termThreshold.maxMediumTermTimespan = maxMediumTermTimespan;
                    TermThreshold.set(pass, termThreshold);
                };
            }
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
                Render.getTagList({ auto: true, term: true, })
                    .concat(get(pass))
                    .concat(["@untagged", "@unoverall"])
                    .filter(tag => 0 < TagMember.get(pass, tag).filter(i => todo === i).length)
                    .sort
                    (
                        minamo.core.comparer.make
                        (
                            tag =>
                                Model.isSystemTagOld(tag) ?
                                    ("@overall" === tag ? 0: 3):
                                    Model.isSublistOld(tag) ? 1: 2
                        )
                    );
            export const getByTodoRaw = (pass: string, todo: string) =>
                Render.getTagList({ overall: true, auto: true, term: true, })
                    .concat(get(pass))
                    .concat(["@untagged", "@unoverall"])
                    .filter(tag => 0 < TagMember.getRaw(pass, tag).filter(i => todo === i).length);
            export const rename = (pass: string, oldTag: string, newTag: string) =>
            {
                if (0 < newTag.length && ! Model.isSystemTagOld(oldTag) && ! Model.isSystemTagOld(newTag) && oldTag !== newTag && get(pass).indexOf(newTag) < 0)
                {
                    add(pass, newTag);
                    const member = TagMember.get(pass, oldTag);
                    if (Model.isSublistOld(newTag))
                    {
                        member.forEach
                        (
                            i =>
                            {
                                const task = OldStorage.Task.getBody(i);
                                const result = `${newTag}${task}`;
                                OldStorage.Task.rename(pass, i, result);
                            }
                        );
                    }
                    else
                    {
                        TagMember.set(pass, newTag, member);
                    }
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
                case "@regular":
                    return getRaw(pass, "@overall").filter(i => null === TagMember.getAutoTag(pass, i));
                case "@untagged":
                    {
                        const tagged = Tag.get(pass).map(tag => get(pass, tag)).reduce((a, b) => a.concat(b), []);
                        return getRaw(pass, "@overall").filter(i => tagged.indexOf(i) < 0);
                    }
                case "@:@root":
                    return getRaw(pass, "@overall").filter(i => null === OldStorage.Task.getSublist(i));
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
                        const renamedTodo = `${tag}${Task.getBody(todo)}`;
                        Task.rename(pass, todo, renamedTodo);
                        return renamedTodo;
                    }
                }
                else
                {
                    set(pass, tag, get(pass, tag).concat([ todo ]).filter(uniqueFilter));
                    // if ("@unoverall" === tag)
                    // {
                    //     OldStorage.TagMember.remove(pass, "@overall", todo);
                    // }
                }
                return todo;
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
                    // if ("@unoverall" === tag)
                    // {
                    //     OldStorage.TagMember.add(pass, "@overall", todo);
                    // }
                }
            };
            export const isMember = (pass: string, tag: string, todo: string) => 0 <= get(pass, tag).indexOf(todo);
            export const isRestrictionTask = (pass: string, todo: string) => isMember(pass, "@restriction", todo);
            export const isPickupTask = (pass: string, todo: string) => isMember(pass, "@pickup", todo);
            export const isFlashTask = (pass: string, todo: string) => isMember(pass, "@flash", todo);
            export const getAutoTag = (pass: string, todo: string) =>
                <"@restriction" | "@flash" | "@pickup" | null>([ "@restriction", "@flash", "@pickup", ].filter(i => isMember(pass, i, todo))[0] ?? null);
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
            export const getDisplayStyle = (pass: string, tag: string): Exclude<TagSettings["displayStyle"], "@list"> =>
            {
                const defaultResult = "full";
                const result = currentItem<TagSettings["displayStyle"] | "@list">([ "@list", "full", "digest", "simple", "compact" ], get(pass, tag).displayStyle) ?? "@list";
                return "@list" !== result ?
                    result:
                    (ListSettings.get(pass)?.displayStyle ?? defaultResult);
            };
            export const getProgressScaleStyle = (pass: string, tag: string): "none" | "full" =>
            {
                const defaultResult = "none";
                const result = get(pass, tag).progressScaleStyle ?? "@list";
                return "@list" !== result ?
                    result:
                    (ListSettings.get(pass)?.progressScaleStyle ?? defaultResult);
            }
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
            export const isRoot = (task: string) => null === getSublist(task);
            export const getBody = (task: string) =>
            {
                const split = task.split("@:");
                return 2 <= split.length ? split[split.length -1]: task;
            };
            export const add = (pass: string, task: string) =>
            {
                OldStorage.TagMember.add(pass, "@overall", task);
            };
            export const isExist = (pass: string, task: string, tag?: string): boolean =>
            {
                if ("string" === typeof tag && Model.isSublistOld(tag))
                {
                    const taskFullname = `${tag}${Task.getBody(task)}`;
                    return isExist(pass, taskFullname);
                }
                else
                {
                    return 0 <= TagMember.getRaw(pass, "@overall").indexOf(task);
                }
            };
            export const rename = (pass: string, oldTask: string, newTask: string) =>
            {
                if (0 < newTask.length && oldTask !== newTask && ! isExist(pass, newTask))
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
            export const getEvaluatedAutoTagSettings = (pass: string, task: string): AutoTagSettings =>
            {
                const listSettigs = ListSettings.get(pass)?.autoTagSettings;
                const sublist = Task.getSublist(task);
                const sublistSettings = null === sublist ? listSettigs: TagSettings.get(pass, sublist).autoTagSettings;
                const todoSettings = get(pass, task);
                const result: AutoTagSettings =
                {
                    flash: todoSettings?.flash ?? sublistSettings?.flash ?? listSettigs?.flash,
                    pickup: todoSettings?.pickup ?? sublistSettings?.pickup ?? listSettigs?.pickup,
                    restriction: todoSettings?.restriction ?? sublistSettings?.restriction ?? listSettigs?.restriction,
                };
                return result;
            };
            export const isFlashTarget = (pass: string, item: ToDoEntry, elapsedTime = item.elapsed) =>
            {
                const flashSetting = getEvaluatedAutoTagSettings(pass, item.task)?.flash;
                if (flashSetting)
                {
                    switch(flashSetting.type)
                    {
                    case "never":
                        return false;
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
                const pickupSetting = getEvaluatedAutoTagSettings(pass, item.task)?.pickup;
                if (pickupSetting)
                {
                    switch(pickupSetting.type)
                    {
                    case "never":
                        return false;
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
                const restrictionSetting = getEvaluatedAutoTagSettings(pass, item.task)?.restriction;
                if (restrictionSetting)
                {
                    switch(restrictionSetting.type)
                    {
                    case "never":
                        return false;
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
            export const getAutoTag = (pass: string, item: ToDoEntry, elapsedTime = item.elapsed) =>
            {
                if (isRestrictionTarget(pass, item, elapsedTime))
                {
                    return "@restriction";
                }
                if (isFlashTarget(pass, item, elapsedTime))
                {
                    return "@flash";
                }
                if (isPickupTarget(pass, item, elapsedTime))
                {
                    return "@pickup";
                }
                return null;
            }
            export const hasAutoTagSettings = (pass: string, task: string) =>
            {
                const settings = get(pass, task);
                return null !== (settings?.flash ?? null) || null !== (settings?.pickup ?? null) || null !== (settings?.restriction ?? null);
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
                        histories: raw.filter(takeFilter(config.maxHistories)), // splice を使うと正しい count を取得し損ねるので、ここは filter にしている。
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
            export const decay = (pass: string, expire = Domain.getTicks() -Domain.removedItemExpire) =>
            {
                const oldList = getRaw(pass);
                const newList = oldList.filter(i => expire < (JSON.parse(i) as RemovedType).deteledAt);
                const result = oldList.length !== newList.length;
                if (result)
                {
                    set(pass, newList);
                }
                return result;
            }
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
        export module System
        {
            export const makeKey = () => `system`;
            export const get = () =>
                minamo.localStorage.getOrNull2<CyclicToDo.SystemLocalDb>(makeKey()) ?? { };
            export const set = (settings: CyclicToDo.SystemLocalDb) =>
                minamo.localStorage.set2(makeKey(), settings);
            export const getLatestShowUrl = () => get().latestShowUrl;
            export const setLatestShowUrl = (latestShowUrl?: string) =>
            {
                const system = get();
                system.latestShowUrl = latestShowUrl;
                set(system);
                return latestShowUrl;
            };
        }
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
                        .filter(takeFilter(30))
                );
            };
        }
        export module Timespan
        {
            export const key = `timespan.recently`;
            export const get = () => minamo.localStorage.getOrNull<number[]>(key) ?? [];
            export const set = (timespanList: number[]) => minamo.localStorage.set(key, timespanList);
            export const add = (timespan: number) =>
            {
                set
                (
                    [ timespan ].concat(get())
                        .filter(uniqueFilter)
                        .filter(takeFilter(config.timespanPresetMaxCount))
                );
            };
        }
        export module TimespanStandardScore
        {
            export const key = `timespan-standardscore.recently`;
            export const get = () => minamo.localStorage.getOrNull<number[]>(key) ?? [];
            export const set = (timespanList: number[]) => minamo.localStorage.set(key, timespanList);
            export const add = (timespan: number) =>
            {
                set
                (
                    [ timespan ].concat(get())
                        .filter(uniqueFilter)
                        .filter(takeFilter(config.timespanStandardScorePresetMaxCount))
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
        export const isHomeOld = (tag: string) => "@overall" === tag;
        export const isSystemTagOld = (tag: string) => tag.startsWith("@") && ! tag.startsWith("@=") && ! isSublistOld(tag);
        export const isSublistOld = (tag: string) => "@:@root" === tag || tag.endsWith("@:");
        export type TagCategory = "home" | "tag" | "sublist";
        export const getTagCategory = (tag: string): TagCategory =>
            isHomeOld(tag) ? "home":
            isSublistOld(tag) ? "sublist":
            "tag";
        export const encode = (tag: string) => tag.replace(/@/g, "@=");
        export const encodeSublist = (tag: string) => encode(tag) +"@:";
        export const decode = (tag: string) => tag.replace(/@\:/g, ": ").replace(/@=/g, "@");
        export const decodeSublist = (tag: string) => decode(tag.replace(/@\:$/, ""));
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
            // addMember = (task: Task) => this.document.tagMember.add(this, task);
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
            getTagsRaw = () => this.document.tag.getByTaskRaw(this);
            getTags = () => this.document.tag.getByTask(this);
            // rename = (newName: string) =>
            // {
            //     const newTask = new Task(this.document, newName);
            //     if (0 < newTask.getName().length && this.getName() !== newTask.getName() && TagMember.getRaw(pass, "@overall").indexOf(newTask) < 0)
            //     {
            //         const oldSublist = this.getSublist();
            //         const newSublist = newTask.getSublist();
            //         this.getTagsRaw().forEach
            //         (
            //             tag =>
            //             {
            //                 tag.remove(this);
            //                 if ( ! tag.isSublist() || oldSublist === newSublist)
            //                 {
            //                     tag.add(newTask);
            //                 }
            //             }
            //         );
            //         if (null !== newSublist && oldSublist !== newSublist)
            //         {
            //             newSublist.add(newTask);
            //         }
            //         History.set(pass, newTask, History.get(pass, oldTask));
            //         History.removeKey(pass, oldTask);
            //         return true;
            //     }
            //     return false;
            // }
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

            getTermCategory = (item: ToDoEntry) =>
            null !== item.smartRest && null !== item.RecentlySmartAverage ?
                (
                    item.RecentlySmartAverage < (this.content.settings?.termThreshold?.maxShortTermTimespan ?? Domain.maxShortTermMinutes) ?
                        "@short-term":
                        (
                            item.RecentlySmartAverage < (this.content.settings?.termThreshold?.maxMediumTermTimespan ?? Domain.maxMediumTermMinutes) ?
                                "@medium-term":
                                "@long-term"
                        )
                ):
                "@irregular-term";

            updateTermCategory = (item: ToDoEntry) =>
            {
                // 🔥 ここでイチイチ save するのはナンセンスだけど、 save しておかないと差分チェックの邪魔になる、、、
                // 🤔 "@short-term", "@long-term", "@irregular-term"　のタグメンバーは this.live に持たせるかねぇ、、、
                const term = this.getTermCategory(item);
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
                // singleCommit: async (updator: updator_type) => this.transaction.make().add(updator).commit(),
            };
            title =
            {
                get: () =>
                    this.content.title ?? locale.map("ToDo List"),
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
                    .concat([ "@untagged", "@unoverall", ].map(i => this.tag.get(i)))
                    .filter(tag => 0 < tag.getMember().filter(i => task.getName() === i.getName()).length)
                    .sort(minamo.core.comparer.make(tag => tag.isSublist() ? 0: 1)),
                getByTaskRaw: (task: Task) =>
                    ["@overall", "@flash", "@pickup", "@restriction", "@short-term", "@medium-term", "@long-term", "@irregular-term"].map(i => this.tag.get(i))
                    .concat(this.tag.getList())
                    .concat([ "@untagged", "@unoverall",].map(i => this.tag.get(i)))
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
                    case "@:@root":
                        return tag.getRawMember().filter(i => null === i.getSublist());
                    case "@unoverall":
                    default:
                        return tag.isSublist() ?
                            new Tag(this, "@overall").getRawMember().filter(i => tag.getName() === i.getSublist()?.getName()):
                            tag.getRawMember();
                    }
                },
                set: (tag: Tag, list: Task[]) => this.save(content => content.tags[tag.getName()] = list.map(i => i.getName())),
                // add: (tag: Tag, task: Task) =>
                // {
                //     if (tag.isSublist())
                //     {
                //         if (tag.getName() !== task.getSublist().getName())
                //         {
                //             return task.rename(`${tag}${task.getBody()}`);
                //         }
                //     }
                //     else
                //     {
                //         return this.tagMember.set(tag, this.tagMember.get(tag).concat([ task ]).filter(uniqueFilter));
                //     }
                //     return null;
                // }
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
        export const removeList = (pass: string | Model.Document) =>
            "string" === typeof pass ?
                OldStorage.Pass.remove(pass):
                pass.remove();
    }
    export module Domain
    {
        // export const merge = (pass: string, tag: string, todo: string[], _ticks: (number | null)[]) =>
        // {
        //     Storage.Pass.add(pass);
        //     Storage.Tag.add(pass, tag);
        //     Storage.TagMember.merge(pass, tag, todo);
        //     // const temp: { [task: string]: number[]} = { };
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
        export const minuteUnit = 60 *1000;
        export const hourUnit = 60 *minuteUnit;
        export const dayUnit = 24 *hourUnit;
        export const yearUnit = 365.2425 *dayUnit;
        export const timeAccuracy = minamo.core.parseTimespan(config.timeAccuracy) ?? minuteUnit;
        export const standardDeviationRate = config.standardDeviationRate;
        export const granceTime = (minamo.core.parseTimespan(config.granceTimespan) ?? dayUnit) / timeAccuracy;
        export const maxRestAdjustTime = (minamo.core.parseTimespan(config.maxRestAdjustTimespan) ?? (3 *hourUnit)) / timeAccuracy;
        export const maxShortTermMinutes = (minamo.core.parseTimespan(config.maxShortTermTimespan) ?? (6 *dayUnit)) / minuteUnit;
        export const maxMediumTermMinutes = (minamo.core.parseTimespan(config.maxMediumTermTimespan) ?? (15 *dayUnit)) / minuteUnit;
        export const removedItemExpire = (minamo.core.parseTimespan(config.removedItemExpire) ?? (30 *dayUnit)) / minuteUnit;
        export const getTicks = (date: Date = new Date()) => Math.floor(date.getTime() / timeAccuracy);
        export const roundingScalePreset = config.roundingScalePreset
            .map(i => minamo.core.parseTimespan(i))
            .filter(isNumber)
            .map(i => i / Domain.timeAccuracy)
            .sort(simpleReverseComparer);
        export const tickScalePreset = config.tickScalePreset
            .map(i => minamo.core.parseTimespan(i))
            .filter(isNumber)
            .map(i => i / Domain.timeAccuracy)
            .sort(simpleReverseComparer);
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
        export const dayStringFromTick = (tick: null | number) =>
        {
            if (null === tick)
            {
                return "N/A";
            }
            else
            {
                const date = new Date(tick *timeAccuracy);
                return locale.map(`week.short.${date.getDay()}` as locale.Label);
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
            if (tick *timeAccuracy < dayUnit)
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
                return `${dateCoreStringFromTick(tick)}(${dayStringFromTick(tick)}) ${timeCoreStringFromTick(getTime(tick))}`;
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
        export const timeSimpleStringFromTick = (tick: null | number): string =>
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
                if (days < 1)
                {
                    return timeCoreStringFromTick(tick);
                }
                else
                if (days < 10)
                {
                    const daysSymbol = (1.1).toLocaleString().replace(/\d/g, "");
                    return `${days.toLocaleString()}${daysSymbol}${timeCoreStringFromTick(tick)}`;
                }
                else
                {
                    return `${days.toLocaleString()} ${locale.map("days")}`;
                }
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
        export function parseTimeSpan(time: null): null;
        export function parseTimeSpan(time: string | null): number | null;
        export function parseTimeSpan(time: string | null): number | null
        {
            if (null !== time)
            {
                try
                {
                    return (Date.parse(`2023-01-01T${time}`) -Date.parse(`2023-01-01T00:00`)) /timeAccuracy;
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
            case "@:@root":
            case "@overall":
            case "@unoverall":
            case "@flash":
            case "@pickup":
            case "@regular":
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
                return Model.decodeSublist(tag);
            }
        };
        export const getStandardScore = (item: ToDoEntry, elapsedTime = item.elapsed) =>
            null !== item.RecentlySmartAverage &&
            null !== item.RecentlyStandardDeviation &&
            null !== elapsedTime ?
                Calculate.standardScore(item.RecentlySmartAverage, item.RecentlyStandardDeviation, elapsedTime):
                null;
        export const tickFromStandardScore = (item: ToDoEntry, standardScore: number) =>
            null !== item.RecentlySmartAverage &&
            null !== item.RecentlyStandardDeviation &&
            null !== standardScore ?
                Calculate.tickFromStandardScore(item.RecentlySmartAverage, item.RecentlyStandardDeviation, standardScore):
                null;
        export const getAutoTagConditionElapsedTime = (item: ToDoEntry, setting?: AutoTagCondition): number | null =>
        {
            if (setting)
            {
                switch(setting.type)
                {
                case "always":
                    return 0;
                case "elapsed-time":
                    return setting.elapsedTime;
                case "elapsed-time-standard-score":
                    return tickFromStandardScore(item, setting.elapsedTimeStandardScore);
                case "expired":
                    return item.expectedInterval?.max ?? Infinity;
                }
            }
            return null;
        }
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
            // tag => -OldStorage.TagMember.get(pass, tag).map(todo => OldStorage.History.getTicks(pass, todo).length).reduce((a, b) => a +b, 0)
            tag => -OldStorage.TagMember.get(pass, tag).map(todo => getToDoEntryOld(pass, todo).count).reduce((a, b) => a +b, 0)
        );
        export const todoComparerSmartBaseOld = (entry: ToDoTagEntryOld): minamo.core.comparer.ComparerType<ToDoEntry> =>
            minamo.core.comparer.make<ToDoEntry>
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
        export const todoComparerOld = (entry: ToDoTagEntryOld, sort = OldStorage.TagSettings.getSort(entry.pass, entry.tag)): minamo.core.comparer.ComparerType<ToDoEntry> =>
        {
            switch(sort)
            {
                case "smart":
                    return minamo.core.comparer.make<ToDoEntry>
                    ([
                        item => 0 < (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ? -1: 1,
                        item => 0 < (item.progress ?? 0) || item.isDefault || (item.smartRest ?? 1) <= 0 ?
                            Math.min(item.smartRest ?? 1, 0):
                            -(item.progress ?? -1),
                        item => config.autoTagSortOrder
                            .indexOf(OldStorage.TodoSettings.getAutoTag(entry.pass, item) ?? "default"),
                        { raw: todoComparerSmartBaseOld(entry), },
                    ]);
                case "simple":
                    return minamo.core.comparer.make<ToDoEntry>
                    ([
                        item => item.previous ?? 0,
                        item => item.count,
                        item => entry.todo.indexOf(item.task),
                        item => item.task,
                    ]);
                case "simple-reverse":
                    return minamo.core.comparer.reverse(todoComparerOld(entry, "simple"));
                default:
                    return todoComparerOld(entry, "smart");
            }
        };
        export const getTermCategoryByAverage = (pass: string, item: ToDoEntry) =>
            null !== item.smartRest && null !== item.RecentlySmartAverage ?
                (
                    item.RecentlySmartAverage < OldStorage.ListSettings.TermThreshold.getMaxShortTermTimespan(pass) ?
                        "@short-term":
                        (
                            item.RecentlySmartAverage < OldStorage.ListSettings.TermThreshold.getMaxMediumTermTimespan(pass) ?
                                "@medium-term":
                                "@long-term"
                        )
                ):
                "@irregular-term";
        export const getTermCategoryByRest = (item: ToDoEntry) =>
            null !== item.progress && null !== item.smartRest && null !== item.rest ?
                (
                    item.rest < 24 *60 ?
                        "@short-term":
                        "@long-term"
                ):
                "@irregular-term";
        export const getTermCategory = getTermCategoryByAverage;
        export const updateTermCategoryOld = (pass: string, item: ToDoEntry) =>
        {
            const term = getTermCategory(pass, item);
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
                            // todo 毎の history 画面では config.granceMinutes を使うが、ここでは予想間隔の精度の都合から使わない。 ( 整合性が無くなるが、特にそれでなんの影響も無いので気にしない。 )
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
                intervals.filter((_, ix) => ix < 5).concat(intervals.filter(takeFilter(10)), intervals):
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
                RecentlyAverageFactors: history.intervals.length <= 0 ?
                    null:
                    Calculate.averageFactors(Calculate.sum(longRecentries.filter((_, index) => index < 10)) as number, Math.min(longRecentries.length, 10)),
                TotalAverage: isSecondOrMoreHistryEntry(full) ?
                    (getPreviousFromHistryEntry(full) -full.first) / (full.count -1):
                    null,
                TotalAverageFactors: isSecondOrMoreHistryEntry(full) ?
                    Calculate.averageFactors(getPreviousFromHistryEntry(full) -full.first, full.count -1):
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
        export const calcProgress = (item: ToDoEntry, elapsed: number | null = item.elapsed) =>
        {
            if (isMoreToDoEntry(item) && "number" === typeof elapsed)
            {
                const short = item.expectedInterval.min;
                const long = item.expectedInterval.max;
                const shortOneThird = short /3.0;
                if (elapsed < shortOneThird)
                {
                    return elapsed /short;
                }
                else
                if (elapsed < long)
                {
                    return (1.0 /3.0) +(((elapsed -shortOneThird) /(long -shortOneThird)) *2.0 /3.0);
                }
                else
                {
                    return 1.0 +((item.elapsed -long) /item.RecentlySmartAverage);
                }
            }
            return null;
        }
        export const updateAutoTag = (pass: string, item: ToDoEntry) =>
        {
            const autoTag = OldStorage.TodoSettings.getAutoTag(pass, item);
            const autoTagged = OldStorage.TagMember.getAutoTag(pass, item.task);
            if (autoTagged !== autoTag)
            {
                if (null !== autoTag)
                {
                    OldStorage.TagMember.add(pass, autoTag, item.task);
                }
                if (null !== autoTagged)
                {
                    OldStorage.TagMember.remove(pass, autoTagged, item.task);
                }
                Render.updateScreen?.("dirty");
            }
        };
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
                    item.progress = calcProgress(item);
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
                updateAutoTag(pass, item);
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
            export const renameList = async (pass: string | Model.Document, newName: string, onCanceled: () => unknown = () => updateScreen("operate")) =>
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
                    content: $span("")(`${locale.map("ToDo list has been renamed!")}: ${backup} → ${newName}`),
                    backwardOperator: cancelTextButton
                    (
                        async () =>
                        {
                            toast.hide(); // nowait
                            await withUpdateProgress
                            (
                                $span("")(locale.map("Storing")),
                                new MigrateBridge.Transaction(pass)
                                    .add(MigrateBridge.Title.updator(pass, backup))
                                    .commit()
                            );
                            onCanceled();
                        }
                    ),
                });
            };
            export const removeList = async (pass: string | Model.Document, onCanceled: () => unknown = () => updateScreen("operate")) =>
            {
                const list = JSON.parse(MigrateBridge.exportJson(pass));
                OldStorage.Pass.remove(list.pass);
                const toast = makeToast
                ({
                    content: $span("")(`${locale.map("ToDo list has been deleted!")}: ${list.title}`),
                    backwardOperator: cancelTextButton
                    (
                        async () =>
                        {
                            OldStorage.importJson(JSON.stringify(list));
                            toast.hide(); // nowait
                            onCanceled();
                        }
                    ),
                });
            };
            export let flashBodyAt: undefined | number;
            export const flashBody = () =>
            {
                // document.body.classList.add("flash");
                // setTimeout(() => document.body.classList.remove("flash"), 1500);
                updateLatestScreenOperatedAt();
                flashBodyAt = -1;
            };
            export const done = async (pass: string, item: ToDoEntry, tick: number, onCanceled: () => unknown) =>
            {
                flashBody();
                MigrateBridge.done(pass, item.task, tick);
                Domain.updateProgress(pass, item);
                if (window.navigator.vibrate)
                {
                    window.navigator.vibrate(50);
                }
                const toast = makeToast
                ({
                    forwardOperator: textButton
                    (
                        "Edit",
                        async () =>
                        {
                            toast.hide(); // nowait
                            const result = Domain.parseDate(await dateTimePrompt(`${locale.map("Edit")}: ${Model.decode(item.task)}`, tick));
                            if (null !== result && tick !== Domain.getTicks(result) && 0 <= Domain.getTicks(result) && Domain.getTicks(result) <= Domain.getTicks())
                            {
                                OldStorage.History.removeTickRaw(pass, item.task, tick);
                                OldStorage.History.addTick(pass, item.task, Domain.getTicks(result));
                                await reload();
                            }
                        }
                    ),
                    content: $span("")(`${locale.map("Done!")}: ${Model.decode(item.task)}`),
                    backwardOperator: cancelTextButton
                    (
                        async () =>
                        {
                            OldStorage.History.removeTickRaw(pass, item.task, tick); // ごみ箱は利用せずに直に削除
                            Domain.updateProgress(pass, item);
                            toast.hide(); // nowait
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
                    content: $span("")(locale.map("Filter history cleared.")),
                    backwardOperator: cancelTextButton
                    (
                        async () =>
                        {
                            Storage.Filter.set(backup);
                            toast.hide(); // nowait
                            onCanceled();
                        }
                    ),
                });
            };
        }
        export const button = (className: string, children: minamo.dom.Source, onclick: () => unknown) =>
        ({
            tag: "button",
            className,
            children,
            onclick,
        });
        export const textButton = (text: locale.Label, onclick: () => unknown) =>
            button("text-button", label(text), onclick);
        export const descriptionButton = (className: string, title: minamo.dom.Source, description: locale.Label, onclick: () => unknown) =>
            button
            (
                `description-button ${className}`,
                [
                    $div("label-button button-title")(title),
                    $div("button-description")(label(description)),
                ],
                onclick
            );
            export const closeTextButton = (onClosed: () => unknown) => textButton
            (
                "Close",
                async () => onClosed()
            );
            export const cancelTextButton = (onCanceled: () => unknown) => textButton
        (
            "roll-back",
            async () =>
            {
                onCanceled();
                makeToast
                ({
                    content: label("roll-backed"),
                    wait: 3000,
                });
            }
        );
        export const buttonSafety = async (button: minamo.dom.Source) =>
        {
            const result = $make(HTMLDivElement)
            ({
                tag: "div",
                className: "button-safety",
                children:
                [
                    button,
                    {
                        tag: "div",
                        className: "button-cover",
                        children:
                        {
                            tag: "button",
                            className: "unlock-button",
                            children: await Resource.loadSvgOrCache("locked-icon"),
                            onclick: () =>
                            {
                                result.classList.toggle("unlocked", true);
                                setTimeout(() => result.classList.toggle("unlocked", false), 10000);
                            }
                        }
                    },
                ]
            });
            return result;
        };
        export interface PageParamsRaw
        {
            pass?: string;
            tag?: string;
            todo?: string;
            hash?: string;
            filter?: string;
        }
        export const isPageParamsRaw = (value: any): value is PageParamsRaw =>
            "object" === typeof value &&
            null !== value &&
            ( ! ("pass" in value) || ("string" === typeof value.pass || undefined === value.pass)) &&
            ( ! ("tag" in value) || ("string" === typeof value.tag || undefined === value.tag)) &&
            ( ! ("todo" in value) || ("string" === typeof value.todo || undefined === value.todo)) &&
            ( ! ("hash" in value) || ("string" === typeof value.hash || undefined === value.hash)) &&
            ( ! ("filter" in value) || ("string" === typeof value.filter || undefined === value.filter));
        export type PageParams = PageParamsRaw & {[key: string]: string};
        export const internalLink = (data: { className?: string, href: PageParams, children: minamo.dom.Source}) =>
        ({
            tag: "a",
            className: data.className,
            href: makeUrl(data.href),
            children: data.children,
            onclick: (event: MouseEvent) =>
            {
                event.stopPropagation();
                getScreenCover()?.click();
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
        export const scaleLinesStyleParts = (lines: { percent: number, color: string }[]): string =>
            lines
                .map
                (
                    (i, ix) =>
                    {
                        const isFirst = 0 === ix;
                        const isLast = (lines.length -1) === ix;
                        let result = "";
                        if (isFirst && 0 < i.percent)
                        {
                            result += "#00000000, ";
                        }
                        result += `#00000000 calc(${toPercentSting(i.percent)} - 1px), ${i.color}AA calc(${toPercentSting(i.percent)} - 1px), ${i.color}AA ${toPercentSting(i.percent)}`
                        if ( ! isLast || i.percent < 1)
                        {
                            result += `, #00000000 calc(${toPercentSting(i.percent)} + 1px)`;
                        }
                        return result;
                    }
                )
                .join(", ");
        export const scaleLinesStyle = (lines: { percent: number, color: string }[]): string =>
        {
            let result = "";
            if (0 < lines.length)
            {
                return `background: linear-gradient(90deg, ${scaleLinesStyleParts(lines.sort(minamo.core.comparer.make(i => i.percent)))});`;
            }
            return result;
        }
        export const progressScaleStyle = (item: ToDoEntry, progressScaleShowStyle: "none" | "full", settings?: AutoTagSettings): string =>
        {
            if ("number" === typeof item.progress && "full" === progressScaleShowStyle)
            {
                const lines: { percent: number, color: string }[] = [];
                const restriction = Domain.calcProgress(item, Domain.getAutoTagConditionElapsedTime(item, settings?.restriction));
                if ("number" === typeof restriction)
                {
                    lines.push({ percent: restriction, color: style.__DELETE_COLOR__, });
                }
                const pickup = Domain.calcProgress(item, Domain.getAutoTagConditionElapsedTime(item, settings?.pickup));
                if ("number" === typeof pickup)
                {
                    lines.push({ percent: pickup, color: style.__ACTIVE_COLOR__, });
                }
                const flash = Domain.calcProgress(item, Domain.getAutoTagConditionElapsedTime(item, settings?.flash));
                if ("number" === typeof flash)
                {
                    lines.push({ percent: flash, color: style.__FLASHY_COLOR__, });
                }
                const recentlyAverage = Domain.calcProgress(item, item.RecentlyAverage);
                if ("number" === typeof recentlyAverage)
                {
                    lines.push({ percent: recentlyAverage, color: style.__ACCENT_COLOR__, });
                }
                return scaleLinesStyle(lines.map(i => ({ percent: Math.min(i.percent, 1), color: i.color })));
            }
            else
            {
                return "";
            }
        }
        export const progressWidthStyle = (progress: number | null) =>
            `width:${toPercentSting(progress ?? 1)};`;
        export const progressStatusColor = (status: ProgressStatusType) =>
        (
            <FlounderStyle.Type.Color>
            {
                "default": style.__DISABLED_COLOR__,
                "flash": style.__FLASHY_COLOR__,
                "pickup": style.__ACTIVE_COLOR__,
                "restriction": style.__DELETE_COLOR__,
            }
            [status]
        );
        export const getCurrentTheme = (): "light" | "dark" =>
        {
            const setting = Storage.SystemSettings.get().theme ?? "auto";
            switch(setting)
            {
            case "light":
                return setting;
            case "dark":
                return setting;
            default:
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark": "light";
            }
        }
        export const getBackgroundColor = () =>
            <FlounderStyle.Type.Color>("light" === getCurrentTheme() ? style.__WHITE_COLOR__: style.__BLACK_COLOR__);
        interface Color
        {
            R: number;
            G: number;
            B: number;
            A?: number;
        }
        export const cssColorStringToColor = (cssColor: string): Color =>
        {
            let core = cssColor.replace("#", "");
            let R: number = 0;
            let G: number = 0;
            let B: number = 0;
            let A: undefined | number;
            if (6 == core.length || 8 == core.length)
            {
                const max = 255.0;
                R = parseInt(core.substring(0, 2), 16) /max;
                G = parseInt(core.substring(2, 4), 16) /max;
                B = parseInt(core.substring(4, 6), 16) /max;
                if (8 == core.length)
                {
                    A = parseInt(core.substring(6, 8), 16) /max;
                }
            }
            else
            if (3 == core.length || 4 == core.length)
            {
                const max = 15.0;
                R = parseInt(core.substring(0, 1), 16) /max;
                G = parseInt(core.substring(1, 2), 16) /max;
                B = parseInt(core.substring(2, 3), 16) /max;
                if (4 == core.length)
                {
                    A = parseInt(core.substring(3, 4), 16) /max;
                }
            }
            return undefined === A ? { R, G, B }: { R, G, B, A };
        };
        export const rateToHex = (value: number, digit: number = 2, max: number = Math.pow(16, digit) -1) =>
            Math.round(value *max).toString(16).padStart(digit, '0');
        export const colorToCssColorString = (color: Color): FlounderStyle.Type.Color => undefined === color.A ?
            `#${rateToHex(color.R)}${rateToHex(color.G)}${rateToHex(color.B)}`:
            `#${rateToHex(color.R)}${rateToHex(color.G)}${rateToHex(color.B)}${rateToHex(color.A)}`;
        export const linearNeutralColor = (X: Color, Y: Color, rate: number = 0.5, antiRate: number = 1.0 -rate) => undefined === X.A && undefined === Y.A ?
            { R: (X.R *rate) +(Y.R *antiRate), G: (X.G *rate) +(Y.G *antiRate), B: (X.B *rate) +(Y.B *antiRate), }:
            { R: (X.R *rate) +(Y.R *antiRate), G: (X.G *rate) +(Y.G *antiRate), B: (X.B *rate) +(Y.B *antiRate), A: ((X.A ?? 1.0) *rate) +((Y.A ?? 1.0) *antiRate), };
        export const linearNeutralColorString = (X: string, Y: string, rate: number = 0.5): FlounderStyle.Type.Color =>
            colorToCssColorString(linearNeutralColor(cssColorStringToColor(X), cssColorStringToColor(Y), rate));
        export const modRate = (value: number, unit: number) => (value %unit) /unit;
        // export let directionIndex = 0;
        // export let type: FlounderStyle.Arguments["type"];
        // export let layoutAngle: FlounderStyle.Arguments["layoutAngle"] = "regular";
        export const progressBackgroundStyle = (progress: number | null, status: ProgressStatusType, tick: number) =>
        {
            if ( ! isEnabledAnimation())
            {
                return `background-color: ${progressStatusColor(status)}`;
            }
            if (null === progress)
            {
                return FlounderStyle.styleToString
                (
                    FlounderStyle.makeStyle
                    ({
                        type: "diline",
                        // layoutAngle: "alternative",
                        layoutAngle: -modRate(tick, 5 *60 *1000),
                        // offsetY: modRate(tick, 3 *1000),
                        foregroundColor: progressStatusColor(status),
                        backgroundColor: getBackgroundColor(),
                        // backgroundColor: linearNeutralColorString(getBackgroundColor(), progressStatusColor(status), 0.7),
                        depth: 0.9,
                        blur: 0.0,
                        reverseRate: "auto",
                        //anglePerDepth: "auto",
                    })
                );
            }
            switch(status)
            {
            case "flash":
                // if
                // (
                //     ("trispot" === type || "tetraspot" === type || "stripe" === type || "diline" === type || "triline" === type) &&
                //     ("regular" === layoutAngle || "alternative" === layoutAngle || "number" === typeof layoutAngle )
                // )
                // {
                //     const step = modRate(tick, 3 *1000);
                //     const data: FlounderStyle.Arguments = <FlounderStyle.Arguments>
                //     {
                //         // type: "trispot",
                //         // layoutAngle: "alternative",
                //         type,
                //         layoutAngle,
                //         foregroundColor: progressStatusColor(status),
                //         backgroundColor: linearNeutralColorString(progressStatusColor(status), getBackgroundColor(), 0.5),
                //         depth: 0.9,
                //         intervalSize: 60,
                //         reverseRate: "auto",
                //         // anglePerDepth: "auto",
                //     };
                //     const offsetCoefficient = FlounderStyle.calculateOffsetCoefficient(data);
                //     smartConsole.logIfFirst("data", data);
                //     smartConsole.logIfFirst("offsetCoefficient", offsetCoefficient);
                //     smartConsole.logIfFirst("directions.atan2", offsetCoefficient.directions.map(i => FlounderStyle.atan2(i)));
                //     smartConsole.logIfFirst("directions.atan2.regulateRate", offsetCoefficient.directions.map(i => FlounderStyle.regulateRate(FlounderStyle.atan2(i))));
                //     // const direction = FlounderStyle.selectClosestAngleDirection(offsetCoefficient.directions, "up");
                //     const direction = offsetCoefficient.directions[directionIndex];
                //     if (undefined !== direction)
                //     {
                //         data.offsetX = offsetCoefficient.intervalSize * direction.x *step;
                //         data.offsetY = offsetCoefficient.intervalSize * direction.y *step;
                //         return FlounderStyle.styleToString(FlounderStyle.makeStyle(data));
                //     }
                // }
                {
                    const step = modRate(tick, 5 *1000);
                    return FlounderStyle.styleToString
                    (
                        FlounderStyle.makeStyle
                        ({
                            type: "diline",
                            layoutAngle: "regular",
                            foregroundColor: progressStatusColor(status),
                            backgroundColor: linearNeutralColorString(getBackgroundColor(), progressStatusColor(status), 0.5 *Math.min(1.0, step *2.5)),
                            depth: 0.80 +(step *0.20),
                            blur: 0.0,
                            intervalSize: (step *80) +6.0,
                            reverseRate: "auto",
                            anglePerDepth: "auto",
                        })
                    );
                }
            case "pickup":
                {
                    const step = modRate(tick, 30 *1000);
                    return FlounderStyle.styleToString
                    (
                        FlounderStyle.makeStyle
                        ({
                            type: "triline",
                            layoutAngle: step,
                            foregroundColor: progressStatusColor(status),
                            backgroundColor: linearNeutralColorString(getBackgroundColor(), progressStatusColor(status), 0.5 *Math.min(1.0, step *15)),
                            depth: 0.80 +(step *0.20),
                            blur: 0.0,
                            intervalSize: Math.pow(step *10, 3.0) +6.0,
                            reverseRate: "auto",
                            //anglePerDepth: "auto",
                        })
                    );
                }
            case "restriction":
                {
                    const step = modRate(tick, 60 *1000);
                    return FlounderStyle.styleToString
                    (
                        FlounderStyle.makeStyle
                        ({
                            type: "stripe",
                            layoutAngle: step,
                            foregroundColor: progressStatusColor(status),
                            backgroundColor: linearNeutralColorString(getBackgroundColor(), progressStatusColor(status), 0.5),
                            depth: 0.9,
                            blur: 0.0,
                            // reverseRate: "auto",
                            //anglePerDepth: "auto",
                        })
                    );
                }
            }
            return "";
        };
        export const progressStyle = (progress: number | null, _status: ProgressStatusType) =>
            // progressWidthStyle(progress) +progressBackgroundStyle(progress, status);
            progressWidthStyle(progress);
        export const progressPadStyle = (progress: number | null) =>
            progressWidthStyle(1 -(progress ?? 1));
        export const progressValidityClass = (progress: number | null) =>
            null === progress ? "progress-disabled": "progress-enabled";
        export type ProgressStatusType = "default" | "flash" | "pickup" | "restriction";
        export const getItemProgressStatus = (pass: string, item: ToDoEntry): ProgressStatusType =>
            OldStorage.TagMember.isRestrictionTask(pass, item.task) ? "restriction":
            OldStorage.TagMember.isFlashTask(pass, item.task) ? "flash":
            OldStorage.TagMember.isPickupTask(pass, item.task) ? "pickup":
            "default";
        export const progressStatusClass = (status: ProgressStatusType) =>
        (
            {
                "default": "progress-default",
                "flash": "progress-flash",
                "pickup": "progress-pickup",
                "restriction": "progress-restriction",
            }
            [status]
        );
        export const progressClass = (progress: number | null, status: ProgressStatusType) =>
            `progress-bar ${progressValidityClass(progress)} ${progressStatusClass(status)}`;
        export const progressBar = (progress: number | null, status: ProgressStatusType) =>$div
        ({
            className: progressClass(progress, status),
            attributes: { style: progressStyle(progress, status), }
        })
        ([]);
        export const progressBarPad = (progress: number | null) =>$div
        ({
            className: "progress-bar-pad",
            attributes: { style: progressPadStyle(progress), }
        })
        ([]);
        export const itemProgressBar = (pass: string, item: ToDoEntry, withPad?: "with-pad") =>
        [
            progressBar(item.progress, getItemProgressStatus(pass, item)),
            withPad ? progressBarPad(item.progress): undefined,
        ]
        .filter(i => undefined !== i) as minamo.dom.Source;
        export const updateItemProgressBar = (pass: string, item: ToDoEntry, dom: HTMLDivElement) =>
        {
            const status = getItemProgressStatus(pass, item);
            const progressBarDiv = dom.getElementsByClassName("progress-bar")[0] as HTMLDivElement;
            progressBarDiv.className = progressClass(item.progress, status);
            progressBarDiv.setAttribute("style", progressStyle(item.progress, status));
            const progressBarPadDiv = dom.getElementsByClassName("progress-bar-pad")[0] as HTMLDivElement;
            progressBarPadDiv?.setAttribute?.("style", progressPadStyle(item.progress));
        };
        export const labelSpan = $span("label");
        export const label = (text: locale.Label) => labelSpan(locale.map(text));
        export const monospace = (classNameOrValue: string | minamo.dom.Source, labelOrValue?: minamo.dom.Source, valueOrNothing?: minamo.dom.Source) =>
            "string" !== typeof classNameOrValue || undefined === labelOrValue ?
                $span("value monospace")(classNameOrValue):
                $div(classNameOrValue)
                ([
                    undefined !== valueOrNothing ? labelOrValue: [],
                    $span("value monospace")(valueOrNothing ?? labelOrValue),
                ]);
        export const messagePanel = (text: minamo.dom.Source) => $div("message-panel")(text);
        export const messageList = (source: minamo.dom.Source) => $div("message-list")(source);
        export const systemPrompt = async (message?: string, _default?: string): Promise<string | null> =>
        {
            await minamo.core.timeout(100); // この wait をかましてないと呼び出し元のポップアップメニューが window.prompt が表示されてる間、ずっと表示される事になる。
            return await waitPopup(async () => await new Promise(resolve => resolve(window.prompt(message, _default)?.trim() ?? null)));
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
        export const numberPrompt = async (message: string, _default: number, options?: { min?: number, max?: number, step?: number, }): Promise<number | null> =>
        {
            const input = $make(HTMLInputElement)
            ({
                tag: "input",
                type: "number",
                value: _default,
                min: options?.min,
                max: options?.max,
                step: options?.step,
                required: "",
            });
            return await new Promise
            (
                resolve =>
                {
                    let result: number | null = null;
                    const ui = popup
                    ({
                        children:
                        [
                            $tag("h2")("")(message),
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
                                        result = parseInt(input.value);
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
        export const dateTimeSpanPrompt = async (message: string, _default: number): Promise<number | null> =>
        {
            const inputDate = $make(HTMLInputElement)
            ({
                tag: "input",
                type: "number",
                value: Math.floor((_default *Domain.timeAccuracy) / Domain.dayUnit),
                min: "0",
                max: "999",
                step: "1",
                required: "",
            });
            const inputTime = $make(HTMLInputElement)
            ({
                tag: "input",
                type: "time",
                value: Domain.timeCoreStringFromTick(_default),
                required: "",
            });
            return await new Promise
            (
                resolve =>
                {
                    let result: number | null = null;
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
                                        const day = parseInt(inputDate.value);
                                        const time = Domain.parseTimeSpan(inputTime.value);
                                        if ( ! isNaN(day) && null !== time)
                                        {
                                            result = ((day *Domain.dayUnit) /Domain.timeAccuracy) +time;
                                        }
                                        else
                                        {
                                            result = null;
                                        }
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
                                getTagList({ pass, tag: true, }).filter(i => "@untagged" !== i).map
                                // OldStorage.Tag.get(pass).sort(Domain.tagComparerOld(pass)).concat("@unoverall").map
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
                                        await updateScreen("operate");
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
                            $tag("h2")("")(Model.decode(item.task)),
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
                                //["@:@root"].concat(OldStorage.Tag.get(pass).filter(tag => Model.isSublistOld(tag)).sort(Domain.tagComparerOld(pass))).map
                                getTagList({ pass, sublist: true, }).map
                                (
                                    async sublist =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${sublist === (OldStorage.Task.getSublist(item.task) ?? "@:@root") ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")(Domain.tagMap(sublist)),
                                        ],
                                        onclick: async () =>
                                        {
                                            const todo = OldStorage.TagMember.add(pass, sublist, item.task);
                                            result = true;
                                            ui.close();
                                            if (todo !== item.task && getUrlParams()["todo"])
                                            {
                                                await showUrl({ pass, todo, });
                                            }
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
                                onclick: async () => await newSublistPopup
                                (
                                    pass,
                                    async (tag) =>
                                    {
                                        const todo = OldStorage.TagMember.add(pass, tag, item.task);
                                        result = true;
                                        await ui.close();
                                        if (todo !== item.task && getUrlParams()["todo"])
                                        {
                                            await showUrl({ pass, todo, });
                                        }
                                    }
                                ),
                            },
                        ]
                    );
                    const ui = popup
                    ({
                        className: "add-remove-tags-popup",
                        children:
                        [
                            $tag("h2")("")(Model.decode(item.task)),
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
                                            $span("")(label(getThemeLocale(key))),
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
        export const uiStyleSettingsPopup = async (settings: SystemSettings = Storage.SystemSettings.get()): Promise<boolean> =>
        {
            const defaultValue = "fixed";
            const init = settings.uiStyle ?? defaultValue;
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
                                (<UiStyleType[]>[ "slide", "fade", "fixed", ]).map
                                (
                                    async (key: UiStyleType) =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${key === (settings.uiStyle ?? defaultValue) ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")(label(getUiStyleLocale(key))),
                                        ],
                                        onclick: async () =>
                                        {
                                            if (key !== (settings.uiStyle ?? defaultValue))
                                            {
                                                settings.uiStyle = key;
                                                Storage.SystemSettings.set(settings);
                                                await checkButtonListUpdate();
                                                updateUiStyle();
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
                            $tag("h2")("")(label("UI style setting")),
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
        export const flashStyleSettingsPopup = async (settings: SystemSettings = Storage.SystemSettings.get()): Promise<boolean> =>
        {
            const defaultValue = "breath";
            const init = settings.flashStyle ?? defaultValue;
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
                                (<FlashStyleType[]>[ "gradation", "breath", "solid", "none", ]).map
                                (
                                    async (key: FlashStyleType) =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${key === (settings.flashStyle ?? defaultValue) ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")(label(getFlashStyleLocale(key))),
                                        ],
                                        onclick: async () =>
                                        {
                                            if (key !== (settings.flashStyle ?? defaultValue))
                                            {
                                                settings.flashStyle = key;
                                                Storage.SystemSettings.set(settings);
                                                await checkButtonListUpdate();
                                                updateFlashStyle();
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
                            $tag("h2")("")(label("Flash style setting")),
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
        export const animationSpanSettingsPopup = async (settings: SystemSettings = Storage.SystemSettings.get()): Promise<boolean> =>
        {
            const init = getAnimationDurationOrDefaut(settings);
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
                                (<AnimationDurationType[]>[ "none", "10s", "1m", "10m", "1h", "auto", "ever", ]).map
                                (
                                    async (key: AnimationDurationType) =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${key === getAnimationDurationOrDefaut(settings) ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")(label(getAnimationDurationLocale(key))),
                                        ],
                                        onclick: async () =>
                                        {
                                            if (key !== getAnimationDurationOrDefaut(settings))
                                            {
                                                settings.animationDuration = key;
                                                Storage.SystemSettings.set(settings);
                                                await checkButtonListUpdate();
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
                            $tag("h2")("")(label("Animation duration setting")),
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
                                            if (key !== (settings.locale ?? null))
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
        export const emojiSettingsPopup = async (settings: SystemSettings = Storage.SystemSettings.get()): Promise<boolean> =>
        {
            const defaultValue = "auto";
            const init = settings.emoji ?? defaultValue;
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
                                (<EmojiType[]>[ "auto", "system", "noto-emoji", ]).map
                                (
                                    async (key: EmojiType) =>
                                    ({
                                        tag: "button",
                                        className: `check-button ${key === (settings.emoji ?? defaultValue) ? "checked": ""}`,
                                        children:
                                        [
                                            await Resource.loadSvgOrCache("check-icon"),
                                            $span("")(label(getEmojiTypeLocale(key))),
                                        ],
                                        onclick: async () =>
                                        {
                                            if (key !== (settings.emoji ?? defaultValue))
                                            {
                                                settings.emoji = key;
                                                Storage.SystemSettings.set(settings);
                                                await checkButtonListUpdate();
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
                            $tag("h2")("")(label("Emoji setting")),
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
        export const newTaskPopup = async (entry: { pass: string, tag: string, }, _default?: string) =>
        {
            const newTask = await prompt(locale.map("Input a ToDo's name."), _default);
            if (null !== newTask)
            {
                const encodedNewTask = OldStorage.Task.encode(newTask);
                if ( ! OldStorage.Task.isExist(entry.pass, encodedNewTask, entry.tag))
                {
                    OldStorage.Task.add(entry.pass, encodedNewTask);
                    const newTask2 = OldStorage.TagMember.add(entry.pass, entry.tag, encodedNewTask);
                    updateScreen("operate");
                    const toast = makeToast
                    ({
                        content: $span("")(`${locale.map("ToDo has been created!")}: ${OldStorage.Task.decode(newTask2)}`),
                        forwardOperator: textButton
                        (
                            "Done",
                            async () =>
                            {
                                toast.hide(); // nowait
                                await Operate.done
                                (
                                    entry.pass,
                                    MigrateBridge.getToDoEntry(entry.pass, newTask2),
                                    MigrateBridge.getDoneTicks(entry.pass),
                                    () => updateScreen("operate")
                                );
                                updateScreen("operate");
                            }
                        ),
                        backwardOperator: cancelTextButton
                        (
                            async () =>
                            {
                                OldStorage.Task.removeRaw(entry.pass, encodedNewTask);
                                toast.hide(); // nowait
                                await newTaskPopup(entry, newTask);
                            }
                        ),
                    });
                }
                else
                {
                    const toast = makeToast
                    ({
                        content: label("A ToDo with that name already exists."),
                        forwardOperator: textButton
                        (
                            "Show",
                            async () =>
                            {
                                toast.hide(); // nowait
                                await showUrl({ pass: entry.pass, todo: encodedNewTask, });
                            }
                        ),
                        backwardOperator: textButton
                        (
                            "Respecify",
                            async () =>
                            {
                                toast.hide(); // nowait
                                await newTaskPopup(entry, newTask);
                            }
                        ),
                    });
                }
            }
        };
        export const newSublistPopup = async (pass: string, onNew: (tag: string) => Promise<unknown> = async (tag) => await showUrl({ pass, tag, })) =>
        {
            const sublist = await prompt(locale.map("Input a sublist's name."), "");
            if (null !== sublist)
            {
                const tag = Model.encodeSublist(sublist.trim());
                OldStorage.Tag.add(pass, tag);
                await onNew(tag);
            }
        };
        export const systemSettingsPopup = async (): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const header = <HTMLHeadingElement>$make({ tag: "h2", });
                const buttonList = $make(HTMLDivElement)({ className: "label-button-list" });
                const update = async () =>
                {
                    minamo.dom.replaceChildren(header, label("System settings"));
                    const settings = Storage.SystemSettings.get();
                    minamo.dom.replaceChildren
                    (
                        buttonList,
                        [
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Theme setting"),
                                    label(getThemeLocale(settings.theme ?? "auto"))
                                ),
                                "theme.description",
                                async () =>
                                {
                                    if (await themeSettingsPopup())
                                    {
                                        result = true;
                                        await update();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("UI style setting"),
                                    label(getUiStyleLocale(settings.uiStyle ?? "fixed"))
                                ),
                                "uiStyle.description",
                                async () =>
                                {
                                    if (await uiStyleSettingsPopup())
                                    {
                                        result = true;
                                        await update();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Flash style setting"),
                                    label(getFlashStyleLocale(settings.flashStyle ?? "breath"))
                                ),
                                "flashStyle.description",
                                async () =>
                                {
                                    if (await flashStyleSettingsPopup())
                                    {
                                        result = true;
                                        await update();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Animation duration setting"),
                                    label(getAnimationDurationLocale(settings.animationDuration))
                                ),
                                "animationDuration.description",
                                async () =>
                                {
                                    if (await animationSpanSettingsPopup())
                                    {
                                        result = true;
                                        await update();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Language setting"),
                                    $span("")(locale.getLocaleName(settings.locale ?? "@auto"))
                                ),
                                "language.description",
                                async () =>
                                {
                                    if (await localeSettingsPopup())
                                    {
                                        setLocale(Storage.SystemSettings.get().locale ?? null);
                                        result = true;
                                        await update();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Emoji setting"),
                                    label(getEmojiTypeLocale(settings.emoji ?? "auto"))
                                ),
                                "emoji.description",
                                async () =>
                                {
                                    if (await emojiSettingsPopup())
                                    {
                                        result = true;
                                        await update();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    labelSpan(locale.immutable("build timestamp")),
                                    labelSpan(getVersionTimestampText()),
                                ),
                                "Reload screen",
                                reloadScreen
                            ),
                        ]
                    );
                };
                await update();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        header,
                        buttonList,
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
                    onClose: async () =>
                    {
                        resolve(result);
                    },
                });
            }
        );
        export const getTermThresholdPreset = (current: number) =>
        {
            let list: number[] = [];
            list.push(current);
            list.push(...Storage.Timespan.get());
            list.push(...config.timespanPreset.map(i => minamo.core.parseTimespan(i)).filter(isNumber).map(i => i / Domain.timeAccuracy));
            return list.filter(uniqueFilter).filter(takeFilter(config.timespanPresetMaxCount)).sort(minamo.core.comparer.basic);
        };
        export const termThresholdSettingPopup = async (title: locale.Label, setter: (value: number) => unknown, getter: () => number): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const buttonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const buttonListUpdate = async () => minamo.dom.replaceChildren
                (
                    buttonList,
                    await Promise.all
                    (
                        [ ...getTermThresholdPreset(getter()), NaN, ]
                        .map
                        (
                            async i =>
                            ({
                                tag: "button",
                                className: `check-button ${JSON.stringify(i) === JSON.stringify(getter()) ? "checked": ""}`,
                                children:
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    isValidNumber(i) ?
                                        $span("")(Domain.timeLongStringFromTick(i)):
                                        label("pickup.specify"),
                                ],
                                onclick: async () =>
                                {
                                    if ( ! isValidNumber(i))
                                    {
                                        const value = await dateTimeSpanPrompt
                                        (
                                            locale.map("pickup.elapsed-time"),
                                            getter() ?? 0
                                        );
                                        if (null !== value)
                                        {
                                            await setter(value);
                                            result = true;
                                            await buttonListUpdate();
                                        }
                                    }
                                    else
                                    {
                                        await setter(i);
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            }),
                        )
                    )
                );
                await buttonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(`${locale.map(title)}`),
                        buttonList,
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
                    onClose: async () =>
                    {
                        Storage.Timespan.add(getter());
                        resolve(result);
                    },
                });
            }
        );
        export const termThresholdSettingsPopup = async (pass: string): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const buttonList = $make(HTMLDivElement)({ className: "label-button-list" });
                const buttonListUpdate = async () =>
                {
                    minamo.dom.replaceChildren
                    (
                        buttonList,
                        [
                            descriptionButton
                            (
                                "",
                                monospace("", label("Max short term threshold"), Domain.timeLongStringFromTick(OldStorage.ListSettings.TermThreshold.getMaxShortTermTimespan(pass))),
                                "Max short term threshold.description",
                                async () =>
                                {
                                    if (await termThresholdSettingPopup("Max short term threshold", value => OldStorage.ListSettings.TermThreshold.setMaxShortTermTimespan(pass, value), () => OldStorage.ListSettings.TermThreshold.getMaxShortTermTimespan(pass)))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace("", label("Max medium term threshold"), Domain.timeLongStringFromTick(OldStorage.ListSettings.TermThreshold.getMaxMediumTermTimespan(pass))),
                                "Max medium term threshold.description",
                                async () =>
                                {
                                    if (await termThresholdSettingPopup("Max medium term threshold", value => OldStorage.ListSettings.TermThreshold.setMaxMediumTermTimespan(pass, value), () => OldStorage.ListSettings.TermThreshold.getMaxMediumTermTimespan(pass)))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                        ]
                    );
                };
                await buttonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(locale.map("Term threshold settings")),
                        buttonList,
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
                    onClose: async () =>
                    {
                        resolve(result);
                    },
                });
            }
        );
        export const autoTagSettingsIcons = async (autoTagSettings: AutoTagSettings | undefined) =>
        [
            null !== (autoTagSettings?.flash ?? null) ?
                await Resource.loadTagSvgOrCache("@flash"): [],
            null !== (autoTagSettings?.pickup ?? null) ?
                await Resource.loadTagSvgOrCache("@pickup"): [],
            null !== (autoTagSettings?.restriction ?? null) ?
                await Resource.loadTagSvgOrCache("@restriction"): [],
        ];
        export const listSettingsPopup = async (pass: string): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const buttonList = $make(HTMLDivElement)({ className: "label-button-list" });
                const buttonListUpdate = async () =>
                {
                    const settings = OldStorage.ListSettings.get(pass);
                    minamo.dom.replaceChildren
                    (
                        buttonList,
                        [
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("ToDo List"),
                                    labelSpan(OldStorage.Title.get(pass)),
                                ),
                                "Rename",
                                async () =>
                                {
                                    const oldTitle = OldStorage.Title.get(pass);
                                    const newTitle = await prompt(locale.map("Input a ToDo list's name."), oldTitle);
                                    if (null !== newTitle && 0 < newTitle.length && newTitle !== oldTitle)
                                    {
                                        result = true;
                                        Operate.renameList(pass, newTitle, async () => await reload());
                                        await buttonListUpdate();
                                    }
                                },
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Auto tag settings"),
                                    await autoTagSettingsIcons(settings.autoTagSettings),
                                ),
                                "Auto tag settings",
                                async () =>
                                {
                                    const setter = (value: AutoTagSettings) =>
                                    {
                                        settings.autoTagSettings = value;
                                        OldStorage.ListSettings.set(pass, settings);
                                    };
                                    const getter = (): AutoTagSettings =>
                                        OldStorage.ListSettings.get(pass).autoTagSettings ?? { };
                                    if (await autoTagSettingsPopup("list", OldStorage.Title.get(pass), setter, getter))
                                    {
                                        result = true;
                                        updateScreen("operate");
                                        await buttonListUpdate();
                                    }
                                },
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Display style setting"),
                                    label(getTagDisplayStyleText(settings.displayStyle ?? getTagDisplayStyleDefault("@list")))
                                ),
                                "displayStyle.description",
                                async () =>
                                {
                                    if (await tagDisplayStyleSettingsPopup(pass, "@list"))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Progress scale style setting"),
                                    label(getTagProgressScaleStyleText(settings.progressScaleStyle ?? getTagProgressScaleStyleDefault("@list")))
                                ),
                                "progressScaleStyle.description",
                                async () =>
                                {
                                    if (await tagProgressScaleStyleSettingsPopup(pass, "@list"))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Sort order setting"),
                                    label(getTagSortSettingsText(settings.sort ?? getTagSortSettingsDefault("@list")))
                                ),
                                "sort.description",
                                async () =>
                                {
                                    if (await tagSortSettingsPopup(pass, "@list"))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace("", label("Term threshold settings")),
                                "Term threshold settings.description",
                                async () =>
                                {
                                    if (await termThresholdSettingsPopup(pass))
                                    {
                                        result = true;
                                        updateScreen("operate");
                                        await buttonListUpdate();
                                    }
                                },
                            ),
                            descriptionButton
                            (
                                "",
                                monospace("", label("Export")),
                                "export.description",
                                async () =>
                                {
                                    ui.close();
                                    await showUrl({ pass, hash: "export", });
                                },
                            ),
                            await buttonSafety
                            (
                                descriptionButton
                                (
                                    "delete-button",
                                    monospace("", label("Delete this List")),
                                    "poem.recyclebin.description",
                                    async () =>
                                    {
                                        ui.close();
                                        const backup = location.href;
                                        Operate.removeList(pass, () => showPage(backup));
                                        await showUrl({ });
                                    },
                                )
                            ),
                        ]
                    );
                };
                await buttonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(locale.map("List settings")),
                        buttonList,
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
                    onClose: async () =>
                    {
                        resolve(result);
                    },
                });
            }
        );
        export const getTagSettingsTitle = (tag: string): locale.Label =>
        {
            const map: { [key: string]: locale.Label; } =
            {
                "home": "Home settings",
                "tag": "Tag settings",
                "sublist": "Sublist settings",
            };
            return map[<string>Model.getTagCategory(tag)];
        };
        export const tagSettingsPopup = async (pass: string, tag: string): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const buttonList = $make(HTMLDivElement)({ className: "label-button-list" });
                const buttonListUpdate = async () =>
                {
                    const settings = OldStorage.TagSettings.get(pass, tag);
                    minamo.dom.replaceChildren
                    (
                        buttonList,
                        [
                            Model.isSystemTagOld(tag) ?
                                []:
                                descriptionButton
                                (
                                    "",
                                    monospace
                                    (
                                        "",
                                        label(Model.isSublistOld(tag) ? "Sublist": "Tag"),
                                        labelSpan(Domain.tagMap(tag)),
                                    ),
                                    "Rename",
                                    async () =>
                                    {
                                        if (await renameTag({ pass, tag, }))
                                        {
                                            result = true;
                                            tag = getUrlParams().tag ?? tag;
                                            await buttonListUpdate();
                                        }
                                    },
                                ),
                            Model.isSublistOld(tag) ?
                                descriptionButton
                                (
                                    "",
                                    monospace
                                    (
                                        "",
                                        label("Auto tag settings"),
                                        await autoTagSettingsIcons(settings.autoTagSettings),
                                    ),
                                    "Auto tag settings",
                                    async () =>
                                    {
                                        const setter = (value: AutoTagSettings) =>
                                        {
                                            settings.autoTagSettings = value;
                                            OldStorage.TagSettings.set(pass, tag, settings);
                                        };
                                        const getter = (): AutoTagSettings =>
                                            OldStorage.TagSettings.get(pass, tag).autoTagSettings ?? { };
                                        if (await autoTagSettingsPopup("sublist", Model.decode(tag), setter, getter))
                                        {
                                            result = true;
                                            updateScreen("operate");
                                            await buttonListUpdate();
                                        }
                                    },
                                ):
                                [],
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Display style setting"),
                                    label(getTagDisplayStyleText(settings.displayStyle ?? getTagDisplayStyleDefault(tag)))
                                ),
                                "displayStyle.description",
                                async () =>
                                {
                                    if (await tagDisplayStyleSettingsPopup(pass, tag))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Progress scale style setting"),
                                    label(getTagProgressScaleStyleText(settings.progressScaleStyle ?? getTagProgressScaleStyleDefault(tag)))
                                ),
                                "progressScaleStyle.description",
                                async () =>
                                {
                                    if (await tagProgressScaleStyleSettingsPopup(pass, tag))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Sort order setting"),
                                    label(getTagSortSettingsText(settings.sort ?? getTagSortSettingsDefault(tag)))
                                ),
                                "sort.description",
                                async () =>
                                {
                                    if (await tagSortSettingsPopup(pass, tag))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                            Model.isSystemTagOld(tag) ?
                                []:
                                await buttonSafety
                                (
                                    descriptionButton
                                    (
                                        "delete-button",
                                        monospace("", label("Delete")),
                                        "poem.recyclebin.description",
                                        async () =>
                                        {
                                            const href = location.href;
                                            ui.close();
                                            OldStorage.Tag.remove(pass, tag);
                                            if (tag === getUrlParams(href).tag)
                                            {
                                                await showUrl({ pass, tag: "@overall" });
                                            }
                                            const toast = makeToast
                                            ({
                                                content: $span("")(`${locale.map(Model.isSublistOld(tag) ? "Sublist has been deleted!": "Tag has been deleted!")}: ${Model.decode(Model.decodeSublist(tag))}`),
                                                backwardOperator: cancelTextButton
                                                (
                                                    async () =>
                                                    {
                                                        const removedItem = Model.isSublistOld(tag) ?
                                                            OldStorage.Removed.get(pass).filter(i => isRemovedSublist(i) && tag === i.name)[0]:
                                                            OldStorage.Removed.get(pass).filter(i => isRemovedTag(i) && tag === i.name)[0];
                                                        OldStorage.Removed.restore(pass, removedItem);
                                                        toast.hide(); // nowait
                                                        if (href !== location.href)
                                                        {
                                                            await showUrl(getUrlParams(href));
                                                        }
                                                    }
                                                ),
                                            });
                                        },
                                    )
                                ),
                        ]
                    );
                };
                await buttonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")
                        (
                            Model.isHomeOld(tag) ?
                                locale.map(getTagSettingsTitle(tag)):
                                `${locale.map(getTagSettingsTitle(tag))}: ${Domain.tagMap(tag)}`
                        ),
                        buttonList,
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
                    onClose: async () =>
                    {
                        resolve(result);
                    },
                });
            }
        );
        export const todoTagList = (pass: string, item: ToDoEntry) =>
        {
            const list = OldStorage.Tag.getByTodo(pass, item.task).filter(i => ! Model.isSublistOld(i) && ! Model.isSystemTagOld(i));
            return 0 < list.length ? list: [ "@untagged", ];
        };
        export const todoSettingsPopup = async (pass: string, item: ToDoEntry): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const buttonList = $make(HTMLDivElement)({ className: "label-button-list" });
                const buttonListUpdate = async () =>
                {
                    minamo.dom.replaceChildren
                    (
                        buttonList,
                        [
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Sublist"),
                                    Domain.tagMap(OldStorage.Task.getSublist(item.task) ?? "@:@root")
                                ),
                                "Move to Sublist",
                                async () =>
                                {
                                    if (await moveToSublistPopup(pass, item))
                                    {
                                        // item.task = newTaskFullname; 🚧
                                        result = true;
                                        updateScreen("operate");
                                        await buttonListUpdate();
                                    }
                                },
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    labelSpan(locale.immutable("ToDo")),
                                    labelSpan(OldStorage.Task.decode(OldStorage.Task.getBody(item.task))),
                                ),
                                "Rename",
                                async () =>
                                {
                                    const sublist = OldStorage.Task.getSublist(item.task) ?? "";
                                    const oldTask = OldStorage.Task.decode(OldStorage.Task.getBody(item.task));
                                    const newTask = await prompt(locale.map("Input a ToDo's name."), oldTask);
                                    if (null !== newTask && 0 < newTask.length && newTask !== oldTask)
                                    {
                                        const newTaskFullname = `${sublist}${OldStorage.Task.encode(newTask)}`;
                                        if (OldStorage.Task.rename(pass, item.task, newTaskFullname))
                                        {
                                            result = true;
                                            const href = location.href;
                                            if (item.task === getUrlParams(href).todo)
                                            {
                                                await showUrl({ pass, todo: newTaskFullname, });
                                            }
                                            item.task = newTaskFullname;
                                            //await onRename(OldStorage.Task.decode(newTaskFullname));
                                            await buttonListUpdate();
                                        }
                                        else
                                        {
                                            alert(locale.map("A ToDo with that name already exists."));
                                        }
                                    }
                                },
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Auto tag settings"),
                                    await autoTagSettingsIcons(OldStorage.TodoSettings.get(pass, item.task)),
                                ),
                                "Auto tag settings",
                                async () =>
                                {
                                    if (await todoAutoTagSettingsPopup(pass, item))
                                    {
                                        result = true;
                                        updateScreen("operate");
                                        await buttonListUpdate();
                                    }
                                },
                            ),
                            descriptionButton
                            (
                                "",
                                monospace
                                (
                                    "",
                                    label("Tag"),
                                    todoTagList(pass, item).map(i => Domain.tagMap(i)).join(", "),
                                ),
                                "Add/Remove Tag",
                                async () =>
                                {
                                    if (await addRemoveTagsPopup(pass, item, OldStorage.Tag.getByTodo(pass, item.task)))
                                    {
                                        result = true;
                                        updateScreen("operate");
                                        await buttonListUpdate();
                                    }
                                },
                            ),
                            await buttonSafety
                            (
                                descriptionButton
                                (
                                    "delete-button",
                                    monospace("", label("Delete")),
                                    "poem.recyclebin.description",
                                    async () =>
                                    {
                                        const href = location.href;
                                        ui.close();
                                        OldStorage.Task.remove(pass, item.task);
                                        //Storage.TagMember.add(pass, "@deleted", item.task);
                                        if (item.task === getUrlParams(href).todo)
                                        {
                                            await showUrl({ pass, tag: "@overall" });
                                        }
                                        const toast = makeToast
                                        ({
                                            content: $span("")(`${locale.map("ToDo has been deleted!")}: ${Model.decode(item.task)}`),
                                            backwardOperator: cancelTextButton
                                            (
                                                async () =>
                                                {
                                                    const removedItem = OldStorage.Removed.get(pass).filter(i => isRemovedTask(i) && item.task === i.name)[0];
                                                    OldStorage.Removed.restore(pass, removedItem);
                                                    toast.hide(); // nowait
                                                    if (href !== location.href)
                                                    {
                                                        await showUrl(getUrlParams(href));
                                                    }
                                                }
                                            ),
                                        });
                                    },
                                ),
                            )
                        ]
                    );
                };
                await buttonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(locale.map("ToDo settings")),
                        buttonList,
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
                    onClose: async () =>
                    {
                        resolve(result);
                    },
                });
            }
        );
        export const makeTagDefaultGetter = <T extends string>(defaultValue: T) =>
            (tag: string): "@list" | T => "@list" === tag ? defaultValue: "@list";
        export const getTagSortSettingsDefault = makeTagDefaultGetter("smart");
        export const getTagSortSettingsText = (sort: "@list" | "smart" | "simple" | "simple-reverse") =>
        {
            const map: { [key: string]: locale.Label; } =
            {
                "@list": "sort.list",
                "smart": "sort.smart",
                "simple": "sort.simple",
                "simple-reverse": "sort.simple-reverse",
            };
            return map[sort];
        }
        export const getTagSortSettingsDescription = (sort: "@list" | "smart" | "simple" | "simple-reverse") =>
            `${getTagSortSettingsText(sort)}.description` as locale.Label;
        export const tagSortSettingsPopup = async (pass: string, tag: string, settings: TagSettings | ListSettings = "@list" === tag ? OldStorage.ListSettings.get(pass): OldStorage.TagSettings.get(pass, tag)): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const defaultSort = getTagSortSettingsDefault(tag);
                const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const tagButtonListUpdate = async () => minamo.dom.replaceChildren
                (
                    tagButtonList,
                    await Promise.all
                    (
                        (
                            "@list" === tag ?
                            [ "smart", "simple", "simple-reverse", ]:
                            [ "@list", "smart", "simple", "simple-reverse", ]
                        )
                        .map
                        (
                            async (i: "@list" | "smart" | "simple" | "simple-reverse") => descriptionButton
                            (
                                `check-button ${i === (settings.sort ?? defaultSort) ? "checked": ""}`,
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    $span("")(label(getTagSortSettingsText(i))),
                                ],
                                getTagSortSettingsDescription(i),
                                async () =>
                                {
                                    settings.sort = defaultSort === i ? undefined: <"smart" | "simple" | "simple-reverse">i;
                                    if ("@list" === tag)
                                    {
                                        OldStorage.ListSettings.set(pass, settings);
                                    }
                                    else
                                    {
                                        OldStorage.TagSettings.set(pass, tag, settings);
                                    }
                                    await updateScreen("operate");
                                    result = true;
                                    await tagButtonListUpdate();
                                }
                            )
                        )
                    )
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
        export const getTagDisplayStyleDefault = makeTagDefaultGetter("full");
        export const getTagDisplayStyleText = (displayStyle: Exclude<TagSettings["displayStyle"], undefined> | "@list") =>
        {
            const map: { [key: string]: locale.Label; } =
            {
                "@list": "displayStyle.list",
                "full": "displayStyle.full",
                "digest": "displayStyle.digest",
                "simple": "displayStyle.simple",
                "compact": "displayStyle.compact",
            };
            return map[displayStyle];
        }
        export const getTagDisplayStyleDescription = (displayStyle: Exclude<TagSettings["displayStyle"], undefined>) =>
            `${getTagDisplayStyleText(displayStyle)}.description` as locale.Label;
        export const tagDisplayStyleSettingsPopup = async (pass: string, tag: string, settings: TagSettings | ListSettings = "@list" === tag ? OldStorage.ListSettings.get(pass): OldStorage.TagSettings.get(pass, tag)): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const defaultStyle = getTagDisplayStyleDefault(tag);
                const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const tagButtonListUpdate = async () => minamo.dom.replaceChildren
                (
                    tagButtonList,
                    await Promise.all
                    (
                        (
                            "@list" === tag ?
                            [ "full", "digest", "simple", "compact", ]:
                            [ "@list", "full", "digest", "simple", "compact", ]
                        )
                        .map
                        (
                            async (i: Exclude<TagSettings["displayStyle"], undefined>) => descriptionButton
                            (
                                `check-button ${i === (settings.displayStyle ?? defaultStyle) ? "checked": ""}`,
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    $span("")(label(getTagDisplayStyleText(i))),
                                ],
                                getTagDisplayStyleDescription(i),
                                async () =>
                                {
                                    settings.displayStyle = i;
                                    if ("@list" === tag)
                                    {
                                        OldStorage.ListSettings.set(pass, settings);
                                    }
                                    else
                                    {
                                        OldStorage.TagSettings.set(pass, tag, settings);
                                    }
                                    await updateScreen("operate");
                                    result = true;
                                    await tagButtonListUpdate();
                                }
                            )
                        )
                    )
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
        export const getTagProgressScaleStyleDefault = makeTagDefaultGetter("none");
        export const getTagProgressScaleStyleText = (displayStyle: "@list" | "none" | "full") =>
        {
            const map: { [key: string]: locale.Label; } =
            {
                "@list": "progressScaleStyle.list",
                "none": "progressScaleStyle.none",
                "full": "progressScaleStyle.full",
            };
            return map[displayStyle];
        }
        export const tagProgressScaleStyleSettingsPopup = async (pass: string, tag: string, settings: TagSettings | ListSettings = "@list" === tag ? OldStorage.ListSettings.get(pass): OldStorage.TagSettings.get(pass, tag)): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const defaultStyle = getTagProgressScaleStyleDefault(tag);
                const tagButtonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const tagButtonListUpdate = async () => minamo.dom.replaceChildren
                (
                    tagButtonList,
                    await Promise.all
                    (
                        (
                            "@list" === tag ?
                            [ "none", "full", ]:
                            [ "@list", "none", "full", ]
                        )
                        .map
                        (
                            async (i: "@list" | "none" | "full") =>
                            ({
                                tag: "button",
                                className: `check-button ${i === (settings.progressScaleStyle ?? defaultStyle) ? "checked": ""}`,
                                children:
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    $span("")(label(getTagProgressScaleStyleText(i))),
                                ],
                                onclick: async () =>
                                {
                                    settings.progressScaleStyle = defaultStyle === i ? undefined: <"none" | "full">i;
                                    if ("@list" === tag)
                                    {
                                        OldStorage.ListSettings.set(pass, settings);
                                    }
                                    else
                                    {
                                        OldStorage.TagSettings.set(pass, tag, settings);
                                    }
                                    await updateScreen("operate");
                                    result = true;
                                    await tagButtonListUpdate();
                                }
                            })
                        )
                    )
                );
                await tagButtonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(`${locale.map("Progress scale style setting")}: ${Domain.tagMap(tag)}`),
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
        export const getTodoPickupSettingElapsedTimePreset = (current: AutoTagCondition | undefined) =>
        {
            let list: number[] = [];
            if ("elapsed-time" === current?.type)
            {
                list.push(current.elapsedTime);
            }
            list.push(...Storage.Timespan.get());
            list.push(...config.timespanPreset.map(i => minamo.core.parseTimespan(i)).filter(isNumber).map(i => i / Domain.timeAccuracy));
            return list.filter(uniqueFilter).filter(takeFilter(config.timespanPresetMaxCount)).sort(minamo.core.comparer.basic);
        };
        export const getTodoPickupSettingElapsedTimeStandardScorePreset = ( current: AutoTagCondition | undefined) =>
        {
            let list: number[] = [];
            if ("elapsed-time-standard-score" === current?.type)
            {
                list.push(current.elapsedTimeStandardScore);
            }
            list.push(...Storage.TimespanStandardScore.get());
            list.push(...config.timespanStandardScorePreset);
            return list.filter(uniqueFilter).filter(takeFilter(config.timespanStandardScorePresetMaxCount)).sort(minamo.core.comparer.basic);
        };
        export const updateRecentlySelection = (setting: AutoTagCondition | undefined) =>
        {
            switch(setting?.type)
            {
            case "elapsed-time":
                Storage.Timespan.add(setting.elapsedTime);
                break;
            case "elapsed-time-standard-score":
                Storage.TimespanStandardScore.add(setting.elapsedTimeStandardScore);
                break;
            }
        };
        export const getAutoTagConditionText = (context: AutoTagConditionContext, setting: AutoTagCondition | undefined, option: "compact" | "full"): minamo.dom.Source =>
        {
            if (undefined === setting || null === setting)
            {
                switch(context)
                {
                case "list":
                    return label("pickup.never");
                case "sublist":
                case "root-todo":
                    return label("pickup.list");
                case "sublist-todo":
                    return label("pickup.sublist");
                }
            }
            else
            {
                switch(setting.type)
                {
                case "never":
                    return label("pickup.never");
                case "always":
                    return label("pickup.always");
                case "elapsed-time":
                    {
                        const format = (value: minamo.dom.Source) => "compact" === option ? value: [label("pickup.elapsed-time"), ": ", value];
                        if (isValidNumber(setting.elapsedTime))
                        {
                            return format(Domain.timeLongStringFromTick(setting.elapsedTime));
                        }
                        else
                        {
                            return format(label("pickup.specify"));
                        }
                    }
                case "elapsed-time-standard-score":
                    {
                        const format = (value: minamo.dom.Source) => "compact" === option ? value: [label("pickup.elapsed-time-standard-score"), ": ", value];
                        if (isValidNumber(setting.elapsedTimeStandardScore))
                        {
                            return format(`${setting.elapsedTimeStandardScore}`);
                        }
                        else
                        {
                            return format(label("pickup.specify"));
                        }
                    }
                case "expired":
                    return label("pickup.expired");
                }
            }
        };
        export const todoSpanSettingPopup = async (context: AutoTagConditionContext, title: string, field: locale.Label, setter: (value: AutoTagCondition | undefined) => unknown, getter: () => (AutoTagCondition | undefined)): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                const buttonList = $make(HTMLDivElement)({ className: "check-button-list" });
                const buttonListUpdate = async () => minamo.dom.replaceChildren
                (
                    buttonList,
                    await Promise.all
                    (
                        (
                            <(AutoTagCondition | undefined)[]>
                            [
                                undefined,
                                { type: "always" },
                                ...getTodoPickupSettingElapsedTimePreset(getter())
                                    .map(elapsedTime => ({ type: "elapsed-time", elapsedTime, })),
                                { type: "elapsed-time", NaN, },
                                ...getTodoPickupSettingElapsedTimeStandardScorePreset(getter())
                                    .map(elapsedTimeStandardScore => ({ type: "elapsed-time-standard-score", elapsedTimeStandardScore, })),
                                { type: "elapsed-time-standard-score", NaN, },
                                { type: "expired" },
                            ]
                        )
                        .map
                        (
                            async i =>
                            ({
                                tag: "button",
                                className: `check-button ${JSON.stringify(i) === JSON.stringify(getter()) ? "checked": ""}`,
                                children:
                                [
                                    await Resource.loadSvgOrCache("check-icon"),
                                    $span("")(getAutoTagConditionText(context, i, "full")),
                                ],
                                onclick: async () =>
                                {
                                    if ("elapsed-time" === i?.type && ! isValidNumber(i?.elapsedTime))
                                    {
                                        const elapsedTime = await dateTimeSpanPrompt
                                        (
                                            locale.map("pickup.elapsed-time"),
                                            (getter() as AutoTagConditionElapsedTime)?.elapsedTime ?? 0
                                        );
                                        if (null !== elapsedTime)
                                        {
                                            await setter({ type: "elapsed-time", elapsedTime, });
                                            result = true;
                                            await buttonListUpdate();
                                        }
                                    }
                                    else
                                    if ("elapsed-time-standard-score" === i?.type && ! isValidNumber(i?.elapsedTimeStandardScore))
                                    {
                                        const elapsedTimeStandardScore = await numberPrompt
                                        (
                                            locale.map("pickup.elapsed-time-standard-score"),
                                            (getter() as AutoTagConditionElapsedTimeStandardScore)?.elapsedTimeStandardScore ?? 50,
                                            { min: 0, max: 100, }
                                        );
                                        if (null !== elapsedTimeStandardScore)
                                        {
                                            await setter({ type: "elapsed-time-standard-score", elapsedTimeStandardScore, });
                                            result = true;
                                            await buttonListUpdate();
                                        }
                                    }
                                    else
                                    {
                                        await setter(i);
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            }),
                        )
                    )
                );
                await buttonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        $tag("h2")("")(`${locale.map(field)}: ${title}`),
                        buttonList,
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
                    onClose: async () =>
                    {
                        updateRecentlySelection(getter());
                        resolve(result);
                    },
                });
            }
        );
        export const todoFlashSettingPopup = async (context: AutoTagConditionContext, title: string, setter: (value: AutoTagSettings) => unknown, getter: () => AutoTagSettings): Promise<boolean> =>
            await todoSpanSettingPopup
            (
                context,
                title,
                "Flash setting",
                async value =>
                {
                    const settings = getter();
                    settings.flash = value;
                    setter(settings);
                    //settings.flash = value;
                    //OldStorage.TodoSettings.set(pass, entry.task, settings);
                    await updateScreen("operate");
                },
                () => getter().flash
            );
        export const todoPickupSettingPopup = async (context: AutoTagConditionContext, title: string, setter: (value: AutoTagSettings) => unknown, getter: () => AutoTagSettings): Promise<boolean> =>
            await todoSpanSettingPopup
            (
                context,
                title,
                "Pickup setting",
                async value =>
                {
                    const settings = getter();
                    settings.pickup = value;
                    setter(settings);
                    // settings.pickup = value;
                    // OldStorage.TodoSettings.set(pass, entry.task, settings);
                    await updateScreen("operate");
                },
                () => getter().pickup
            );
        export const todoRestrictionSettingPopup = async (context: AutoTagConditionContext, title: string, setter: (value: AutoTagSettings) => unknown, getter: () => AutoTagSettings): Promise<boolean> =>
            await todoSpanSettingPopup
            (
                context,
                title,
                "Restriction setting",
                async value =>
                {
                    const settings = getter();
                    settings.restriction = value;
                    setter(settings);
                    // settings.restriction = value;
                    // OldStorage.TodoSettings.set(pass, entry.task, settings);
                    await updateScreen("operate");
                },
                () => getter().restriction
            );
        export const autoTagSettingsPopup = async (context: AutoTagConditionContext, title: string, setter: (value: AutoTagSettings) => unknown, getter: () => AutoTagSettings): Promise<boolean> => await new Promise
        (
            async resolve =>
            {
                let result = false;
                // const context = OldStorage.Task.isRoot(entry.task) ?
                //     "root-todo":
                //     "sublist-todo";
                const buttonList = $make(HTMLDivElement)({ className: "label-button-list" });
                const buttonListUpdate = async () =>
                {
                    const settings = getter();
                    minamo.dom.replaceChildren
                    (
                        buttonList,
                        [
                            descriptionButton
                            (
                                "",
                                [
                                    await Resource.loadSvgOrCache(Resource.getTagIcon("@flash")),
                                    monospace("", label("@flash"), getAutoTagConditionText(context, settings.flash, "compact"))
                                ],
                                "flash.description",
                                async () =>
                                {
                                    if (await todoFlashSettingPopup(context, title, setter, getter))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                [
                                    await Resource.loadSvgOrCache(Resource.getTagIcon("@pickup")),
                                    monospace("", label("@pickup"), getAutoTagConditionText(context, settings.pickup, "compact")),
                                ],
                                "pickup.description",
                                async () =>
                                {
                                    if (await todoPickupSettingPopup(context, title, setter, getter))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                            descriptionButton
                            (
                                "",
                                [
                                    await Resource.loadSvgOrCache(Resource.getTagIcon("@restriction")),
                                    monospace("", label("@restriction"), getAutoTagConditionText(context, settings.restriction, "compact")),
                                ],
                                "restriction.description",
                                async () =>
                                {
                                    if (await todoRestrictionSettingPopup(context, title, setter, getter))
                                    {
                                        result = true;
                                        await buttonListUpdate();
                                    }
                                }
                            ),
                        ]
                    );
                    };
                await buttonListUpdate();
                const ui = popup
                ({
                    // className: "add-remove-tags-popup",
                    children:
                    [
                        //$tag("h2")("")(`${locale.map("Auto tag settings")}: ${Model.decode(entry.task)}`),
                        $tag("h2")("")(`${locale.map("Auto tag settings")}: ${title}`),
                        buttonList,
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
                    onClose: async () =>
                    {
                        resolve(result);
                    },
                });
            }
        );
        export const todoAutoTagSettingsPopup = async (pass: string, item: ToDoEntry): Promise<boolean> => await autoTagSettingsPopup
        (
            OldStorage.Task.isRoot(item.task) ?
                "root-todo":
                "sublist-todo",
            Model.decode(item.task),
            value => OldStorage.TodoSettings.set(pass, item.task, value),
            () => OldStorage.TodoSettings.get(pass, item.task)
        );
        export const screenCover = (data: { parent?: HTMLElement | null, children?: minamo.dom.Source, onclick: () => unknown, eventListener?: minamo.dom.EventListenerSource, }) =>
        {
            updateLatestScreenOperatedAt();
            const dom = $make(HTMLDivElement)
            ({
                parent: data.parent ?? document.body,
                tag: "div",
                className: "screen-cover fade-in",
                children: data.children,
                onclick: async () =>
                {
                    dom.onclick = null;
                    data.onclick();
                    close();
                },
                eventListener: data.eventListener,
            });
            const close = async () =>
            {
                updateLatestScreenOperatedAt();
                // dom.classList.remove("fade-in");
                // dom.classList.add("fade-out");
                // await minamo.core.timeout(500);
                minamo.dom.remove(dom);
                if ( ! hasScreenCover())
                {
                    minamo.dom.toggleCSSClass(Render.getScreen(), "covered", false);
                }
            };
            const result =
            {
                dom,
                close,
            };
            minamo.dom.toggleCSSClass(Render.getScreen(), "covered", true);
            return result;
        };
        export const getScreenCoverList = () => Array.from(document.getElementsByClassName("screen-cover")) as HTMLDivElement[];
        export const getScreenCover = () => getScreenCoverList().filter((_i, ix, list) => (ix +1) === list.length)[0];
        export const hasScreenCover = () => 0 < getScreenCoverList().length;
        export interface Popup
        {
            dom: HTMLDivElement;
            close: () => Promise<unknown>;
        };
        export const toggleCoverPopup = (current: Popup | undefined, cover: boolean) =>
        {
            if (current)
            {
                minamo.dom.toggleCSSClass(current.dom, "covered", cover);
            }
        };
        export const coverPopup = (current: Popup | undefined) => toggleCoverPopup(current, true);
        export const uncoverPopup = (current: Popup | undefined) => toggleCoverPopup(current, false);
        export const waitPopup = async <T>(next: () => Promise<T>) =>
        {
            const current = getCurrentPopup();
            try
            {
                coverPopup(current);
                return await next();
            }
            finally
            {
                uncoverPopup(current);
            }
        };
        export const popupStack: Popup[] = [];
        export const getCurrentPopup = () => popupStack[popupStack.length -1];
        export const pushPopup = (current: Popup) => popupStack.push(current);
        export const popPopup = (current: Popup) => popupStack.splice(popupStack.findIndex(i => current === i), 1);
        export const popup =
        (
            data:
            {
                className?: string,
                children: minamo.dom.Source,
                onClose?: () => Promise<unknown>
            }
        ): Popup =>
        {
            const parent = getCurrentPopup();
            coverPopup(parent);
            const dispose = async () =>
            {
                await data?.onClose?.();
                popPopup(result);
                uncoverPopup(parent);
            };
            const dom = $make(HTMLDivElement)
            ({
                tag: "div",
                className: `popup ${data.className ?? ""}`,
                children: data.children,
                onclick: async (event: MouseEvent) =>
                {
                    event.stopPropagation();
                    //(Array.from(document.getElementsByClassName("screen-cover")) as HTMLDivElement[]).forEach(i => i.click());
                },
            });
            const close = async () =>
            {
                await dispose();
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
                    await dispose();
                    //minamo.dom.remove(dom);
                },
            });
            const result =
            {
                dom,
                close,
            };
            pushPopup(result);
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
                    cover?.close();
                    close();
                },
            });
            const button = $make(HTMLButtonElement)
            ({
                tag: "button",
                className: "menu-button",
                attributes:
                {
                    tabindex: "0",
                },
                children:
                [
                    await Resource.loadSvgOrCache("ellipsis-icon"),
                ],
                onclick: async (event: MouseEvent) =>
                {
                    event.stopPropagation();
                    if ("function" === typeof menu)
                    {
                        minamo.dom.replaceChildren(popup, await menu());
                    }
                    else
                    {
                        Array.from(popup.children ?? []).forEach(i => i.classList.remove("opened"));
                    }
                    popup.classList.add("show");
                    const buttonRect = button.getBoundingClientRect();
                    if (buttonRect.top < window.innerHeight *(2 /3))
                    {
                        popup.style.top = `${buttonRect.bottom}`;
                        popup.style.removeProperty("bottom");
                    }
                    else
                    {
                        popup.style.removeProperty("top");
                        popup.style.bottom = `${window.innerHeight -buttonRect.top}`;
                    }
                    popup.style.right = `${window.innerWidth -buttonRect.right}`;
                    cover = screenCover
                    ({
                        // parent: popup.parentElement,
                        children: popup,
                        onclick: close,
                    });
                },
            });
            // return [ button, popup, ];
            return button;
        };
        export const menuItem = (children: minamo.dom.Source, onclick?: (event: MouseEvent | TouchEvent) => unknown, className?: string) =>
        ({
            tag: "button",
            className,
            children,
            onclick,
        });
        export const menuLinkItem = (children: minamo.dom.Source, href: PageParams, className?: string) => internalLink
        ({
            href,
            children: menuItem(children, undefined, className),
        });
        export const menuExteralLinkItem = (children: minamo.dom.Source, href: string, className?: string) => externalLink
        ({
            href,
            children: menuItem(children, undefined, className),
        });
        export const systemSettingsMenuItem = () => menuItem
        (
            label("System settings"),
            async () =>
            {
                if (await systemSettingsPopup())
                {
                    await reload();
                }
            }
        );
        export const listSettingsMenuItem = (pass: string) => menuItem
        (
            label("List settings"),
            async () =>
            {
                if (await listSettingsPopup(pass))
                {
                    //await reload();
                }
            }
        );
        export const menuSeparator = () => ({ tag: "div", className: "menu-separator", });
        export const renameTag = async (entry: { pass: string, tag: string, }, hash?: string) =>
        {
            let result = false;
            if (Model.isSublistOld(entry.tag))
            {
                const newTag = minamo.core.nullable(Model.encodeSublist)(await prompt(locale.map("Input a sublist's name."), Model.decodeSublist(entry.tag)));
                if (null !== newTag && 0 < newTag.length && newTag !== entry.tag)
                {
                    if (OldStorage.Tag.rename(entry.pass, entry.tag, newTag))
                    {
                        await showUrl({ pass: entry.pass, tag: newTag, hash });
                        result = true;
                    }
                    else
                    {
                        alert(locale.map("A sublist with that name already exists."));
                    }
                }
            }
            else
            {
                const newTag = await prompt(locale.map("Input a tag's name."), entry.tag);
                if (null !== newTag && 0 < newTag.length && newTag !== entry.tag)
                {
                    if (OldStorage.Tag.rename(entry.pass, entry.tag, newTag))
                    {
                        await showUrl({ pass: entry.pass, tag: newTag, hash });
                        result = true;
                    }
                    else
                    {
                        alert(locale.map("A tag with that name already exists."));
                    }
                }
            }
            return result;
        };
        export const renameTagMenuItem = (entry: ToDoTagEntryOld, hash?: string) => menuItem
        (
            label("Rename"),
            async () => await renameTag(entry, hash)
        );
        export const backToListMenuItem = (pass: string, tag: string = "@overall") => menuLinkItem
        (
            label("Back to List"),
            { pass, tag, },
        );
        export const importListMenuItem = () => menuLinkItem
        (
            label("Import List"),
            { hash: "import", }
        );
        export const removedListMenuItem = () => menuLinkItem
        (
            label("@deleted"),
            { hash: "removed", }
        );
        export const exportListMenuItem = (pass: string) => menuLinkItem
        (
            label("Export"),
            { pass, hash: "export", }
        );
        export const newTaskMenuItem = (entry: { pass: string, tag: string, }) => menuItem
        (
            label("New ToDo"),
            async () => newTaskPopup(entry, getFilterText())
        );
        export const repositoryMenuItem = () => menuExteralLinkItem
        (
            labelSpan("GitHub"),
            config.repositoryUrl
        );
        export const editTickMenuItem = async (pass: string, task: string, tick: number) => menuItem
        (
            label("Edit"),
            async () =>
            {
                const result = Domain.parseDate(await dateTimePrompt(`${locale.map("Edit")}: ${Model.decode(task)}`, tick));
                if (null !== result && tick !== Domain.getTicks(result) && 0 <= Domain.getTicks(result) && Domain.getTicks(result) <= Domain.getTicks())
                {
                    OldStorage.History.removeTickRaw(pass, task, tick);
                    OldStorage.History.addTick(pass, task, Domain.getTicks(result));
                    await reload();
                }
            }
        );
        export const deleteTickMenuItem = async (pass: string, task: string, tick: number) => menuItem
        (
            label("Delete"),
            async () =>
            {
                OldStorage.History.removeTick(pass, task, tick);
                await reload();
            },
            "delete-button"
        );
        export const informationSimple = (entry: ToDoTagEntryOld, item: ToDoEntry, progressScaleShowStyle: "none" | "full", operator: minamo.dom.Source) => $div
        ({
            className: "item-information simple",
            attributes: { style: progressScaleStyle(item, progressScaleShowStyle, OldStorage.TodoSettings.getEvaluatedAutoTagSettings(entry.pass, item.task)), },
        })
        ([
            itemProgressBar(entry.pass, item, "with-pad"),
            $div("foreground")
            ([
                $div
                ({
                    className: "primary",
                    onclick: () => getScreenBody().classList.toggle("show-second-panel"),
                })
                ([
                    monospace(Domain.timeSimpleStringFromTick(item.elapsed)),
                    monospace(`+${item.count.toLocaleString()}`),
                ]),
                operator,
            ]),
        ]);
        // export const informationCount = (entry: ToDoTagEntryOld, item: ToDoEntry, progressScaleShowStyle: "none" | "full") => $div
        // ({
        //     className: "item-information",
        //     attributes: { style: progressScaleStyle(item, progressScaleShowStyle, OldStorage.TodoSettings.getEvaluatedAutoTagSettings(entry.pass, item.task)), }
        // })
        // ([
        //     itemProgressBar(entry.pass, item, "with-pad"),
        //     monospace("primary", item.count.toLocaleString()),
        // ]);
        export const informationDigest = (entry: ToDoTagEntryOld, item: ToDoEntry, progressScaleShowStyle: "none" | "full") => $div
        ({
            className: "item-information",
            attributes: { style: progressScaleStyle(item, progressScaleShowStyle, OldStorage.TodoSettings.getEvaluatedAutoTagSettings(entry.pass, item.task)), }
        })
        ([
            itemProgressBar(entry.pass, item, "with-pad"),
            $div("item-params")
            ([
                // monospace("task-count", "smartRest", null === item.smartRest ? "N/A": item.smartRest.toLocaleString()),
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
                monospace("task-last-timestamp", label("previous"), Domain.dateStringFromTick(item.previous)),
            ]),
        ]);
        export const paramSeparator = () => ({ tag: "div", className: "param-separator", });
        export const informationFull = (entry: { pass: string, }, item: ToDoEntry, progressScaleShowStyle: "none" | "full") => $div
        ({
            className: "item-information",
            attributes: { style: progressScaleStyle(item, progressScaleShowStyle, OldStorage.TodoSettings.getEvaluatedAutoTagSettings(entry.pass, item.task)), }
        })
        ([
            itemProgressBar(entry.pass, item, "with-pad"),
            $div("item-params")
            ([
                // monospace("task-count", "smartRest", null === item.smartRest ? "N/A": item.smartRest.toLocaleString()),
                monospace("task-elapsed-time", label("elapsed time"), Domain.timeLongStringFromTick(item.elapsed)),
                paramSeparator(),
                monospace("task-interval-average", label("recentrly interval average"), Domain.timeLongStringFromTick(item.RecentlyAverage)),
                monospace("task-interval-average", label("recentrly interval average (rounding)"), Domain.timeLongStringFromTick(item.RecentlyAverageFactors?.rounding ?? null)),
                monospace("task-interval-average", label("recentrly interval average (offset)"), Domain.timeLongStringFromTick(item.RecentlyAverageFactors?.offset ?? null)),
                paramSeparator(),
                monospace("task-interval-average", label("total interval average"), Domain.timeLongStringFromTick(item.TotalAverage)),
                monospace("task-interval-average", label("total interval average (rounding)"), Domain.timeLongStringFromTick(item.TotalAverageFactors?.rounding ?? null)),
                monospace("task-interval-average", label("total interval average (offset)"), Domain.timeLongStringFromTick(item.TotalAverageFactors?.offset ?? null)),
                paramSeparator(),
                // monospace("task-interval-average", $span("label")("expected interval average (予想間隔平均):"), renderTime(item.smartAverage)),
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
                paramSeparator(),
                monospace("task-first-time", label("first time"), Domain.dateStringFromTick(item.first)),
                monospace("task-last-timestamp", label("previous"), Domain.dateStringFromTick(item.previous)),
                paramSeparator(),
                monospace("task-count", label("count"), item.count.toLocaleString()),
            ]),
        ]);
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
                const sublist = OldStorage.Task.getSublist(item.task) ?? "";
                const oldTask = OldStorage.Task.decode(OldStorage.Task.getBody(item.task));
                const newTask = await prompt(locale.map("Input a ToDo's name."), oldTask);
                if (null !== newTask && 0 < newTask.length && newTask !== oldTask)
                {
                    const newTaskFullname = `${sublist}${OldStorage.Task.encode(newTask)}`;
                    if (OldStorage.Task.rename(pass, item.task, newTaskFullname))
                    {
                        await onRename(OldStorage.Task.decode(newTaskFullname));
                    }
                    else
                    {
                        alert(locale.map("A ToDo with that name already exists."));
                    }
                }
            }
        );
        export const todoTagMenu = (pass: string, item: ToDoEntry) =>
        [
            menuItem
            (
                label("Auto tag settings"),
                async () =>
                {
                    if (await todoAutoTagSettingsPopup(pass, item))
                    {
                        updateScreen("operate");
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
                        updateScreen("operate");
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
                        updateScreen("operate");
                    }
                }
            ),
        ];
        export const todoDeleteMenu =
        (
            pass: string,
            item: ToDoEntry,
            onDelete: () => Promise<unknown> = async () => await reload(),
            onCanceled: () => Promise<unknown> = async () => await reload()
        ) => menuItem
        (
            label("Delete"),
            async () =>
            {
                OldStorage.Task.remove(pass, item.task);
                //Storage.TagMember.add(pass, "@deleted", item.task);
                await onDelete();
                const toast = makeToast
                ({
                    content: $span("")(`${locale.map("ToDo has been deleted!")}: ${Model.decode(item.task)}`),
                    backwardOperator: cancelTextButton
                    (
                        async () =>
                        {
                            const removedItem = OldStorage.Removed.get(pass).filter(i => isRemovedTask(i) && item.task === i.name)[0];
                            OldStorage.Removed.restore(pass, removedItem);
                            toast.hide(); // nowait
                            onCanceled();
                        }
                    ),
                });
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
        export const todoItemTags = async (pass: string, item: ToDoEntry) => $div("item-tags")
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
        );
        export const todoItemSettings = async (pass: string, item: ToDoEntry) =>
        {
            const settings = OldStorage.TodoSettings.get(pass, item.task);
            const evaluatedSettings = OldStorage.TodoSettings.getEvaluatedAutoTagSettings(pass, item.task);
            const makeLinkButton = (icon: SVGElement, solid: boolean) => result.push
            (
                linkButton
                ({
                    className: solid ? "tag": "tag shadow-tag",
                    children: icon,
                    onclick: async (event: MouseEvent) =>
                    {
                        event.preventDefault();
                        if (await todoAutoTagSettingsPopup(pass, item))
                        {
                            updateScreen("operate");
                        }
                    },
                })
            );
            const result: minamo.dom.Source[] = [];
            if (null !== (evaluatedSettings.flash ?? null))
            {
                makeLinkButton
                (
                    await Resource.loadTagSvgOrCache("@flash"),
                    Boolean(settings.flash)
                );
            }
            if (null !== (evaluatedSettings.pickup ?? null))
            {
                makeLinkButton
                (
                    await Resource.loadTagSvgOrCache("@pickup"),
                    Boolean(settings.pickup)
                );
            }
            if (null !== (evaluatedSettings.restriction ?? null))
            {
                makeLinkButton
                (
                    await Resource.loadTagSvgOrCache("@restriction"),
                    Boolean(settings.restriction)
                );
            }
            if (result.length <= 0)
            {
                makeLinkButton
                (
                    await Resource.loadSvgOrCache("settings-icon"),
                    true
                );
            }
            return $div("item-settings")(result);
        };
        export const todoItem = async (entry: ToDoTagEntryOld, item: ToDoEntry, displayStyle: TagSettings["displayStyle"], progressScaleShowStyle: "none" | "full") =>
        {
            let isFirst = true;
            let itemDom: HTMLDivElement;
            const onUpdate = async () =>
            {
                await updatingScreenBody();
                Object.assign(item, Domain.getToDoEntryOld(entry.pass, item.task));
                await updateScreen("operate");
                await updatedScreenBody();
            };
            const onDone = async () =>
            {
                itemDom.classList.add("fade-and-slide-out");
                await minamo.core.timeout(500);
                await onUpdate();
            };
            const sublist = OldStorage.Task.getSublist(item.task);
            const title = $span("item-title-frame")
            ([
                Model.isSublistOld(entry.tag) || null === sublist ? []:
                [
                    internalLink
                    ({
                        className: "item-title-sublist",
                        href: { pass: entry.pass, tag: sublist, },
                        children:
                        [
                            await Resource.loadSvgOrCache("folder-icon"),
                            Model.decodeSublist(sublist),
                        ],
                    }),
                ],
                internalLink
                ({
                    className: "item-title-body",
                    href: { pass: entry.pass, todo: item.task, },
                    children:
                    [
                        await Resource.loadSvgOrCache(getTodoIcon(entry, item)),
                        Model.isSublistOld(entry.tag) || null !== sublist ?
                            Model.decode(OldStorage.Task.getBody(item.task)):
                            Model.decode(item.task)
                    ]
                }),
            ]);
            const operator = $div
            ({
                className: "item-operator",
                onclick: (event: MouseEvent) => event.stopPropagation(),
            })
            ([
                {
                    tag: "button",
                    className: item.isDefault ? "default-button main-button": "main-button",
                    attributes:
                    {
                        tabindex: "0",
                    },
                    children: label("Done"),
                    onclick: async () =>
                    {
                        //if (isSessionPass(pass))
                        const fxxkingTypeScriptCompiler = OldStorage.isSessionPass(entry.pass);
                        if (fxxkingTypeScriptCompiler)
                        {
                            alert
                            (
                                locale.string
                                (
                                    "This is view mode. If this is your to-do list, open the original URL instead of the sharing URL. If this is not your to-do list, you can copy this to-do list from edit mode.\n"
                                    +"\n"
                                    +"これは表示モードです。これが貴方が作成したToDoリストならば、共有用のURLではなくオリジナルのURLを開いてください。これが貴方が作成したToDoリストでない場合、編集モードからこのToDoリストをコピーできます。"
                                )
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
                                    item,
                                    MigrateBridge.getDoneTicks(entry.pass),
                                    onUpdate
                                );
                                await onDone();
                            }
                        }
                    }
                },
                await button
                (
                    "icon-button",
                    await Resource.loadSvgOrCache("settings-icon"),
                    async () =>
                    {
                        if (await todoSettingsPopup(entry.pass, item))
                        {
                            await reload();
                        }
                    }
                ),
                // await menuButton
                // ([
                //     todoRenameMenu(entry.pass, item),
                //     todoTagMenu(entry.pass, item),
                //     todoDeleteMenu(entry.pass, item),
                // ]),
            ]);
            const header = $div("item-header")
            (
                "simple" !== displayStyle ?
                    [ title, operator, ]:
                    title
            );
            switch(displayStyle)
            {
            case "compact":
                itemDom = $make(HTMLDivElement)
                (
                    $div
                    ({
                        className: "task-item flex-item",
                        attributes: { style: progressScaleStyle(item, progressScaleShowStyle, OldStorage.TodoSettings.getEvaluatedAutoTagSettings(entry.pass, item.task)), }
                    })
                    ([
                        itemProgressBar(entry.pass, item),
                        header,
                    ])
                );
                break;
            case "simple":
                itemDom = $make(HTMLDivElement)
                (
                    $div("task-item flex-item")
                    ([
                        header,
                        informationSimple(entry, item, progressScaleShowStyle, operator),
                    ])
                );
                break;
            default: // "full" | "digest"
                itemDom = $make(HTMLDivElement)
                (
                    $div("task-item flex-item")
                    ([
                        header,
                        $div("item-attribute-frame")
                        (
                            $div("item-attribute")
                            ([
                                await todoItemTags(entry.pass, item),
                                await todoItemSettings(entry.pass, item),
                            ])
                        ),
                        "digest" === displayStyle ?
                            informationDigest(entry, item, progressScaleShowStyle):
                            informationFull(entry, item, progressScaleShowStyle),
                    ])
                );
                break;
            }
            return itemDom
        };
        export const historyItem = async (entry: ToDoTagEntryOld, item: { task: string, tick: number | null }) => $div("history-item flex-item ")
        ([
            $div("item-information")
            ([
                internalLink
                ({
                    className: "item-title",
                    href: { pass: entry.pass, todo: item.task, },
                    children:
                    [
                        await Resource.loadSvgOrCache("tick-icon"),
                        Model.decode(item.task)
                    ],
                }),
                monospace("tick-timestamp", label("timestamp"),Domain.dateStringFromTick(item.tick)),
            ]),
            $div("item-operator")
            (
                null !== item.tick ?
                [
                    await menuButton
                    ([
                        await editTickMenuItem(entry.pass, item.task, item.tick),
                        await deleteTickMenuItem(entry.pass, item.task, item.tick),
                    ]),
                ]:
                []
            ),
        ]);
        export const tickScale = (max: number | null): number | null =>
        {
            if ("number" === typeof max)
            {
                const first = Domain.tickScalePreset.filter(i => 3 <= max /i)[0];
                if ("number" === typeof first)
                {
                    return first /max;
                }
            }
            return null;
        };
        export const tickScaleStyle = (percent: number | null) =>
            "number" === typeof percent ?
                `background: repeating-linear-gradient(90deg, #00000000, #00000000 calc(${toPercentSting(percent)} - 1px), #88888844 calc(${toPercentSting(percent)} - 1px), #88888844 ${toPercentSting(percent)});`:
                "";
        export const tickItem = async (pass: string, item: ToDoEntry, tick: number, interval: number | null, max: number | null, isFlashed: boolean = OldStorage.TodoSettings.isFlashTarget(pass, item, interval), isPickuped: boolean = OldStorage.TodoSettings.isPickupTarget(pass, item, interval), isRestrictioned: boolean = OldStorage.TodoSettings.isRestrictionTarget(pass, item, interval)) =>
        $div
        ({
            className: "tick-item flex-item",
            attributes: { style: tickScaleStyle(tickScale(max)), }
        })
        ([
            progressBar
            (
                null === interval || null === max || max < interval ? null: interval /max,
                isRestrictioned ? "restriction":
                isFlashed ? "flash":
                isPickuped ? "pickup":
                "default"
            ),
            await Resource.loadSvgOrCache
            (
                isRestrictioned ? "forbidden-icon":
                // isFlashed ? "flash-icon":
                // isPickuped ? "pickup-icon":
                null === interval || null === max ? "one-icon":
                max < interval ? "sleep-icon":
                "tick-icon"
            ),
            $div("item-information")
            ([
                monospace("tick-interval", label("interval"), Domain.timeLongStringFromTick(interval)),
                monospace("tick-timestamp", label("timestamp"),Domain.dateStringFromTick(tick)),
            ]),
            $div("item-operator")
            ([
                await menuButton
                ([
                    await editTickMenuItem(pass, item.task, tick),
                    await deleteTickMenuItem(pass, item.task, tick),
                ]),
            ])
        ]);
        export const dropDownLabel = (options: { list: string[] | { [value: string]: string }, value: string, onChange?: (value: string) => unknown, className?: string}) =>
        {
            const dropdown = $make(HTMLSelectElement)
            ({
                className: options.className,
                children: Array.isArray(options.list) ?
                    options.list.map(i => ({ tag: "option", value: i, children: i, selected: options.value === i ? true: undefined, })):
                    Object.keys(options.list).map(i => ({ tag: "option", value: i, children: (<{ [value: string]: string }>options.list)[i] ?? i, selected: options.value === i ? true: undefined, })),
                onchange: () =>
                {
                    if (labelSoan.innerText !== dropdown.value)
                    {
                        labelSoan.innerText = Array.isArray(options.list) ?
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
                href: { pass: entry.pass, tag: entry.tag, hash: "history", },
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
            footer?: minamo.dom.Source;
        }
        const getLastSegmentClass = (data: HeaderSource, ix: number) => ix === data.items.length -1 ?
            //(! data.operator ? "last-segment fill-header-segment": "last-segment"): undefined;
            "last-segment": undefined;
        export const screenSegmentedHeader = async (data: HeaderSource) =>
        [
            $div("progress-bar")([]),
            (
                await Promise.all
                (
                    data.items
                    .map
                    (
                        async (item, ix) =>
                            (item.href && item.menu && screenHeaderLinkPopupSegment(<any>item, getLastSegmentClass(data,ix))) ||
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
                monospace("header-timestamp", headerTimestamp()),
            ])
        ];
        export const headerTimestamp = () =>
        {
            const now = new Date();
            const day = locale.map(`week.short.${now.getDay()}` as locale.Label);
            const tick = Domain.getTicks(now);
            return `${Domain.dateCoreStringFromTick(tick)}(${day}) ${Domain.timeCoreStringFromTick(Domain.getTime(tick))}:${("00" +now.getSeconds()).slice(-2)}`;
        };
        export const updateHeaderTimestamp = () =>
        {
            const frame = document.getElementsByClassName("header-timestamp")[0];
            if (frame)
            {
                const value = frame.getElementsByClassName("value")[0];
                if (value)
                {
                    minamo.dom.setProperty(value, "innerText", headerTimestamp());
                }
            }
        };
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
                    if ("function" === typeof item.menu)
                    {
                        minamo.dom.replaceChildren(popup, await item.menu());
                    }
                    else
                    {
                        Array.from(popup.children ?? []).forEach(i => i.classList.remove("opened"));
                    }
                    popup.classList.add("show");
                    //popup.style.height = `${popup.offsetHeight -2}px`;
                    popup.style.width = `${popup.offsetWidth -2}px`;
                    popup.style.top = `${segment.offsetTop +segment.offsetHeight}px`;
                    popup.style.left = `${Math.max(segment.offsetLeft, 4)}px`;
                    cover = screenCover
                    ({
                        // parent: popup.parentElement,
                        children: popup,
                        onclick: close,
                    });
                    (Array.from(popup.children ?? []).filter(i => i.classList.contains("group-item") && i.classList.contains("current-item"))[0] as HTMLButtonElement)?.click();
                },
            });
            // return [ segment, popup, ];
            return segment;
        };
        export const screenHeaderLinkPopupSegment = async (item: HeaderSegmentSource & { href: PageParams; }, className: string = "") =>
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
                    cover?.close();
                    close();
                },
            });
            const showMenu = async () =>
            {
                if ("function" === typeof item.menu)
                {
                    minamo.dom.replaceChildren(popup, await item.menu());
                }
                else
                {
                    Array.from(popup.children ?? []).forEach(i => i.classList.remove("opened"));
                }
                popup.classList.add("show");
                //popup.style.height = `${popup.offsetHeight -2}px`;
                popup.style.width = `${popup.offsetWidth -2}px`;
                popup.style.top = `${segment.offsetTop +segment.offsetHeight}px`;
                popup.style.left = `${Math.max(segment.offsetLeft, 4)}px`;
                cover = screenCover
                ({
                    // parent: popup.parentElement,
                    children: popup,
                    onclick: close,
                });
                (Array.from(popup.children ?? []).filter(i => i.classList.contains("group-item") && i.classList.contains("current-item"))[0] as HTMLButtonElement)?.click();
            };
            const longPressTimer = new minamo.core.Timer(showMenu, 300);
            const mousedown = (event: MouseEvent) =>
            {
                event.preventDefault();
                longPressTimer.set();
            };
            const mouseup = async () =>
            {
                if (longPressTimer.isWaiting())
                {
                    longPressTimer.clear();
                    await showUrl(item.href);
                }
            };
            const segment = $make(HTMLDivElement)
            ({
                tag: "div",
                className: `segment ${className}`,
                children: await screenHeaderSegmentCore(item),
                eventListener:
                {
                    mousedown: mousedown,
                    touchstart: mousedown,
                    mouseup: mouseup,
                    touchend: mouseup,
                    contextmenu: async (event: MouseEvent) =>
                    {
                        event.stopPropagation();
                        event.preventDefault();
                        longPressTimer.clear();
                        await showMenu();
                    }
                },
            });
            // return [ segment, popup, ];
            return segment;
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
                menuSeparator(),
                menuItem
                (
                    [
                        await Resource.loadSvgOrCache("add-list-icon"),
                        label("New ToDo List"),
                    ],
                    newListPrompt,
                ),
                menuLinkItem
                (
                    [
                        await Resource.loadSvgOrCache("import-icon"),
                        label("Import List"),
                    ],
                    { hash: "import", },
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
            href: { pass, tag: "@overall", },
            menu: await screenHeaderListSegmentMenu(pass),
        });
        export const screenHeaderListMenuSegment = async (pass: string): Promise<HeaderSegmentSource> =>
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
        export const getTagList = (params: string | { overall?: boolean, pass?: string, sublist?: boolean, tag?: boolean, auto?: boolean, term?: boolean, }): string[] =>
        {
            if ("string" === typeof params)
            {
                return getTagList({ overall: true, pass: params, sublist: true, tag: true, auto: true, term: true, });
            }
            else
            {
                const result: string[] = [];
                if (params.overall)
                {
                    result.push("@overall");
                }
                if (params.term)
                {
                    result.push("@short-term", "@medium-term", "@long-term", "@irregular-term");
                }
                if (params.auto)
                {
                    result.push("@flash", "@pickup", "@regular", "@restriction");
                }
                if ("string" === typeof params.pass)
                {
                    const base = OldStorage.Tag.get(params.pass);
                    if (params.sublist)
                    {
                        result.push
                        (
                            ...base
                                .filter(i => Model.isSublistOld(i))
                                .sort(Domain.tagComparerOld(params.pass))
                        );
                        result.push("@:@root");
                    }
                    if (params.tag)
                    {
                        result.push
                        (
                            ...base
                                .filter(i => ! Model.isSublistOld(i))
                                .sort(Domain.tagComparerOld(params.pass))
                        );
                        result.push("@untagged", "@unoverall");
                    }
                }
                return result;
            }
        };
        export const groupMenuItem = async <KeyType>(current: KeyType, representative: minamo.dom.Source, members: { id: KeyType, item: minamo.dom.Source, }[]) =>
        {
            const is_current = 0 <= members.map(i => i.id).indexOf(current);
            const menu = members.map(i => i.item);
            const popup = $make(HTMLDivElement)
            ({
                tag: "div",
                className: "menu-popup",
                children: menu,
            });
            const button = $make(HTMLButtonElement)
            ({
                tag: "button",
                className: `group-item ${is_current ? "current-item": ""}`,
                attributes:
                {
                    tabindex: "0",
                },
                children:
                [
                    representative,
                    await Resource.loadSvgOrCache("right-chevron-icon"),
                ],
                onclick: async (event: MouseEvent) =>
                {
                    event.stopPropagation();
                    const opened = button.classList.contains("opened");
                    Array.from(button.parentElement?.children ?? []).forEach(i => i.classList.remove("opened"));
                    Array.from(getScreenCover().children).filter(i => i !== button.parentElement).forEach(i => i.classList.remove("show"))
                    if ( ! opened)
                    {
                        button.classList.add("opened");
                        getScreenCover().appendChild(popup);
                        popup.classList.add("show");
                        const buttonRect = button.getBoundingClientRect();
                        if (buttonRect.right < window.innerWidth *(2 /3))
                        {
                            if (buttonRect.top < window.innerHeight *(2 /3))
                            {
                                popup.style.top = `${buttonRect.top}px`;
                                popup.style.removeProperty("bottom");
                            }
                            else
                            {
                                popup.style.removeProperty("top");
                                popup.style.bottom = `${window.innerHeight -buttonRect.bottom}px`;
                            }
                            popup.style.removeProperty("right");
                            popup.style.left = `${buttonRect.right}px`;
                        }
                        else
                        {
                            if (buttonRect.top < window.innerHeight *(2 /3))
                            {
                                popup.style.top = `${buttonRect.bottom}px`;
                                popup.style.removeProperty("bottom");
                            }
                            else
                            {
                                popup.style.removeProperty("top");
                                popup.style.bottom = `${window.innerHeight -buttonRect.top}px`;
                            }
                            popup.style.removeProperty("left");
                            popup.style.right = "4px";
                            const popupRect = popup.getBoundingClientRect();
                            if (buttonRect.right < popupRect.left)
                            {
                                popup.style.removeProperty("right");
                                popup.style.left = `${buttonRect.right}px`;
                            }
                        }
                    }
                },
            });
            // return [ button, popup, ];
            return button;
        };
        export const tagMenuItem = async (current: string, pass: string, tag: string): Promise<minamo.dom.Source> => menuLinkItem
        (
            [
                await Resource.loadTagSvgOrCache(tag),
                labelSpan(Domain.tagMap(tag)),
                monospace(`${OldStorage.TagMember.get(pass, tag).length}`)
            ],
            { pass, tag, },
            current === tag ? "current-item": undefined
        );
        export const screenHeaderTagSegmentMenu = async (pass: string, current: string): Promise<HeaderSegmentSource["menu"]> =>
            // (await Promise.all(getTagList({ pass, overall: true }).map(async tag => await tagMenuItem(current, pass, tag))))
            // .concat
            [
                await tagMenuItem(current, pass, "@overall"),
                menuLinkItem
                (
                    [
                        await Resource.loadSvgOrCache("history-icon"),
                        labelSpan(locale.map("History")),
                    ],
                    { pass, tag: "@overall", hash: "history", },
                    //current === "@deleted" ? "current-item": undefined
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
                menuSeparator(),
            ]
            .concat
            (
                await groupMenuItem
                (
                    current,
                    [ await Resource.loadSvgOrCache("ghost-term-icon"), label("Term"), ],
                    [
                        <{ id: string, item: minamo.dom.Source, }>
                        {
                            id: "@Term threshold settings",
                            item: menuItem
                            (
                                [
                                    await Resource.loadSvgOrCache("settings-icon"),
                                    label("Term threshold settings"),
                                                    ],
                                async () =>
                                {
                                    if (await termThresholdSettingsPopup(pass))
                                    {
                                        updateScreen("operate");
                                    }
                                }
                            ),
                        },
                        <{ id: string, item: minamo.dom.Source, }>
                        { id: "@separator", item: menuSeparator(), },
                    ]
                    .concat(await Promise.all(getTagList({ pass, term: true }).map(async tag => ({ id: tag, item: await tagMenuItem(current, pass, tag)}))))
                )
            )
            .concat
            (
                await groupMenuItem
                (
                    current,
                    [ await Resource.loadSvgOrCache("flag-icon"), label("Auto tag"), ],
                    await Promise.all(getTagList({ pass, auto: true }).map(async tag => ({ id: tag, item: await tagMenuItem(current, pass, tag)})))
                )
            )
            .concat
            (
                await groupMenuItem
                (
                    current,
                    [ await Resource.loadSvgOrCache("folder-icon"), label("Sublist"), ],
                    [
                        <{ id: string, item: minamo.dom.Source, }>
                        {
                            id: "@new",
                            item: menuItem
                            (
                                [
                                    await Resource.loadSvgOrCache("add-folder-icon"),
                                    label("@new-sublist"),
                                ],
                                async () => await newSublistPopup(pass),
                            ),
                        },
                        <{ id: string, item: minamo.dom.Source, }>
                        { id: "@separator", item: menuSeparator(), },
                    ]
                    .concat(await Promise.all(getTagList({ pass, sublist: true }).filter(tag => "@:@root" !== tag).map(async tag => ({ id: tag, item: await tagMenuItem(current, pass, tag)}))))
                    .concat
                    ([
                        <{ id: string, item: minamo.dom.Source, }>
                        { id: "@separator", item: menuSeparator(), },
                        { id: "@:@root", item: await tagMenuItem(current, pass, "@:@root")}
                    ])
                )
            )
            .concat
            (
                await groupMenuItem
                (
                    current,
                    [ await Resource.loadSvgOrCache("tag-icon"), label("Tag"), ],
                    [
                        <{ id: string, item: minamo.dom.Source, }>
                        {
                            id: "@new",
                            item: menuItem
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
                        },
                        <{ id: string, item: minamo.dom.Source, }>
                        { id: "@separator", item: menuSeparator(), },
                    ]
                    .concat(await Promise.all(getTagList({ pass, tag: true }).filter(tag => ! Model.isSystemTagOld(tag)).map(async tag => ({ id: tag, item: await tagMenuItem(current, pass, tag)}))))
                    .concat
                    ([
                        <{ id: string, item: minamo.dom.Source, }>
                        { id: "@separator", item: menuSeparator(), },
                    ])
                    .concat(await Promise.all(getTagList({ pass, tag: true }).filter(tag => Model.isSystemTagOld(tag)).map(async tag => ({ id: tag, item: await tagMenuItem(current, pass, tag)}))))
                )
            );
        export const screenHeaderTagSegment = async (pass: string, current: string): Promise<HeaderSegmentSource> =>
        ({
            icon: Resource.getTagIcon(current),
            title: Domain.tagMap(current),
            href: { pass, tag: current, },
            menu: await screenHeaderTagSegmentMenu(pass, current),
        });
        export const screenHeaderTagMenuSegment = async (pass: string, current: string): Promise<HeaderSegmentSource> =>
        ({
            icon: Resource.getTagIcon(current),
            title: Domain.tagMap(current),
            menu: await screenHeaderTagSegmentMenu(pass, current),
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
                            await Resource.loadSvgOrCache("add-task-icon"),
                            label("New ToDo"),
                        ],
                        async () => newTaskPopup({ pass, tag, }, getFilterText()),
                    ),
                    menuLinkItem
                    (
                        [
                            await Resource.loadSvgOrCache("history-icon"),
                            label("History"),
                        ],
                        { pass, tag: tag, hash: "history" },
                        "@history" === current ? "current-item": undefined
                    ),
                ])
        });
        export const getScreen = () => minamo.core.existsOrThrow(document.getElementById("screen"));
        export const getScreenBody = () => minamo.core.existsOrThrow(document.getElementsByClassName("screen-body")[0]);
        export const replaceScreenBody = (body: minamo.dom.Source) => minamo.dom.replaceChildren
        (
            getScreenBody(),
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
            menuSeparator(),
            systemSettingsMenuItem(),
            listSettingsMenuItem(entry.pass),
            menuItem
            (
                label(getTagSettingsTitle(entry.tag)),
                async () =>
                {
                    if (await tagSettingsPopup(entry.pass, entry.tag))
                    {
                        await reload();
                    }
                }
            ),
            menuSeparator(),
            menuLinkItem
            (
                label("History"),
                { pass: entry.pass, tag: entry.tag, hash: "history" }
            ),
            menuLinkItem
            (
                label("@deleted"),
                { pass: entry.pass, hash: "removed" }
            ),
            menuSeparator(),
            newTaskMenuItem(entry),
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
                    const timestamp = lastFilterUpdateAt = new Date().getTime();
                    if ("" !== value)
                    {
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
                    setTimeout
                    (
                        () =>
                        {
                            if (timestamp === lastFilterUpdateAt)
                            {
                                onUpdate(value);
                            }
                        },
                        1000,
                    );
                    context.value = value;
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
            input.addEventListener('cut', () => setTimeout(onchange, 0));
            input.addEventListener('paste', () => setTimeout(onchange, 0));
            //input.addEventListener('compositionupdate', onchange);
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
                updateScreen("operate");
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
            "@overall" === entry.tag ?
                [
                    await screenHeaderHomeSegment(),
                    await screenHeaderListMenuSegment(entry.pass),
                ]:
                [
                    await screenHeaderHomeSegment(),
                    await screenHeaderListSegment(entry.pass),
                    await screenHeaderTagMenuSegment(entry.pass, entry.tag),
                ],
            menu: () => listScreenMenu(entry),
            operator: await filter
            (
                getUrlParams().filter ?? "",
                async filter =>
                {
                    updateUrlFilterParam(filter);
                    updateScreen("operate");
                }
            ),
            parent: "@overall" === entry.tag ? { }: { pass: entry.pass, tag: "@overall", }
        });
        export interface BottomSubTabLabel
        {
            icon: Resource.KeyType;
            text: string;
        }
        export interface BottomSubTab extends BottomSubTabLabel
        {
            count?: string;
            href: { pass?: string, tag?: string, todo?: string, hash?: string, };
        }
        export const isBottomSubTab = (value: any): value is BottomSubTab =>
            "object" === typeof value &&
            null !== value &&
            "icon" in value && "string" === typeof value.icon &&
            "text" in value && "string" === typeof value.text &&
            ( ! ("count" in value) || ("string" === typeof value.count || undefined === value.count)) &&
            "href" in value && isPageParamsRaw(value.href);
        export const bottomTab = async (
            current: { pass?: string, tag?: string, hash?: string, },
            subTabs: (BottomSubTab | "separator")[],
            additionalMenu?: minamo.dom.Source,
            defaultLable?: BottomSubTabLabel
        ) =>
        {
            if (subTabs.length <= 0)
            {
                return [];
            }
            else
            {
                const pureSubTabs = subTabs.filter(isBottomSubTab);
                const tagIndex = pureSubTabs.map(i => i.href.tag).indexOf(current.tag);
                const urlIndex = pureSubTabs.map(i => makeUrl(i.href)).indexOf(location.href);
                const isCurrent = 0 <= tagIndex || 0 <= urlIndex;
                const tab = pureSubTabs[isCurrent ? (0 <= urlIndex ? urlIndex: tagIndex): 0];
                const face = ! isCurrent && defaultLable ? defaultLable: tab;
                let cover: { dom: HTMLDivElement, close: () => Promise<unknown> } | null = null;
                const subTabsMenu = await Promise.all
                (
                    subTabs.map
                    (
                        async i => isBottomSubTab(i) ?
                            menuLinkItem
                            (
                                [ await Resource.loadSvgOrCache(i.icon), labelSpan(i.text), monospace(i.count ?? ""), ],
                                i.href,
                                isCurrent && tab.text === i.text ? " current-item": ""
                            ):
                            menuSeparator()
                    )
                );
                const menu = undefined !== additionalMenu ?
                    [
                        additionalMenu,
                        menuSeparator(),
                        subTabsMenu,
                    ]:
                    subTabsMenu;
                const popup = $make(HTMLDivElement)
                ({
                    tag: "div",
                    className: "menu-popup",
                    children: menu,
                    onclick: async (event: MouseEvent) =>
                    {
                        event.stopPropagation();
                        cover?.close();
                        close();
                    },
                });
                const close = () =>
                {
                    popup.classList.remove("show");
                    cover = null;
                };
                const showMenu = async () =>
                {
                    popup.classList.add("show");
                    const buttonRect = result.getBoundingClientRect();
                    popup.style.removeProperty("top");
                    popup.style.bottom = `${window.innerHeight -buttonRect.top}px`;
                    if (buttonRect.right < window.innerWidth *(2 /3))
                    {
                        popup.style.removeProperty("right");
                        popup.style.left = `${buttonRect.left}px`;
                    }
                    else
                    {
                        popup.style.removeProperty("left");
                        popup.style.right = `${window.innerWidth -buttonRect.right}px`;
                    }
                    popup.style.minWidth = `${buttonRect.width}px`;
                    cover = screenCover
                    ({
                        // parent: popup.parentElement,
                        children: popup,
                        onclick: close,
                        eventListener:
                        {
                            mouseup: mouseup,
                            touchend: mouseup,
                        },
                    });
                };
                const longPressTimer = new minamo.core.Timer(showMenu, 300);
                const mousedown = (event: MouseEvent) =>
                {
                    event.preventDefault();
                    longPressTimer.set();
                };
                const mouseup = async () =>
                {
                    if (longPressTimer.isWaiting())
                    {
                        longPressTimer.clear();
                        await showUrl
                        (
                            isCurrent && makeUrl(tab.href) === location.href ?
                                nextItem(pureSubTabs, tab).href:
                                tab.href
                        );
                    }
                };
                const result = $make(HTMLButtonElement)
                ({
                    tag: "button",
                    className: "bottom-tab" +(isCurrent ? " current-item": ""),
                    children:
                    [
                        {
                            tag: "div",
                            className: "tab-face",
                            title: tab.text,
                            children: [ await Resource.loadSvgOrCache(face.icon), labelSpan(face.text), ],
                            eventListener:
                            {
                                mousedown: mousedown,
                                touchstart: mousedown,
                                mouseup: mouseup,
                                touchend: mouseup,
                                contextmenu: async (event: MouseEvent) =>
                                {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    longPressTimer.clear();
                                    await showMenu();
                                }
                            },
                        },
                        {
                            tag: "div",
                            className: "sub-tabs",
                            children: pureSubTabs.map
                            (
                                i =>
                                ({
                                    tag: "div",
                                    className: "sub-tab" +(face.text === i.text ? " current-item": ""),
                                    title: i.text,
                                    onclick: (event: MouseEvent) =>
                                    {
                                        event.stopPropagation();
                                        showUrl(i.href);
                                    }
                                })
                            )
                        }
                    ],
                    // onclick: async () => await showUrl
                    // (
                    //     isCurrent && makeUrl(tab.href) === location.href ?
                    //         nextItem(subTabs, tab).href:
                    //         tab.href
                    // ),
                });
                return result;
            }
        };
        export const makeBottomSubTabForTag = (pass: string, tag: string): BottomSubTab =>
        ({
            icon: Resource.getTagIcon(tag),
            text: Domain.tagMap(tag),
            count: `${OldStorage.TagMember.get(pass, tag).length}`,
            href: { pass, tag: tag, },
        });
        export const homeTab = async (entry: ToDoTagEntryOld) => await bottomTab
        (
            entry,
            [
                makeBottomSubTabForTag(entry.pass, "@overall"),
                {
                    icon: <Resource.KeyType>"history-icon",
                    text: locale.map("History"),
                    href: { pass: entry.pass, tag: "@overall", hash: "history" },
                },
                {
                    icon: <Resource.KeyType>"recycle-bin-icon",
                    text: locale.map("@deleted"),
                    href: { pass: entry.pass, hash: "removed", },
                },
            ]
        );
        export const termTab = async (entry: ToDoTagEntryOld) => await bottomTab
        (
            entry,
            getTagList({ term: true })
                .map(i => makeBottomSubTabForTag(entry.pass, i)),
            menuItem
            (
                [
                    await Resource.loadSvgOrCache("settings-icon"),
                    label("Term threshold settings"),
                ],
                async () =>
                {
                    if (await termThresholdSettingsPopup(entry.pass))
                    {
                        updateScreen("operate");
                    }
                }
            ),
            {
                icon: "ghost-term-icon",
                text: locale.map("Term"),
            }
        );
        export const autoTab = async (entry: ToDoTagEntryOld) => await bottomTab
        (
            entry,
            getTagList({ auto: true })
                .map(i => makeBottomSubTabForTag(entry.pass, i)),
            undefined,
            {
                icon: "flag-icon",
                text: locale.map("Auto tag"),
            }
        );
        export const tagTab = async (entry: ToDoTagEntryOld) => await bottomTab
        (
            entry,
            (
                <(BottomSubTab | "separator")[]>
                getTagList({ pass: entry.pass, tag: true, })
                    .filter(tag => ! Model.isSystemTagOld(tag))
                    .map(tag => makeBottomSubTabForTag(entry.pass, tag))
            )
            .concat([ "separator", ])
            .concat
            (
                getTagList({ pass: entry.pass, tag: true, })
                    .filter(tag => Model.isSystemTagOld(tag))
                    .map(tag => makeBottomSubTabForTag(entry.pass, tag))
            ),
            menuItem
            (
                [
                    await Resource.loadSvgOrCache("add-tag-icon"),
                    label("@new"),
                ],
                async () =>
                {
                    const tag = await newTagPrompt(entry.pass);
                    if (null !== tag)
                    {
                        await showUrl({ pass: entry.pass, tag, });
                    }
                }
            ),
            {
                icon: "tag-icon",
                text: locale.map("Tag"),
            }
        );
        export const sublistTab = async (entry: ToDoTagEntryOld) => await bottomTab
        (
            entry,
            (
                <(BottomSubTab | "separator")[]>
                getTagList({ pass: entry.pass, sublist: true, })
                    .filter(tag => "@:@root" !== tag)
                    .map(tag => makeBottomSubTabForTag(entry.pass, tag))
            )
            .concat([ "separator", ])
            .concat([ makeBottomSubTabForTag(entry.pass, "@:@root"), ]),
            menuItem
            (
                [
                    await Resource.loadSvgOrCache("add-folder-icon"),
                    label("@new-sublist"),
                ],
                async () => await newSublistPopup(entry.pass)
                ),
            {
                icon: "folder-icon",
                text: locale.map("Sublist"),
            }
        );
        export const bottomTabs = async (entry: ToDoTagEntryOld) => $div("bottom-tabs")
        ([
            await homeTab(entry),
            await termTab(entry),
            await autoTab(entry),
            await sublistTab(entry),
            await tagTab(entry),
        ]);
        export const listScreenFooterSignboard = async (entry: ToDoTagEntryOld) =>
        {
            let result: minamo.dom.Source;
            const settings = textButton
            (
                getTagSettingsTitle(entry.tag),
                async () =>
                {
                    if (await tagSettingsPopup(entry.pass, entry.tag))
                    {
                        await reload();
                    }
                }
            );
            const history = textButton
            (
                "History",
                async () => showUrl({ pass: entry.pass, tag: entry.tag, hash: "history" })
            );
            const removed = textButton
            (
                "@deleted",
                async () => showUrl({ pass: entry.pass, hash: "removed", })
            );
            const separator = $span("separator")("・");
            switch(entry.tag)
            {
            case "@:@root":
                result =
                [
                    await poem("sublist", "poem primary-poem"),
                    $div("button-list")
                    ([
                        {
                            tag: "button",
                            className: "default-button main-button long-button",
                            children: label("@new-sublist"),
                            onclick: async () => newSublistPopup(entry.pass),
                        },
                        $div("button-list")([settings, separator, history, separator, removed,]),
                    ]),
                ];
                break;
            case "@untagged":
                result =
                [
                    await poem("tag", "poem primary-poem"),
                    $div("button-list")
                    ([
                        {
                            tag: "button",
                            className: "default-button main-button long-button",
                            children: label("@new"),
                            onclick: async () =>
                            {
                                const tag = await newTagPrompt(entry.pass);
                                if (null !== tag)
                                {
                                    await showUrl({ pass: entry.pass, tag, });
                                }
                            },
                        },
                        $div("button-list")([settings, separator, history, separator, removed,]),
                    ]),
                ];
                break;
            case "@flash":
                result =
                [
                    await poem
                    (
                        {
                            title: locale.string("自動タグ"),
                            subtitle: locale.string("フラッシュ"),
                            description: locale.string("「いますぐ実行するべき」タイミングになったらこのタグが付与される様に自動タグ設定を行いましょう。このタグが付与される ToDo が多くなる状況でも全体の 10% 以下になる様に、あるいは、その日にうちに全部完了できる程度に留まる様に、設定を調整しましょう。どうにもやる気が出ない、あるいは、忙しくて、フラッシュ状態の ToDo が溜まってしまった場合は無理せず、睡眠や体調回復を優先してください。睡眠不足や体調不良は悪循環の元でしかないので最優先で断ちましょう。"),
                            image: "☀️"
                        },
                        "poem primary-poem"
                    ),
                    $div("button-list")
                    ([
                        messageList
                        ([
                            messagePanel(locale.string("ToDo のメニューの[自動タグ設定]から設定できます。")),
                            messagePanel(locale.string("ピックアップタグよりフラッシュタグが優先されます。")),
                            messagePanel(locale.string("フラッシュタグより制限タグが優先されます。")),
                        ]),
                        $div("button-list")([settings, separator, history, separator, removed,]),
                    ]),
                ];
                break;
            case "@pickup":
                result =
                [
                    await poem("pickup", "poem primary-poem"),
                    $div("button-list")
                    ([
                        messageList
                        ([
                            messagePanel(locale.string("ToDo のメニューの[自動タグ設定]から設定できます。")),
                            messagePanel(locale.string("ピックアップタグよりフラッシュタグおよび制限タグが優先されます。")),
                        ]),
                        $div("button-list")([settings, separator, history, separator, removed,]),
                    ]),
                ];
                break;
            case "@regular":
                result =
                [
                    await poem
                    (
                        {
                            title: locale.string("自動タグ"),
                            subtitle: locale.string("レギュラー"),
                            description: locale.string("フラッシュ、ピックアップ、制限のいずれの自動タグも付与されてない ToDo にレギュラータグが付与されます。"),
                            image: "🏳️"
                        },
                        "poem primary-poem"
                    ),
                    $div("button-list")
                    ([
                        messageList
                        ([
                            messagePanel(locale.string("ToDo のメニューの[自動タグ設定]から設定できます。")),
                        ]),
                        $div("button-list")([settings, separator, history, separator, removed,]),
                    ]),
                ];
                break;
            case "@short-term":
            case "@medium-term":
            case "@long-term":
                result =
                [
                    await poem
                    (
                        {
                            title: locale.string("期間タグ"),
                            subtitle: locale.string("実行周期に応じたタグです"),
                            description: locale.string("実行周期に応じて短期、中期、長期のタグが付与されます。"),
                            image: "📅"
                        },
                        "poem primary-poem"
                    ),
                    $div("button-list")
                    ([
                        {
                            tag: "button",
                            className: "default-button main-button long-button",
                            children: label("Term threshold settings"),
                            onclick: async () =>
                            {
                                if (await termThresholdSettingsPopup(entry.pass))
                                {
                                    updateScreen("operate");
                                }
                            },
                        },
                        $div("button-list")([settings, separator, history, separator, removed,]),
                    ]),
                ];
                break;
            case "@irregular-term":
                result =
                [
                    await poem
                    (
                        {
                            title: locale.string("期間タグ"),
                            subtitle: locale.string("不定期"),
                            description: locale.string("それまでの周期から著しく長い期間実行されず休止期間と判断された ToDo や、まだ周期が特定されてない実行回数が２回未満の ToDo には不定期のタグが付与されます。「花粉症の薬」の様な季節に依存する ToDo は実際にこなした通りに完了操作を行なっていれば、シーズン後には自然に休止期間判定され、また次に完了操作を行なった際に休止期間判定は解かれます。"),
                            image: "🌙"
                        },
                        "poem primary-poem"
                    ),
                    $div("button-list")
                    ([
                        {
                            tag: "button",
                            className: "default-button main-button long-button",
                            children: label("Term threshold settings"),
                            onclick: async () =>
                            {
                                if (await termThresholdSettingsPopup(entry.pass))
                                {
                                    updateScreen("operate");
                                }
                            },
                        },
                        $div("button-list")([settings, separator, history, separator, removed,]),
                    ]),
                ];
                break;
            default:
                result =
                [
                    await poem("new-todo", "poem primary-poem"),
                    $div("button-list")
                    ([
                        {
                            tag: "button",
                            className: "default-button main-button long-button",
                            children: label("New ToDo"),
                            onclick: async () => newTaskPopup(entry, getFilterText()),
                        },
                        $div("button-list")([settings, separator, history, separator, removed,]),
                    ]),
                ];
                break;
            }
            return $div("signboard")(result);
        };
        export const listScreenFooter = async (entry: ToDoTagEntryOld, _list: ToDoEntry[]) =>
        [
            await listScreenFooterSignboard(entry),
            // $div("button-list")
            // ([
            //     {
            //         tag: "button",
            //         className: list.length <= 0 ? "default-button main-button long-button": "main-button long-button",
            //         children: label("New ToDo"),
            //         onclick: async () => newTaskPopup(entry, getFilterText()),
            //     },
            //     internalLink
            //     ({
            //         href: { pass: entry.pass, tag: entry.tag, hash: "history" },
            //         children: $tag("button")("main-button long-button")(label("History")),
            //     }),
            // ]),
            $div("poem-list")
            ([
                await poem("header"),
                await poem
                ({
                    title: locale.string("履歴バー"),
                    subtitle: locale.string("履歴のダイジェスト"),
                    description: locale.string("画面上部のヘッダーのすぐ下の領域は直近の各 ToDo をこなしてからの経過時間が表示されます。この表示はダイジェストで、各 ToDo の最後の完了からの経過時間のみを扱います。もっと履歴を詳しく見るには履歴バーの一番左の[履歴]をクリックしてください。"),
                    image: "📔"
                }),
                await poem("accuracy"),
                await poem("bottomtabs"),
            ]),
        ];
        export const listScreenBody = async (entry: ToDoTagEntryOld, list: ToDoEntry[], displayStyle = OldStorage.TagSettings.getDisplayStyle(entry.pass, entry.tag), progressScaleShowStyle = OldStorage.TagSettings.getProgressScaleStyle(entry.pass, entry.tag)) =>
        ([
            await historyBar(entry, list),
            $div("column-flex-list todo-list")(await Promise.all(list.map(item => todoItem(entry, item, displayStyle, progressScaleShowStyle)))),
            await listScreenFooter(entry, list),
        ]);
        export const listScreen = async (entry: ToDoTagEntryOld, list: ToDoEntry[], filter: string) =>
        ({
            className: "list-screen has-bottom-tabs",
            header: await listScreenHeader(entry, list),
            body: await listScreenBody(entry, list.filter(item => isMatchToDoEntry(filter, entry, item))),
            footer: await bottomTabs(entry),
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
            const isDirty = () => ! Domain.sortList(entry, minamo.core.simpleDeepCopy(list));
            const getMSTicks = () => new Date().getTime();
            let updatedAt = getMSTicks();
            let isDirtied = false;
            let isUpdating = false;
            let dirtyAt = 0;
            const onDirty = () =>
            {
                isUpdating = false;
                dirtyAt = getMSTicks();
                setProgressStyle("obsolescence");
            };
            const obsolescenceProgressBarDuration = minamo.core.parseTimespan(style.__OBSOLESCENCE_PROGRESS_BAR_DURATION__) ?? (30 *1000);
            const displayStyle = OldStorage.TagSettings.getDisplayStyle(entry.pass, entry.tag);
            const updateScreen = async (event: UpdateScreenEventEype) =>
            {
                switch(event)
                {
                    case "high-resolution-timer":
                        updateHeaderTimestamp();
                        if (isDirtied && ! isUpdating && dirtyAt +obsolescenceProgressBarDuration <= getMSTicks())
                        {
                            isUpdating = true;
                            await updatingScreenBody();
                            await Render.updateScreen("operate");
                            await updatedScreenBody();
                        }
                        break;
                    case "timer":
                        Domain.updateListProgress(entry.pass, list);
                        if ("@pickup" === tag)
                        {
                            Domain.updateListProgress(entry.pass, pickupAll);
                        }
                        if ( ! isDirtied && updatedAt +(300 *1000) <= getMSTicks())
                        {
                            isDirtied = isDirtied || isDirty();
                            if (isDirtied)
                            {
                                onDirty();
                            }
                        }
                        // if
                        // (
                        //     isDirty &&
                        //     document.body.scrollTop <= 0 &&
                        //     (getScreenBody()?.scrollTop ?? 0) <= 0 &&
                        //     ! hasScreenCover() &&
                        //     ! (getHeaderElement().classList.contains("header-operator-has-focus") ?? false)
                        // )
                        // {
                        //     //await updateScreen("operate");
                        // }
                        // else
                        // {
                            const filter = getFilterText();
                            const filteredList = list.filter(item => isMatchToDoEntry(filter, entry, item));
                            await Promise.all
                            (
                                (
                                    Array.from
                                    (
                                        (
                                            document
                                                .getElementsByClassName("list-screen")[0]
                                                .getElementsByClassName("todo-list")[0] as HTMLDivElement
                                        ).childNodes
                                    ) as HTMLDivElement[]
                                ).map
                                (
                                    async (dom, index) =>
                                    {
                                        const item = filteredList[index];
                                        const button = dom.getElementsByClassName("item-operator")[0].getElementsByClassName("main-button")[0] as HTMLButtonElement;
                                        button.classList.toggle("default-button", item.isDefault);
                                        if ("full" === displayStyle || "digest" === displayStyle)
                                        {
                                            const information = dom.getElementsByClassName("item-information")[0] as HTMLDivElement;
                                            (information.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0] as HTMLSpanElement).innerText = Domain.timeLongStringFromTick(item.elapsed);
                                        }
                                        if ("simple" === displayStyle)
                                        {
                                            const information = dom.getElementsByClassName("item-information")[0] as HTMLDivElement;
                                            (information.getElementsByClassName("primary")[0].getElementsByClassName("value")[0] as HTMLSpanElement).innerText = Domain.timeSimpleStringFromTick(item.elapsed);
                                        }
                                        const svg = dom.getElementsByClassName("item-title")?.[0]?.getElementsByTagName("svg")?.[0];
                                        if (svg)
                                        {
                                            const icon = await Resource.loadSvgOrCache(getTodoIcon(entry, item));
                                            minamo.dom.setProperty(svg, "outerHTML", icon.outerHTML);
                                        }
                                        Render.updateItemProgressBar(entry.pass, item, dom);
                                    }
                                )
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
                    // case "focus":
                    // case "blur":
                    // case "scroll":
                    //     Domain.updateListProgress(entry.pass, list);
                    //     isDirty = isDirty || ( ! Domain.sortList(entry, minamo.core.simpleDeepCopy(list)));
                    //     if (isDirty)
                    //     {
                    //         await updatingScreenBody();
                    //         await Render.updateScreen("operate");
                    //     }
                    //     break;
                    case "storage":
                        await reload();
                        break;
                    case "operate":
                        if (0 <= OldStorage.Pass.get().indexOf(entry.pass))
                        {
                            isUpdating = true;
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
                            const filter = getFilterText();
                            replaceScreenBody(await listScreenBody(entry, list.filter(item => isMatchToDoEntry(filter, entry, item))));
                            resizeFlexList();
                            if ("@pickup" === tag)
                            {
                                await Render.updateScreen("timer");
                            }
                            removeProgressStyle();
                            isDirtied = false;
                            updatedAt = getMSTicks();
                        }
                        else
                        {
                            await showUrl({ });
                        }
                        break;
                    case "dirty":
                        if ( ! isDirtied)
                        {
                            isDirtied = true;
                            onDirty();
                        }
                        break;
                    case "click-header":
                        if (isDirty())
                        {
                            isUpdating = true;
                            if (isDirtied)
                            {
                                await updatingScreenBody();
                            }
                            await Render.updateScreen("operate");
                            await updatedScreenBody();
                        }
                        break;
                }
            };
            const filter = regulateFilterText(urlParams.filter ?? "");
            await showScreen(await listScreen(entry, list, filter), updateScreen);
            if ("@pickup" === tag)
            {
                await Render.updateScreen("timer");
            }
        };
        export const historyScreenMenu = async (entry: ToDoTagEntryOld) =>
        [
            backToListMenuItem(entry.pass, entry.tag),
            systemSettingsMenuItem(),
            listSettingsMenuItem(entry.pass),
            Model.isSystemTagOld(entry.tag) ? []: renameTagMenuItem(entry, "history"),
            newTaskMenuItem(entry),
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
        export const pager = async <T>(data: { className: string, pagesize?: number, list: T[]; renderer: (item: T) => Promise<minamo.dom.Source>; getLabel?: (item: T, index: number) => string; onUpdated?: () => Promise<unknown>; }) =>
        {
            const pagesize = "number" !== typeof data.pagesize ? config.maxGroupHistories: Math.min(Math.max(data.pagesize, 100), 10000);
            const maxpage = Math.ceil(data.list.length / pagesize);
            const buttonList = $make(HTMLDivElement)({ tag: "div", className: "button-line page-operator", });
            const result = $make(HTMLDivElement)({ tag: "div", className: data.className, });
            const getLabel = (index: number) => data.getLabel ? data.getLabel(data.list[index], index): index +1;
            const makeLabelText = (page: number) => `${getLabel((page -1) *pagesize)} - ${getLabel(Math.min(page *pagesize, data.list.length) -1)}`;
            const pager = async (page: number) =>
            {
                const result: minamo.dom.Source[] = [];
                const isFirstPage = page <= 1;
                const isLastPage = maxpage <= page;
                if (isFirstPage)
                {
                    result.push({ tag: "button", children: "<<", attributes: { disabled: "disabled", }, });
                    result.push({ tag: "button", children: "<", attributes: { disabled: "disabled", }, });
                }
                else
                {
                    result.push({ tag: "button", children: "<<", onclick: () => paging(1), });
                    result.push({ tag: "button", children: "<", onclick: () => paging(page -1), });
                }
                let cover: { dom: HTMLDivElement, close: () => Promise<unknown> } | null = null;
                const close = () =>
                {
                    popup.classList.remove("show");
                    cover = null;
                };
                const popup = $make(HTMLDivElement)
                ({
                    tag: "div",
                    className: `menu-popup ${data.getLabel ? "": "text-align-right"}`,
                    children: Array.from({ length: maxpage }).map
                    (
                        (_i, ix) => menuItem
                        (
                            monospace(makeLabelText(ix +1)),
                            () => paging(ix +1),
                            page === (ix +1) ? "current-item": undefined
                        )
                    ),
                    onclick: async (event: MouseEvent) =>
                    {
                        event.stopPropagation();
                        cover?.close();
                        close();
                    },
                });
                const pageButton = $make(HTMLButtonElement)
                ({
                    tag: "button",
                    attributes:
                    {
                        tabindex: "0",
                    },
                    children: monospace(makeLabelText(page)),
                    onclick: async (event: MouseEvent) =>
                    {
                        event.stopPropagation();
                        popup.classList.add("show");
                        const buttonRect = pageButton.getBoundingClientRect();
                        if (buttonRect.top < window.innerHeight *(2 /3))
                        {
                            popup.style.top = `${buttonRect.bottom}`;
                            popup.style.removeProperty("bottom");
                        }
                        else
                        {
                            popup.style.removeProperty("top");
                            popup.style.bottom = `${window.innerHeight -buttonRect.top}`;
                        }
                        popup.style.marginLeft = `auto`;
                        popup.style.marginRight = `auto`;
                        cover = screenCover
                        ({
                            // parent: popup.parentElement,
                            children: popup,
                            onclick: close,
                        });
                    },
                });
                result.push(pageButton);
                if (isLastPage)
                {
                    result.push({ tag: "button", children: ">", attributes: { disabled: "disabled", }, });
                    result.push({ tag: "button", children: ">>", attributes: { disabled: "disabled", }, });
                }
                else
                {
                    result.push({ tag: "button", children: ">", onclick: () => paging(page +1), });
                    result.push({ tag: "button", children: ">>", onclick: () => paging(maxpage), });
                }
                return result;
            };
            const update = async (page: number) =>
            {
                const contents = await Promise.all(data.list.slice((page -1) *pagesize, page *pagesize).map(i => data.renderer(i)));
                minamo.dom.replaceChildren(result, contents);
                minamo.dom.replaceChildren(buttonList, await pager(page));
                await data.onUpdated?.();
            };
            const paging = async (page: number) =>
            {
                await updatingScreenBody();
                await update(page);
                await updatedScreenBody();
            }
            await update(1);
            return maxpage < 2 ? result: [ $make(HTMLDivElement)({ tag: "div", className: "pager", children: buttonList, }), result, ];
        };
        export const historyScreenBody = async (entry: ToDoTagEntryOld, list: { task: string, tick: number | null }[]) =>
        ([
            await pager
            ({
                className: "column-flex-list history-list",
                list,
                renderer: item => historyItem(entry, item),
                getLabel: item => Domain.dateCoreStringFromTick(item.tick),
                onUpdated: async () => resizeFlexList(),
            }),
            // $div("column-flex-list history-list")(await Promise.all(list.map(item => historyItem(entry, item)).slice(0, config.maxGroupHistories))),
            $div("signboard")
            ([
                //poem(),
                $div("button-list")
                ([
                    //button(),
                    $div("button-list")
                    ([
                        textButton
                        (
                            "Back to List",
                            async () => showUrl({ pass: entry.pass, tag: entry.tag, })
                        ),
                        $span("separator")("・"),
                        textButton
                        (
                            "@deleted",
                            async () => showUrl({ pass: entry.pass, hash: "removed", })
                        ),
                    ])
                ]),
            ]),
            // $div("button-list")
            // (
            //     internalLink
            //     ({
            //         href: { pass: entry.pass, tag: entry.tag, },
            //         children: $tag("button")("default-button main-button long-button")(label("Back to List")),
            //     })
            // ),
            $div("poem-list")
            ([
                await poem
                ({
                    title: locale.string("この画面で表示される件数"),
                    subtitle: `${config.maxGroupHistories} / ${list.length}`,
                    description: locale.string("処理パフォーマンスの都合上、この画面で表示される件数には上限があります。"),
                    image: "🚫",
                }),
                await poem("header"),
                await poem("accuracy"),
                await poem("bottomtabs"),
            ]),
            // messageList
            // ([
            //     messagePanel(labelSpan(locale.string("この画面で表示される最大件数") + `: ${config.maxGroupHistories} / ${list.length}`)),
            // ]),
        ]);
        export const historyScreen = async (entry: ToDoTagEntryOld, list: { task: string, tick: number | null }[], filter: string): Promise<ScreenSource> =>
        ({
            className: "history-screen has-bottom-tabs",
            header: await historyScreenHeader(entry, list),
            body: await historyScreenBody(entry, list.filter(item => isMatchHistoryItem(filter, entry, item))),
            footer: await bottomTabs(entry),
        });
        export const showHistoryScreen = async (urlParams: PageParams, entry: ToDoTagEntryOld) =>
        {
            const histories: { [task: string]: number[] } = { };
            let list = entry.todo.map(task => (histories[task] = OldStorage.History.getTicks(entry.pass, task)).map(tick => ({ task, tick: <number | null>tick, }))).reduce((a, b) => a.concat(b), []);
            list.sort(minamo.core.comparer.make(a => -(a.tick ?? 0)));
            list = list.concat(entry.todo.filter(task => histories[task].length <= 0).map(task => ({ task, tick: null })));
            const filter = regulateFilterText(urlParams.filter ?? "");
            await showScreen(await historyScreen(entry, list, filter));
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
                            await alert(locale.string("復元できませんでした。( 同名の項目が存在すると復元できません。また、サブリスト内の ToDo の場合、元のサブリストが存在している必要があります。 )"));
                        }
                    }
                }])
            ]),
            $div("item-information")
            ([
                monospace("removed-timestamp", label("deletedAt"), Domain.dateStringFromTick(item.deteledAt)),
            ]),
        ]);
        export const removedScreenMenu = async (pass: string) =>
        [
            backToListMenuItem(pass),
            systemSettingsMenuItem(),
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
            className: "removed-screen has-bottom-tabs",
            header:
            {
                items:
                [
                    await screenHeaderHomeSegment(),
                    await screenHeaderListSegment(pass),
                    await screenHeaderTagMenuSegment(pass, "@deleted"),
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
                messageList([messagePanel(label("Recycle Bin is empty."))]),
                $div("signboard")
                ([
                    await poem("@deleted", "poem primary-poem"),
                    // await poem
                    // (
                    //     {
                    //         title: locale.map("@deleted"),
                    //         subtitle: "30日間保存されます",
                    //         description: locale.string("Items after 30 days are automatically deleted completely."),
                    //         image: "🗑️",
                    //     },
                    //     "poem primary-poem"
                    // ),
                    $div("button-list")
                    ([
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
                        $div("button-list")
                        ([
                            textButton
                            (
                                "Back to List",
                                async () => showUrl({ pass, tag: "@overall" })
                            ),
                            $span("separator")("・"),
                            textButton
                            (
                                "History",
                                async () => showUrl({ pass, tag: "@overall", hash: "history" })
                            ),
                        ])
                    ]),
                ]),
                $div("poem-list")
                ([
                    await poem("header"),
                    await poem("bottomtabs"),
                ]),
            ],
            footer: await bottomTabs({ pass, tag: "@deleted", todo: [], }),
        });
        export const showRemovedScreen = async (pass: string) =>
        {
            const updateScreen = async (event: UpdateScreenEventEype) =>
            {
                switch(event)
                {
                    case "high-resolution-timer":
                        updateHeaderTimestamp();
                        break;
                    case "timer":
                    case "focus":
                    case "blur":
                    case "scroll":
                        break;
                    case "storage":
                    case "operate":
                    case "dirty":
                        await reload();
                        break;
                }
            };
            await showScreen(await removedScreen(pass, OldStorage.Removed.get(pass)), updateScreen);
        };
        export const todoScreenMenu = async (pass: string, item: ToDoEntry) =>
        [
            await fullscreenMenuItem(),
            menuSeparator(),
            systemSettingsMenuItem(),
            listSettingsMenuItem(pass),
            menuItem
            (
                label("ToDo settings"),
                async () =>
                {
                    if (await todoSettingsPopup(pass, item))
                    {
                        updateScreen("operate");
                    }
                }
            ),
            // todoRenameMenu(pass, item, async newTask => await showUrl({ pass, todo: newTask, })),
            // todoTagMenu(pass, item),
            // todoDeleteMenu
            // (
            //     pass,
            //     item,
            //     async () => await showUrl({ pass, tag: "@overall", }),
            //     async () => await showUrl({ pass, todo: item.task, })
            // ),
        ];
        export const todoScreenHeader = async (pass: string, item: ToDoEntry, _ticks: number[], tag: string) =>
        ({
            items:
            [
                await screenHeaderHomeSegment(),
                await screenHeaderListSegment(pass),
                await screenHeaderTagSegment(pass, tag),
                await screenHeaderTaskSegment(pass, tag, OldStorage.Task.getBody(item.task)),
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
                    return Math.max.apply(null, intervals.filter(i => (i -average -Domain.granceTime) / standardDeviation <= config.sleepStandardDeviationRate));
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
                ([
                    {
                        tag: "button",
                        className: item.isDefault ? "default-button main-button": "main-button",
                        children: label("Done"),
                        onclick: async () =>
                        {
                            await Operate.done
                            (
                                pass,
                                item,
                                MigrateBridge.getDoneTicks(pass),
                                () => updateScreen("operate")
                            );
                            updateScreen("operate");
                        }
                    },
                    await button
                    (
                        "icon-button",
                        await Resource.loadSvgOrCache("settings-icon"),
                        async () =>
                        {
                            if (await todoSettingsPopup(pass, item))
                            {
                                await reload();
                            }
                        }
                    ),
                ]),
            $div("row-flex-list todo-list")
            ([
                $div("task-item flex-item")
                ([
                    $div("item-attribute-frame")
                    (
                        $div("item-attribute")
                        ([
                            await todoItemTags(pass, item),
                            await todoItemSettings(pass, item),
                        ])
                    ),
                    informationFull({ pass, }, item, OldStorage.TagSettings.getProgressScaleStyle(pass, "@list")),
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
            messageList
            ([
                messagePanel(labelSpan(locale.map("Maximum number of histories saved") + `: ${config.maxHistories}`)),
                messagePanel(labelSpan("最大件数を超えても、回数や初回日時は記憶されます。")),
            ]),
            $div("signboard")
            ([
                await poem("todo", "poem primary-poem"),
                $div("button-list")
                ([
                    {
                        tag: "button",
                        className: item.isDefault ? "default-button main-button long-button": "main-button long-button",
                        children: label("Done"),
                        onclick: async () =>
                        {
                            await Operate.done
                            (
                                pass,
                                item,
                                MigrateBridge.getDoneTicks(pass),
                                () => updateScreen("operate")
                            );
                            updateScreen("operate");
                        }
                    },
                    $div("button-list")
                    ([
                        // history,
                        // $span("separator")("・"),
                        textButton
                        (
                            "ToDo settings",
                            async () =>
                            {
                                if (await todoSettingsPopup(pass, item))
                                {
                                    updateScreen("operate");
                                }
                            }
                        ),
                    ]),
                ]),
            ]),
            $div("poem-list")
            ([
                await poem("header"),
                await poem("accuracy"),
                await poem("bottomtabs"),
            ]),
        ]);
        export const todoScreen = async (pass: string, item: ToDoEntry, ticks: number[], tag: string) =>
        ({
            className: "todo-screen has-bottom-tabs",
            header: await todoScreenHeader(pass, item, ticks, tag),
            body: await todoScreenBody(pass, item, ticks, tag),
            footer: await bottomTabs({ pass, tag, todo: [], }),
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
            const updateScreen = async (event: UpdateScreenEventEype) =>
            {
                switch(event)
                {
                    case "high-resolution-timer":
                        updateHeaderTimestamp();
                        break;
                    case "timer":
                        Domain.updateProgress(pass, item);
                        const dom = document
                            .getElementsByClassName("todo-screen")[0]
                            .getElementsByClassName("task-item")[0] as HTMLDivElement;
                        const information = dom.getElementsByClassName("item-information")[0] as HTMLDivElement;
                        Render.updateItemProgressBar(pass, item, information);
                        minamo.dom.setProperty((information.getElementsByClassName("task-elapsed-time")[0].getElementsByClassName("value")[0] as HTMLSpanElement), "innerText", Domain.timeLongStringFromTick(item.elapsed));
                        break;
                    case "focus":
                    case "blur":
                    case "scroll":
                        if (isDirty)
                        {
                            await Render.updateScreen("operate");
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
                        setProgressStyle("obsolescence");
                        break;
                }
            };
            await showScreen(await todoScreen(pass, item, ticks, tag), updateScreen);
        };
        export module Resource
        {
            export type EmojiType = (typeof pomeJson.image)[keyof typeof pomeJson.image];
            export type KeyType = keyof typeof resource;
            export const loadSvgOrCache = async (key: KeyType): Promise<SVGElement> =>
            {
                try
                {
                    return new DOMParser().parseFromString(minamo.core.existsOrThrow(document.getElementById(key)).innerHTML, "image/svg+xml").documentElement as any;
                }
                catch(error)
                {
                    console.error({key, error});
                    throw error;
                }
            };
            export const getTagIcon = (tag: string): KeyType =>
            {
                switch(tag)
                {
                    case "@overall":
                        return "home-icon";
                    case "@flash":
                        return "flash-icon";
                    case "@pickup":
                        return "pickup-icon";
                    case "@regular":
                        return "ghost-flag-icon";
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
                    case "@:@root":
                        return "ghost-folder-icon";
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
            export const loadEmojiSvgOrCache = async (emoji: EmojiType): Promise<SVGElement> => loadSvgOrCache(`u${emoji.codePointAt(0)?.toString(16).toLowerCase()}` as KeyType);
        }
        export const showExportScreen = async (pass: string) =>
            await showScreen(await exportScreen(pass));
        export const exportScreenMenu = async (pass: string) =>
        [
            await fullscreenMenuItem(),
            systemSettingsMenuItem(),
            backToListMenuItem(pass),
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
            await showScreen(await importScreen());
        export const importScreenMenu = async () =>
        [
            await fullscreenMenuItem(),
            systemSettingsMenuItem(),
            menuLinkItem(label("Back to Top"), { }),
        ];
        export const importScreen = async () =>
        ({
            className: "import-screen",
            header:
            {
                items:
                [
                    await screenHeaderHomeSegment(),
                    await screenHeaderListMenuSegment("@import")
                ],
                menu: await importScreenMenu(),
                parent: { },
            },
            body:
            [
                $tag("textarea")({ className: "json", attributes: { placeholder: locale.map("Paste the exported JSON."), }, })(""),
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
        export const removedListItem = async (list: RemovedContent) => $div("list-item removed-item flex-item")
        ([
            $div("item-header")
            ([
                $div("item-title")
                ([
                    await Resource.loadSvgOrCache("list-icon"),
                    list.title ?? `${locale.map("ToDo List")} ( pass: ${list.pass.substr(0, 2)}****${list.pass.substr(-2)} )`,
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
            $div("item-information")
            ([
                monospace("removed-timestamp", label("deletedAt"), Domain.dateStringFromTick(list.deteledAt)),
            ]),
        ]);
        export const showRemovedListScreen = async () =>
        {
            const updateScreen = async (event: UpdateScreenEventEype) =>
            {
                switch(event)
                {
                    case "high-resolution-timer":
                        updateHeaderTimestamp();
                        break;
                    case "timer":
                    case "focus":
                    case "blur":
                    case "scroll":
                        break;
                    case "storage":
                    case "operate":
                    case "dirty":
                        await reload();
                        break;
                }
            };
            await showScreen(await removedListScreen(OldStorage.Backup.get().map(json => JSON.parse(json) as RemovedContent).sort(minamo.core.comparer.make(i => -i.deteledAt))), updateScreen);
        };
        export const removedListScreenMenu = async () =>
        [
            await fullscreenMenuItem(),
            systemSettingsMenuItem(),
            menuLinkItem(label("Back to Top"), { }),
        ];
        export const removedListScreen = async (list: RemovedContent[]) =>
        ({
            className: "remove-list-screen",
            header:
            {
                items:
                [
                    await screenHeaderHomeSegment(),
                    await screenHeaderListMenuSegment("@removed")
                ],
                menu: await removedListScreenMenu(),
                parent: { },
            },
            body:
            [
                0 < list.length ?
                    $div("column-flex-list removed-list-list")(await Promise.all(list.map(item => removedListItem(item)))):
                    messageList([messagePanel(label("Recycle Bin is empty."))]),
                $div("signboard")
                ([
                    await poem
                    (
                        {
                            title: locale.map("@deleted"),
                            subtitle: "30日間保存されます",
                            description: locale.string("Items after 30 days are automatically deleted completely."),
                            image: "🗑️",
                        },
                        "poem primary-poem"
                    ),
                    $div("button-list")
                    ([
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
                        $div("button-list")
                        ([
                            textButton
                            (
                                "Back to Top",
                                async () => showUrl({ })
                            ),
                            $span("separator")("・"),
                            textButton
                            (
                                "Import List",
                                async () => showUrl({ hash: "import", })
                            ),
                        ])
                    ]),
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
                    await button
                    (
                        "icon-button",
                        await Resource.loadSvgOrCache("settings-icon"),
                        async () =>
                        {
                            if (await listSettingsPopup(list.pass))
                            {
                                await reload();
                            }
                        }
                    ),
                    // await menuButton
                    // ([
                    //     listRenameMenu(list.pass),
                    //     internalLink
                    //     ({
                    //         href: { pass: list.pass, tag: "@overall", hash: "history" },
                    //         children: menuItem(label("History")),
                    //     }),
                    //     exportListMenuItem(list.pass),
                    //     menuItem
                    //     (
                    //         label("Delete"),
                    //         async () =>
                    //         {
                    //             // Storage.Pass.remove(list.pass);
                    //             // await reload();
                    //             Operate.removeList(list.pass);
                    //             updateScreen("operate");
                    //         },
                    //         "delete-button"
                    //     )
                    // ]),
                ]),
            ]),
        ]);
        export const reloadScreen = async () =>
        {
            let isCanceled = false;
            const loadingToast = makeToast
            ({
                content: $span("")(locale.map("Communicating with server...")),
                backwardOperator: cancelTextButton
                (
                    async () =>
                    {
                        loadingToast.hide(); // nowait
                        isCanceled = true;
                    }
                ),
                wait: 0,
            });
            try
            {
                await getLatestBuildTimestamp();
                if ( ! isCanceled)
                {
                    const reload =
                    {
                        url: location.href,
                        fullscreen: fullscreenEnabled() && null !== fullscreenElement(),
                        scroll: getScreenBody().scrollTop,
                        dummy: new Date().getTime(),
                    };
                    location.href = `?reload=${encodeURIComponent(JSON.stringify(reload))}`;
                }
                await loadingToast.hide();
            }
            catch(error)
            {
                loadingToast.hide();
                const retryToast = makeToast
                ({
                    forwardOperator: textButton
                    (
                        "Retry",
                        async () =>
                        {
                            retryToast.hide(); // nowait
                            reloadScreen();
                        }
                    ),
                    content: label("Could not access the server successfully."),
                    backwardOperator: cancelTextButton(async () => await retryToast.hide()),
                    wait: 0,
                });
                console.error(error);
            }
        };
        export const welcomeScreenMenu = async () =>
        [
            // menuItem
            // (
            //     label("Reload screen"),
            //     reloadScreen
            // ),
            await fullscreenMenuItem(),
            menuSeparator(),
            systemSettingsMenuItem(),
            menuSeparator(),
            menuItem
            (
                label("New ToDo List"),
                newListPrompt,
            ),
            importListMenuItem(),
            removedListMenuItem(),
            menuSeparator(),
            repositoryMenuItem(),
        ];
        export const getVersionTimestampText = () => Domain.dateStringFromTick(buildTimestamp.tick /Domain.timeAccuracy);
        export const getVersionPasttimeText = () => `${Domain.timeLongStringFromTick((new Date().getTime() - buildTimestamp.tick) /Domain.timeAccuracy)} ${locale.map("ago")}`;
        export const getVersionInfromationText = () => `${locale.immutable("build timestamp")}: ${getVersionTimestampText()} ( ${getVersionPasttimeText()} )`;
        export const matchKeyboardShortcutsContext = (urlParams: PageParams, context: KeyboardShortcutsContext) =>
        {
            switch(context)
            {
            case "whenever":
                return true;
            case "with filter":
                return undefined !== getFilterInputElement();
            case "with list":
                return urlParams.pass;
            case "with tag":
                return urlParams.pass && urlParams.tag;
            }
            return false;
        };
        export const keyboardShortcutsItem = (i: keyboardShortcutsItem) =>
        [
            $span("key monospace")(i.key.map(k => $tag("kbd")({})(`${k}`))),
            locale.map(i.message),
            i.reverseWithShiftKey ? [ " ( + ", $span("key monospace")($tag("kbd")({})(`Shift`)), locale.map("Reverse") +" )", ]: "",
        ];
        export const emoji = async (image: Resource.EmojiType) =>
        {
            const setting = Storage.SystemSettings.get().emoji ?? "auto";
            if ("system" === setting || ("auto" === setting && minamo.environment.isApple()))
            {
                return image;
            }
            else
            //if ("note-emoji" === setting || ("auto" === setting && ! isApple))
            {
                return await Resource.loadEmojiSvgOrCache(image);
            }
        };
        export const poem = async (data: keyof typeof pomeJson.image | { title: string, subtitle: string, description: minamo.dom.Source, image: Resource.EmojiType, }, className: string = ""): Promise<minamo.dom.Source> =>
            "string" === typeof data ?
                await poem
                (
                    {
                        title: locale.string(`poem.${data}.title`),
                        subtitle: locale.string(`poem.${data}.subtitle`),
                        description: stringOrJson<minamo.dom.Source>(locale.string(`poem.${data}.description`)),
                        image: pomeJson.image[data],
                    },
                    className
                ):
                $div(`poem ${className}`)
                ([
                    $span("poem-title")(data.title),
                    $span("poem-subtitle")(data.subtitle),
                    $span("poem-description")(data.description),
                    // $span("poem-image")(data.image),
                    $span("poem-image")(await emoji(data.image)),
                ]);
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
                $div("row-flex-list compact-flex-list list-list")
                    (await Promise.all(OldStorage.Pass.get().map(pass => listItem(JSON.parse(OldStorage.exportJson(pass)) as Content)))),
                // $div("button-line")
                // ([
                //     {
                //         tag: "button",
                //         // className: OldStorage.Pass.get().length <= 0 ? "default-button main-button long-button": "main-button long-button",
                //         className: "default-button main-button long-button",
                //         children: label("New ToDo List"),
                //         onclick: newListPrompt,
                //     },
                //     await menuButton
                //     ([
                //         importListMenuItem(),
                //         removedListMenuItem(),
                //     ]),
                // ]),
                $div("signboard")
                ([
                    // $div("logo")([await applicationIcon(),$span("logo-text")(applicationTitle)]),
                    await poem("primary", "poem primary-poem"),
                    $div("button-list")
                    ([
                        {
                            tag: "button",
                            // className: OldStorage.Pass.get().length <= 0 ? "default-button main-button long-button": "main-button long-button",
                            className: "default-button main-button long-button",
                            children: label("New ToDo List"),
                            onclick: newListPrompt,
                        },
                        // await menuButton
                        // ([
                        //     importListMenuItem(),
                        //     removedListMenuItem(),
                        // ]),
                        $div("button-list")
                        ([
                            textButton
                            (
                                "System settings",
                                async () =>
                                {
                                    if (await systemSettingsPopup())
                                    {
                                        await reload();
                                    }
                                }
                            ),
                            $span("separator")("・"),
                            textButton
                            (
                                "Import List",
                                async () => showUrl({ hash: "import", })
                            ),
                            $span("separator")("・"),
                            textButton
                            (
                                "@deleted",
                                async () => showUrl({ hash: "removed", })
                            ),
                        ])
                    ]),
                ]),
                $div("poem-list")(await Promise.all((<(keyof typeof pomeJson.image)[]>pomeJson.list.welcome).map(i => poem(i)))),
                // $div({ style: "text-align: center; padding: 0.5rem;", })
                //     ("🚧 This static web application is under development. / この Static Web アプリは開発中です。"),
                // messageList
                // ([
                //     messagePanel(label("You can use this web app like an app by registering it on the home screen of your smartphone.")),
                //     messagePanel(labelSpan(keyboardShortcutsItem(keyboardShortcuts[0]))),
                // ]),
                $div("bottom-line version-information")(getVersionInfromationText()),
            ]
        });
        export const showWelcomeScreen = async () =>
        {
            const updateScreen = async (event: UpdateScreenEventEype) =>
            {
                switch(event)
                {
                case "high-resolution-timer":
                    updateHeaderTimestamp();
                    break;
                case "timer":
                    minamo.dom.setProperty(document.getElementsByClassName("version-information")[0], "innerText", getVersionInfromationText());
                    break;
                case "storage":
                case "operate":
                case "dirty":
                    await reload();
                    break;
                }
            }
            await showScreen(await welcomeScreen(), updateScreen);
            checkApplicationUpdate();
        };
        export const updatingScreenMenu = async () =>
        [
            menuLinkItem
            (
                label("Back to Top"),
                { },
            ),
            repositoryMenuItem(),
        ];
        let updatingAt = 0;
        export const updatingScreenBody = async () =>
        {
            removeProgressStyle();
            // minamo.dom.appendChildren
            // (
            //     getScreenBody(),
            //     await applicationIcon()
            // );
            // await minamo.core.timeout(30);
            getScreenBody().classList.toggle("updating", true);
            updatingAt = new Date().getTime();
            await minamo.core.timeout(125);
        };
        export const updatedScreenBody = async () =>
        {
            const now = new Date().getTime();
            const transitionSpanMin = 250;
            const wait = Math.min(updatingAt +transitionSpanMin -now, transitionSpanMin);
            if (0 < wait)
            {
                await minamo.core.timeout(wait);
            }
            getScreenBody().classList.toggle("updating", false);
        };
        export const updatingScreen = async () =>
        {
            removeProgressStyle();
            getScreen().classList.toggle("updating", true);
            updatingAt = new Date().getTime();
            await minamo.core.timeout(125);
        };
        export const updatedScreen = async () =>
        {
            const now = new Date().getTime();
            const transitionSpanMin = 250;
            const wait = Math.min(updatingAt +transitionSpanMin -now, transitionSpanMin);
            if (0 < wait)
            {
                await minamo.core.timeout(wait);
            }
            getScreen().classList.toggle("updating", false);
        };
        // export const updatingScreen = async (_url: string = location.href): Promise<ScreenSource> =>
        // ({
        //     className: "updating-screen",
        //     header:
        //     {
        //         items:
        //         [
        //             await screenHeaderHomeSegment(),
        //             {
        //                 icon: "list-icon",
        //                 title: "loading...",
        //             },
        //         ],
        //         menu: await updatingScreenMenu(),
        //         parent: { },
        //     },
        //     body:
        //     [
        //         //await applicationColorIcon(),
        //         await applicationIcon(),
        //         // $div("message")(label("Updating...")),
        //         // $div("button-list")
        //         // ({
        //         //     tag: "button",
        //         //     className: "default-button main-button long-button",
        //         //     children: label("Reload"),
        //         //     onclick: async () => await showPage(url),
        //         // }),
        //     ]
        // });
        // export const showUpdatingScreen = async (url: string = location.href) =>
        //     await showScreen(await updatingScreen(url));
        export const updateTitle = () =>
        {
            document.title = Array.from(getHeaderElement().getElementsByClassName("segment-title"))
                ?.map(div => (<HTMLDivElement>div).innerText)
                // ?.reverse()
                ?.join(" / ")
                ?? applicationTitle;
        };
        export type UpdateScreenEventEype = "high-resolution-timer" | "timer" | "scroll" | "storage" | "focus" | "blur" | "operate" | "dirty" | "click-header";
        export let updateScreen: (event: UpdateScreenEventEype) => unknown;
        let updateScreenTimer: NodeJS.Timeout;
        let updateHighResolutionTimer: NodeJS.Timeout;
        let previousScrollTop: number = 0;
        export const getHeaderElement = () => document.getElementById("screen-header") as HTMLDivElement;
        export const updateTopAndBottomUIState = (scrollTop: number, scrollMax: number) =>
        {
            const uiStyle = Storage.SystemSettings.get().uiStyle ?? "fixed";
            let isImmersive = false;
            if ("fixed" !== uiStyle)
            {
                const isNearTop = scrollTop < 40;
                const isNearBottom = (scrollMax - 58) < scrollTop;
                const isNearTopOrBottom = isNearTop || isNearBottom;
                const isToDownScroll = previousScrollTop < scrollTop;
                isImmersive = ! isNearTopOrBottom && isToDownScroll;
            }
            minamo.dom.toggleCSSClass(Render.getScreen(), "immersive", isImmersive);
            previousScrollTop = scrollTop;
        }
        export const scrollBackgroundLogo = (scrollTop: number) =>
        {
            const logo = document.getElementById("foundation")?.getElementsByTagName("svg")?.[0];
            if (logo)
            {
                const screenBody = getScreenBody();
                const frame = screenBody.clientHeight +logo.clientHeight;
                let y = (scrollTop /50) %frame;
                if (frame /2 < y)
                {
                    y -= frame;
                }
                logo.style.transform = `translateY(${-y}px)`;
            }
            // if (logo)
            // {
            //     const frame = screenBody.clientHeight +logo.clientHeight;
            //     const rate = (scrollTop /10) /frame;
            //     logo.style.transform = `scale(${1 +rate},${1 +rate})`;
            // }
};
        export const showScreen = async (screen: ScreenSource, updateScreen?: (event: UpdateScreenEventEype) => unknown) =>
        {
            removeProgressStyle();
            if (undefined !== updateScreen)
            {
                Render.updateScreen = async (event: UpdateScreenEventEype) =>
                {
                    switch(event)
                    {
                        case "storage":
                        case "operate":
                        case "dirty":
                            updateLatestScreenOperatedAt();
                            break;
                    }
                    await updateScreen(event);
                };
            }
            else
            {
                Render.updateScreen = async (event: UpdateScreenEventEype) =>
                {
                    switch(event)
                    {
                        case "high-resolution-timer":
                            updateHeaderTimestamp();
                            break;
                        case "storage":
                        case "operate":
                        case "dirty":
                            await reload(); // include updateLatestScreenOperatedAt()
                            break;
                    }
                };
            }
            if (undefined === updateScreenTimer)
            {
                updateScreenTimer = setInterval
                (
                    () => Render.updateScreen?.("timer"),
                    Domain.timeAccuracy
                );
                const screenBody = getScreenBody();
                screenBody.addEventListener
                (
                    "scroll",
                    () =>
                    {
                        const screenBody = getScreenBody();
                        const scrollMax = screenBody.scrollHeight -screenBody.clientHeight;
                        const scrollTop = Math.min(Math.max(screenBody.scrollTop, 0), scrollMax);
                        if (scrollTop <= 0)
                        {
                            Render.updateScreen?.("scroll");
                        }
                        updateTopAndBottomUIState(scrollTop, scrollMax);
                        scrollBackgroundLogo(scrollTop);
                    }
                );
            }
            if (undefined === updateHighResolutionTimer)
            {
                updateHighResolutionTimer = setInterval
                (
                    () => Render.updateScreen?.("high-resolution-timer"),
                    100
                );
            }
            Render.getScreen().className = `${screen.className} screen`;
            updateUiStyle();
            minamo.dom.replaceChildren
            (
                getHeaderElement(),
                await screenSegmentedHeader(screen.header)
            );
            replaceScreenBody(screen.body);
            minamo.dom.replaceChildren
            (
                minamo.core.existsOrThrow(document.getElementById("screen-footer")),
                screen.footer ?? [],
            );
            getHeaderElement().classList.toggle("header-operator-has-focus", "" !== getFilterText());
            updateTitle();
            //minamo.core.timeout(100);
            resizeFlexList();
        };
        export interface Toast
        {
            dom: HTMLDivElement;
            timer: NodeJS.Timeout | null;
            hide: () => Promise<unknown>;
        }
        const toastMap: { [id: string]: Toast } = { };
        export const getToast = (id: string) => toastMap[id];
        export const makeToast =
        (
            data:
            {
                id?: string,
                content: minamo.dom.Source,
                backwardOperator?: minamo.dom.Source,
                forwardOperator?: minamo.dom.Source,
                isWideContent?: boolean,
                wait?: number,
            }
        ): Toast =>
        {
            getToast(data.id ?? "")?.hide?.();
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
                    // if (minamo.core.existsOrThrow(document.getElementById("screen-toast")).getElementsByClassName("item").length <= 0)
                    // {
                    //     await minamo.core.timeout(10);
                    //     updateScreen("operate");
                    // }
                }
            };
            const wait = data.wait ?? 5000;
            const result: Toast =
            {
                dom,
                timer: 0 < wait ? setTimeout
                (
                    () =>
                    {
                        if (isPressedShift)
                        {
                            pausedToastList.push(result);
                        }
                        else
                        {
                            hideRaw("slow-slide-down-out", 500);
                        }
                    },
                    wait
                ): null,
                hide: async () => await hideRaw("slide-down-out", 250),
            };
            minamo.core.existsOrThrow(document.getElementById("screen-toast")).appendChild(dom);
            setTimeout(() => dom.classList.remove("slide-up-in"), 250);
            if (data.id)
            {
                toastMap[data.id] = result;
            }
            return result;
        };
        export const getProgressElement = () => minamo.core.existsOrThrow(document.getElementById("screen-header"));
        export const setProgressStyleRaw = (className: string) => getProgressElement().className = `segmented ${className}`;
        let lastSetProgressAt = 0;
        export const setProgressStyle = async (className: string, timeout: number = 0) =>
        {
            setProgressStyleRaw(className);
            if (0 < timeout)
            {
                const timestamp = lastSetProgressAt = new Date().getTime();
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
        export const removeProgressStyle = () => setProgressStyleRaw("");
        export const withProgress = async <T>(className: string, content: minamo.dom.Source, task: Promise<T>): Promise<T> =>
        {
            setProgressStyle(className);
            const toast = makeToast
            ({
                content,
                wait: 0,
            });
            const result = await task;
            setProgressStyle("");
            toast.hide();
            return result;
        };
        export const withUpdateProgress = async <T>(content: minamo.dom.Source, task: Promise<T>): Promise<T> =>
            await withProgress("update", content, task);
        export const resizeFlexList = () =>
        {
            const bottomTabsHeight = minamo.core.existsOrThrow(document.getElementById("screen-footer")).clientHeight;
            const minColumns = 1 +Math.floor(window.innerWidth / 780);
            const maxColumns = Math.min(12, Math.max(minColumns, Math.floor(window.innerWidth / 450)));
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
                        const height = window.innerHeight -(list.offsetTop +bottomTabsHeight);
                        const itemHeight = (list.childNodes[0] as HTMLElement).offsetHeight +1;
                        const columns = Math.min(maxColumns, Math.ceil(length / Math.max(1.0, Math.floor(height / itemHeight))));
                        const row = Math.max(Math.ceil(length /columns), Math.min(length, Math.floor(height / itemHeight)));
                        list.style.height = `${row *itemHeight}px`;
                        list.classList.add(`max-column-${columns}`);
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
                        const height = window.innerHeight -(list.offsetTop +bottomTabsHeight);
                        const itemHeight = (list.childNodes[0] as HTMLElement).offsetHeight;
                        const columns = list.classList.contains("compact-flex-list") ?
                            Math.min(maxColumns, length):
                            Math.min(maxColumns, Math.ceil(length / Math.max(1.0, Math.floor(height / itemHeight))));
                        list.classList.add(`max-column-${columns}`);
                    }
                    list.classList.toggle("empty-list", length <= 0);
                }
            );
            minamo.dom.setStyleProperty
            (
                minamo.core.existsOrThrow(document.getElementById("screen-toast")),
                "bottom",
                `${bottomTabsHeight}px`
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
        let lastNewVersionCheckAt = 0;
        let wasShowNewVersionToast = false;
        export const checkApplicationUpdate = async () =>
        {
            if ( ! wasShowNewVersionToast)
            {
                const now = new Date().getTime();
                if (lastNewVersionCheckAt +(60 * 60 *1000) < now)
                {
                    lastNewVersionCheckAt = now;
                    if (await isNewVersionReady())
                    {
                        wasShowNewVersionToast = true;
                        const toast = makeToast
                        ({
                            forwardOperator: textButton
                            (
                                "Update",
                                () =>
                                {
                                    toast.hide(); // nowait
                                    reloadScreen();
                                }
                            ),
                            content: label("There is a new version!"),
                            backwardOperator: closeTextButton(async () => await toast.hide()),
                            wait: 0,
                        });
                    }
                }
            }
        };
        export const onWindowFocus = async () =>
        {
            updateScreen?.("focus");
            await checkApplicationUpdate();
        };
        export const onWindowBlur = () =>
        {
            updateScreen?.("blur");
            getScreenCoverList().forEach
            (
                i =>
                {
                    if (0 < i.getElementsByClassName("menu-popup").length)
                    {
                        i.click();
                    }
                }
            );
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
                        updateScreen?.("storage");
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
        let isPressedShift: boolean = false;
        let pausedToastList: Toast[] = [];
        //let releaseToastsTimer: NodeJS.Timeout = 0 as unknown as NodeJS.Timeout;
        const releaseToastsTimer = new minamo.core.Timer
        (
            async () =>
            {
                while( ! isPressedShift)
                {
                    const i = pausedToastList.shift();
                    if (i)
                    {
                        await i.hide();
                        await minamo.core.timeout(100);
                    }
                    else
                    {
                        return;
                    }
                }
            },
            500
        );
        export const releaseToasts = () => releaseToastsTimer.set();
        export const onKeydown = (event: KeyboardEvent) =>
        {
            if ("Shift" === event.key)
            {
                isPressedShift = true;
            }
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
                    const url = location.href;
                    const urlParams = getUrlParams(url);
                    const hash = getUrlHash(url);
                    const tag = urlParams["tag"] ?? "";
                    // const todo = urlParams["todo"];
                    const pass = urlParams["pass"] ?? `${OldStorage.sessionPassPrefix}: ${new Date().getTime()}`;
                    const destinationItem = event.shiftKey ? previousItem: nextItem;
                    switch(event.key.toUpperCase())
                    {
                        case "F":
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
                        case "L":
                            const list = OldStorage.Pass.get();
                            if (0 < list.length)
                            {
                                showUrl({ pass: destinationItem(list, pass), tag: "@overall", }); // nowait
                            }
                            break;
                        case "H":
                            if (pass)
                            {
                                if (event.shiftKey)
                                {
                                    if (tag)
                                    {
                                        showUrl({ pass, tag, hash: nextItem(["", "history"], hash)}); // nowait
                                    }
                                }
                                else
                                {
                                    showUrl({ pass, tag: "@overall", }); // nowait
                                }
                            }
                            break;
                        case "D":
                            if (pass)
                            {
                                showUrl({ pass, tag: destinationItem(getTagList({ pass, sublist: true, }), tag),}); // nowait
                            }
                            break;
                        case "T":
                            if (pass)
                            {
                                showUrl({ pass, tag: destinationItem(getTagList({ pass, tag: true, }), tag),}); // nowait
                            }
                            break;
                        case "A":
                            if (pass)
                            {
                                showUrl({ pass, tag: destinationItem(getTagList({ auto: true, }), tag),}); // nowait
                            }
                            break;
                        case "P":
                            if (pass)
                            {
                                showUrl({ pass, tag: destinationItem(getTagList({ term: true, }), tag),}); // nowait
                            }
                            break;
                        case "V":
                            if (pass && tag && undefined !== hash)
                            {
                                const settings = OldStorage.TagSettings.get(pass, tag);
                                const defaultStyle = getTagDisplayStyleDefault(tag);
                                const current = settings.displayStyle ?? defaultStyle;
                                const list: ("@list" | Exclude<TagSettings["displayStyle"], undefined>)[] = "@list" === tag ?
                                    [ "full", "digest", "simple", "compact", ]:
                                    [ "@list", "full", "digest", "simple", "compact", ];
                                const next = destinationItem(list, current);
                                settings.displayStyle = defaultStyle === next ? undefined: <Exclude<TagSettings["displayStyle"], undefined>>next;
                                OldStorage.TagSettings.set(pass, tag, settings);
                                reload(); // nowait
                                const toast = makeToast
                                ({
                                    id: "change-display-style",
                                    content: $span("")(`${locale.map("Display style has changed!")}: ${locale.map(getTagDisplayStyleText(current))} → ${locale.map(getTagDisplayStyleText(next))}`),
                                    backwardOperator: cancelTextButton
                                    (
                                        async () =>
                                        {
                                            const settings = OldStorage.TagSettings.get(pass, tag);
                                            settings.displayStyle = defaultStyle === current ? undefined: <Exclude<TagSettings["displayStyle"], undefined>>current;
                                            OldStorage.TagSettings.set(pass, tag, settings);
                                            toast.hide(); // nowait
                                            await reload();
                                        }
                                    ),
                                });
                            }
                            break;
                        case "G":
                            if (pass && tag && undefined !== hash)
                            {
                                const settings = OldStorage.TagSettings.get(pass, tag);
                                const defaultStyle = getTagProgressScaleStyleDefault(tag);
                                const current = settings.progressScaleStyle ?? defaultStyle;
                                const list: ("@list" | "none" | "full")[] = "@list" === tag ?
                                    [ "none", "full", ]:
                                    [ "@list", "none", "full", ];
                                const next = destinationItem(list, current);
                                settings.progressScaleStyle = defaultStyle === next ? undefined: <"none" | "full">next;
                                OldStorage.TagSettings.set(pass, tag, settings);
                                reload(); // nowait
                                const toast = makeToast
                                ({
                                    id: "change-gauge-style",
                                    content: $span("")(`${locale.map("Gauge style has changed!")}: ${locale.map(getTagProgressScaleStyleText(current))} → ${locale.map(getTagProgressScaleStyleText(next))}`),
                                    backwardOperator: cancelTextButton
                                    (
                                        async () =>
                                        {
                                            const settings = OldStorage.TagSettings.get(pass, tag);
                                            settings.progressScaleStyle = defaultStyle === current ? undefined: <"none" | "full">current;
                                            OldStorage.TagSettings.set(pass, tag, settings);
                                            toast.hide(); // nowait
                                            await reload();
                                        }
                                    ),
                                });
                            }
                            break;
                        case "O":
                            if (pass && tag && undefined !== hash)
                            {
                                const settings = OldStorage.TagSettings.get(pass, tag);
                                const defaultSort = getTagSortSettingsDefault(tag);
                                const current = settings.sort ?? defaultSort;
                                const list: ("@list" | "smart" | "simple" | "simple-reverse")[] = "@list" === tag ?
                                    [ "smart", "simple", "simple-reverse", ]:
                                    [ "@list", "smart", "simple", "simple-reverse", ];
                                const next = destinationItem(list, current);
                                settings.sort = defaultSort === next ? undefined: <"smart" | "simple">next;
                                OldStorage.TagSettings.set(pass, tag, settings);
                                reload(); // nowait
                                const toast = makeToast
                                ({
                                    id: "change-sort",
                                    content: $span("")(`${locale.map("Sort orer has changed!")}: ${locale.map(getTagSortSettingsText(current))} → ${locale.map(getTagSortSettingsText(next))}`),
                                    backwardOperator: cancelTextButton
                                    (
                                        async () =>
                                        {
                                            const settings = OldStorage.TagSettings.get(pass, tag);
                                            settings.sort = defaultSort === current ? undefined: <"smart" | "simple">current;
                                            OldStorage.TagSettings.set(pass, tag, settings);
                                            toast.hide(); // nowait
                                            await reload();
                                        }
                                    ),
                                });
                            }
                            break;
                        case "M":
                            {
                                const settings = Storage.SystemSettings.get();
                                const defaultTheme = "auto";
                                const current = settings.theme ?? defaultTheme;
                                const list: ThemeType[] = [ "auto", "light", "dark", ];
                                const next = destinationItem(list, current);
                                settings.theme = defaultTheme === next ? undefined: next;
                                Storage.SystemSettings.set(settings);
                                updateStyle();
                                const toast = makeToast
                                ({
                                    id: "change-sort",
                                    content: $span("")(`${locale.map("Theme has changed!")}: ${locale.map(getThemeLocale(current))} → ${locale.map(getThemeLocale(next))}`),
                                    backwardOperator: cancelTextButton
                                    (
                                        async () =>
                                        {
                                            const settings = Storage.SystemSettings.get();
                                            settings.theme = defaultTheme === current ? undefined: current;
                                            Storage.SystemSettings.set(settings);
                                            toast.hide(); // nowait
                                            updateStyle();
                                        }
                                    ),
                                });
                            }
                            break;
                        case "W":
                            {
                                const settings = Storage.SystemSettings.get();
                                const defaultLanguage = "@auto";
                                const current = settings.locale ?? defaultLanguage;
                                const list = [ defaultLanguage, ].concat(locale.locales);
                                const next = <"@auto" | locale.LocaleType>destinationItem(list, current);
                                settings.locale = defaultLanguage === next ? undefined: <locale.LocaleType>next;
                                Storage.SystemSettings.set(settings);
                                setLocale(settings.locale ?? null);
                                reload(); // no wait
                                const toast = makeToast
                                ({
                                    id: "change-sort",
                                    content: $span("")(`${locale.map("Language has changed!")}: ${locale.getLocaleName(current)} → ${locale.getLocaleName(next)}`),
                                    backwardOperator: cancelTextButton
                                    (
                                        async () =>
                                        {
                                            const settings = Storage.SystemSettings.get();
                                            settings.locale = defaultLanguage === current ? undefined: current;
                                            Storage.SystemSettings.set(settings);
                                            setLocale(settings.locale ?? null);
                                            toast.hide(); // nowait
                                            await reload();
                                        }
                                    ),
                                });
                            }
                            break;
                        case "S":
                            const filterIcon = Array.from(document.getElementsByClassName("filter-icon"))[0] as HTMLDivElement;
                            if (filterIcon)
                            {
                                filterIcon.click();
                                event.preventDefault();
                            }
                            break;
                        case "?":
                            Render.makeToast
                            ({
                                id: "keyboard-shortcuts",
                                content: $tag("dl")({})
                                (
                                    groupBy
                                    (
                                        keyboardShortcuts
                                        .filter(i => matchKeyboardShortcutsContext(urlParams, i.context)),
                                        i => locale.map(getKeyboardShortcutsCategoryLocale(i.category))
                                    )
                                    .map
                                    (
                                        i =>
                                        [
                                            $tag("dt")({})(i.group),
                                            $tag("dd")({})
                                            (
                                                $tag("ul")("keyboard-shortcuts")
                                                (
                                                    i.list.map
                                                    (
                                                        i => $tag("li")({})(keyboardShortcutsItem(i))
                                                    )
                                                )
                                            )
                                        ]
                                    )

                                ),
                                isWideContent: true,
                            });
                            break;
                    }
                }
            }
        };
        export const onKeyup = (event: KeyboardEvent) =>
        {
            if ("Shift" === event.key)
            {
                isPressedShift = false;
                releaseToasts();
            }
        }
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
        // const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark": "light";
        // const theme = "auto" === setting ? system: setting;
        [ "auto", "light", "dark", ].forEach
        (
            i => document.body.classList.toggle(i, i === setting)
        );
    };
    export const updateUiStyle = () =>
    {
        const uiStyle = Storage.SystemSettings.get().uiStyle ?? "fixed";
        if ("fixed" === uiStyle)
        {
            minamo.dom.toggleCSSClass(Render.getScreen(), "immersive", false);
        }
        minamo.dom.toggleCSSClass(Render.getScreen(), "ui-style-slide", "slide" === uiStyle);
        minamo.dom.toggleCSSClass(Render.getScreen(), "ui-style-fade", "fade" === uiStyle);
    };
    export const updateFlashStyle = () =>
    {
        const flashStyle = Storage.SystemSettings.get().flashStyle ?? "breath";
        [ "gradation", "breath", "solid", "none", ].forEach
        (
            i => document.body.classList.toggle(`flash-style-${i}`, i === flashStyle)
        );
    };
    export const getLatestBuildTimestamp = async (): Promise<number> =>
        JSON.parse(await minamo.http.get(`./build.timestamp.json?dummy=${new Date().getTime()}`));
    let buildTimestamp: { stamp: string, tick: number, };
    export const isNewVersionReady = async (): Promise<boolean> =>
    {
        try
        {
            const latestBuildTimestamp = await getLatestBuildTimestamp();
            return "number" === typeof latestBuildTimestamp && latestBuildTimestamp !== buildTimestamp.tick;
        }
        catch(error)
        {
            console.error(error);
            return false;
        }
    };
    export const decayRemovedItems = () =>
    {
        const isDirty =
            [
                OldStorage.Backup.decay(),
                ...OldStorage.Pass.get().map(pass => OldStorage.Removed.decay(pass)),
            ].
            reduce((a,b) => a || b, false);
        if (isDirty)
        {
            Render.updateScreen?.("dirty");
        }
    }
    let FlashBodyColor = <FlounderStyle.Type.Color>style.__ACCENT_COLOR__;
    export const makeFlashBodyStyle = (tick: number) =>
    {
        if (undefined !== Render.Operate.flashBodyAt)
        {
            if (Render.Operate.flashBodyAt < 0)
            {
                Render.Operate.flashBodyAt = tick;
                FlashBodyColor = Render.linearNeutralColorString(style.__ACCENT_COLOR__, Render.getBackgroundColor(), 0.4);
            }
            const elapsed = ((tick -Render.Operate.flashBodyAt) *100) /1500;
            const step = Render.modRate(elapsed, 50);
            if (elapsed < 50)
            {
                return FlounderStyle.styleToString
                (
                    FlounderStyle.makeStyle
                    ({
                        type: "triline",
                        // layoutAngle: step,
                        foregroundColor: FlashBodyColor,
                        backgroundColor: Render.getBackgroundColor(),
                        depth: step,
                        blur: 6.0,
                        intervalSize: document.body.clientHeight +document.body.clientWidth,
                        // reverseRate: "auto",
                        anglePerDepth: "auto",
                    })
                );
            }
            else
            if (elapsed < 100)
            {
                return FlounderStyle.styleToString
                (
                    FlounderStyle.makeStyle
                    ({
                        type: "triline",
                        // layoutAngle: step,
                        foregroundColor: Render.getBackgroundColor(),
                        backgroundColor: FlashBodyColor,
                        depth: step,
                        blur: 6.0,
                        intervalSize: document.body.clientHeight +document.body.clientWidth,
                        // reverseRate: "auto",
                        anglePerDepth: "auto",
                    })
                );
            }
            else
            {
                Render.Operate.flashBodyAt = undefined;
            }
        }
        return "";
    }
    export const makeFlashBodyStyleEntry = (tick: number) => `body #foundation #flash-layer {${makeFlashBodyStyle(tick)}}\r\n`;
    export const makeStyleEntry = (classList: string, style: string): string =>
        classList.split(" ").filter(i => "" !== i).map(i => `.${i}`).join("") +" {" +style +"}\r\n";
    export const isEnabledAnimation = (settings: SystemSettings = Storage.SystemSettings.get()) =>
        "none" !== getAnimationDurationOrDefaut(settings);
    export const makeAnimationStyle = (tick: number): string =>
    {
        let result = makeFlashBodyStyleEntry(tick);
        result += [ "default", "flash", "pickup", "restriction", ].map
        (
            (status: Render.ProgressStatusType) => [ 0, null, ].map
            (
                progress => makeStyleEntry
                (
                    Render.progressClass(progress, status),
                    Render.progressBackgroundStyle(progress, status, tick)
                )
            )
            .join("")
        )
        .join("");
        return result;
    };
    let latestScreenOperatedAt: number = 0;
    let isInAnimation = false;
    export const updateLatestScreenOperatedAt = (now = new Date().getTime()) =>
    {
        latestScreenOperatedAt = now;
        if ( ! isInAnimation)
        {
            isInAnimation = true;
            window.requestAnimationFrame(styleAnimation);
        }
    };
    export const getAnimationDuration = (animationDuration: AnimationDurationType = getAnimationDurationOrDefaut()): number =>
    {
        switch(animationDuration)
        {
        case "none":
            return 0;
        case "ever":
            return minamo.core.parseTimespan("10y") as number;
        case "auto":
            {
                const screenArea = window.innerWidth *window.innerHeight;
                if (screenArea < 500000)
                {
                    return minamo.core.parseTimespan("10s") as number;
                }
                else
                if (screenArea < 1000000)
                {
                    return minamo.core.parseTimespan("1m") as number;
                }
                else
                {
                    return minamo.core.parseTimespan("10m") as number;
                }
            }
        }
        return minamo.core.parseTimespan(animationDuration) as number;
    };
    export const styleAnimation = (tick: number) =>
    {
        const now = new Date().getTime();
        if (now < latestScreenOperatedAt +Math.max(getAnimationDuration(), 10 *1000))
        {
            const styleElement = document.getElementById("style") as HTMLStyleElement;
            minamo.dom.setProperty(styleElement, "innerHTML", makeAnimationStyle(tick));
            window.requestAnimationFrame(styleAnimation);
        }
        else
        {
            isInAnimation = false;
        }
    };
    export const start = async (params: { buildTimestamp: string, buildTimestampTick: number, }) =>
    {
        buildTimestamp =
        {
            stamp: params.buildTimestamp,
            tick: params.buildTimestampTick,
        };
        console.log(`start timestamp: ${new Date()}`);
        console.log(`${JSON.stringify(params)}`);
        setLocale(Storage.SystemSettings.get().locale ?? null);
        minamo.dom.removeChildren(Render.getScreenBody());
        minamo.dom.appendChildren
        (
            document.getElementById("foundation") as HTMLDivElement,
            await Render.applicationIcon()
        );
        const urlParams = getUrlParams(location.href);
        const reload = urlParams["reload"];
        let scroll: number | undefined;
        if (reload)
        {
            const json = JSON.parse(reload);
            const url = json["url"];
            if (url)
            {
                history.replaceState(null, applicationTitle, url);
            }
            const fullscreen = json["fullscreen"];
            if (fullscreen && Render.fullscreenEnabled())
            {
                const toast = Render.makeToast
                ({
                    forwardOperator: Render.textButton
                    (
                        "Full screen",
                        async () =>
                        {
                            toast.hide(); // nowait
                            await Render.requestFullscreen();
                        }
                    ),
                    content: Render.label("Full screen has been canceled due to reloading."),
                });
            }
            scroll = json["scroll"];
        }
        window.onpopstate = () => showPage();
        window.addEventListener('resize', Render.onWindowResize);
        window.addEventListener('focus', Render.onWindowFocus);
        window.addEventListener('blur', Render.onWindowBlur);
        window.addEventListener('storage', Render.onUpdateStorage);
        window.addEventListener('compositionstart', Render.onCompositionStart);
        window.addEventListener('compositionend', Render.onCompositionEnd);
        window.addEventListener('keydown', Render.onKeydown);
        window.addEventListener('keyup', Render.onKeyup);
        window.addEventListener('online', () => console.log("✅ ONLINE!"));
        window.addEventListener('offline', () => console.log("🚫 OFFLINE!"));
        minamo.core.existsOrThrow(document.getElementById("screen-header")).addEventListener
        (
            'click',
            async () =>
            {
                Render.updateScreen?.("click-header");
                const body = Render.getScreenBody();
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
        // window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", updateStyle);
        decayRemovedItems();
        setInterval
        (
            decayRemovedItems,
            minamo.core.parseTimespan(config.removedItemDecayInterval) ?? 60 *60 *1000
        )
        updateStyle();
        updateFlashStyle();
        updateUiStyle();
        document.body.classList.toggle("chrome", !!((<any>window).chrome));
        // await Render.showUpdatingScreen(location.href);
        let url = location.href;
        if (minamo.environment.isPWA())
        {
            const latestShowUrl = Storage.System.getLatestShowUrl();
            if ("string" === typeof latestShowUrl)
            {
                Storage.System.setLatestShowUrl();
                url = latestShowUrl;
            }
        }
        await showPage(url);
        if ("number" === typeof scroll)
        {
            Render.getScreenBody().scrollTop = scroll;
        }
        if (reload || "reload" === (<any>performance.getEntriesByType("navigation"))?.[0]?.type)
        {
            Render.makeToast
            ({
                content: Render.$span("")(Render.getVersionInfromationText()),
                isWideContent: true,
            });
        }
    };
    export const showPage = async (url: string = location.href, _wait: number = 0) =>
    {
        updateLatestScreenOperatedAt();
        window.scrollTo(0,0);
        const body = Render.getScreenBody();
        body.scrollTo(0,0);
        // await Render.updatingScreenBody();
        await Render.updatingScreen();
        //await Render.showUpdatingScreen(url);
        //await minamo.core.timeout(wait);
        const urlParams = getUrlParams(url);
        const hash = getUrlHash(url);
        const tag = urlParams["tag"] ?? "";
        const todo = urlParams["todo"];
        const pass = urlParams["pass"] ?? `${OldStorage.sessionPassPrefix}: ${new Date().getTime()}`;
        // const todo = JSON.parse(urlParams["todo"] ?? "null") as string[] | null;
        // const history = JSON.parse(urlParams["history"] ?? "null") as (number | null)[] | null;
        if (pass && todo)
        {
            await Render.showTodoScreen(pass, todo);
        }
        else
        if (OldStorage.isSessionPass(pass) && ! tag)
        {
            switch(hash)
            {
            case "import":
                Render.showImportScreen();
                break;
            case "removed":
                Render.showRemovedListScreen();
                break;
            // case "loading": // for debug only
            //     await Render.showUpdatingScreen(url);
            //     break;
            default:
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
                await Render.showHistoryScreen
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
                await Render.showRemovedScreen(pass);
                break;
            case "import":
                await Render.showImportScreen();
                break;
            case "export":
                await Render.showExportScreen(pass);
                break;
            default:
                if (0 <= OldStorage.Pass.get().indexOf(pass))
                {
                    await Render.showListScreen(pass, tag, urlParams);
                }
                else
                {
                    await showUrl({ });
                }
                break;
            }
        }
        // await Render.updatedScreenBody();
        await Render.updatedScreen();
        if (minamo.environment.isPWA())
        {
            Storage.System.setLatestShowUrl(url);
        }
    };
    export const showUrl = async (data: { pass?: string, tag?: string, todo?: string, hash?: string}) =>
    {
        const url = makeUrl(data);
        history.pushState(null, applicationTitle, url);
        await showPage(url);
    };
    export const reload = async () =>
    {
        const scrollTop = Render.getScreenBody().scrollTop;
        await showPage(location.href, 600);
        Render.getScreenBody().scrollTop = scrollTop;
    };
}
