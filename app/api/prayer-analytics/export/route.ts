import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { subDays, format } from 'date-fns'

export const dynamic = 'force-dynamic'

// GET /api/prayer-analytics/export - Export prayer analytics data
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

    // Check permissions
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'].includes(user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '30')
    const category = url.searchParams.get('category') || 'all'
    const status = url.searchParams.get('status') || 'all'
    const format_type = url.searchParams.get('format') || 'csv'

    const startDate = subDays(new Date(), days)
    const endDate = new Date()

    // Build where clause for filtering
    const whereClause: any = {
      churchId: user.churchId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    if (category !== 'all') {
      whereClause.categoryId = category
    }

    if (status !== 'all') {
      whereClause.status = status
    }

    // Get prayer requests for export
    const prayerRequests = await db.prayer_requests.findMany({
      where: whereClause,
      include: {
        prayer_categories: true,
        prayer_contacts: true,
        prayer_approvals: {
          include: {
            users: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (format_type === 'csv') {
      // Generate CSV export
      const headers = [
        'ID',
        'Fecha Creación',
        'Estado',
        'Prioridad',
        'Categoría',
        'Contacto',
        'Email',
        'Teléfono',
        'Es Anónimo',
        'Mensaje'
      ]

      const rows = prayerRequests.map((req: any) => [
        req.id,
        format(new Date(req.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        req.status,
        req.priority || 'normal',
        req.prayer_categories?.name || 'Sin categoría',
        req.prayer_contacts?.fullName || 'Usuario anónimo',
        req.prayer_contacts?.email || '',
        req.prayer_contacts?.phone || '',
        req.isAnonymous ? 'Sí' : 'No',
        `"${(req.message || '').replace(/"/g, '""')}"`
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map((row: any) => row.join(','))
      ].join('\n')

      const bom = '\ufeff'
      const csvWithBom = bom + csvContent

      return new NextResponse(csvWithBom, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="analisis-oraciones-${format(new Date(), 'yyyy-MM-dd')}.csv"`
        }
      })
    } else {
      // Return JSON format
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          period: `${days} días`,
          filters: {
            category: category === 'all' ? 'Todas' : category,
            status: status === 'all' ? 'Todos' : status
          },
          church: user.churches?.name || 'Iglesia',
          exportedBy: user.name || 'Usuario'
        },
        summary: {
          totalRequests: prayerRequests.length,
          approvedRequests: prayerRequests.filter((req: any) => req.status === 'approved').length,
          rejectedRequests: prayerRequests.filter((req: any) => req.status === 'rejected').length,
          pendingRequests: prayerRequests.filter((req: any) => req.status === 'pending').length
        },
        requests: prayerRequests.map((req: any) => ({
          id: req.id,
          createdAt: req.createdAt,
          status: req.status,
          priority: req.priority || 'normal',
          category: req.prayer_categories?.name || 'Sin categoría',
          contact: {
            name: req.prayer_contacts?.fullName || 'Usuario anónimo',
            email: req.prayer_contacts?.email || null,
            phone: req.prayer_contacts?.phone || null
          },
          isAnonymous: req.isAnonymous,
          message: req.message
        }))
      }

      return NextResponse.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="analisis-oraciones-${format(new Date(), 'yyyy-MM-dd')}.json"`
        }
      })
    }
  } catch (error) {
    console.error('Error exporting prayer analytics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
