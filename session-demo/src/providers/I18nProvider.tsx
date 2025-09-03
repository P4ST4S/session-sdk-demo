import React, { createContext, useContext, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import sdkI18n from '../i18n';
// L'instance i18n du SDK est complètement séparée de celle de l'app

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  defaultLanguage?: string;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  defaultLanguage = 'fr' 
}) => {
  const [language, setLanguageState] = React.useState(defaultLanguage);

  useEffect(() => {
    // Utiliser l'instance SDK pour changer la langue
    sdkI18n.changeLanguage(language);
  }, [language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    sdkI18n.changeLanguage(lang);
  };

  return (
    <I18nextProvider i18n={sdkI18n}>
      <I18nContext.Provider value={{ language, setLanguage }}>
        {children}
      </I18nContext.Provider>
    </I18nextProvider>
  );
};

export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
};
