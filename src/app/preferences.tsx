import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { formatMessage, isUiLocale, type MessageKey, type UiLocale } from '../i18n/messages'
import { detectUiLocale, resolveTheme, THEME_STORAGE_KEY, UI_LOCALE_STORAGE_KEY, type ResolvedTheme, type ThemePreference } from './preferences-core'
import { PreferencesContext, type PreferencesContextValue } from './usePreferences'

const readStoredValue = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeStoredValue = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Preferences remain available for this session when storage is unavailable.
  }
}

const getInitialThemePreference = (): ThemePreference => {
  const stored = readStoredValue(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

const getInitialUiLocale = (): UiLocale => {
  const stored = readStoredValue(UI_LOCALE_STORAGE_KEY)
  if (isUiLocale(stored)) return stored
  return detectUiLocale(window.navigator.languages ?? [window.navigator.language])
}

const systemPrefersDark = (): boolean => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false

const applyDocumentPreferences = (theme: ResolvedTheme, locale: UiLocale): void => {
  const root = window.document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
  root.style.colorScheme = theme
  root.lang = locale
  window.document.title = formatMessage(locale, 'app.pageTitle')
  window.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1114' : '#f2f6f7')
}

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [uiLocale, setUiLocaleState] = useState<UiLocale>(getInitialUiLocale)
  const [themePreference, setThemePreference] = useState<ThemePreference>(getInitialThemePreference)
  const [systemIsDark, setSystemIsDark] = useState(systemPrefersDark)
  const resolvedTheme = resolveTheme(themePreference, systemIsDark)

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) return
    const handleChange = (event: MediaQueryListEvent): void => { setSystemIsDark(event.matches) }
    media.addEventListener('change', handleChange)
    return () => { media.removeEventListener('change', handleChange) }
  }, [])

  useEffect(() => {
    applyDocumentPreferences(resolvedTheme, uiLocale)
  }, [resolvedTheme, uiLocale])

  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key === THEME_STORAGE_KEY) {
        setThemePreference(event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : 'system')
      }
      if (event.key === UI_LOCALE_STORAGE_KEY && isUiLocale(event.newValue)) setUiLocaleState(event.newValue)
    }
    window.addEventListener('storage', handleStorage)
    return () => { window.removeEventListener('storage', handleStorage) }
  }, [])

  const setUiLocale = useCallback((locale: UiLocale): void => {
    setUiLocaleState(locale)
    writeStoredValue(UI_LOCALE_STORAGE_KEY, locale)
  }, [])

  const toggleTheme = useCallback((): void => {
    setThemePreference((current) => {
      const currentResolved = resolveTheme(current, systemIsDark)
      const next: ResolvedTheme = currentResolved === 'dark' ? 'light' : 'dark'
      writeStoredValue(THEME_STORAGE_KEY, next)
      return next
    })
  }, [systemIsDark])

  const t = useCallback((key: MessageKey, values?: Record<string, string | number>): string =>
    formatMessage(uiLocale, key, values), [uiLocale])

  const value = useMemo<PreferencesContextValue>(() => ({
    uiLocale,
    setUiLocale,
    themePreference,
    resolvedTheme,
    toggleTheme,
    t,
  }), [resolvedTheme, setUiLocale, t, themePreference, toggleTheme, uiLocale])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}
