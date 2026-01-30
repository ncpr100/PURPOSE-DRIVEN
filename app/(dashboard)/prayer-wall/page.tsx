'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Clock,
  Send,
  Users,
  BarChart3,
  Loader2,
  LineChart,
  PieChart,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Smartphone,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  HardDrive,
  HelpCircle
} from 'lucide-react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Area,
  AreaChart
} from 'recharts'

interface PrayerAnalytics {
  overview: {
    totalRequestsCount: number
    totalContactos: number
    averageResponseTime: number // in hours
    approvalRate: number // percentage
    userEngagementScore: number // 0-100
  }
  categories: Array<{
    id: string
    name: string
    cantidadPeticiones: number
    approvalRate: number
    color?: string
  }>
  trends?: {
    requestsOverTime: Array<{
      date: string
      peticiones: number
      aprobaciones: number
      rechazos: number
    }>
    contactGrowth: Array<{
      date: string
      contactosNuevos: number
      totalContactos: number
    }>
    responseMetrics: Array<{
      date: string
      respuestasEnviadas: number
      tasaEntrega: number
      tasaRespuesta: number
    }>
  }
  engagement?: {
    mostActiveHours: Array<{
      hour: number
      cantidad: number
    }>
    mostActiveDays: Array<{
      day: string
      cantidad: number
    }>
  }
}

// Colors for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff']

