
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { MembersClient } from './_components/members-client'

export default async function MembersPage() {
  const session = await getServerSession(authOptions)

  console.log('==========================================')
  console.log('🔍 MEMBERS PAGE ACCESSED')
  console.log('Session exists:', !!session)
  console.log('User exists:', !!session?.user)
  console.log('User email:', session?.user?.email)
  console.log('User role:', session?.user?.role)
  console.log('User role type:', typeof session?.user?.role)
  console.log('Allowed roles:', ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'])
  console.log('Is role in allowed list:', session?.user?.role ? ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'].includes(session.user.role) : false)
  console.log('==========================================')

  if (!session?.user) {
    console.log('❌ NO SESSION - REDIRECTING TO SIGNIN')
    redirect('/auth/signin')
  }

  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'].includes(session.user.role)) {
    console.log('❌ ROLE NOT ALLOWED - REDIRECTING TO HOME')
    console.log('Actual role:', session.user.role)
    redirect('/home')
  }
  
  console.log('✅ ACCESS GRANTED - RENDERING MEMBERS PAGE')

  return (
    <MembersClient userRole={session.user.role} churchId={session.user.churchId || ''} />
  )
}
