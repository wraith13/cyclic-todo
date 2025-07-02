import fs from "fs";
const sourceDirectory = "./resource/lang";
const outputDirectory = "./locale/generated";
type MasterType = Record<string, Record<string, string>>;
const description =
{
    template: `<meta name="description" lang="__LANG__" content="__DESCRIPTION__">`,
    separetor: "\n",
    output: `${outputDirectory}/description.html`,
};
const twitterDescription =
{
    template: `<meta name="twitter:description" lang="__LANG__" content="__DESCRIPTION__">`,
    separetor: "\n",
    output: `${outputDirectory}/twitter-description.html`,
}
const makeMasterFromSource = async () =>
{
    const temporaryMaster = { } as MasterType;
    await Promise.all
    (
        fs.readdirSync(sourceDirectory)
        .filter((file: string) => file.endsWith(".json"))
        .sort()
        .map
        (
            async (file: string) =>
            {
                const lang = file.replace(/\.json$/, "");
                const json = JSON.parse(await fs.promises.readFile(`${sourceDirectory}/${file}`, "utf8"));
                temporaryMaster[lang] = json;
            }
        )
    );
    const master = { } as MasterType;
    Object.keys(temporaryMaster)
        .sort()
        .forEach(key => master[key] = temporaryMaster[key]);
    return master;
};
const checkMaster = (master: MasterType) =>
{
    const allUniqueKeys = Object.values(master)
        .reduce((previous, current) => previous.concat(Object.keys(current)), [] as string[])
        .filter((i, ix, list) => list.indexOf(i) === ix);
    const commonUniqueKeys = Object.values(master)
        .reduce((previous, current) => previous.filter(key => key in current), allUniqueKeys);
    Object.keys(master).forEach
    (
        lang =>
        {
            const langKeys = Object.keys(master[lang]);
            const missingKeys = allUniqueKeys.filter(key => ! langKeys.includes(key));
            const extraKeys = langKeys.filter(key => ! commonUniqueKeys.includes(key));
            if (0 < missingKeys.length)
            {
                if (0 < extraKeys.length)
                {
                    console.error(`🚫 ${sourceDirectory}/${lang}.json: Missing keys: ${missingKeys.join(", ")}, Extra keys: ${extraKeys.join(", ")}`);
                }
                else
                {
                    console.error(`🚫 ${sourceDirectory}/${lang}.json: Missing keys: ${missingKeys.join(", ")}`);
                }
            }
            else
            if (0 < extraKeys.length)
            {
                console.error(`🚫 ${sourceDirectory}/${lang}.json: Extra keys: ${extraKeys.join(", ")}`);
            }
        }
    );
};
const writeHtmlPart = (master: MasterType, data: { template: string, separetor: string, output: string }) => fs.writeFileSync
(
    data.output,
    Object.keys(master).map
        (
            (lang: string) => data.template
                .replace(/__LANG__/g, lang)
                .replace(/__LANG_DIRECTION__/g, master[lang]["lang-direction"])
                .replace(/__DESCRIPTION__/g, master[lang]["description"])
                .replace(/__NOSCRIPT_MESSAGE__/g, master[lang]["noscript-message"])
                .replace(/__NOSCRIPT_INTRODUCTION_TITLE__/g, master[lang]["noscript-introduction-title"])
                .replace(/__NOSCRIPT_INTRODUCTION_DESCRIPTION__/g, master[lang]["noscript-introduction-description"])
        )
        .join(data.separetor),
    "utf8"
);
const main = async () =>
{
    const master = await makeMasterFromSource();
    checkMaster(master);
    fs.writeFileSync
    (
        `${outputDirectory}/master.ts`,
        `export const localeMaster = ${JSON.stringify(master, null, 4)};`,
        "utf8"
    );
    fs.writeFileSync
    (
        `${outputDirectory}/manifest.langs.json`,
        JSON.stringify(Object.keys(master).map(lang => ({ "__LOCALE__": lang})), null, 4),
        "utf8"
    );
    writeHtmlPart(master, description);
    writeHtmlPart(master, twitterDescription);
};
main();
