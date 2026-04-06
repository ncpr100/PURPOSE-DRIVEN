
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  FileText, 
  Search, 
  Star, 
  Users, 
  Heart, 
  Gift, 
  Calendar, 
  MessageSquare,
  Sparkles,
  Pencil,
  Plus,
  Zap
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface BrandColors {
  prayerRequest: string
  visitorFollowup: string
  socialMedia: string
  events: string
  prayerRequestText: string
  visitorFollowupText: string
  socialMediaText: string
  eventsText: string
  badgeBackground: string
  badgeText: string
  buttonBackground: string
  buttonText: string
  primary: string
  secondary: string
}

const DEFAULT_BRAND_COLORS: BrandColors = {
  prayerRequest: '#DDD6FE',
  visitorFollowup: '#DBEAFE',
  socialMedia: '#D1FAE5',
  events: '#FED7AA',
  prayerRequestText: '#7C3AED',
  visitorFollowupText: '#1D4ED8',
  socialMediaText: '#047857',
  eventsText: '#C2410C',
  badgeBackground: '#EDE9FE',
  badgeText: '#6D28D9',
  buttonBackground: '#7C3AED',
  buttonText: '#FFFFFF',
  primary: '#DBEAFE',
  secondary: '#D1FAE5',
}

interface AutomationTemplate {
  id: string
  name: string
  description: string | null
  category: string
  usageCount: number
  isSystem: boolean
  template: any
  creator?: {
    id: string
    name: string | null
  }
}

interface AutomationTemplatesProps {
  onSelectTemplate: (template: AutomationTemplate) => void
}

