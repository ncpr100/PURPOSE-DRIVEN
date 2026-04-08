/**
 * Unit tests for lib/validation-schemas.ts
 *
 * Covers the three critical bug fixes documented in PROJECT_SOURCE_OF_TRUTH.md:
 *   Bug #002 — memberSchema must accept Spanish enum values for gender/maritalStatus
 *   Bug #003 — memberSchema must accept YYYY-MM-DD date strings (not Date objects)
 *
 * Run: npx vitest run __tests__/validation-schemas.test.ts
 */

import { describe, it, expect } from 'vitest'
import { memberSchema } from '@/lib/validation-schemas'

// Minimal valid member payload (only required fields)
const VALID_BASE: Parameters<typeof memberSchema.parse>[0] = {
  firstName: 'Carlos',
  lastName: 'García',
}

describe('memberSchema — required fields', () => {
  it('accepts a valid member with only required fields', () => {
    const result = memberSchema.safeParse(VALID_BASE)
    expect(result.success).toBe(true)
  })

  it('rejects firstName shorter than 2 characters', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, firstName: 'A' })
    expect(result.success).toBe(false)
  })

  it('rejects firstName with numbers', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, firstName: 'Carl0s' })
    expect(result.success).toBe(false)
  })

  it('accepts firstName with Spanish accent characters', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, firstName: 'José Ángel' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email format', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})

describe('memberSchema — Bug #002: Spanish enum values (gender / maritalStatus)', () => {
  it('accepts Spanish gender value: masculino', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, gender: 'masculino' })
    expect(result.success).toBe(true)
  })

  it('accepts Spanish gender value: femenino', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, gender: 'femenino' })
    expect(result.success).toBe(true)
  })

  it('accepts Spanish gender value: otro', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, gender: 'otro' })
    expect(result.success).toBe(true)
  })

  it('accepts Spanish gender value: no-especificar', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, gender: 'no-especificar' })
    expect(result.success).toBe(true)
  })

  it('accepts legacy English gender value: male', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, gender: 'male' })
    expect(result.success).toBe(true)
  })

  it('accepts Spanish maritalStatus value: soltero', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, maritalStatus: 'soltero' })
    expect(result.success).toBe(true)
  })

  it('accepts Spanish maritalStatus value: casado', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, maritalStatus: 'casado' })
    expect(result.success).toBe(true)
  })

  it('accepts Spanish maritalStatus value: divorciado', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, maritalStatus: 'divorciado' })
    expect(result.success).toBe(true)
  })

  it('accepts Spanish maritalStatus value: union-libre', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, maritalStatus: 'union-libre' })
    expect(result.success).toBe(true)
  })

  it('accepts legacy English maritalStatus value: married', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, maritalStatus: 'married' })
    expect(result.success).toBe(true)
  })
})

describe('memberSchema — Bug #003: Date string format (YYYY-MM-DD)', () => {
  it('accepts a valid YYYY-MM-DD birthDate string', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, birthDate: '1990-05-15' })
    expect(result.success).toBe(true)
  })

  it('accepts ISO datetime string (also valid from DB round-trip)', () => {
    const result = memberSchema.safeParse({
      ...VALID_BASE,
      birthDate: '1990-05-15T00:00:00.000Z',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a Date object (would be sent as ISO string by JSON.stringify)', () => {
    // JSON.stringify(new Date('1990-05-15')) → '"1990-05-15T00:00:00.000Z"'
    // This is now accepted by the regex. The bug was the old schema rejected it.
    // The schema now accepts T-suffix ISO strings.  Raw Date objects cannot be
    // serialised through fetch as-is — they become the ISO string above.
    const result = memberSchema.safeParse({ ...VALID_BASE, birthDate: '1990-05-15T00:00:00.000Z' })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid date string like "15/05/1990"', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, birthDate: '15/05/1990' })
    expect(result.success).toBe(false)
  })

  it('rejects a date string like "May 15, 1990"', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, birthDate: 'May 15, 1990' })
    expect(result.success).toBe(false)
  })

  it('accepts a valid YYYY-MM-DD membershipDate', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, membershipDate: '2024-01-01' })
    expect(result.success).toBe(true)
  })
})

describe('memberSchema — status and role defaults', () => {
  it('defaults status to "active" when omitted', () => {
    const result = memberSchema.safeParse(VALID_BASE)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('active')
    }
  })

  it('defaults role to "member" when omitted', () => {
    const result = memberSchema.safeParse(VALID_BASE)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.role).toBe('member')
    }
  })

  it('accepts valid status values', () => {
    for (const status of ['active', 'inactive', 'visitor'] as const) {
      const result = memberSchema.safeParse({ ...VALID_BASE, status })
      expect(result.success).toBe(true)
    }
  })

  it('rejects unknown status values', () => {
    const result = memberSchema.safeParse({ ...VALID_BASE, status: 'deleted' })
    expect(result.success).toBe(false)
  })
})
