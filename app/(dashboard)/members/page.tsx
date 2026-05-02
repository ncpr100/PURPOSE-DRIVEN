
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { MembersClient } from './_components/members-client'

export default async function MembersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const allowedRoles = ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER']
  const hasAccess = allowedRoles.includes(session.user.role)

  if (!hasAccess) {
    redirect('/home')
  }

  return (
    <MembersClient userRole={session.user.role} churchId={session.user.churchId || ''} />
  )
}
