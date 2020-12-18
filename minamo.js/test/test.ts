import { minamo } from "..";

export module test
{
    interface TestResult
    {
        isSucceeded: boolean;
        testType: string;
        expression: string;
        data?: { };
    }
    const counts =
    {
        total: 0,
        ok: 0,
        ng: 0,
    };
    const resultCount = (result: TestResult): TestResult =>
    {
        ++counts.total;
        result.isSucceeded ? ++counts.ok: ++counts.ng;
        return result;
    }
    const makeHeading = (tag: string, text: string) =>
    (
        {
            tag,
            children: text,
        }
    );
    const makeResultTable = (result: TestResult[]) =>
    (
        {
            tag: "table",
            className: "details",
            children :
            [
                {
                    tag: "tr",
                    children :
                    [
                        {
                            tag: "th",
                            children: "result",
                        },
                        {
                            tag: "th",
                            children: "type",
                        },
                        {
                            tag: "th",
                            children: "expression",
                        },
                        {
                            tag: "th",
                            children: "data",
                        },
                    ],
                },
            ].concat
            (
                result
                    .map(resultCount)
                    .map
                    (
                        i =>
                        (
                            {
                                tag: "tr",
                                className: i.isSucceeded ? undefined: "error",
                                children :
                                [
                                    {
                                        tag: "td",
                                        children: i.isSucceeded ? "✅ OK": "🚫 NG",
                                    },
                                    {
                                        tag: "td",
                                        children: i.testType,
                                    },
                                    {
                                        tag: "td",
                                        children: i.expression,
                                    },
                                    {
                                        tag: "td",
                                        children: undefined === i ?
                                            "undefined":
                                            JSON.stringify(i.data),
                                    },
                                ]
                            }
                        )
                    )
            )
        }
    )
    export const tryTest = (expression: string): { isSucceeded: boolean, result: any, error: any } =>
    {
        const result =
        {
            isSucceeded :  false,
            result: undefined,
            error: undefined,
        };
        try
        {
            console.log(`try ${expression}`);
            result.result = eval(expression);
            result.isSucceeded = true;
        }
        catch(error)
        {
            result.error = error instanceof Error ?
            {
                name: error.name,
                message: error.message,
            }:
            error;
        }
        return result;
    }
    export const evalAsync = async (expression: string) => await eval(expression);
    export const tryTestAsync = async (expression: string): Promise<{ isSucceeded: boolean, result: any, error: any }> =>
    {
        const result =
        {
            isSucceeded :  false,
            result: undefined,
            error: undefined,
        };
        try
        {
            console.log(`try ${expression}`);
            result.result = await evalAsync(expression);
            result.isSucceeded = true;
        }
        catch(error)
        {
            result.error = error instanceof Error ?
            {
                name: error.name,
                message: error.message,
            }:
            error;
        }
        return result;
    }
    export const test = (expression: string) =>
    {
        const result = tryTest(expression);
        return {
            isSucceeded: result.isSucceeded,
            testType: "success",
            expression,
            data: result.isSucceeded ?
                { result: result.result, }:
                { error: result.error, },
        };
    }
    export const testAsync = async (expression: string) =>
    {
        const result = await tryTestAsync(expression);
        return {
            isSucceeded: result.isSucceeded,
            testType: "success",
            expression: `await ${expression}`,
            data: result.isSucceeded ?
                { result: result.result, }:
                { error: result.error, },
        };
    }
    export const errorTest = (expression: string) =>
    {
        const result = tryTest(expression);
        return {
            isSucceeded: !result.isSucceeded,
            testType: "error",
            expression,
            data: result.isSucceeded ?
                { result: result.result, }:
                { error: result.error, },
        };
    }
    export const errorTestAsync = async (expression: string) =>
    {
        const result = await tryTestAsync(expression);
        return {
            isSucceeded: !result.isSucceeded,
            testType: "error",
            expression: `await ${expression}`,
            data: result.isSucceeded ?
                { result: result.result, }:
                { error: result.error, },
        };
    }
    export const equalTest = (expression: string, predicted: any) =>
    {
        const result = tryTest(expression);
        return {
            isSucceeded: result.isSucceeded && JSON.stringify(predicted) === JSON.stringify(result.result),
            testType: "equal",
            expression: `${JSON.stringify(predicted)} === ${expression}`,
            data: result.isSucceeded ?
                { predicted, result: result.result, }:
                { predicted, error: result.error, },
        };
    }
    export const equalTestAsync = async (expression: string, predicted: any) =>
    {
        const result = await tryTestAsync(expression);
        return {
            isSucceeded: result.isSucceeded && JSON.stringify(predicted) === JSON.stringify(result.result),
            testType: "equal",
            expression: `${JSON.stringify(predicted)} === await ${expression}`,
            data: result.isSucceeded ?
                { predicted, result: result.result, }:
                { predicted, error: result.error, },
        };
    }
    export const start = async (): Promise<void> =>
    {
        minamo.dom.appendChildren
        (
            document.body,
            [
                makeHeading("h1", document.title),
                {
                    tag: "p",
                    children:
                    [
                        "minamo.js is a necessary, sufficient, simple and compact JavaScript/TypeScript library.",
                        { tag: "a", className: "github", href: "https://github.com/wraith13/minamo.js", children: "GitHub", },
                    ],
                },
                makeHeading("h2", "summary"),
                makeHeading("h2", "minamo.core"),
                makeHeading("h3", "minamo.core.exists"),
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.exists({})`, true),
                        equalTest(`minamo.core.exists([])`, true),
                        equalTest(`minamo.core.exists("abc")`, true),
                        equalTest(`minamo.core.exists(true)`, true),
                        equalTest(`minamo.core.exists(false)`, true),
                        equalTest(`minamo.core.exists("0")`, true),
                        equalTest(`minamo.core.exists(0)`, true),
                        equalTest(`minamo.core.exists("")`, true),
                        equalTest(`minamo.core.exists(null)`, false),
                        equalTest(`minamo.core.exists(undefined)`, false),
                    ]
                ),
                makeHeading("h3", "minamo.core.existsOrThrow"),
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.existsOrThrow({})`, {}),
                        equalTest(`minamo.core.existsOrThrow([])`, []),
                        equalTest(`minamo.core.existsOrThrow("abc")`, "abc"),
                        equalTest(`minamo.core.existsOrThrow(true)`, true),
                        equalTest(`minamo.core.existsOrThrow(false)`, false),
                        equalTest(`minamo.core.existsOrThrow("0")`, "0"),
                        equalTest(`minamo.core.existsOrThrow(0)`, 0),
                        equalTest(`minamo.core.existsOrThrow("")`, ""),
                        errorTest(`minamo.core.existsOrThrow(null)`),
                        errorTest(`minamo.core.existsOrThrow(undefined)`),
                    ]
                ),
                makeHeading("h3", "minamo.core.getOrCall"),
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.getOrCall("abc")`, "abc"),
                        equalTest(`minamo.core.getOrCall(true)`, true),
                        equalTest(`minamo.core.getOrCall(false)`, false),
                        equalTest(`minamo.core.getOrCall("0")`, "0"),
                        equalTest(`minamo.core.getOrCall(0)`, 0),
                        equalTest(`minamo.core.getOrCall("")`, ""),
                        equalTest(`minamo.core.getOrCall(null)`, null),
                        equalTest(`minamo.core.getOrCall(undefined)`, undefined),
                        equalTest(`minamo.core.getOrCall(()=>"abc")`, "abc"),
                        equalTest(`minamo.core.getOrCall(()=>true)`, true),
                        equalTest(`minamo.core.getOrCall(()=>false)`, false),
                        equalTest(`minamo.core.getOrCall(()=>"0")`, "0"),
                        equalTest(`minamo.core.getOrCall(()=>0)`, 0),
                        equalTest(`minamo.core.getOrCall(()=>"")`, ""),
                        equalTest(`minamo.core.getOrCall(()=>null)`, null),
                        equalTest(`minamo.core.getOrCall(()=>undefined)`, undefined),
                    ]
                ),
                makeHeading("h3", "minamo.core.getOrCallAsync"),
                makeResultTable
                (
                    [
                        await equalTestAsync(`minamo.core.getOrCallAsync("abc")`, "abc"),
                        await equalTestAsync(`minamo.core.getOrCallAsync(true)`, true),
                        await equalTestAsync(`minamo.core.getOrCallAsync(false)`, false),
                        await equalTestAsync(`minamo.core.getOrCallAsync("0")`, "0"),
                        await equalTestAsync(`minamo.core.getOrCallAsync(0)`, 0),
                        await equalTestAsync(`minamo.core.getOrCallAsync("")`, ""),
                        await equalTestAsync(`minamo.core.getOrCallAsync(null)`, null),
                        await equalTestAsync(`minamo.core.getOrCallAsync(undefined)`, undefined),
                        await equalTestAsync(`minamo.core.getOrCallAsync(async ()=>"abc")`, "abc"),
                        await equalTestAsync(`minamo.core.getOrCallAsync(async ()=>true)`, true),
                        await equalTestAsync(`minamo.core.getOrCallAsync(async ()=>false)`, false),
                        await equalTestAsync(`minamo.core.getOrCallAsync(async ()=>"0")`, "0"),
                        await equalTestAsync(`minamo.core.getOrCallAsync(async ()=>0)`, 0),
                        await equalTestAsync(`minamo.core.getOrCallAsync(async ()=>"")`, ""),
                        await equalTestAsync(`minamo.core.getOrCallAsync(async ()=>null)`, null),
                        await equalTestAsync(`minamo.core.getOrCallAsync(async ()=>undefined)`, undefined),
                    ]
                ),
                makeHeading("h3", "minamo.core.getLast"),
                makeResultTable
                (
                    [
                        await equalTestAsync(`minamo.core.getLast("abc")`, "abc"),
                        await equalTestAsync(`minamo.core.getLast(true)`, true),
                        await equalTestAsync(`minamo.core.getLast(false)`, false),
                        await equalTestAsync(`minamo.core.getLast("0")`, "0"),
                        await equalTestAsync(`minamo.core.getLast(0)`, 0),
                        await equalTestAsync(`minamo.core.getLast("")`, ""),
                        await equalTestAsync(`minamo.core.getLast(null)`, null),
                        await equalTestAsync(`minamo.core.getLast(undefined)`, undefined),
                        await equalTestAsync(`minamo.core.getLast(["abc"])`, "abc"),
                        await equalTestAsync(`minamo.core.getLast([true])`, true),
                        await equalTestAsync(`minamo.core.getLast([false])`, false),
                        await equalTestAsync(`minamo.core.getLast(["0"])`, "0"),
                        await equalTestAsync(`minamo.core.getLast([0])`, 0),
                        await equalTestAsync(`minamo.core.getLast([""])`, ""),
                        await equalTestAsync(`minamo.core.getLast([null])`, null),
                        await equalTestAsync(`minamo.core.getLast([undefined])`, undefined),
                        await equalTestAsync(`minamo.core.getLast([123,"abc"])`, "abc"),
                        await equalTestAsync(`minamo.core.getLast([123,true])`, true),
                        await equalTestAsync(`minamo.core.getLast([123,false])`, false),
                        await equalTestAsync(`minamo.core.getLast([123,"0"])`, "0"),
                        await equalTestAsync(`minamo.core.getLast([123,0])`, 0),
                        await equalTestAsync(`minamo.core.getLast([123,""])`, ""),
                        await equalTestAsync(`minamo.core.getLast([123,null])`, null),
                        await equalTestAsync(`minamo.core.getLast([123,undefined])`, undefined),
                    ]
                ),
                makeHeading("h3", "minamo.core.separate"),
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.separate("abcdefghi", "efg")`, { head: "abcd", tail: "hi" }),
                        equalTest(`minamo.core.separate("abc@def", "@")`, { head: "abc", tail: "def" }),
                        equalTest(`minamo.core.separate("abc@", "@")`, { head: "abc", tail: "" }),
                        equalTest(`minamo.core.separate("@def", "@")`, { head: "", tail: "def" }),
                        equalTest(`minamo.core.separate("abc", "@")`, { head: "abc", tail: null }),
                        equalTest(`minamo.core.separate("", "@")`, { head: "", tail: null }),
                        errorTest(`minamo.core.separate(null, "@")`),
                        errorTest(`minamo.core.separate(undefined, "@")`),
                        equalTest(`minamo.core.separate("abc@def", null)`, { head: "abc@def", tail: null }),
                        equalTest(`minamo.core.separate("abc@def", undefined)`, { head: "abc@def", tail: null }),
                    ]
                ),
                makeHeading("h3", "minamo.core.bond"),
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.bond("abcd", "efg", "hi")`, "abcdefghi"),
                        equalTest(`minamo.core.bond("abc", "@", "def")`, "abc@def"),
                        equalTest(`minamo.core.bond("abc", "@", "")`, "abc@"),
                        equalTest(`minamo.core.bond("", "@", "def")`, "@def"),
                        equalTest(`minamo.core.bond("abc", "@", null)`, "abc"),
                        equalTest(`minamo.core.bond("abc", "@", undefined)`, "abc"),
                        errorTest(`minamo.core.bond(null, null, null)`),
                        errorTest(`minamo.core.bond(null, "@", null)`),
                        errorTest(`minamo.core.bond(null, "@", "def")`),
                        errorTest(`minamo.core.bond("abc", null, "def")`),
                        errorTest(`minamo.core.bond(undefined, undefined, undefined)`),
                        errorTest(`minamo.core.bond(undefined, "@", undefined)`),
                        errorTest(`minamo.core.bond(undefined, "@", "def")`),
                        errorTest(`minamo.core.bond("abc", undefined, "def")`),
                    ]
                ),
                makeHeading("h3", "minamo.core.loopMap"),
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.loopMap(i => i < 3 ? i: null)`, [0,1,2]),
                        equalTest(`minamo.core.loopMap(i => i < 3 ? i *2: null)`, [0,2,4]),
                        equalTest(`minamo.core.loopMap(i => i < 3 ? {i:i}: null)`, [{i:0},{i:1},{i:2}]),
                        equalTest(`minamo.core.loopMap(i => null)`, []),
                        errorTest(`minamo.core.loopMap(null)`),
                        errorTest(`minamo.core.loopMap(i => true)`),
                    ]
                ),
                makeHeading("h3", "minamo.core.countMap"),
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.countMap(3, "A")`, ["A","A","A"]),
                        equalTest(`minamo.core.countMap(3, i => i)`, [0,1,2]),
                        equalTest(`minamo.core.countMap(3, i => i *2)`, [0,2,4]),
                        equalTest(`minamo.core.countMap(3, i => ({i:i}))`, [{i:0},{i:1},{i:2}]),
                        equalTest(`minamo.core.countMap(0, i => i)`, []),
                        equalTest(`minamo.core.countMap(3, null)`, [null,null,null]),
                    ]
                ),
                makeHeading("h3", "minamo.core.zeroPadding"),
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.zeroPadding(3, 123)`, "123"),
                        equalTest(`minamo.core.zeroPadding(3, 1)`, "001"),
                        equalTest(`minamo.core.zeroPadding(3, 0)`, "000"),
                        equalTest(`minamo.core.zeroPadding(3, 1234)`, "1234"),
                        equalTest(`minamo.core.zeroPadding(3, -12)`, "-12"),
                        equalTest(`minamo.core.zeroPadding(3, -123)`, "-123"),
                        equalTest(`minamo.core.zeroPadding(0, 123)`, "123"),
                        equalTest(`minamo.core.zeroPadding(-1, 123)`, "123"),
                        equalTest(`minamo.core.zeroPadding(5, 123.45)`, "00123"),
                        errorTest(`minamo.core.zeroPadding(30, 123)`),
                        errorTest(`minamo.core.zeroPadding(20, 12345678901234567890123)`),
                        errorTest(`minamo.core.zeroPadding(20, -12345678901234567890123)`),
                    ]
                ),
            ]
        );
        minamo.dom.appendChildren
        (
            document.body,
            {
                tag: "table",
                className: "summary",
                children :
                [
                    {
                        tag: "tr",
                        children :
                        [
                            {
                                tag: "th",
                                children: "total",
                            },
                            {
                                tag: "th",
                                children: "✅ OK",
                            },
                            {
                                tag: "th",
                                children: "🚫 NG",
                            },
                        ],
                    },
                    {
                        tag: "tr",
                        children :
                        [
                            {
                                tag: "td",
                                children: counts.total.toLocaleString(),
                            },
                            {
                                tag: "td",
                                children: counts.ok.toLocaleString(),
                            },
                            {
                                tag: "td",
                                children: counts.ng.toLocaleString(),
                            },
                        ],
                    },
                ],
            },
            document.getElementsByTagName("h2")[1]
        )
        if (counts.ng)
        {
            document.title = `(${counts.ng}) ${document.title}`
        }
        setTimeout
        (
            ()=>
            {
                const hashRaw = minamo.core.separate(location.href, "#").tail;
                if (hashRaw)
                {
                    const hash = decodeURIComponent(hashRaw);
                    const target = <HTMLElement>Array.from(document.body.children).filter(i => i.textContent === hash)[0];
                    if (target)
                    {
                        document.body.scrollTop = target.offsetTop;
                    }
                    else
                    {
                        console.error(`Not found hash ${hash}`);
                    }
                }
            },
            0
        );
    };
}
