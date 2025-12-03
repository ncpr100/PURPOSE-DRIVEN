
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SpiritualGiftsManagement from './_components/spiritual-gifts-management'

export default async function SpiritualGiftsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'].includes(session.user.role)) {
    redirect('/home')
  }

  return <SpiritualGiftsManagement />
}
