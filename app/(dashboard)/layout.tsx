
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
      {/* Flex column: header row + body row. On mobile, sidebar becomes a fixed overlay. */}
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Header — full width */}
        <CosmosHeader />
        {/* Body row: sidebar + main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar — flex-shrink-0 on desktop, fixed overlay on mobile (handled in component) */}
          <CosmosSidebar />
          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionErrorBoundary>
  )
}
