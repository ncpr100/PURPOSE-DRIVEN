'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { 
  FileText, 
  QrCode, 
  Plus, 
  Edit2, 
  Trash2, 
  Copy,
  ExternalLink,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react'

interface PlatformForm {
  id: string
  title: string
  description?: string
  type: 'lead_capture' | 'feedback' | 'survey' | 'registration'
  isActive: boolean
  qrCode?: string
  submissions: number
  createdAt: string
  updatedAt: string
}

interface PlatformFormsClientProps {
  userRole: string
}

export default function PlatformFormsClient({ userRole }: PlatformFormsClientProps) {
  const [forms, setForms] = useState<PlatformForm[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    type: 'lead_capture' as const
  })

  // Fetch platform forms
  const fetchForms = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/platform/forms')
      
      if (response.ok) {
        const result = await response.json()
        // API returns { data: [...], meta: {...} }
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
    
    if (!newForm.title.trim()) {
      toast.error('El título es requerido')
      return
    }

    try {
      setIsCreating(true)
      
      // Build complete form data matching API schema
      const formData = {
        name: newForm.title,
        description: newForm.description || '',
        fields: [],  // Empty fields array - can be added later via form builder
        style: {
          backgroundColor: '#ffffff',
          primaryColor: '#3B82F6',
          fontFamily: 'Inter'
        },
        settings: {
          thankYouMessage: 'Gracias por tu interés en Khesed-tek',
          sendNotification: false,
          autoFollowUp: false,
          leadScoring: true,
          campaignTag: newForm.type,
          conversionTracking: true
        },
        isActive: true,
        isPublic: true,
        campaignTag: newForm.type,
        leadScore: 50
      }
      
      const response = await fetch('/api/platform/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        setForms([result.data, ...(forms || [])])
        setNewForm({ title: '', description: '', type: 'lead_capture' })
        toast.success('Formulario creado exitosamente')
        fetchForms() // Refresh list
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
        setForms((forms || []).map(form => 
          form.id === formId ? { ...form, isActive: !currentStatus } : form
        ))
        toast.success(`Formulario ${!currentStatus ? 'activado' : 'desactivado'}`)
      } else {
        toast.error('Error al actualizar formulario')
      }
    } catch (error) {
      console.error('Error updating form:', error)
      toast.error('Error de conexión')
    }
  }

  // Copy form URL to clipboard
  const copyFormUrl = (formId: string) => {
    const url = `${window.location.origin}/forms/${formId}`
    navigator.clipboard.writeText(url)
    toast.success('URL copiada al portapapeles')
  }

  // Delete form
  const deleteForm = async (formId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este formulario?')) {
      return
    }

    try {
      const response = await fetch(`/api/platform/forms/${formId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setForms(forms.filter(form => form.id !== formId))
        toast.success('Formulario eliminado')
      } else {
        toast.error('Error al eliminar formulario')
      }
    } catch (error) {
      console.error('Error deleting form:', error)
      toast.error('Error de conexión')
    }
  }

  useEffect(() => {
    fetchForms()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Formularios de Plataforma</h1>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Formularios de Plataforma</h1>
          <p className="text-gray-600 mt-1">
            Gestiona formularios y códigos QR para marketing de la plataforma
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <BarChart3 className="h-4 w-4 mr-1" />
          {forms.length} formularios
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Crear Nuevo Formulario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título del Formulario</Label>
                <Input
                  id="title"
                  value={newForm.title}
                  onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  placeholder="Ej: Registro de Interés"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Formulario</Label>
                <select
                  id="type"
                  className="w-full p-2 border rounded-md"
                  value={newForm.type}
                  onChange={(e) => setNewForm({ ...newForm, type: e.target.value as any })}
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
                rows={3}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="w-full md:w-auto"
            >
              {isCreating ? 'Creando...' : 'Crear Formulario'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {!Array.isArray(forms) || forms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay formularios</h3>
              <p className="text-gray-600">
                Crea tu primer formulario de plataforma para empezar
              </p>
            </CardContent>
          </Card>
        ) : (
          forms.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {form.title}
                  <Badge>{form.isActive ? 'Activo' : 'Inactivo'}</Badge>
                </CardTitle>
                {form.description && (
                  <p className="text-gray-600">{form.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyFormUrl(form.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFormStatus(form.id, form.isActive)}
                  >
                    {form.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteForm(form.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
