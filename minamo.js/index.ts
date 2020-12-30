
export module minamo
{
    export module core
    {
        export const timeout = async (wait: number): Promise<void> =>
            new Promise<void>(resolve => setTimeout(resolve, wait));
        export const tryOrThrough = function(title: string, f: () => void): void
        {
            try
            {
                f();
            }
            catch(err)
            {
                console.error(`🚫 ${title}: ${err}`);
            }
        };
        export const tryOrThroughAsync = async function(title: string, f: () => Promise<void>): Promise<void>
        {
            try
            {
                await f();
            }
            catch(err)
            {
                console.error(`🚫 ${title}: ${err}`);
            }
        };
        export const simpleDeepCopy = (source: object): object => JSON.parse(JSON.stringify(source));
        export const recursiveAssign = (target: object, source: object): void => objectForEach
        (
            source,
            (key, value) =>
            {
                if ("object" === practicalTypeof(value))
                {
                    if (undefined === target[key])
                    {
                        target[key] = { };
                    }
                    recursiveAssign(target[key], value);
                }
                else
                if ("array" === practicalTypeof(value))
                {
                    if (undefined === target[key])
                    {
                        target[key] = [ ];
                    }
                    recursiveAssign(target[key], value);
                }
                else
                {
                    target[key] = value;
                }
            }
        );
        export const practicalTypeof = function(obj: any): string
        {
            if (undefined === obj)
            {
                return "undefined";
            }
            if (null === obj)
            {
                return "null";
            }
            if ("[object Array]" === Object.prototype.toString.call(obj))
            {
                return "array";
            }
    
            return typeof obj;
        };
        export const exists = (i: any): boolean => undefined !== i && null !== i;
        export const existsOrThrow = <ValueT>(i: ValueT): ValueT =>
        {
            if (!exists(i))
            {
                throw new ReferenceError("minamo.core.existsOrThrow() encountered a unexist value.");
            }
            return i;
        };
        export class Url
        {
            constructor(private url: string)
            {
            }

            rawParams: {[key:string]:string} = null;

            set = (url: string) =>
            {
                this.url = url;
                this.rawParams = null;
                return this;
            }

            getWithoutParams = (): string => separate(this.url, "?").head;

            getRawParamsString = (): string => separate(this.url, "?").tail;
            getRawParams = (): {[key:string]:string} =>
            {
                if (!this.rawParams)
                {
                    this.rawParams = { };
                    this.getRawParamsString().split("&")
                        .forEach
                        (
                            i =>
                            {
                                const { head, tail } = core.separate(i, "=");
                                this.rawParams[head] = tail;
                            }
                        );
                }
                return this.rawParams;
            }
            getParam = (key: string): string => decodeURIComponent(this.getRawParams()[key]);

            private updateParams = () => this.setRawParamsString
            (
                objectToArray(this.rawParams, (k, v) => bond(k, "=", v))
                    .join("&")
            )

            setRawParamsString = (rawParamsString: string) =>
            {
                this.url = bond(this.getWithoutParams(), "?", rawParamsString);
                return this;
            }
            setRawParam = (key: string, rawValue: string) =>
            {
                this.getRawParams()[key] = rawValue;
                return this.updateParams();
            }
            setParam = (key: string, value: string) => this.setRawParam(key, encodeURIComponent(value));
            setRawParams = (params: {[key:string]:string}) =>
            {
                this.rawParams = params;
                return this.updateParams();
            }
            setParams = (params: {[key:string]:string}) =>
                this.setRawParams(objectMap(params, (_key, value) => encodeURIComponent(value)))

