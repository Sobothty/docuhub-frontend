'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from '../../public/locales/en/common.json';
import khCommon from '../../public/locales/kh/common.json';

// Load resources from public/locales
const resources = {
  en: { common: enCommon },
  kh: { common: khCommon },
};

// Get initial language from localStorage or default to 'en'
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const savedLng = localStorage.getItem('i18nextLng');
    return savedLng || 'en';
  }
  return 'en';
};

// Initialize once on the client
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: getInitialLanguage(),
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      defaultNS: 'common',
      ns: ['common'],
      react: { useSuspense: false },
      
      // Language detector options
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      },
    })
    .catch(() => {});
}

// Save language preference when changed
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
});

export default i18n;
