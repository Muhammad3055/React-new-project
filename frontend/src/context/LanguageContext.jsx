import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
const ARABIC_COUNTRIES = new Set(['AE', 'SA', 'QA', 'KW', 'OM', 'BH', 'EG', 'JO', 'LB', 'SY', 'IQ', 'YE', 'PS', 'SD', 'MA', 'DZ', 'TN', 'LY']);
export const languageForCountry = (code) => code?.toUpperCase() === 'PK' ? 'ur' : ARABIC_COUNTRIES.has(code?.toUpperCase()) ? 'ar' : null;

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const translationObserverRef = useRef(null);
  const uiTranslationObserverRef = useRef(null);
  const originalUiTextRef = useRef(new WeakMap());
  const originalUiAttributeRef = useRef(new WeakMap());
  const [lang, setLangState] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang) return urlLang;
      const saved = localStorage.getItem('quran_portal_lang');
      if (saved) {
        if (!localStorage.getItem('quran_portal_lang_auto')) localStorage.setItem('quran_portal_lang_manual', '1');
        return saved;
      }
      const countryLanguage = languageForCountry(localStorage.getItem('user_country_code'));
      if (countryLanguage) { localStorage.setItem('quran_portal_lang_auto', '1'); return countryLanguage; }
      const browserLanguage = navigator.language?.split('-')[0];
      if (SUPPORTED_LANGUAGES.some(item => item.code === browserLanguage)) { localStorage.setItem('quran_portal_lang_auto', '1'); return browserLanguage; }
    } catch (e) {}
    return 'en';
  });

  const isRtl = RTL_LANGS.has(lang);
  const dir = isRtl ? 'rtl' : 'ltr';

  // Apply Google Translate cookies and triggers for custom non-native languages
  const applyCustomTranslation = useCallback((targetLang) => {
    if (typeof window === 'undefined') return;
    translationObserverRef.current?.disconnect();

    if (translations[targetLang]) {
      // Native language in translations dictionary (en, ur, ar, br)
      // Clear google translate cookies to ensure authentic dictionary displays cleanly
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      const select = document.querySelector('.goog-te-combo');
      if (select && select.value !== 'en') { select.value = 'en'; select.dispatchEvent(new Event('change', { bubbles: true })); }
      return;
    }

    // Custom language selected -> use universal translation bridge
    const cookieVal = `/en/${targetLang}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname};`;

    const selectLanguage = () => {
      const select = document.querySelector('.goog-te-combo');
      if (!select || !Array.from(select.options).some(option => option.value === targetLang)) return false;
      if (select.value !== targetLang) { select.value = targetLang; select.dispatchEvent(new Event('change', { bubbles: true })); }
      return true;
    };
    if (!selectLanguage()) {
      const observer = new MutationObserver(() => { if (selectLanguage()) observer.disconnect(); });
      translationObserverRef.current = observer;
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 15000);
    }

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

  // Translate legacy hardcoded UI labels when an in-app dictionary is used.
  // Exact phrase matching keeps API/religious content untouched.
  useEffect(() => {
    uiTranslationObserverRef.current?.disconnect();
    if (!translations[lang]) return undefined;

    const englishEntries = Object.entries(translations.en || {});
    const phraseKeys = new Map(englishEntries
      .filter(([, value]) => typeof value === 'string' && value.trim())
      .map(([key, value]) => [value.trim(), key]));
    let updating = false;

    const isProtected = (element) => element?.closest?.(
      '.notranslate, [translate="no"], .arabic-font, .arabic-text-render, .mushaf-page-container, .prayer-dua-arabic'
    );
    const translateRoot = (root = document.body) => {
      if (updating || !root) return;
      updating = true;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.parentElement || isProtected(node.parentElement)) continue;
        const original = originalUiTextRef.current.get(node) ?? node.nodeValue;
        const trimmed = original.trim();
        const key = phraseKeys.get(trimmed);
        if (!key) continue;
        originalUiTextRef.current.set(node, original);
        const translated = lang === 'en' ? trimmed : (translations[lang][key] || trimmed);
        const nextValue = original.replace(trimmed, translated);
        if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
      }
      const elements = root.querySelectorAll?.('[placeholder], [aria-label], [title]') || [];
      elements.forEach((element) => {
        if (isProtected(element)) return;
        let originals = originalUiAttributeRef.current.get(element);
        if (!originals) { originals = {}; originalUiAttributeRef.current.set(element, originals); }
        ['placeholder', 'aria-label', 'title'].forEach((attribute) => {
          if (!element.hasAttribute(attribute)) return;
          const original = originals[attribute] ?? element.getAttribute(attribute);
          originals[attribute] = original;
          const key = phraseKeys.get(original.trim());
          if (key) element.setAttribute(attribute, lang === 'en' ? original : (translations[lang][key] || original));
        });
      });
      updating = false;
    };

    translateRoot();
    const observer = new MutationObserver((mutations) => {
      if (updating) return;
      mutations.forEach(({ target, addedNodes }) => {
        translateRoot(target.nodeType === Node.ELEMENT_NODE ? target : target.parentElement);
        addedNodes.forEach((node) => translateRoot(node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement));
      });
    });
    uiTranslationObserverRef.current = observer;
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [lang]);

  useEffect(() => {
    const protectArabic = () => document.querySelectorAll('.arabic-font, .arabic-text-render, .mushaf-page-container, .prayer-dua-arabic')
      .forEach(node => { node.classList.add('notranslate'); node.setAttribute('translate', 'no'); });
    protectArabic();
    const observer = new MutationObserver(protectArabic);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const setLang = (newLang, manual = true) => {
    if (!newLang) return;
    if (manual) { localStorage.setItem('quran_portal_lang_manual', '1'); localStorage.removeItem('quran_portal_lang_auto'); }
    else localStorage.setItem('quran_portal_lang_auto', '1');
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
