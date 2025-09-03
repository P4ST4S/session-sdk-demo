import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslations from './fr.json';
import enTranslations from './en.json';

// Créer une instance i18next complètement séparée pour le SDK
const sdkI18n = createInstance();

const resources = {
  fr: {
    translation: frTranslations
  },
  en: {
    translation: enTranslations
  }
};

// Initialiser l'instance SDK de manière indépendante
sdkI18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default sdkI18n;
