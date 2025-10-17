'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
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
    // TODO: Open configuration dialog
    toast('Funcionalidad en desarrollo', { icon: '🚧' })
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
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reglas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ejecuciones</p>
                <p className="text-2xl font-bold">{stats.totalExecutions}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasa de Éxito</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <Sparkles className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Section (if no rules) */}
      {!hasActiveRules && (
        <Card className="border-dashed border-2 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <Zap className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  ¡Bienvenido al Sistema de Automatización!
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Parece que es tu primera vez aquí. Las automatizaciones te ayudan a ahorrar 
                  tiempo respondiendo automáticamente a eventos importantes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border">
                  <div className="flex items-center gap-2 mb-2 text-pink-600">
                    <Heart className="h-5 w-5" />
                    <h3 className="font-semibold">Responder a Peticiones de Oración</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Envía confirmación automática y notifica al equipo
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <Users className="h-5 w-5" />
                    <h3 className="font-semibold">Seguimiento de Visitantes</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Mensaje de bienvenida y seguimiento automático
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border">
                  <div className="flex items-center gap-2 mb-2 text-purple-600">
                    <Calendar className="h-5 w-5" />
                    <h3 className="font-semibold">Notificaciones de Cumpleaños</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Felicita automáticamente a tus miembros
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border">
                  <div className="flex items-center gap-2 mb-2 text-orange-600">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-semibold">Y mucho más...</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {templates.length} plantillas listas para usar en segundos
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Ver Plantillas Disponibles
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Crear Regla Personalizada
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>💡 Consejo: Empieza con una plantilla pre-configurada. Solo toma 30 segundos activarla.</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                      style={{ backgroundColor: template.color + '20' }}
                    >
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(template.category)}
                        <Badge variant="outline" className="text-xs">
                          Sistema
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm leading-tight">
                        {template.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{getCategoryLabel(template.category)}</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {template.installCount} usos
                    </span>
                  </div>

                  <Button 
                    className="w-full gap-2" 
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Usar Plantilla
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
    </div>
  )
}
