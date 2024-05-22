// import { getLangFromUrl, useTranslations } from "./i18n/utils";

// const lang = getLangFromUrl(new URL(window.location.href));
// const t = useTranslations(lang);

const CONFIG = {
    name: "LearnGrove",

    title: "LearnGrove",
    description: "HomeSchool description",
    //NEED TO ADD NEW URL
    url: "https://learngrove.co",
    devUrl: "http://localhost:4321",
    //NEED TO ADD NEW URL
    pagesDevUrl: "https://marketplace-us.pages.dev",

    defaultTheme: "system", // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
    themeColor: "#1DD762",

    language: "es",
    textDirection: "ltr",

    dateFormatter: new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    }),
};

export const SITE = { ...CONFIG };
export const DATE_FORMATTER = CONFIG.dateFormatter;
