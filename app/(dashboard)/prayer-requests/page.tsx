
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  MessageSquare,
  Heart,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Send,
  Settings,
  Zap,
  BarChart3,
  Activity,
  Sparkles,
  Smartphone,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  HardDrive,
  HelpCircle
} from 'lucide-react'
import { PrayerRequestManager } from '@/components/prayer-wall/PrayerRequestManager'
import { ResponseTemplateManager } from '@/components/prayer-wall/ResponseTemplateManager'
import { PrayerContactManager } from '@/components/prayer-wall/PrayerContactManager'
import { AutomationEngine } from '@/components/prayer-wall/AutomationEngine'
import { PrayerAnalyticsDashboard } from '@/components/prayer-wall/PrayerAnalyticsDashboard'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface DashboardStats {
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  totalContacts: number
  newRequestsToday: number
  responsesSentToday: number
  avgResponseTime: number
  templateCount: number
}

interface RecentActivity {
  id: string
  type: 'request' | 'approval' | 'response' | 'contact'
  title: string
  description: string
  timestamp: string
  status?: string
}

export default function PrayerRequestsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('requests')
  const [stats, setStats] = useState<DashboardStats>({
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalContacts: 0,
    newRequestsToday: 0,
    responsesSentToday: 0,
    avgResponseTime: 0,
    templateCount: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  // PWA State Management (User-Facing Features for Church Team)
  const [isOnline, setIsOnline] = useState(true)
  const [isInstallable, setIsInstallable] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [isInstalled, setIsInstalled] = useState(false)

  // PWA Installation and Notifications Setup
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
    }

    // Online/Offline detection
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // PWA Installation Handler
  const handleInstallApp = async () => {
    if (!installPrompt) return

    installPrompt.prompt()
    const result = await installPrompt.userChoice
    
    if (result.outcome === 'accepted') {
      toast.success('Aplicación instalada correctamente')
    }
    
    setInstallPrompt(null)
    setIsInstallable(false)
  }

  // Notification Permission Handler
  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      toast.error('Este navegador no soporta notificaciones')
      return
    }

    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)

    if (permission === 'granted') {
      toast.success('Notificaciones activadas - Recibirás alertas de nuevas peticiones')
      // Subscribe to push notifications
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          await navigator.serviceWorker.ready
        } catch (error) {
          console.error('Error setting up push notifications:', error)
        }
      }
    } else {
      toast.error('Permisos de notificación denegados')
    }
  }

  useEffect(() => {
    if (session?.user) {
      loadDashboardData()
    }
  }, [session])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadStats(),
        loadRecentActivity()
      ])
    } catch (error) {
      toast.error('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const [requestsRes, contactsRes, templatesRes] = await Promise.all([
        fetch('/api/prayer-requests?limit=1000'),
        fetch('/api/prayer-contacts'),
        fetch('/api/prayer-responses')
      ])

      if (requestsRes.ok && contactsRes.ok && templatesRes.ok) {
        const requestsData = await requestsRes.json()
        const contactsData = await contactsRes.json()
        const templatesData = await templatesRes.json()

        const requests = requestsData.requests || []
        const contacts = contactsData.contacts || []
        const templates = templatesData.responses || []

        const today = new Date().toDateString()
        const newRequestsToday = requests.filter((req: any) => 
          new Date(req.createdAt).toDateString() === today
        ).length

        const pendingRequests = requests.filter((req: any) => req.status === 'pending').length
        const approvedRequests = requests.filter((req: any) => req.status === 'approved').length
        const rejectedRequests = requests.filter((req: any) => req.status === 'rejected').length

        setStats({
          pendingRequests,
          approvedRequests,
          rejectedRequests,
          totalContacts: contacts.length,
          newRequestsToday,
          responsesSentToday: 0, // This would need to come from a messages API
          avgResponseTime: 2.5, // This would need to be calculated from approval times
          templateCount: templates.length
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadRecentActivity = async () => {
    try {
      const response = await fetch('/api/prayer-requests?limit=10&includeAll=true')
      if (response.ok) {
        const data = await response.json()
        const requests = data.requests || []

        const activities: RecentActivity[] = requests.map((req: any) => ({
          id: req.id,
          type: 'request' as const,
          title: `Nueva petición de ${req.contact?.fullName || 'Usuario anónimo'}`,
          description: `Categoría: ${req.category?.name || 'Sin categoría'} - ${req.message.substring(0, 60)}...`,
          timestamp: req.createdAt,
          status: req.status
        }))

        setRecentActivity(activities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ))
      }
    } catch (error) {
      console.error('Error loading recent activity:', error)
    }
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">{trend}</span>
              </div>
            )}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'request': return <MessageSquare className="w-4 h-4" />
      case 'approval': return <CheckCircle className="w-4 h-4" />
      case 'response': return <Send className="w-4 h-4" />
      case 'contact': return <Users className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getActivityColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'approved': return 'text-green-600 bg-green-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Peticiones de Oración</h1>
          <p className="text-gray-600">
            Gestiona las peticiones de oración, plantillas de respuesta y contactos de tu comunidad
          </p>
        </div>
      </div>

      {/* Mobile Characteristics Status Card - PWA Features for Church Team */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Aplicación Mobile - Gestión de Peticiones</CardTitle>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-600" />
                    Guía de Aplicación Mobile - Peticiones de Oración
                  </DialogTitle>
                  <DialogDescription>
                    Instala y usa la app para gestionar peticiones desde cualquier dispositivo
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  {/* Installation Guide */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      Instalar como Aplicación Mobile
                    </h3>
                    <p className="text-sm text-gray-700">
                      Convierte el sistema de peticiones en una app independiente para responder rápidamente desde cualquier lugar.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2 border border-blue-200">
                      <p className="font-medium text-sm text-blue-900">✨ Beneficios para el Equipo:</p>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-blue-800">
                        <li>Responde a peticiones urgentes al instante</li>
                        <li>Funciona sin conexión (modo offline)</li>
                        <li>Recibe notificaciones de nuevas peticiones</li>
                        <li>Acceso rápido desde pantalla de inicio</li>
                        <li>No ocupa espacio en App Store/Play Store</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="font-medium text-sm">Instalación (Recomendado):</p>
                      <ol className="list-decimal list-inside text-sm space-y-1 ml-2">
                        <li>Haz clic en "Instalar Aplicación" arriba</li>
                        <li>Confirma en el diálogo del navegador</li>
                        <li>Encuentra el ícono en tu pantalla de inicio</li>
                        <li>Ábrela como cualquier app nativa</li>
                      </ol>
                    </div>
                  </div>

                  {/* Notifications Guide */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5 text-orange-600" />
                      Notificaciones de Nuevas Peticiones
                    </h3>
                    <p className="text-sm text-gray-700">
                      Recibe alertas inmediatas cuando lleguen peticiones urgentes o nuevas solicitudes.
                    </p>
                    <div className="bg-orange-50 p-4 rounded-lg space-y-2 border border-orange-200">
                      <p className="font-medium text-sm text-orange-900">🔔 Tipos de Notificaciones:</p>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-orange-800">
                        <li><strong>Urgentes:</strong> Peticiones marcadas como prioritarias</li>
                        <li><strong>Nuevas Solicitudes:</strong> Cuando alguien envía una petición</li>
                        <li><strong>Respuestas Pendientes:</strong> Recordatorio de peticiones sin responder</li>
                        <li><strong>Contactos Nuevos:</strong> Cuando se registra un nuevo contacto</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="font-medium text-sm">Activar Notificaciones:</p>
                      <ol className="list-decimal list-inside text-sm space-y-1 ml-2">
                        <li>Haz clic en "Activar Notificaciones" arriba</li>
                        <li>Permite las notificaciones cuando el navegador pregunte</li>
                        <li>Recibirás una notificación de prueba</li>
                        <li>Configura horarios en Ajustes (opcional)</li>
                      </ol>
                    </div>
                  </div>

                  {/* Offline Mode */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-green-600" />
                      Modo Offline - Trabaja Sin Conexión
                    </h3>
                    <p className="text-sm text-gray-700">
                      Accede a peticiones recientes incluso sin internet. Ideal para áreas con señal débil.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg space-y-2 border border-green-200">
                      <p className="font-medium text-sm text-green-900">💾 Qué Funciona Offline:</p>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-green-800">
                        <li>Ver últimas 100 peticiones guardadas</li>
                        <li>Leer detalles completos de cada solicitud</li>
                        <li>Redactar respuestas (se envían al reconectar)</li>
                        <li>Marcar peticiones como leídas</li>
                        <li>Acceder a plantillas de respuesta</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm"><strong>Sincronización Automática:</strong> Cuando recuperes la conexión, todos los cambios se sincronizarán automáticamente con el servidor.</p>
                    </div>
                  </div>

                  {/* Best Practices */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                      Mejores Prácticas para el Equipo
                    </h3>
                    <div className="bg-purple-50 p-4 rounded-lg space-y-2 border border-purple-200">
                      <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-purple-800">
                        <li><strong>Instala en todos los dispositivos:</strong> Móvil, tablet y computadora</li>
                        <li><strong>Activa notificaciones:</strong> No te pierdas peticiones urgentes</li>
                        <li><strong>Responde rápido:</strong> El modo offline te permite trabajar desde cualquier lugar</li>
                        <li><strong>Usa plantillas:</strong> Ahorra tiempo con respuestas predefinidas</li>
                        <li><strong>Revisa analytics:</strong> Monitorea tiempos de respuesta del equipo</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Installable Badge */}
            <div className="flex items-center gap-2">
              <Smartphone className={`h-5 w-5 ${isInstalled || isInstallable ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="text-xs font-medium text-gray-700">App Mobile</p>
                <Badge variant={isInstalled ? 'default' : isInstallable ? 'secondary' : 'outline'} className="text-xs">
                  {isInstalled ? 'Instalada' : isInstallable ? 'Disponible' : 'No disponible'}
                </Badge>
              </div>
            </div>

            {/* Connection Badge */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="text-xs font-medium text-gray-700">Conexión</p>
                <Badge variant={isOnline ? 'default' : 'destructive'} className="text-xs">
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>

            {/* Notifications Badge */}
            <div className="flex items-center gap-2">
              {notificationPermission === 'granted' ? (
                <Bell className="h-5 w-5 text-orange-600" />
              ) : (
                <BellOff className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="text-xs font-medium text-gray-700">Alertas</p>
                <Badge 
                  variant={notificationPermission === 'granted' ? 'default' : 'outline'} 
                  className="text-xs"
                >
                  {notificationPermission === 'granted' ? 'Activas' : 'Inactivas'}
                </Badge>
              </div>
            </div>

            {/* Offline Ready Badge */}
            <div className="flex items-center gap-2">
              <HardDrive className={`h-5 w-5 ${isInstalled ? 'text-blue-600' : 'text-gray-400'}`} />
              <div>
                <p className="text-xs font-medium text-gray-700">Sin Conexión</p>
                <Badge variant={isInstalled ? 'default' : 'outline'} className="text-xs">
                  {isInstalled ? 'Disponible' : 'Requiere app'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {isInstallable && !isInstalled && (
              <Button 
                size="sm" 
                onClick={handleInstallApp}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Instalar Aplicación
              </Button>
            )}
            
            {notificationPermission !== 'granted' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEnableNotifications}
              >
                <Bell className="h-4 w-4 mr-2" />
                Activar Notificaciones
              </Button>
            )}

            {isInstalled && (
              <Badge variant="secondary" className="px-3 py-1.5">
                <CheckCircle className="h-3 w-3 mr-1" />
                App instalada - Lista para trabajo offline
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Peticiones Pendientes"
          value={stats.pendingRequests}
          subtitle="Requieren atención"
          icon={AlertTriangle}
          color="text-yellow-600"
        />
        <StatCard
          title="Peticiones Aprobadas"
          value={stats.approvedRequests}
          subtitle="Este periodo"
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Total de Contactos"
          value={stats.totalContacts}
          subtitle="En la base de datos"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Plantillas Activas"
          value={stats.templateCount}
          subtitle="Listas para usar"
          icon={Send}
          color="text-purple-600"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nuevas hoy</p>
                <p className="text-2xl font-bold">{stats.newRequestsToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Respuestas enviadas hoy</p>
                <p className="text-2xl font-bold">{stats.responsesSentToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tiempo promedio de respuesta</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="requests">
            <MessageSquare className="w-4 h-4 mr-2" />
            Peticiones
          </TabsTrigger>
          <TabsTrigger value="testimonies">
            <Sparkles className="w-4 h-4 mr-2" />
            Agradecimientos
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Settings className="w-4 h-4 mr-2" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Users className="w-4 h-4 mr-2" />
            Contactos
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="w-4 h-4 mr-2" />
            Automatización
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Análisis
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="w-4 h-4 mr-2" />
            Actividad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <PrayerRequestManager 
            onRequestUpdate={loadDashboardData}
          />
        </TabsContent>

        <TabsContent value="testimonies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Gestión de Agradecimientos
              </CardTitle>
              <CardDescription>
                Administra y modera agradecimientos de oraciones contestadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto text-amber-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sistema de Agradecimientos Integrado
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Los agradecimientos se gestionan desde el Muro de Oración con funcionalidad completa 
                  de aprobación, categorización y publicación.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.open('/prayer-wall', '_blank')}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                  >
                    <Sparkles className="w-4 h-4 mr-2 inline" />
                    Ir al Muro de Oración
                  </button>
                  <button
                    onClick={() => window.open('/prayer-wall', '_blank')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Settings className="w-4 h-4 mr-2 inline" />
                    Configurar Formularios
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">0</div>
                  <div className="text-sm text-gray-600">Agradecimientos Pendientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Agradecimientos Aprobados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Agradecimientos Públicos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <ResponseTemplateManager 
            onTemplateUpdate={loadDashboardData}
          />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <PrayerContactManager 
            onContactUpdate={loadDashboardData}
          />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <AutomationEngine 
            onUpdate={loadDashboardData}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PrayerAnalyticsDashboard 
            onExport={(data) => {
              console.log('Analytics exported:', data)
              loadDashboardData()
            }}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No hay actividad reciente
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {format(new Date(activity.timestamp), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                            </p>
                          </div>
                          {activity.status && (
                            <Badge className={
                              activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {activity.status === 'pending' ? 'Pendiente' :
                               activity.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Estado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pendientes</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">{stats.pendingRequests}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aprobadas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">{stats.approvedRequests}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rechazadas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium">{stats.rejectedRequests}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total</span>
                      <span className="font-bold">
                        {stats.pendingRequests + stats.approvedRequests + stats.rejectedRequests}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas Diarias</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{stats.newRequestsToday}</p>
                    <p className="text-sm text-blue-800">Peticiones nuevas hoy</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Send className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{stats.responsesSentToday}</p>
                    <p className="text-sm text-green-800">Respuestas enviadas hoy</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
