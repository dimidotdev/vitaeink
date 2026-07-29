import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { blankLanguage } from '../../../domain/factories'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { TextField } from '../fields'

interface LanguagesEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const LanguagesEditor = ({ document, update }: LanguagesEditorProps) => (
  <div className="editor-stack">
    <div className="editor-heading"><p className="eyebrow">Communication</p><h2>Languages</h2><p>Use a recognizable proficiency description such as Native, Professional, or B2.</p></div>
    {document.languages.map((entry, index) => (
      <div className="entry-card entry-card-body" key={entry.id}>
        <div className="field-grid two-columns">
          <TextField label="Language" value={entry.name} onChange={(value) => { update((draft) => { const item = draft.languages[index]; if (item) item.name = value }) }} />
          <TextField label="Proficiency" value={entry.level} placeholder="Professional working proficiency" onChange={(value) => { update((draft) => { const item = draft.languages[index]; if (item) item.level = value }) }} />
        </div>
        <EntryActions label={entry.name || `language ${index + 1}`} index={index} total={document.languages.length} onMove={(direction) => { update((draft) => { moveEntry(draft.languages, index, direction) }) }} onDelete={() => { update((draft) => { draft.languages.splice(index, 1) }) }} />
      </div>
    ))}
    <button type="button" className="button button-secondary add-entry" disabled={document.languages.length >= RESUME_LIMITS.languages} onClick={() => { update((draft) => { if (draft.languages.length < RESUME_LIMITS.languages) draft.languages.push(blankLanguage()) }) }}>Add language</button>
  </div>
)
