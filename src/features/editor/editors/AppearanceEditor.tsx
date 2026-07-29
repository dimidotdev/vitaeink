import { RiRestartLine } from '@remixicon/react'
import { usePreferences } from '../../../app/usePreferences'
import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { Button } from '../../../components/ui/button'
import { contrastOnWhite } from '../../../domain/documentChecks'
import { defaultSettings } from '../../../domain/factories'
import type { ResumeDocument, SectionKey } from '../../../domain/resume'
import type { MessageKey } from '../../../i18n/messages'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { CheckboxField, RangeField, SelectField } from '../fields'

interface AppearanceEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

const TEMPLATE_OPTIONS = [
  { value: 'essential', labelKey: 'appearance.template.essential', detailKey: 'appearance.template.essentialDetail' },
  { value: 'editorial', labelKey: 'appearance.template.editorial', detailKey: 'appearance.template.editorialDetail' },
  { value: 'compact', labelKey: 'appearance.template.compact', detailKey: 'appearance.template.compactDetail' },
] as const

const SECTION_NAMES: Record<SectionKey, MessageKey> = {
  profile: 'nav.profile', experience: 'nav.experience', projects: 'nav.projects', education: 'nav.education',
  certifications: 'nav.certifications', skills: 'nav.skills', languages: 'nav.languages',
}

export const AppearanceEditor = ({ document, update }: AppearanceEditorProps) => {
  const { t, uiLocale } = usePreferences()
  const { settings } = document
  const contrast = contrastOnWhite(settings.accent)
  return (
    <div className="editor-stack">
      <div className="editor-heading"><p className="eyebrow">{t('appearance.eyebrow')}</p><h2>{t('appearance.title')}</h2><p>{t('appearance.description')}</p></div>
      <fieldset className="template-picker">
        <legend>{t('appearance.template')}</legend>
        {TEMPLATE_OPTIONS.map((option) => (
          <label key={option.value} className={settings.template === option.value ? 'template-option selected' : 'template-option'}>
            <input type="radio" name="template" value={option.value} checked={settings.template === option.value} onChange={() => { update((draft) => { draft.settings.template = option.value }) }} />
            <span><strong>{t(option.labelKey)}</strong><small>{t(option.detailKey)}</small></span>
          </label>
        ))}
      </fieldset>
      <div className="field-grid two-columns">
        <SelectField label={t('appearance.typeface')} value={settings.font} options={[
          { value: 'inter', label: 'Inter' }, { value: 'ibm-plex', label: 'IBM Plex Sans' }, { value: 'source-serif', label: 'Source Serif 4' },
        ]} onChange={(value) => { update((draft) => { draft.settings.font = value as ResumeDocument['settings']['font'] }) }} />
        <SelectField label={t('appearance.spacing')} value={settings.density} options={[
          { value: 'compact', label: t('appearance.spacing.compact') }, { value: 'balanced', label: t('appearance.spacing.balanced') }, { value: 'spacious', label: t('appearance.spacing.spacious') },
        ]} onChange={(value) => { update((draft) => { draft.settings.density = value as ResumeDocument['settings']['density'] }) }} />
        <SelectField label={t('appearance.paper')} value={settings.pageSize} options={[{ value: 'A4', label: 'A4' }, { value: 'Letter', label: t('appearance.usLetter') }]} onChange={(value) => { update((draft) => { draft.settings.pageSize = value as ResumeDocument['settings']['pageSize'] }) }} />
        <SelectField label={t('appearance.resumeLanguage')} help={t('appearance.resumeLanguageHelp')} value={settings.locale} options={[{ value: 'en', label: t('language.en') }, { value: 'pt-BR', label: t('language.pt-BR') }]} onChange={(value) => { update((draft) => { draft.settings.locale = value as ResumeDocument['settings']['locale'] }) }} />
      </div>
      <RangeField label={t('appearance.textSize')} value={settings.fontSize} min={9} max={13} step={0.25} suffix=" pt" onChange={(value) => { update((draft) => { draft.settings.fontSize = value }) }} />
      <RangeField label={t('appearance.lineHeight')} value={settings.lineHeight} min={1.2} max={1.7} step={0.05} onChange={(value) => { update((draft) => { draft.settings.lineHeight = value }) }} />
      <div className="color-setting">
        <label htmlFor="accent-color">{t('appearance.accent')}</label>
        <div><input id="accent-color" type="color" value={settings.accent} onChange={(event) => { update((draft) => { draft.settings.accent = event.target.value }) }} /><code>{settings.accent.toUpperCase()}</code></div>
        <p className={contrast >= 4.5 ? 'contrast-pass' : 'contrast-fail'}>{t(contrast >= 4.5 ? 'appearance.contrastPass' : 'appearance.contrastFail', { ratio: new Intl.NumberFormat(uiLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(contrast) })}</p>
      </div>
      <fieldset className="collection-fieldset section-order">
        <legend>{t('appearance.sectionOrder')}</legend>
        {settings.sectionOrder.map((section, index) => (
          <div className="section-order-row" key={section}>
            <CheckboxField label={t(SECTION_NAMES[section])} checked={!settings.hiddenSections.includes(section)} onChange={(visible) => { update((draft) => { draft.settings.hiddenSections = visible ? draft.settings.hiddenSections.filter((item) => item !== section) : [...new Set([...draft.settings.hiddenSections, section])] }) }} />
            <EntryActions label={t(SECTION_NAMES[section])} index={index} total={settings.sectionOrder.length} onMove={(direction) => { update((draft) => { moveEntry(draft.settings.sectionOrder, index, direction) }) }} onDelete={() => { update((draft) => { draft.settings.hiddenSections = [...new Set([...draft.settings.hiddenSections, section])] }) }} />
          </div>
        ))}
      </fieldset>
      <Button type="button" variant="ghost" size="lg" className="reset-design" onClick={() => { if (window.confirm(t('appearance.resetConfirm'))) update((draft) => { draft.settings = defaultSettings() }) }}><RiRestartLine aria-hidden="true" /> {t('appearance.reset')}</Button>
    </div>
  )
}
