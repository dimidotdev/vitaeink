import type { ResumeDocument, SectionKey } from './resume'
import { safeExternalUrl } from './presentation'
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
  title: string
  detail: string
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
    add({ id: 'missing-name', level: 'warning', section: 'profile', title: 'Add your name', detail: 'Recruiters and parsers need a clear document owner.' })
  }
  if (!document.basics.headline.trim()) {
    add({ id: 'missing-headline', level: 'warning', section: 'profile', title: 'Add a professional headline', detail: 'State the role and technical focus you want to be found for.' })
  }
  if (!document.basics.email.trim() || !emailPattern.test(document.basics.email)) {
    add({ id: 'invalid-email', level: 'warning', section: 'profile', title: 'Check your email', detail: 'Use a complete address that an ATS can identify.' })
  }
  if (document.basics.summary.trim().length < 80) {
    add({ id: 'short-summary', level: 'suggestion', section: 'profile', title: 'Strengthen the profile', detail: 'A concise 2–4 sentence profile can connect your role, stack, and impact.' })
  }
  if (!document.experience.some(isRenderableExperience)) {
    add({ id: 'missing-experience', level: 'suggestion', section: 'experience', title: 'Add relevant experience', detail: 'Paid work, freelance engagements, and substantial ongoing projects can all provide evidence.' })
  }
  document.experience.forEach((entry) => {
    if (!isRenderableExperience(entry)) {
      add({ id: `experience-title-${entry.id}`, level: 'warning', section: 'experience', title: 'Complete an experience heading', detail: 'Each role needs both a title and organization.' })
    }
    if (experienceHasContent(entry) && entry.highlights.filter((item) => item.trim()).length === 0) {
      add({ id: `experience-detail-${entry.id}`, level: 'suggestion', section: 'experience', title: `Add evidence for ${entry.role || 'this role'}`, detail: 'Describe what changed because of your work, without inventing metrics.' })
    }
  })
  document.projects.forEach((entry) => {
    if (!isRenderableProject(entry)) {
      add({ id: `project-title-${entry.id}`, level: 'warning', section: 'projects', title: 'Name or remove this project', detail: projectHasContent(entry) ? 'A project needs a clear name before it can be exported.' : 'This empty project is excluded from the exported document.' })
    }
    if (isRenderableProject(entry) && !entry.summary.trim() && !entry.highlights.some((item) => item.trim())) {
      add({ id: `project-detail-${entry.id}`, level: 'suggestion', section: 'projects', title: `Add evidence for ${entry.name}`, detail: 'Explain the problem, your contribution, or a factual outcome.' })
    }
  })
  document.education.forEach((entry) => {
    if (!isRenderableEducation(entry)) {
      add({ id: `education-title-${entry.id}`, level: 'warning', section: 'education', title: 'Complete or remove this education entry', detail: educationHasContent(entry) ? 'Include the institution and a degree or field of study.' : 'This empty entry is excluded from the exported document.' })
    }
  })
  document.certifications.forEach((entry) => {
    if (!isRenderableCertification(entry)) {
      add({ id: `certification-title-${entry.id}`, level: 'warning', section: 'certifications', title: 'Complete or remove this certification', detail: certificationHasContent(entry) ? 'Include both the certification and issuer.' : 'This empty entry is excluded from the exported document.' })
    }
  })
  document.skills.forEach((entry) => {
    if (!isRenderableSkill(entry)) {
      add({ id: `skill-title-${entry.id}`, level: 'warning', section: 'skills', title: 'Complete or remove this skill group', detail: skillHasContent(entry) ? 'Include a category and at least one factual skill.' : 'This empty group is excluded from the exported document.' })
    }
  })
  document.languages.forEach((entry) => {
    if (!isRenderableLanguage(entry)) {
      add({ id: `language-title-${entry.id}`, level: 'warning', section: 'languages', title: 'Complete or remove this language', detail: languageHasContent(entry) ? 'Include both the language and proficiency.' : 'This empty entry is excluded from the exported document.' })
    }
  })
  document.basics.links.forEach((link) => {
    if (Boolean(link.label.trim()) !== Boolean(link.url.trim())) {
      add({ id: `link-${link.id}`, level: 'warning', section: 'profile', title: 'Complete or remove this profile link', detail: 'Every profile link needs both a visible label and a complete URL.' })
    }
  })
  const urls = [document.basics.website, ...document.basics.links.map((link) => link.url), ...document.projects.map((project) => project.url), ...document.certifications.map((item) => item.url)]
  if (urls.some((url) => url.trim() && !safeExternalUrl(url))) {
    add({ id: 'invalid-url', level: 'warning', section: 'profile', title: 'Check your links', detail: 'Links must be complete http:// or https:// addresses.' })
  }
  if (contrastOnWhite(document.settings.accent) < 4.5) {
    add({ id: 'accent-contrast', level: 'warning', section: 'document', title: 'Increase accent contrast', detail: 'The selected accent is too light against the white document.' })
  }
  if (document.settings.fontSize < 9.5) {
    add({ id: 'small-type', level: 'suggestion', section: 'document', title: 'Consider larger text', detail: 'Very small type can be uncomfortable for human reviewers.' })
  }

  return issues
}
