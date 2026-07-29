import { formatDateRange, formatMonth, safeExternalUrl, sectionLabel, visibleUrl } from '../../domain/presentation'
import type { ResumeDocument } from '../../domain/resume'
import {
  isRenderableCertification,
  isRenderableEducation,
  isRenderableExperience,
  isRenderableLanguage,
  isRenderableProject,
  isRenderableSkill,
} from '../../domain/resumeContent'

interface SectionProps { document: ResumeDocument }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="resume-section"><h2>{title}</h2>{children}</section>
)

const Highlights = ({ items }: { items: string[] }) => {
  const visible = items.filter((item) => item.trim())
  return visible.length > 0 ? <ul className="resume-highlights">{visible.map((item, index) => <li key={`${index}-${item.slice(0, 16)}`}>{item}</li>)}</ul> : null
}

export const ProfileSection = ({ document }: SectionProps) => document.basics.summary.trim() ? (
  <Section title={sectionLabel('profile', document.settings.locale)}><p>{document.basics.summary}</p></Section>
) : null

export const ExperienceSection = ({ document }: SectionProps) => {
  const entries = document.experience.filter(isRenderableExperience)
  return entries.length > 0 ? (
  <Section title={sectionLabel('experience', document.settings.locale)}>
    {entries.map((entry) => (
      <article className="resume-entry" key={entry.id}>
        <div className="entry-heading"><h3>{entry.role}</h3><p className="entry-date">{formatDateRange(entry.startDate, entry.endDate, entry.current, document.settings.locale)}</p></div>
        <p className="entry-context"><strong>{entry.company}</strong>{entry.location && <><span aria-hidden="true"> · </span>{entry.location}</>}</p>
        <Highlights items={entry.highlights} />
      </article>
    ))}
  </Section>
) : null
}

export const ProjectsSection = ({ document }: SectionProps) => {
  const entries = document.projects.filter(isRenderableProject)
  return entries.length > 0 ? (
  <Section title={sectionLabel('projects', document.settings.locale)}>
    {entries.map((entry) => {
      const href = safeExternalUrl(entry.url)
      return (
        <article className="resume-entry" key={entry.id}>
          <div className="entry-heading"><h3>{entry.name}</h3><p className="entry-date">{formatDateRange(entry.startDate, entry.endDate, entry.current, document.settings.locale)}</p></div>
          {(entry.role || href) && <p className="entry-context">{entry.role && <strong>{entry.role}</strong>}{entry.role && href && <span aria-hidden="true"> · </span>}{href && <a href={href}>{visibleUrl(entry.url)}</a>}</p>}
          {entry.summary && <p>{entry.summary}</p>}
          <Highlights items={entry.highlights} />
        </article>
      )
    })}
  </Section>
) : null
}

export const EducationSection = ({ document }: SectionProps) => {
  const entries = document.education.filter(isRenderableEducation)
  const separator = document.settings.locale === 'pt-BR' ? ' em ' : ' in '
  return entries.length > 0 ? (
  <Section title={sectionLabel('education', document.settings.locale)}>
    {entries.map((entry) => (
      <article className="resume-entry" key={entry.id}>
        <div className="entry-heading"><h3>{[entry.degree, entry.field].filter(Boolean).join(separator)}</h3><p className="entry-date">{formatDateRange(entry.startDate, entry.endDate, entry.current, document.settings.locale)}</p></div>
        <p className="entry-context"><strong>{entry.institution}</strong>{entry.location && <><span aria-hidden="true"> · </span>{entry.location}</>}</p>
        <Highlights items={entry.highlights} />
      </article>
    ))}
  </Section>
) : null
}

export const CertificationsSection = ({ document }: SectionProps) => {
  const entries = document.certifications.filter(isRenderableCertification)
  return entries.length > 0 ? (
  <Section title={sectionLabel('certifications', document.settings.locale)}>
    {entries.map((entry) => {
      const href = safeExternalUrl(entry.url)
      return (
        <article className="resume-entry certification-entry" key={entry.id}>
          <div className="entry-heading"><h3>{entry.name}</h3><p className="entry-date">{formatMonth(entry.date, document.settings.locale)}</p></div>
          <p className="entry-context"><strong>{entry.issuer}</strong>{entry.credentialId && <> · ID {entry.credentialId}</>}{href && <> · <a href={href}>Credential</a></>}</p>
        </article>
      )
    })}
  </Section>
) : null
}

export const SkillsSection = ({ document }: SectionProps) => {
  const entries = document.skills.filter(isRenderableSkill)
  return entries.length > 0 ? (
    <Section title={sectionLabel('skills', document.settings.locale)}><div className="simple-list">{entries.map((entry) => <p key={entry.id}><strong>{entry.name}:</strong> {entry.keywords.filter((item) => item.trim()).join(', ')}</p>)}</div></Section>
  ) : null
}

export const LanguagesSection = ({ document }: SectionProps) => {
  const entries = document.languages.filter(isRenderableLanguage)
  return entries.length > 0 ? (
    <Section title={sectionLabel('languages', document.settings.locale)}><div className="simple-list">{entries.map((entry) => <p key={entry.id}><strong>{entry.name}:</strong> {entry.level}</p>)}</div></Section>
  ) : null
}
