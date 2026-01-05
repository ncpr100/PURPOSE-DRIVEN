
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (session?.user && !isRedirecting) {
      setIsRedirecting(true)
      // Add small delay to prevent middleware collision during redirect
      const timer = setTimeout(() => {
        try {
          if (session.user.role === 'SUPER_ADMIN') {
            router.replace('/platform/dashboard')
          } else {
            router.replace('/home')
          }
        } catch (error) {
          console.error('Redirect error:', error)
          // Fallback redirect
          window.location.href = session.user.role === 'SUPER_ADMIN' ? '/platform/dashboard' : '/home'
        }
      }, 200)
      return () => clearTimeout(timer)
    } else if (status !== 'loading' && !session?.user && !isRedirecting) {
      setIsRedirecting(true)
      router.replace('/auth/signin')
    }
  }, [session, status, router, isRedirecting])

  // Show a safe loading state while redirecting
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
        {!session && (
          <div className="mt-6">
            <a
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              🔐 Iniciar Sesión
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Kḥesed-tek Church Management Systems</h1>
        <p className="text-lg opacity-80">Cargando sistema...</p>
      </div>
    </div>
  )
}
