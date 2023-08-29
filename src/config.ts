const CONFIG = {
    name: 'TodoServis',
  
    title: 'TodoServis',
    description:
      'Everything you need to get the job done.',
    url: 'https://todoservis.com/',
    devUrl: 'http://localhost:3000',
  
    defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
  
    language: 'en',
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
