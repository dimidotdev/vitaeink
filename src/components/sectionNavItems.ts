import {
  RiAwardLine,
  RiBriefcase4Line,
  RiCodeSSlashLine,
  RiFolderOpenLine,
  RiGraduationCapLine,
  RiPaletteLine,
  RiTranslate2,
  RiUserLine,
  type RemixiconComponentType,
} from '@remixicon/react'
import type { SectionKey } from '../domain/resume'
import type { MessageKey } from '../i18n/messages'

export type EditorSection = SectionKey | 'appearance' | 'check'

export const NAV_ITEMS: ReadonlyArray<{ key: EditorSection; labelKey: MessageKey; icon: RemixiconComponentType }> = [
  { key: 'profile', labelKey: 'nav.profile', icon: RiUserLine },
  { key: 'experience', labelKey: 'nav.experience', icon: RiBriefcase4Line },
  { key: 'projects', labelKey: 'nav.projects', icon: RiFolderOpenLine },
  { key: 'education', labelKey: 'nav.education', icon: RiGraduationCapLine },
  { key: 'certifications', labelKey: 'nav.certifications', icon: RiAwardLine },
  { key: 'skills', labelKey: 'nav.skills', icon: RiCodeSSlashLine },
  { key: 'languages', labelKey: 'nav.languages', icon: RiTranslate2 },
  { key: 'appearance', labelKey: 'nav.design', icon: RiPaletteLine },
]
