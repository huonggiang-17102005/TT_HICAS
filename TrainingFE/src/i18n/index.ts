import { useState, useEffect, useCallback } from 'react';
import vi from './locales/vi.json';
import en from './locales/en.json';

export type Language = 'vi' | 'en';

const resources: Record<Language, any> = { vi, en };

let currentLanguage: Language = (localStorage.getItem('app_language') as Language) || 'vi';
const listeners = new Set<(lang: Language) => void>();

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  localStorage.setItem('app_language', lang);
  listeners.forEach((fn) => fn(lang));
};

export const getLanguage = (): Language => currentLanguage;

export const useTranslation = () => {
  const [lang, setLang] = useState<Language>(currentLanguage);

  useEffect(() => {
    const handleLangChange = (newLang: Language) => setLang(newLang);
    listeners.add(handleLangChange);
    return () => {
      listeners.delete(handleLangChange);
    };
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, any>): string => {
      const keys = key.split('.');
      let val: any = resources[lang];
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          val = null;
          break;
        }
      }

      // Fallback sang tiếng Việt nếu key không tồn tại ở ngôn ngữ hiện tại
      if (!val) {
        let fallback: any = resources['vi'];
        for (const k of keys) {
          if (fallback && typeof fallback === 'object' && k in fallback) {
            fallback = fallback[k];
          } else {
            fallback = null;
            break;
          }
        }
        val = fallback || key;
      }

      if (typeof val !== 'string') return key;

      // Hỗ trợ truyền param: {{count}}, {{title}}, {{name}}
      if (params) {
        return val.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, match) => {
          return params[match] !== undefined ? String(params[match]) : `{{${match}}}`;
        });
      }

      return val;
    },
    [lang]
  );

  return {
    t,
    i18n: {
      language: lang,
      changeLanguage: setLanguage,
    },
  };
};

export default {
  language: currentLanguage,
  changeLanguage: setLanguage,
  useTranslation,
};

