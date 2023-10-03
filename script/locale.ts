import localeEn from "../resource/lang.en.json";
import localeJa from "../resource/lang.ja.json";

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
    export const getLocaleName = (locale: "@auto" | LocaleType) =>
        "@auto" === locale ? map("language.auto"): master[locale].$name;
    export const setLocale = (locale: LocaleType | null) =>
    {
        const key = locale ?? navigator.language as LocaleType;
        if (0 <= locales.indexOf(key))
        {
            masterKey = key;
        }
    };
    export const string = (key : string) : string => master[masterKey][key as LocaleKeyType] || key;
    export const map = (key : LocaleKeyType) : string => string(key);
    export const immutable = (key : string) : string => key;
}
