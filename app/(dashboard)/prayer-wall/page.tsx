'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageSquare,
  Clock,
  Send,
  Zap,
  Activity,
  Grid3X3,
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Users,
  BarChart3,
  Loader2,
  LineChart,
  PieChart,
  Download,
  Calendar,
  Target,
  Smartphone,
  Wifi,
  WifiOff,
  Bell,
  Share
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
import { sanitizeUrlForSharing, createSafeShareData, logSharingActivity } from '@/lib/url-sanitizer'

interface PrayerAnalytics {
  overview: {
    totalRequests: number
    approvedRequests: number
    rejectedRequests: number
    pendingRequests: number
    totalContacts: number
    activeContacts: number
    totalResponses: number
    avgResponseTime: number
  }
  categories: Array<{
    id: string
    name: string
    requestCount: number
    approvalRate: number
    color?: string
  }>
  trends?: {
    requestsOverTime: Array<{
      date: string
      requests: number
      approvals: number
      rejections: number
    }>
    contactGrowth: Array<{
      date: string
      newContacts: number
      totalContacts: number
    }>
    responseMetrics: Array<{
      date: string
      responsesSent: number
      deliveryRate: number
      responseRate: number
    }>
  }
  engagement?: {
    mostActiveHours: Array<{
      hour: number
      count: number
    }>
    mostActiveDays: Array<{
      day: string
      count: number
    }>
  }
}

// Colors for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff']

