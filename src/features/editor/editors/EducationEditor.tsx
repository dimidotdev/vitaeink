import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { blankEducation } from '../../../domain/factories'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EditableDetails } from '../EditableDetails'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { CheckboxField, TextField } from '../fields'
import { HighlightsEditor } from '../HighlightsEditor'

interface EducationEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const EducationEditor = ({ document, update }: EducationEditorProps) => (
  <div className="editor-stack">
    <div className="editor-heading"><p className="eyebrow">Formal learning</p><h2>Education</h2><p>List the credential, field, institution, and dates in a conventional order.</p></div>
    {document.education.map((entry, index) => (
      <EditableDetails key={entry.id} title={entry.degree || 'New education'} subtitle={entry.institution || 'Institution'} defaultOpen={index === 0}>
        <div className="entry-card-body">
          <div className="field-grid two-columns">
            <TextField label="Institution" value={entry.institution} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.institution = value }) }} />
            <TextField label="Degree" value={entry.degree} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.degree = value }) }} />
            <TextField label="Field of study" value={entry.field} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.field = value }) }} />
            <TextField label="Location" value={entry.location} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.location = value }) }} />
            <TextField label="Start" type="month" value={entry.startDate} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.startDate = value }) }} />
            <TextField label="End" type="month" value={entry.endDate} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.endDate = value }) }} />
          </div>
          <CheckboxField label="I am currently studying here" checked={entry.current} onChange={(checked) => { update((draft) => { const item = draft.education[index]; if (item) { item.current = checked; if (checked) item.endDate = '' } }) }} />
          <HighlightsEditor label="Detail" values={entry.highlights} maxEntries={RESUME_LIMITS.educationHighlights} onChange={(values) => { update((draft) => { const item = draft.education[index]; if (item) item.highlights = values }) }} />
          <EntryActions label={entry.degree || `education ${index + 1}`} index={index} total={document.education.length} onMove={(direction) => { update((draft) => { moveEntry(draft.education, index, direction) }) }} onDelete={() => { update((draft) => { draft.education.splice(index, 1) }) }} />
        </div>
      </EditableDetails>
    ))}
    <button type="button" className="button button-secondary add-entry" disabled={document.education.length >= RESUME_LIMITS.education} onClick={() => { update((draft) => { if (draft.education.length < RESUME_LIMITS.education) draft.education.push(blankEducation()) }) }}>Add education</button>
  </div>
)
