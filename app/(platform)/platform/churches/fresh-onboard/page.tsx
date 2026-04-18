
import { Suspense } from 'react'
import FreshChurchWizard from '@/components/platform/fresh-church-wizard'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function FreshChurchOnboardPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      }>
        <FreshChurchWizard />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: 'Crear Nueva Iglesia - Khesed-tek',
  description: 'Wizard de configuración para crear nuevo tenant de iglesia',
}
