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
  Share
} from 'lucide-react'
import { toast } from 'sonner'
import { VisitorFormBuilder } from './visitor-form-builder'
import { FormAnalytics } from './form-analytics'
import { QRCodeGenerator } from './qr-code-generator'

interface VisitorForm {
  id: string
  name: string
  description?: string
  fields: any[]
  style?: any
  settings?: any
  isActive: boolean
  isPublic: boolean
  slug: string
  createdAt: string
  _count?: {
    submissions: number
    qrCodes: number
  }
}

interface FormsClientProps {
  userRole: string
  churchId: string
}

const FORM_TEMPLATES = [
  {
    id: 'visitor-registration',
    name: 'Registro de Visitante',
    description: 'Formulario básico para registro de nuevos visitantes',
    icon: Users,
    fields: [
      { id: 'firstName', type: 'text', label: 'Nombre', required: true },
      { id: 'lastName', type: 'text', label: 'Apellido', required: true },
      { id: 'email', type: 'email', label: 'Correo Electrónico', required: true },
      { id: 'phone', type: 'phone', label: 'Teléfono', required: false },
      { id: 'visitReason', type: 'select', label: 'Motivo de Visita', required: false, 
        options: ['Primera visita', 'Invitado por un amigo', 'Evento especial', 'Búsqueda espiritual', 'Otro'] },
      { id: 'ministryInterest', type: 'checkbox', label: 'Intereses Ministeriales', required: false,
        options: ['Música', 'Niños', 'Jóvenes', 'Intercesión', 'Servicio', 'Enseñanza'] },
      { id: 'prayerRequest', type: 'textarea', label: 'Petición de Oración', required: false }
    ]
  },
  {
    id: 'event-registration',
    name: 'Registro de Evento',
    description: 'Para eventos especiales, conferencias, retiros',
    icon: FileText,
    fields: [
      { id: 'fullName', type: 'text', label: 'Nombre Completo', required: true },
      { id: 'email', type: 'email', label: 'Correo Electrónico', required: true },
      { id: 'phone', type: 'phone', label: 'Teléfono', required: true },
      { id: 'age', type: 'number', label: 'Edad', required: false },
      { id: 'emergencyContact', type: 'text', label: 'Contacto de Emergencia', required: true },
      { id: 'dietaryRestrictions', type: 'textarea', label: 'Restricciones Alimentarias', required: false },
      { id: 'specialNeeds', type: 'textarea', label: 'Necesidades Especiales', required: false }
    ]
  },
  {
    id: 'ministry-interest',
    name: 'Interés Ministerial',
    description: 'Para personas interesadas en servir en ministerios',
    icon: Settings,
    fields: [
      { id: 'fullName', type: 'text', label: 'Nombre Completo', required: true },
      { id: 'email', type: 'email', label: 'Correo Electrónico', required: true },
      { id: 'phone', type: 'phone', label: 'Teléfono', required: true },
      { id: 'ministries', type: 'checkbox', label: 'Ministerios de Interés', required: true,
        options: ['Adoración', 'Enseñanza', 'Niños', 'Jóvenes', 'Intercesión', 'Evangelismo', 'Tecnología', 'Administración'] },
      { id: 'experience', type: 'textarea', label: 'Experiencia Previa', required: false },
      { id: 'availability', type: 'select', label: 'Disponibilidad', required: true,
        options: ['Domingos AM', 'Domingos PM', 'Entre semana', 'Fines de semana', 'Flexible'] },
      { id: 'comments', type: 'textarea', label: 'Comentarios Adicionales', required: false }
    ]
  }
]

