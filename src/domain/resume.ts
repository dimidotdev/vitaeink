import { z } from 'zod'

export const SECTION_KEYS = [
  'profile',
  'experience',
  'projects',
  'education',
  'certifications',
  'skills',
  'languages',
] as const

export type SectionKey = (typeof SECTION_KEYS)[number]

export const RESUME_LIMITS = {
  id: 100,
  shortText: 200,
  longText: 4_000,
  email: 254,
  url: 2_048,
  links: 12,
  experience: 30,
  projects: 30,
  education: 20,
  certifications: 30,
  skills: 30,
  languages: 20,
  experienceHighlights: 20,
  projectHighlights: 20,
  educationHighlights: 12,
  skillKeywords: 40,
} as const

const idSchema = z.string().trim().min(1).max(RESUME_LIMITS.id)
const shortTextSchema = z.string().max(RESUME_LIMITS.shortText)
const longTextSchema = z.string().max(RESUME_LIMITS.longText)
const monthSchema = z.union([z.literal(''), z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)])
const urlDraftSchema = z.string().trim().max(RESUME_LIMITS.url)

const linkSchema = z.object({
  id: idSchema,
  label: shortTextSchema,
  url: urlDraftSchema,
}).strict()

const basicsSchema = z.object({
  name: shortTextSchema,
  headline: shortTextSchema,
  email: z.string().trim().max(RESUME_LIMITS.email),
  phone: shortTextSchema,
  location: shortTextSchema,
  website: urlDraftSchema,
  links: z.array(linkSchema).max(RESUME_LIMITS.links),
  summary: longTextSchema,
}).strict()

const datedEntrySchema = {
  id: idSchema,
  startDate: monthSchema,
  endDate: monthSchema,
  current: z.boolean(),
}

const experienceSchema = z.object({
  ...datedEntrySchema,
  company: shortTextSchema,
  role: shortTextSchema,
  location: shortTextSchema,
  highlights: z.array(longTextSchema).max(RESUME_LIMITS.experienceHighlights),
}).strict()

const projectSchema = z.object({
  ...datedEntrySchema,
  name: shortTextSchema,
  role: shortTextSchema,
  url: urlDraftSchema,
  summary: longTextSchema,
  highlights: z.array(longTextSchema).max(RESUME_LIMITS.projectHighlights),
}).strict()

const educationSchema = z.object({
  ...datedEntrySchema,
  institution: shortTextSchema,
  degree: shortTextSchema,
  field: shortTextSchema,
  location: shortTextSchema,
  highlights: z.array(longTextSchema).max(RESUME_LIMITS.educationHighlights),
}).strict()

const certificationSchema = z.object({
  id: idSchema,
  name: shortTextSchema,
  issuer: shortTextSchema,
  date: monthSchema,
  credentialId: shortTextSchema,
  url: urlDraftSchema,
}).strict()

const skillSchema = z.object({
  id: idSchema,
  name: shortTextSchema,
  keywords: z.array(shortTextSchema).max(RESUME_LIMITS.skillKeywords),
}).strict()

const languageSchema = z.object({
  id: idSchema,
  name: shortTextSchema,
  level: shortTextSchema,
}).strict()

const sectionKeySchema = z.enum(SECTION_KEYS)

const settingsSchema = z.object({
  template: z.enum(['essential', 'editorial', 'compact']),
  font: z.enum(['inter', 'ibm-plex', 'source-serif']),
  fontSize: z.number().min(9).max(13),
  lineHeight: z.number().min(1.2).max(1.7),
  density: z.enum(['compact', 'balanced', 'spacious']),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  pageSize: z.enum(['A4', 'Letter']),
  locale: z.enum(['en', 'pt-BR']),
  sectionOrder: z.array(sectionKeySchema).length(SECTION_KEYS.length).refine(
    (items) => new Set(items).size === SECTION_KEYS.length,
    'Every section must appear exactly once',
  ),
  hiddenSections: z.array(sectionKeySchema).max(SECTION_KEYS.length),
}).strict()

export const resumeDocumentSchema = z.object({
  version: z.literal(1),
  metadata: z.object({
    title: shortTextSchema,
    updatedAt: z.string().datetime(),
  }).strict(),
  basics: basicsSchema,
  experience: z.array(experienceSchema).max(RESUME_LIMITS.experience),
  projects: z.array(projectSchema).max(RESUME_LIMITS.projects),
  education: z.array(educationSchema).max(RESUME_LIMITS.education),
  certifications: z.array(certificationSchema).max(RESUME_LIMITS.certifications),
  skills: z.array(skillSchema).max(RESUME_LIMITS.skills),
  languages: z.array(languageSchema).max(RESUME_LIMITS.languages),
  settings: settingsSchema,
}).strict()

export type ResumeDocument = z.infer<typeof resumeDocumentSchema>
export type ResumeSettings = ResumeDocument['settings']
export type Experience = ResumeDocument['experience'][number]
export type Project = ResumeDocument['projects'][number]
export type Education = ResumeDocument['education'][number]
export type Certification = ResumeDocument['certifications'][number]
export type Skill = ResumeDocument['skills'][number]
export type Language = ResumeDocument['languages'][number]
