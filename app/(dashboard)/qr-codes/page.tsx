import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import QRCodesClient from './_components/qr-codes-client'

export const metadata: Metadata = {
  title: 'QR Codes | Khesed-tek',
  description: 'Gestión de códigos QR personalizados'
}

export default async function QRCodesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">QR Codes</h1>
        <p className="text-muted-foreground">
          Crea y administra códigos QR personalizados para tu iglesia
        </p>
      </div>

      <QRCodesClient />
    </div>
  )
}
