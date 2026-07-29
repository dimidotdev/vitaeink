import { useCallback, useEffect, useRef, useState } from 'react'
import { createBlankResume } from '../domain/factories'
import { createSampleResume } from '../domain/sampleResume'
import type { ResumeDocument } from '../domain/resume'
import { loadResume, saveResume } from '../storage/resumeRepository'

export type SaveStatus = 'loading' | 'saving' | 'saved' | 'error'
export type DocumentUpdater = (draft: ResumeDocument) => void

interface ResumeDocumentState {
  document: ResumeDocument
  status: SaveStatus
  error: string | undefined
  update: (updater: DocumentUpdater) => void
  replace: (document: ResumeDocument) => void
  restoreSample: () => void
  startBlank: () => void
}

export const useResumeDocument = (): ResumeDocumentState => {
  const [document, setDocument] = useState<ResumeDocument>(createSampleResume)
  const [status, setStatus] = useState<SaveStatus>('loading')
  const [error, setError] = useState<string>()
  const [hydrationComplete, setHydrationComplete] = useState(false)
  const hydrated = useRef(false)
  const changedBeforeHydration = useRef(false)
  const storageAvailable = useRef(true)
  const saveSequence = useRef(0)

  useEffect(() => {
    let active = true
    void loadResume()
      .then((stored) => {
        if (!active) return
        if (stored && !changedBeforeHydration.current) setDocument(stored)
        hydrated.current = true
        setHydrationComplete(true)
        setStatus('saved')
      })
      .catch((reason: unknown) => {
        if (!active) return
        hydrated.current = true
        storageAvailable.current = false
        setHydrationComplete(true)
        setStatus('error')
        setError(reason instanceof Error ? reason.message : 'Local storage could not be opened.')
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!hydrationComplete || !storageAvailable.current) return undefined
    const sequence = ++saveSequence.current
    setStatus('saving')
    void saveResume(document)
      .then(() => {
        if (saveSequence.current !== sequence) return
        setStatus('saved')
        setError(undefined)
      })
      .catch((reason: unknown) => {
        if (saveSequence.current !== sequence) return
        setStatus('error')
        setError(reason instanceof Error ? reason.message : 'This resume could not be saved.')
      })
    return undefined
  }, [document, hydrationComplete])

  useEffect(() => {
    if (status !== 'saving') return undefined
    const warnAboutPendingSave = (event: BeforeUnloadEvent): void => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnAboutPendingSave)
    return () => { window.removeEventListener('beforeunload', warnAboutPendingSave) }
  }, [status])

  const update = useCallback((updater: DocumentUpdater): void => {
    if (!hydrated.current) changedBeforeHydration.current = true
    setDocument((current) => {
      const next = structuredClone(current)
      updater(next)
      next.metadata.updatedAt = new Date().toISOString()
      return next
    })
  }, [])

  const replace = useCallback((nextDocument: ResumeDocument): void => {
    if (!hydrated.current) changedBeforeHydration.current = true
    const next = structuredClone(nextDocument)
    next.metadata.updatedAt = new Date().toISOString()
    setDocument(next)
  }, [])

  return {
    document,
    status,
    error,
    update,
    replace,
    restoreSample: useCallback(() => { replace(createSampleResume()) }, [replace]),
    startBlank: useCallback(() => { replace(createBlankResume()) }, [replace]),
  }
}
