import { RiAddLine, RiDeleteBinLine } from '@remixicon/react'
import { usePreferences } from '../../app/usePreferences'
import { Button } from '../../components/ui/button'
import { TextAreaField } from './fields'

interface HighlightsEditorProps {
  values: string[]
  onChange: (values: string[]) => void
  label?: string
  maxEntries: number
}

export const HighlightsEditor = ({ values, onChange, label, maxEntries }: HighlightsEditorProps) => {
  const { t } = usePreferences()
  const itemLabel = label ?? t('highlights.outcome')
  const updateAt = (index: number, value: string): void => {
    const next = [...values]
    next[index] = value
    onChange(next)
  }
  const removeAt = (index: number): void => { onChange(values.filter((_, itemIndex) => itemIndex !== index)) }

  return (
    <fieldset className="highlights-editor">
      <legend>{t('highlights.legend')}</legend>
      <p className="field-help">{t('highlights.help')}</p>
      {values.map((value, index) => (
        <div className="highlight-row" key={`${itemLabel}-${index}`}>
          <TextAreaField label={`${itemLabel} ${index + 1}`} value={value} rows={3} onChange={(next) => { updateAt(index, next) }} />
          <Button type="button" variant="destructive" size="icon" onClick={() => { removeAt(index) }} aria-label={t('highlights.remove', { label: itemLabel, number: index + 1 })} title={t('highlights.removeTitle')}>
            <RiDeleteBinLine aria-hidden="true" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" className="add-outcome" disabled={values.length >= maxEntries} onClick={() => { if (values.length < maxEntries) onChange([...values, '']) }}>
        <RiAddLine aria-hidden="true" /> {t('highlights.add')}
      </Button>
    </fieldset>
  )
}
