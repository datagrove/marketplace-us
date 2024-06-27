// import { getLangFromUrl, useTranslations } from "./i18n/utils";

const url = import.meta.env.PUBLIC_VITE_SITE_URL;
// const t = useTranslations(lang);

const CONFIG = {
    name: "LearnGrove",

    title: "LearnGrove",
    description: "LearnGrove is a community marketplace for educational resources. LearnGrove serves as a comprehensive hub where creators can share - and learners can discover - tailored educational resources. Bridging the gap between the creator and learners enhancing access to high-quality educational content while fostering a thriving community of learners and educators.",
    url: url,


    defaultTheme: "system", // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
    themeColor: "#1DD762",

    language: "en",
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
