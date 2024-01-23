// repository: https://github.com/wraith13/evil-tsconfig.paths.ts
import module from "module";
export const vanillaRequire = module.prototype.require;
export const applyPaths = (compilerOptions: { baseUrl?: string, paths?: { [path: string]: string[] } }) =>
{
    const resolvePaths = (path: string) =>
    {
        const base = compilerOptions?.baseUrl ?
            (compilerOptions?.baseUrl +"/").replace("//", "/"):
            "";
        const paths = compilerOptions?.paths ?? { };
        const match = Object.keys(paths).filter(i => path.startsWith(i.replace("*", "")))[0] as keyof typeof paths & string;
        const result =
            match ?
                paths[match].map(i => base +path.replace(match.replace("*", ""), i.replace("*", ""))):
                ("" === base ? []: [ base +path, ]);
        return result;
    };
    function evilRequire(this: any, path: string)
    {
        const paths = resolvePaths(path);
        for(let i = 0; i < paths.length; ++i)
        {
            try
            {
                return vanillaRequire.apply(this, [paths[i]]);
            }
            catch { }
        }
        return vanillaRequire.apply(this, [path]);
    };
    evilRequire.resolve = vanillaRequire.resolve;
    evilRequire.cache = vanillaRequire.cache;
    evilRequire.extensions = vanillaRequire.extensions;
    evilRequire.main = vanillaRequire.main;
    module.prototype.require = evilRequire;
}
