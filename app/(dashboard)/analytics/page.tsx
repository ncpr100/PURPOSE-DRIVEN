import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AnalyticsPageClient from './_components/analytics-page-client'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'].includes(session.user.role)) {
    redirect('/home')
  }

  return (
    <AnalyticsPageClient userRole={session.user.role} churchId={session.user.churchId || ''} />
  )
}
