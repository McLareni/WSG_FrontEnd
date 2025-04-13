import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Імпорт перекладів
import adminUserEN from './en/adminUser.json';
import tabProfileEN from './en/tabProfile.json';
import adminUserPL from './pl/adminUser.json';
import tabProfilePL from './pl/tabProfile.json';
import adminUserUK from './ua/adminUser.json';
import tabProfileUK from './ua/tabProfile.json';

import validationEN from './en/validation.json';
import validationUK from './ua/validation.json';
import validationPL from './pl/validation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        adminUser: adminUserEN,
        tabProfile: tabProfileEN,
        validation: validationEN
      },
      pl: {
        adminUser: adminUserPL,
        tabProfile: tabProfilePL,
        validation: validationPL
      },
      uk: {
        adminUser: adminUserUK,
        tabProfile: tabProfileUK,
        validation: validationUK
      }
    },
    fallbackLng: 'en',
    ns: ['adminUser', 'tabProfile' , 'validation'],
    defaultNS: 'adminUser',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie']
    }
  });

export default i18n;