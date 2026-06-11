import { useState, useCallback, useEffect } from 'react';
import en from '../i18n/en.json';
import mr from '../i18n/mr.json';
import hi from '../i18n/hi.json';

const TRANSLATIONS = { en, mr, hi };

/**
 * Hook for centralized i18n language management in the Farmer app.
 * Supports English (en), Marathi (mr), and Hindi (hi).
 * Remembers user preference in localStorage.
 */
export function useLanguage() {
  // Read preference from localStorage, default to 'en'
  const [lang, setLangState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('Kisan Sarthi_lang') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    const handleLangChange = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('Kisan Sarthi_lang') || 'en';
        setLangState(stored);
      }
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => {
      window.removeEventListener('languageChange', handleLangChange);
    };
  }, []);

  const t = useCallback(
    (key) => {
      const activeDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
      return activeDict[key] || TRANSLATIONS.en[key] || key;
    },
    [lang]
  );

  const setLang = useCallback((newLang) => {
    if (newLang === 'en' || newLang === 'mr' || newLang === 'hi') {
      setLangState(newLang);
      localStorage.setItem('Kisan Sarthi_lang', newLang);
      
      // Dispatch storage or custom event to notify other components of language change
      window.dispatchEvent(new Event('languageChange'));
    }
  }, []);

  const cycleLang = useCallback(() => {
    setLangState((prev) => {
      let next = 'en';
      if (prev === 'en') next = 'mr';
      else if (prev === 'mr') next = 'hi';
      
      localStorage.setItem('Kisan Sarthi_lang', next);
      window.dispatchEvent(new Event('languageChange'));
      return next;
    });
  }, []);

  const langLabel = { en: 'EN', mr: 'मर', hi: 'हि' }[lang];

  return { lang, setLang, t, cycleLang, langLabel };
}
