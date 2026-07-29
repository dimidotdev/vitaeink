import { RiAddLine } from '@remixicon/react'
import { usePreferences } from '../../../app/usePreferences'
import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { Button } from '../../../components/ui/button'
import { blankLanguage } from '../../../domain/factories'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { TextField } from '../fields'

interface LanguagesEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const LanguagesEditor = ({ document, update }: LanguagesEditorProps) => {
  const { t } = usePreferences()

  return <div className="editor-stack">
    <div className="editor-heading"><p className="eyebrow">{t('languages.eyebrow')}</p><h2>{t('languages.title')}</h2><p>{t('languages.description')}</p></div>
    {document.languages.map((entry, index) => (
      <div className="entry-card entry-card-body" key={entry.id}>
        <div className="field-grid two-columns">
          <TextField label={t('languages.name')} value={entry.name} onChange={(value) => { update((draft) => { const item = draft.languages[index]; if (item) item.name = value }) }} />
          <TextField label={t('languages.proficiency')} value={entry.level} placeholder={t('languages.proficiencyPlaceholder')} onChange={(value) => { update((draft) => { const item = draft.languages[index]; if (item) item.level = value }) }} />
        </div>
        <EntryActions label={entry.name || t('languages.fallback', { number: index + 1 })} index={index} total={document.languages.length} onMove={(direction) => { update((draft) => { moveEntry(draft.languages, index, direction) }) }} onDelete={() => { update((draft) => { draft.languages.splice(index, 1) }) }} />
      </div>
    ))}
    <Button type="button" variant="outline" size="lg" className="add-entry" disabled={document.languages.length >= RESUME_LIMITS.languages} onClick={() => { update((draft) => { if (draft.languages.length < RESUME_LIMITS.languages) draft.languages.push(blankLanguage()) }) }}><RiAddLine aria-hidden="true" /> {t('languages.add')}</Button>
  </div>
}
