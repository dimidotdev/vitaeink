import type { SectionKey } from '../domain/resume'

export type EditorSection = SectionKey | 'appearance' | 'check'

interface SectionNavProps {
  active: EditorSection
  issues: number
  onChange: (section: EditorSection) => void
}

const NAV_ITEMS: ReadonlyArray<{ key: EditorSection; label: string }> = [
  { key: 'profile', label: 'Profile' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'education', label: 'Education' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'skills', label: 'Skills' },
  { key: 'languages', label: 'Languages' },
  { key: 'appearance', label: 'Design' },
]

export const SectionNav = ({ active, issues, onChange }: SectionNavProps) => (
  <nav className="section-nav" aria-label="Resume sections">
    {NAV_ITEMS.map((item) => (
      <button
        type="button"
        key={item.key}
        className={active === item.key ? 'active' : undefined}
        aria-current={active === item.key ? 'page' : undefined}
        onClick={() => { onChange(item.key) }}
      >
        {item.label}
      </button>
    ))}
    <button
      type="button"
      className={active === 'check' ? 'active check-nav' : 'check-nav'}
      aria-current={active === 'check' ? 'page' : undefined}
      onClick={() => { onChange('check') }}
    >
      Document check <span className="issue-count" aria-label={`${issues} findings`}>{issues}</span>
    </button>
  </nav>
)
