'use client'
import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { CosmosBackground } from '@/components/cosmos/cosmos-background'
export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session, status } = useSession() || {}
  useEffect(() => {
    if (session?.user) {
      const timer = setTimeout(() => {
        if (session.user.role === 'SUPER_ADMIN') {
          router.replace('/platform/dashboard')
        } else {
          router.replace('/home')
        }
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [session, router])
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      console.log(' CLIENT: Attempting login for:', email)
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      console.log(' CLIENT: SignIn result:', result)
      if (result?.error) {
        console.error(' CLIENT: Login failed:', result.error)
        setError('Email o contraseña incorrectos')
        setIsLoading(false)
        return
      }
      if (result?.ok) {
        console.log(' CLIENT: Login successful!')
        // G02: Verificar si el usuario requiere MFA
        try {
          const mfaCheck = await fetch('/api/platform/settings/mfa/status')
          if (mfaCheck.ok) {
            const mfaData = await mfaCheck.json()
            if (mfaData.isEnabled) {
              console.log(' CLIENT: MFA enabled, redirecting to /auth/mfa')
              setIsLoading(false)
              router.push('/auth/mfa')
              return
            }
          }
        } catch (err) {
          console.error('Error verificando MFA:', err)
          // Si falla la verificación, continuar con login normal (fail-open)
        }
        // MFA no activo o verificación falló - dejar que useEffect maneje el redirect por rol
        // El useEffect al inicio detectará session?.user y redirigirá apropiadamente
        console.log(' CLIENT: Delegating redirect to useEffect based on role')
      }
    } catch (err) {
      console.error(' CLIENT: Exception during login:', err)
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <CosmosBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="xl" className="text-foreground" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa a tu cuenta para gestionar tu iglesia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="text-sm text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.12)] p-3 rounded-md">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Iniciar Sesión
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">¿No tienes una cuenta? </span>
                <Link
                  href="/auth/fresh-signup"
                  className="text-primary hover:underline font-medium"
                >
                  Regístrate aquí
                </Link>
              </div>
              <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
                Al usar esta plataforma aceptas nuestros{' '}
                <Link href="/terms" className="hover:underline">Términos de Servicio</Link>
                {' '}y{' '}
                <Link href="/privacy" className="hover:underline">Política de Privacidad</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}
