import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { VisitorsClient } from './_components/visitors-client'

export default async function VisitorsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.churchId) redirect('/auth/signin')

  return (
    <VisitorsClient
      userRole={session.user.role as string}
      churchId={session.user.churchId as string}
    />
  )
}
