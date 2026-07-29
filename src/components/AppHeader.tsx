import { useRef, type ChangeEvent } from 'react'
import {
  RiDownload2Line,
  RiFileAddLine,
  RiFileTextLine,
  RiGithubLine,
  RiCheckLine,
  RiMoonClearLine,
  RiMore2Fill,
  RiRestartLine,
  RiSave3Line,
  RiSunLine,
  RiTranslate2,
  RiUpload2Line,
} from '@remixicon/react'
import { usePreferences } from '../app/usePreferences'
import type { SaveStatus } from '../app/useResumeDocument'
import { UI_LOCALES, type UiLocale } from '../i18n/messages'
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

const STATUS_KEYS = {
  loading: 'header.status.loading',
  saving: 'header.status.saving',
  saved: 'header.status.saved',
  error: 'header.status.error',
} as const

const LANGUAGE_KEYS: Record<UiLocale, 'language.en' | 'language.pt-BR' | 'language.es'> = {
  en: 'language.en',
  'pt-BR': 'language.pt-BR',
  es: 'language.es',
}

const LANGUAGE_CODES: Record<UiLocale, string> = { en: 'EN', 'pt-BR': 'PT', es: 'ES' }

export const AppHeader = ({ title, status, onTitleChange, onImport, onBackup, onPrint, onUseSample, onUseBlank }: AppHeaderProps) => {
  const { resolvedTheme, setUiLocale, t, toggleTheme, uiLocale } = usePreferences()
  const fileInput = useRef<HTMLInputElement>(null)
  const handleFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) onImport(file)
    event.target.value = ''
  }

  return (
    <header className="app-header no-print">
      <a className="brand" href="/" aria-label={t('header.home')}>
        <span className="brand-mark"><img src="/icons/vitaeink.svg" alt="" width="30" height="30" /></span>
        <span className="brand-copy"><strong>VitaeInk</strong><small>{t('header.studio')}</small></span>
      </a>

      <div className="document-identity">
        <RiFileTextLine aria-hidden="true" />
        <div className="document-name">
          <label htmlFor="document-title" className="sr-only">{t('header.documentName')}</label>
          <input id="document-title" name="document-title" autoComplete="off" value={title} maxLength={200} onChange={(event) => { onTitleChange(event.target.value) }} />
        </div>
        <Badge
          variant={status === 'error' ? 'destructive' : 'secondary'}
          className={`save-status status-${status}`}
          role="status"
          aria-live="polite"
        >
          <span className="status-dot" aria-hidden="true" />
          <span>{t(STATUS_KEYS[status])}</span>
        </Badge>
      </div>

      <div className="header-actions">
        <input ref={fileInput} className="file-input" type="file" accept="application/json,.json" aria-label={t('header.importJsonInput')} onChange={handleFile} tabIndex={-1} />
        <Button type="button" variant="outline" size="lg" className="header-secondary" onClick={() => { fileInput.current?.click() }}>
          <RiUpload2Line data-icon="inline-start" aria-hidden="true" />
          {t('header.import')}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type="button" variant="ghost" className="language-trigger" aria-label={`${t('language.label')}: ${t(LANGUAGE_KEYS[uiLocale])}`} />}>
            <RiTranslate2 aria-hidden="true" /><span>{LANGUAGE_CODES[uiLocale]}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="language-menu" positionerLabel={t('language.options')}>
            <DropdownMenuLabel>{t('language.label')}</DropdownMenuLabel>
            {UI_LOCALES.map((locale) => (
              <DropdownMenuItem key={locale} role="menuitemradio" aria-checked={uiLocale === locale} onClick={() => { setUiLocale(locale) }}>
                <span>{t(LANGUAGE_KEYS[locale])}</span>
                {uiLocale === locale && <RiCheckLine className="menu-check" aria-hidden="true" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button type="button" variant="ghost" size="icon" className="theme-trigger" aria-label={t(resolvedTheme === 'dark' ? 'theme.toLight' : 'theme.toDark')} onClick={toggleTheme}>
          {resolvedTheme === 'dark' ? <RiSunLine aria-hidden="true" /> : <RiMoonClearLine aria-hidden="true" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" className="more-trigger" aria-label={t('header.more')} />}>
            <RiMore2Fill aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="header-menu" positionerLabel={t('header.actions')}>
            <DropdownMenuLabel>{t('header.document')}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => { fileInput.current?.click() }}>
              <RiUpload2Line aria-hidden="true" /> {t('header.importJson')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBackup}>
              <RiSave3Line aria-hidden="true" /> {t('header.backupJson')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { if (window.confirm(t('header.restoreConfirm'))) onUseSample() }}>
              <RiRestartLine aria-hidden="true" /> {t('header.restoreExample')}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => { if (window.confirm(t('header.blankConfirm'))) onUseBlank() }}>
              <RiFileAddLine aria-hidden="true" /> {t('header.startBlank')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="compact-language-options">
              <DropdownMenuLabel>{t('language.label')}</DropdownMenuLabel>
              {UI_LOCALES.map((locale) => (
                <DropdownMenuItem key={locale} role="menuitemradio" aria-checked={uiLocale === locale} onClick={() => { setUiLocale(locale) }}>
                  <RiTranslate2 aria-hidden="true" /> <span>{t(LANGUAGE_KEYS[locale])}</span>
                  {uiLocale === locale && <RiCheckLine className="menu-check" aria-hidden="true" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </div>
            <DropdownMenuItem render={<a href="https://github.com/dimidotdev/vitaeink" target="_blank" rel="noreferrer" />}>
              <RiGithubLine aria-hidden="true" /> {t('header.source')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button type="button" size="lg" className="export-button" onClick={onPrint}>
          <RiDownload2Line data-icon="inline-start" aria-hidden="true" />
          <span>{t('header.exportPdf')}</span>
        </Button>
      </div>
    </header>
  )
}
