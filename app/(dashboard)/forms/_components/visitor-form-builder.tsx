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
  ListChecks
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

interface VisitorFormData {
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
  }
  isActive: boolean
  isPublic: boolean
  slug?: string
}

interface VisitorFormBuilderProps {
  form?: Partial<VisitorFormData>
  onSave: (formData: VisitorFormData) => Promise<void>
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

const VISITOR_FIELD_PRESETS = [
  {
    id: 'personal-info',
    label: 'Información Personal',
    fields: [
      { id: 'firstName', type: 'text', label: 'Nombre', required: true },
      { id: 'lastName', type: 'text', label: 'Apellido', required: true },
      { id: 'email', type: 'email', label: 'Correo Electrónico', required: true },
      { id: 'phone', type: 'phone', label: 'Teléfono', required: false }
    ]
  },
  {
    id: 'visit-info',
    label: 'Información de Visita',
    fields: [
      { id: 'visitReason', type: 'select', label: 'Motivo de Visita', required: false,
        options: ['Primera visita', 'Invitado por un amigo', 'Evento especial', 'Búsqueda espiritual', 'Otro'] },
      { id: 'referredBy', type: 'text', label: 'Referido por', required: false },
      { id: 'hearAboutUs', type: 'select', label: '¿Cómo supiste de nosotros?', required: false,
        options: ['Redes sociales', 'Sitio web', 'Amigo/Familiar', 'Volante', 'Radio/TV', 'Pasando por aquí'] }
    ]
  },
  {
    id: 'ministry-interest',
    label: 'Interés Ministerial',
    fields: [
      { id: 'ministryInterest', type: 'checkbox', label: 'Ministerios de Interés', required: false,
        options: ['Adoración', 'Enseñanza', 'Niños', 'Jóvenes', 'Intercesión', 'Evangelismo', 'Tecnología'] },
      { id: 'volunteerInterest', type: 'radio', label: '¿Interesado en servir?', required: false,
        options: ['Muy interesado', 'Algo interesado', 'Tal vez en el futuro', 'No en este momento'] }
    ]
  },
  {
    id: 'prayer-spiritual',
    label: 'Oración y Espiritualidad',
    fields: [
      { id: 'prayerRequest', type: 'textarea', label: 'Petición de Oración', required: false },
      { id: 'spiritualBackground', type: 'select', label: 'Trasfondo Espiritual', required: false,
        options: ['Cristiano', 'Católico', 'Otra religión', 'Sin religión', 'Explorando', 'Prefiero no decir'] }
    ]
  }
]

export function VisitorFormBuilder({ form, onSave, onCancel }: VisitorFormBuilderProps) {
  const [formData, setFormData] = useState<VisitorFormData>({
    name: '',
    description: '',
    fields: [],
    style: {
      backgroundColor: '#ffffff',
      primaryColor: '#3b82f6',
      fontFamily: 'Inter'
    },
    settings: {
      thankYouMessage: '¡Gracias por visitarnos! Nos pondremos en contacto contigo pronto.',
      sendNotification: true,
      autoFollowUp: false
    },
    isActive: true,
    isPublic: true,
    ...form
  })

  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'fields' | 'style' | 'settings'>('fields')

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `Nueva ${FIELD_TYPES.find(t => t.value === type)?.label}`,
      placeholder: '',
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Opción 1', 'Opción 2'] : undefined
    }
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
    
