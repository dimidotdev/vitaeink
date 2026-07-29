import type { EditorSection } from '../../components/SectionNav'
import type { DocumentIssue } from '../../domain/documentChecks'
import type { ResumeDocument } from '../../domain/resume'
import type { DocumentUpdater } from '../../app/useResumeDocument'
import { AppearanceEditor } from './editors/AppearanceEditor'
import { CertificationsEditor } from './editors/CertificationsEditor'
import { CheckEditor } from './editors/CheckEditor'
import { EducationEditor } from './editors/EducationEditor'
import { ExperienceEditor } from './editors/ExperienceEditor'
import { LanguagesEditor } from './editors/LanguagesEditor'
import { ProfileEditor } from './editors/ProfileEditor'
import { ProjectsEditor } from './editors/ProjectsEditor'
import { SkillsEditor } from './editors/SkillsEditor'

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
  switch (active) {
    case 'profile': return <ProfileEditor document={document} update={update} />
    case 'experience': return <ExperienceEditor document={document} update={update} />
    case 'projects': return <ProjectsEditor document={document} update={update} />
    case 'education': return <EducationEditor document={document} update={update} />
    case 'certifications': return <CertificationsEditor document={document} update={update} />
    case 'skills': return <SkillsEditor document={document} update={update} />
    case 'languages': return <LanguagesEditor document={document} update={update} />
    case 'appearance': return <AppearanceEditor document={document} update={update} />
    case 'check': return <CheckEditor issues={issues} pageCount={pageCount} onSelect={onSelect} onPrint={onPrint} />
  }
}
