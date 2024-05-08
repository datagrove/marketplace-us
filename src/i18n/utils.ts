import { ui, defaultLang } from "./ui";

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split("/");
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: string) {
        const keys = key.split(".");
        let value: any = ui[lang];
        let defaultValue: any = ui[defaultLang];
        for (const k of keys) {
            value = value[k as keyof typeof value];
            defaultValue = defaultValue[k as keyof typeof defaultValue];
            if (!value) {
                break;
            }
        }
        return value || defaultValue;
    };
}
