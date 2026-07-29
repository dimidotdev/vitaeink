import { useRef, type ChangeEvent } from 'react'
import type { SaveStatus } from '../app/useResumeDocument'

interface AppHeaderProps {
  title: string
  status: SaveStatus
  onTitleChange: (title: string) => void
  onImport: (file: File) => void
  onBackup: () => void
  onPrint: () => void
  onUseSample: () => void
  onUseBlank: () => void
}

const STATUS_LABELS: Record<SaveStatus, string> = {
  loading: 'Opening local copy…',
  saving: 'Saving locally…',
  saved: 'Saved on this device',
  error: 'Local save needs attention',
}

export const AppHeader = ({ title, status, onTitleChange, onImport, onBackup, onPrint, onUseSample, onUseBlank }: AppHeaderProps) => {
  const fileInput = useRef<HTMLInputElement>(null)
  const handleFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) onImport(file)
    event.target.value = ''
  }

  return (
    <header className="app-header no-print">
      <a className="brand" href="/" aria-label="VitaeInk home">
        <img src="/icons/vitaeink.svg" alt="" width="32" height="32" />
        <span>VitaeInk</span>
      </a>
      <div className="document-identity">
        <label htmlFor="document-title" className="sr-only">Document name</label>
        <input id="document-title" value={title} maxLength={200} onChange={(event) => { onTitleChange(event.target.value) }} />
        <span className={`save-status status-${status}`} role="status" aria-live="polite">{STATUS_LABELS[status]}</span>
      </div>
      <div className="header-actions">
        <input ref={fileInput} className="file-input" type="file" accept="application/json,.json" aria-label="Import resume JSON" onChange={handleFile} tabIndex={-1} />
        <button type="button" className="button button-quiet header-secondary" onClick={() => { fileInput.current?.click() }}>Import</button>
        <button type="button" className="button button-quiet header-secondary" onClick={onBackup}>Backup JSON</button>
        <details className="more-menu">
          <summary className="button button-quiet" aria-label="More actions">More</summary>
          <div className="more-menu-popover">
            <button type="button" onClick={() => { fileInput.current?.click() }}>Import JSON</button>
            <button type="button" onClick={onBackup}>Backup JSON</button>
            <button type="button" onClick={() => { if (window.confirm('Replace the current resume with the example?')) onUseSample() }}>Restore example</button>
            <button type="button" onClick={() => { if (window.confirm('Start a blank resume? Download a backup first if needed.')) onUseBlank() }}>Start blank</button>
            <a href="https://github.com/dimidotdev/vitaeink" target="_blank" rel="noreferrer">View source on GitHub</a>
          </div>
        </details>
        <button type="button" className="button button-primary" onClick={onPrint}>Export PDF</button>
      </div>
    </header>
  )
}
