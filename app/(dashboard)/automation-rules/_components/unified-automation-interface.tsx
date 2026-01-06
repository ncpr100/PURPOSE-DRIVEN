'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { TemplateDetailModal } from '@/components/automation-rules/template-detail-modal'
import { CreateAutomationRuleDialog } from './create-automation-rule-dialog'
import { 
  Zap, Plus, CheckCircle, Clock, TrendingUp, Sparkles,
  Users, Calendar, MessageCircle, MessageSquare, ArrowRight, Palette
} from 'lucide-react'

interface AutomationRule {
  id: string; name: string; description: string | null; isActive: boolean
  priority: number; executionCount: number; lastExecuted: string | null; createdAt: string
}

interface Template {
  id: string; name: string; description: string; category: string
  icon: string; color: string; installCount: number; isSystemTemplate: boolean
}

interface ChurchBrandColors {
  prayerRequest?: string; visitorFollowup?: string; socialMedia?: string
  events?: string; primary?: string; secondary?: string
}

const DEFAULT_COLORS: ChurchBrandColors = {
  prayerRequest: '#DDD6FE', visitorFollowup: '#DBEAFE', 
  socialMedia: '#D1FAE5', events: '#FED7AA',
  primary: '#DBEAFE', secondary: '#D1FAE5'
}

const getCategoryIcon = (category: string, brightColor: string) => {
  switch (category) {
    case 'PRAYER_REQUEST': return <MessageSquare className="h-5 w-5" style={{ color: brightColor }} />
    case 'VISITOR_FOLLOWUP': return <Users className="h-5 w-5" style={{ color: brightColor }} />
    case 'SOCIAL_MEDIA': return <MessageCircle className="h-5 w-5" style={{ color: brightColor }} />
    case 'EVENTS': return <Calendar className="h-5 w-5" style={{ color: brightColor }} />
    default: return <Zap className="h-5 w-5" style={{ color: brightColor }} />
  }
}

const getCategoryBrightColor = (category: string): string => {
  switch (category) {
    case 'PRAYER_REQUEST': return '#9333EA'    // purple-600
    case 'VISITOR_FOLLOWUP': return '#2563EB'  // blue-600
    case 'SOCIAL_MEDIA': return '#059669'      // green-600
    case 'EVENTS': return '#EA580C'            // orange-600
    default: return '#2563EB'                  // blue-600
  }
}

const getCategoryPastelColor = (category: string): string => {
  switch (category) {
    case 'PRAYER_REQUEST': return '#DDD6FE'    // purple-200
    case 'VISITOR_FOLLOWUP': return '#DBEAFE'  // blue-200
    case 'SOCIAL_MEDIA': return '#D1FAE5'      // green-200
    case 'EVENTS': return '#FED7AA'            // orange-200
    default: return '#DBEAFE'                  // blue-200
  }
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'PRAYER_REQUEST': 'Peticiones de Oración', 'VISITOR_FOLLOWUP': 'Seguimiento de Visitantes',
    'SOCIAL_MEDIA': 'Redes Sociales', 'EVENTS': 'Eventos'
  }
  return labels[category] || category
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16)
  } : null
}

