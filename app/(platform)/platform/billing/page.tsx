import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import PlatformBillingClient from './_components/platform-billing-client'

export const metadata = {
  title: 'Suscripciones — Plataforma',
}

export default async function PlatformBillingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/platform/dashboard')
  }

  return <PlatformBillingClient />
}
