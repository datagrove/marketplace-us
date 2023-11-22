// import { getLangFromUrl, useTranslations } from "./i18n/utils";

// const lang = getLangFromUrl(new URL(window.location.href));
// const t = useTranslations(lang);

const CONFIG = {
    name: 'TodoServis',
  
    title: 'TodoServis',
    description: 'Everything you need to get the job done.',
    url: 'https://todoservis.com/',
    devUrl: 'http://localhost:4321',
    pagesDevUrl: 'https://pwa.marketplace-4xm.pages.dev',
  
    defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
    themeColor: '#1DD762',
  
    language: 'es',
    textDirection: 'ltr',
  
    dateFormatter: new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }),
  };
  
  export const SITE = { ...CONFIG};
  export const DATE_FORMATTER = CONFIG.dateFormatter;
