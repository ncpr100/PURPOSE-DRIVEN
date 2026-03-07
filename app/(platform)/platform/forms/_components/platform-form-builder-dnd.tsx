'use client'

/**
 * Drag-and-Drop Platform Form Builder
 * Uses @dnd-kit/core + @dnd-kit/sortable for real drag reorder.
 * Supports: text, textarea, email, phone, number, date, select, radio,
 *           checkbox, file, section, signature
 * Supports: conditional logic (showIf field/operator/value)
 */

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { KeyboardSensor } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  GripVertical,
  Plus,
  Trash2,
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
  Users,
  Calendar,
  Paperclip,
  PenTool,
  Minus,
  GitBranch,
  Save,
  X,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type FieldType =
  | 'text' | 'textarea' | 'email' | 'phone' | 'number' | 'date'
  | 'select' | 'radio' | 'checkbox'
  | 'file' | 'signature' | 'section'

export interface ConditionalRule {
  fieldId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_empty'
  value: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]       // for select / radio / checkbox
  acceptedFiles?: string   // for file: 'image/*,.pdf' etc.
  showIf?: ConditionalRule // conditional logic
}

export interface PlatformFormData {
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

interface PlatformFormBuilderDndProps {
  form?: Partial<PlatformFormData>
  onSave: (formData: PlatformFormData) => Promise<void>
  onCancel: () => void
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const FIELD_TYPES: { value: FieldType; label: string; icon: React.ElementType; group: string }[] = [
  { value: 'text',      label: 'Texto',                icon: Type,        group: 'Básicos' },
  { value: 'textarea',  label: 'Área de texto',        icon: MessageSquare, group: 'Básicos' },
  { value: 'email',     label: 'Correo electrónico',   icon: Mail,        group: 'Básicos' },
  { value: 'phone',     label: 'Teléfono',             icon: Phone,       group: 'Básicos' },
  { value: 'number',    label: 'Número',               icon: Hash,        group: 'Básicos' },
  { value: 'date',      label: 'Fecha',                icon: Calendar,    group: 'Básicos' },
  { value: 'select',    label: 'Lista desplegable',    icon: ListChecks,  group: 'Opciones' },
  { value: 'radio',     label: 'Selección única',      icon: CheckSquare, group: 'Opciones' },
  { value: 'checkbox',  label: 'Selección múltiple',   icon: CheckSquare, group: 'Opciones' },
  { value: 'file',      label: 'Archivo adjunto',      icon: Paperclip,   group: 'Avanzados' },
  { value: 'signature', label: 'Firma digital',        icon: PenTool,     group: 'Avanzados' },
  { value: 'section',   label: 'Separador / Sección',  icon: Minus,       group: 'Diseño' },
]

const CAMPAIGN_TAGS = [
  { value: 'church_acquisition', label: 'Adquisición de Iglesias', icon: Users },
  { value: 'demo_request',       label: 'Solicitudes de Demo',     icon: Eye },
  { value: 'newsletter',         label: 'Newsletter',              icon: Mail },
  { value: 'consultation',       label: 'Consultas',               icon: Target },
  { value: 'lead_generation',    label: 'Generación de Leads',     icon: TrendingUp },
  { value: 'custom',             label: 'Personalizada',           icon: Settings },
]

// ─────────────────────────────────────────────
// Sortable field row (DnD handle + editor)
// ─────────────────────────────────────────────
function SortableField({
  field,
  index,
  allFields,
  onUpdate,
  onRemove,
}: {
  field: FormField
  index: number
  allFields: FormField[]
  onUpdate: (id: string, updates: Partial<FormField>) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const hasOptions = ['select', 'radio', 'checkbox'].includes(field.type)
  const isSection  = field.type === 'section'

  // Build list of other fields for conditional logic dropdown
  const otherFields = allFields.filter((f) => f.id !== field.id && f.type !== 'section')

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className="border border-border shadow-sm">
        <CardHeader className="py-2 px-4">
          <div className="flex items-center gap-2">
            {/* Drag handle */}
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
              title="Arrastrar para reordenar"
            >
              <GripVertical className="h-5 w-5" />
            </button>

            <Badge variant="outline" className="text-xs shrink-0">{field.type}</Badge>
            <span className="font-medium text-sm truncate flex-1">{field.label}</span>

            {field.required && (
              <Badge variant="secondary" className="text-xs shrink-0">Requerido</Badge>
            )}
            {field.showIf && (
              <Badge variant="outline" className="text-xs text-purple-600 shrink-0">
                <GitBranch className="h-3 w-3 mr-1" />
                Condicional
              </Badge>
            )}

            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => onRemove(field.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </CardHeader>

        {!isSection && (
          <CardContent className="px-4 pb-4 pt-0">
            <Accordion type="single" collapsible>
              <AccordionItem value="config" className="border-none">
                <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:no-underline">
                  Editar campo
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Etiqueta</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                          placeholder="Nombre del campo"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                          placeholder="Texto de ayuda"
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    {field.type === 'file' && (
                      <div>
                        <Label className="text-xs">Tipos de archivo aceptados</Label>
                        <Input
                          value={field.acceptedFiles || ''}
                          onChange={(e) => onUpdate(field.id, { acceptedFiles: e.target.value })}
                          placeholder="image/*,.pdf,.docx"
                          className="h-8 text-sm"
                        />
                      </div>
                    )}

                    {hasOptions && (
                      <div>
                        <Label className="text-xs">Opciones (una por línea)</Label>
                        <Textarea
                          value={field.options?.join('\n') || ''}
                          onChange={(e) =>
                            onUpdate(field.id, { options: e.target.value.split('\n').filter(Boolean) })
                          }
                          placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(v) => onUpdate(field.id, { required: v })}
                      />
                      <Label className="text-xs">Campo requerido</Label>
                    </div>

                    {/* Conditional logic */}
                    {otherFields.length > 0 && (
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-purple-600" />
                          <Label className="text-xs font-semibold">Lógica condicional</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Mostrar este campo solo si:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <Select
                            value={field.showIf?.fieldId || ''}
                            onValueChange={(v) =>
                              onUpdate(field.id, {
                                showIf: v
                                  ? { fieldId: v, operator: field.showIf?.operator || 'equals', value: field.showIf?.value || '' }
                                  : undefined,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Campo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Sin condición</SelectItem>
                              {otherFields.map((f) => (
                                <SelectItem key={f.id} value={f.id}>
                                  {f.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={field.showIf?.operator || 'equals'}
                            onValueChange={(v) =>
                              field.showIf &&
                              onUpdate(field.id, {
                                showIf: { ...field.showIf, operator: v as ConditionalRule['operator'] },
                              })
                            }
                            disabled={!field.showIf?.fieldId}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">es igual a</SelectItem>
                              <SelectItem value="not_equals">no es igual a</SelectItem>
                              <SelectItem value="contains">contiene</SelectItem>
                              <SelectItem value="not_empty">no está vacío</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            value={field.showIf?.value || ''}
                            onChange={(e) =>
                              field.showIf &&
                              onUpdate(field.id, { showIf: { ...field.showIf, value: e.target.value } })
                            }
                            placeholder="Valor"
                            className="h-8 text-xs"
                            disabled={!field.showIf?.fieldId || field.showIf?.operator === 'not_empty'}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────
// Live preview renderer
// ─────────────────────────────────────────────
function FormPreview({ formData }: { formData: PlatformFormData }) {
  const [values, setValues] = useState<Record<string, string>>({})

  const isVisible = (field: FormField): boolean => {
    if (!field.showIf) return true
    const dep = formData.fields.find((f) => f.id === field.showIf!.fieldId)
    if (!dep) return true
    const val = values[dep.id] || ''
    switch (field.showIf.operator) {
      case 'equals':    return val === field.showIf.value
      case 'not_equals': return val !== field.showIf.value
      case 'contains':  return val.includes(field.showIf.value)
      case 'not_empty': return val.trim() !== ''
      default: return true
    }
  }

  return (
    <div
      className="p-8 rounded-lg shadow-lg max-w-2xl mx-auto"
      style={{ backgroundColor: formData.style.backgroundColor, fontFamily: formData.style.fontFamily }}
    >
      {formData.style.logoUrl && (
        <div className="text-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={formData.style.logoUrl} alt="Logo" className="h-12 mx-auto object-contain" />
        </div>
      )}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{formData.name || 'Nombre del formulario'}</h2>
        {formData.description && <p className="text-gray-600 text-sm">{formData.description}</p>}
      </div>

      <div className="space-y-5">
        {formData.fields.map((field) => {
          if (!isVisible(field)) return null
          if (field.type === 'section') {
            return (
              <div key={field.id} className="border-t pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {field.label}
                </p>
              </div>
            )
          }
          return (
            <div key={field.id} className="space-y-1">
              <label className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {['text', 'email', 'phone', 'number', 'date'].includes(field.type) && (
                <input
                  type={field.type === 'phone' ? 'tel' : field.type}
                  placeholder={field.placeholder}
                  value={values[field.id] || ''}
                  onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': formData.style.primaryColor } as any}
                />
              )}
              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  rows={3}
                  value={values[field.id] || ''}
                  onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm resize-none"
                />
              )}
              {field.type === 'select' && (
                <select
                  value={values[field.id] || ''}
                  onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Selecciona…</option>
                  {field.options?.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              )}
              {field.type === 'radio' && (
                <div className="space-y-1">
                  {field.options?.map((o, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={field.id}
                        value={o}
                        onChange={() => setValues({ ...values, [field.id]: o })}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'checkbox' && (
                <div className="space-y-1">
                  {field.options?.map((o, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" value={o} />
                      {o}
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'file' && (
                <input
                  type="file"
                  accept={field.acceptedFiles}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                />
              )}
              {field.type === 'signature' && (
                <div className="h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                  <span className="text-xs text-gray-400">Área de firma digital</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <button
          className="w-full py-3 px-6 rounded-md font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: formData.style.primaryColor }}
        >
          Enviar
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export function PlatformFormBuilderDnd({ form, onSave, onCancel }: PlatformFormBuilderDndProps) {
  const [formData, setFormData] = useState<PlatformFormData>({
    name: form?.name || '',
    description: form?.description || '',
    fields: (form?.fields as FormField[]) || [],
    style: {
      backgroundColor: form?.style?.backgroundColor || '#ffffff',
      primaryColor:    form?.style?.primaryColor    || '#3b82f6',
      fontFamily:      form?.style?.fontFamily      || 'Inter',
      logoUrl:         form?.style?.logoUrl         || '',
    },
    settings: {
      redirectUrl:         form?.settings?.redirectUrl         || '',
      thankYouMessage:     form?.settings?.thankYouMessage     || 'Gracias por tu interés. Nos pondremos en contacto pronto.',
      sendNotification:    form?.settings?.sendNotification    ?? true,
      notificationEmail:   form?.settings?.notificationEmail   || '',
      autoFollowUp:        form?.settings?.autoFollowUp        ?? true,
      leadScoring:         form?.settings?.leadScoring         ?? true,
      campaignTag:         form?.campaignTag                   || '',
      conversionTracking:  form?.settings?.conversionTracking  ?? true,
    },
    isActive:    form?.isActive    ?? true,
    isPublic:    form?.isPublic    ?? true,
    campaignTag: form?.campaignTag || '',
    leadScore:   form?.leadScore   || 50,
  })

  const [activeTab, setActiveTab] = useState<'fields' | 'design' | 'settings' | 'preview'>('fields')
  const [addFieldOpen, setAddFieldOpen] = useState(false)
  const [newFieldType, setNewFieldType] = useState<FieldType>('text')
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        setFormData((prev) => {
          const oldIndex = prev.fields.findIndex((f) => f.id === active.id)
          const newIndex = prev.fields.findIndex((f) => f.id === over.id)
          return { ...prev, fields: arrayMove(prev.fields, oldIndex, newIndex) }
        })
      }
    },
    []
  )

  const handleAddField = () => {
    if (!newFieldLabel.trim()) {
      toast.error('El campo debe tener una etiqueta')
      return
    }
    const field: FormField = {
      id:       `field_${Date.now()}`,
      type:     newFieldType,
      label:    newFieldLabel.trim(),
      required: false,
      options:  ['select', 'radio', 'checkbox'].includes(newFieldType) ? ['Opción 1', 'Opción 2'] : undefined,
    }
    setFormData((prev) => ({ ...prev, fields: [...prev.fields, field] }))
    setNewFieldLabel('')
    setNewFieldType('text')
    setAddFieldOpen(false)
    toast.success('Campo agregado')
  }

  const handleUpdateField = (id: string, updates: Partial<FormField>) =>
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }))

  const handleRemoveField = (id: string) =>
    setFormData((prev) => ({ ...prev, fields: prev.fields.filter((f) => f.id !== id) }))

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error('El formulario debe tener un nombre'); return }
    if (formData.fields.length === 0) { toast.error('Agrega al menos un campo'); return }
    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }

  const TABS = [
    { id: 'fields',   label: 'Campos',       icon: Edit3 },
    { id: 'design',   label: 'Diseño',       icon: Palette },
    { id: 'settings', label: 'Ajustes',      icon: Settings },
    { id: 'preview',  label: 'Vista Previa', icon: Eye },
  ] as const

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Left: builder ── */}
      <div className="lg:col-span-2 space-y-4">
        {/* Tab nav */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Fields tab ── */}
        {activeTab === 'fields' && (
          <div className="space-y-4">
            {/* Basic info card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Información del Formulario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Nombre *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Ej: Registro de Nueva Iglesia"
                  />
                </div>
                <div>
                  <Label className="text-xs">Descripción</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe el propósito del formulario"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-xs">Etiqueta de campaña</Label>
                  <Select
                    value={formData.campaignTag}
                    onValueChange={(v) => setFormData((p) => ({ ...p, campaignTag: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona campaña…" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAMPAIGN_TAGS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Fields list with DnD */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Campos</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Arrastra para reordenar
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setAddFieldOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar campo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {formData.fields.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-10 text-center text-muted-foreground">
                    <Edit3 className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Sin campos</p>
                    <p className="text-xs mt-1">Haz clic en "Agregar campo" para comenzar</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={formData.fields.map((f) => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {formData.fields.map((field, idx) => (
                        <SortableField
                          key={field.id}
                          field={field}
                          index={idx}
                          allFields={formData.fields}
                          onUpdate={handleUpdateField}
                          onRemove={handleRemoveField}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Design tab ── */}
        {activeTab === 'design' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personalización Visual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Color de fondo',  key: 'backgroundColor' as const, default: '#ffffff' },
                  { label: 'Color principal', key: 'primaryColor' as const,    default: '#3b82f6' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <Label className="text-xs">{label}</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={formData.style[key] || '#000000'}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, style: { ...p.style, [key]: e.target.value } }))
                        }
                        className="w-10 h-9 p-1 border rounded cursor-pointer"
                      />
                      <Input
                        value={formData.style[key] || ''}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, style: { ...p.style, [key]: e.target.value } }))
                        }
                        placeholder="#000000"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label className="text-xs">Fuente</Label>
                <Select
                  value={formData.style.fontFamily}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, style: { ...p.style, fontFamily: v } }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Inter', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman'].map((f) => (
                      <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">URL del Logo</Label>
                <Input
                  value={formData.style.logoUrl || ''}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, style: { ...p.style, logoUrl: e.target.value } }))
                  }
                  placeholder="https://ejemplo.com/logo.png"
                  className="mt-1"
                />
              </div>

              {/* Live mini preview */}
              <div className="border rounded-lg p-4 text-center" style={{ backgroundColor: formData.style.backgroundColor, fontFamily: formData.style.fontFamily }}>
                <p className="text-base font-bold" style={{ color: formData.style.primaryColor }}>
                  {formData.name || 'Nombre del formulario'}
                </p>
                <button className="mt-3 px-6 py-2 rounded text-white text-sm" style={{ backgroundColor: formData.style.primaryColor }}>
                  Enviar
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Settings tab ── */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {[
              {
                title: 'Marketing y Seguimiento',
                fields: [
                  { key: 'leadScoring' as const,        label: 'Puntuación de leads',           desc: 'Asigna puntuación automática a cada envío' },
                  { key: 'conversionTracking' as const, label: 'Seguimiento de conversiones',   desc: 'Rastrea ROI y conversiones de campañas' },
                  { key: 'autoFollowUp' as const,       label: 'Seguimiento automático',        desc: 'Emails de seguimiento automáticos' },
                ],
              },
              {
                title: 'Notificaciones',
                fields: [
                  { key: 'sendNotification' as const, label: 'Enviar notificaciones', desc: 'Notifica al equipo de cada nuevo envío' },
                ],
              },
            ].map(({ title, fields }) => (
              <Card key={title}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map(({ key, label, desc }) => (
                    <div className="flex items-center justify-between" key={key}>
                      <div>
                        <Label className="text-sm">{label}</Label>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <Switch
                        checked={formData.settings[key] as boolean}
                        onCheckedChange={(v) =>
                          setFormData((p) => ({ ...p, settings: { ...p.settings, [key]: v } }))
                        }
                      />
                    </div>
                  ))}
                  {title === 'Notificaciones' && formData.settings.sendNotification && (
                    <div>
                      <Label className="text-xs">Email de notificación</Label>
                      <Input
                        type="email"
                        value={formData.settings.notificationEmail || ''}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, settings: { ...p.settings, notificationEmail: e.target.value } }))
                        }
                        placeholder="admin@khesed-tek.com"
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Mensajes y Redirección</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Mensaje de agradecimiento</Label>
                  <Textarea
                    value={formData.settings.thankYouMessage || ''}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, settings: { ...p.settings, thankYouMessage: e.target.value } }))
                    }
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">URL de redirección (opcional)</Label>
                  <Input
                    value={formData.settings.redirectUrl || ''}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, settings: { ...p.settings, redirectUrl: e.target.value } }))
                    }
                    placeholder="https://khesed-tek.com/gracias"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Preview tab ── */}
        {activeTab === 'preview' && <FormPreview formData={formData} />}
      </div>

      {/* ── Right: status + actions ── */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Activo</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) => setFormData((p) => ({ ...p, isActive: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Público</Label>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(v) => setFormData((p) => ({ ...p, isPublic: v }))}
              />
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{formData.fields.length} campo(s)</p>
              {formData.campaignTag && (
                <Badge variant="secondary" className="w-full justify-center text-xs">
                  {formData.campaignTag.replace('_', ' ').toUpperCase()}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Field type palette */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground tracking-wide">
              Tipos de campos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-1.5">
              {FIELD_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setNewFieldType(value)
                    setAddFieldOpen(true)
                  }}
                  className="flex items-center gap-1.5 p-2 rounded border border-border text-xs text-left hover:bg-muted transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button onClick={handleSave} className="w-full" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando…' : 'Guardar formulario'}
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>

      {/* ── Add field dialog ── */}
      <Dialog open={addFieldOpen} onOpenChange={setAddFieldOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Campo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tipo de campo</Label>
              <Select value={newFieldType} onValueChange={(v) => setNewFieldType(v as FieldType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Básicos', 'Opciones', 'Avanzados', 'Diseño'].map((group) => (
                    <div key={group}>
                      <p className="px-2 py-1 text-xs text-muted-foreground font-semibold uppercase">
                        {group}
                      </p>
                      {FIELD_TYPES.filter((ft) => ft.group === group).map(({ value, label, icon: Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Etiqueta</Label>
              <Input
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="Ej: Nombre de la Iglesia"
                className="mt-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFieldOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddField} disabled={!newFieldLabel.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
