import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { FormSubmissionsClient } from './_components/form-submissions-client'

export const metadata: Metadata = {
  title: 'Submissions de Formularios',
  description: 'Ver todas las respuestas y datos enviados a través de formularios personalizados'
}

export default async function FormSubmissionsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.churchId) {
    redirect('/auth/signin')
  }

  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
    redirect('/dashboard')
  }

  return (
    <FormSubmissionsClient 
      userRole={session.user.role}
      churchId={session.user.churchId}
    />
  )
}