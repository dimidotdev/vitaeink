import { useEffect, useRef, useState } from 'react'
import { RiAddLine } from '@remixicon/react'
import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { Button } from '../../../components/ui/button'
import { blankSkill } from '../../../domain/factories'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { TextField } from '../fields'

interface SkillsEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

const splitKeywords = (value: string): string[] => value.split(',').map((item) => item.trim().slice(0, RESUME_LIMITS.shortText)).filter(Boolean).slice(0, RESUME_LIMITS.skillKeywords)

interface SkillKeywordsFieldProps {
  entryId: string
  keywords: string[]
  onChange: (keywords: string[]) => void
}

const SkillKeywordsField = ({ entryId, keywords, onChange }: SkillKeywordsFieldProps) => {
  const serialized = keywords.join(', ')
  const [draft, setDraft] = useState(serialized)
  const editing = useRef(false)

  useEffect(() => {
    if (!editing.current) setDraft(serialized)
  }, [entryId, serialized])

  return (
    <TextField
      label="Skills, separated by commas"
      value={draft}
      placeholder="Java, Spring Boot, PostgreSQL"
      maxLength={(RESUME_LIMITS.shortText + 2) * RESUME_LIMITS.skillKeywords}
      onFocus={() => { editing.current = true }}
      onBlur={() => { editing.current = false; setDraft(serialized) }}
      onChange={(value) => { setDraft(value); onChange(splitKeywords(value)) }}
    />
  )
}

export const SkillsEditor = ({ document, update }: SkillsEditorProps) => (
  <div className="editor-stack">
    <div className="editor-heading"><p className="eyebrow">Searchable vocabulary</p><h2>Skills</h2><p>Group factual technologies and practices. Avoid ratings, bars, and vague soft-skill lists.</p></div>
    {document.skills.map((entry, index) => (
      <div className="entry-card entry-card-body" key={entry.id}>
        <div className="field-grid skill-grid">
          <TextField label="Category" value={entry.name} placeholder="Backend" onChange={(value) => { update((draft) => { const item = draft.skills[index]; if (item) item.name = value }) }} />
          <SkillKeywordsField entryId={entry.id} keywords={entry.keywords} onChange={(keywords) => { update((draft) => { const item = draft.skills[index]; if (item) item.keywords = keywords }) }} />
        </div>
        <EntryActions label={entry.name || `skill group ${index + 1}`} index={index} total={document.skills.length} onMove={(direction) => { update((draft) => { moveEntry(draft.skills, index, direction) }) }} onDelete={() => { update((draft) => { draft.skills.splice(index, 1) }) }} />
      </div>
    ))}
    <Button type="button" variant="outline" size="lg" className="add-entry" disabled={document.skills.length >= RESUME_LIMITS.skills} onClick={() => { update((draft) => { if (draft.skills.length < RESUME_LIMITS.skills) draft.skills.push(blankSkill()) }) }}><RiAddLine aria-hidden="true" /> Add skill group</Button>
  </div>
)
