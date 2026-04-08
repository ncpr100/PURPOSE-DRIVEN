/**
 * Unit tests for lib/validations/volunteer.ts
 *
 * Covers Bug #004 documented in PROJECT_SOURCE_OF_TRUTH.md:
 *   Bug #004 — volunteerCreateSchema must accept availability: null
 *   (the form sends null, not a structured object)
 *
 * Run: npx vitest run __tests__/volunteer.validation.test.ts
 */

import { describe, it, expect } from 'vitest'
import { volunteerCreateSchema } from '@/lib/validations/volunteer'

// Minimal valid volunteer payload
const VALID_BASE = {
  firstName: 'María',
  lastName: 'López',
  ministryId: 'no-ministry',
}

describe('volunteerCreateSchema — required fields', () => {
  it('accepts a valid volunteer with only required fields', () => {
    const result = volunteerCreateSchema.safeParse(VALID_BASE)
    expect(result.success).toBe(true)
  })

  it('rejects when firstName is empty', () => {
    const result = volunteerCreateSchema.safeParse({ ...VALID_BASE, firstName: '' })
    expect(result.success).toBe(false)
  })

  it('accepts Spanish accent characters in names', () => {
    const result = volunteerCreateSchema.safeParse({
      ...VALID_BASE,
      firstName: 'José',
      lastName: 'Martínez',
    })
    expect(result.success).toBe(true)
  })
})

describe('volunteerCreateSchema — Bug #004: availability: null', () => {
  it('accepts availability: null (form sends null for empty field)', () => {
    const result = volunteerCreateSchema.safeParse({ ...VALID_BASE, availability: null })
    expect(result.success).toBe(true)
  })

  it('accepts availability: undefined (field omitted)', () => {
    const result = volunteerCreateSchema.safeParse({ ...VALID_BASE })
    expect(result.success).toBe(true)
  })

  it('accepts availability as a plain string', () => {
    const result = volunteerCreateSchema.safeParse({
      ...VALID_BASE,
      availability: 'Lunes y miércoles por las tardes',
    })
    expect(result.success).toBe(true)
  })

  it('does NOT accept availability as a structured object (old broken schema expectation)', () => {
    // The old schema expected z.object({...}) — the new schema is z.string().optional().nullable()
    // so a structured object should be rejected (it's not a string)
    const result = volunteerCreateSchema.safeParse({
      ...VALID_BASE,
      availability: { monday: true, tuesday: false },
    })
    expect(result.success).toBe(false)
  })
})

describe('volunteerCreateSchema — optional fields', () => {
  it('accepts a valid email', () => {
    const result = volunteerCreateSchema.safeParse({
      ...VALID_BASE,
      email: 'maria@iglesia.com',
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty string email (form default)', () => {
    const result = volunteerCreateSchema.safeParse({ ...VALID_BASE, email: '' })
    expect(result.success).toBe(true)
  })

  it('rejects clearly invalid email', () => {
    const result = volunteerCreateSchema.safeParse({ ...VALID_BASE, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('accepts an empty skills array', () => {
    const result = volunteerCreateSchema.safeParse({ ...VALID_BASE, skills: [] })
    expect(result.success).toBe(true)
  })

  it('accepts a non-empty skills array', () => {
    const result = volunteerCreateSchema.safeParse({
      ...VALID_BASE,
      skills: ['Música', 'Tecnología'],
    })
    expect(result.success).toBe(true)
  })

  it('accepts ministryId: "no-ministry"', () => {
    const result = volunteerCreateSchema.safeParse({ ...VALID_BASE, ministryId: 'no-ministry' })
    expect(result.success).toBe(true)
  })
})
