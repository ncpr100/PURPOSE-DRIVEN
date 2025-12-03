
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { MembersClient } from './_components/members-client'

export default async function MembersPage() {
  console.log('🚀 MEMBERS PAGE: Loading members page...')
  
  const session = await getServerSession(authOptions)
  console.log('🚀 MEMBERS PAGE: Session user:', session?.user?.email, session?.user?.role, session?.user?.churchId)

  if (!session?.user) {
    console.log('❌ MEMBERS PAGE: No session, redirecting to signin')
    redirect('/auth/signin')
  }

  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
    console.log('❌ MEMBERS PAGE: Insufficient role, redirecting to home')
    redirect('/home')
  }

  console.log('✅ MEMBERS PAGE: Rendering MembersClient with role:', session.user.role, 'churchId:', session.user.churchId)
  return (
    <MembersClient userRole={session.user.role} churchId={session.user.churchId || ''} />
  )
}
