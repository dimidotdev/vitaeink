import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSampleResume } from '../src/domain/sampleResume'
import type { ResumeDocument } from '../src/domain/resume'

const repository = vi.hoisted(() => ({
  loadResume: vi.fn<() => Promise<ResumeDocument | undefined>>(),
  saveResume: vi.fn<(document: ResumeDocument) => Promise<void>>(),
}))

vi.mock('../src/storage/resumeRepository', () => repository)

import { useResumeDocument } from '../src/app/useResumeDocument'

describe('resume document state', () => {
  beforeEach(() => {
    repository.loadResume.mockReset()
    repository.saveResume.mockReset()
    repository.saveResume.mockResolvedValue(undefined)
  })

  it('does not overwrite an edit made while IndexedDB is opening', async () => {
    let finishLoading: ((document: ReturnType<typeof createSampleResume>) => void) | undefined
    repository.loadResume.mockReturnValue(new Promise((resolve) => { finishLoading = resolve }))
    const stored = createSampleResume()
    stored.basics.name = 'Stored name'
    const { result } = renderHook(() => useResumeDocument())

    act(() => {
      result.current.update((draft) => { draft.basics.name = 'Fresh local edit' })
    })
    await act(async () => { finishLoading?.(stored); await Promise.resolve() })

    expect(result.current.document.basics.name).toBe('Fresh local edit')
    await waitFor(() => {
      expect(repository.saveResume).toHaveBeenCalled()
    })
    expect(repository.saveResume.mock.calls.at(-1)?.[0].basics.name).toBe('Fresh local edit')
  })
})
