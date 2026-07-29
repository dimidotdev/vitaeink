import { MAX_IMPORT_BYTES, parseResumeJson, ResumeImportError, safeFilename, serializeResume } from '../domain/portableDocument'
import type { ResumeDocument } from '../domain/resume'

export const importResumeFile = async (file: File): Promise<ResumeDocument> => {
  if (file.size > MAX_IMPORT_BYTES) throw new ResumeImportError('import.tooLarge')
  return parseResumeJson(await file.text())
}

export const downloadResumeJson = (document: ResumeDocument): void => {
  const blob = new Blob([serializeResume(document)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement('a')
  anchor.href = url
  anchor.download = safeFilename(document.metadata.title, 'json')
  window.document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => { URL.revokeObjectURL(url) }, 0)
}

export const printResume = async (document: ResumeDocument): Promise<void> => {
  await window.document.fonts.ready
  const previousTitle = window.document.title
  window.document.title = safeFilename(document.metadata.title, 'pdf').replace(/\.pdf$/, '')
  const restoreTitle = (): void => { window.document.title = previousTitle }
  window.addEventListener('afterprint', restoreTitle, { once: true })
  window.print()
  window.setTimeout(restoreTitle, 2_000)
}
