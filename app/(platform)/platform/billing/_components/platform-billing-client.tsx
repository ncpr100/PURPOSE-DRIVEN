'use client'

import { useEffect, useState } from 'react'
import { usePaddle } from '@/hooks/use-paddle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CreditCard,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  Users,
  Crown,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Plan {
  id: string
  displayName: string
  description?: string
  priceMonthly: string
  priceYearly?: string
  paddlePriceIdMonthly?: string
  paddlePriceIdYearly?: string
  maxMembers: number
  maxUsers: number
  features?: any
}

interface Subscription {
  id: string
  status: string
  billingCycle: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  cancelledAt?: string
  paddleCustomerId?: string
  paddleSubscriptionId?: string
  paddleTransactionId?: string
  planId: string
  subscription_plans: Plan
}

interface Church {
  id: string
  name: string
  email?: string
  isActive: boolean
  church_subscriptions: Subscription | null
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  ACTIVE:   { label: 'Activa',      variant: 'default',     icon: <CheckCircle2 className="h-3 w-3" /> },
  TRIALING: { label: 'Prueba',      variant: 'secondary',   icon: <Clock className="h-3 w-3" /> },
  PAST_DUE: { label: 'Vencida',     variant: 'destructive', icon: <AlertCircle className="h-3 w-3" /> },
  PAUSED:   { label: 'Pausada',     variant: 'outline',     icon: <Clock className="h-3 w-3" /> },
  CANCELED: { label: 'Cancelada',   variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
  PENDING:  { label: 'Pendiente',   variant: 'secondary',   icon: <Clock className="h-3 w-3" /> },
  NONE:     { label: 'Sin plan',    variant: 'outline',     icon: <AlertCircle className="h-3 w-3" /> },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.NONE
  return (
    <Badge variant={cfg.variant} className="flex items-center gap-1 w-fit">
      {cfg.icon}
      {cfg.label}
    </Badge>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PlatformBillingClient() {
  const [churches, setChurches] = useState<Church[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY')
  const [creatingCheckout, setCreatingCheckout] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  const paddle = usePaddle()

  // ── Load data ──────────────────────────────────────────────────────────────

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/platform/billing/subscriptions')
      if (!res.ok) throw new Error('Error cargando datos')
      const data = await res.json()
      setChurches(data.churches ?? [])
      setPlans(data.plans ?? [])
    } catch (err: any) {
      toast.error(err.message ?? 'Error cargando suscripciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ── Open assign dialog ─────────────────────────────────────────────────────

  const openAssignDialog = (church: Church) => {
    setSelectedChurch(church)
    setSelectedPlanId(church.church_subscriptions?.planId ?? '')
    setBillingCycle((church.church_subscriptions?.billingCycle as any) ?? 'MONTHLY')
    setCheckoutUrl(null)
    setDialogOpen(true)
  }

  // ── Create checkout ────────────────────────────────────────────────────────

  const handleCreateCheckout = async () => {
    if (!selectedChurch || !selectedPlanId) {
      toast.error('Selecciona una iglesia y un plan')
      return
    }

    setCreatingCheckout(true)
    try {
      const res = await fetch('/api/platform/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          churchId: selectedChurch.id,
          planId: selectedPlanId,
          billingCycle,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Error creando checkout')
        return
      }

      setCheckoutUrl(data.checkoutUrl)
      toast.success('Checkout creado exitosamente')
      fetchData() // refresh table
    } catch (err: any) {
      toast.error(err.message ?? 'Error inesperado')
    } finally {
      setCreatingCheckout(false)
    }
  }

  // ── Open Paddle inline checkout ────────────────────────────────────────────

  const openInlineCheckout = () => {
    if (!checkoutUrl || !paddle) {
      toast.error('Paddle no está inicializado. Verifica NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.')
      return
    }
    paddle.Checkout.open({ url: checkoutUrl })
  }

  // ─────────────────────────────────────────────────────────────────────────

  const activeSubscriptions = churches.filter(c => c.church_subscriptions?.status === 'ACTIVE').length
  const pendingSubscriptions = churches.filter(c => c.church_subscriptions?.status === 'PENDING').length
  const noSubscriptions = churches.filter(c => !c.church_subscriptions).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suscripciones de Plataforma</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las suscripciones de cada iglesia mediante Paddle Billing
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeSubscriptions}</p>
                <p className="text-xs text-gray-500">Suscripciones activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingSubscriptions}</p>
                <p className="text-xs text-gray-500">Checkouts pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <AlertCircle className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{noSubscriptions}</p>
                <p className="text-xs text-gray-500">Sin suscripción</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Churches table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-blue-600" />
            Iglesias y Suscripciones
          </CardTitle>
          <CardDescription>
            Asigna planes de Paddle a cada iglesia. El checkout generado se puede compartir con el administrador de la iglesia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : churches.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <Building2 className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p>No hay iglesias registradas</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Iglesia</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Ciclo</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Vence</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {churches.map(church => {
                    const sub = church.church_subscriptions
                    return (
                      <tr key={church.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{church.name}</p>
                              {church.email && (
                                <p className="text-xs text-gray-400">{church.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {sub?.subscription_plans?.displayName ?? (
                            <span className="text-gray-400 italic">Sin plan</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={sub?.status ?? 'NONE'} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {sub?.billingCycle === 'YEARLY' ? 'Anual' : sub ? 'Mensual' : '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {sub?.currentPeriodEnd
                            ? new Date(sub.currentPeriodEnd).toLocaleDateString('es-CO')
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant={sub ? 'outline' : 'default'}
                            onClick={() => openAssignDialog(church)}
                          >
                            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                            {sub ? 'Actualizar plan' : 'Asignar plan'}
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign / checkout dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Asignar plan — {selectedChurch?.name}
            </DialogTitle>
            <DialogDescription>
              Selecciona el plan y ciclo de facturación. Se generará un link de checkout de Paddle para completar el pago.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Plan selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Plan</label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un plan…" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <span className="font-medium">{plan.displayName}</span>
                      <span className="text-gray-500 ml-2 text-xs">
                        {plan.priceMonthly}/mes
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Billing cycle */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Ciclo de facturación</label>
              <Select value={billingCycle} onValueChange={v => setBillingCycle(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Mensual</SelectItem>
                  <SelectItem value="YEARLY">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Plan details */}
            {selectedPlanId && (() => {
              const plan = plans.find(p => p.id === selectedPlanId)
              if (!plan) return null
              const hasPaddleId = billingCycle === 'YEARLY'
                ? !!plan.paddlePriceIdYearly
                : !!plan.paddlePriceIdMonthly
              return (
                <div className="rounded-lg border bg-gray-50 p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-indigo-600" />
                    {plan.displayName}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                    <span>Máx. miembros: <strong>{plan.maxMembers}</strong></span>
                    <span>Máx. usuarios: <strong>{plan.maxUsers}</strong></span>
                    <span>Precio mensual: <strong>{plan.priceMonthly}</strong></span>
                    {plan.priceYearly && (
                      <span>Precio anual: <strong>{plan.priceYearly}</strong></span>
                    )}
                  </div>
                  {!hasPaddleId && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Este plan no tiene configurado el Paddle Price ID para ciclo{' '}
                        {billingCycle === 'YEARLY' ? 'anual' : 'mensual'}.
                        Configúralo en la base de datos antes de continuar.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )
            })()}

            {/* Checkout URL result */}
            {checkoutUrl && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 space-y-2">
                <p className="text-sm font-medium text-green-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Checkout listo
                </p>
                <p className="text-xs text-green-700 break-all">{checkoutUrl}</p>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(checkoutUrl)
                      toast.success('URL copiada al portapapeles')
                    }}
                  >
                    Copiar URL
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={openInlineCheckout}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Abrir Checkout
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                disabled={!selectedPlanId || creatingCheckout}
                onClick={handleCreateCheckout}
              >
                {creatingCheckout ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generando…
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Generar Checkout
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
