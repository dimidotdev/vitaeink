import { RiAddLine } from '@remixicon/react'
import { usePreferences } from '../../../app/usePreferences'
import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { Button } from '../../../components/ui/button'
import { blankExperience } from '../../../domain/factories'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EditableDetails } from '../EditableDetails'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { CheckboxField, TextField } from '../fields'
import { HighlightsEditor } from '../HighlightsEditor'

interface ExperienceEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const ExperienceEditor = ({ document, update }: ExperienceEditorProps) => {
  const { t } = usePreferences()

  return <div className="editor-stack">
    <div className="editor-heading">
      <p className="eyebrow">{t('experience.eyebrow')}</p>
      <h2>{t('experience.title')}</h2>
      <p>{t('experience.description')}</p>
    </div>
    {document.experience.map((entry, index) => (
      <EditableDetails key={entry.id} title={entry.role || t('experience.newRole')} subtitle={entry.company || t('experience.organization')} defaultOpen={index === 0}>
        <div className="entry-card-body">
          <div className="field-grid two-columns">
            <TextField label={t('experience.role')} value={entry.role} onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.role = value }) }} />
            <TextField label={t('experience.organization')} value={entry.company} onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.company = value }) }} />
            <TextField label={t('experience.location')} value={entry.location} placeholder={t('experience.locationPlaceholder')} onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.location = value }) }} />
            <span />
            <TextField label={t('experience.start')} type="month" value={entry.startDate} onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.startDate = value }) }} />
            <TextField label={t('experience.end')} type="month" value={entry.endDate} onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.endDate = value }) }} />
          </div>
          <CheckboxField label={t('experience.current')} checked={entry.current} onChange={(checked) => { update((draft) => { const item = draft.experience[index]; if (item) { item.current = checked; if (checked) item.endDate = '' } }) }} />
          <HighlightsEditor values={entry.highlights} maxEntries={RESUME_LIMITS.experienceHighlights} onChange={(values) => { update((draft) => { const item = draft.experience[index]; if (item) item.highlights = values }) }} />
          <EntryActions
            label={entry.role || t('experience.fallback', { number: index + 1 })}
            index={index}
            total={document.experience.length}
            onMove={(direction) => { update((draft) => { moveEntry(draft.experience, index, direction) }) }}
            onDelete={() => { update((draft) => { draft.experience.splice(index, 1) }) }}
          />
        </div>
      </EditableDetails>
    ))}
    <Button type="button" variant="outline" size="lg" className="add-entry" disabled={document.experience.length >= RESUME_LIMITS.experience} onClick={() => { update((draft) => { if (draft.experience.length < RESUME_LIMITS.experience) draft.experience.push(blankExperience()) }) }}>
      <RiAddLine aria-hidden="true" /> {t('experience.add')}
    </Button>
  </div>
}
