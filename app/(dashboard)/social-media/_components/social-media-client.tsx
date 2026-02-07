
/**
 * GOHIGHLEVEL-STYLE SOCIAL MEDIA CLIENT
 * 
 * Professional, simplified social media management interface
 * Hiding technical complexity with one-click connections
 */

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
  Zap,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SocialMediaClient() {
  const { data: session } = useSession()
  
  // State management
  const [activeTab, setActiveTab] = useState('connections')
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [aiAddonActive, setAiAddonActive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Connection states
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({})
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isSyncingAnalytics, setIsSyncingAnalytics] = useState(false)

  // Post creation form
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    scheduledAt: '',
    mediaUrls: [] as string[],
    useAI: false
  })

  useEffect(() => {
    if (session) {
      loadDashboardData()
    }
  }, [session])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load connected accounts
      const accountsResponse = await fetch('/api/social-media/oauth')
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json()
        setConnectedAccounts(accountsData.data || [])
      }

      // Load recent posts
      const postsResponse = await fetch('/api/social-media/scheduler')
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setRecentPosts(postsData.data || [])
      }

      // Load analytics
      const analyticsResponse = await fetch('/api/social-media/analytics')
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData.data)
      }

      // Check AI addon status
      const aiResponse = await fetch('/api/social-media/ai-addon')
      if (aiResponse.ok) {
        const aiData = await aiResponse.json()
        setAiAddonActive(aiData.data?.active || false)
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Error al cargar datos del dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  // One-click platform connection
  const connectPlatform = async (platform: string) => {
    setIsConnecting(prev => ({ ...prev, [platform]: true }))
    
    try {
      // GET request to retrieve OAuth URL
      const response = await fetch(`/api/social-media/connect?platform=${platform}`, {
        method: 'GET'
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.authUrl) {
          // Redirect to OAuth authorization
          window.location.href = data.authUrl
        } else {
          toast.success(`${platform} conectado exitosamente`)
          loadDashboardData() // Refresh data
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Connection failed')
      }
    } catch (error: any) {
      console.error(`Failed to connect ${platform}:`, error)
      toast.error(error.message || `Error al conectar ${platform}`)
    } finally {
      setIsConnecting(prev => ({ ...prev, [platform]: false }))
    }
  }

  // Create and schedule posts
  const createPost = async () => {
    if (!newPost.content.trim() || newPost.platforms.length === 0) {
      toast.error('Por favor completa el contenido y selecciona al menos una plataforma')
      return
    }

    setIsCreatingPost(true)

    try {
      const response = await fetch('/api/social-media/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPost.content,
          platforms: newPost.platforms,
          scheduledAt: newPost.scheduledAt || null,
          mediaUrls: newPost.mediaUrls,
          useAI: newPost.useAI && aiAddonActive
        })
      })

      if (response.ok) {
        toast.success('Post creado exitosamente')
        setNewPost({ content: '', platforms: [], scheduledAt: '', mediaUrls: [], useAI: false })
        loadDashboardData() // Refresh posts
      } else {
        throw new Error('Failed to create post')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      toast.error('Error al crear el post')
    } finally {
      setIsCreatingPost(false)
    }
  }

  // AI Content Generation
  const generateAIContent = async () => {
    if (!aiAddonActive) {
      toast.error('AI Premium requerido para generar contenido')
      return
    }

    try {
      const response = await fetch('/api/social-media/ai-addon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_content',
          prompt: newPost.content || 'Crear contenido inspiracional para iglesia'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNewPost(prev => ({ ...prev, content: data.data.content }))
        toast.success('Contenido AI generado exitosamente')
      } else {
        throw new Error('AI generation failed')
      }
    } catch (error) {
      console.error('Failed to generate AI content:', error)
      toast.error('Error al generar contenido con AI')
    }
  }

  // Sync analytics from all platforms
  const syncAnalytics = async () => {
    setIsSyncingAnalytics(true)
    try {
      const response = await fetch('/api/social-media/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_all' })
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
        toast.success('Analíticas sincronizadas exitosamente')
      } else {
        throw new Error('Analytics sync failed')
      }
    } catch (error) {
      console.error('Failed to sync analytics:', error)
      toast.error('Error al sincronizar analíticas')
    } finally {
      setIsSyncingAnalytics(false)
    }
  }

  // Platform connection status
  const isConnected = (platform: string) => {
    return connectedAccounts.some(acc => acc.platform === platform && acc.isActive)
  }

  // Get platform stats
  const getPlatformStats = (platform: string) => {
    return analytics?.platformStats?.[platform] || { followers: 0, engagement: 0, posts: 0 }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p>Por favor inicia sesión para acceder a la gestión de redes sociales.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with AI Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Redes Sociales</h1>
          <p className="text-gray-600">Gestión profesional simplificada</p>
        </div>
        
        {aiAddonActive && (
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="h-4 w-4 mr-1" />
            AI Premium Activo
          </Badge>
        )}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Conexiones
          </TabsTrigger>
          <TabsTrigger value="publishing" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Publicar
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analíticas
          </TabsTrigger>
          <TabsTrigger value="ai-premium" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Premium
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CONNECTIONS - One-click platform connections */}
        <TabsContent value="connections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Conexiones de Plataformas
              </CardTitle>
              <CardDescription>
                Conecta tus cuentas de redes sociales en un solo clic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {/* Facebook Connection */}
                <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Facebook className="h-8 w-8 text-blue-600" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">Facebook</h3>
                        {isConnected('FACEBOOK') ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Conectado
                          </Badge>
                        ) : (
                          <p className="text-sm text-gray-600">No conectado</p>
                        )}
                      </div>

                      <Button 
                        onClick={() => connectPlatform('FACEBOOK')}
                        disabled={isConnecting.FACEBOOK || isConnected('FACEBOOK')}
                        className="w-full"
                        variant={isConnected('FACEBOOK') ? "outline" : "default"}
                      >
                        {isConnecting.FACEBOOK ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Conectando...
                          </>
                        ) : isConnected('FACEBOOK') ? (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            Reconfigurar
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Conectar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Instagram Connection */}
                <Card className="border-2 border-dashed border-pink-200 hover:border-pink-400 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                        <Instagram className="h-8 w-8 text-pink-600" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">Instagram</h3>
                        {isConnected('INSTAGRAM') ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Conectado
                          </Badge>
                        ) : (
                          <p className="text-sm text-gray-600">No conectado</p>
                        )}
                      </div>

                      <Button 
                        onClick={() => connectPlatform('INSTAGRAM')}
                        disabled={isConnecting.INSTAGRAM || isConnected('INSTAGRAM')}
                        className="w-full"
                        variant={isConnected('INSTAGRAM') ? "outline" : "default"}
                      >
                        {isConnecting.INSTAGRAM ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Conectando...
                          </>
                        ) : isConnected('INSTAGRAM') ? (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            Reconfigurar
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Conectar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* YouTube Connection */}
                <Card className="border-2 border-dashed border-red-200 hover:border-red-400 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Youtube className="h-8 w-8 text-red-600" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">YouTube</h3>
                        {isConnected('YOUTUBE') ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Conectado
                          </Badge>
                        ) : (
                          <p className="text-sm text-gray-600">No conectado</p>
                        )}
                      </div>

                      <Button 
                        onClick={() => connectPlatform('YOUTUBE')}
                        disabled={isConnecting.YOUTUBE || isConnected('YOUTUBE')}
                        className="w-full"
                        variant={isConnected('YOUTUBE') ? "outline" : "default"}
                      >
                        {isConnecting.YOUTUBE ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Conectando...
                          </>
                        ) : isConnected('YOUTUBE') ? (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            Reconfigurar
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Conectar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Connected Accounts Summary */}
              {connectedAccounts.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Cuentas Conectadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {connectedAccounts.filter(acc => acc.isActive).map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {account.platform === 'FACEBOOK' && <Facebook className="h-5 w-5 text-blue-600" />}
                              {account.platform === 'INSTAGRAM' && <Instagram className="h-5 w-5 text-pink-600" />}
                              {account.platform === 'YOUTUBE' && <Youtube className="h-5 w-5 text-red-600" />}
                            </div>
                            <div>
                              <p className="font-medium">{account.displayName || account.username}</p>
                              <p className="text-sm text-gray-600">{account.platform}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Activo
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>


        {/* TAB 2: PUBLISHING - Simplified post creation */}
        <TabsContent value="publishing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-green-600" />
                Crear y Publicar Contenido
              </CardTitle>
              <CardDescription>
                Publica en todas tus plataformas desde un solo lugar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Creation Form */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="content" className="text-base font-medium">
                    Contenido del Post
                  </Label>
                  {aiAddonActive && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateAIContent}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI Generate
                    </Button>
                  )}
                </div>
                
                <Textarea
                  id="content"
                  placeholder="Escribe tu mensaje inspiracional aquí..."
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[120px] resize-none"
                  maxLength={2000}
                />
                
                <div className="text-right text-sm text-gray-500">
                  {newPost.content.length}/2000 caracteres
                </div>
              </div>

              {/* Platform Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Seleccionar Plataformas</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'FACEBOOK', name: 'Facebook', icon: Facebook, color: 'blue' },
                    { id: 'INSTAGRAM', name: 'Instagram', icon: Instagram, color: 'pink' },
                    { id: 'YOUTUBE', name: 'YouTube', icon: Youtube, color: 'red' }
                  ].map((platform) => {
                    const isAvailable = isConnected(platform.id)
                    const isSelected = newPost.platforms.includes(platform.id)
                    
                    return (
                      <div
                        key={platform.id}
                        className={`
                          border-2 rounded-lg p-4 cursor-pointer transition-all
                          ${isAvailable 
                            ? isSelected 
                              ? `border-${platform.color}-500 bg-${platform.color}-50`
                              : `border-gray-200 hover:border-${platform.color}-300`
                            : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                          }
                        `}
                        onClick={() => {
                          if (isAvailable) {
                            setNewPost(prev => ({
                              ...prev,
                              platforms: isSelected
                                ? prev.platforms.filter(p => p !== platform.id)
                                : [...prev.platforms, platform.id]
                            }))
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <platform.icon className={`h-6 w-6 text-${platform.color}-600`} />
                          <div className="flex-1">
                            <p className="font-medium">{platform.name}</p>
                            <p className="text-sm text-gray-500">
                              {isAvailable ? 'Conectado' : 'No conectado'}
                            </p>
                          </div>
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Programar Publicación (Opcional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="datetime-local"
                    value={newPost.scheduledAt}
                    onChange={(e) => setNewPost(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    className="max-w-sm"
                  />
                  {newPost.scheduledAt && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewPost(prev => ({ ...prev, scheduledAt: '' }))}
                    >
                      Publicar Ahora
                    </Button>
                  )}
                </div>
              </div>

              {/* AI Enhancement Toggle */}
              {aiAddonActive && (
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-900">Mejorar con AI</p>
                      <p className="text-sm text-purple-700">Optimizar contenido automáticamente</p>
                    </div>
                  </div>
                  <Switch
                    checked={newPost.useAI}
                    onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, useAI: checked }))}
                  />
                </div>
              )}

              {/* Publish Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setNewPost({ content: '', platforms: [], scheduledAt: '', mediaUrls: [], useAI: false })}
                >
                  Limpiar
                </Button>
                <Button
                  onClick={createPost}
                  disabled={isCreatingPost || !newPost.content.trim() || newPost.platforms.length === 0}
                  className="min-w-[140px]"
                >
                  {isCreatingPost ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {newPost.scheduledAt ? 'Programando...' : 'Publicando...'}
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      {newPost.scheduledAt ? 'Programar Post' : 'Publicar Ahora'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Posts Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 mb-2 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                              {post.status}
                            </Badge>
                            <Calendar className="h-3 w-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB 3: ANALYTICS - Simplified metrics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Analíticas Unificadas</h2>
              <p className="text-gray-600">Métricas de todas tus plataformas en un lugar</p>
            </div>
            <Button onClick={syncAnalytics} disabled={isSyncingAnalytics}>
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

          {/* Analytics Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { platform: 'FACEBOOK', icon: Facebook, color: 'blue' },
              { platform: 'INSTAGRAM', icon: Instagram, color: 'pink' },
              { platform: 'YOUTUBE', icon: Youtube, color: 'red' }
            ].map((platform) => {
              const stats = getPlatformStats(platform.platform)
              const connected = isConnected(platform.platform)
              
              return (
                <Card key={platform.platform} className={connected ? '' : 'opacity-50'}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <platform.icon className={`h-5 w-5 text-${platform.color}-600`} />
                      {platform.platform}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {connected ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Seguidores</span>
                          <span className="font-semibold">{stats.followers.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Engagement</span>
                          <span className="font-semibold">{stats.engagement}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Posts</span>
                          <span className="font-semibold">{stats.posts}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Plataforma no conectada</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setActiveTab('connections')
                          }}
                        >
                          Conectar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* TAB 4: AI PREMIUM - Subscription management */}
        <TabsContent value="ai-premium" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                AI Premium
              </CardTitle>
              <CardDescription>
                Potencia tu contenido con inteligencia artificial
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiAddonActive ? (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900">AI Premium Activo</h3>
                        <p className="text-purple-700">Todas las funciones AI disponibles</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Generación de contenido con GPT-4</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Optimización automática</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Análisis de engagement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Soporte prioritario</span>
                      </div>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Estadísticas de Uso</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Contenido generado este mes</span>
                        <span className="font-semibold">12 posts</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tiempo ahorrado</span>
                        <span className="font-semibold">~8 horas</span>
                      </div>
                      <Progress value={40} className="h-2" />
                      <p className="text-xs text-gray-500">40% del límite mensual utilizado</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-purple-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Desbloquea el Poder de la AI</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Genera contenido profesional, optimiza tus posts y aumenta tu engagement con inteligencia artificial
                    </p>
                  </div>

                  <div className="grid gap-3 max-w-sm mx-auto text-left">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Contenido generado con GPT-4</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Optimización automática por plataforma</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Análisis predictivo de engagement</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Programación inteligente</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-2xl font-bold">$19.99</span>
                      <span className="text-gray-600">/mes</span>
                    </div>
                    <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Crown className="h-4 w-4 mr-2" />
                      Activar AI Premium
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Cancela en cualquier momento</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
