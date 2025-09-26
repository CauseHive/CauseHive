import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn', () => {
  it('merges classes correctly', () => {
    expect(cn('a', 'b')).toContain('a')
  })
})
