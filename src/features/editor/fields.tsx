import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface FieldShellProps {
  label: string
  help?: string
  children: (id: string, describedBy: string | undefined) => ReactNode
}

const FieldShell = ({ label, help, children }: FieldShellProps) => {
  const id = useId()
  const helpId = help ? `${id}-help` : undefined
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children(id, helpId)}
      {help && <span id={helpId} className="field-help">{help}</span>}
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  help?: string
  placeholder?: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  autoComplete?: string
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  name?: string
  maxLength?: number
  onFocus?: () => void
  onBlur?: (value: string) => void
}

export const TextField = ({ label, value, onChange, help, placeholder, type = 'text', autoComplete, inputMode, name, maxLength = 200, onFocus, onBlur }: TextFieldProps) => (
  <FieldShell label={label} help={help}>
    {(id, describedBy) => (
      <input
        id={id}
        value={value}
        name={name ?? id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-describedby={describedBy}
        onFocus={onFocus}
        onBlur={(event) => { onBlur?.(event.target.value) }}
        onChange={(event) => { onChange(event.target.value) }}
      />
    )}
  </FieldShell>
)

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  help?: string
  rows?: number
  placeholder?: string
  maxLength?: number
  name?: string
}

export const TextAreaField = ({ label, value, onChange, help, rows = 4, placeholder, maxLength = 4_000, name }: TextAreaFieldProps) => (
  <FieldShell label={label} help={help}>
    {(id, describedBy) => (
      <textarea
        id={id}
        name={name ?? id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-describedby={describedBy}
        onChange={(event) => { onChange(event.target.value) }}
      />
    )}
  </FieldShell>
)

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: ReadonlyArray<{ value: string; label: string }>
  help?: string
}

export const SelectField = ({ label, value, onChange, options, help }: SelectFieldProps) => (
  <FieldShell label={label} help={help}>
    {(id, describedBy) => (
      <select id={id} value={value} aria-describedby={describedBy} onChange={(event) => { onChange(event.target.value) }}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    )}
  </FieldShell>
)

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const CheckboxField = ({ label, checked, onChange }: CheckboxFieldProps) => {
  const id = useId()
  return (
    <div className="checkbox-field">
      <input id={id} type="checkbox" checked={checked} onChange={(event) => { onChange(event.target.checked) }} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

interface RangeFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (value: number) => void
}

export const RangeField = ({ label, value, min, max, step, suffix = '', onChange }: RangeFieldProps) => (
  <FieldShell label={label}>
    {(id) => (
      <div className="range-control">
        <input id={id} type="range" value={value} min={min} max={max} step={step} onChange={(event) => { onChange(event.target.valueAsNumber) }} />
        <output htmlFor={id}>{value}{suffix}</output>
      </div>
    )}
  </FieldShell>
)
