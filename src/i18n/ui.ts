import { English } from './UI/English';
import { Spanish } from './UI/Spanish';

export const languages = {
    en: 'English',
    es: 'Español',
}

export const defaultLang = 'en';

export const ui = {
    en: {
        ...English,
    },
    es: {
        ...Spanish,
    }
}