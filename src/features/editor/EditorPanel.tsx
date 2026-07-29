import { lazy, Suspense, type ReactNode } from 'react'
import { usePreferences } from '../../app/usePreferences'
import type { EditorSection } from '../../components/SectionNav'
import type { DocumentIssue } from '../../domain/documentChecks'
import type { ResumeDocument } from '../../domain/resume'
import type { DocumentUpdater } from '../../app/useResumeDocument'
import { ProfileEditor } from './editors/ProfileEditor'

const AppearanceEditor = lazy(async () => ({ default: (await import('./editors/AppearanceEditor')).AppearanceEditor }))
const CertificationsEditor = lazy(async () => ({ default: (await import('./editors/CertificationsEditor')).CertificationsEditor }))
const CheckEditor = lazy(async () => ({ default: (await import('./editors/CheckEditor')).CheckEditor }))
const EducationEditor = lazy(async () => ({ default: (await import('./editors/EducationEditor')).EducationEditor }))
const ExperienceEditor = lazy(async () => ({ default: (await import('./editors/ExperienceEditor')).ExperienceEditor }))
const LanguagesEditor = lazy(async () => ({ default: (await import('./editors/LanguagesEditor')).LanguagesEditor }))
const ProjectsEditor = lazy(async () => ({ default: (await import('./editors/ProjectsEditor')).ProjectsEditor }))
const SkillsEditor = lazy(async () => ({ default: (await import('./editors/SkillsEditor')).SkillsEditor }))

interface EditorPanelProps {
  active: EditorSection
  document: ResumeDocument
  update: (updater: DocumentUpdater) => void
  issues: DocumentIssue[]
  pageCount: number
  onSelect: (section: EditorSection) => void
  onPrint: () => void
}

export const EditorPanel = ({ active, document, update, issues, pageCount, onSelect, onPrint }: EditorPanelProps) => {
  const { t } = usePreferences()
  let panel: ReactNode

  switch (active) {
    case 'profile': panel = <ProfileEditor document={document} update={update} />; break
    case 'experience': panel = <ExperienceEditor document={document} update={update} />; break
    case 'projects': panel = <ProjectsEditor document={document} update={update} />; break
    case 'education': panel = <EducationEditor document={document} update={update} />; break
    case 'certifications': panel = <CertificationsEditor document={document} update={update} />; break
    case 'skills': panel = <SkillsEditor document={document} update={update} />; break
    case 'languages': panel = <LanguagesEditor document={document} update={update} />; break
    case 'appearance': panel = <AppearanceEditor document={document} update={update} />; break
    case 'check': panel = <CheckEditor issues={issues} pageCount={pageCount} onSelect={onSelect} onPrint={onPrint} />; break
  }

  return <Suspense fallback={<div className="editor-loading" role="status"><span aria-hidden="true" />{t('editor.loading')}</div>}>{panel}</Suspense>
}
