import type { UiLocale } from '../i18n/messages'

export const THEME_STORAGE_KEY = 'vitaeink-theme-v1'
export const UI_LOCALE_STORAGE_KEY = 'vitaeink-ui-locale-v1'

export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

export const detectUiLocale = (languages: readonly string[] = []): UiLocale => {
  for (const language of languages) {
    const normalized = language.toLowerCase()
    if (normalized === 'pt' || normalized.startsWith('pt-')) return 'pt-BR'
    if (normalized === 'es' || normalized.startsWith('es-')) return 'es'
    if (normalized === 'en' || normalized.startsWith('en-')) return 'en'
  }
  return 'en'
}

export const resolveTheme = (preference: ThemePreference, systemIsDark: boolean): ResolvedTheme =>
  preference === 'system' ? (systemIsDark ? 'dark' : 'light') : preference