            toString = ()=> this.url;
        }
        export class Listener<ValueT>
        {
            private members: ((value: ValueT, options?: { [key:string]: any }) => Promise<void>)[] = [];
            push = (member: (value: ValueT, options?: { [key:string]: any }) => Promise<void>): Listener<ValueT> =>
            {
                this.members.push(member);
                return this;
            }
            remove = (member: (value: ValueT, options?: { [key:string]: any }) => Promise<void>): Listener<ValueT> =>
            {
                this.members = this.members.filter(i => member !== i);
                return this;
            }
            clear = (): Listener<ValueT> =>
            {
                this.members = [];
                return this;
            }
            fireAsync = async (value: ValueT, options?: { }): Promise<void> =>
            {
                await Promise.all(this.members.map(async i => await i(value, options)));
            }
        }
        export class Property<ValueT>
        {
            constructor(private updater?: () => Promise<ValueT>) { }
            private value: ValueT = null;
            onUpdate = new Listener<Property<ValueT>>();
            onUpdateOnce = new Listener<Property<ValueT>>();
            exists = (): boolean => exists(this.value);
            get = (): ValueT => this.value;
            setAsync = async (value: ValueT, options?: { }): Promise<ValueT> =>
            {
                if (this.value !== value)
                {
                    this.value = value;
                    await this.onUpdate.fireAsync(this, options);
                    await this.onUpdateOnce.fireAsync(this, options);
                    this.onUpdateOnce.clear();
                }
                return value;
            }
            updateAsync = async (): Promise<ValueT> => await this.setAsync(await this.updater());
            getOrUpdateAsync = async (): Promise<ValueT> => this.exists() ? this.get(): await this.updateAsync();
        }
        export const getOrCall = <ValueT>(i: ValueT | (() => ValueT)): ValueT =>
            "function" === typeof i ?
                (<() => ValueT>i)():
                i; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
        export const getOrCallAsync = async <ValueT>(i: ValueT | (() => Promise<ValueT>)): Promise<ValueT> =>
            "function" === typeof i ?
                await (<() => Promise<ValueT>>i)():
                i; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
        export const getLast = <ValueT>(x: ValueT | ValueT[]): ValueT =>  Array.isArray(x) ? x[x.length - 1]: x;
        export const arrayOrToArray = <ValueT>(x: ValueT | ValueT[]): ValueT[] => Array.isArray(x) ? x: [x];
        export const singleOrArray = <ValueT>
        (
            x: ValueT | ValueT[],
            singleFunction: (i: ValueT) => void,
            arrayFunction: (a: ValueT[]) => void
        ): void => Array.isArray(x) ? arrayFunction(x): singleFunction(x);

        export const flatMap = <ValueT, ResultT>
        (
            source: ValueT | ValueT[],
            mapFunction: (value: ValueT) => ResultT[]
        ): ResultT[] =>
        {
            let result: ResultT[] = [];
            core.arrayOrToArray(source).forEach
            (
                i => result = result.concat(mapFunction(i))
            );
            return result;
        };
        export const objectForEach =
        (
            source: {[key:string]:any},
            eachFunction: (key: string, value: any, object: {[key:string]:any}) => void
        ): void =>
        {
            Object.keys(source).forEach
            (
                key => eachFunction(key, source[key], source)
            );
        };
        export const objectMap =
        (
            source: {[key:string]:any},
            mapFunction: (key: string, value: any, object: {[key:string]:any}) => any
        ): {[key:string]:any} =>
        {
            const result: {[key:string]:any} = { };
            objectForEach(source, key => result[key] = mapFunction(key, source[key], source));
            return result;
        };
        export const objectFilter =
        (
            source: {[key:string]:any},
            filterFunction: (key: string, value: any, object: {[key:string]:any}) => boolean
        ): {[key:string]:any} =>
        {
            const result: {[key:string]:any} = { };
            objectForEach
            (
                source,
                key =>
                {
                    const value = source[key];
                    if (filterFunction(key, value, source))
                    {
                        result[key] = value;
                    }
                }
            );
            return result;
        };
        export const objectToArray = <ResultT>
        (
            source: {[key:string]:any},
            mapFunction: (key: string, value: any, object: {[key:string]:any}) => ResultT
        ): ResultT[] =>
        {
            const result: ResultT[] = [ ];
            objectForEach(source, (key, value) => result.push(mapFunction(key, value, source)));
            return result;
        };

