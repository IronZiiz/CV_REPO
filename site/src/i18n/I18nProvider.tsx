import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  I18nContext,
  LANG_STORAGE_KEY,
  detectInitialLang,
  dictionaries,
  translate,
  type Lang,
  type TranslationKey,
} from './context'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang)

  // A manual choice is saved and wins over navigator.language from then on.
  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      // Storage blocked: the choice still applies for this visit.
    }
  }, [])

  const t = useCallback((key: TranslationKey) => translate(lang, key), [lang])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    document.title = t('meta.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))
  }, [lang, t])

  const value = useMemo(() => ({ lang, setLang, t, dict: dictionaries[lang] }), [lang, setLang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
