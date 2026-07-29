import { beforeEach, describe, expect, it } from 'vitest'
import { createSampleResume } from '../src/domain/sampleResume'
import { clearResume, loadResume, resetRepositoryForTests, saveResume } from '../src/storage/resumeRepository'

describe('resume repository', () => {
  beforeEach(async () => {
    resetRepositoryForTests()
    await clearResume()
  })

  it('stores and retrieves the current resume in IndexedDB', async () => {
    const sample = createSampleResume()
    sample.metadata.title = 'Locally saved resume'
    await saveResume(sample)
    await expect(loadResume()).resolves.toEqual(sample)
  })

  it('returns undefined when no local resume exists', async () => {
    await expect(loadResume()).resolves.toBeUndefined()
  })

  it('keeps rapid writes ordered so the latest edit wins', async () => {
    const first = createSampleResume()
    first.basics.name = 'First edit'
    const second = createSampleResume()
    second.basics.name = 'Latest edit'
    await Promise.all([saveResume(first), saveResume(second)])
    await expect(loadResume()).resolves.toMatchObject({ basics: { name: 'Latest edit' } })
  })

  it('preserves a deliberately selected custom accent', async () => {
    const sample = createSampleResume()
    sample.settings.accent = '#9A3412'
    await saveResume(sample)
    await expect(loadResume()).resolves.toMatchObject({ settings: { accent: '#9A3412' } })
  })
})
