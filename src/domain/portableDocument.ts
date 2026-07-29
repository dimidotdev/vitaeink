import { resumeDocumentSchema, type ResumeDocument } from './resume'
import { formatMessage, type MessageKey } from '../i18n/messages'

export const MAX_IMPORT_BYTES = 1_000_000

export class ResumeImportError extends Error {
  readonly messageKey: MessageKey
  readonly values?: Record<string, string | number>

  constructor(messageKey: MessageKey, values?: Record<string, string | number>) {
    super(formatMessage('en', messageKey, values))
    this.name = 'ResumeImportError'
    this.messageKey = messageKey
    this.values = values
  }
}

export const parseResumeJson = (source: string): ResumeDocument => {
  if (new Blob([source]).size > MAX_IMPORT_BYTES) {
    throw new ResumeImportError('import.tooLarge')
  }

  let candidate: unknown
  try {
    candidate = JSON.parse(source) as unknown
  } catch {
    throw new ResumeImportError('import.invalidJson')
  }

  const result = resumeDocumentSchema.safeParse(candidate)
  if (!result.success) {
    const firstIssue = result.error.issues[0]
    const location = firstIssue?.path.join('.') || 'document'
    throw new ResumeImportError('import.invalidDocument', { location })
  }
  return result.data
}

export const serializeResume = (document: ResumeDocument): string => `${JSON.stringify(document, null, 2)}\n`

export const safeFilename = (title: string, extension: 'json' | 'pdf'): string => {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'resume'
  return `${slug}.${extension}`
}
