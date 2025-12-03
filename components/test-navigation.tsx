'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function TestNavigation() {
  const { data: session, status } = useSession()
  
  console.log('🧪 TEST NAVIGATION: Status:', status, 'Session:', session?.user)
  
  const testRoutes = [
    { title: 'Test Home', href: '/home' },
    { title: 'Test Members', href: '/members' },
    { title: 'Test Analytics', href: '/analytics' },
    { title: 'Test Volunteers', href: '/volunteers' },
  ]
  
  return (
    <div className="p-4 border rounded bg-yellow-50">
      <h3 className="font-bold mb-2">🧪 Navigation Test Component</h3>
      <p className="text-sm mb-2">Session Status: {status}</p>
      <p className="text-sm mb-2">User Role: {session?.user?.role}</p>
      <p className="text-sm mb-4">User Email: {session?.user?.email}</p>
      
      <div className="space-y-2">
        {testRoutes.map((route) => (
          <div key={route.href} className="flex items-center gap-2">
            <Link 
              href={route.href}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              onClick={() => console.log('🧪 Clicked:', route.href)}
            >
              {route.title}
            </Link>
            <a 
              href={route.href} 
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              onClick={() => console.log('🧪 Regular link clicked:', route.href)}
            >
              {route.title} (Regular)
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}