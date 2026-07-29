import {
  RiShieldCheckLine,
} from '@remixicon/react'
import { usePreferences } from '../app/usePreferences'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { NAV_ITEMS, type EditorSection } from './sectionNavItems'

export type { EditorSection } from './sectionNavItems'

interface SectionNavProps {
  active: EditorSection
  issues: number
  onChange: (section: EditorSection) => void
}

export const SectionNav = ({ active, issues, onChange }: SectionNavProps) => {
  const { t } = usePreferences()
  return (
  <nav className="section-nav" aria-label={t('nav.aria')}>
    <div className="nav-heading" aria-hidden="true"><span>{t('nav.resume')}</span><small>{t('nav.contentStyle')}</small></div>
    <div className="nav-items">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const selected = active === item.key
        return (
          <Button
            type="button"
            key={item.key}
            variant={selected ? 'secondary' : 'ghost'}
            className={selected ? 'active' : undefined}
            aria-current={selected ? 'page' : undefined}
            onClick={() => { onChange(item.key) }}
          >
            <Icon aria-hidden="true" />
            <span>{t(item.labelKey)}</span>
          </Button>
        )
      })}
    </div>
    <div className="nav-review">
      <span className="nav-review-label" aria-hidden="true">{t('nav.review')}</span>
      <Button
        type="button"
        variant={active === 'check' ? 'secondary' : 'ghost'}
        className={active === 'check' ? 'active check-nav' : 'check-nav'}
        aria-current={active === 'check' ? 'page' : undefined}
        onClick={() => { onChange('check') }}
      >
        <RiShieldCheckLine aria-hidden="true" />
        <span>{t('nav.documentCheck')}</span>
        <Badge variant={issues === 0 ? 'secondary' : 'outline'} className={issues === 0 ? 'issue-count issue-clear' : 'issue-count'} aria-label={t(issues === 1 ? 'nav.finding.one' : 'nav.finding.many', { count: issues })}>{issues}</Badge>
      </Button>
    </div>
    <p className="privacy-note"><span aria-hidden="true">●</span> {t('nav.private')}<br /><small>{t('nav.savedLocally')}</small></p>
  </nav>
  )
}
