import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * CRUD for DynamicQRCode – accessible only by SUPER_ADMIN.
 */

// ─── helpers ────────────────────────────────────────────────────────────────
function nanoid(length = 8): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  const randomValues = new Uint8Array(length)
  // Use crypto if available (Node 19+), otherwise Math.random fallback
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues)
    for (const byte of randomValues) {
      id += alphabet[byte % alphabet.length]
    }
  } else {
    for (let i = 0; i < length; i++) {
      id += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
  }
  return id
}

async function requireSuperAdmin(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) }
  }
  if (session.user.role !== 'SUPER_ADMIN') {
    return { error: NextResponse.json({ error: 'Solo accesible para Super Admin' }, { status: 403 }) }
  }
  return { session }
}

// ─── GET: list all dynamic QR codes ─────────────────────────────────────────
export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request)
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit    = Math.min(100, parseInt(searchParams.get('limit') || '20'))
  const type     = searchParams.get('type') || undefined
  const isActive = searchParams.has('isActive')
    ? searchParams.get('isActive') === 'true'
    : undefined

  const where = {
    ...(type     ? { destinationType: type } : {}),
    ...(isActive !== undefined ? { isActive } : {}),
  }

  const [items, total] = await Promise.all([
    db.dynamicQRCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip:  (page - 1) * limit,
      take:  limit,
      include: { _count: { select: { scans: true } } },
    }),
    db.dynamicQRCode.count({ where }),
  ])

  return NextResponse.json({ data: items, meta: { total, page, limit } })
}

// ─── POST: create a new dynamic QR code ─────────────────────────────────────
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin(request)
  if (auth.error) return auth.error

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const { name, destinationType = 'url', destinationUrl, config = {}, notes } = body

  if (!name?.trim())            return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  if (!destinationUrl?.trim())  return NextResponse.json({ error: 'La URL de destino es requerida' }, { status: 400 })

  // Validate destinationUrl is a proper URL
  try { new URL(destinationUrl) } catch {
    return NextResponse.json({ error: 'URL de destino inválida' }, { status: 400 })
  }

  const validTypes = ['url', 'form', 'payment', 'event', 'survey']
  if (!validTypes.includes(destinationType)) {
    return NextResponse.json({ error: `Tipo inválido. Use: ${validTypes.join(', ')}` }, { status: 400 })
  }

  // Generate unique short code (retry up to 5x on collision)
  let shortCode = ''
  for (let attempt = 0; attempt < 5; attempt++) {
    shortCode = nanoid(8)
    const existing = await db.dynamicQRCode.findUnique({ where: { shortCode } })
    if (!existing) break
    shortCode = ''
  }

  if (!shortCode) {
    return NextResponse.json({ error: 'No se pudo generar código único' }, { status: 500 })
  }

  const qr = await db.dynamicQRCode.create({
    data: {
      shortCode,
      name:            name.trim(),
      destinationType,
      destinationUrl:  destinationUrl.trim(),
      config,
      notes:           notes?.trim() || null,
      createdById:     auth.session!.user.id,
    },
  })

  return NextResponse.json({ data: qr }, { status: 201 })
}

// ─── PATCH: update destination URL or config of a QR code ───────────────────
export async function PATCH(request: NextRequest) {
  const auth = await requireSuperAdmin(request)
  if (auth.error) return auth.error

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const { id, destinationUrl, name, notes, config, isActive } = body

  if (!id) return NextResponse.json({ error: 'El id es requerido' }, { status: 400 })

  const existing = await db.dynamicQRCode.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Código QR no encontrado' }, { status: 404 })

  // Validate URL if provided
  if (destinationUrl !== undefined) {
    if (!destinationUrl?.trim()) {
      return NextResponse.json({ error: 'La URL no puede estar vacía' }, { status: 400 })
    }
    try { new URL(destinationUrl) } catch {
      return NextResponse.json({ error: 'URL de destino inválida' }, { status: 400 })
    }
  }

  const updated = await db.dynamicQRCode.update({
    where: { id },
    data:  {
      ...(destinationUrl !== undefined ? { destinationUrl: destinationUrl.trim() } : {}),
      ...(name       !== undefined     ? { name: name.trim() }           : {}),
      ...(notes      !== undefined     ? { notes: notes?.trim() || null } : {}),
      ...(config     !== undefined     ? { config }                       : {}),
      ...(isActive   !== undefined     ? { isActive }                     : {}),
    },
  })

  return NextResponse.json({ data: updated })
}

// ─── DELETE: soft-delete (deactivate) a QR code ─────────────────────────────
export async function DELETE(request: NextRequest) {
  const auth = await requireSuperAdmin(request)
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'El id es requerido' }, { status: 400 })

  const existing = await db.dynamicQRCode.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Código QR no encontrado' }, { status: 404 })

  // Soft delete: deactivate
  await db.dynamicQRCode.update({ where: { id }, data: { isActive: false } })

  return NextResponse.json({ success: true, message: 'Código QR desactivado' })
}
