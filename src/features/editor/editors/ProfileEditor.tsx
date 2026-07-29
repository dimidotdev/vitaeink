import { RiAddLine } from '@remixicon/react'
import { usePreferences } from '../../../app/usePreferences'
import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { Button } from '../../../components/ui/button'
import { RESUME_LIMITS, type ResumeDocument } from '../../../domain/resume'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { TextAreaField, TextField } from '../fields'

interface ProfileEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

export const ProfileEditor = ({ document, update }: ProfileEditorProps) => {
  const { t } = usePreferences()
  const basics = document.basics
  return (
    <div className="editor-stack">
      <div className="editor-heading">
        <p className="eyebrow">{t('profile.eyebrow')}</p>
        <h2>{t('profile.title')}</h2>
        <p>{t('profile.description')}</p>
      </div>
      <div className="field-grid two-columns">
        <TextField label={t('profile.fullName')} name="full-name" value={basics.name} autoComplete="name" onChange={(value) => { update((draft) => { draft.basics.name = value }) }} />
        <TextField label={t('profile.headline')} value={basics.headline} placeholder={t('profile.headlinePlaceholder')} onChange={(value) => { update((draft) => { draft.basics.headline = value }) }} />
        <TextField label={t('profile.email')} name="email" value={basics.email} type="email" inputMode="email" autoComplete="email" maxLength={RESUME_LIMITS.email} onChange={(value) => { update((draft) => { draft.basics.email = value }) }} />
        <TextField label={t('profile.phone')} name="phone" value={basics.phone} type="tel" inputMode="tel" autoComplete="tel" onChange={(value) => { update((draft) => { draft.basics.phone = value }) }} />
        <TextField label={t('profile.location')} value={basics.location} autoComplete="address-level2" placeholder={t('profile.locationPlaceholder')} onChange={(value) => { update((draft) => { draft.basics.location = value }) }} />
        <TextField label={t('profile.website')} name="website" value={basics.website} type="url" inputMode="url" maxLength={RESUME_LIMITS.url} placeholder={t('profile.websitePlaceholder')} onChange={(value) => { update((draft) => { draft.basics.website = value }) }} />
      </div>
      <TextAreaField
        label={t('profile.summary')}
        value={basics.summary}
        rows={6}
        help={t('profile.summaryHelp')}
        onChange={(value) => { update((draft) => { draft.basics.summary = value }) }}
      />
      <fieldset className="collection-fieldset">
        <legend>{t('profile.links')}</legend>
        {basics.links.map((link, index) => (
          <div className="entry-card compact-entry" key={link.id}>
            <div className="field-grid two-columns">
              <TextField label={t('profile.visibleLabel')} value={link.label} placeholder={t('profile.visibleLabelPlaceholder')} onChange={(value) => { update((draft) => { const item = draft.basics.links[index]; if (item) item.label = value }) }} />
              <TextField label={t('profile.completeUrl')} value={link.url} type="url" inputMode="url" maxLength={RESUME_LIMITS.url} placeholder={t('profile.completeUrlPlaceholder')} onChange={(value) => { update((draft) => { const item = draft.basics.links[index]; if (item) item.url = value }) }} />
            </div>
            <EntryActions
              label={link.label || t('profile.linkFallback', { number: index + 1 })}
              index={index}
              total={basics.links.length}
              onMove={(direction) => { update((draft) => { moveEntry(draft.basics.links, index, direction) }) }}
              onDelete={() => { update((draft) => { draft.basics.links.splice(index, 1) }) }}
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="lg" className="add-entry" disabled={basics.links.length >= RESUME_LIMITS.links} onClick={() => { update((draft) => { if (draft.basics.links.length < RESUME_LIMITS.links) draft.basics.links.push({ id: `link-${crypto.randomUUID()}`, label: '', url: '' }) }) }}>
          <RiAddLine aria-hidden="true" /> {t('profile.addLink')}
        </Button>
      </fieldset>
    </div>
  )
}
