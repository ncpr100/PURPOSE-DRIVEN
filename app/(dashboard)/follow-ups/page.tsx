

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { FollowUpsClient } from './_components/follow-ups-client'

export default async function FollowUpsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'].includes(session.user.role)) {
    redirect('/home')
  }

  return (
    <FollowUpsClient userRole={session.user.role} churchId={session.user.churchId || ''} />
  )
}

