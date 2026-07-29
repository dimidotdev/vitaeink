import { RiRestartLine } from '@remixicon/react'
import type { DocumentUpdater } from '../../../app/useResumeDocument'
import { Button } from '../../../components/ui/button'
import { contrastOnWhite } from '../../../domain/documentChecks'
import { defaultSettings } from '../../../domain/factories'
import { sectionLabel } from '../../../domain/presentation'
import type { ResumeDocument, SectionKey } from '../../../domain/resume'
import { EntryActions } from '../EntryActions'
import { moveEntry } from '../editorUtils'
import { CheckboxField, RangeField, SelectField } from '../fields'

interface AppearanceEditorProps { document: ResumeDocument; update: (updater: DocumentUpdater) => void }

const TEMPLATE_OPTIONS = [
  { value: 'essential', label: 'Essential', detail: 'Neutral, direct, and spacious.' },
  { value: 'editorial', label: 'Editorial', detail: 'Serif-led, composed, and human.' },
  { value: 'compact', label: 'Compact', detail: 'Dense without sacrificing hierarchy.' },
] as const

const SECTION_NAMES: Record<SectionKey, string> = {
  profile: 'Profile', experience: 'Experience', projects: 'Projects', education: 'Education',
  certifications: 'Certifications', skills: 'Skills', languages: 'Languages',
}

export const AppearanceEditor = ({ document, update }: AppearanceEditorProps) => {
  const { settings } = document
  const contrast = contrastOnWhite(settings.accent)
  return (
    <div className="editor-stack">
      <div className="editor-heading"><p className="eyebrow">Calm by default</p><h2>Design</h2><p>Every option preserves a single-column reading order and real text for ATS tools.</p></div>
      <fieldset className="template-picker">
        <legend>Template</legend>
        {TEMPLATE_OPTIONS.map((option) => (
          <label key={option.value} className={settings.template === option.value ? 'template-option selected' : 'template-option'}>
            <input type="radio" name="template" value={option.value} checked={settings.template === option.value} onChange={() => { update((draft) => { draft.settings.template = option.value }) }} />
            <span><strong>{option.label}</strong><small>{option.detail}</small></span>
          </label>
        ))}
      </fieldset>
      <div className="field-grid two-columns">
        <SelectField label="Typeface" value={settings.font} options={[
          { value: 'inter', label: 'Inter' }, { value: 'ibm-plex', label: 'IBM Plex Sans' }, { value: 'source-serif', label: 'Source Serif 4' },
        ]} onChange={(value) => { update((draft) => { draft.settings.font = value as ResumeDocument['settings']['font'] }) }} />
        <SelectField label="Spacing" value={settings.density} options={[
          { value: 'compact', label: 'Compact' }, { value: 'balanced', label: 'Balanced' }, { value: 'spacious', label: 'Spacious' },
        ]} onChange={(value) => { update((draft) => { draft.settings.density = value as ResumeDocument['settings']['density'] }) }} />
        <SelectField label="Paper" value={settings.pageSize} options={[{ value: 'A4', label: 'A4' }, { value: 'Letter', label: 'US Letter' }]} onChange={(value) => { update((draft) => { draft.settings.pageSize = value as ResumeDocument['settings']['pageSize'] }) }} />
        <SelectField label="Resume language" value={settings.locale} options={[{ value: 'en', label: 'English' }, { value: 'pt-BR', label: 'Português (Brasil)' }]} onChange={(value) => { update((draft) => { draft.settings.locale = value as ResumeDocument['settings']['locale'] }) }} />
      </div>
      <RangeField label="Text size" value={settings.fontSize} min={9} max={13} step={0.25} suffix=" pt" onChange={(value) => { update((draft) => { draft.settings.fontSize = value }) }} />
      <RangeField label="Line height" value={settings.lineHeight} min={1.2} max={1.7} step={0.05} onChange={(value) => { update((draft) => { draft.settings.lineHeight = value }) }} />
      <div className="color-setting">
        <label htmlFor="accent-color">Accent color</label>
        <div><input id="accent-color" type="color" value={settings.accent} onChange={(event) => { update((draft) => { draft.settings.accent = event.target.value }) }} /><code>{settings.accent.toUpperCase()}</code></div>
        <p className={contrast >= 4.5 ? 'contrast-pass' : 'contrast-fail'}>{contrast.toFixed(1)}:1 contrast on white · {contrast >= 4.5 ? 'AA pass' : 'choose a darker color'}</p>
      </div>
      <fieldset className="collection-fieldset section-order">
        <legend>Section order and visibility</legend>
        {settings.sectionOrder.map((section, index) => (
          <div className="section-order-row" key={section}>
            <CheckboxField label={SECTION_NAMES[section]} checked={!settings.hiddenSections.includes(section)} onChange={(visible) => { update((draft) => { draft.settings.hiddenSections = visible ? draft.settings.hiddenSections.filter((item) => item !== section) : [...new Set([...draft.settings.hiddenSections, section])] }) }} />
            <EntryActions label={sectionLabel(section, settings.locale)} index={index} total={settings.sectionOrder.length} onMove={(direction) => { update((draft) => { moveEntry(draft.settings.sectionOrder, index, direction) }) }} onDelete={() => { update((draft) => { draft.settings.hiddenSections = [...new Set([...draft.settings.hiddenSections, section])] }) }} />
          </div>
        ))}
      </fieldset>
      <Button type="button" variant="ghost" size="lg" className="reset-design" onClick={() => { if (window.confirm('Reset all design settings? Your content will not change.')) update((draft) => { draft.settings = defaultSettings() }) }}><RiRestartLine aria-hidden="true" /> Reset design settings</Button>
    </div>
  )
}
