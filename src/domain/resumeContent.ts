import type { Certification, Education, Experience, Language, Project, Skill } from './resume'

const hasText = (value: string): boolean => value.trim().length > 0
const hasTextItem = (values: string[]): boolean => values.some(hasText)

export const experienceHasContent = (entry: Experience): boolean => (
  [entry.role, entry.company, entry.location, entry.startDate, entry.endDate].some(hasText) || hasTextItem(entry.highlights)
)

export const isRenderableExperience = (entry: Experience): boolean => hasText(entry.role) && hasText(entry.company)

export const projectHasContent = (entry: Project): boolean => (
  [entry.name, entry.role, entry.url, entry.summary, entry.startDate, entry.endDate].some(hasText) || hasTextItem(entry.highlights)
)

export const isRenderableProject = (entry: Project): boolean => hasText(entry.name)

export const educationHasContent = (entry: Education): boolean => (
  [entry.institution, entry.degree, entry.field, entry.location, entry.startDate, entry.endDate].some(hasText) || hasTextItem(entry.highlights)
)

export const isRenderableEducation = (entry: Education): boolean => (
  hasText(entry.institution) && (hasText(entry.degree) || hasText(entry.field))
)

export const certificationHasContent = (entry: Certification): boolean => (
  [entry.name, entry.issuer, entry.date, entry.credentialId, entry.url].some(hasText)
)

export const isRenderableCertification = (entry: Certification): boolean => hasText(entry.name) && hasText(entry.issuer)

export const skillHasContent = (entry: Skill): boolean => hasText(entry.name) || hasTextItem(entry.keywords)

export const isRenderableSkill = (entry: Skill): boolean => hasText(entry.name) && hasTextItem(entry.keywords)

export const languageHasContent = (entry: Language): boolean => hasText(entry.name) || hasText(entry.level)

export const isRenderableLanguage = (entry: Language): boolean => hasText(entry.name) && hasText(entry.level)
