import { RiAddLine } from '@remixicon/react'
import { usePreferences } from '../../../app/usePreferences'
import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { Button } from '../../../components/ui/button'
import { blankProject } from '../../../domain/factories'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EditableDetails } from '../EditableDetails'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { CheckboxField, TextAreaField, TextField } from '../fields'
import { HighlightsEditor } from '../HighlightsEditor'

interface ProjectsEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const ProjectsEditor = ({ document, update }: ProjectsEditorProps) => {
  const { t } = usePreferences()

  return <div className="editor-stack">
    <div className="editor-heading">
      <p className="eyebrow">{t('projects.eyebrow')}</p>
      <h2>{t('projects.title')}</h2>
      <p>{t('projects.description')}</p>
    </div>
    {document.projects.map((entry, index) => (
      <EditableDetails key={entry.id} title={entry.name || t('projects.new')} subtitle={entry.role || t('projects.yourRole')} defaultOpen={index === 0}>
        <div className="entry-card-body">
          <div className="field-grid two-columns">
            <TextField label={t('projects.name')} value={entry.name} onChange={(value) => { update((draft) => { const item = draft.projects[index]; if (item) item.name = value }) }} />
            <TextField label={t('projects.yourRole')} value={entry.role} onChange={(value) => { update((draft) => { const item = draft.projects[index]; if (item) item.role = value }) }} />
            <TextField label={t('projects.url')} value={entry.url} type="url" inputMode="url" maxLength={RESUME_LIMITS.url} placeholder="https://github.com/…" onChange={(value) => { update((draft) => { const item = draft.projects[index]; if (item) item.url = value }) }} />
            <span />
            <TextField label={t('projects.start')} type="month" value={entry.startDate} onChange={(value) => { update((draft) => { const item = draft.projects[index]; if (item) item.startDate = value }) }} />
            <TextField label={t('projects.end')} type="month" value={entry.endDate} onChange={(value) => { update((draft) => { const item = draft.projects[index]; if (item) item.endDate = value }) }} />
          </div>
          <CheckboxField label={t('projects.ongoing')} checked={entry.current} onChange={(checked) => { update((draft) => { const item = draft.projects[index]; if (item) { item.current = checked; if (checked) item.endDate = '' } }) }} />
          <TextAreaField label={t('projects.summary')} value={entry.summary} rows={3} help={t('projects.summaryHelp')} onChange={(value) => { update((draft) => { const item = draft.projects[index]; if (item) item.summary = value }) }} />
          <HighlightsEditor values={entry.highlights} maxEntries={RESUME_LIMITS.projectHighlights} onChange={(values) => { update((draft) => { const item = draft.projects[index]; if (item) item.highlights = values }) }} />
          <EntryActions
            label={entry.name || t('projects.fallback', { number: index + 1 })}
            index={index}
            total={document.projects.length}
            onMove={(direction) => { update((draft) => { moveEntry(draft.projects, index, direction) }) }}
            onDelete={() => { update((draft) => { draft.projects.splice(index, 1) }) }}
          />
        </div>
      </EditableDetails>
    ))}
    <Button type="button" variant="outline" size="lg" className="add-entry" disabled={document.projects.length >= RESUME_LIMITS.projects} onClick={() => { update((draft) => { if (draft.projects.length < RESUME_LIMITS.projects) draft.projects.push(blankProject()) }) }}><RiAddLine aria-hidden="true" /> {t('projects.add')}</Button>
  </div>
}
