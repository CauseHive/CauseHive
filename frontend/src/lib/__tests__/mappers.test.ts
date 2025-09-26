import { describe, it, expect } from 'vitest'
import { mapCategory, mapCauseListItem, mapPagination, toNumber, clamp } from '../mappers'

describe('utils', () => {
  it('toNumber parses strings and numbers safely', () => {
    expect(toNumber(5)).toBe(5)
    expect(toNumber('42')).toBe(42)
    expect(toNumber('bad', 7)).toBe(7)
    expect(toNumber(undefined, 1)).toBe(1)
  })
  it('clamp keeps bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(20, 0, 10)).toBe(10)
  })
})

describe('mapCategory', () => {
  it('maps id to string and keeps optional fields', () => {
    const raw = { id: 'uuid', name: 'Health', cause_count: '3' }
    const c = mapCategory(raw)
    expect(c.id).toBe('uuid')
    expect(c.name).toBe('Health')
    expect(c.cause_count).toBe(3)
  })
})

describe('mapCauseListItem', () => {
  it('computes progress when missing', () => {
    const raw = {
      id: '1',
      name: 'Cause',
      target_amount: '100',
      current_amount: '25',
      category: { id: 'cat1', name: 'Education' },
      creator: { id: 'u1', full_name: 'Alice' }
    }
    const c = mapCauseListItem(raw)
    expect(c.title).toBe('Cause')
    expect(c.progress_percentage).toBe(25)
  })
})

describe('mapPagination', () => {
  it('maps unknown pagination shapes', () => {
    const raw = { count: '2', results: [{ id: '1', name: 'A', category: {}, creator: {} }, { id: '2', name: 'B', category: {}, creator: {} }] }
    const p = mapPagination(raw, mapCauseListItem)
    expect(p.count).toBe(2)
    expect(p.results.length).toBe(2)
  })
})
