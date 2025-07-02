import localeEn from "@resource/lang/en.json";
import localeJa from "@resource/lang/ja.json";

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
    export const string = (key : string) : string => master[masterKey][key as LocaleKeyType] || key;
    export const map = (key : LocaleKeyType) : string => string(key);
    export const immutable = (key : string) : string => key;
}
