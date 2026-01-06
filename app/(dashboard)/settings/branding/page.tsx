import { Suspense } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import BrandingPageClient from './_components/branding-page-client'

export const metadata = {
  title: 'Configuración de Marca | Khesed-tek',
  description: 'Personaliza los colores y branding de tu iglesia'
}

export default async function BrandingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Only ADMIN_IGLESIA and above can access branding settings
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN_IGLESIA']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/(dashboard)/members')
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<div>Cargando...</div>}>
        <BrandingPageClient churchId={session.user.churchId} />
      </Suspense>
    </div>
  )
}
