import { RiArrowRightLine, RiDownload2Line } from '@remixicon/react'
import { usePreferences } from '../../../app/usePreferences'
import type { DocumentIssue } from '../../../domain/documentChecks'
import type { EditorSection } from '../../../components/SectionNav'
import { Button } from '../../../components/ui/button'

interface CheckEditorProps {
  issues: DocumentIssue[]
  pageCount: number
  onSelect: (section: EditorSection) => void
  onPrint: () => void
}

export const CheckEditor = ({ issues, pageCount, onSelect, onPrint }: CheckEditorProps) => {
  const { t } = usePreferences()
  const findingLabel = issues.length === 1 ? t('check.finding.one') : t('check.finding.many', { count: issues.length })
  const pageLabel = pageCount === 1 ? t('check.length.one') : t('check.length.many', { count: pageCount })

  return <div className="editor-stack document-check">
    <div className="editor-heading">
      <p className="eyebrow">{t('check.eyebrow')}</p>
      <h2>{t('check.title')}</h2>
      <p>{t('check.description')}</p>
    </div>
    <div className={issues.length === 0 ? 'check-summary' : 'check-summary check-summary-warning'} role="status">
      <strong>{issues.length === 0 ? t('check.ready') : findingLabel}</strong>
      <span>{pageLabel}</span>
    </div>
    {issues.length > 0 && (
      <ul className="issue-list">
        {issues.map((issue) => (
          <li key={issue.id} className={`issue issue-${issue.level}`}>
            <div>
              <span>{t(issue.level === 'warning' ? 'check.level.warning' : 'check.level.suggestion')}</span>
              <strong>{t(issue.titleKey, issue.titleKey === 'check.issue.experienceEvidence.title' && !issue.values?.subject ? { subject: t('check.issue.experienceEvidence.fallback') } : issue.values)}</strong>
              <p>{t(issue.detailKey, issue.values)}</p>
            </div>
            {issue.section !== 'document' && (
              <Button type="button" variant="ghost" onClick={() => { if (issue.section !== 'document') onSelect(issue.section) }}>
                {t('check.review')} <RiArrowRightLine aria-hidden="true" />
              </Button>
            )}
          </li>
        ))}
      </ul>
    )}
    <div className="privacy-card">
      <strong>{t('check.privacyTitle')}</strong>
      <p>{t('check.privacyText')}</p>
    </div>
    <div className="print-guidance">
      <h3>{t('check.beforePdf')}</h3>
      <ol><li>{t('check.pdfStep1')}</li><li>{t('check.pdfStep2')}</li><li>{t('check.pdfStep3')}</li></ol>
    </div>
    <Button type="button" size="lg" className="check-export" onClick={onPrint}><RiDownload2Line aria-hidden="true" /> {t('check.openPrint')}</Button>
  </div>
}
