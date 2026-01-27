import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { 
  emailQueue, 
  renderEmailTemplate,
  shouldSendDigest,
  DigestEmailData 
} from '@/lib/email'
import { DigestEmail } from '@/components/email-templates/digest-email'
import { z } from 'zod'

const sendDigestEmailSchema = z.object({
  period: z.enum(['DAILY', 'WEEKLY']),
  churchId: z.string().optional(), // If not provided, send for all churches
  userId: z.string().optional(), // If not provided, send to all eligible users
  dateOverride: z.string().optional(), // For testing or manual sending
})
// POST - Send digest emails
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const sessionUser = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true, role: true }
    })
    if (!sessionUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 400 })
    // Check if user has permission to send digest emails
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(sessionUser.role)) {
      return NextResponse.json({ error: 'Sin permisos para enviar emails digest' }, { status: 403 })
    const body = await request.json()
    const validatedData = sendDigestEmailSchema.parse(body)
    // Calculate date range for digest
    const endDate = validatedData.dateOverride ? new Date(validatedData.dateOverride) : new Date()
    const startDate = new Date(endDate)
    if (validatedData.period === 'DAILY') {
      startDate.setDate(startDate.getDate() - 1)
    } else {
      startDate.setDate(startDate.getDate() - 7)
    // Determine target churches
    const churches = validatedData.churchId 
      ? [{ id: validatedData.churchId }]
      : sessionUser.role === 'SUPER_ADMIN' 
        ? await prisma.churches.findMany({ select: { id: true, name: true } })
        : [{ id: sessionUser.churchId!, name: '' }]
    let totalSent = 0
    const results = []
    for (const church of churches) {
      // Get church details
      const churchDetails = await prisma.churches.findUnique({
        where: { id: church.id },
        select: { name: true }
      })
      if (!churchDetails) continue
      // Get users eligible for digest emails
      let userQuery: any = {
        churchId: church.id,
        isActive: true,
        notificationPreferences: {
          digestEnabled: true,
          digestFrequency: validatedData.period,
          emailEnabled: true
        }
      }
      if (validatedData.userId) {
        userQuery.id = validatedData.userId;
      }
      
      const users = await prisma.users.findMany({
        where: userQuery,
        include: {
          notification_preferences: true
        }
      });
      
      // Filter users that should receive digest
      const eligibleUsers = users.filter((user: any) => {
        const preferences = user.notification_preferences;
        if (!preferences) return false;
        
        return shouldSendDigest(preferences, validatedData.period);
      });
      
      if (eligibleUsers.length === 0) {
        console.log(`No eligible users for ${validatedData.period} digest in church ${churchDetails.name}`);
        continue;
      }
      
      // Get notifications for the period for this church
      const notifications = await prisma.notifications.findMany({
        where: {
          churchId: church.id,
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          // Only include notifications that would be sent via email
          OR: [
            { isGlobal: true },
            { targetRole: { in: eligibleUsers.map((u: any) => u.role) } },
            { targetUser: { in: eligibleUsers.map((u: any) => u.id) } }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      if (notifications.length === 0) {
        results.push({
          churchName: churchDetails.name,
          sent: 0,
          reason: 'No notifications in period'
        });
        continue;
      }
      
      // Prepare digest emails for each eligible user
      const emails = eligibleUsers.map((user: any) => {
        // Filter notifications relevant to this user
        const userNotifications = notifications.filter((notification: any) => {
          if (notification.isGlobal) return true;
          if (notification.targetUser === user.id) return true;
          if (notification.targetRole === user.role) return true;
          return false;
        });
        
        if (userNotifications.length === 0) return null;
        
        const emailData: DigestEmailData = {
          user: {
            email: user.email,
            name: user.name || undefined
          },
          church: {
            name: churchDetails.name,
            id: church.id
          },
          notifications: userNotifications.map((n: any) => ({
            title: n.title,
            message: n.message,
            type: n.type as any,
            category: n.category || undefined,
            priority: n.priority as any,
            actionUrl: n.actionUrl || undefined,
            actionLabel: n.actionLabel || undefined,
            createdAt: n.createdAt.toISOString()
          })),
          period: validatedData.period,
          date: endDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
        
        const emailComponent = DigestEmail({
          userName: emailData.user.name,
          churchName: emailData.church.name,
          notifications: emailData.notifications,
          period: emailData.period,
          date: emailData.date
        });
        
        const emailHtml = renderEmailTemplate(emailComponent);
        const periodLabel = validatedData.period === 'DAILY' ? 'Diario' : 'Semanal';
        return {
          to: user.email,
          subject: `📊 Resumen ${periodLabel} - ${churchDetails.name} (${userNotifications.length} notificaciones)`,
          html: emailHtml,
          userName: user.name || 'Estimado miembro'
        };
      }).filter(Boolean) as any[];
      
      if (emails.length > 0) {
        await emailQueue.addBulk(emails);
        totalSent += emails.length;
        console.log(`📊 Queued ${emails.length} digest emails for ${churchDetails.name} (${validatedData.period})`);
      }
      
      results.push({
        churchName: churchDetails.name,
        sent: emails.length,
        notificationCount: notifications.length,
        eligibleUsers: eligibleUsers.length
      });
    return NextResponse.json({
      success: true,
      period: validatedData.period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      totalSent,
      churches: results
  } catch (error) {
    console.error('Error sending digest emails:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error.errors },
        { status: 400 }
      )
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
// GET - Preview digest content
export async function GET(request: NextRequest) {
    const user = await prisma.users.findUnique({
      select: { id: true, churchId: true, role: true, name: true }
    if (!user || !user.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') || 'DAILY') as 'DAILY' | 'WEEKLY'
    // Calculate date range
    const endDate = new Date()
    if (period === 'DAILY') {
    // Get church details
    const church = await prisma.churches.findUnique({
      where: { id: user.churchId },
      select: { name: true }
    if (!church) {
      return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 })
    // Get notifications for the period
    const notifications = await prisma.notifications.findMany({
      where: {
        churchId: user.churchId,
        createdAt: {
          gte: startDate,
          lte: endDate
        OR: [
          { isGlobal: true },
          { targetRole: user.role },
          { targetUser: user.id }
        ]
      orderBy: {
        createdAt: 'desc'
    // Ejemplo de cómo se verían los datos para el email
    const emailData = {
      churchName: "Iglesia de Ejemplo",
      userName: "Admin",
      frequency: "Diario",
      notifications: notifications.map((n: any) => ({
        id: n.id,
        message: n.message,
        type: n.type,
        createdAt: n.createdAt,
        url: n.url
      }))
    };
    return NextResponse.json(emailData)
    console.error('Error getting digest preview:', error)
