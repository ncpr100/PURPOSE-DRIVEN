'use client'

/**
 * PlatformStripeConnect
 * Shows all churches with their Stripe Connect status.
 * Super admin can initiate onboarding, check status, or disconnect.
 *
 * Payment Isolation Guarantee:
 *   - Tenant donations → church's own Stripe Express account
 *   - Platform fees    → platform's Stripe account (STRIPE_SECRET_KEY)
 *   - Funds NEVER touch the platform account in transit
 */

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  CreditCard,
  Unlink,
  Search,
  AlertCircle,
  Info
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Church {
  id: string
  name: string
  email?: string
  stripeConnectAccountId?: string
  stripeConnectStatus?: string
}

interface ConnectStatusDetail {
  accountId?: string
  status?: string
  detailsSubmitted: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
}

function ConnectStatusBadge({ status }: { status?: string }) {
  if (!status || status === 'not_connected') {
    return <Badge variant="outline" className="gap-1 text-gray-500"><XCircle className="h-3 w-3" />Sin conectar</Badge>
  }
  if (status === 'pending') {
    return <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-300 bg-yellow-50"><Clock className="h-3 w-3" />Pendiente</Badge>
  }
  if (status === 'active') {
    return <Badge variant="outline" className="gap-1 text-green-700 border-green-300 bg-green-50"><CheckCircle2 className="h-3 w-3" />Activo</Badge>
  }
  if (status === 'disconnected' || status === 'deauthorized') {
    return <Badge variant="outline" className="gap-1 text-red-600 border-red-300 bg-red-50"><XCircle className="h-3 w-3" />Desconectado</Badge>
  }
  return <Badge variant="secondary">{status}</Badge>
}

