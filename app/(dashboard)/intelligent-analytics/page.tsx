import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function IntelligentAnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
    redirect('/home')
  }

  // Redirect to analytics page with intelligent analytics tab
  redirect('/analytics#intelligent-analytics')
}