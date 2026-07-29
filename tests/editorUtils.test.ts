import { describe, expect, it } from 'vitest'
import { moveEntry } from '../src/features/editor/editorUtils'

describe('accessible reordering', () => {
  it('moves an entry without losing its neighbors', () => {
    const items = ['one', 'two', 'three']
    moveEntry(items, 1, -1)
    expect(items).toEqual(['two', 'one', 'three'])
  })

  it('ignores moves outside the collection', () => {
    const items = ['one', 'two']
    moveEntry(items, 0, -1)
    expect(items).toEqual(['one', 'two'])
  })
})
