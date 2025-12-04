
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { MembersClient } from './_components/members-client'

console.log('📄 MEMBERS PAGE FILE LOADING - Server-side execution')

export default async function MembersPage() {
  console.log('🔥 MEMBERS PAGE FUNCTION EXECUTING')
  
  const session = await getServerSession(authOptions)
  
  console.log('👤 MEMBERS PAGE - Session:', {
    exists: !!session,
    userExists: !!session?.user,
    role: session?.user?.role,
    email: session?.user?.email
  })

  if (!session?.user) {
    console.log('❌ NO USER - REDIRECTING TO SIGNIN')
    redirect('/auth/signin')
  }

  const allowedRoles = ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER']
  const hasAccess = allowedRoles.includes(session.user.role)
  
  console.log('🔐 ACCESS CHECK:', {
    userRole: session.user.role,
    allowedRoles,
    hasAccess
  })

  if (!hasAccess) {
    console.log('❌ ROLE NOT ALLOWED - REDIRECTING TO HOME')
    redirect('/home')
  }
  
  console.log('✅ ACCESS GRANTED - RENDERING MEMBERS CLIENT')

  return (
    <MembersClient userRole={session.user.role} churchId={session.user.churchId || ''} />
  )
}
