import { createContext, useContext } from 'react'

import en from './en.json'
import pt from './pt.json'

export type Lang = 'pt' | 'en'

export type Dictionary = typeof pt

// Dot-separated paths to every string in the dictionary, e.g. "hero.name".
// Lists (paragraphs, cards) are read from `dict` instead.
type Path<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends readonly unknown[]
      ? never
      : `${K}.${Path<T[K]>}`
}[keyof T & string]

export type TranslationKey = Path<Dictionary>

// Typing both as Dictionary makes the build fail if en.json drifts from pt.json.
export const dictionaries: Record<Lang, Dictionary> = { pt, en }

export const LANG_STORAGE_KEY = 'lang'

export function detectInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch {
    // Storage can be blocked (private mode); fall through to the browser language.
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function translate(lang: Lang, key: TranslationKey): string {
  let node: unknown = dictionaries[lang]
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown>)[part]
  }
  return node as string
}

interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
  dict: Dictionary
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
