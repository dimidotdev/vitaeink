import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { blankCertification } from '../../../domain/factories'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EditableDetails } from '../EditableDetails'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { TextField } from '../fields'

interface CertificationsEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const CertificationsEditor = ({ document, update }: CertificationsEditorProps) => (
  <div className="editor-stack">
    <div className="editor-heading"><p className="eyebrow">Verifiable learning</p><h2>Certifications</h2><p>Include the issuer and credential URL when they help a reviewer verify the claim.</p></div>
    {document.certifications.map((entry, index) => (
      <EditableDetails key={entry.id} title={entry.name || 'New certification'} subtitle={entry.issuer || 'Issuer'} defaultOpen={index === 0}>
        <div className="entry-card-body">
          <div className="field-grid two-columns">
            <TextField label="Certification" value={entry.name} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.name = value }) }} />
            <TextField label="Issuer" value={entry.issuer} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.issuer = value }) }} />
            <TextField label="Issue date" type="month" value={entry.date} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.date = value }) }} />
            <TextField label="Credential ID" value={entry.credentialId} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.credentialId = value }) }} />
          </div>
          <TextField label="Credential URL" value={entry.url} type="url" inputMode="url" maxLength={RESUME_LIMITS.url} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.url = value }) }} />
          <EntryActions label={entry.name || `certification ${index + 1}`} index={index} total={document.certifications.length} onMove={(direction) => { update((draft) => { moveEntry(draft.certifications, index, direction) }) }} onDelete={() => { update((draft) => { draft.certifications.splice(index, 1) }) }} />
        </div>
      </EditableDetails>
    ))}
    <button type="button" className="button button-secondary add-entry" disabled={document.certifications.length >= RESUME_LIMITS.certifications} onClick={() => { update((draft) => { if (draft.certifications.length < RESUME_LIMITS.certifications) draft.certifications.push(blankCertification()) }) }}>Add certification</button>
  </div>
)
