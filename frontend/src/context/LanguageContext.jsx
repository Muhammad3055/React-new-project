import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && translations[urlLang]) return urlLang;
    const saved = localStorage.getItem('quran_portal_lang');
    if (saved && translations[saved]) return saved;
    return 'en';
  });

  const isRtl = lang === 'ur' || lang === 'br' || lang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('quran_portal_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    if (lang === 'ur' || lang === 'br') {
      document.body.style.fontFamily = "'Amiri', 'Jameel Noori Nastaleeq', 'Outfit', sans-serif";
    } else if (lang === 'ar') {
      document.body.style.fontFamily = "'Amiri', 'Traditional Arabic', serif";
    } else {
      document.body.style.fontFamily = "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif";
    }
  }, [lang, dir]);

  const setLang = (newLang) => {
    if (translations[newLang]) {
      setLangState(newLang);
    }
  };

  const t = (key, fallback = '') => {
    const dict = translations[lang] || translations.en;
    if (dict && dict[key] !== undefined && dict[key] !== '') return dict[key];
    const enDict = translations.en;
    if (enDict && enDict[key] !== undefined) return enDict[key];
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, isRtl, t }}>
      <div dir={dir} className={isRtl ? 'rtl-layout' : 'ltr-layout'}>
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
