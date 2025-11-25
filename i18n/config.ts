import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enAuth from './locales/en/auth.json';
import enPrayer from './locales/en/prayer.json';
import enQuran from './locales/en/quran.json';
import enFeatures from './locales/en/features.json';

import arCommon from './locales/ar/common.json';
import arNavigation from './locales/ar/navigation.json';
import arAuth from './locales/ar/auth.json';
import arPrayer from './locales/ar/prayer.json';
import arQuran from './locales/ar/quran.json';
import arFeatures from './locales/ar/features.json';

import urCommon from './locales/ur/common.json';
import urNavigation from './locales/ur/navigation.json';
import urAuth from './locales/ur/auth.json';
import urPrayer from './locales/ur/prayer.json';
import urQuran from './locales/ur/quran.json';
import urFeatures from './locales/ur/features.json';

import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frAuth from './locales/fr/auth.json';
import frPrayer from './locales/fr/prayer.json';
import frQuran from './locales/fr/quran.json';
import frFeatures from './locales/fr/features.json';

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    auth: enAuth,
    prayer: enPrayer,
    quran: enQuran,
    features: enFeatures,
  },
  ar: {
    common: arCommon,
    navigation: arNavigation,
    auth: arAuth,
    prayer: arPrayer,
    quran: arQuran,
    features: arFeatures,
  },
  ur: {
    common: urCommon,
    navigation: urNavigation,
    auth: urAuth,
    prayer: urPrayer,
    quran: urQuran,
    features: urFeatures,
  },
  fr: {
    common: frCommon,
    navigation: frNavigation,
    auth: frAuth,
    prayer: frPrayer,
    quran: frQuran,
    features: frFeatures,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'navigation', 'auth', 'prayer', 'quran', 'features'],
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Handle RTL for Arabic and Urdu
i18n.on('languageChanged', (lng) => {
  const isRTL = ['ar', 'ur'].includes(lng);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
