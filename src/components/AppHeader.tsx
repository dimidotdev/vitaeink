import { useRef, type ChangeEvent } from 'react'
import {
  RiDownload2Line,
  RiFileAddLine,
  RiFileTextLine,
  RiGithubLine,
  RiMore2Fill,
  RiRestartLine,
  RiSave3Line,
  RiUpload2Line,
} from '@remixicon/react'
import type { SaveStatus } from '../app/useResumeDocument'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

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
        <span className="brand-mark"><img src="/icons/vitaeink.svg" alt="" width="30" height="30" /></span>
        <span className="brand-copy"><strong>VitaeInk</strong><small>Resume studio</small></span>
      </a>

      <div className="document-identity">
        <RiFileTextLine aria-hidden="true" />
        <div className="document-name">
          <label htmlFor="document-title" className="sr-only">Document name</label>
          <input id="document-title" name="document-title" autoComplete="off" value={title} maxLength={200} onChange={(event) => { onTitleChange(event.target.value) }} />
        </div>
        <Badge
          variant={status === 'error' ? 'destructive' : 'secondary'}
          className={`save-status status-${status}`}
          role="status"
          aria-live="polite"
        >
          <span className="status-dot" aria-hidden="true" />
          <span>{STATUS_LABELS[status]}</span>
        </Badge>
      </div>

      <div className="header-actions">
        <input ref={fileInput} className="file-input" type="file" accept="application/json,.json" aria-label="Import resume JSON" onChange={handleFile} tabIndex={-1} />
        <Button type="button" variant="outline" size="lg" className="header-secondary" onClick={() => { fileInput.current?.click() }}>
          <RiUpload2Line data-icon="inline-start" aria-hidden="true" />
          Import
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" aria-label="More actions" />}>
            <RiMore2Fill aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="header-menu">
            <DropdownMenuLabel>Document</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => { fileInput.current?.click() }}>
              <RiUpload2Line aria-hidden="true" /> Import JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBackup}>
              <RiSave3Line aria-hidden="true" /> Backup JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { if (window.confirm('Replace the current resume with the example?')) onUseSample() }}>
              <RiRestartLine aria-hidden="true" /> Restore example
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => { if (window.confirm('Start a blank resume? Download a backup first if needed.')) onUseBlank() }}>
              <RiFileAddLine aria-hidden="true" /> Start blank
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<a href="https://github.com/dimidotdev/vitaeink" target="_blank" rel="noreferrer" />}>
              <RiGithubLine aria-hidden="true" /> View source on GitHub
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button type="button" size="lg" className="export-button" onClick={onPrint}>
          <RiDownload2Line data-icon="inline-start" aria-hidden="true" />
          <span>Export PDF</span>
        </Button>
      </div>
    </header>
  )
}
