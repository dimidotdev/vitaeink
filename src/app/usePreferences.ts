import { createContext, useContext } from 'react'
import type { MessageKey, UiLocale } from '../i18n/messages'
import type { ResolvedTheme, ThemePreference } from './preferences-core'

export interface PreferencesContextValue {
  uiLocale: UiLocale
  setUiLocale: (locale: UiLocale) => void
  themePreference: ThemePreference
  resolvedTheme: ResolvedTheme
  toggleTheme: () => void
  t: (key: MessageKey, values?: Record<string, string | number>) => string
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export const usePreferences = (): PreferencesContextValue => {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error('usePreferences must be used inside PreferencesProvider.')
  return context
}
