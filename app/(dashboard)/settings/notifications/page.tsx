
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NotificationPreferences } from '../../notifications/_components/notification-preferences'

export const metadata: Metadata = {
  title: 'Configuración de Notificaciones | Kḥesed-tek',
  description: 'Configura tus preferencias de notificación',
}

export default function NotificationSettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-2">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Configuración
      </Link>
      <NotificationPreferences />
    </div>
  )
}
