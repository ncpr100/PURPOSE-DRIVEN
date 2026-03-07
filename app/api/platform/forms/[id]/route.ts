/**
 * Platform Form Detail API — SUPER_ADMIN only
 * GET    /api/platform/forms/[id]   → get single form
 * PATCH  /api/platform/forms/[id]   → update fields (isActive, name, fields…)
 * DELETE /api/platform/forms/[id]   → soft-delete
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

async function requireSuperAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) }
  }
  if (session.user.role !== 'SUPER_ADMIN') {
    return { error: NextResponse.json({ error: 'Solo Super Admin' }, { status: 403 }) }
  }
  return { session }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireSuperAdmin()
  if (auth.error) return auth.error

  const form = await db.platformForm.findUnique({
    where: { id: params.id, deletedAt: null },
    include: {
      _count: { select: { submissions: true } },
      createdBy: { select: { name: true, email: true } }
    }
  })

  if (!form) return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })

  return NextResponse.json({ data: form })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireSuperAdmin()
  if (auth.error) return auth.error

  let body: Record<string, unknown>
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const existing = await db.platformForm.findUnique({
    where: { id: params.id, deletedAt: null }
  })
  if (!existing) return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })

  const { name, description, fields, style, settings, isActive, isPublic, campaignTag, leadScore } = body

  const updated = await db.platformForm.update({
    where: { id: params.id },
    data: {
      ...(name        !== undefined ? { name: String(name).trim() }        : {}),
      ...(description !== undefined ? { description: description ? String(description).trim() : null } : {}),
      ...(fields      !== undefined ? { fields }                           : {}),
      ...(style       !== undefined ? { style }                            : {}),
      ...(settings    !== undefined ? { settings }                         : {}),
      ...(isActive    !== undefined ? { isActive: Boolean(isActive) }      : {}),
      ...(isPublic    !== undefined ? { isPublic: Boolean(isPublic) }      : {}),
      ...(campaignTag !== undefined ? { campaignTag: String(campaignTag) } : {}),
      ...(leadScore   !== undefined ? { leadScore: Number(leadScore) }     : {}),
    }
  })

  return NextResponse.json({ data: updated, success: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireSuperAdmin()
  if (auth.error) return auth.error

  const existing = await db.platformForm.findUnique({
    where: { id: params.id, deletedAt: null }
  })
  if (!existing) return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })

  // Soft delete
  await db.platformForm.update({
    where: { id: params.id },
    data: { deletedAt: new Date(), isActive: false }
  })

  return NextResponse.json({ success: true, message: 'Formulario eliminado' })
}
