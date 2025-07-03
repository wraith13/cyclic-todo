import * as localeMaster from "../locale/generated/master";
export module locale
{
    export const master = localeMaster.localeMaster;
    export type LocaleType = keyof typeof master;
    export type Label = keyof typeof master[LocaleType];
    export const locales = Object.keys(master) as LocaleType[];
    let masterKey: LocaleType = locales[0];
    export const getLocaleName = (locale: "@auto" | LocaleType) =>
        "@auto" === locale ? map("language.auto"): master[locale].$name;
    export const setLocale = (locale: LocaleType) =>
    {
        if (0 <= locales.indexOf(locale))
        {
            masterKey = locale;
        }
    };
    export const getLocale = () : LocaleType => masterKey;
    export const string = (key : string) : string => master[masterKey][key as Label] || key;
    export const map = (key : Label) : string => string(key);
    export const immutable = (key : string) : string => key;
}
