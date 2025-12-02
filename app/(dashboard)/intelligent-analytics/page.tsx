'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Brain } from 'lucide-react'

export default function IntelligentAnalyticsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to analytics page with intelligent analytics tab
    // We'll use a hash to indicate the tab, then update analytics page to handle it
    router.push('/analytics#intelligent-analytics')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <Brain className="h-12 w-12 text-primary animate-pulse" />
            <Loader2 className="h-6 w-6 absolute -top-1 -right-1 text-primary animate-spin" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Cargando Analíticas Inteligentes...</h3>
          <p className="text-sm text-muted-foreground">
            Redirigiendo al módulo de inteligencia artificial
          </p>
        </div>
      </div>
    </div>
  )
}