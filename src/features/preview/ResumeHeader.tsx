import { safeExternalUrl, visibleUrl } from '../../domain/presentation'
import type { ResumeDocument } from '../../domain/resume'

interface ResumeHeaderProps { basics: ResumeDocument['basics'] }

export const ResumeHeader = ({ basics }: ResumeHeaderProps) => {
  const website = safeExternalUrl(basics.website)
  return (
    <header className="resume-header">
      {basics.name.trim() ? <h1>{basics.name}</h1> : <h1 className="resume-placeholder no-print">Your name</h1>}
      {basics.headline && <p className="resume-headline">{basics.headline}</p>}
      <address>
        <ul className="contact-list">
          {basics.email && <li><a href={`mailto:${basics.email}`}>{basics.email}</a></li>}
          {basics.phone && <li><a href={`tel:${basics.phone.replace(/[^+\d]/g, '')}`}>{basics.phone}</a></li>}
          {basics.location && <li>{basics.location}</li>}
          {website && <li><a href={website}>{visibleUrl(basics.website)}</a></li>}
          {basics.links.map((link) => {
            const href = safeExternalUrl(link.url)
            return href && link.label ? <li key={link.id}><a href={href}>{link.label}</a></li> : null
          })}
        </ul>
      </address>
    </header>
  )
}