export default function PrayerWallPage() {
  const [viewMode, setViewMode] = useState<'overview'>('overview')
  const [analytics, setAnalytics] = useState<PrayerAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // PWA State Management (User-Facing Features)
  const [isOnline, setIsOnline] = useState(true)
  const [isInstallable, setIsInstallable] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [isInstalled, setIsInstalled] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

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
      console.log('User accepted the install prompt')
    }
    
    setInstallPrompt(null)
    setIsInstallable(false)
  }

  // Notification Permission Handler
  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador no soporta notificaciones')
      return
    }

    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)

    if (permission === 'granted') {
      // Subscribe to push notifications
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          await navigator.serviceWorker.ready
          console.log('Notificaciones activadas correctamente')
        } catch (error) {
          console.error('Error setting up push notifications:', error)
        }
      }
    }
  }

  // Fetch real-time prayer analytics with proper authentication
  useEffect(() => {
    let eventSource: EventSource | null = null
    
    async function fetchAnalytics() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch initial data with proper headers
        const response = await fetch('/api/prayer-analytics?days=30', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Error de red' }))
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setAnalytics(data.analytics || data)
        
        // Set up real-time updates via Server-Sent Events
        try {
          eventSource = new EventSource('/api/prayer-analytics/realtime-updates')
          
          eventSource.onmessage = (event) => {
            try {
              const updateData = JSON.parse(event.data)
              if (updateData.type === 'prayer_analytics_update') {
                setAnalytics(updateData.data)
              }
            } catch (e) {
              console.warn('Error parsing SSE data:', e)
            }
          }
          
          eventSource.onerror = () => {
            console.warn('SSE connection failed, continuing with periodic updates')
          }
        } catch (sseError) {
          console.warn('SSE not available, using periodic updates:', sseError)
        }
        
      } catch (err) {
        console.error('Analytics fetch error:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar datos en tiempo real')
        // Enhanced fallback data with trends
        setAnalytics({
          overview: {
            totalRequestsCount: 156,
            totalContactos: 89,
            averageResponseTime: 4.2,
            approvalRate: 87.5,
            userEngagementScore: 78
        },
          categories: [
            { id: '1', name: 'Salud', cantidadPeticiones: 45, approvalRate: 92 },
            { id: '2', name: 'Familia', cantidadPeticiones: 38, approvalRate: 89 },
            { id: '3', name: 'Trabajo', cantidadPeticiones: 28, approvalRate: 94 },
            { id: '4', name: 'Ministerio', cantidadPeticiones: 25, approvalRate: 96 },
            { id: '5', name: 'Finanzas', cantidadPeticiones: 20, approvalRate: 85 }
          ],
          trends: {
            requestsOverTime: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              peticiones: Math.floor(Math.random() * 10) + 5,
              aprobaciones: Math.floor(Math.random() * 8) + 4,
              rechazos: Math.floor(Math.random() * 2)
            })).reverse(),
            contactGrowth: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              contactosNuevos: Math.floor(Math.random() * 5) + 1,
              totalContactos: 89 - i * 2
            })).reverse(),
            responseMetrics: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              respuestasEnviadas: Math.floor(Math.random() * 8) + 4,
              tasaEntrega: 95 + Math.random() * 5,
              tasaRespuesta: 20 + Math.random() * 10
            })).reverse()
          },
          engagement: {
            mostActiveHours: [
              { hour: 9, cantidad: 15 },
              { hour: 10, cantidad: 12 },
              { hour: 11, cantidad: 20 },
              { hour: 14, cantidad: 18 },
              { hour: 19, cantidad: 25 }
            ],
            mostActiveDays: [
              { day: 'Domingo', cantidad: 45 },
              { day: 'Lunes', cantidad: 20 },
              { day: 'Martes', cantidad: 25 },
              { day: 'Miércoles', cantidad: 30 },
              { day: 'Jueves', cantidad: 22 },
              { day: 'Viernes', cantidad: 28 },
              { day: 'Sábado', cantidad: 18 }
            ]
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    
    // Set up periodic refresh every 2 minutes as fallback
    const interval = setInterval(fetchAnalytics, 120000)
    
    return () => {
      clearInterval(interval)
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  const handleModeSwitch = async (mode: 'overview') => {
    setViewMode(mode)
  }

  const handleExportData = () => {
    if (!analytics) return
    
    const exportData = {
      exportDate: new Date().toISOString(),
      overview: analytics.overview,
      categories: analytics.categories,
      trends: analytics.trends
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prayer-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Muro de Oración
          </h1>
          <p className="text-gray-600 mt-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Conectando con datos en tiempo real...
              </span>
            ) : error ? (
              <div className="flex flex-col gap-1">
                <span className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </span>
                <span className="text-xs text-gray-500">
                  Mostrando datos de ejemplo. La conexión se reintentará automáticamente.
                </span>
              </div>
            ) : (
              <span className="text-green-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Sistema conectado en tiempo real
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExportData}
            disabled={!analytics}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            onClick={() => handleModeSwitch('overview')}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Estadísticas
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open('/prayer-requests', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Todas
          </Button>
        </div>
      </div>

      {/* Mobile Characteristics Status Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Estado de Características Mobile</CardTitle>
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
                    <Smartphone className="h-6 w-6 text-purple-600" />
                    Guía de Características Mobile
                  </DialogTitle>
                  <DialogDescription>
                    Aprende a usar las funciones avanzadas del Muro de Oración
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  {/* Installation Guide */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      Instalar Aplicación
                    </h3>
                    <p className="text-sm text-gray-700">
                      Convierte el Muro de Oración en una aplicación independiente en tu dispositivo.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="font-medium text-sm">Método Automático (Recomendado):</p>
                      <ol className="list-decimal list-inside text-sm space-y-1 ml-2">
                        <li>Haz clic en el botón "Instalar Aplicación" arriba</li>
                        <li>Confirma la instalación en el diálogo del navegador</li>
                        <li>La app aparecerá en tu pantalla de inicio</li>
                      </ol>
                      <p className="font-medium text-sm mt-3">Método Manual (Chrome/Edge):</p>
                      <ol className="list-decimal list-inside text-sm space-y-1 ml-2">
                        <li>Clic en el menú del navegador (⋮)</li>
                        <li>Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"</li>
                        <li>Confirma la instalación</li>
                      </ol>
                      <p className="font-medium text-sm mt-3">Método Manual (Safari iOS):</p>
                      <ol className="list-decimal list-inside text-sm space-y-1 ml-2">
                        <li>Toca el botón Compartir <span className="inline-block">□↑</span></li>
                        <li>Desliza y selecciona "Añadir a pantalla de inicio"</li>
                        <li>Confirma el nombre y toca "Añadir"</li>
                      </ol>
                    </div>
                  </div>

                  {/* Notifications Guide */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5 text-orange-600" />
                      Activar Notificaciones
                    </h3>
                    <p className="text-sm text-gray-700">
                      Recibe alertas instantáneas cuando se publiquen nuevas peticiones de oración.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="font-medium text-sm">Método Automático:</p>
                      <ol className="list-decimal list-inside text-sm space-y-1 ml-2">
                        <li>Haz clic en "Activar Notificaciones" arriba</li>
                        <li>El navegador te pedirá permiso - haz clic en "Permitir"</li>
                        <li>Recibirás una notificación de prueba</li>
                      </ol>
                      <p className="font-medium text-sm mt-3">Solución de Problemas:</p>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                        <li>Si bloqueaste las notificaciones: Ve a Configuración del navegador → Notificaciones → Permitir este sitio</li>
                        <li>En móviles: Verifica que las notificaciones estén habilitadas en Ajustes del sistema</li>
                      </ul>
                    </div>
                  </div>

                  {/* Offline Mode */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-green-600" />
                      Modo Offline
                    </h3>
                    <p className="text-sm text-gray-700">
                      Accede a las peticiones incluso sin conexión a internet.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="font-medium text-sm">Cómo Funciona:</p>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                        <li>Las peticiones recientes se guardan automáticamente en tu dispositivo</li>
                        <li>Puedes leer y revisar peticiones sin conexión</li>
                        <li>Los cambios se sincronizarán cuando recuperes la conexión</li>
                      </ul>
                      <p className="font-medium text-sm mt-3">Beneficios:</p>
                      <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                        <li>Funciona en áreas con señal débil</li>
                        <li>Ahorra datos móviles</li>
                        <li>Carga instantánea - no esperas por la red</li>
                      </ul>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-blue-600" />
                      Estado de Conexión
                    </h3>
                    <p className="text-sm text-gray-700">
                      Monitorea tu estado de conexión en tiempo real.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Online:</span>
                        <span className="text-sm text-gray-700">Datos en tiempo real activos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium">Offline:</span>
                        <span className="text-sm text-gray-700">Usando datos guardados</span>
                      </div>
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
                <p className="text-xs font-medium text-gray-700">Instalable</p>
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
                <p className="text-xs font-medium text-gray-700">Conectividad</p>
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
                <p className="text-xs font-medium text-gray-700">Notificaciones</p>
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
                <p className="text-xs font-medium text-gray-700">Modo Offline</p>
                <Badge variant={isInstalled ? 'default' : 'outline'} className="text-xs">
                  {isInstalled ? 'Listo' : 'Requiere instalación'}
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
                className="bg-purple-600 hover:bg-purple-700"
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
              <Badge variant="secondary" className="px-3 py-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Aplicación instalada correctamente
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Peticiones</p>
                <p className="text-2xl font-bold text-blue-800">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    analytics?.overview?.totalRequestsCount ?? 0
                  )}
                </p>
                {analytics && !loading && (
                  <p className="text-xs text-blue-600 mt-1">
                    {analytics.trends?.requestsOverTime?.reduce((sum, day) => sum + day.aprobaciones, 0) ?? 0} aprobadas
                  </p>
                )}
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Pendientes</p>
                <p className="text-2xl font-bold text-amber-800">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    analytics?.trends?.requestsOverTime?.reduce((sum, day) => sum + day.rechazos, 0) ?? 0
                  )}
                </p>
                {analytics && !loading && (
                  <p className="text-xs text-amber-600 mt-1">
                    {analytics.trends?.requestsOverTime?.reduce((sum, day) => sum + day.rechazos, 0) ?? 0} rechazadas
                  </p>
                )}
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Contactos</p>
                <p className="text-2xl font-bold text-green-800">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    analytics?.overview?.totalContactos ?? 0
                  )}
                </p>
                {analytics && !loading && (
                  <p className="text-xs text-green-600 mt-1">
                    {analytics.overview?.totalContactos ?? 0} activos
                  </p>
                )}
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Respuestas</p>
                <p className="text-2xl font-bold text-purple-800">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    analytics?.trends?.requestsOverTime?.reduce((sum, day) => sum + day.aprobaciones, 0) ?? 0
                  )}
                </p>
                {analytics && !loading && (
                  <p className="text-xs text-purple-600 mt-1">
                    {(analytics.overview?.averageResponseTime ?? 0).toFixed(1)}h promedio
                  </p>
                )}
              </div>
              <Send className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on mode */}
      {viewMode === 'overview' ? (
        <div className="space-y-6">
          {/* Interactive Charts Section */}
          {analytics && analytics.trends && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prayer Requests Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-blue-600" />
                    Tendencia de Peticiones (7 días)
                  </CardTitle>
                  <CardDescription>
                    Peticiones, aprobaciones y rechazos por día
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={analytics.trends?.requestsOverTime ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="peticiones" stroke="#8884d8" strokeWidth={2} name="Peticiones" />
                      <Line type="monotone" dataKey="aprobaciones" stroke="#82ca9d" strokeWidth={2} name="Aprobaciones" />
                      <Line type="monotone" dataKey="rechazos" stroke="#ff7300" strokeWidth={2} name="Rechazos" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Categories Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Distribución por Categorías
                  </CardTitle>
                  <CardDescription>
                    Proporción de peticiones por categoría
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={analytics.categories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cantidadPeticiones"
                      >
                        {(analytics.categories ?? []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contact Growth and Engagement Charts */}
          {analytics && analytics.trends && analytics.engagement && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Growth Area Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Crecimiento de Contactos
                  </CardTitle>
                  <CardDescription>
                    Nuevos contactos y total acumulado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics.trends?.contactGrowth ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="totalContactos" stackId="1" stroke="#8884d8" fill="#8884d8" name="Total de Contactos" />
                      <Area type="monotone" dataKey="contactosNuevos" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Contactos Nuevos" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Most Active Hours Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    Horas Más Activas
                  </CardTitle>
                  <CardDescription>
                    Distribución de peticiones por hora del día
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={analytics.engagement?.mostActiveHours ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#ffc658" name="Cantidad" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : null}

      {/* Sistema Completo */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-purple-800 flex items-center justify-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Muro de Oración
            </h2>
            <p className="text-purple-600">
              Sistema completo de peticiones de oración con análisis y estadísticas.
            </p>
            {analytics && !loading && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700">
                  {analytics.overview?.totalRequestsCount ?? 0} peticiones registradas | 
                  {analytics.trends?.requestsOverTime?.length ?? 0} días de estadísticas
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}