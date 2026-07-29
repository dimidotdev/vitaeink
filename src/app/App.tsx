import { useMemo, useState } from 'react'
import { RiArrowDownSLine, RiCloseLine, RiEditLine, RiEyeLine } from '@remixicon/react'
import { AppHeader } from '../components/AppHeader'
import { SectionNav } from '../components/SectionNav'
import { NAV_ITEMS, type EditorSection } from '../components/sectionNavItems'
import { Button } from '../components/ui/button'
import { ScrollHints } from '../components/ScrollHint'
import { useScrollHints } from '../components/useScrollHints'
import { runDocumentChecks } from '../domain/documentChecks'
import { ResumeImportError } from '../domain/portableDocument'
import { downloadResumeJson, importResumeFile, printResume } from './fileActions'
import { EditorPanel } from '../features/editor/EditorPanel'
import { PreviewPane } from '../features/preview/PreviewPane'
import { useResumeDocument } from './useResumeDocument'
import { usePreferences } from './usePreferences'

type MobilePane = 'editor' | 'preview'

export const App = () => {
  const { t } = usePreferences()
  const { document, status, error, update, replace, restoreSample, startBlank } = useResumeDocument()
  const [activeSection, setActiveSection] = useState<EditorSection>('profile')
  const [mobilePane, setMobilePane] = useState<MobilePane>('editor')
  const [pageCount, setPageCount] = useState(1)
  const [notice, setNotice] = useState<string>()
  const { ref: navScrollRef, scrollState: navScrollState } = useScrollHints<HTMLDivElement>()
  const { ref: editorScrollRef, scrollState: editorScrollState } = useScrollHints<HTMLElement>()
  const issues = useMemo(() => runDocumentChecks(document), [document])

  const selectSection = (section: EditorSection): void => {
    setActiveSection(section)
    setMobilePane('editor')
  }

  const handleImport = (file: File): void => {
    void importResumeFile(file)
      .then((imported) => {
        if (!window.confirm(t('app.importConfirm', { title: document.metadata.title }))) {
          setNotice(t('app.importCanceled'))
          return
        }
        replace(imported)
        setNotice(t('app.imported'))
      })
      .catch((reason: unknown) => {
        setNotice(reason instanceof ResumeImportError ? t(reason.messageKey, reason.values) : t('app.importError'))
      })
  }

  const handlePrint = (): void => {
    const warnings = issues.filter((issue) => issue.level === 'warning').length
    if (warnings > 0 && !window.confirm(t(warnings === 1 ? 'app.exportWarning.one' : 'app.exportWarning.many', { count: warnings }))) return
    void printResume(document).catch(() => { setNotice(t('app.printError')) })
  }

  return (
    <div className="app-shell">
      <a href="#editor-content" className="skip-link no-print">{t('app.skip')}</a>
      <AppHeader
        title={document.metadata.title}
        status={status}
        onTitleChange={(title) => { update((draft) => { draft.metadata.title = title }) }}
        onImport={handleImport}
        onBackup={() => { downloadResumeJson(document); setNotice(t('app.backupDownloaded')) }}
        onPrint={handlePrint}
        onUseSample={() => { restoreSample(); setNotice(t('app.sampleRestored')) }}
        onUseBlank={() => { startBlank(t('app.untitledResume')); setNotice(t('app.blankCreated')) }}
      />
      {(error || notice) && (
        <div className={error ? 'app-notice notice-error no-print' : 'app-notice no-print'} role="status" aria-live="polite">
          <span>{error ? t(error) : notice}</span>
          {notice && <Button type="button" variant="ghost" size="icon-sm" aria-label={t('app.dismiss')} onClick={() => { setNotice(undefined) }}><RiCloseLine aria-hidden="true" /></Button>}
        </div>
      )}
      <nav className="mobile-workspace-bar no-print" aria-label={t('app.mobileWorkspace')}>
        <div className="mobile-pane-switch" role="group" aria-label={t('app.mobileView')}>
          <Button type="button" variant={mobilePane === 'editor' ? 'secondary' : 'ghost'} aria-pressed={mobilePane === 'editor'} className={mobilePane === 'editor' ? 'active' : undefined} onClick={() => { setMobilePane('editor') }}><RiEditLine aria-hidden="true" /> {t('app.edit')}</Button>
          <Button type="button" variant={mobilePane === 'preview' ? 'secondary' : 'ghost'} aria-pressed={mobilePane === 'preview'} className={mobilePane === 'preview' ? 'active' : undefined} onClick={() => { setMobilePane('preview') }}><RiEyeLine aria-hidden="true" /> {t('app.preview')}</Button>
        </div>
        {mobilePane === 'editor' && (
          <label className="mobile-section-picker">
            <span className="sr-only">{t('app.resumeSection')}</span>
            <select name="mobile-resume-section" value={activeSection} onChange={(event) => { setActiveSection(event.target.value as EditorSection) }}>
              {NAV_ITEMS.map((item) => <option key={item.key} value={item.key}>{t(item.labelKey)}</option>)}
              <option value="check">{t('app.documentCheckCount', { count: issues.length })}</option>
            </select>
            <RiArrowDownSLine aria-hidden="true" />
          </label>
        )}
      </nav>
      <div className={`workspace pane-${mobilePane}`}>
        <aside className="workspace-nav-frame no-print">
          <div ref={navScrollRef} className="workspace-nav"><SectionNav active={activeSection} issues={issues.length} onChange={selectSection} /></div>
          <ScrollHints {...navScrollState} />
        </aside>
        <div className="workspace-editor-frame no-print">
          <main ref={editorScrollRef} id="editor-content" className="workspace-editor" tabIndex={-1}>
            <h1 className="sr-only">{t('app.title')}</h1>
            <EditorPanel active={activeSection} document={document} update={update} issues={issues} pageCount={pageCount} onSelect={selectSection} onPrint={handlePrint} />
          </main>
          <ScrollHints {...editorScrollState} />
        </div>
        <div className="workspace-preview"><PreviewPane document={document} onPageCountChange={setPageCount} /></div>
      </div>
    </div>
  )
}