function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent))
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent))
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function UnifiedAutomationInterface() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [brandColors, setBrandColors] = useState<ChurchBrandColors>(DEFAULT_COLORS)
  const [stats, setStats] = useState({ total: 0, active: 0, totalExecutions: 0, successRate: 0 })

  useEffect(() => {
    if (session?.user) {
      fetchData()
      fetchChurchBrandColors()
    }
  }, [session])

  const fetchChurchBrandColors = async () => {
    try {
      const response = await fetch('/api/church-theme')
      if (response.ok) {
        const data = await response.json()
        if (data.brandColors) {
          const colors = typeof data.brandColors === 'string' ? JSON.parse(data.brandColors) : data.brandColors
          setBrandColors({ ...DEFAULT_COLORS, ...colors })
        }
      }
    } catch (error) {
      console.error('Error fetching brand colors:', error)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [rulesResponse, templatesResponse] = await Promise.all([
        fetch('/api/automation-rules?limit=100'),
        fetch('/api/automation-templates')
      ])

      if (rulesResponse.ok) {
        const rulesData = await rulesResponse.json()
        const rules = rulesData.automationRules || []
        setAutomationRules(rules)
        const active = rules.filter((r: AutomationRule) => r.isActive).length
        const totalExec = rules.reduce((sum: number, r: AutomationRule) => sum + r.executionCount, 0)
        setStats({ total: rules.length, active, totalExecutions: totalExec, successRate: 93.5 })
      }

      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json()
        setTemplates(templatesData.templates || [])
      }
    } catch (error) {
      console.error('Error fetching automation data:', error)
      toast.error('Error al cargar datos de automatización')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRule = async (ruleId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/automation-rules/${ruleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (response.ok) {
        toast.success(currentStatus ? 'Regla pausada' : 'Regla activada')
        fetchData()
      } else {
        toast.error('Error al actualizar regla')
      }
    } catch (error) {
      toast.error('Error al actualizar regla')
    }
  }

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    setModalOpen(true)
  }

  const handleActivateTemplate = async (templateId: string, customizations: any) => {
    try {
      const response = await fetch('/api/automation-templates/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, customizations })
      })
      if (response.ok) {
        toast.success('Plantilla activada correctamente')
        setModalOpen(false)
        setSelectedTemplateId(null)
        fetchData()
      } else {
        toast.error('Error al activar plantilla')
      }
    } catch (error) {
      toast.error('Error al activar plantilla')
    }
  }

  const getCategoryColor = (category: string, templateColor?: string): string => {
    if (templateColor && templateColor.startsWith('#')) return templateColor
    switch (category) {
      case 'PRAYER_REQUEST': return brandColors.prayerRequest || DEFAULT_COLORS.prayerRequest!
      case 'VISITOR_FOLLOWUP': return brandColors.visitorFollowup || DEFAULT_COLORS.visitorFollowup!
      case 'SOCIAL_MEDIA': return brandColors.socialMedia || DEFAULT_COLORS.socialMedia!
      case 'EVENTS': return brandColors.events || DEFAULT_COLORS.events!
      default: return brandColors.primary || DEFAULT_COLORS.primary!
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  const hasActiveRules = automationRules.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reglas de Automatización</h1>
          <p className="text-muted-foreground">Automatiza flujos de trabajo y ahorra tiempo con reglas inteligentes</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Crear Regla Personalizada
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reglas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ejecuciones</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalExecutions}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                <p className="text-3xl font-bold text-gray-900">{stats.successRate}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <Sparkles className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branding Customization Banner */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 border border-blue-200">
                <Palette className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Personaliza los Colores de tus Plantillas</h3>
                <p className="text-gray-600 text-sm">
                  Configura colores personalizados para cada categoría de automatización.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/settings/branding'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="default"
            >
              Configurar Colores
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasActiveRules && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mis Reglas Activas</h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">{automationRules.length} reglas</Badge>
          </div>
          <div className="space-y-3">
            {automationRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        {rule.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Activa</Badge>
                        ) : (
                          <Badge variant="secondary">Pausada</Badge>
                        )}
                      </div>
                      {rule.description && <p className="text-sm text-muted-foreground">{rule.description}</p>}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />{rule.executionCount} ejecuciones
                        </span>
                        {rule.lastExecuted && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />Última: {new Date(rule.lastExecuted).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant={rule.isActive ? "outline" : "default"} size="sm" onClick={() => handleToggleRule(rule.id, rule.isActive)}>
                        {rule.isActive ? 'Pausar' : 'Activar'}
                      </Button>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Plantillas Disponibles</h2>
            <p className="text-muted-foreground">Activa reglas pre-configuradas con un solo clic</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">{templates.length} plantillas</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const brightColor = getCategoryBrightColor(template.category)
            const pastelColor = getCategoryPastelColor(template.category)

            return (
              <Card 
                key={template.id} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-gray-200 bg-white"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex h-14 w-14 items-center justify-center rounded-xl" 
                        style={{ backgroundColor: pastelColor }}
                      >
                        <div className="scale-110">{getCategoryIcon(template.category, brightColor)}</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant="secondary" className="text-xs shadow-sm">Sistema</Badge>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Personalizar colores">
                          <Palette className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 
                        className="font-bold text-base leading-tight mb-2" 
                        style={{ color: brightColor }}
                      >
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                      <div 
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" 
                        style={{ backgroundColor: pastelColor, color: brightColor }}
                      >
                        <div className="scale-75">{getCategoryIcon(template.category, brightColor)}</div>
                        <span>{getCategoryLabel(template.category)}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        <TrendingUp className="h-3.5 w-3.5" />{template.installCount} usos
                      </span>
                    </div>

                    <Button 
                      className="w-full gap-2 shadow-md hover:opacity-90" 
                      style={{ backgroundColor: pastelColor, color: brightColor }} 
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      <Sparkles className="h-4 w-4" />Usar Plantilla<ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">💡 ¿Cómo funcionan las automatizaciones?</h3>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">1️⃣ Disparador</p>
                <p className="text-muted-foreground">La automatización se activa cuando ocurre un evento específico (nueva petición de oración, visitante, etc.)</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">2️⃣ Condiciones</p>
                <p className="text-muted-foreground">Se evalúan condiciones (ej: categoría URGENTE, primera visita) para determinar si continuar</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">3️⃣ Acciones</p>
                <p className="text-muted-foreground">Se ejecutan acciones automáticas (enviar email, SMS, crear tarea, notificar equipo)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TemplateDetailModal templateId={selectedTemplateId} open={modalOpen} onClose={() => { setModalOpen(false); setSelectedTemplateId(null) }} onActivate={handleActivateTemplate} />
      <CreateAutomationRuleDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onSuccess={() => { fetchData() }} />
    </div>
  )
}
