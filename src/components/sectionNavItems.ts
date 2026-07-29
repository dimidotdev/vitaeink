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

export type EditorSection = SectionKey | 'appearance' | 'check'

export const NAV_ITEMS: ReadonlyArray<{ key: EditorSection; label: string; icon: RemixiconComponentType }> = [
  { key: 'profile', label: 'Profile', icon: RiUserLine },
  { key: 'experience', label: 'Experience', icon: RiBriefcase4Line },
  { key: 'projects', label: 'Projects', icon: RiFolderOpenLine },
  { key: 'education', label: 'Education', icon: RiGraduationCapLine },
  { key: 'certifications', label: 'Certifications', icon: RiAwardLine },
  { key: 'skills', label: 'Skills', icon: RiCodeSSlashLine },
  { key: 'languages', label: 'Languages', icon: RiTranslate2 },
  { key: 'appearance', label: 'Design', icon: RiPaletteLine },
]
