import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { TextAreaField, TextField } from '../fields'

interface ProfileEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const ProfileEditor = ({ document, update }: ProfileEditorProps) => {
  const basics = document.basics
  return (
    <div className="editor-stack">
      <div className="editor-heading">
        <p className="eyebrow">Identity and positioning</p>
        <h2>Profile</h2>
        <p>Make the role you want, your technical focus, and your contact details immediately clear.</p>
      </div>
      <div className="field-grid two-columns">
        <TextField label="Full name" name="full-name" value={basics.name} autoComplete="name" onChange={(value) => { update((draft) => { draft.basics.name = value }) }} />
        <TextField label="Professional headline" value={basics.headline} placeholder="Software Engineer · Java & React" onChange={(value) => { update((draft) => { draft.basics.headline = value }) }} />
        <TextField label="Email" name="email" value={basics.email} type="email" inputMode="email" autoComplete="email" maxLength={RESUME_LIMITS.email} onChange={(value) => { update((draft) => { draft.basics.email = value }) }} />
        <TextField label="Phone" name="phone" value={basics.phone} type="tel" inputMode="tel" autoComplete="tel" onChange={(value) => { update((draft) => { draft.basics.phone = value }) }} />
        <TextField label="Location" value={basics.location} autoComplete="address-level2" placeholder="City, country · Remote" onChange={(value) => { update((draft) => { draft.basics.location = value }) }} />
        <TextField label="Website" name="website" value={basics.website} type="url" inputMode="url" maxLength={RESUME_LIMITS.url} placeholder="https://your-site.com" onChange={(value) => { update((draft) => { draft.basics.website = value }) }} />
      </div>
      <TextAreaField
        label="Professional profile"
        value={basics.summary}
        rows={6}
        help="Use 2–4 sentences. Connect your target role, strongest stack, context, and evidence."
        onChange={(value) => { update((draft) => { draft.basics.summary = value }) }}
      />
      <fieldset className="collection-fieldset">
        <legend>Additional links</legend>
        {basics.links.map((link, index) => (
          <div className="entry-card compact-entry" key={link.id}>
            <div className="field-grid two-columns">
              <TextField label="Visible label" value={link.label} placeholder="github.com/you" onChange={(value) => { update((draft) => { const item = draft.basics.links[index]; if (item) item.label = value }) }} />
              <TextField label="Complete URL" value={link.url} type="url" inputMode="url" maxLength={RESUME_LIMITS.url} placeholder="https://github.com/you" onChange={(value) => { update((draft) => { const item = draft.basics.links[index]; if (item) item.url = value }) }} />
            </div>
            <EntryActions
              label={link.label || `link ${index + 1}`}
              index={index}
              total={basics.links.length}
              onMove={(direction) => { update((draft) => { moveEntry(draft.basics.links, index, direction) }) }}
              onDelete={() => { update((draft) => { draft.basics.links.splice(index, 1) }) }}
            />
          </div>
        ))}
        <button type="button" className="button button-secondary" disabled={basics.links.length >= RESUME_LIMITS.links} onClick={() => { update((draft) => { if (draft.basics.links.length < RESUME_LIMITS.links) draft.basics.links.push({ id: `link-${crypto.randomUUID()}`, label: '', url: '' }) }) }}>
          Add link
        </button>
      </fieldset>
    </div>
  )
}
