import { English } from './UI/English';
import { Spanish } from './UI/Spanish';
import { French } from './UI/French';

export const languages = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
}

export const defaultLang = 'es';

export const ui = {
    en: {
        ...English,
    },
    es: {
        ...Spanish,
    },
    fr: {
        ...French,
    },
}