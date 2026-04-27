
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { CosmosBackground } from '@/components/cosmos/cosmos-background'
import { CosmosHeader } from '@/components/layout/cosmos-header'
import { CosmosSidebar } from '@/components/layout/cosmos-sidebar'
import { SessionErrorBoundary } from '@/components/error-boundary'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <SessionErrorBoundary>
      <CosmosBackground />
      <div
        className="relative z-10 h-screen overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateRows: '56px 1fr',
          gridTemplateColumns: '216px 1fr',
        }}
      >
        {/* Header spans both columns */}
        <div style={{ gridColumn: '1 / -1' }}>
          <CosmosHeader />
        </div>
        {/* Sidebar */}
        <CosmosSidebar />
        {/* Main content */}
        <main className="overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SessionErrorBoundary>
  )
}
