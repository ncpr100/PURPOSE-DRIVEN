
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    // Only redirect authenticated users
    if (status !== 'loading' && session?.user) {
      const destination = session.user.role === 'SUPER_ADMIN' ? '/platform/dashboard' : '/home'
      window.location.href = destination
    }
  }, [session, status])

  // For unauthenticated users, redirect to signin
  if (status !== 'loading' && !session) {
    redirect('/auth/signin')
  }

  // Show branded loading page while checking session
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">Kḥesed-tek</h1>
          <p className="text-2xl text-white/90">Church Management Systems</p>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="mt-6 text-white/80 text-lg">
          {status === 'loading' ? 'Iniciando sistema...' : 'Redirigiendo...'}
        </p>
      </div>
    </div>
  )
}
