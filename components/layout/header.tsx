
'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import { Menu, X, LogOut, User } from 'lucide-react'
import { translateRole } from '@/lib/utils'

import { MobileSidebarTrigger } from '@/components/layout/sidebar'

export function Header() {
  // Safe session handling
  let session: any = null
  try {
    const sessionData = useSession()
    session = sessionData?.data
  } catch (error) {
    console.log('Session not available in header:', error)
  }
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile sidebar trigger */}
          {session?.user && <MobileSidebarTrigger />}
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-4">
          {session?.user && (
            <>
              <div className="hidden md:flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{session.user.name}</span>
                <Badge variant="secondary">
                  {translateRole(session.user.role)}
                </Badge>
              </div>
              <Button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                {isUserMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile user menu */}
      {isUserMenuOpen && session?.user && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{session.user.name}</span>
              <Badge variant="secondary">
                {translateRole(session.user.role)}
              </Badge>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
