import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/ar';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar';
import en from './locales/en';

// Define available languages
export const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

// Define language config
export const languageConfig = {
  en: {
    name: 'English',
    dir: 'ltr',
  },
  ar: {
    name: 'العربية',
    dir: 'rtl',
  },
};

export const defaultLanguage = 'en';

export const initI18n = () => {
  i18next.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return i18next;
};

export const i18n = initI18n();

export const changeLanguage = async (lng: string) => {
  await i18n.changeLanguage(lng);
  return lng;
};

export const isRTL = (lng: string = i18n.language) => {
  return languageConfig[lng as keyof typeof languageConfig]?.dir === 'rtl';
};

export const getCurrentLanguage = () => {
  return i18n.language;
};

export const getLanguageConfig = (lng: string = i18n.language) => {
  return languageConfig[lng as keyof typeof languageConfig];
};
