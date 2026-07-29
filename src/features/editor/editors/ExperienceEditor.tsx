import { RiAddLine } from '@remixicon/react'
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

export const ExperienceEditor = ({ document, update }: ExperienceEditorProps) => (
  <div className="editor-stack">
    <div className="editor-heading">
      <p className="eyebrow">Evidence over adjectives</p>
      <h2>Experience</h2>
      <p>Freelance and sustained project work belong here when they represent real professional practice.</p>
    </div>
    {document.experience.map((entry, index) => (
      <EditableDetails key={entry.id} title={entry.role || 'New role'} subtitle={entry.company || 'Organization'} defaultOpen={index === 0}>
        <div className="entry-card-body">
          <div className="field-grid two-columns">
            <TextField label="Role" value={entry.role} onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.role = value }) }} />
            <TextField label="Organization" value={entry.company} onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.company = value }) }} />
            <TextField label="Location" value={entry.location} placeholder="Remote from Brazil" onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.location = value }) }} />
            <span />
            <TextField label="Start" type="month" value={entry.startDate} onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.startDate = value }) }} />
            <TextField label="End" type="month" value={entry.endDate} onChange={(value) => { update((draft) => { const item = draft.experience[index]; if (item) item.endDate = value }) }} />
          </div>
          <CheckboxField label="I currently work here" checked={entry.current} onChange={(checked) => { update((draft) => { const item = draft.experience[index]; if (item) { item.current = checked; if (checked) item.endDate = '' } }) }} />
          <HighlightsEditor values={entry.highlights} maxEntries={RESUME_LIMITS.experienceHighlights} onChange={(values) => { update((draft) => { const item = draft.experience[index]; if (item) item.highlights = values }) }} />
          <EntryActions
            label={entry.role || `experience ${index + 1}`}
            index={index}
            total={document.experience.length}
            onMove={(direction) => { update((draft) => { moveEntry(draft.experience, index, direction) }) }}
            onDelete={() => { update((draft) => { draft.experience.splice(index, 1) }) }}
          />
        </div>
      </EditableDetails>
    ))}
    <Button type="button" variant="outline" size="lg" className="add-entry" disabled={document.experience.length >= RESUME_LIMITS.experience} onClick={() => { update((draft) => { if (draft.experience.length < RESUME_LIMITS.experience) draft.experience.push(blankExperience()) }) }}>
      <RiAddLine aria-hidden="true" /> Add experience
    </Button>
  </div>
)
