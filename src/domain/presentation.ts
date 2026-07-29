import type { ResumeDocument, SectionKey } from './resume'

const SECTION_LABELS: Record<ResumeDocument['settings']['locale'], Record<SectionKey, string>> = {
  en: {
    profile: 'Profile', experience: 'Experience', projects: 'Projects', education: 'Education',
    certifications: 'Certifications', skills: 'Skills', languages: 'Languages',
  },
  'pt-BR': {
    profile: 'Perfil', experience: 'Experiência', projects: 'Projetos', education: 'Formação',
    certifications: 'Certificações', skills: 'Competências', languages: 'Idiomas',
  },
}

export const sectionLabel = (section: SectionKey, locale: ResumeDocument['settings']['locale']): string =>
  SECTION_LABELS[locale][section]

export const credentialLabel = (locale: ResumeDocument['settings']['locale']): string =>
  locale === 'pt-BR' ? 'Credencial' : 'Credential'

export const formatMonth = (value: string, locale: ResumeDocument['settings']['locale']): string => {
  if (!value) return ''
  const [year, month] = value.split('-').map(Number)
  if (year === undefined || month === undefined) return value
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
}

export const formatDateRange = (
  startDate: string,
  endDate: string,
  current: boolean,
  locale: ResumeDocument['settings']['locale'],
): string => {
  const start = formatMonth(startDate, locale)
  const end = current ? (locale === 'pt-BR' ? 'Atual' : 'Present') : formatMonth(endDate, locale)
  return [start, end].filter(Boolean).join(' – ')
}

export const visibleUrl = (value: string): string => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

export const safeExternalUrl = (value: string): string | undefined => {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : undefined
  } catch {
    return undefined
  }
}
