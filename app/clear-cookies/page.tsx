'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function ClearCookiesPage() {
  const router = useRouter()

  useEffect(() => {
    const clearAllCookies = async () => {
      // Sign out from NextAuth
      await signOut({ redirect: false })

      // Clear all cookies via document.cookie
      const cookies = document.cookie.split(';')
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
      }

      // Clear localStorage and sessionStorage
      localStorage.clear()
      sessionStorage.clear()

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/auth/signin')
      }, 2000)
    }

    clearAllCookies()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Clearing Session Data...</h1>
        <p className="text-gray-600">You will be redirected to login shortly.</p>
      </div>
    </div>
  )
}