export function FormsClient({ userRole, churchId }: FormsClientProps) {
  const [forms, setForms] = useState<VisitorForm[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedForm, setSelectedForm] = useState<VisitorForm | null>(null)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [isQRGeneratorOpen, setIsQRGeneratorOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/visitor-forms')
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      } else {
        toast.error('Error al cargar formularios')
      }
    } catch (error) {
      toast.error('Error al cargar formularios')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateForm = (template?: any) => {
    if (template) {
      setSelectedForm({
        id: '',
        name: template.name,
        description: template.description,
        fields: template.fields,
        isActive: true,
        isPublic: true,
        slug: '',
        createdAt: ''
      })
    } else {
      setSelectedForm({
        id: '',
        name: '',
        description: '',
        fields: [],
        isActive: true,
        isPublic: true,
        slug: '',
        createdAt: ''
      })
    }
    setIsBuilderOpen(true)
  }

  const handleEditForm = (form: VisitorForm) => {
    setSelectedForm(form)
    setIsBuilderOpen(true)
  }

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este formulario?')) return

    try {
      const response = await fetch(`/api/visitor-forms/${formId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Formulario eliminado correctamente')
        fetchForms()
      } else {
        toast.error('Error al eliminar formulario')
      }
    } catch (error) {
      toast.error('Error al eliminar formulario')
    }
  }

  const handleDuplicateForm = async (form: VisitorForm) => {
    try {
      const response = await fetch('/api/visitor-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.name} (Copia)`,
          description: form.description,
          fields: form.fields,
          style: form.style,
          settings: form.settings,
          isActive: false,
          isPublic: false
        })
      })
      
      if (response.ok) {
        toast.success('Formulario duplicado correctamente')
        fetchForms()
      } else {
        toast.error('Error al duplicar formulario')
      }
    } catch (error) {
      toast.error('Error al duplicar formulario')
    }
  }

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && form.isActive) ||
                         (statusFilter === 'inactive' && !form.isActive)
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando formularios...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Formularios</h1>
          <p className="text-muted-foreground">
            Crea formularios personalizados para visitantes con códigos QR
          </p>
        </div>
        
        <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleCreateForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Formulario
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forms">Formularios</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <Input
              placeholder="Buscar formularios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{form.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {form.description || 'Sin descripción'}
                      </CardDescription>
                    </div>
                    <Badge variant={form.isActive ? 'default' : 'secondary'}>
                      {form.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{form.fields?.length || 0} campos</span>
                    <span>{form._count?.submissions || 0} respuestas</span>
                  </div>
                  
                  <div className="flex gap-2">
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
                      onClick={() => handleDeleteForm(form.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FORM_TEMPLATES.map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleCreateForm(template)}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="w-8 h-8 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {template.fields.length} campos incluidos
                    </p>
                    <Button className="w-full mt-3" variant="outline">
                      Usar Plantilla
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          {/* Analytics for overall forms */}
          {forms.length > 0 && (
            <FormAnalytics formId={forms[0].id} formName="Resumen General" />
          )}
        </TabsContent>
      </Tabs>

      {/* Form Builder Dialog */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedForm?.id ? 'Editar Formulario' : 'Crear Nuevo Formulario'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedForm && (
            <VisitorFormBuilder
              form={selectedForm}
              onSave={async (formData) => {
                try {
                  const url = selectedForm.id 
                    ? `/api/visitor-forms/${selectedForm.id}`
                    : '/api/visitor-forms'
                  const method = selectedForm.id ? 'PUT' : 'POST'
                  
                  const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                  })
                  
                  if (response.ok) {
                    toast.success(selectedForm.id ? 'Formulario actualizado' : 'Formulario creado')
                    setIsBuilderOpen(false)
                    setSelectedForm(null)
                    fetchForms()
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
      <Dialog open={isQRGeneratorOpen} onOpenChange={setIsQRGeneratorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Generar Código QR</DialogTitle>
          </DialogHeader>
          
          {selectedForm && (
            <QRCodeGenerator
              isOpen={isQRGeneratorOpen}
              onClose={() => {
                setIsQRGeneratorOpen(false)
                setSelectedForm(null)
              }}
              formId={selectedForm.id}
              formName={selectedForm.name}
              onQRGenerated={() => {
                setIsQRGeneratorOpen(false)
                setSelectedForm(null)
                // Refresh if needed
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}