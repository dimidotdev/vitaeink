import type { ResumeDocument, SectionKey } from './resume'
import { safeExternalUrl } from './presentation'
import type { MessageKey } from '../i18n/messages'
import {
  certificationHasContent,
  educationHasContent,
  experienceHasContent,
  isRenderableCertification,
  isRenderableEducation,
  isRenderableExperience,
  isRenderableLanguage,
  isRenderableProject,
  isRenderableSkill,
  languageHasContent,
  projectHasContent,
  skillHasContent,
} from './resumeContent'

export interface DocumentIssue {
  id: string
  level: 'warning' | 'suggestion'
  section: SectionKey | 'document'
  titleKey: MessageKey
  detailKey: MessageKey
  values?: Record<string, string | number>
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const hexToRgb = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
]

const relativeLuminance = ([red, green, blue]: [number, number, number]): number => {
  const channels = [red, green, blue].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * (channels[0] ?? 0) + 0.7152 * (channels[1] ?? 0) + 0.0722 * (channels[2] ?? 0)
}

export const contrastOnWhite = (hex: string): number => 1.05 / (relativeLuminance(hexToRgb(hex)) + 0.05)

export const runDocumentChecks = (document: ResumeDocument): DocumentIssue[] => {
  const issues: DocumentIssue[] = []
  const add = (issue: DocumentIssue): void => { issues.push(issue) }

  if (!document.basics.name.trim()) {
    add({ id: 'missing-name', level: 'warning', section: 'profile', titleKey: 'check.issue.missingName.title', detailKey: 'check.issue.missingName.detail' })
  }
  if (!document.basics.headline.trim()) {
    add({ id: 'missing-headline', level: 'warning', section: 'profile', titleKey: 'check.issue.missingHeadline.title', detailKey: 'check.issue.missingHeadline.detail' })
  }
  if (!document.basics.email.trim() || !emailPattern.test(document.basics.email)) {
    add({ id: 'invalid-email', level: 'warning', section: 'profile', titleKey: 'check.issue.invalidEmail.title', detailKey: 'check.issue.invalidEmail.detail' })
  }
  if (document.basics.summary.trim().length < 80) {
    add({ id: 'short-summary', level: 'suggestion', section: 'profile', titleKey: 'check.issue.shortSummary.title', detailKey: 'check.issue.shortSummary.detail' })
  }
  if (!document.experience.some(isRenderableExperience)) {
    add({ id: 'missing-experience', level: 'suggestion', section: 'experience', titleKey: 'check.issue.missingExperience.title', detailKey: 'check.issue.missingExperience.detail' })
  }
  document.experience.forEach((entry) => {
    if (!isRenderableExperience(entry)) {
      add({ id: `experience-title-${entry.id}`, level: 'warning', section: 'experience', titleKey: 'check.issue.experienceHeading.title', detailKey: 'check.issue.experienceHeading.detail' })
    }
    if (experienceHasContent(entry) && entry.highlights.filter((item) => item.trim()).length === 0) {
      add({
        id: `experience-detail-${entry.id}`,
        level: 'suggestion',
        section: 'experience',
        titleKey: 'check.issue.experienceEvidence.title',
        detailKey: 'check.issue.experienceEvidence.detail',
        values: { subject: entry.role },
      })
    }
  })
  document.projects.forEach((entry) => {
    if (!isRenderableProject(entry)) {
      add({ id: `project-title-${entry.id}`, level: 'warning', section: 'projects', titleKey: 'check.issue.projectTitle.title', detailKey: projectHasContent(entry) ? 'check.issue.projectTitle.partial' : 'check.issue.projectTitle.empty' })
    }
    if (isRenderableProject(entry) && !entry.summary.trim() && !entry.highlights.some((item) => item.trim())) {
      add({ id: `project-detail-${entry.id}`, level: 'suggestion', section: 'projects', titleKey: 'check.issue.projectEvidence.title', detailKey: 'check.issue.projectEvidence.detail', values: { subject: entry.name } })
    }
  })
  document.education.forEach((entry) => {
    if (!isRenderableEducation(entry)) {
      add({ id: `education-title-${entry.id}`, level: 'warning', section: 'education', titleKey: 'check.issue.educationTitle.title', detailKey: educationHasContent(entry) ? 'check.issue.educationTitle.partial' : 'check.issue.educationTitle.empty' })
    }
  })
  document.certifications.forEach((entry) => {
    if (!isRenderableCertification(entry)) {
      add({ id: `certification-title-${entry.id}`, level: 'warning', section: 'certifications', titleKey: 'check.issue.certificationTitle.title', detailKey: certificationHasContent(entry) ? 'check.issue.certificationTitle.partial' : 'check.issue.certificationTitle.empty' })
    }
  })
  document.skills.forEach((entry) => {
    if (!isRenderableSkill(entry)) {
      add({ id: `skill-title-${entry.id}`, level: 'warning', section: 'skills', titleKey: 'check.issue.skillTitle.title', detailKey: skillHasContent(entry) ? 'check.issue.skillTitle.partial' : 'check.issue.skillTitle.empty' })
    }
  })
  document.languages.forEach((entry) => {
    if (!isRenderableLanguage(entry)) {
      add({ id: `language-title-${entry.id}`, level: 'warning', section: 'languages', titleKey: 'check.issue.languageTitle.title', detailKey: languageHasContent(entry) ? 'check.issue.languageTitle.partial' : 'check.issue.languageTitle.empty' })
    }
  })
  document.basics.links.forEach((link) => {
    if (Boolean(link.label.trim()) !== Boolean(link.url.trim())) {
      add({ id: `link-${link.id}`, level: 'warning', section: 'profile', titleKey: 'check.issue.profileLink.title', detailKey: 'check.issue.profileLink.detail' })
    }
  })
  const urls = [document.basics.website, ...document.basics.links.map((link) => link.url), ...document.projects.map((project) => project.url), ...document.certifications.map((item) => item.url)]
  if (urls.some((url) => url.trim() && !safeExternalUrl(url))) {
    add({ id: 'invalid-url', level: 'warning', section: 'profile', titleKey: 'check.issue.invalidUrl.title', detailKey: 'check.issue.invalidUrl.detail' })
  }
  if (contrastOnWhite(document.settings.accent) < 4.5) {
    add({ id: 'accent-contrast', level: 'warning', section: 'document', titleKey: 'check.issue.accentContrast.title', detailKey: 'check.issue.accentContrast.detail' })
  }
  if (document.settings.fontSize < 9.5) {
    add({ id: 'small-type', level: 'suggestion', section: 'document', titleKey: 'check.issue.smallType.title', detailKey: 'check.issue.smallType.detail' })
  }

  return issues
}
