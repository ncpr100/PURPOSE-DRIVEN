import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function IntelligentAnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
    redirect('/home')
  }

  // Redirect to analytics page with intelligent analytics tab
  redirect('/analytics#intelligent-analytics')
}
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