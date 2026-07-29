import type { ResumeDocument, SectionKey } from '../../domain/resume'
import {
  CertificationsSection,
  EducationSection,
  ExperienceSection,
  LanguagesSection,
  ProfileSection,
  ProjectsSection,
  SkillsSection,
} from './ResumeSections'

interface ResumeSectionProps { section: SectionKey; document: ResumeDocument }

export const ResumeSection = ({ section, document }: ResumeSectionProps): React.ReactNode => {
  const props = { document }
  switch (section) {
    case 'profile': return <ProfileSection key={section} {...props} />
    case 'experience': return <ExperienceSection key={section} {...props} />
    case 'projects': return <ProjectsSection key={section} {...props} />
    case 'education': return <EducationSection key={section} {...props} />
    case 'certifications': return <CertificationsSection key={section} {...props} />
    case 'skills': return <SkillsSection key={section} {...props} />
    case 'languages': return <LanguagesSection key={section} {...props} />
  }
}
