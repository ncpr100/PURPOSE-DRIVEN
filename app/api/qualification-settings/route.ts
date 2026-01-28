import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET /api/qualification-settings - Get qualification settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    // Get qualification settings
    const settings = await db.church_qualification_settings.findMany({
      where: {
        churchId: user.churchId
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ settings, success: true })
  } catch (error) {
    console.error('Error fetching qualification settings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/qualification-settings - Create qualification setting
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    
    // Check if settings already exist (churchId is unique)
    const existing = await db.church_qualification_settings.findUnique({
      where: { churchId: user.churchId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existen configuraciones para esta iglesia' }, 
        { status: 409 }
      )
    }

    const setting = await db.church_qualification_settings.create({
      data: {
        id: nanoid(),
        churchId: user.churchId,
        volunteerMinMembershipDays: body.volunteerMinMembershipDays || 0,
        volunteerRequireActiveStatus: body.volunteerRequireActiveStatus ?? true,
        volunteerRequireSpiritualAssessment: body.volunteerRequireSpiritualAssessment ?? false,
        volunteerMinSpiritualScore: body.volunteerMinSpiritualScore || 0,
        leadershipMinMembershipDays: body.leadershipMinMembershipDays || 365,
        leadershipRequireVolunteerExp: body.leadershipRequireVolunteerExp ?? false,
        leadershipMinVolunteerDays: body.leadershipMinVolunteerDays || 0,
        leadershipRequireTraining: body.leadershipRequireTraining ?? false,
        leadershipMinSpiritualScore: body.leadershipMinSpiritualScore || 70,
        leadershipMinLeadershipScore: body.leadershipMinLeadershipScore || 60,
        enableSpiritualMaturityScoring: body.enableSpiritualMaturityScoring ?? true,
        enableLeadershipAptitudeScoring: body.enableLeadershipAptitudeScoring ?? true,
        enableMinistryPassionMatching: body.enableMinistryPassionMatching ?? true,
        spiritualGiftsWeight: body.spiritualGiftsWeight || 0.4,
        availabilityWeight: body.availabilityWeight || 0.25,
        experienceWeight: body.experienceWeight || 0.15,
        ministryPassionWeight: body.ministryPassionWeight || 0.1,
        activityWeight: body.activityWeight || 0.1,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ setting, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating qualification setting:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/qualification-settings - Update qualification setting
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
    }

    // Verify ownership
    const existing = await db.church_qualification_settings.findFirst({
      where: { id, churchId: user.churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 })
    }

    const updated = await db.church_qualification_settings.update({
      where: { id },
      data: {
        ...(body.volunteerMinMembershipDays !== undefined && { volunteerMinMembershipDays: body.volunteerMinMembershipDays }),
        ...(body.volunteerRequireActiveStatus !== undefined && { volunteerRequireActiveStatus: body.volunteerRequireActiveStatus }),
        ...(body.volunteerRequireSpiritualAssessment !== undefined && { volunteerRequireSpiritualAssessment: body.volunteerRequireSpiritualAssessment }),
        ...(body.volunteerMinSpiritualScore !== undefined && { volunteerMinSpiritualScore: body.volunteerMinSpiritualScore }),
        ...(body.leadershipMinMembershipDays !== undefined && { leadershipMinMembershipDays: body.leadershipMinMembershipDays }),
        ...(body.leadershipRequireVolunteerExp !== undefined && { leadershipRequireVolunteerExp: body.leadershipRequireVolunteerExp }),
        ...(body.leadershipMinVolunteerDays !== undefined && { leadershipMinVolunteerDays: body.leadershipMinVolunteerDays }),
        ...(body.leadershipRequireTraining !== undefined && { leadershipRequireTraining: body.leadershipRequireTraining }),
        ...(body.leadershipMinSpiritualScore !== undefined && { leadershipMinSpiritualScore: body.leadershipMinSpiritualScore }),
        ...(body.leadershipMinLeadershipScore !== undefined && { leadershipMinLeadershipScore: body.leadershipMinLeadershipScore }),
        ...(body.enableSpiritualMaturityScoring !== undefined && { enableSpiritualMaturityScoring: body.enableSpiritualMaturityScoring }),
        ...(body.enableLeadershipAptitudeScoring !== undefined && { enableLeadershipAptitudeScoring: body.enableLeadershipAptitudeScoring }),
        ...(body.enableMinistryPassionMatching !== undefined && { enableMinistryPassionMatching: body.enableMinistryPassionMatching }),
        ...(body.spiritualGiftsWeight !== undefined && { spiritualGiftsWeight: body.spiritualGiftsWeight }),
        ...(body.availabilityWeight !== undefined && { availabilityWeight: body.availabilityWeight }),
        ...(body.experienceWeight !== undefined && { experienceWeight: body.experienceWeight }),
        ...(body.ministryPassionWeight !== undefined && { ministryPassionWeight: body.ministryPassionWeight }),
        ...(body.activityWeight !== undefined && { activityWeight: body.activityWeight }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ setting: updated, success: true })
  } catch (error) {
    console.error('Error updating qualification setting:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