        export const separate = (text: string, separator: string): { head: string, tail: string } =>
        {
            const index = text.indexOf(separator);
            return 0 <= index ?
            {
                head: text.substring(0, index),
                tail: text.substring(index +separator.length),
            }:
            {
                head: text,
                tail: null,
            };
        };
        export const bond = (head: string, separator: string, tail: string) =>
            exists(tail) ?
                `${existsOrThrow(head)}${existsOrThrow(separator)}${tail}`:
                existsOrThrow(head);
        export const loopMap = <ValueT>(mapFunction: (index: number, result: ValueT[]) => ValueT | null, limit?: number) =>
        {
            const result: ValueT[] = [];
            let index = 0;
            if (!exists(limit))
            {
                limit = 100000;
            }
            while(true)
            {
                if (limit <= index)
                {
                    throw new RangeError(`minamo.core.loopMap() overs the limit(${limit})`);
                }
                const current = mapFunction(index++, result);
                if (exists(current))
                {
                    result.push(current);
                }
                else
                {
                    break;
                }
            }
            return result;
        };
        export const countMap = <ValueT>(count: number, mapFunction: ValueT | ((index: number, result: ValueT[]) => ValueT)) =>
        {
            const result: ValueT[] = [];
            let index = 0;
            while(index < count)
            {
                result.push
                (
                    "function" === typeof mapFunction ?
                        (<(index: number, result: ValueT[]) => ValueT>mapFunction)(index, result):
                        mapFunction
                );
                ++index;
            }
            return result;
        };
        export const zeroPadding = (length: number, n: number): string =>
        {
            if (21 < length)
            {
                throw new RangeError(`length(${length}) in minamo.core.zeroPadding() overs 21.`);
            }
            if (1e+21 <= n)
            {
                throw new RangeError(`n(${n}) in minamo.core.zeroPadding() is 1e+21 or more.`);
            }
            if (n <= -1e+21)
            {
                throw new RangeError(`n(${n}) in minamo.core.zeroPadding() is -1e+21 or less.`);
            }

            const sign = n < 0 ? "-": "";
            const core = `${Math.abs(Math.round(n))}`;
            const paddingLength = length -(sign.length + core.length);
            const padding = 0 < paddingLength ? "00000000000000000000".substr(-paddingLength): "";
            return `${sign}${padding}${core}`;
        };
        export const NYI = <T>(_: T = null): T => { throw new Error("Not Yet Implement!"); };
    }
    export module environment
    {
        export const isIE = (): boolean => core.NYI(false);
        export const isEdge = (): boolean => core.NYI(false);
        export const isSafari = (): boolean => core.NYI(false);
        export const isFirefox = (): boolean => core.NYI(false);
        export const isChrome = (): boolean => core.NYI(false);
        export const isPC = (): boolean => core.NYI(false);
        export const isWindows = (): boolean => core.NYI(false);
        export const isMac = (): boolean => core.NYI(false);
        export const isLinux = (): boolean => core.NYI(false);
        export const isiOs = (): boolean => core.NYI(false);
        export const isiAndroid = (): boolean => core.NYI(false);
    }
    export module cookie
    {
        export let defaultMaxAge = 30 * 24 * 60 * 60;
        let cache: {[key:string]:string} = null;
        export const setRaw = (key: string, value: string, maxAge?: number): string =>
        {
            document.cookie = core.exists(maxAge)  ?
                `${key}=${value}; max-age=${maxAge}`:
                `${key}=${value}`;
            cacheOrUpdate()[key] = value;
            return value;
        };
        export const set = <ValueT>(key: string, value: ValueT, maxAge: number = defaultMaxAge): ValueT =>
        {
            setRaw(key, encodeURIComponent(JSON.stringify(value)), maxAge);
            return value;
        };
        export const setAsTemporary = <ValueT>(key: string, value: ValueT): ValueT => set(key, value, null);
        export const setAsDaily = <ValueT>(key: string, value: ValueT): ValueT => set(key, value, 24 * 60 * 60);
        export const setAsWeekly = <ValueT>(key: string, value: ValueT): ValueT => set(key, value, 7 * 24 * 60 * 60);
        export const setAsMonthly = <ValueT>(key: string, value: ValueT): ValueT => set(key, value, 30 * 24 * 60 * 60);
        export const setAsAnnually = <ValueT>(key: string, value: ValueT): ValueT => set(key, value, 365 * 24 * 60 * 60);
        export const remove = (key: string) => setRaw(key, null, 0);
        export const update = (): {[key:string]:string} =>
        {
            cache = { };
            document.cookie
                .split(";")
                .map(i => i.trim())
                .forEach
                (
                    i =>
                    {
                        const { head, tail } = core.separate(i, "=");
                        cache[head] = tail;
                    }
                );
            return cache;
        };
        export const cacheOrUpdate = (): {[key:string]:string} => cache || update();
        export const getRaw = (key: string): string => cacheOrUpdate()[key];
        export const getOrNull = <ValueT>(key: string): ValueT =>
            core.exists(getRaw(key)) ? <ValueT>JSON.parse(decodeURIComponent(cache[key])): null;

