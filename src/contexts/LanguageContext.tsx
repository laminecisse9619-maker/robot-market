import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { languages, translations, type LanguageCode } from '../i18n/translations'

interface LanguageContextValue {
  language: LanguageCode
  setLanguage: (code: LanguageCode) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'robot-market-language'

function detectInitialLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null
  if (stored && languages.some((l) => l.code === stored)) return stored
  const browserLang = window.navigator.language.slice(0, 2)
  const match = languages.find((l) => l.code === browserLang)
  return match?.code ?? 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(detectInitialLanguage)

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code)
    window.localStorage.setItem(STORAGE_KEY, code)
  }

  const dir = languages.find((l) => l.code === language)?.dir ?? 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir
  }, [language, dir])

  const t = (key: string) => translations[language][key] ?? translations.en[key] ?? key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
