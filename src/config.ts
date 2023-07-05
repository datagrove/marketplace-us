const CONFIG = {
    name: 'Laboroso',
  
    title: 'Laboroso',
    description:
      '',
    url: '',
  
    defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
  
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