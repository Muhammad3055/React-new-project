import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Default UI Language is English ('en') to keep all buttons, cards, headers, and sections clean
  const [lang, setLangState] = useState('en');

  const isRtl = false;
  const dir = 'ltr';

  useEffect(() => {
    localStorage.setItem('quran_portal_lang', 'en');
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.body.style.fontFamily = "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif";
  }, []);

  const setLang = (newLang) => {
    setLangState('en');
  };

  // Translation helper returning clean English UI text
  const t = (key, fallback = '') => {
    const enDict = translations.en;
    if (enDict && enDict[key] !== undefined) return enDict[key];
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang: 'en', setLang, dir, isRtl, t }}>
      <div dir="ltr" className="ltr-layout">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'en',
      setLang: () => {},
      dir: 'ltr',
      isRtl: false,
      t: (key, fallback = '') => translations.en[key] || fallback || key
    };
  }
  return context;
}
