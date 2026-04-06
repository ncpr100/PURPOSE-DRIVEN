import { Metadata } from 'next'
import { Suspense } from 'react'
import FormViewer from './_components/form-viewer'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Formulario | Khesed-tek',
  description: 'Formulario personalizado'
}

export default function FormViewerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <FormViewer />
    </Suspense>
  )
}