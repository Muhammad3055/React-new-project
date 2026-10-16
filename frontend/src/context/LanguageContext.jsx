import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../utils/i18n';

// Supported Custom / World Languages alongside native (en, ur, ar, br)
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'br', name: 'Brahui', nativeName: 'براہوئی', flag: '🏛️', dir: 'rtl' },
  // Extended custom languages for universal translation converter
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', dir: 'rtl' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇵🇰', dir: 'rtl' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr' }
];

const RTL_LANGS = new Set(['ur', 'ar', 'br', 'fa', 'ps', 'sd', 'he', 'ug']);

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang) return urlLang;
      const saved = localStorage.getItem('quran_portal_lang');
      if (saved) return saved;
    } catch (e) {}
    return 'en';
  });

  const isRtl = RTL_LANGS.has(lang);
  const dir = isRtl ? 'rtl' : 'ltr';

  // Apply Google Translate cookies and triggers for custom non-native languages
  const applyCustomTranslation = useCallback((targetLang) => {
    if (typeof window === 'undefined') return;

    if (translations[targetLang]) {
      // Native language in translations dictionary (en, ur, ar, br)
      // Clear google translate cookies to ensure authentic dictionary displays cleanly
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      return;
    }

    // Custom language selected -> use universal translation bridge
    const cookieVal = `/en/${targetLang}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname};`;

    // Load Google Translate script dynamically if not present
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        try {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              autoDisplay: false
            }, 'google_translate_element');
          }
        } catch (e) {}
      };

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('quran_portal_lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;

      if (lang === 'ur' || lang === 'br' || lang === 'fa' || lang === 'ps' || lang === 'sd') {
        document.body.style.fontFamily = "'Amiri', 'Jameel Noori Nastaleeq', 'Outfit', sans-serif";
      } else if (lang === 'ar') {
        document.body.style.fontFamily = "'Amiri', 'Traditional Arabic', serif";
      } else {
        document.body.style.fontFamily = "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif";
      }

      applyCustomTranslation(lang);
    } catch (e) {}
  }, [lang, dir, applyCustomTranslation]);

  const setLang = (newLang) => {
    if (!newLang) return;
    setLangState(newLang);
  };

  /**
   * Universal translation helper:
   * 1. Check current language dictionary
   * 2. Fall back to English dictionary
   * 3. Fall back to supplied fallback string or key
   */
  const t = (key, fallback = '') => {
    if (!key) return fallback || '';
    const dict = translations[lang] || translations.en;
    if (dict && dict[key] !== undefined && dict[key] !== '') {
      return dict[key];
    }
    const enDict = translations.en;
    if (enDict && enDict[key] !== undefined && enDict[key] !== '') {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, isRtl, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      <div dir={dir} className={isRtl ? 'rtl-layout' : 'ltr-layout'}>
        <div id="google_translate_element" style={{ display: 'none' }}></div>
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
      t: (key, fallback = '') => (translations.en && translations.en[key]) || fallback || key,
      supportedLanguages: SUPPORTED_LANGUAGES
    };
  }
  return context;
}
