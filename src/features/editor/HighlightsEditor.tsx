import { RiAddLine, RiDeleteBinLine } from '@remixicon/react'
import { Button } from '../../components/ui/button'
import { TextAreaField } from './fields'

interface HighlightsEditorProps {
  values: string[]
  onChange: (values: string[]) => void
  label?: string
  maxEntries: number
}

export const HighlightsEditor = ({ values, onChange, label = 'Outcome', maxEntries }: HighlightsEditorProps) => {
  const updateAt = (index: number, value: string): void => {
    const next = [...values]
    next[index] = value
    onChange(next)
  }
  const removeAt = (index: number): void => { onChange(values.filter((_, itemIndex) => itemIndex !== index)) }

  return (
    <fieldset className="highlights-editor">
      <legend>Evidence and outcomes</legend>
      <p className="field-help">Use concise bullets. Lead with the action and state the factual result.</p>
      {values.map((value, index) => (
        <div className="highlight-row" key={`${label}-${index}`}>
          <TextAreaField label={`${label} ${index + 1}`} value={value} rows={3} onChange={(next) => { updateAt(index, next) }} />
          <Button type="button" variant="destructive" size="icon" onClick={() => { removeAt(index) }} aria-label={`Remove ${label.toLowerCase()} ${index + 1}`} title="Remove outcome">
            <RiDeleteBinLine aria-hidden="true" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" className="add-outcome" disabled={values.length >= maxEntries} onClick={() => { if (values.length < maxEntries) onChange([...values, '']) }}>
        <RiAddLine aria-hidden="true" /> Add outcome
      </Button>
    </fieldset>
  )
}
