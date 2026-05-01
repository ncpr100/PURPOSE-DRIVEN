
'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    console.log(' Service Worker temporarily disabled for debugging')
    
    // Unregister any existing service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
          console.log('️ Unregistered service worker:', registration.scope)
        })
      })
    }
  }, [])

  return null // This component doesn't render anything
}
