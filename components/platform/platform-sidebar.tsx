
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Building2,
  Users,
  User,
  BarChart3,
  Settings,
  ArrowLeft,
  Book,
  MessageCircle,
  Globe,
  FileText,
  Key,
  ClipboardList,
  QrCode,
  Menu,
  Share2
} from 'lucide-react'

const navigation = [
  { name: 'Panel de Control', href: '/platform/dashboard', icon: LayoutDashboard },
  { name: 'Iglesias', href: '/platform/churches', icon: Building2 },
  { name: 'Usuarios', href: '/platform/users', icon: Users },
  { name: 'Facturas', href: '/platform/invoices', icon: FileText },
  { name: 'Credenciales', href: '/platform/tenant-credentials', icon: Key },
  { name: 'Servicios Web', href: '/platform/website-services', icon: Globe },
  { name: 'Marketing Tools', href: '/platform/forms', icon: ClipboardList },
  { name: 'Redes Sociales', href: '/platform/social-media', icon: Share2 },
  { name: 'Analytics', href: '/platform/analytics', icon: BarChart3 },
  { name: 'Mi Perfil', href: '/platform/profile', icon: User },
  { name: 'Configuración', href: '/platform/settings', icon: Settings },
  { name: 'Config. Soporte', href: '/platform/support-settings', icon: MessageCircle },
  { name: 'Documentación', href: '/platform/help', icon: Book },
]

// Desktop Sidebar Component
function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <div className="hidden md:flex w-64 bg-gray-900 text-white flex-col">
      {/* Logo */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Khesed-tek CMS"
            width={48}
            height={48}
            className="rounded-md object-contain"
          />
          <div>
            <h1 className="text-sm font-bold leading-tight">Kḥesed-tek</h1>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>
        </div>
      </div>

      <SidebarNavigation pathname={pathname} />
    </div>
  )
}

// Mobile Sidebar Component
function MobileSidebar({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="bg-gray-900 text-white h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 pb-2">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Khesed-tek CMS"
                width={48}
                height={48}
                className="rounded-md object-contain"
              />
              <div>
                <h1 className="text-sm font-bold leading-tight">Kḥesed-tek</h1>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>

          <SidebarNavigation pathname={pathname} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Shared Navigation Component
function SidebarNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Back to Platform Dashboard */}
      <div className="p-4 border-t border-gray-700">
        <Link
          href="/platform/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Panel Principal
        </Link>
      </div>
    </>
  )
}

export function PlatformSidebar() {
  const pathname = usePathname()
  
  return (
    <>
      <MobileSidebar pathname={pathname} />
      <DesktopSidebar pathname={pathname} />
    </>
  )
}
