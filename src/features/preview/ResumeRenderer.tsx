import type { CSSProperties, Ref } from 'react'
import type { ResumeDocument } from '../../domain/resume'
import { ResumeHeader } from './ResumeHeader'
import { ResumeSection } from './renderResumeSection'

interface ResumeRendererProps { document: ResumeDocument; ref?: Ref<HTMLElement>; ariaLabel?: string; emptyNameLabel?: string }

type ResumeStyle = CSSProperties & {
  '--resume-accent': string
  '--resume-font-size': string
  '--resume-line-height': string
}

export const ResumeRenderer = ({ document, ref, ariaLabel, emptyNameLabel }: ResumeRendererProps) => {
  const { settings } = document
  const style: ResumeStyle = {
    '--resume-accent': settings.accent,
    '--resume-font-size': `${settings.fontSize}pt`,
    '--resume-line-height': String(settings.lineHeight),
  }
  const visibleSections = settings.sectionOrder.filter((section) => !settings.hiddenSections.includes(section))

  return (
    <article
      ref={ref}
      className={`resume-document page-${settings.pageSize.toLowerCase()} template-${settings.template} font-${settings.font} density-${settings.density}`}
      style={style}
      lang={settings.locale}
      aria-label={ariaLabel ?? `${document.basics.name || 'Untitled'} resume preview`}
    >
      <ResumeHeader basics={document.basics} emptyNameLabel={emptyNameLabel} />
      {visibleSections.map((section) => <ResumeSection key={section} section={section} document={document} />)}
    </article>
  )
}
