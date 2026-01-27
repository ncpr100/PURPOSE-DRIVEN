import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PlatformFormsClient from './_components/platform-forms-client'

export const metadata: Metadata = {
  title: 'Platform Forms | Khesed-tek Platform',
  description: 'Gestiona formularios y códigos QR para marketing de la plataforma'
}

export default async function PlatformFormsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto p-3 md:p-6">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg flex-shrink-0">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Platform Marketing Forms</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Crea formularios y códigos QR para campañas de marketing de Khesed-tek
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 md:p-4 mt-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 text-sm md:text-base">Platform Marketing Tools</h3>
              <p className="text-xs md:text-sm text-blue-700 mt-1">
                Utiliza las mismas herramientas poderosas que usan las iglesias para hacer crecer tu plataforma. 
                Crea formularios de captura de leads, códigos QR para marketing offline, y campañas integradas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PlatformFormsClient userRole={session.user.role} />
    </div>
  )
}