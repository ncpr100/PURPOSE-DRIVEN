'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  FileText, 
  QrCode, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  BarChart3,
  Users,
  Settings,
  Download,
  Share,
  TrendingUp,
  Target,
  Megaphone
} from 'lucide-react'
import { toast } from 'sonner'
import { PlatformFormBuilder } from './platform-form-builder'
import { PlatformFormAnalytics } from './platform-form-analytics'
import { PlatformQRGenerator } from './platform-qr-generator'

interface PlatformForm {
  id: string
  name: string
  description?: string
  fields: any[]
  style?: any
  settings?: any
  isActive: boolean
  isPublic: boolean
  slug: string
  campaignTag?: string
  leadScore?: number
  createdAt: string
  _count?: {
    submissions: number
    qrCodes: number
    conversions?: number
  }
}

const PLATFORM_FORM_TEMPLATES = [
  {
    id: 'church-signup',
    name: 'Registro de Iglesia',
    description: 'Formulario para que nuevas iglesias se registren en la plataforma',
    icon: Users,
    campaignTag: 'church_acquisition',
    fields: [
      { id: 'churchName', type: 'text', label: 'Nombre de la Iglesia', required: true },
      { id: 'pastorName', type: 'text', label: 'Nombre del Pastor', required: true },
      { id: 'email', type: 'email', label: 'Correo Electrónico', required: true },
      { id: 'phone', type: 'phone', label: 'Teléfono', required: true },
      { id: 'city', type: 'text', label: 'Ciudad', required: true },
      { id: 'memberCount', type: 'select', label: 'Número de Miembros', required: true,
        options: ['1-50', '51-150', '151-300', '301-500', '500+'] },
      { id: 'currentSystem', type: 'select', label: 'Sistema Actual', required: false,
        options: ['Sin sistema', 'Excel/Hojas de cálculo', 'Otro software', 'Sistema propio'] },
      { id: 'interests', type: 'checkbox', label: 'Características de Interés', required: false,
        options: ['Gestión de miembros', 'Donaciones online', 'Comunicación masiva', 'Eventos', 'Reportes', 'App móvil'] },
      { id: 'budget', type: 'select', label: 'Presupuesto Mensual', required: false,
        options: ['$50,000 - $100,000 COP', '$100,000 - $200,000 COP', '$200,000+ COP'] },
      { id: 'timeline', type: 'select', label: '¿Cuándo quieren implementar?', required: false,
        options: ['Inmediatamente', 'En 1 mes', 'En 2-3 meses', 'Más de 3 meses'] }
    ]
  },
  {
    id: 'demo-request',
    name: 'Solicitud de Demo',
    description: 'Para iglesias que quieren ver una demostración de la plataforma',
    icon: Eye,
    campaignTag: 'demo_request',
    fields: [
      { id: 'churchName', type: 'text', label: 'Nombre de la Iglesia', required: true },
      { id: 'contactName', type: 'text', label: 'Nombre del Contacto', required: true },
      { id: 'role', type: 'select', label: 'Cargo en la Iglesia', required: true,
        options: ['Pastor Principal', 'Pastor Asociado', 'Administrador', 'Líder de Tecnología', 'Otro'] },
      { id: 'email', type: 'email', label: 'Correo Electrónico', required: true },
      { id: 'phone', type: 'phone', label: 'Teléfono', required: true },
      { id: 'demoType', type: 'radio', label: 'Tipo de Demo Preferida', required: true,
        options: ['Demo virtual (Zoom)', 'Demo presencial', 'Video grabado'] },
      { id: 'availability', type: 'textarea', label: 'Disponibilidad Horaria', required: false },
      { id: 'specificNeeds', type: 'textarea', label: 'Necesidades Específicas', required: false }
    ]
  },
  {
    id: 'newsletter-signup',
    name: 'Suscripción Newsletter',
    description: 'Para capturar leads interesados en noticias de la plataforma',
    icon: Megaphone,
    campaignTag: 'newsletter',
    fields: [
      { id: 'firstName', type: 'text', label: 'Nombre', required: true },
      { id: 'lastName', type: 'text', label: 'Apellido', required: true },
      { id: 'email', type: 'email', label: 'Correo Electrónico', required: true },
      { id: 'role', type: 'select', label: 'Tu Rol', required: false,
        options: ['Pastor', 'Líder de Iglesia', 'Administrador', 'Miembro', 'Otro'] },
      { id: 'interests', type: 'checkbox', label: 'Temas de Interés', required: false,
        options: ['Nuevas características', 'Casos de éxito', 'Tutoriales', 'Eventos y webinars', 'Ofertas especiales'] }
    ]
  },
  {
    id: 'consultation-request',
    name: 'Consulta Gratuita',
    description: 'Para iglesias que necesitan asesoría en gestión y tecnología',
    icon: Target,
    campaignTag: 'consultation',
    fields: [
      { id: 'churchName', type: 'text', label: 'Nombre de la Iglesia', required: true },
      { id: 'pastorName', type: 'text', label: 'Nombre del Pastor', required: true },
      { id: 'email', type: 'email', label: 'Correo Electrónico', required: true },
      { id: 'phone', type: 'phone', label: 'Teléfono', required: true },
      { id: 'challenges', type: 'checkbox', label: 'Principales Desafíos', required: true,
        options: ['Gestión de miembros', 'Comunicación interna', 'Finanzas y donaciones', 'Organización de eventos', 'Crecimiento y retención', 'Tecnología'] },
      { id: 'churchSize', type: 'select', label: 'Tamaño de la Congregación', required: true,
        options: ['Menos de 50', '50-150', '151-300', '301-500', 'Más de 500'] },
      { id: 'urgency', type: 'radio', label: 'Nivel de Urgencia', required: true,
        options: ['Muy urgente (esta semana)', 'Urgente (este mes)', 'Importante (próximos 3 meses)', 'Para planificar (6+ meses)'] },
      { id: 'additionalInfo', type: 'textarea', label: 'Información Adicional', required: false }
    ]
  }
]

