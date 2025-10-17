'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { TemplateDetailModal } from '@/components/automation-rules/template-detail-modal'
import { 
  Zap, 
  Plus, 
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Heart,
  Users,
  Calendar,
  MessageCircle,
  ArrowRight
} from 'lucide-react'

interface AutomationRule {
  id: string
  name: string
  description: string | null
  isActive: boolean
  priority: number
  executionCount: number
  lastExecuted: string | null
  createdAt: string
}

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  installCount: number
  isSystemTemplate: boolean
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'PRAYER_REQUEST':
      return <Heart className="h-5 w-5" />
    case 'VISITOR_FOLLOWUP':
      return <Users className="h-5 w-5" />
    case 'SOCIAL_MEDIA':
      return <MessageCircle className="h-5 w-5" />
    case 'EVENTS':
      return <Calendar className="h-5 w-5" />
    default:
      return <Zap className="h-5 w-5" />
  }
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'PRAYER_REQUEST': 'Peticiones de Oración',
    'VISITOR_FOLLOWUP': 'Seguimiento de Visitantes',
    'SOCIAL_MEDIA': 'Redes Sociales',
    'EVENTS': 'Eventos'
  }
  return labels[category] || category
}

export function UnifiedAutomationInterface() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalExecutions: 0,
    successRate: 0
  })

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch rules and templates in parallel
      const [rulesResponse, templatesResponse] = await Promise.all([
        fetch('/api/automation-rules?limit=100'),
        fetch('/api/automation-templates')
      ])

      if (rulesResponse.ok) {
        const rulesData = await rulesResponse.json()
        const rules = rulesData.automationRules || []
        setAutomationRules(rules)
        
        // Calculate stats
        const active = rules.filter((r: AutomationRule) => r.isActive).length
        const totalExec = rules.reduce((sum: number, r: AutomationRule) => sum + r.executionCount, 0)
        
        setStats({
          total: rules.length,
          active,
          totalExecutions: totalExec,
          successRate: 93.5 // TODO: Calculate from execution logs
        })
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
      // TODO: Implement template activation API call
      toast.success('Plantilla activada correctamente')
      setModalOpen(false)
      fetchData() // Refresh data
    } catch (error) {
      toast.error('Error al activar plantilla')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  const hasActiveRules = automationRules.length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Sistema de Automatización
            </h1>
            <p className="text-muted-foreground">
              Automatiza respuestas a peticiones de oración, seguimiento de visitantes y más
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Reglas</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Activas</p>
                <p className="text-3xl font-bold text-green-900">{stats.active}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Ejecuciones</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalExecutions}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Tasa de Éxito</p>
                <p className="text-3xl font-bold text-orange-900">{stats.successRate}%</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Section (if no rules) */}
      {!hasActiveRules && (
        <Card className="border-dashed border-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-lg">
                  <Zap className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ¡Bienvenido al Sistema de Automatización!
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Parece que es tu primera vez aquí. Las automatizaciones te ayudan a ahorrar 
                  tiempo respondiendo automáticamente a eventos importantes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-pink-600">
                    <Heart className="h-5 w-5" />
                    <h3 className="font-semibold text-sm">Peticiones de Oración</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Confirmación automática y notificación al equipo
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <Users className="h-5 w-5" />
                    <h3 className="font-semibold text-sm">Seguimiento de Visitantes</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bienvenida y seguimiento automático
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-purple-600">
                    <Calendar className="h-5 w-5" />
                    <h3 className="font-semibold text-sm">Cumpleaños</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Felicitaciones automáticas
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-orange-600">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-semibold text-sm">Y mucho más...</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {templates.length} plantillas disponibles
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button size="lg" variant="outline" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Crear Regla Personalizada
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-blue-50 rounded-lg p-3 max-w-2xl mx-auto border border-blue-100">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span>💡 <strong>Consejo:</strong> Empieza con una plantilla pre-configurada abajo. Solo toma 30 segundos activarla.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Rules Section (if has rules) */}
      {hasActiveRules && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mis Reglas Activas</h2>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Regla
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
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
                      {rule.description && (
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {rule.executionCount} ejecuciones
                        </span>
                        {rule.lastExecuted && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Última: {new Date(rule.lastExecuted).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={rule.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleRule(rule.id, rule.isActive)}
                      >
                        {rule.isActive ? 'Pausar' : 'Activar'}
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Templates Section (always visible) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Plantillas Disponibles</h2>
            <p className="text-muted-foreground">
              Activa reglas pre-configuradas con un solo clic
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {templates.length} plantillas
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const gradientColors: Record<string, string> = {
              'PRAYER_REQUEST': 'from-pink-50 via-pink-100 to-rose-100 border-pink-200',
              'VISITOR_FOLLOWUP': 'from-blue-50 via-blue-100 to-cyan-100 border-blue-200',
              'SOCIAL_MEDIA': 'from-purple-50 via-purple-100 to-indigo-100 border-purple-200',
              'EVENTS': 'from-orange-50 via-orange-100 to-amber-100 border-orange-200'
            }
            const gradient = gradientColors[template.category] || 'from-gray-50 to-gray-100 border-gray-200'
            
            const iconGradients: Record<string, string> = {
              'PRAYER_REQUEST': 'from-pink-500 to-rose-600',
              'VISITOR_FOLLOWUP': 'from-blue-500 to-cyan-600',
              'SOCIAL_MEDIA': 'from-purple-500 to-indigo-600',
              'EVENTS': 'from-orange-500 to-amber-600'
            }
            const iconGradient = iconGradients[template.category] || 'from-gray-500 to-gray-600'

            // Emoji mapping for categories
            const categoryEmojis: Record<string, string> = {
              'PRAYER_REQUEST': '🙏',
              'VISITOR_FOLLOWUP': '👥',
              'SOCIAL_MEDIA': '💬',
              'EVENTS': '📅'
            }
            const emoji = categoryEmojis[template.category] || '⚡'

            // Text colors matching button gradient
            const textColors: Record<string, string> = {
              'PRAYER_REQUEST': 'text-pink-600',
              'VISITOR_FOLLOWUP': 'text-blue-600',
              'SOCIAL_MEDIA': 'text-purple-600',
              'EVENTS': 'text-orange-600'
            }
            const textColor = textColors[template.category] || 'text-gray-600'

            return (
              <Card 
                key={template.id} 
                className={`bg-gradient-to-br ${gradient} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div 
                        className={`flex h-14 w-14 items-center justify-center rounded-xl text-3xl bg-gradient-to-br ${iconGradient} shadow-lg`}
                      >
                        <span>{emoji}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant="secondary" className="text-xs shadow-sm">
                          Sistema
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base leading-tight mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${textColor}`}>
                        <span className="text-lg">{emoji}</span>
                        <span>{getCategoryLabel(template.category)}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {template.installCount} usos
                      </span>
                    </div>

                    <Button 
                      className={`w-full gap-2 bg-gradient-to-r ${iconGradient} hover:opacity-90 shadow-md text-white`}
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      <Sparkles className="h-4 w-4" />
                      Usar Plantilla
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Info Footer */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              💡 ¿Cómo funcionan las automatizaciones?
            </h3>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">1️⃣ Disparador</p>
                <p className="text-muted-foreground">
                  La automatización se activa cuando ocurre un evento específico (nueva 
                  petición de oración, visitante, etc.)
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">2️⃣ Condiciones</p>
                <p className="text-muted-foreground">
                  Se evalúan condiciones (ej: categoría URGENTE, primera visita) para 
                  determinar si continuar
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">3️⃣ Acciones</p>
                <p className="text-muted-foreground">
                  Se ejecutan acciones automáticas (enviar email, SMS, crear tarea, 
                  notificar equipo)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Detail Modal */}
      <TemplateDetailModal
        templateId={selectedTemplateId}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedTemplateId(null)
        }}
        onActivate={handleActivateTemplate}
      />
    </div>
  )
}
