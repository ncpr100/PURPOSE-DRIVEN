import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ProfilePageClient } from './_components/profile-page-client'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Check if user has access to profile (all authenticated users can access their profile)
  const userRole = session.user.role || 'MIEMBRO'
  const churchId = session.user.churchId

  if (!churchId) {
    redirect('/dashboard')
  }

  return (
    <ProfilePageClient 
      userRole={userRole} 
      churchId={churchId}
    />
  )
}