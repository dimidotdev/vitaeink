/* global document, window */
(() => {
  const root = document.documentElement
  const safeRead = (key) => {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  }

  const storedTheme = safeRead('vitaeink-theme-v1')
  const theme = storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const storedLocale = safeRead('vitaeink-ui-locale-v1')
  const browserLanguages = window.navigator.languages ?? [window.navigator.language]
  const detectedLocale = browserLanguages.reduce((locale, language) => {
    if (locale) return locale
    const normalized = String(language).toLowerCase()
    if (normalized === 'pt' || normalized.startsWith('pt-')) return 'pt-BR'
    if (normalized === 'es' || normalized.startsWith('es-')) return 'es'
    if (normalized === 'en' || normalized.startsWith('en-')) return 'en'
    return ''
  }, '') || 'en'
  const locale = storedLocale === 'en' || storedLocale === 'pt-BR' || storedLocale === 'es' ? storedLocale : detectedLocale

  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
  root.style.colorScheme = theme
  root.lang = locale
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1114' : '#f2f6f7')
})()
