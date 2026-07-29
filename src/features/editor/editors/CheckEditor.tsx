import type { DocumentIssue } from '../../../domain/documentChecks'
import type { EditorSection } from '../../../components/SectionNav'

interface CheckEditorProps {
  issues: DocumentIssue[]
  pageCount: number
  onSelect: (section: EditorSection) => void
  onPrint: () => void
}

export const CheckEditor = ({ issues, pageCount, onSelect, onPrint }: CheckEditorProps) => (
  <div className="editor-stack document-check">
    <div className="editor-heading">
      <p className="eyebrow">A careful second look</p>
      <h2>Document check</h2>
      <p>These are practical checks, not an invented “ATS score.” No tool can guarantee every employer’s parser.</p>
    </div>
    <div className="check-summary" role="status">
      <strong>{issues.length === 0 ? 'Ready for a human review' : `${issues.length} finding${issues.length === 1 ? '' : 's'} to review`}</strong>
      <span>Estimated length: {pageCount} page{pageCount === 1 ? '' : 's'}</span>
    </div>
    {issues.length > 0 && (
      <ul className="issue-list">
        {issues.map((issue) => (
          <li key={issue.id} className={`issue issue-${issue.level}`}>
            <div><span>{issue.level}</span><strong>{issue.title}</strong><p>{issue.detail}</p></div>
            {issue.section !== 'document' && (
              <button type="button" className="button button-quiet" onClick={() => { if (issue.section !== 'document') onSelect(issue.section) }}>
                Review section
              </button>
            )}
          </li>
        ))}
      </ul>
    )}
    <div className="privacy-card">
      <strong>Your resume never leaves this device.</strong>
      <p>VitaeInk has no account, analytics, cloud database, or external font requests. Download a JSON backup before clearing browser storage.</p>
    </div>
    <div className="print-guidance">
      <h3>Before saving the PDF</h3>
      <ol><li>Choose “Save as PDF” in the print dialog.</li><li>Disable browser headers and footers.</li><li>Keep scale at 100% and use the selected paper size.</li></ol>
    </div>
    <button type="button" className="button button-primary check-export" onClick={onPrint}>Open print dialog</button>
  </div>
)
