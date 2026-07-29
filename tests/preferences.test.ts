import { describe, expect, it } from 'vitest'
import { detectUiLocale, resolveTheme } from '../src/app/preferences-core'
import { formatMessage, isUiLocale } from '../src/i18n/messages'

describe('interface preferences', () => {
  it('detects supported browser language families in preference order', () => {
    expect(detectUiLocale(['fr-FR', 'pt-PT', 'en-US'])).toBe('pt-BR')
    expect(detectUiLocale(['es-MX', 'en-US'])).toBe('es')
    expect(detectUiLocale(['de-DE'])).toBe('en')
  })

  it('accepts only the supported interface locales', () => {
    expect(isUiLocale('en')).toBe(true)
    expect(isUiLocale('pt-BR')).toBe(true)
    expect(isUiLocale('es')).toBe(true)
    expect(isUiLocale('pt-PT')).toBe(false)
  })

  it('uses the system theme until a light or dark choice is made', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('formats interpolated messages in every interface language', () => {
    expect(formatMessage('en', 'nav.finding.many', { count: 3 })).toBe('3 findings')
    expect(formatMessage('pt-BR', 'nav.finding.many', { count: 3 })).toBe('3 pendências')
    expect(formatMessage('es', 'nav.finding.many', { count: 3 })).toBe('3 hallazgos')
  })
})
