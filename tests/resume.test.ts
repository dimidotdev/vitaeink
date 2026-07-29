import { describe, expect, it } from 'vitest'
import { createSampleResume } from '../src/domain/sampleResume'
import { parseResumeJson, ResumeImportError, safeFilename, serializeResume } from '../src/domain/portableDocument'
import { resumeDocumentSchema } from '../src/domain/resume'

describe('portable resume document', () => {
  it('round-trips the versioned sample without losing data', () => {
    const sample = createSampleResume()
    expect(parseResumeJson(serializeResume(sample))).toEqual(sample)
  })

  it('rejects unknown root fields', () => {
    const sample = { ...createSampleResume(), injected: '<script>alert(1)</script>' }
    expect(() => parseResumeJson(JSON.stringify(sample))).toThrow(ResumeImportError)
  })

  it('rejects malformed dates and duplicate section order entries', () => {
    const sample = createSampleResume()
    const firstExperience = sample.experience[0]
    if (!firstExperience) throw new Error('Sample experience fixture is missing.')
    firstExperience.startDate = '2026-99'
    sample.settings.sectionOrder = sample.settings.sectionOrder.map(() => 'profile')
    expect(resumeDocumentSchema.safeParse(sample).success).toBe(false)
  })

  it('creates portable filenames', () => {
    expect(safeFilename('João Silva — Résumé', 'pdf')).toBe('joao-silva-resume.pdf')
    expect(safeFilename('   ', 'json')).toBe('resume.json')
  })
})
