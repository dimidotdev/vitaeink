import { describe, expect, it } from 'vitest'
import { contrastOnWhite, runDocumentChecks } from '../src/domain/documentChecks'
import { blankProject, createBlankResume } from '../src/domain/factories'
import { createSampleResume } from '../src/domain/sampleResume'

describe('document checks', () => {
  it('identifies essential missing content without inventing a score', () => {
    const issues = runDocumentChecks(createBlankResume())
    expect(issues.map((issue) => issue.id)).toEqual(expect.arrayContaining(['missing-name', 'missing-headline', 'invalid-email']))
    expect(issues.find((issue) => issue.id === 'missing-name')).toMatchObject({
      titleKey: 'check.issue.missingName.title',
      detailKey: 'check.issue.missingName.detail',
    })
  })

  it('flags unsafe links and low-contrast accents', () => {
    const document = createSampleResume()
    document.basics.website = 'javascript:alert(1)'
    document.settings.accent = '#F7D8C8'
    const issues = runDocumentChecks(document)
    expect(issues.map((issue) => issue.id)).toEqual(expect.arrayContaining(['invalid-url', 'accent-contrast']))
  })

  it('calculates WCAG contrast against white', () => {
    expect(contrastOnWhite('#000000')).toBeCloseTo(21, 1)
    expect(contrastOnWhite('#FFFFFF')).toBeCloseTo(1, 1)
  })

  it('does not approve an empty collection entry', () => {
    const document = createSampleResume()
    const project = blankProject()
    document.projects.push(project)
    const issues = runDocumentChecks(document)
    expect(issues.map((issue) => issue.id)).toContain(`project-title-${project.id}`)
  })
})
