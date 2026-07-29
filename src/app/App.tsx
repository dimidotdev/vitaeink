import { useMemo, useState } from 'react'
import { RiArrowDownSLine, RiCloseLine, RiEditLine, RiEyeLine } from '@remixicon/react'
import { AppHeader } from '../components/AppHeader'
import { SectionNav } from '../components/SectionNav'
import { NAV_ITEMS, type EditorSection } from '../components/sectionNavItems'
import { Button } from '../components/ui/button'
import { runDocumentChecks } from '../domain/documentChecks'
import { downloadResumeJson, importResumeFile, printResume } from './fileActions'
import { EditorPanel } from '../features/editor/EditorPanel'
import { PreviewPane } from '../features/preview/PreviewPane'
import { useResumeDocument } from './useResumeDocument'

type MobilePane = 'editor' | 'preview'

export const App = () => {
  const { document, status, error, update, replace, restoreSample, startBlank } = useResumeDocument()
  const [activeSection, setActiveSection] = useState<EditorSection>('profile')
  const [mobilePane, setMobilePane] = useState<MobilePane>('editor')
  const [pageCount, setPageCount] = useState(1)
  const [notice, setNotice] = useState<string>()
  const issues = useMemo(() => runDocumentChecks(document), [document])

  const selectSection = (section: EditorSection): void => {
    setActiveSection(section)
    setMobilePane('editor')
  }

  const handleImport = (file: File): void => {
    void importResumeFile(file)
      .then((imported) => {
        if (!window.confirm(`Replace “${document.metadata.title}” with the imported resume? Download a JSON backup first if needed.`)) {
          setNotice('Import canceled. Your current resume was not changed.')
          return
        }
        replace(imported)
        setNotice('Resume imported. The local save status is shown above.')
      })
      .catch((reason: unknown) => {
        setNotice(reason instanceof Error ? reason.message : 'The resume could not be imported.')
      })
  }

  const handlePrint = (): void => {
    const warnings = issues.filter((issue) => issue.level === 'warning').length
    if (warnings > 0 && !window.confirm(`This resume has ${warnings} warning${warnings === 1 ? '' : 's'}. Export it anyway?`)) return
    void printResume(document).catch(() => { setNotice('The print dialog could not be opened.') })
  }

  return (
    <div className="app-shell">
      <a href="#editor-content" className="skip-link no-print">Skip to editor</a>
      <AppHeader
        title={document.metadata.title}
        status={status}
        onTitleChange={(title) => { update((draft) => { draft.metadata.title = title }) }}
        onImport={handleImport}
        onBackup={() => { downloadResumeJson(document); setNotice('JSON backup downloaded.') }}
        onPrint={handlePrint}
        onUseSample={() => { restoreSample(); setNotice('Example resume restored. The local save status is shown above.') }}
        onUseBlank={() => { startBlank(); setNotice('Blank resume created. The local save status is shown above.') }}
      />
      {(error || notice) && (
        <div className={error ? 'app-notice notice-error no-print' : 'app-notice no-print'} role="status" aria-live="polite">
          <span>{error ?? notice}</span>
          {notice && <Button type="button" variant="ghost" size="icon-sm" aria-label="Dismiss notification" onClick={() => { setNotice(undefined) }}><RiCloseLine aria-hidden="true" /></Button>}
        </div>
      )}
      <nav className="mobile-workspace-bar no-print" aria-label="Mobile workspace">
        <div className="mobile-pane-switch" role="group" aria-label="Mobile workspace view">
          <Button type="button" variant={mobilePane === 'editor' ? 'secondary' : 'ghost'} aria-pressed={mobilePane === 'editor'} className={mobilePane === 'editor' ? 'active' : undefined} onClick={() => { setMobilePane('editor') }}><RiEditLine aria-hidden="true" /> Edit</Button>
          <Button type="button" variant={mobilePane === 'preview' ? 'secondary' : 'ghost'} aria-pressed={mobilePane === 'preview'} className={mobilePane === 'preview' ? 'active' : undefined} onClick={() => { setMobilePane('preview') }}><RiEyeLine aria-hidden="true" /> Preview</Button>
        </div>
        {mobilePane === 'editor' && (
          <label className="mobile-section-picker">
            <span className="sr-only">Resume section</span>
            <select name="mobile-resume-section" value={activeSection} onChange={(event) => { setActiveSection(event.target.value as EditorSection) }}>
              {NAV_ITEMS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              <option value="check">Document check ({issues.length})</option>
            </select>
            <RiArrowDownSLine aria-hidden="true" />
          </label>
        )}
      </nav>
      <div className={`workspace pane-${mobilePane}`}>
        <aside className="workspace-nav no-print"><SectionNav active={activeSection} issues={issues.length} onChange={selectSection} /></aside>
        <main id="editor-content" className="workspace-editor no-print" tabIndex={-1}>
          <h1 className="sr-only">VitaeInk resume editor</h1>
          <EditorPanel active={activeSection} document={document} update={update} issues={issues} pageCount={pageCount} onSelect={selectSection} onPrint={handlePrint} />
        </main>
        <div className="workspace-preview"><PreviewPane document={document} onPageCountChange={setPageCount} /></div>
      </div>
    </div>
  )
}
