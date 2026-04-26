
import type { Metadata } from "next";
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { CosmosBackground } from '@/components/cosmos/cosmos-background'
import { CosmosSidebar } from '@/components/layout/cosmos-sidebar'
import { CosmosHeader } from '@/components/layout/cosmos-header'

export const metadata: Metadata = {
  title: { template: "%s | Khesed-Tek CMS", default: "Khesed-Tek CMS" },
  description: "Sistema de Inteligencia Ministerial para la Iglesia Latinoamericana",
};

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
    <div className="relative min-h-screen bg-[hsl(var(--brand-navy-deep))] overflow-hidden">
      {/* Living star field — z-index 0, fixed, pointer-events none */}
      <CosmosBackground />

      {/* Main layout grid — z-index 1 */}
      <div
        className="relative z-[1] grid h-screen"
        style={{
          gridTemplateRows: "56px 1fr",
          gridTemplateColumns: "216px 1fr",
        }}
      >
        {/* Header — spans full width */}
        <div className="col-span-2">
          <CosmosHeader />
        </div>

        {/* Sidebar */}
        <CosmosSidebar />

        {/* Main content area */}
        <main
          className="overflow-y-auto overflow-x-hidden cosmos-scrollbar"
          style={{ maxHeight: "calc(100vh - 56px)" }}
        >
          <div className="min-h-full p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