        export class Property<ValueT> extends core.Property<ValueT>
        {
            private key: string | (() => string);
            private maxAge?: number;
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>,
                    maxAge?: number,
                }
            )
            {
                super(params.updater);
                this.key = params.key;
                this.maxAge = params.maxAge;
            }
            save = (): Property<ValueT> =>
            {
                cookie.set(core.getOrCall(this.key), this.get(), this.maxAge);
                return this;
            }
            loadAsync = async (): Promise<ValueT> => await this.setAsync
            (
                cookie.getOrNull(core.getOrCall(this.key)),
                { onLoadAsync: true }
            )
            loadOrUpdateAsync = async (): Promise<ValueT> =>
            {
                let result = await this.loadAsync();
                if (!core.exists(result))
                {
                    result = await this.updateAsync();
                }
                return result;
            }
        }
        export class AutoSaveProperty<ValueT> extends Property<ValueT>
        {
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>,
                    maxAge?: number,
                }
            )
            {
                super(params);
                this.onUpdate.push
                (
                    async (_value: Property<ValueT>, options?: { [key:string]: any }): Promise<void> =>
                    {
                        if (!options || !options.onLoadAsync)
                        {
                            this.save();
                        }
                    }
                );
            }
        }
    }

    export module localStorage
    {
        export const setRaw = (key: string, value: string): string =>
        {
            window.localStorage.setItem(key, value);
            return value;
        };
        export const set = <ValueT>(key: string, value: ValueT): ValueT =>
        {
            setRaw(key, encodeURIComponent(JSON.stringify(value)));
            return value;
        };
        export const remove = (key: string) => window.localStorage.removeItem(key);
        export const getRaw = (key: string): string => window.localStorage.getItem(key);

        export const getOrNull = <ValueT>(key: string): ValueT =>
        {
            const rawValue = getRaw(key);
            return  core.exists(rawValue) ? <ValueT>JSON.parse(decodeURIComponent(rawValue)): null;
        };

        export class Property<ValueT> extends core.Property<ValueT>
        {
            private key: string | (() => string);
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>
                }
            )
            {
                super(params.updater);
                this.key = params.key;
            }
            save = (): Property<ValueT> =>
            {
                cookie.set(core.getOrCall(this.key), this.get());
                return this;
            }
            loadAsync = async (): Promise<ValueT> => await this.setAsync
            (
                cookie.getOrNull(core.getOrCall(this.key)),
                { onLoadAsync: true }
            )
            loadOrUpdateAsync = async (): Promise<ValueT> =>
            {
                let result = await this.loadAsync();
                if (!core.exists(result))
                {
                    result = await this.updateAsync();
                }
                return result;
            }
        }
        export class AutoSaveProperty<ValueT> extends Property<ValueT>
        {
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>,
                    maxAge?: number,
                }
            )
            {
                super(params);
                this.onUpdate.push
                (
                    async (_value: Property<ValueT>, options?: { [key:string]: any }): Promise<void> =>
                    {
                        if (!options || !options.onLoadAsync)
                        {
                            this.save();
                        }
                    }
                );
            }
        }
    }
    
    export module sessionStorage
    {
        export const setRaw = (key: string, value: string): string =>
        {
            window.sessionStorage.setItem(key, value);
            return value;
        };
        export const set = <ValueT>(key: string, value: ValueT): ValueT =>
        {
            setRaw(key, encodeURIComponent(JSON.stringify(value)));
            return value;
        };
        export const remove = (key: string) => window.sessionStorage.removeItem(key);
        export const getRaw = (key: string): string => window.sessionStorage.getItem(key);

        export const getOrNull = <ValueT>(key: string): ValueT =>
        {
            const rawValue = getRaw(key);
            return  core.exists(rawValue) ? <ValueT>JSON.parse(decodeURIComponent(rawValue)): null;
        };

        export class Property<ValueT> extends core.Property<ValueT>
        {
            private key: string | (() => string);
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>
                }
            )
            {
                super(params.updater);
                this.key = params.key;
            }
            save = (): Property<ValueT> =>
            {
                cookie.set(core.getOrCall(this.key), this.get());
                return this;
            }
            loadAsync = async (): Promise<ValueT> => await this.setAsync
            (
                cookie.getOrNull(core.getOrCall(this.key)),
                { onLoadAsync: true }
            )
            loadOrUpdateAsync = async (): Promise<ValueT> =>
            {
                let result = await this.loadAsync();
                if (!core.exists(result))
                {
                    result = await this.updateAsync();
                }
                return result;
            }
        }
        export class AutoSaveProperty<ValueT> extends Property<ValueT>
        {
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>,
                    maxAge?: number,
                }
            )
            {
                super(params);
                this.onUpdate.push
                (
                    async (_value: Property<ValueT>, options?: { [key:string]: any }): Promise<void> =>
                    {
                        if (!options || !options.onLoadAsync)
                        {
                            this.save();
                        }
                    }
                );
            }
        }
    }

    export module http
    {
        export const request = (method: string, url: string, body?: Document | BodyInit | null, headers?: { [key: string]: string}): Promise<string> => new Promise<string>
        (
            (resolve, reject) =>
            {
                const request = new XMLHttpRequest();
                request.open(method, url, true);
                if (headers)
                {
                    console.log(`headers: ${JSON.stringify(headers)}`);
                    Object.keys(headers).forEach(key => request.setRequestHeader(key, headers[key]));
                }
                request.onreadystatechange = function()
                {
                    if (4 === request.readyState)
                    {
                        if (200 <= request.status && request.status < 300)
                        {
                            resolve(request.responseText);
                        }
                        else
                        {
                            reject
                            (
                                {
                                    url,
                                    request
                                }
                            );
                        }
                    }
                };
                console.log(`body: ${JSON.stringify(body)}`);
                request.send(body);
            }
        );

        export const get = (url : string, headers?: { [key: string]: string}): Promise<string> => request("GET", url, undefined, headers);
        export const post = (url : string, body?: Document | BodyInit | null, headers?: { [key: string]: string}): Promise<string> => request("POST", url, body, headers);
        export const getJson = async <T>(url : string, headers?: { [key: string]: string}): Promise<T> => <T>JSON.parse(await get(url, headers));
        export const postJson = async <T>(url : string, body?: Document | BodyInit | null, headers?: { [key: string]: string}): Promise<T> => <T>JSON.parse(await post(url, body, headers));
    }
    
    export module file
    {
        export const readAsText = (file: File): Promise<string> => new Promise<string>
        (
            (resolve, reject) =>
            {
                const reader = new FileReader();
                reader.onload = ()=> resolve(<string>reader.result);
                reader.onerror = ()=> reject(reader.error);
                reader.readAsText(file);
            }
        );
    }
    
    export module dom
    {
        export type Source =
            object |
            {
                outerHTML: string,
            } |
            string |
            Node |
            Source[];
        export function make<T extends Element>(constructor: { new (): T, prototype: T }): (arg: object) => T;
        export function make(constructor: { new (): HTMLHeadingElement, prototype: HTMLHeadingElement }, level: number): (arg: object) => HTMLHeadingElement;
        export function make(arg: Source): Node;
        export function make(arg: any, level?: number): any
        {
            core.existsOrThrow(arg);
            if (arg instanceof Node)
            {
                return arg;
            }
            if ("string" === core.practicalTypeof(arg))
            {
                return document.createTextNode(<string>arg);
            }
            if (arg.prototype)
            {
                let tag = arg.name.replace(/HTML(.*)Element/, "$1".toLowerCase());
                switch(tag)
                {
                case "anchor":
                    tag = "a";
                    break;
                case "heading":
                    tag = `h${level}`;
                    break;
                case "dlist":
                    tag = "dl";
                    break;
                case "olist":
                    tag = "ol";
                    break;
                case "ulist":
                    tag = "ol";
                    break;
                }
                return arg2 => set(document.createElement(tag), arg2);
            }
            if (arg.outerHTML)
            {
                return make(HTMLDivElement)({innerHTML: arg.outerHTML}).firstChild;
            }
            return set(document.createElement(arg.tag), arg);
        }
        export const set = <T extends Element>(element: T, arg: any): T =>
        {
            core.objectForEach
            (
                arg,
                (key, value) =>
                {
                    switch(key)
                    {
                    case "tag":
                    case "parent":
                    case "children":
                    case "attributes":
                    case "eventListener":
                        //  nop
                        break;
                    default:
                        if (undefined !== value)
                        {
                            if ("object" === core.practicalTypeof(value))
                            {
                                core.recursiveAssign(element[key], value);
                            }
                            else
                            {
                                element[key] = value;
                            }
                        }
                        break;
                    }
                }
            );
            if (undefined !== arg.attributes)
            {
                //  memo: value を持たない attribute を設定したい場合には value として "" を指定すれば良い。
                core.objectForEach(arg.attributes, (key, value) => element.setAttribute(key, value));
            }
            if (undefined !== arg.children)
            {
                core.arrayOrToArray(arg.children).forEach
                (
                    (i: Source) => core.arrayOrToArray(i).forEach
                    (
                        (j: Source) => element.appendChild(make(j))
                    )
                );
            }
            if (undefined !== arg.eventListener)
            {
                core.objectForEach(arg.eventListener, (key, value) => element.addEventListener(key, value));
            }
            if (undefined !== arg.parent)
            {
                appendChildren(arg.parent, element);
            }
            return element;
        };
        export const remove = (node: Node): Node => node.parentNode.removeChild(node);
        export const removeChildren = (parent: Element, isRemoveChild?: (child: Node) => boolean): Element =>
        {
            if (isRemoveChild)
            {
                parent.childNodes.forEach
                (
                    i =>
                    {
                        if (isRemoveChild(i))
                        {
                            parent.removeChild(i);
                        }
                    }
                );
            }
            else
            {
                parent.innerHTML = "";
            }
            return parent;
        };
        export const appendChildren = (parent: Element, newChildren: Source, refChild?: Node): Element =>
        {
            core.singleOrArray
            (
                newChildren,
                i => undefined === refChild ?
                    parent.appendChild(make(i)):
                    parent.insertBefore(make(i), refChild),
                a => a.forEach(i => appendChildren(parent, i, refChild))
            );
            return parent;
        };
        export const replaceChildren =
        (
            parent: Element,
            newChildren: any,
            isRemoveChild?: (child: Node) => boolean,
            refChild?: Node
        ): Element =>
        {
            removeChildren(parent, isRemoveChild);
            appendChildren(parent, newChildren, refChild);
            return parent;
        };
    }
}