export default function PlatformFormsClient() {
  const [forms, setForms] = useState<PlatformForm[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedForm, setSelectedForm] = useState<PlatformForm | null>(null)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [isQRGeneratorOpen, setIsQRGeneratorOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [campaignFilter, setCampaignFilter] = useState('all')

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/platform/forms')
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      } else {
        toast.error('Error al cargar formularios de la plataforma')
      }
    } catch (error) {
      console.error('Error fetching platform forms:', error)
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateForm = (template?: typeof PLATFORM_FORM_TEMPLATES[0]) => {
    if (template) {
      // Create form with template data
      setSelectedForm({
        id: '',
        name: template.name,
        description: template.description,
        fields: template.fields,
        campaignTag: template.campaignTag,
        isActive: true,
        isPublic: true,
        slug: '',
        createdAt: new Date().toISOString()
      })
    } else {
      // Create blank form
      setSelectedForm({
        id: '',
        name: '',
        description: '',
        fields: [],
        isActive: true,
        isPublic: true,
        slug: '',
        createdAt: new Date().toISOString()
      })
    }
    setIsBuilderOpen(true)
  }

  const handleEditForm = (form: PlatformForm) => {
    setSelectedForm(form)
    setIsBuilderOpen(true)
  }

  const handleDuplicateForm = async (form: PlatformForm) => {
    const duplicatedForm = {
      ...form,
      id: '',
      name: `${form.name} (Copia)`,
      slug: '',
      createdAt: new Date().toISOString()
    }
    setSelectedForm(duplicatedForm)
    setIsBuilderOpen(true)
  }

  const handleDeleteForm = async (formId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este formulario?')) {
      try {
        const response = await fetch(`/api/platform/forms/${formId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setForms(forms.filter(form => form.id !== formId))
          toast.success('Formulario eliminado exitosamente')
        } else {
          toast.error('Error al eliminar formulario')
        }
      } catch (error) {
        toast.error('Error de conexión')
      }
    }
  }

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && form.isActive) ||
                         (statusFilter === 'inactive' && !form.isActive)
    const matchesCampaign = campaignFilter === 'all' || form.campaignTag === campaignFilter
    
    return matchesSearch && matchesStatus && matchesCampaign
  })

  const totalSubmissions = forms.reduce((sum, form) => sum + (form._count?.submissions || 0), 0)
  const totalConversions = forms.reduce((sum, form) => sum + (form._count?.conversions || 0), 0)
  const conversionRate = totalSubmissions > 0 ? ((totalConversions / totalSubmissions) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      {/* Platform Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formularios Activos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.filter(f => f.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              {forms.length} formularios totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envíos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              Tasa: {conversionRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Códigos QR</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forms.reduce((sum, form) => sum + (form._count?.qrCodes || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Marketing offline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 space-y-2 sm:space-y-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Buscar formularios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Campaña" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las campañas</SelectItem>
                <SelectItem value="church_acquisition">Adquisición de Iglesias</SelectItem>
                <SelectItem value="demo_request">Solicitudes de Demo</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="consultation">Consultas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={() => handleCreateForm()}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Formulario
        </Button>
      </div>

      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forms">Formularios</TabsTrigger>
          <TabsTrigger value="templates">Plantillas de Marketing</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        {/* Forms Tab */}
        <TabsContent value="forms">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredForms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay formularios</h3>
                <p className="text-muted-foreground mb-4">
                  Crea tu primer formulario de marketing para capturar leads
                </p>
                <Button onClick={() => handleCreateForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Formulario
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredForms.map((form) => (
                <Card key={form.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{form.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {form.description || 'Sin descripción'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={form.isActive ? 'default' : 'secondary'}>
                          {form.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        {form.campaignTag && (
                          <Badge variant="outline">
                            {form.campaignTag.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Campos:</span>
                        <span>{form.fields.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Envíos:</span>
                        <span>{form._count?.submissions || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">QR Codes:</span>
                        <span>{form._count?.qrCodes || 0}</span>
                      </div>
                      {form._count?.conversions !== undefined && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Conversiones:</span>
                          <span className="font-medium text-green-600">{form._count.conversions}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditForm(form)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedForm(form)
                          setIsQRGeneratorOpen(true)
                        }}
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        QR
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDuplicateForm(form)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedForm(form)
                          setIsAnalyticsOpen(true)
                        }}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteForm(form.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLATFORM_FORM_TEMPLATES.map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {template.campaignTag?.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {template.fields.length} campos
                        </span>
                      </div>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleCreateForm(template)}
                      >
                        Usar Plantilla
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <PlatformFormAnalytics forms={forms} />
        </TabsContent>
      </Tabs>

      {/* Form Builder Dialog */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedForm?.id ? 'Editar' : 'Crear'} Formulario de Marketing
            </DialogTitle>
          </DialogHeader>
          
          {selectedForm && (
            <PlatformFormBuilder
              form={selectedForm}
              onSave={async (formData) => {
                try {
                  const url = selectedForm.id 
                    ? `/api/platform/forms/${selectedForm.id}`
                    : '/api/platform/forms'
                  
                  const method = selectedForm.id ? 'PUT' : 'POST'
                  
                  const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                  })

                  if (response.ok) {
                    toast.success('Formulario guardado exitosamente')
                    await fetchForms()
                    setIsBuilderOpen(false)
                    setSelectedForm(null)
                  } else {
                    toast.error('Error al guardar formulario')
                  }
                } catch (error) {
                  toast.error('Error al guardar formulario')
                }
              }}
              onCancel={() => {
                setIsBuilderOpen(false)
                setSelectedForm(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* QR Generator Dialog */}
      {selectedForm && (
        <Dialog open={isQRGeneratorOpen} onOpenChange={setIsQRGeneratorOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Códigos QR para {selectedForm.name}</DialogTitle>
            </DialogHeader>
            
            <PlatformQRGenerator
              isOpen={isQRGeneratorOpen}
              onClose={() => {
                setIsQRGeneratorOpen(false)
                setSelectedForm(null)
              }}
              formId={selectedForm.id}
              formName={selectedForm.name}
              onQRGenerated={() => {
                fetchForms()
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Analytics Dialog */}
      {selectedForm && (
        <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Analíticas de {selectedForm.name}</DialogTitle>
            </DialogHeader>
            
            <PlatformFormAnalytics 
              forms={[selectedForm]} 
              detailed={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}