export function AutomationTemplates({ onSelectTemplate }: AutomationTemplatesProps) {
  const [templates, setTemplates] = useState<AutomationTemplate[]>([])
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [brandColors, setBrandColors] = useState<BrandColors>(DEFAULT_BRAND_COLORS)

  // For the "Personalizar" edit dialog
  const [editTemplate, setEditTemplate] = useState<AutomationTemplate | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // For the "Crear Plantilla Personalizada" dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createDescription, setCreateDescription] = useState('')
  const [createCategory, setCreateCategory] = useState('PRAYER_REQUEST')
  const [createTrigger, setCreateTrigger] = useState('PRAYER_REQUEST_SUBMITTED')
  const [createActionType, setCreateActionType] = useState('SEND_EMAIL')
  const [createActionMessage, setCreateActionMessage] = useState('')
  const [createSaving, setCreateSaving] = useState(false)

  useEffect(() => {
    fetchTemplates()
    fetchBrandColors()
  }, [selectedCategory])

  const fetchBrandColors = async () => {
    try {
      const res = await fetch('/api/church-theme')
      if (res.ok) {
        const data = await res.json()
        if (data.brandColors) {
          setBrandColors({ ...DEFAULT_BRAND_COLORS, ...data.brandColors })
        }
      }
    } catch (_) {
      // Keep defaults on error
    }
  }

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      const response = await fetch(`/api/automation-templates?${params}`)
      if (!response.ok) throw new Error('Error al cargar plantillas')
      
      const data = await response.json()
      setTemplates(data.templates)
      setCategories(data.categories)
      
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'PRAYER_REQUEST': <Heart className="h-5 w-5" />,
      'VISITOR_FOLLOWUP': <Users className="h-5 w-5" />,
      'MEMBER_ENGAGEMENT': <Star className="h-5 w-5" />,
      'DONATION_MANAGEMENT': <Gift className="h-5 w-5" />,
      'EVENT_MANAGEMENT': <Calendar className="h-5 w-5" />
    }
    return icons[category] || <FileText className="h-5 w-5" />
  }

  const getCategoryBg = (category: string): string => {
    const map: Record<string, keyof BrandColors> = {
      'PRAYER_REQUEST': 'prayerRequest',
      'VISITOR_FOLLOWUP': 'visitorFollowup',
      'SOCIAL_MEDIA': 'socialMedia',
      'EVENT_MANAGEMENT': 'events',
    }
    const key = map[category]
    return key ? brandColors[key] : brandColors.primary
  }

  const getCategoryText = (category: string): string => {
    const map: Record<string, keyof BrandColors> = {
      'PRAYER_REQUEST': 'prayerRequestText',
      'VISITOR_FOLLOWUP': 'visitorFollowupText',
      'SOCIAL_MEDIA': 'socialMediaText',
      'EVENT_MANAGEMENT': 'eventsText',
    }
    const key = map[category]
    return key ? brandColors[key] : brandColors.prayerRequestText
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'PRAYER_REQUEST': 'Peticiones de Oración',
      'VISITOR_FOLLOWUP': 'Seguimiento de Visitantes',
      'MEMBER_ENGAGEMENT': 'Compromiso de Miembros',
      'DONATION_MANAGEMENT': 'Gestión de Donaciones',
      'EVENT_MANAGEMENT': 'Gestión de Eventos'
    }
    return labels[category] || category
  }

  const openEditDialog = (template: AutomationTemplate, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditTemplate(template)
    setEditName(template.name)
    setEditDescription(template.description || '')
  }

  const handleSaveEdit = async () => {
    if (!editTemplate || !editName.trim()) return
    setEditSaving(true)
    try {
      const res = await fetch(`/api/automation-templates/${editTemplate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), description: editDescription.trim() })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al guardar')
      }
      setTemplates(prev =>
        prev.map(t =>
          t.id === editTemplate.id
            ? { ...t, name: editName.trim(), description: editDescription.trim() }
            : t
        )
      )
      toast.success('Plantilla actualizada')
      setEditTemplate(null)
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar la plantilla')
    } finally {
      setEditSaving(false)
    }
  }

  const handleCreateTemplate = async () => {
    if (!createName.trim() || !createActionMessage.trim()) return
    setCreateSaving(true)
    try {
      const res = await fetch('/api/automation-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName.trim(),
          description: createDescription.trim() || `Plantilla personalizada: ${createName.trim()}`,
          category: createCategory,
          triggerConfig: { triggerType: createTrigger },
          conditionsConfig: [],
          actionsConfig: [
            {
              type: createActionType,
              config: { message: createActionMessage.trim() }
            }
          ]
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al crear la plantilla')
      }
      const raw = await res.json()
      // Map raw DB shape to component interface (same mapping as GET handler)
      const mapped = {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        category: raw.category,
        usageCount: raw.installCount ?? 0,
        isSystem: raw.isSystemTemplate ?? false,
        template: {
          triggers: raw.triggerConfig,
          conditions: raw.conditionsConfig,
          actions: raw.actionsConfig
        },
        creator: raw.users ?? null
      }
      setTemplates(prev => [mapped, ...prev])
      toast.success('Plantilla creada exitosamente')
      setCreateOpen(false)
      setCreateName('')
      setCreateDescription('')
      setCreateCategory('PRAYER_REQUEST')
      setCreateTrigger('PRAYER_REQUEST_SUBMITTED')
      setCreateActionType('SEND_EMAIL')
      setCreateActionMessage('')
    } catch (err: any) {
      toast.error(err.message || 'Error al crear la plantilla')
    } finally {
      setCreateSaving(false)
    }
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1 max-w-sm" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
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
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Plantillas de Automatización
        </h2>
        <p className="text-muted-foreground mt-1">
          Utiliza plantillas predefinidas para crear reglas rápidamente
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar plantillas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                {getCategoryLabel(category.name)} ({category.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 ml-auto"
          style={{ backgroundColor: brandColors.buttonBackground, color: brandColors.buttonText }}
        >
          <Plus className="h-4 w-4" />
          Crear Plantilla Personalizada
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: getCategoryBg(template.category) }}
                  >
                    <span style={{ color: getCategoryText(template.category) }}>
                      {getCategoryIcon(template.category)}
                    </span>
                  </div>
                  <CardTitle
                    className="text-base leading-tight"
                    style={{ color: getCategoryText(template.category) }}
                  >
                    {template.name}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {template.isSystem && (
                    <Badge
                      variant="secondary"
                      className="gap-1 text-xs"
                      style={{ backgroundColor: brandColors.badgeBackground, color: brandColors.badgeText }}
                    >
                      <Sparkles className="h-3 w-3" />
                      Sistema
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title="Personalizar plantilla"
                    onClick={(e) => openEditDialog(template, e)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-2 mt-1">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Usage Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>{template.usageCount} usos</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onSelectTemplate(template)}
                    className="gap-2"
                    style={{ backgroundColor: brandColors.buttonBackground, color: brandColors.buttonText }}
                  >
                    Usar Plantilla
                  </Button>
                </div>

                {/* Category Badge */}
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: brandColors.badgeBackground, color: brandColors.badgeText }}
                >
                  {getCategoryLabel(template.category)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron plantillas</h3>
              <p className="text-muted-foreground">
                No hay plantillas que coincidan con tu búsqueda.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit / Personalizar Template Dialog */}
      <Dialog open={!!editTemplate} onOpenChange={(open) => !open && setEditTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Personalizar Plantilla</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-desc">Descripción</Label>
              <Textarea
                id="edit-desc"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTemplate(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={editSaving || !editName.trim()}
              style={{ backgroundColor: brandColors.buttonBackground, color: brandColors.buttonText }}
            >
              {editSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crear Plantilla Personalizada Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) setCreateOpen(false) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Crear Plantilla Personalizada
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name */}
            <div>
              <Label htmlFor="create-name">
                Nombre de la Plantilla <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-name"
                placeholder="Ej. Confirmación de Petición Familiar"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="create-desc">Descripción (opcional)</Label>
              <Textarea
                id="create-desc"
                placeholder="Describe cuándo y cómo se debe usar esta plantilla..."
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="create-category">Categoría</Label>
              <Select value={createCategory} onValueChange={setCreateCategory}>
                <SelectTrigger id="create-category" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRAYER_REQUEST">Peticiones de Oración</SelectItem>
                  <SelectItem value="VISITOR_FOLLOWUP">Seguimiento de Visitantes</SelectItem>
                  <SelectItem value="MEMBER_ENGAGEMENT">Compromiso de Miembros</SelectItem>
                  <SelectItem value="DONATION_MANAGEMENT">Gestión de Donaciones</SelectItem>
                  <SelectItem value="EVENT_MANAGEMENT">Gestión de Eventos</SelectItem>
                  <SelectItem value="CUSTOM">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trigger */}
            <div>
              <Label htmlFor="create-trigger">Disparador (¿cuándo se activa?)</Label>
              <Select value={createTrigger} onValueChange={setCreateTrigger}>
                <SelectTrigger id="create-trigger" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRAYER_REQUEST_SUBMITTED">Petición de oración enviada</SelectItem>
                  <SelectItem value="PRAYER_FORM_SUBMITTED">Formulario de oración enviado</SelectItem>
                  <SelectItem value="VISITOR_FORM_SUBMITTED">Formulario de visitante enviado</SelectItem>
                  <SelectItem value="FORM_SUBMITTED">Cualquier formulario enviado</SelectItem>
                  <SelectItem value="MEMBER_JOINED">Nuevo miembro registrado</SelectItem>
                  <SelectItem value="DONATION_RECEIVED">Donación recibida</SelectItem>
                  <SelectItem value="BIRTHDAY">Cumpleaños de miembro</SelectItem>
                  <SelectItem value="FOLLOW_UP_DUE">Seguimiento pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action type */}
            <div>
              <Label htmlFor="create-action-type">Acción (¿qué hace al activarse?)</Label>
              <Select value={createActionType} onValueChange={setCreateActionType}>
                <SelectTrigger id="create-action-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEND_EMAIL">Enviar Email</SelectItem>
                  <SelectItem value="SEND_WHATSAPP">Enviar WhatsApp</SelectItem>
                  <SelectItem value="SEND_SMS">Enviar SMS</SelectItem>
                  <SelectItem value="CREATE_PRAYER_RESPONSE">Crear respuesta de oración</SelectItem>
                  <SelectItem value="CREATE_FOLLOW_UP">Crear tarea de seguimiento</SelectItem>
                  <SelectItem value="SEND_NOTIFICATION">Enviar notificación push</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action message */}
            <div>
              <Label htmlFor="create-action-msg">
                Mensaje de la Acción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="create-action-msg"
                placeholder="Usa {{contactName}}, {{prayerCategory}}, {{prayerPriority}} para personalizar..."
                value={createActionMessage}
                onChange={(e) => setCreateActionMessage(e.target.value)}
                rows={3}
                className="mt-1 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Variables disponibles: <code>&#123;&#123;contactName&#125;&#125;</code> <code>&#123;&#123;prayerCategory&#125;&#125;</code> <code>&#123;&#123;prayerPriority&#125;&#125;</code>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={createSaving || !createName.trim() || !createActionMessage.trim()}
              style={{ backgroundColor: brandColors.buttonBackground, color: brandColors.buttonText }}
            >
              {createSaving ? 'Creando...' : 'Crear Plantilla'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
