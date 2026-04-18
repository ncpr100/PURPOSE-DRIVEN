/**
 * SOCIAL MEDIA DASHBOARD CLIENT COMPONENT
 * 
 * GoHighLevel-style social media management interface
 * Modern, user-friendly design hiding technical complexity
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { 
  Share2, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  Settings,
  Crown,
  Sparkles,
  Upload,
  Image,
  Video,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Zap
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Props {
  connectedAccounts: any[]
  recentPosts: any[]
  aiAddonActive: boolean
  aiAddonExpiry?: Date
  userRole: string
  church: any
}

export default function SocialMediaDashboardClient({
  connectedAccounts,
  recentPosts: initialPosts,
  aiAddonActive,
  aiAddonExpiry,
  userRole,
  church
}: Props) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [recentPosts, setRecentPosts] = useState(initialPosts)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isSyncingAnalytics, setIsSyncingAnalytics] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)

  // Platform connection states
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({})

  // Post creation form
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    scheduledAt: '',
    mediaUrls: [] as string[],
    useAI: false
  })

  // Load analytics on mount
  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/social-media/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  const connectPlatform = async (platform: string) => {
    setIsConnecting(prev => ({ ...prev, [platform]: true }))
    
    try {
      const response = await fetch('/api/social-media/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to OAuth URL
        window.location.href = data.data.authorizationUrl
      } else {
        const error = await response.json()
        toast.error(`Error conectando ${platform}: ${error.error}`)
      }
    } catch (error) {
      toast.error(`Error conectando ${platform}`)
    } finally {
      setIsConnecting(prev => ({ ...prev, [platform]: false }))
    }
  }

  const createPost = async () => {
    if (!newPost.content && newPost.mediaUrls.length === 0) {
      toast.error('Agrega contenido o media para continuar')
      return
    }

    if (newPost.platforms.length === 0) {
      toast.error('Selecciona al menos una plataforma')
      return
    }

    setIsCreatingPost(true)

    try {
      const response = await fetch('/api/social-media/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Post creado exitosamente')
        
        // Reset form
        setNewPost({
          content: '',
          platforms: [],
          scheduledAt: '',
          mediaUrls: [],
          useAI: false
        })

        // Refresh posts
        loadRecentPosts()
      } else {
        const error = await response.json()
        if (error.code === 'AI_ADDON_REQUIRED') {
          toast.error(error.error, {
            duration: 5000
          })
        } else {
          toast.error(`Error: ${error.error}`)
        }
      }
    } catch (error) {
      toast.error('Error al crear el post')
    } finally {
      setIsCreatingPost(false)
    }
  }

  const loadRecentPosts = async () => {
    try {
      const response = await fetch('/api/social-media/scheduler?limit=10')
      if (response.ok) {
        const data = await response.json()
        setRecentPosts(data.data.posts)
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }

  const syncAnalytics = async () => {
    setIsSyncingAnalytics(true)
    
    try {
      const response = await fetch('/api/social-media/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceSync: true })
      })

      if (response.ok) {
        toast.success('Analíticas sincronizadas')
        await loadAnalytics()
      } else {
        toast.error('Error sincronizando analíticas')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setIsSyncingAnalytics(false)
    }
  }

  const upgradeToAI = () => {
    // Navigate to upgrade flow
    window.location.href = '/social-media-v2?upgrade=ai'
  }

  // Connected platforms for easy access
  const connectedPlatforms = connectedAccounts.map(account => account.platform)
  const availablePlatforms = ['FACEBOOK', 'INSTAGRAM', 'YOUTUBE']
  const unconnectedPlatforms = availablePlatforms.filter(p => !connectedPlatforms.includes(p))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Share2 className="h-8 w-8 text-[hsl(var(--info))]" />
            Redes Sociales
            {aiAddonActive && (
              <Badge variant="secondary" className="bg-primary text-foreground">
                <Crown className="h-3 w-3 mr-1" />
                Premium AI
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas tus redes sociales desde un solo lugar
          </p>
        </div>

        {!aiAddonActive && (
          <Button 
            onClick={upgradeToAI}
            className="bg-primary hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Activar IA Premium
          </Button>
        )}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <Eye className="h-4 w-4 mr-2" />
            Panel Principal
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Crear Post
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analíticas
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <Settings className="h-4 w-4 mr-2" />
            Cuentas
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cuentas Conectadas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{connectedAccounts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {unconnectedPlatforms.length > 0 ? `${unconnectedPlatforms.length} pendientes` : 'Todas conectadas'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts Publicados</CardTitle>
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.summary?.totalPosts || 0}</div>
                <p className="text-xs text-muted-foreground">Últimos 30 días</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impresiones</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.summary?.totalImpressions?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{analytics?.summary?.averageEngagement || 0} interacciones promedio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Interacción</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.summary?.engagementRate || '0.00'}%</div>
                <p className="text-xs text-muted-foreground">Promedio de plataformas</p>
              </CardContent>
            </Card>
          </div>

          {/* Connected Accounts Overview */}
          {connectedAccounts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[hsl(var(--info))]" />
                  Cuentas Conectadas
                </CardTitle>
                <CardDescription>
                  Gestiona tus plataformas sociales conectadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedAccounts.map(account => (
                    <div key={account.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 rounded-full btn-cta-gradient flex items-center justify-center">
                        <Share2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {account.displayName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {account.platform} • @{account.username}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={account.connectionStatus === 'CONNECTED' ? 'default' : 'secondary'} className="text-xs">
                            {account.connectionStatus === 'CONNECTED' ? 'Conectado' : 'Desconectado'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[hsl(var(--success))]" />
                  Posts Recientes
                </CardTitle>
                <CardDescription>
                  Tus publicaciones más recientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.slice(0, 5).map(post => (
                    <div key={post.id} className="border-l-4 border-[hsl(var(--info))] pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-foreground line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span>{post.platforms.join(', ')}</span>
                            {post.aiGenerated && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant={
                          post.status === 'PUBLISHED' ? 'default' :
                          post.status === 'SCHEDULED' ? 'secondary' :
                          post.status === 'FAILED' ? 'destructive' : 'outline'
                        }>
                          {post.status === 'PUBLISHED' ? 'Publicado' :
                           post.status === 'SCHEDULED' ? 'Programado' :
                           post.status === 'FAILED' ? 'Error' : post.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connect Platforms CTA */}
          {unconnectedPlatforms.length > 0 && (
            <Card className="border-2 border-dashed border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-[hsl(var(--info))]" />
                  Conecta Más Plataformas
                </CardTitle>
                <CardDescription>
                  Amplía tu alcance conectando más redes sociales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {unconnectedPlatforms.map(platform => (
                    <Button
                      key={platform}
                      variant="outline"
                      onClick={() => connectPlatform(platform)}
                      disabled={isConnecting[platform]}
                      className="h-auto p-6 flex flex-col items-center space-y-2"
                    >
                      {isConnecting[platform] ? (
                        <RefreshCw className="h-8 w-8 animate-spin text-[hsl(var(--info))]" />
                      ) : (
                        <Share2 className="h-8 w-8 text-[hsl(var(--info))]" />
                      )}
                      <span className="font-medium">Conectar {platform}</span>
                      <span className="text-xs text-muted-foreground text-center">
                        {platform === 'FACEBOOK' && 'Páginas y posts automáticos'}
                        {platform === 'INSTAGRAM' && 'Stories y contenido visual'}
                        {platform === 'YOUTUBE' && 'Videos y canal'}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Create Post Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-[hsl(var(--success))]" />
                Crear Nuevo Post
              </CardTitle>
              <CardDescription>
                Crea contenido para todas tus plataformas desde un solo lugar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Contenido del Post</Label>
                <Textarea
                  id="content"
                  placeholder="¿Qué quieres compartir con tu comunidad?"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[120px]"
                />
              </div>

              {/* AI Enhancement Toggle */}
              {aiAddonActive && (
                <div className="flex items-center space-x-2 p-4 bg-[hsl(var(--lavender)/0.10)] rounded-lg border">
                  <Switch
                    id="use-ai"
                    checked={newPost.useAI}
                    onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, useAI: checked }))}
                  />
                  <Label htmlFor="use-ai" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[hsl(var(--lavender))]" />
                    Mejorar contenido con IA Premium
                  </Label>
                </div>
              )}

              {/* Platform Selection */}
              <div className="space-y-3">
                <Label>Plataformas de Publicación</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {connectedAccounts.map(account => (
                    <div key={account.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`platform-${account.platform}`}
                        checked={newPost.platforms.includes(account.platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewPost(prev => ({ 
                              ...prev, 
                              platforms: [...prev.platforms, account.platform] 
                            }))
                          } else {
                            setNewPost(prev => ({ 
                              ...prev, 
                              platforms: prev.platforms.filter(p => p !== account.platform)
                            }))
                          }
                        }}
                        className="rounded border-border"
                      />
                      <Label htmlFor={`platform-${account.platform}`} className="text-sm">
                        {account.platform} ({account.username})
                      </Label>
                    </div>
                  ))}
                </div>
                
                {connectedAccounts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Conecta al menos una plataforma para publicar contenido
                  </p>
                )}
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <Label htmlFor="schedule">Programar Publicación (Opcional)</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={newPost.scheduledAt}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={createPost}
                  disabled={isCreatingPost || connectedAccounts.length === 0}
                  className="flex-1"
                >
                  {isCreatingPost ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creando Post...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      {newPost.scheduledAt ? 'Programar Post' : 'Publicar Ahora'}
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setNewPost({
                    content: '',
                    platforms: [],
                    scheduledAt: '',
                    mediaUrls: [],
                    useAI: false
                  })}
                >
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Analíticas de Redes Sociales</h2>
              <p className="text-muted-foreground">Métricas de rendimiento de todas tus plataformas</p>
            </div>
            
            <Button
              onClick={syncAnalytics}
              disabled={isSyncingAnalytics}
              variant="outline"
            >
              {isSyncingAnalytics ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar
                </>
              )}
            </Button>
          </div>

          {analytics ? (
            <>
              {/* Platform Breakdown */}
              {Object.keys(analytics.platformBreakdown || {}).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[hsl(var(--info))]" />
                      Rendimiento por Plataforma
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(analytics.platformBreakdown).map(([platform, data]: [string, any]) => (
                        <div key={platform} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium">{platform}</h3>
                            <Badge variant="outline">@{data.account.username}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Posts</span>
                              <span className="font-medium">{data.metrics.posts}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Impresiones</span>
                              <span className="font-medium">{data.metrics.impressions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Interacciones</span>
                              <span className="font-medium">{data.metrics.engagement.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Promedio/Post</span>
                              <span className="font-medium">{data.averageEngagement}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Posts */}
              {analytics.topPosts && analytics.topPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[hsl(var(--success))]" />
                      Posts con Mayor Interacción
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topPosts.map((post: any, index: number) => (
                        <div key={post.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-[hsl(var(--info)/0.15)] rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-[hsl(var(--info))]">#{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground line-clamp-2 mb-2">{post.content}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {post.engagement} interacciones
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.impressions} impresiones
                              </span>
                              <span>{post.platforms.join(', ')}</span>
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground/70 mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No hay datos de analíticas</h3>
                  <p className="text-muted-foreground mb-4">
                    Conecta tus plataformas y publica contenido para ver analíticas
                  </p>
                  <Button onClick={syncAnalytics} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sincronizar Analíticas
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Accounts Management Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Gestión de Cuentas</h2>
            <p className="text-muted-foreground">Conecta y administra tus plataformas de redes sociales</p>
          </div>

          {/* AI Addon Status */}
          <Card className={aiAddonActive ? 'border-[hsl(var(--lavender)/0.3)] bg-[hsl(var(--lavender)/0.10)]' : 'border-border'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className={aiAddonActive ? 'h-5 w-5 text-[hsl(var(--lavender))]' : 'h-5 w-5 text-muted-foreground/70'} />
                IA Premium para Contenido
                {aiAddonActive && <Badge className="bg-[hsl(var(--lavender)/0.15)] text-[hsl(var(--lavender))]">Activo</Badge>}
              </CardTitle>
              <CardDescription>
                {aiAddonActive 
                  ? `Addon Premium activo hasta ${aiAddonExpiry ? new Date(aiAddonExpiry).toLocaleDateString() : 'fecha no disponible'}`
                  : 'Mejora tu contenido con inteligencia artificial'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiAddonActive ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--success))]">
                    <CheckCircle2 className="h-4 w-4" />
                    Generación automática de hashtags
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--success))]">
                    <CheckCircle2 className="h-4 w-4" />
                    Optimización de contenido por plataforma
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--success))]">
                    <CheckCircle2 className="h-4 w-4" />
                    Sugerencias de mejor momento para publicar
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--success))]">
                    <CheckCircle2 className="h-4 w-4" />
                    Análisis de audiencia y tendencias
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      Generación automática de hashtags
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      Optimización de contenido por plataforma
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      Sugerencias de mejor momento para publicar
                    </div>
                  </div>
                  <Button onClick={upgradeToAI} className="w-full bg-gradient-to-r from-[hsl(var(--lavender))] to-[hsl(var(--primary))]">
                    <Zap className="h-4 w-4 mr-2" />
                    Activar IA Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[hsl(var(--info))]" />
                Plataformas Conectadas ({connectedAccounts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connectedAccounts.length > 0 ? (
                <div className="space-y-4">
                  {connectedAccounts.map(account => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full btn-cta-gradient flex items-center justify-center">
                          <Share2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">{account.displayName}</h3>
                          <p className="text-sm text-muted-foreground">{account.platform} • @{account.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={account.connectionStatus === 'CONNECTED' ? 'default' : 'secondary'}>
                              {account.connectionStatus === 'CONNECTED' ? 'Conectado' : 'Desconectado'}
                            </Badge>
                            {account.canPost && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Puede publicar
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Share2 className="h-12 w-12 text-muted-foreground/70 mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No hay cuentas conectadas</h3>
                  <p className="text-muted-foreground">Conecta tus primeras plataformas para comenzar</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Platforms */}
          {unconnectedPlatforms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-[hsl(var(--success))]" />
                  Plataformas Disponibles
                </CardTitle>
                <CardDescription>
                  Conecta más plataformas para ampliar tu alcance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {unconnectedPlatforms.map(platform => (
                    <Card key={platform} className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <Share2 className="h-12 w-12 text-muted-foreground/70" />
                        <div>
                          <h3 className="font-medium">{platform}</h3>
                          <p className="text-sm text-muted-foreground">
                            {platform === 'FACEBOOK' && 'Páginas y posts automáticos'}
                            {platform === 'INSTAGRAM' && 'Stories y contenido visual'}
                            {platform === 'YOUTUBE' && 'Videos y canal'}
                          </p>
                        </div>
                        <Button
                          onClick={() => connectPlatform(platform)}
                          disabled={isConnecting[platform]}
                          className="w-full"
                        >
                          {isConnecting[platform] ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Conectando...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Conectar
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}