import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { blankProject, createBlankResume } from '../src/domain/factories'
import { createSampleResume } from '../src/domain/sampleResume'
import { ResumeRenderer } from '../src/features/preview/ResumeRenderer'

describe('resume renderer', () => {
  it('renders real semantic text in a linear section order', () => {
    const document = createSampleResume()
    const { container } = render(<ResumeRenderer document={document} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Alex Rivera' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument()
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
    expect(container.querySelector('[dangerouslySetInnerHTML]')).not.toBeInTheDocument()
  })

  it('never places unsafe user URLs in an anchor', () => {
    const document = createSampleResume()
    document.basics.website = 'javascript:alert(1)'
    const firstProject = document.projects[0]
    if (!firstProject) throw new Error('Sample project fixture is missing.')
    firstProject.url = 'data:text/html,unsafe'
    const { container } = render(<ResumeRenderer document={document} />)
    const hrefs = [...container.querySelectorAll('a')].map((anchor) => anchor.getAttribute('href'))
    expect(hrefs.some((href) => href?.startsWith('javascript:') || href?.startsWith('data:'))).toBe(false)
  })

  it('switches conventional labels to Portuguese', () => {
    const document = createSampleResume()
    document.settings.locale = 'pt-BR'
    render(<ResumeRenderer document={document} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Experiência' })).toBeInTheDocument()
    expect(screen.getAllByText(/Atual/).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 3, name: / em / })).toBeInTheDocument()
  })

  it('keeps placeholders and incomplete entries out of print', () => {
    const document = createBlankResume()
    document.projects.push(blankProject())
    const { container } = render(<ResumeRenderer document={document} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Your name' })).toHaveClass('no-print')
    expect(container.querySelectorAll('.resume-entry')).toHaveLength(0)
  })
})