    setEditingField(newField)
  }

  const addPresetFields = (preset: any) => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, ...preset.fields.map((field: any) => ({
        ...field,
        id: `field_${Date.now()}_${field.id}`
      }))]
    }))
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
  }

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
  }

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = formData.fields.findIndex(f => f.id === fieldId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= formData.fields.length) return
    
    const newFields = [...formData.fields]
    const [movedField] = newFields.splice(currentIndex, 1)
    newFields.splice(newIndex, 0, movedField)
    
    setFormData(prev => ({ ...prev, fields: newFields }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('El nombre del formulario es requerido')
      return
    }

    if (formData.fields.length === 0) {
      toast.error('Agrega al menos un campo al formulario')
      return
    }

    const slug = formData.slug || generateSlug(formData.name)
    
    await onSave({
      ...formData,
      slug
    })
  }

  const renderFieldEditor = () => {
    if (!editingField) return null

    return (
      <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Campo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="fieldLabel">Etiqueta</Label>
              <Input
                id="fieldLabel"
                value={editingField.label}
                onChange={(e) => setEditingField(prev => prev ? { ...prev, label: e.target.value } : null)}
                placeholder="Ingresa la etiqueta del campo"
              />
            </div>
            
            <div>
              <Label htmlFor="fieldPlaceholder">Placeholder</Label>
              <Input
                id="fieldPlaceholder"
                value={editingField.placeholder || ''}
                onChange={(e) => setEditingField(prev => prev ? { ...prev, placeholder: e.target.value } : null)}
                placeholder="Texto de ayuda"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="fieldRequired"
                checked={editingField.required}
                onCheckedChange={(checked) => setEditingField(prev => prev ? { ...prev, required: checked } : null)}
              />
              <Label htmlFor="fieldRequired">Campo obligatorio</Label>
            </div>
            
            {['select', 'radio', 'checkbox'].includes(editingField.type) && (
              <div>
                <Label>Opciones</Label>
                <div className="space-y-2 mt-2">
                  {editingField.options?.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(editingField.options || [])]
                          newOptions[index] = e.target.value
                          setEditingField(prev => prev ? { ...prev, options: newOptions } : null)
                        }}
                        placeholder={`Opción ${index + 1}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = editingField.options?.filter((_, i) => i !== index)
                          setEditingField(prev => prev ? { ...prev, options: newOptions } : null)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [...(editingField.options || []), '']
                      setEditingField(prev => prev ? { ...prev, options: newOptions } : null)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Opción
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingField(null)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (editingField) {
                updateField(editingField.id, editingField)
                setEditingField(null)
              }
            }}>
              Guardar Campo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre del formulario"
            className="text-xl font-semibold border-none px-0 focus-visible:ring-0"
          />
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descripción del formulario (opcional)"
            className="border-none px-0 resize-none focus-visible:ring-0"
            rows={2}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Editar' : 'Vista Previa'}
          </Button>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
          <Label>Activo</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Tools */}
        {!previewMode && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {FIELD_TYPES.map(fieldType => {
                  const Icon = fieldType.icon
                  return (
                    <Button
                      key={fieldType.value}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addField(fieldType.value as FormField['type'])}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {fieldType.label}
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grupos Predefinidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {VISITOR_FIELD_PRESETS.map(preset => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => addPresetFields(preset)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {preset.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className={previewMode ? 'lg:col-span-4' : 'lg:col-span-3'}>
          {previewMode ? (
            /* Preview Mode */
            <Card className="p-6" style={{ backgroundColor: formData.style.backgroundColor }}>
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-2" style={{ color: formData.style.primaryColor }}>
                  {formData.name || 'Nombre del Formulario'}
                </h2>
                {formData.description && (
                  <p className="text-muted-foreground mb-6">{formData.description}</p>
                )}
                
                <form className="space-y-4">
                  {formData.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      
                      {field.type === 'text' && (
                        <Input placeholder={field.placeholder} disabled />
                      )}
                      {field.type === 'email' && (
                        <Input type="email" placeholder={field.placeholder} disabled />
                      )}
                      {field.type === 'phone' && (
                        <Input type="tel" placeholder={field.placeholder} disabled />
                      )}
                      {field.type === 'number' && (
                        <Input type="number" placeholder={field.placeholder} disabled />
                      )}
                      {field.type === 'textarea' && (
                        <Textarea placeholder={field.placeholder} disabled />
                      )}
                      {field.type === 'select' && (
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                        </Select>
                      )}
                      {field.type === 'radio' && (
                        <div className="space-y-2">
                          {field.options?.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input type="radio" name={field.id} disabled />
                              <Label>{option}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                      {field.type === 'checkbox' && (
                        <div className="space-y-2">
                          {field.options?.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input type="checkbox" disabled />
                              <Label>{option}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <Button 
                    type="submit" 
                    disabled 
                    style={{ backgroundColor: formData.style.primaryColor }}
                  >
                    Enviar
                  </Button>
                </form>
              </div>
            </Card>
          ) : (
            /* Edit Mode */
            <div className="space-y-4">
              {formData.fields.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No hay campos en el formulario
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Agrega campos desde el panel de la izquierda o usa un grupo predefinido
                  </p>
                </Card>
              ) : (
                formData.fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveField(field.id, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveField(field.id, 'down')}
                            disabled={index === formData.fields.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {FIELD_TYPES.find(t => t.value === field.type)?.label}
                            </Badge>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">
                                Requerido
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium mt-1">{field.label}</h4>
                          {field.placeholder && (
                            <p className="text-sm text-muted-foreground">{field.placeholder}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingField(field)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          {form?.id ? 'Actualizar' : 'Crear'} Formulario
        </Button>
      </div>

      {renderFieldEditor()}
    </div>
  )
}