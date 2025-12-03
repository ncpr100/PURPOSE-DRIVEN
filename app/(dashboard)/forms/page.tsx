import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { FormsClient } from './_components/forms-client'

export const metadata: Metadata = {
  title: 'Gestión de Formularios',
  description: 'Crea y gestiona formularios personalizados para visitantes con códigos QR'
}

export default async function FormsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.churchId) {
    redirect('/auth/signin')
  }

  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER'].includes(session.user.role)) {
    redirect('/home')
  }

  return (
    <FormsClient 
      userRole={session.user.role}
      churchId={session.user.churchId}
    />
  )
}