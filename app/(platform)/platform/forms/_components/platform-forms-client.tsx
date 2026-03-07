'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'react-hot-toast'
import {
  FileText,
  QrCode,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  BarChart3,
  Globe,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Layers,
  CreditCard
} from 'lucide-react'
import PlatformQRGenerator from './platform-qr-generator'
import { PlatformFormAnalytics } from './platform-form-analytics'
import { PlatformFormBuilderDnd, type PlatformFormData } from './platform-form-builder-dnd'
import { PlatformDynamicQR } from './platform-dynamic-qr'
import { PlatformStripeConnect } from './platform-stripe-connect'

// Field names match the API response from /api/platform/forms
interface PlatformForm {
  id: string
  name: string          // API returns `name` (not `title`)
  slug: string
  description?: string
  campaignTag?: string  // API returns `campaignTag` (not `type`)
  isActive: boolean
  isPublic: boolean
  leadScore: number
  createdAt: string
  updatedAt: string
  analytics?: {
    totalSubmissions: number
    lastWeekSubmissions: number
    conversionRate: number
    averageLeadScore: number
    lastSubmission: string | null
  }
}

interface PlatformFormsClientProps {
  userRole: string
}

export default function PlatformFormsClient({ userRole }: PlatformFormsClientProps) {
  const [forms, setForms] = useState<PlatformForm[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedFormSlug, setSelectedFormSlug] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState('formularios')
  const [newForm, setNewForm] = useState({
    name: '',
    description: '',
    campaignTag: 'lead_capture'
  })
  const [editingForm, setEditingForm] = useState<PlatformFormData | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)

  // Fetch platform forms
  const fetchForms = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/platform/forms')
      if (response.ok) {
        const result = await response.json()
        setForms(Array.isArray(result.data) ? result.data : [])
      } else {
        toast.error('Error al cargar formularios')
        setForms([])
      }
    } catch (error) {
      console.error('Error fetching forms:', error)
      toast.error('Error de conexión')
      setForms([])
    } finally {
      setLoading(false)
    }
  }

  // Create new platform form
  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newForm.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }
    try {
      setIsCreating(true)
      const formData = {
        name: newForm.name,
        description: newForm.description || '',
        fields: [],
        style: { backgroundColor: '#ffffff', primaryColor: '#3B82F6', fontFamily: 'Inter' },
        settings: {
          thankYouMessage: 'Gracias por tu interés en Khesed-tek',
          sendNotification: false,
          autoFollowUp: false,
          leadScoring: true,
          conversionTracking: true
        },
        isActive: true,
        isPublic: true,
        campaignTag: newForm.campaignTag,
        leadScore: 50
      }
      const response = await fetch('/api/platform/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setNewForm({ name: '', description: '', campaignTag: 'lead_capture' })
        toast.success('Formulario creado exitosamente')
        await fetchForms()
      } else {
        const error = await response.json()
        toast.error(error.details?.[0]?.message || error.error || 'Error al crear formulario')
      }
    } catch (error) {
      console.error('Error creating form:', error)
      toast.error('Error de conexión')
    } finally {
      setIsCreating(false)
    }
  }

  // Toggle form status
  const toggleFormStatus = async (formId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/platform/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (response.ok) {
        setForms(forms.map(form =>
          form.id === formId ? { ...form, isActive: !currentStatus } : form
        ))
        toast.success(`Formulario ${!currentStatus ? 'activado' : 'desactivado'}`)
      } else {
        toast.error('Error al actualizar formulario')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  // Copy public form URL to clipboard — points to /p/[slug], NOT the API endpoint
  const copyFormUrl = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('URL del formulario copiada')
  }

  // Open form in new tab
  const openForm = (slug: string) => {
    window.open(`${window.location.origin}/p/${slug}`, '_blank')
  }

  // Switch to QR tab with this form pre-selected (static generator)
  const openQRForForm = (slug: string) => {
    setSelectedFormSlug(slug)
    setActiveTab('qr')
  }

  // Open DnD builder for an existing form
  const openBuilder = (form?: PlatformFormData) => {
    setEditingForm(form ?? null)
    setShowBuilder(true)
    setActiveTab('constructor')
  }

  // Save form from DnD builder
  const handleSaveBuiltForm = async (formData: PlatformFormData) => {
    const url    = editingForm ? `/api/platform/forms/${editingForm.id}` : '/api/platform/forms'
    const method = editingForm ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      toast.success(editingForm ? 'Formulario actualizado' : 'Formulario creado')
      setShowBuilder(false)
      setEditingForm(null)
      await fetchForms()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error || 'Error al guardar')
    }
  }

  // Delete form
  const deleteForm = async (formId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este formulario?')) return
    try {
      const response = await fetch(`/api/platform/forms/${formId}`, { method: 'DELETE' })
      if (response.ok) {
        setForms(forms.filter(form => form.id !== formId))
        toast.success('Formulario eliminado')
      } else {
        toast.error('Error al eliminar formulario')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  useEffect(() => {
    fetchForms()
  }, [])

  const campaignTagLabel: Record<string, string> = {
    lead_capture: 'Captura de Leads',
    feedback: 'Retroalimentación',
    survey: 'Encuesta',
    registration: 'Registro'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Formularios de Plataforma</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Formularios de Plataforma</h1>
          <p className="text-gray-600 mt-1">
            Gestiona formularios, códigos QR y analíticas de marketing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <FileText className="h-4 w-4 mr-1" />
            {forms.length} formulario{forms.length !== 1 ? 's' : ''}
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchForms} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="formularios" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Formularios</span>
          </TabsTrigger>
          <TabsTrigger value="constructor" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Constructor</span>
          </TabsTrigger>
          <TabsTrigger value="qr-dinamico" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">QR Dinámico</span>
          </TabsTrigger>
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Stripe Connect</span>
          </TabsTrigger>
          <TabsTrigger value="analiticas" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analíticas</span>
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: FORMULARIOS ─── */}
        <TabsContent value="formularios" className="space-y-6 mt-6">

          {/* Create Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5 text-blue-600" />
                Crear Nuevo Formulario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateForm} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Formulario *</Label>
                    <Input
                      id="name"
                      value={newForm.name}
                      onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                      placeholder="Ej: Registro de Interés"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaignTag">Tipo / Campaña</Label>
                    <select
                      id="campaignTag"
                      className="w-full p-2 border rounded-md"
                      value={newForm.campaignTag}
                      onChange={(e) => setNewForm({ ...newForm, campaignTag: e.target.value })}
                    >
                      <option value="lead_capture">Captura de Leads</option>
                      <option value="feedback">Retroalimentación</option>
                      <option value="survey">Encuesta</option>
                      <option value="registration">Registro</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descripción (Opcional)</Label>
                  <Textarea
                    id="description"
                    value={newForm.description}
                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                    placeholder="Descripción del formulario y su propósito..."
                    rows={2}
                  />
                </div>
                <Button type="submit" disabled={isCreating} className="w-full md:w-auto">
                  {isCreating ? 'Creando...' : 'Crear Formulario'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Forms List */}
          {!Array.isArray(forms) || forms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay formularios</h3>
                <p className="text-gray-500">Crea tu primer formulario de plataforma para empezar</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {forms.map((form) => (
                <Card key={form.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Form Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base">{form.name}</h3>
                          <Badge variant={form.isActive ? 'default' : 'secondary'}>
                            {form.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                          {form.campaignTag && (
                            <Badge variant="outline" className="text-xs">
                              {campaignTagLabel[form.campaignTag] || form.campaignTag}
                            </Badge>
                          )}
                        </div>
                        {form.description && (
                          <p className="text-sm text-gray-500 mb-2">{form.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Globe className="h-3 w-3" />
                            /p/{form.slug}
                          </span>
                          {form.analytics && (
                            <span className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              {form.analytics.totalSubmissions} envíos totales
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openQRForForm(form.slug)}
                          title="Generar QR para este formulario"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyFormUrl(form.slug)}
                          title="Copiar URL pública del formulario"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openForm(form.slug)}
                          title="Abrir formulario en nueva pestaña"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFormStatus(form.id, form.isActive)}
                          title={form.isActive ? 'Desactivar formulario' : 'Activar formulario'}
                        >
                          {form.isActive
                            ? <ToggleRight className="h-4 w-4 text-green-600" />
                            : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteForm(form.id)}
                          title="Eliminar formulario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Mini analytics row */}
                    {form.analytics && form.analytics.totalSubmissions > 0 && (
                      <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{form.analytics.totalSubmissions}</div>
                          <div className="text-xs text-gray-500">Total Envíos</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{form.analytics.lastWeekSubmissions}</div>
                          <div className="text-xs text-gray-500">Última Semana</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{form.analytics.averageLeadScore}</div>
                          <div className="text-xs text-gray-500">Score Promedio</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── TAB 2: CONSTRUCTOR DND ─── */}
        <TabsContent value="constructor" className="mt-6">
          {showBuilder ? (
            <PlatformFormBuilderDnd
              form={editingForm ?? undefined}
              onSave={handleSaveBuiltForm}
              onCancel={() => { setShowBuilder(false); setEditingForm(null) }}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Constructor de Formularios</h2>
                  <p className="text-sm text-muted-foreground">Arrastra y suelta campos para diseñar formularios avanzados</p>
                </div>
                <Button onClick={() => openBuilder()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Formulario
                </Button>
              </div>
              {forms.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                  <Layers className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-muted-foreground">Crea tu primer formulario con el constructor</p>
                  <Button className="mt-4" onClick={() => openBuilder()}>Abrir Constructor</Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {forms.map(form => (
                    <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{form.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">/p/{form.slug}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openBuilder(form as unknown as PlatformFormData)}
                        className="gap-1"
                      >
                        <Layers className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* ─── TAB 3: QR DINÁMICO ─── */}
        <TabsContent value="qr-dinamico" className="mt-6">
          <PlatformDynamicQR />
        </TabsContent>

        {/* ─── TAB 4: STRIPE CONNECT ─── */}
        <TabsContent value="stripe" className="mt-6">
          <PlatformStripeConnect />
        </TabsContent>

        {/* ─── TAB 5: ANALÍTICAS ─── */}
        <TabsContent value="analiticas" className="mt-6">
          <PlatformFormAnalytics forms={forms} isOpen={activeTab === 'analiticas'} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