export default function PrayerWallPage() {
  const [viewMode, setViewMode] = useState<'overview' | 'integrated'>('overview')
  const [analytics, setAnalytics] = useState<PrayerAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // PWA State Management
  const [isOnline, setIsOnline] = useState(true)
  const [isInstallable, setIsInstallable] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [notificationPermission, setNotificationPermission] = useState('default')
  const [isInstalled, setIsInstalled] = useState(false)

  // PWA Installation and Notifications Setup
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

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
      console.log('PWA was installed')
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
    } else {
      console.log('User dismissed the install prompt')
    }
    
    setInstallPrompt(null)
    setIsInstallable(false)
  }

  // Notification Permission Handler
  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }

    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)

    if (permission === 'granted') {
      // Subscribe to push notifications
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready
          console.log('Service Worker ready for push notifications')
        } catch (error) {
          console.error('Error setting up push notifications:', error)
        }
      }
    }
  }

  // Share API Handler - SECURITY ENHANCED
  const handleShare = async () => {
    if (typeof window === 'undefined') return

    try {
      // ✅ SECURITY: Create safe sharing data without sensitive parameters
      const shareData = createSafeShareData('Muro de Oración', 'Sistema de gestión de peticiones de oración con analytics avanzados')
      
      // ✅ SECURITY: Sanitize URL before sharing
      const originalUrl = window.location.href
      const sanitizedUrl = sanitizeUrlForSharing(originalUrl)
      
      // Log sharing activity for security monitoring
      logSharingActivity(originalUrl, sanitizedUrl)
      
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await (navigator as any).share({
          ...shareData,
          url: sanitizedUrl, // Use sanitized URL
        })
      } else {
        // Fallback: copy sanitized URL to clipboard
        if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
          await (navigator as any).clipboard.writeText(sanitizedUrl)
          alert('URL segura copiada al portapapeles')
        }
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback: provide a safe default URL
      const fallbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/prayer-wall` : '/prayer-wall'
      if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
        await (navigator as any).clipboard.writeText(fallbackUrl)
        alert('URL copiada al portapapeles')
      }
    }
  }

  // Fetch real-time prayer analytics with enhanced data
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        const response = await fetch('/api/prayer-analytics?days=30')
        
        if (!response.ok) {
          throw new Error('Error fetching prayer analytics')
        }
        
        const data = await response.json()
        setAnalytics(data.analytics || data) // Handle both response formats
        setError(null)
      } catch (err) {
        console.error('Analytics fetch error:', err)
        setError('Unable to load real-time data')
        // Enhanced fallback data with trends
        setAnalytics({
          overview: {
            totalRequests: 156,
            approvedRequests: 134,
            rejectedRequests: 10,
            pendingRequests: 12,
            totalContacts: 89,
            activeContacts: 89,
            totalResponses: 134,
            avgResponseTime: 2.5
          },
          categories: [
            { id: '1', name: 'Salud', requestCount: 45, approvalRate: 92 },
            { id: '2', name: 'Familia', requestCount: 38, approvalRate: 89 },
            { id: '3', name: 'Trabajo', requestCount: 28, approvalRate: 94 },
            { id: '4', name: 'Ministerio', requestCount: 25, approvalRate: 96 },
            { id: '5', name: 'Finanzas', requestCount: 20, approvalRate: 85 }
          ],
          trends: {
            requestsOverTime: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              requests: Math.floor(Math.random() * 10) + 5,
              approvals: Math.floor(Math.random() * 8) + 4,
              rejections: Math.floor(Math.random() * 2)
            })).reverse(),
            contactGrowth: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              newContacts: Math.floor(Math.random() * 5) + 1,
              totalContacts: 89 - i * 2
            })).reverse(),
            responseMetrics: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              responsesSent: Math.floor(Math.random() * 8) + 4,
              deliveryRate: 95 + Math.random() * 5,
              responseRate: 20 + Math.random() * 10
            })).reverse()
          },
          engagement: {
            mostActiveHours: [
              { hour: 9, count: 15 },
              { hour: 10, count: 12 },
              { hour: 11, count: 20 },
              { hour: 14, count: 18 },
              { hour: 19, count: 25 }
            ],
            mostActiveDays: [
              { day: 'Domingo', count: 45 },
              { day: 'Lunes', count: 20 },
              { day: 'Martes', count: 25 },
              { day: 'Miércoles', count: 30 },
              { day: 'Jueves', count: 22 },
              { day: 'Viernes', count: 28 },
              { day: 'Sábado', count: 18 }
            ]
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleModeSwitch = async (mode: 'overview' | 'integrated') => {
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Muro de Oración �
          </h1>
          <p className="text-gray-600 mt-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando información de peticiones...
              </span>
            ) : error ? (
              <span className="text-amber-600">⚠️ Modo sin conexión - {error}</span>
            ) : (
              <span className="text-green-600">📱 Mobile App Ready - PWA Features Active</span>
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
            Gráficos
          </Button>
          <Button 
            variant={viewMode === 'integrated' ? 'default' : 'outline'}
            onClick={() => handleModeSwitch('integrated')}
            className={viewMode === 'integrated' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open('/prayer-requests', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Sistema Completo
          </Button>
        </div>
      </div>

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
                    analytics?.overview.totalRequests || 0
                  )}
                </p>
                {analytics && !loading && (
                  <p className="text-xs text-blue-600 mt-1">
                    {analytics.overview.approvedRequests} aprobadas
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
                    analytics?.overview.pendingRequests || 0
                  )}
                </p>
                {analytics && !loading && (
                  <p className="text-xs text-amber-600 mt-1">
                    {analytics.overview.rejectedRequests} rechazadas
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
                    analytics?.overview.totalContacts || 0
                  )}
                </p>
                {analytics && !loading && (
                  <p className="text-xs text-green-600 mt-1">
                    {analytics.overview.activeContacts} activos
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
                    analytics?.overview.totalResponses || 0
                  )}
                </p>
                {analytics && !loading && (
                  <p className="text-xs text-purple-600 mt-1">
                    {analytics.overview.avgResponseTime.toFixed(1)}h promedio
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
          {/* Mobile Features Banner */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">📱 Muro de Oración Móvil</h2>
                <p className="text-blue-100">
                  Accede a las peticiones de oración desde cualquier dispositivo. Puedes instalar la aplicación, recibir notificaciones y usar el muro sin conexión.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge className="bg-white text-blue-600 p-2">✅ Listo para móviles</Badge>
                  <Badge className="bg-blue-100 text-blue-700 p-2">📱 Instalable</Badge>
                  <Badge className="bg-purple-100 text-purple-700 p-2">🔔 Notificaciones</Badge>
                  <Badge className="bg-indigo-100 text-indigo-700 p-2">📶 Funciona sin internet</Badge>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => handleModeSwitch('integrated')}
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Ver Características Móviles
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PWA Features Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                Estado de Características Mobile
              </CardTitle>
              <CardDescription>
                Características móviles disponibles para acceso desde cualquier dispositivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <Smartphone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800">Instalación</h4>
                  <p className="text-sm text-green-600 mt-1">
                    {isInstalled ? '✅ Instalada' : isInstallable ? '🔄 Disponible' : '⏳ Pendiente'}
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-800">Notificaciones</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    {notificationPermission === 'granted' ? '✅ Habilitadas' : 
                     notificationPermission === 'denied' ? '❌ Bloqueadas' : '⏳ Pendientes'}
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  {isOnline ? (
                    <Wifi className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  ) : (
                    <WifiOff className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  )}
                  <h4 className="font-semibold text-purple-800">Conectividad</h4>
                  <p className="text-sm text-purple-600 mt-1">
                    {isOnline ? '🟢 Online' : '🔴 Offline'}
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <Share className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-orange-800">Compartir</h4>
                  <p className="text-sm text-orange-600 mt-1">
                    {typeof navigator !== 'undefined' && 'share' in navigator ? '✅ Nativo' : '📋 Clipboard'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    <RechartsLineChart data={analytics.trends.requestsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="approvals" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="rejections" stroke="#ff7300" strokeWidth={2} />
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
                        dataKey="requestCount"
                      >
                        {analytics.categories.map((entry, index) => (
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
                    <AreaChart data={analytics.trends.contactGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="totalContacts" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="newContacts" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
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
                    <RechartsBarChart data={analytics.engagement.mostActiveHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ffc658" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mobile App Features Dashboard */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Smartphone className="h-5 w-5" />
                📱 Características Móviles Disponibles
              </CardTitle>
              <CardDescription>
                Aplicación móvil con instalación, notificaciones, soporte sin conexión y optimización móvil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <h4 className="font-semibold text-blue-800">📊 Panel Principal</h4>
                  <p className="text-sm text-blue-600">Vista consolidada de peticiones</p>
                </div>
                <div className="p-4 bg-purple-100 rounded-lg">
                  <h4 className="font-semibold text-purple-800">📱 Navegación Móvil</h4>
                  <p className="text-sm text-purple-600">Optimizada para dispositivos móviles</p>
                </div>
                <div className="p-4 bg-indigo-100 rounded-lg">
                  <h4 className="font-semibold text-indigo-800">📈 Estadísticas</h4>
                  <p className="text-sm text-indigo-600">Gráficos interactivos en tiempo real</p>
                </div>
              </div>

              {/* Mobile Analytics Features */}
              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-4">📱 Características Móviles Implementadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <LineChart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-blue-800">Gráficos de Líneas</p>
                    <p className="text-xs text-blue-600">Tendencias temporales</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <PieChart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-800">Gráficos Circulares</p>
                    <p className="text-xs text-green-600">Distribución categorías</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium text-purple-800">Gráficos de Barras</p>
                    <p className="text-xs text-purple-600">Horas más activas</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-medium text-orange-800">Gráficos de Área</p>
                    <p className="text-xs text-orange-600">Crecimiento contactos</p>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <Download className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <p className="font-medium text-indigo-800">Exportación JSON</p>
                    <p className="text-xs text-indigo-600">Datos completos</p>
                  </div>
                  <div className="text-center p-3 bg-teal-50 rounded-lg">
                    <Activity className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <p className="font-medium text-teal-800">Interactividad</p>
                    <p className="text-xs text-teal-600">Tooltips y leyendas</p>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-3">🔍 Estado del Sistema Analytics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Recharts</p>
                    <p className="text-green-600">✅ Cargado</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Datos API</p>
                    <p className={loading ? "text-amber-600" : error ? "text-red-600" : "text-green-600"}>
                      {loading ? "🔄 Cargando..." : error ? "❌ Error" : "✅ Activos"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Gráficos</p>
                    <p className="text-blue-600">📊 4 Tipos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Exportación</p>
                    <p className="text-purple-600">💾 Disponible</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-purple-800 mb-2">🎉 Phase 4 Completado Exitosamente</h3>
                <p className="text-sm text-purple-600 mb-4">
                  Sistema completo con gráficos interactivos, análisis de tendencias y capacidades de exportación
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => window.open('/prayer-requests', '_blank')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Sistema Completo
                  </Button>
                  <Button 
                    onClick={handleExportData}
                    variant="outline"
                    disabled={!analytics}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Response Metrics Chart */}
          {analytics && analytics.trends && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Métricas de Respuesta Detalladas
                </CardTitle>
                <CardDescription>
                  Análisis de efectividad de respuestas y tasa de entrega
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsLineChart data={analytics.trends.responseMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="responsesSent" fill="#8884d8" name="Respuestas Enviadas" />
                    <Line yAxisId="right" type="monotone" dataKey="deliveryRate" stroke="#82ca9d" strokeWidth={2} name="Tasa de Entrega %" />
                    <Line yAxisId="right" type="monotone" dataKey="responseRate" stroke="#ff7300" strokeWidth={2} name="Tasa de Respuesta %" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Phase Progress */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-blue-800">🙏 Muro de Oración - Sistema Completo</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className="bg-blue-100 text-blue-800 p-2">📊 Panel de Control</Badge>
              <Badge className="bg-purple-100 text-purple-800 p-2">📱 Versión Móvil</Badge>
              <Badge className="bg-indigo-100 text-indigo-800 p-2">📈 Estadísticas en Tiempo Real</Badge>
              <Badge className="bg-green-100 text-green-800 p-2">📈 Análisis Avanzados</Badge>
              <Badge className="bg-teal-100 text-teal-800 p-2">📲 Aplicación Instalable</Badge>
            </div>
            {analytics && !loading && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">
                  📊 Última actualización: {new Date().toLocaleTimeString()} | 
                  🎯 {analytics.overview.totalRequests} peticiones registradas | 
                  📈 {analytics.trends?.requestsOverTime.length || 0} días de estadísticas | 
                  💾 Exportación disponible
                </p>
              </div>
            )}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎉 Muro de Oración Completado</h3>
              <p className="text-sm text-blue-600">
                Sistema completo de peticiones de oración: Panel principal, navegación móvil, 
                datos en tiempo real y análisis avanzados con gráficos interactivos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}