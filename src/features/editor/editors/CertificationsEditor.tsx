import { RiAddLine } from '@remixicon/react'
import { usePreferences } from '../../../app/usePreferences'
import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { Button } from '../../../components/ui/button'
import { blankCertification } from '../../../domain/factories'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EditableDetails } from '../EditableDetails'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { TextField } from '../fields'

interface CertificationsEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const CertificationsEditor = ({ document, update }: CertificationsEditorProps) => {
  const { t } = usePreferences()

  return <div className="editor-stack">
    <div className="editor-heading"><p className="eyebrow">{t('certifications.eyebrow')}</p><h2>{t('certifications.title')}</h2><p>{t('certifications.description')}</p></div>
    {document.certifications.map((entry, index) => (
      <EditableDetails key={entry.id} title={entry.name || t('certifications.new')} subtitle={entry.issuer || t('certifications.issuer')} defaultOpen={index === 0}>
        <div className="entry-card-body">
          <div className="field-grid two-columns">
            <TextField label={t('certifications.name')} value={entry.name} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.name = value }) }} />
            <TextField label={t('certifications.issuer')} value={entry.issuer} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.issuer = value }) }} />
            <TextField label={t('certifications.date')} type="month" value={entry.date} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.date = value }) }} />
            <TextField label={t('certifications.id')} value={entry.credentialId} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.credentialId = value }) }} />
          </div>
          <TextField label={t('certifications.url')} value={entry.url} type="url" inputMode="url" maxLength={RESUME_LIMITS.url} onChange={(value) => { update((draft) => { const item = draft.certifications[index]; if (item) item.url = value }) }} />
          <EntryActions label={entry.name || t('certifications.fallback', { number: index + 1 })} index={index} total={document.certifications.length} onMove={(direction) => { update((draft) => { moveEntry(draft.certifications, index, direction) }) }} onDelete={() => { update((draft) => { draft.certifications.splice(index, 1) }) }} />
        </div>
      </EditableDetails>
    ))}
    <Button type="button" variant="outline" size="lg" className="add-entry" disabled={document.certifications.length >= RESUME_LIMITS.certifications} onClick={() => { update((draft) => { if (draft.certifications.length < RESUME_LIMITS.certifications) draft.certifications.push(blankCertification()) }) }}><RiAddLine aria-hidden="true" /> {t('certifications.add')}</Button>
  </div>
}
