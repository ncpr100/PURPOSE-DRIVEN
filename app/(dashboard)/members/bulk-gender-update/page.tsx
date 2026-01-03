import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BulkGenderUpdateClient } from '../_components/bulk-gender-update-client'

export default async function BulkGenderUpdatePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Only admins and pastors can access bulk update
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/members')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Actualización Masiva de Género</h1>
        <p className="text-muted-foreground">
          Herramientas para actualizar la información de género de múltiples miembros a la vez
        </p>
      </div>
      
      <BulkGenderUpdateClient userRole={session.user.role} />
    </div>
  )
}