export function PlatformStripeConnect() {
  const [churches, setChurches]     = useState<Church[]>([])
  const [loading, setLoading]       = useState(true)
  const [query, setQuery]           = useState('')
  const [loadingId, setLoadingId]   = useState<string | null>(null)
  const [details, setDetails]       = useState<Record<string, ConnectStatusDetail>>({})

  const fetchChurches = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/platform/churches?limit=200')
      if (!res.ok) throw new Error('Error al cargar iglesias')
      const json = await res.json()
      const list: Church[] = (json.data ?? json.churches ?? []).map((c: any) => ({
        id:                     c.id,
        name:                   c.name,
        email:                  c.email,
        stripeConnectAccountId: c.stripeConnectAccountId,
        stripeConnectStatus:    c.stripeConnectStatus ?? 'not_connected'
      }))
      setChurches(list)
    } catch {
      toast.error('Error al cargar iglesias')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchChurches() }, [fetchChurches])

  const refreshStatus = async (churchId: string) => {
    setLoadingId(churchId)
    try {
      const res = await fetch(`/api/platform/stripe-connect?churchId=${churchId}`)
      if (!res.ok) throw new Error()
      const data = await res.json()

      // Update local church status
      setChurches(prev => prev.map(c =>
        c.id === churchId
          ? { ...c, stripeConnectStatus: data.connect?.status ?? c.stripeConnectStatus, stripeConnectAccountId: data.connect?.accountId }
          : c
      ))
      setDetails(prev => ({ ...prev, [churchId]: data.connect }))

      // If active in Stripe but local status wrong, update
      if (data.connect?.chargesEnabled && data.connect?.detailsSubmitted) {
        await fetch('/api/platform/stripe-connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ churchId, action: 'sync_status' })
        })
      }
      toast.success('Estado actualizado')
    } catch {
      toast.error('Error al verificar estado')
    } finally {
      setLoadingId(null)
    }
  }

  const startOnboarding = async (churchId: string) => {
    setLoadingId(churchId)
    try {
      const origin = window.location.origin
      const res = await fetch('/api/platform/stripe-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          churchId,
          refreshUrl: `${origin}/platform/churches`,
          returnUrl:  `${origin}/platform/churches`
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error')
      // Open onboarding in new tab
      window.open(data.onboardingUrl, '_blank', 'noopener,noreferrer')
      toast.success('Enlace de incorporación abierto en nueva pestaña')
    } catch (err: any) {
      toast.error(err.message ?? 'Error al iniciar incorporación')
    } finally {
      setLoadingId(null)
    }
  }

  const disconnect = async (churchId: string, churchName: string) => {
    if (!confirm(`¿Desconectar Stripe Connect de "${churchName}"? Las donaciones desde esta iglesia ya no procesarán pagos hasta que se reconecte.`)) return
    setLoadingId(churchId)
    try {
      const res = await fetch(`/api/platform/stripe-connect?churchId=${churchId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setChurches(prev => prev.map(c =>
        c.id === churchId
          ? { ...c, stripeConnectStatus: 'disconnected', stripeConnectAccountId: undefined }
          : c
      ))
      toast.success('Cuenta desconectada')
    } catch {
      toast.error('Error al desconectar')
    } finally {
      setLoadingId(null)
    }
  }

  const filtered = churches.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(query.toLowerCase())
  )

  const totalConnected     = churches.filter(c => c.stripeConnectStatus === 'active').length
  const totalPending       = churches.filter(c => c.stripeConnectStatus === 'pending').length
  const totalNotConnected  = churches.filter(c => !c.stripeConnectStatus || c.stripeConnectStatus === 'not_connected' || c.stripeConnectStatus === 'disconnected').length

  return (
    <div className="space-y-6">
      {/* Conceptual separation banner */}
      <Card className="border-l-4 border-l-green-600 bg-green-50/40">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800">Separación Financiera Garantizada</p>
              <p className="text-xs text-green-700 mt-0.5">
                Los fondos de donaciones van <strong>directamente</strong> a la cuenta de cada iglesia.
                La plataforma <strong>jamás toca</strong> el dinero de los tenants.
                Los pagos de la plataforma usan la cuenta Stripe del operador (variable <code className="bg-green-100 px-1 rounded">STRIPE_SECRET_KEY</code>).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{totalConnected}</div>
            <div className="text-xs text-muted-foreground mt-1">Activas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
            <div className="text-xs text-muted-foreground mt-1">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-500">{totalNotConnected}</div>
            <div className="text-xs text-muted-foreground mt-1">Sin conectar</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar iglesias..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* How it works */}
      <Card className="bg-blue-50/40 border-blue-200">
        <CardContent className="p-4">
          <div className="flex gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium text-blue-800">Cómo funciona la separación de pagos</span>
          </div>
          <ol className="text-xs text-blue-700 space-y-1 ml-6 list-decimal">
            <li>El super admin inicia la incorporación de una iglesia (botón «Incorporar»)</li>
            <li>Se abre Stripe Express Onboarding — la iglesia completa su información bancaria</li>
            <li>Una vez activa, cada donación usa <code className="bg-blue-100 px-0.5 rounded">transfer_data.destination = churchStripeAccountId</code></li>
            <li>Los fondos llegan <em>directamente</em> a la cuenta de la iglesia — sin depósito intermedio</li>
            <li>Los pagos de la plataforma (suscripciones, facturas) usan la cuenta del operador separadamente</li>
          </ol>
        </CardContent>
      </Card>

      {/* Church list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 h-16" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
            No se encontraron iglesias
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(church => {
            const detail = details[church.id]
            const isLoading = loadingId === church.id
            const status = church.stripeConnectStatus ?? 'not_connected'
            const hasAccount = !!church.stripeConnectAccountId

            return (
              <Card key={church.id} className="border">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Church info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{church.name}</p>
                        {church.email && (
                          <p className="text-xs text-muted-foreground truncate">{church.email}</p>
                        )}
                        {hasAccount && (
                          <p className="text-xs font-mono text-gray-400 truncate">
                            {church.stripeConnectAccountId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status + capabilities */}
                    <div className="flex flex-wrap items-center gap-2">
                      <ConnectStatusBadge status={status} />
                      {detail?.chargesEnabled && (
                        <Badge variant="outline" className="gap-1 text-green-700 text-xs">
                          <CreditCard className="h-3 w-3" />Cobros activos
                        </Badge>
                      )}
                      {detail?.payoutsEnabled && (
                        <Badge variant="outline" className="gap-1 text-blue-700 text-xs">
                          <CheckCircle2 className="h-3 w-3" />Pagos activos
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(!hasAccount || status === 'not_connected' || status === 'disconnected') && (
                        <Button
                          size="sm"
                          onClick={() => startOnboarding(church.id)}
                          disabled={isLoading}
                          className="gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          {isLoading ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <ExternalLink className="h-3.5 w-3.5" />
                          )}
                          Incorporar
                        </Button>
                      )}

                      {status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startOnboarding(church.id)}
                          disabled={isLoading}
                          className="gap-1 text-yellow-700 border-yellow-300"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Continuar
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refreshStatus(church.id)}
                        disabled={isLoading}
                        title="Verificar estado actual con Stripe"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      </Button>

                      {hasAccount && status !== 'disconnected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => disconnect(church.id, church.name)}
                          disabled={isLoading}
                          className="gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                          title="Desconectar cuenta Stripe Connect"
                        >
                          <Unlink className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Platform own payment note */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-amber-700">Pagos de la plataforma:</strong>{' '}
              Las facturas y suscripciones de los tenants hacia Khesed-Tek usan la
              cuenta Stripe configurada en <code className="bg-gray-100 px-0.5 rounded">STRIPE_SECRET_KEY</code>.
              Ver sección de Facturas para el detalle de cobros a tenants.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
