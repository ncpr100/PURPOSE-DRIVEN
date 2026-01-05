import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Palette } from 'lucide-react'
import BrandedFormBuilder from './_components/branded-form-builder'

export const metadata: Metadata = {
  title: 'Constructor de Formularios | Khesed-tek',
  description: 'Crea formularios personalizados con códigos QR branded para tu iglesia'
}

export default async function FormBuilderPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Palette className="h-8 w-8 text-purple-600" />
          Constructor de Formularios
        </h1>
        <p className="text-muted-foreground">
          Crea formularios personalizados con códigos QR branded para eventos, registros y más
        </p>
      </div>
      
      <BrandedFormBuilder />
    </div>
  )
}