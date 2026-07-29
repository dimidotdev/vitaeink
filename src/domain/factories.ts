import type {
  Certification,
  Education,
  Experience,
  Language,
  Project,
  ResumeDocument,
  ResumeSettings,
  Skill,
} from './resume'
import { SECTION_KEYS } from './resume'

const createId = (prefix: string): string => `${prefix}-${crypto.randomUUID()}`

export const defaultSettings = (): ResumeSettings => ({
  template: 'essential',
  font: 'inter',
  fontSize: 10.5,
  lineHeight: 1.45,
  density: 'balanced',
  accent: '#0E7490',
  pageSize: 'A4',
  locale: 'en',
  sectionOrder: [...SECTION_KEYS],
  hiddenSections: [],
})

export const blankExperience = (): Experience => ({
  id: createId('experience'), company: '', role: '', location: '',
  startDate: '', endDate: '', current: false, highlights: [''],
})

export const blankProject = (): Project => ({
  id: createId('project'), name: '', role: '', url: '', summary: '',
  startDate: '', endDate: '', current: false, highlights: [''],
})

export const blankEducation = (): Education => ({
  id: createId('education'), institution: '', degree: '', field: '', location: '',
  startDate: '', endDate: '', current: false, highlights: [],
})

export const blankCertification = (): Certification => ({
  id: createId('certification'), name: '', issuer: '', date: '', credentialId: '', url: '',
})

export const blankSkill = (): Skill => ({ id: createId('skill'), name: '', keywords: [] })

export const blankLanguage = (): Language => ({ id: createId('language'), name: '', level: '' })

export const createBlankResume = (): ResumeDocument => ({
  version: 1,
  metadata: { title: 'Untitled resume', updatedAt: new Date().toISOString() },
  basics: {
    name: '', headline: '', email: '', phone: '', location: '', website: '', links: [], summary: '',
  },
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  skills: [],
  languages: [],
  settings: defaultSettings(),
})
