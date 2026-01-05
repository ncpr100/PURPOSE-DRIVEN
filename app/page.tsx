
'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      // Immediate redirect based on role
      const destination = session.user.role === 'SUPER_ADMIN' ? '/platform/dashboard' : '/home'
      window.location.href = destination
    } else {
      // No session - redirect to signin
      window.location.href = '/auth/signin'
    }
  }, [session, status])

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Kḥesed-tek Platform
        </h2>
        <p className="mt-2 text-gray-600">
          {status === 'loading' ? 'Verificando sesión...' : 'Redirigiendo...'}
        </p>
      </div>
    </div>
  )
}
