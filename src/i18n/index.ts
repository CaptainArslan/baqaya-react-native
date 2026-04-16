/**
 * i18n — global translation system.
 *
 * Usage in any screen:
 *   const { t } = useTranslation();
 *   <Text>{t.auth.phone.heading}</Text>
 *
 * Changing language:
 *   i18nStore.setLanguage('ur');   // persists to AsyncStorage
 *
 * Supported: 'en' | 'ur' | 'roman'
 */
import { useState, useEffect } from 'react';
import { en }     from './translations/en';
import { ur }     from './translations/ur';
import { roman }  from './translations/roman';
import type { TranslationMap } from './keys';
import { getLanguage, setLanguage } from '../services/storage';

export type Language = 'en' | 'ur' | 'roman';

const translations: Record<Language, TranslationMap> = { en, ur, roman };

// ─── Singleton store ─────────────────────────────────────────

let _lang: Language = 'en';
let _listeners: Array<() => void> = [];

function notify() {
  _listeners.forEach((fn) => fn());
}

export const i18nStore = {
  getLanguage(): Language { return _lang; },

  getTranslations(): TranslationMap { return translations[_lang]; },

  async setLanguage(lang: Language): Promise<void> {
    _lang = lang;
    await setLanguage(lang);
    notify();
  },

  /** Called once at app start alongside authStore.bootstrap() */
  async bootstrap(): Promise<void> {
    const stored = await getLanguage();
    if (stored && stored in translations) {
      _lang = stored as Language;
      notify();
    }
  },

  subscribe(fn: () => void) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter((l) => l !== fn); };
  },
};

// ─── Hook ────────────────────────────────────────────────────

export function useTranslation(): { t: TranslationMap; lang: Language; setLang: (l: Language) => void } {
  const [lang, setLangState] = useState<Language>(_lang);

  useEffect(() => {
    // Sync in case bootstrap already ran before hook mounted
    setLangState(i18nStore.getLanguage());
    const unsub = i18nStore.subscribe(() => setLangState(i18nStore.getLanguage()));
    return unsub;
  }, []);

  return {
    t: translations[lang],
    lang,
    setLang: (l: Language) => { i18nStore.setLanguage(l); },
  };
}
