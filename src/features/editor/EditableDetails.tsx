import { useState, type ReactNode, type SyntheticEvent } from 'react'

interface EditableDetailsProps {
  title: string
  subtitle: string
  defaultOpen?: boolean
  children: ReactNode
}

export const EditableDetails = ({ title, subtitle, defaultOpen = false, children }: EditableDetailsProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>): void => {
    setOpen(event.currentTarget.open)
  }
  return (
    <details className="entry-card" open={open} onToggle={handleToggle}>
      <summary><span>{title}</span><small>{subtitle}</small></summary>
      {children}
    </details>
  )
}
