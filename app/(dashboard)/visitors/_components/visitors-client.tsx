'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users, UserPlus, Search, Filter, Phone, Mail, Calendar,
  ChevronRight, Star, Clock, CheckCircle2, AlertCircle, QrCode, RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { VisitorJourneyCard } from './visitor-journey-card'

interface FollowUp {
  id: string
  followUpType: string
  status: string
  scheduledAt?: string
  priority?: string
  users?: { name: string }
}

interface Visitor {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  isFirstTime: boolean
  visitorType?: string
  displayCategory: string
  visitCount: number
  engagementScore: number
  checkedInAt: string
  lastContactDate?: string
  visitReason?: string
  prayerRequest?: string
  ageGroup?: string
  familyStatus?: string
  referredBy?: string
  ministryInterest: string[]
  automationTriggered: boolean
  openFollowUps: number
  closedFollowUps: number
  visitor_follow_ups: FollowUp[]
  events?: { id: string; title: string }
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface VisitorsClientProps {
  userRole: string
  churchId: string
}

const CATEGORY_COLORS: Record<string, string> = {
  'PRIMERA VEZ':       'bg-green-100 text-green-800 border-green-200',
  'REGRESÓ':           'bg-blue-100 text-blue-800 border-blue-200',
  'REGULAR':           'bg-purple-100 text-purple-800 border-purple-200',
  'CANDIDATO A MIEMBRO': 'bg-orange-100 text-orange-800 border-orange-200',
  'SIN CATEGORÍA':     'bg-gray-100 text-gray-600 border-gray-200',
}

const MINISTRY_OPTIONS = [
  'Adoración / Música', 'Niños', 'Jóvenes', 'Familia', 'Evangelismo',
  'Intercesoría', 'Tecnología', 'Hospitalidad', 'Liderazgo', 'Discipulado',
]

export function VisitorsClient({ userRole, churchId }: VisitorsClientProps) {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [isJourneyOpen, setIsJourneyOpen] = useState(false)
  const [isManualOpen, setIsManualOpen] = useState(false)

  // Filters
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('all')
  const [followUp, setFollowUp] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')

  // Manual entry form
  const [manualForm, setManualForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    visitReason: '', prayerRequest: '', ageGroup: '', familyStatus: '',
    referredBy: '', ministryInterest: [] as string[],
  })
  const [saving, setSaving] = useState(false)

