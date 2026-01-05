'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  Plus, 
  Trash2, 
  ChevronUp,
  ChevronDown, 
  Eye, 
  Edit3,
  Settings,
  Palette,
  Type,
  Phone,
  Mail,
  MessageSquare,
  Hash,
  CheckSquare,
  ListChecks,
  Target,
  TrendingUp,
  Users
} from 'lucide-react'
import { toast } from 'sonner'

interface FormField {
  id: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'email' | 'phone' | 'number'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

interface PlatformFormData {
  id?: string
  name: string
  description?: string
  fields: FormField[]
  style: {
    backgroundColor?: string
    primaryColor?: string
    fontFamily?: string
    logoUrl?: string
  }
  settings: {
    redirectUrl?: string
    thankYouMessage?: string
    sendNotification?: boolean
    notificationEmail?: string
    autoFollowUp?: boolean
    leadScoring?: boolean
    campaignTag?: string
    conversionTracking?: boolean
  }
  isActive: boolean
  isPublic: boolean
  slug?: string
  campaignTag?: string
  leadScore?: number
}

interface PlatformFormBuilderProps {
  form?: Partial<PlatformFormData>
  onSave: (formData: PlatformFormData) => Promise<void>
  onCancel: () => void
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texto', icon: Type },
  { value: 'textarea', label: 'Área de texto', icon: MessageSquare },
  { value: 'email', label: 'Correo electrónico', icon: Mail },
  { value: 'phone', label: 'Teléfono', icon: Phone },
  { value: 'number', label: 'Número', icon: Hash },
  { value: 'select', label: 'Lista desplegable', icon: ListChecks },
  { value: 'radio', label: 'Selección única', icon: CheckSquare },
  { value: 'checkbox', label: 'Selección múltiple', icon: CheckSquare }
]

const CAMPAIGN_TAGS = [
  { value: 'church_acquisition', label: 'Adquisición de Iglesias', icon: Users },
  { value: 'demo_request', label: 'Solicitudes de Demo', icon: Eye },
  { value: 'newsletter', label: 'Newsletter', icon: Mail },
  { value: 'consultation', label: 'Consultas', icon: Target },
  { value: 'lead_generation', label: 'Generación de Leads', icon: TrendingUp },
  { value: 'custom', label: 'Personalizada', icon: Settings }
]

export function PlatformFormBuilder({ form, onSave, onCancel }: PlatformFormBuilderProps) {
  const [formData, setFormData] = useState<PlatformFormData>({
    name: form?.name || '',
    description: form?.description || '',
    fields: form?.fields || [],
    style: {
      backgroundColor: form?.style?.backgroundColor || '#ffffff',
      primaryColor: form?.style?.primaryColor || '#3b82f6',
      fontFamily: form?.style?.fontFamily || 'Inter',
      logoUrl: form?.style?.logoUrl || ''
    },
    settings: {
      redirectUrl: form?.settings?.redirectUrl || '',
      thankYouMessage: form?.settings?.thankYouMessage || 'Gracias por tu interés. Nos pondremos en contacto pronto.',
      sendNotification: form?.settings?.sendNotification ?? true,
      notificationEmail: form?.settings?.notificationEmail || 'admin@khesedtek.com',
      autoFollowUp: form?.settings?.autoFollowUp ?? true,
      leadScoring: form?.settings?.leadScoring ?? true,
      campaignTag: form?.campaignTag || '',
      conversionTracking: form?.settings?.conversionTracking ?? true
    },
    isActive: form?.isActive ?? true,
    isPublic: form?.isPublic ?? true,
    campaignTag: form?.campaignTag || '',
    leadScore: form?.leadScore || 50
  })

  const [activeTab, setActiveTab] = useState<'fields' | 'design' | 'settings' | 'preview'>('fields')
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false
  })
  const [isAddingField, setIsAddingField] = useState(false)

  const handleAddField = () => {
    if (!newField.label) {
      toast.error('El campo debe tener un nombre')
      return
    }

    const field: FormField = {
      id: `field_${Date.now()}`,
      type: newField.type as FormField['type'] || 'text',
      label: newField.label,
      placeholder: newField.placeholder || '',
      required: newField.required || false,
      options: newField.options || []
    }

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }))

    setNewField({ type: 'text', label: '', required: false })
    setIsAddingField(false)
    toast.success('Campo agregado')
  }

  const handleRemoveField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }))
  }

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      const fields = [...prev.fields]
      const index = fields.findIndex(f => f.id === fieldId)
      
      if (direction === 'up' && index > 0) {
        [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]]
      } else if (direction === 'down' && index < fields.length - 1) {
        [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]]
      }
      
      return { ...prev, fields }
    })
  }

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('El formulario debe tener un nombre')
      return
    }

    if (formData.fields.length === 0) {
      toast.error('El formulario debe tener al menos un campo')
      return
    }

    try {
      await onSave(formData)
    } catch (error) {
      toast.error('Error al guardar el formulario')
    }
  }

  const renderFieldEditor = (field: FormField, index: number) => (
    <Card key={field.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{field.type}</Badge>
            <span className="font-medium">{field.label}</span>
            {field.required && (
              <Badge variant="secondary" className="text-xs">Requerido</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMoveField(field.id, 'up')}
              disabled={index === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMoveField(field.id, 'down')}
              disabled={index === formData.fields.length - 1}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveField(field.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Etiqueta</Label>
            <Input
              value={field.label}
              onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
              placeholder="Nombre del campo"
            />
          </div>
          <div>
            <Label>Placeholder</Label>
            <Input
              value={field.placeholder || ''}
              onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
              placeholder="Texto de ayuda"
            />
          </div>
        </div>
        
        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <div className="mt-4">
            <Label>Opciones</Label>
            <Textarea
              value={field.options?.join('\n') || ''}
              onChange={(e) => handleUpdateField(field.id, { 
                options: e.target.value.split('\n').filter(Boolean)
              })}
              placeholder="Una opción por línea"
              rows={4}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            checked={field.required}
            onCheckedChange={(checked) => handleUpdateField(field.id, { required: checked })}
          />
          <Label>Campo requerido</Label>
        </div>
      </CardContent>
    </Card>
  )

  const renderPreview = () => (
    <div className="max-w-2xl mx-auto">
      <div 
        className="p-8 rounded-lg shadow-lg"
        style={{ 
          backgroundColor: formData.style.backgroundColor,
          fontFamily: formData.style.fontFamily
        }}
      >
        {formData.style.logoUrl && (
          <div className="text-center mb-6">
            <img 
              src={formData.style.logoUrl} 
              alt="Logo" 
              className="h-12 mx-auto"
            />
          </div>
        )}
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{formData.name}</h2>
          {formData.description && (
            <p className="text-gray-600">{formData.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {formData.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  style={{ borderColor: formData.style.primaryColor }}
                />
              )}
              
              {field.type === 'email' && (
                <input
                  type="email"
                  placeholder={field.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              )}
              
              {field.type === 'phone' && (
                <input
                  type="tel"
                  placeholder={field.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              )}
              
              {field.type === 'number' && (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              )}
              
              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                />
              )}
              
              {field.type === 'select' && (
                <select className="w-full p-3 border border-gray-300 rounded-md">
                  <option value="">Selecciona una opción</option>
                  {field.options?.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              )}
              
              {field.type === 'radio' && (
                <div className="space-y-2">
                  {field.options?.map((option, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="radio"
                        name={field.id}
                        value={option}
                        className="mr-2"
                      />
                      <label>{option}</label>
                    </div>
                  ))}
                </div>
              )}
              
              {field.type === 'checkbox' && (
                <div className="space-y-2">
                  {field.options?.map((option, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-2"
                      />
                      <label>{option}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            className="w-full py-3 px-6 rounded-md font-medium text-white"
            style={{ backgroundColor: formData.style.primaryColor }}
          >
            Enviar
          </button>
        </div>

        {formData.campaignTag && (
          <div className="mt-4 text-center">
            <Badge variant="outline" className="text-xs">
              Campaña: {formData.campaignTag.replace('_', ' ')}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
      {/* Left Panel - Form Builder */}
      <div className="lg:col-span-2 space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { id: 'fields', label: 'Campos', icon: Edit3 },
            { id: 'design', label: 'Diseño', icon: Palette },
            { id: 'settings', label: 'Configuración', icon: Settings },
            { id: 'preview', label: 'Vista Previa', icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <ScrollArea className="h-full">
          {activeTab === 'fields' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nombre del Formulario</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Registro de Nueva Iglesia"
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe el propósito del formulario"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Etiqueta de Campaña</Label>
                    <Select
                      value={formData.campaignTag}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, campaignTag: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una campaña" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAMPAIGN_TAGS.map(tag => (
                          <SelectItem key={tag.value} value={tag.value}>
                            <div className="flex items-center gap-2">
                              <tag.icon className="h-4 w-4" />
                              {tag.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Fields */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Campos del Formulario</CardTitle>
                    <Button onClick={() => setIsAddingField(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Campo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {formData.fields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay campos agregados</p>
                      <p className="text-sm">Haz clic en "Agregar Campo" para comenzar</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.fields.map((field, index) => renderFieldEditor(field, index))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'design' && (
            <Card>
              <CardHeader>
                <CardTitle>Personalización Visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Color de Fondo</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.style.backgroundColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          style: { ...prev.style, backgroundColor: e.target.value }
                        }))}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={formData.style.backgroundColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          style: { ...prev.style, backgroundColor: e.target.value }
                        }))}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Color Principal</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.style.primaryColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          style: { ...prev.style, primaryColor: e.target.value }
                        }))}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={formData.style.primaryColor}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          style: { ...prev.style, primaryColor: e.target.value }
                        }))}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Fuente</Label>
                  <Select
                    value={formData.style.fontFamily}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      style: { ...prev.style, fontFamily: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>URL del Logo</Label>
                  <Input
                    value={formData.style.logoUrl}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      style: { ...prev.style, logoUrl: e.target.value }
                    }))}
                    placeholder="https://ejemplo.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing y Seguimiento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Puntuación de Leads</Label>
                      <p className="text-sm text-muted-foreground">
                        Asigna automáticamente puntuación a los leads
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.leadScoring}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, leadScoring: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Seguimiento de Conversiones</Label>
                      <p className="text-sm text-muted-foreground">
                        Rastrea conversiones y ROI de campañas
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.conversionTracking}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, conversionTracking: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Seguimiento Automático</Label>
                      <p className="text-sm text-muted-foreground">
                        Envía emails de seguimiento automáticos
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.autoFollowUp}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, autoFollowUp: checked }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enviar Notificaciones</Label>
                    <Switch
                      checked={formData.settings.sendNotification}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, sendNotification: checked }
                      }))}
                    />
                  </div>
                  
                  {formData.settings.sendNotification && (
                    <div>
                      <Label>Email de Notificación</Label>
                      <Input
                        value={formData.settings.notificationEmail}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, notificationEmail: e.target.value }
                        }))}
                        placeholder="admin@khesedtek.com"
                        type="email"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mensajes y Redirección</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Mensaje de Agradecimiento</Label>
                    <Textarea
                      value={formData.settings.thankYouMessage}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, thankYouMessage: e.target.value }
                      }))}
                      rows={3}
                      placeholder="Gracias por tu interés..."
                    />
                  </div>
                  
                  <div>
                    <Label>URL de Redirección (Opcional)</Label>
                    <Input
                      value={formData.settings.redirectUrl}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, redirectUrl: e.target.value }
                      }))}
                      placeholder="https://khesedtek.com/gracias"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'preview' && renderPreview()}
        </ScrollArea>
      </div>

      {/* Right Panel - Actions */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Estado del Formulario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Formulario Activo</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Público</Label>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>
            
            {formData.campaignTag && (
              <div className="pt-4 border-t">
                <Label className="text-sm text-muted-foreground">Campaña Asignada</Label>
                <Badge variant="secondary" className="mt-1 w-full justify-center">
                  {formData.campaignTag.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button onClick={handleSave} className="w-full">
            Guardar Formulario
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
        </div>
      </div>

      {/* Add Field Dialog */}
      <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Campo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo de Campo</Label>
              <Select
                value={newField.type}
                onValueChange={(value) => setNewField(prev => ({ ...prev, type: value as FormField['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Etiqueta</Label>
              <Input
                value={newField.label}
                onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Ej: Nombre de la Iglesia"
              />
            </div>
            
            <div>
              <Label>Placeholder</Label>
              <Input
                value={newField.placeholder}
                onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                placeholder="Texto de ayuda"
              />
            </div>
            
            {(newField.type === 'select' || newField.type === 'radio' || newField.type === 'checkbox') && (
              <div>
                <Label>Opciones</Label>
                <Textarea
                  value={newField.options?.join('\n') || ''}
                  onChange={(e) => setNewField(prev => ({ 
                    ...prev, 
                    options: e.target.value.split('\n').filter(Boolean)
                  }))}
                  placeholder="Una opción por línea"
                  rows={4}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={newField.required}
                onCheckedChange={(checked) => setNewField(prev => ({ ...prev, required: checked }))}
              />
              <Label>Campo requerido</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingField(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddField}>
              Agregar Campo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}