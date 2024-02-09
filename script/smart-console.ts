export module smartConsole
{
    export const logIfFirstData: { [id:string]: string[] } = { };
    export const logIfFirst = (id: string, ...params :any[]) =>
    {
        const json = JSON.stringify(params);
        if (undefined === logIfFirstData[id])
        {
            logIfFirstData[id] = [];
        }
        if (logIfFirstData[id].indexOf(json) < 0)
        {
            logIfFirstData[id].push(json);
            console.log(`${id}:`, ...params);
        }
        return params;
    }
    export const logIfChangedData: { [id:string]: string } = { };
    export const logIfChanged = (id: string, ...params :any[]) =>
    {
        const json = JSON.stringify(params);
        if (json !== logIfChangedData[id])
        {
            logIfChangedData[id] = json;
            console.log(`${id}:`, ...params);
        }
        return params;
    }
    export const logIfMinData: { [id:string]: number } = { };
    export const logIfMin = (id: string, value: number, ...params :any[]) =>
    {
        if (undefined === logIfMinData[id] || value < logIfMinData[id])
        {
            logIfMinData[id] = value;
            console.log(`${id}:`, value, ...params);
        }
        return value;
    }
    export const logIfMaxData: { [id:string]: number } = { };
    export const logIfMax = (id: string, value: number, ...params :any[]) =>
    {
        if (undefined === logIfMinData[id] || logIfMinData[id] < value)
        {
            logIfMinData[id] = value;
            console.log(`${id}:`, value, ...params);
        }
        return value;
    }
    export let logLaterBuffer: any[][] = [];
    export const logLater = (...params :any[]) =>
    {
        logLaterBuffer.push(params);
    }
    export const clearLogLaterBuffer = () =>
    {
        const result = logLaterBuffer;
        logLaterBuffer = [];
        return result;
    };
    export const flushLogLaterBuffer = () =>
        clearLogLaterBuffer().forEach(i => console.log(i));
}