  const fetchVisitors = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search)   params.set('search', search)
      if (category !== 'all') params.set('category', category)
      if (followUp !== 'all') params.set('hasFollowUp', followUp)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo)   params.set('dateTo', dateTo)

      const res = await fetch(`/api/visitors?${params}`)
      if (!res.ok) throw new Error('Error al cargar visitantes')
      const { data, pagination: pg } = await res.json()
      setVisitors(data)
      setPagination(pg)
    } catch {
      toast.error('Error al cargar visitantes')
    } finally {
      setLoading(false)
    }
  }, [search, category, followUp, dateFrom, dateTo])

  useEffect(() => { fetchVisitors() }, [fetchVisitors])

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualForm.firstName || !manualForm.lastName) {
      toast.error('Nombre y apellido son requeridos')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm),
      })
      if (!res.ok) throw new Error()
      toast.success('Visitante registrado exitosamente')
      setIsManualOpen(false)
      setManualForm({
        firstName: '', lastName: '', email: '', phone: '',
        visitReason: '', prayerRequest: '', ageGroup: '', familyStatus: '',
        referredBy: '', ministryInterest: [],
      })
      fetchVisitors()
    } catch {
      toast.error('Error al registrar visitante')
    } finally {
      setSaving(false)
    }
  }

  const toggleMinistry = (m: string) => {
    setManualForm(prev => ({
      ...prev,
      ministryInterest: prev.ministryInterest.includes(m)
        ? prev.ministryInterest.filter(x => x !== m)
        : [...prev.ministryInterest, m],
    }))
  }

  const stats = {
    total:      pagination.total,
    firstTime:  visitors.filter(v => v.isFirstTime).length,
    returning:  visitors.filter(v => !v.isFirstTime && (v.visitCount || 1) < 3).length,
    openTasks:  visitors.reduce((s, v) => s + v.openFollowUps, 0),
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Visitantes — CRM
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Registro, categorización y seguimiento de todos los visitantes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchVisitors()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
          <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Registro Manual
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Visitante Manualmente</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleManualSubmit} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Nombre *</Label>
                    <Input value={manualForm.firstName}
                      onChange={e => setManualForm(p => ({ ...p, firstName: e.target.value }))}
                      placeholder="Nombre" required />
                  </div>
                  <div>
                    <Label>Apellido *</Label>
                    <Input value={manualForm.lastName}
                      onChange={e => setManualForm(p => ({ ...p, lastName: e.target.value }))}
                      placeholder="Apellido" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={manualForm.email}
                      onChange={e => setManualForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="correo@ejemplo.com" />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={manualForm.phone}
                      onChange={e => setManualForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 555 000 0000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Grupo de edad</Label>
                    <Select value={manualForm.ageGroup}
                      onValueChange={v => setManualForm(p => ({ ...p, ageGroup: v }))}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="26-35">26-35</SelectItem>
                        <SelectItem value="36-50">36-50</SelectItem>
                        <SelectItem value="51+">51+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estado familiar</Label>
                    <Select value={manualForm.familyStatus}
                      onValueChange={v => setManualForm(p => ({ ...p, familyStatus: v }))}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soltero">Soltero/a</SelectItem>
                        <SelectItem value="casado">Casado/a</SelectItem>
                        <SelectItem value="familia">Con familia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>¿Cómo nos conoció?</Label>
                  <Input value={manualForm.referredBy}
                    onChange={e => setManualForm(p => ({ ...p, referredBy: e.target.value }))}
                    placeholder="Amigo, redes sociales, Google…" />
                </div>
                <div>
                  <Label>Razón de visita</Label>
                  <Input value={manualForm.visitReason}
                    onChange={e => setManualForm(p => ({ ...p, visitReason: e.target.value }))}
                    placeholder="Opcional" />
                </div>
                <div>
                  <Label>Petición de oración</Label>
                  <Textarea value={manualForm.prayerRequest}
                    onChange={e => setManualForm(p => ({ ...p, prayerRequest: e.target.value }))}
                    placeholder="Opcional" rows={2} />
                </div>
                <div>
                  <Label className="mb-2 block">Interés en ministerios</Label>
                  <div className="flex flex-wrap gap-2">
                    {MINISTRY_OPTIONS.map(m => (
                      <button key={m} type="button"
                        onClick={() => toggleMinistry(m)}
                        className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                          manualForm.ministryInterest.includes(m)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                        }`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsManualOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? 'Guardando…' : 'Registrar Visitante'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total visitantes', value: stats.total, icon: <Users className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Primera vez', value: stats.firstTime, icon: <Star className="h-5 w-5 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Regresaron', value: stats.returning, icon: <RefreshCw className="h-5 w-5 text-purple-600" />, bg: 'bg-purple-50' },
          { label: 'Seguimientos pendientes', value: stats.openTasks, icon: <AlertCircle className="h-5 w-5 text-orange-600" />, bg: 'bg-orange-50' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="p-4 flex items-center gap-3">
              {s.icon}
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-600">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Buscar por nombre, email, teléfono…"
                value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchVisitors()} />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="FIRST_TIME">Primera vez</SelectItem>
                <SelectItem value="RETURNING">Regresó</SelectItem>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="MEMBER_CANDIDATE">Candidato a miembro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={followUp} onValueChange={setFollowUp}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Seguimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="open">Con tarea pendiente</SelectItem>
                <SelectItem value="done">Completados</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 items-center">
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-[130px]" />
              <span className="text-gray-400 text-sm">–</span>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-[130px]" />
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchVisitors()}>
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visitor List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-700">
            {pagination.total} visitante{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Cargando visitantes…</p>
            </div>
          ) : visitors.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No se encontraron visitantes</p>
              <p className="text-sm mt-1">Ajusta los filtros o registra un visitante manualmente.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {visitors.map(v => (
                <button key={v.id}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  onClick={() => { setSelectedVisitor(v); setIsJourneyOpen(true) }}>
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                    {v.firstName[0]}{v.lastName[0]}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm">
                        {v.firstName} {v.lastName}
                      </span>
                      <Badge className={`text-xs px-2 py-0 ${CATEGORY_COLORS[v.displayCategory] || CATEGORY_COLORS['SIN CATEGORÍA']}`}>
                        {v.displayCategory}
                      </Badge>
                      {v.openFollowUps > 0 && (
                        <Badge className="text-xs px-2 py-0 bg-orange-100 text-orange-700 border-orange-200">
                          {v.openFollowUps} tarea{v.openFollowUps > 1 ? 's' : ''} pendiente{v.openFollowUps > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-3 mt-0.5 text-xs text-gray-500 flex-wrap">
                      {v.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{v.email}</span>}
                      {v.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{v.phone}</span>}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(v.checkedInAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {v.visitCount > 1 && (
                        <span className="flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />{v.visitCount} visitas
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Engagement bar */}
                  <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-gray-400">Compromiso</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                      <div
                        className="h-1.5 rounded-full bg-blue-500"
                        style={{ width: `${Math.min(v.engagementScore, 100)}%` }} />
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={pagination.page <= 1}
            onClick={() => fetchVisitors(pagination.page - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-gray-600 flex items-center px-2">
            Pág. {pagination.page} / {pagination.totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchVisitors(pagination.page + 1)}>
            Siguiente
          </Button>
        </div>
      )}

      {/* Journey Card Dialog */}
      {selectedVisitor && (
        <VisitorJourneyCard
          visitor={selectedVisitor}
          open={isJourneyOpen}
          onClose={() => { setIsJourneyOpen(false); setSelectedVisitor(null) }}
          onUpdated={() => fetchVisitors(pagination.page)}
        />
      )}
    </div>
  )
}
