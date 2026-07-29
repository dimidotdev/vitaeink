import { RiAddLine } from '@remixicon/react'
import { usePreferences } from '../../../app/usePreferences'
import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { Button } from '../../../components/ui/button'
import { blankEducation } from '../../../domain/factories'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EditableDetails } from '../EditableDetails'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { CheckboxField, TextField } from '../fields'
import { HighlightsEditor } from '../HighlightsEditor'

interface EducationEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const EducationEditor = ({ document, update }: EducationEditorProps) => {
  const { t } = usePreferences()

  return <div className="editor-stack">
    <div className="editor-heading"><p className="eyebrow">{t('education.eyebrow')}</p><h2>{t('education.title')}</h2><p>{t('education.description')}</p></div>
    {document.education.map((entry, index) => (
      <EditableDetails key={entry.id} title={entry.degree || t('education.new')} subtitle={entry.institution || t('education.institution')} defaultOpen={index === 0}>
        <div className="entry-card-body">
          <div className="field-grid two-columns">
            <TextField label={t('education.institution')} value={entry.institution} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.institution = value }) }} />
            <TextField label={t('education.degree')} value={entry.degree} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.degree = value }) }} />
            <TextField label={t('education.field')} value={entry.field} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.field = value }) }} />
            <TextField label={t('education.location')} value={entry.location} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.location = value }) }} />
            <TextField label={t('education.start')} type="month" value={entry.startDate} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.startDate = value }) }} />
            <TextField label={t('education.end')} type="month" value={entry.endDate} onChange={(value) => { update((draft) => { const item = draft.education[index]; if (item) item.endDate = value }) }} />
          </div>
          <CheckboxField label={t('education.current')} checked={entry.current} onChange={(checked) => { update((draft) => { const item = draft.education[index]; if (item) { item.current = checked; if (checked) item.endDate = '' } }) }} />
          <HighlightsEditor label={t('education.detail')} values={entry.highlights} maxEntries={RESUME_LIMITS.educationHighlights} onChange={(values) => { update((draft) => { const item = draft.education[index]; if (item) item.highlights = values }) }} />
          <EntryActions label={entry.degree || t('education.fallback', { number: index + 1 })} index={index} total={document.education.length} onMove={(direction) => { update((draft) => { moveEntry(draft.education, index, direction) }) }} onDelete={() => { update((draft) => { draft.education.splice(index, 1) }) }} />
        </div>
      </EditableDetails>
    ))}
    <Button type="button" variant="outline" size="lg" className="add-entry" disabled={document.education.length >= RESUME_LIMITS.education} onClick={() => { update((draft) => { if (draft.education.length < RESUME_LIMITS.education) draft.education.push(blankEducation()) }) }}><RiAddLine aria-hidden="true" /> {t('education.add')}</Button>
  </div>
}
