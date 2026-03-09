'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Share2,
  Facebook,
  Instagram,
  Youtube,
  CheckCircle2,
  AlertCircle,
  Send,
  Clock,
  RefreshCw,
  Image as ImageIcon,
  Settings,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface AccountStatus {
  platform: string
  label: string
  configured: boolean
  pageId?: string | null
  accountId?: string | null
  channelId?: string | null
}

interface PostResult {
  success: boolean
  message: string
  postId?: string
}

export default function PlatformSocialMediaPage() {
  const [accounts, setAccounts] = useState<AccountStatus[]>([])
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastResults, setLastResults] = useState<Record<string, PostResult> | null>(null)

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/platform/social-media?action=status')
      if (res.ok) {
        const data = await res.json()
        setAccounts(data.accounts || [])
      }
    } catch {
      toast.error('Error al cargar estado de cuentas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStatus()
  }, [loadStatus])

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  const handlePublish = async () => {
    if (!content.trim()) {
      toast.error('Escribe el contenido del post')
      return
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Selecciona al menos una plataforma')
      return
    }

    setIsPosting(true)
    setLastResults(null)

    try {
      const res = await fetch('/api/platform/social-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms,
          scheduledAt: scheduledAt || undefined,
          imageUrl: imageUrl || undefined,
        }),
      })

      const data = await res.json()

      if (data.scheduled) {
        toast.success(data.message)
        setContent('')
        setImageUrl('')
        setScheduledAt('')
        setSelectedPlatforms([])
        return
      }

      setLastResults(data.results || {})

      if (data.success) {
        toast.success('Post publicado exitosamente')
        setContent('')
        setImageUrl('')
        setScheduledAt('')
        setSelectedPlatforms([])
      } else {
        toast.error('Algunos posts fallaron — revisa los resultados')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsPosting(false)
    }
  }

  const platformIcons: Record<string, React.ReactNode> = {
    FACEBOOK: <Facebook className="h-6 w-6 text-blue-600" />,
    INSTAGRAM: <Instagram className="h-6 w-6 text-pink-500" />,
    YOUTUBE: <Youtube className="h-6 w-6 text-red-600" />,
  }

  const platformColors: Record<string, string> = {
    FACEBOOK: 'border-blue-300 hover:border-blue-500',
    INSTAGRAM: 'border-pink-300 hover:border-pink-500',
    YOUTUBE: 'border-red-300 hover:border-red-500',
  }

  const platformSelectedColors: Record<string, string> = {
    FACEBOOK: 'border-blue-500 bg-blue-50 ring-2 ring-blue-400',
    INSTAGRAM: 'border-pink-500 bg-pink-50 ring-2 ring-pink-400',
    YOUTUBE: 'border-red-500 bg-red-50 ring-2 ring-red-400',
  }

  const charCount = content.length
  const charWarning = charCount > 2000

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="h-6 w-6 text-green-600" />
            Redes Sociales — Plataforma
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Marketing de Khesed-Tek en Facebook, Instagram y YouTube
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadStatus} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <Tabs defaultValue="publish" className="space-y-6">
        <TabsList>
          <TabsTrigger value="publish" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Publicar
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Cuentas
          </TabsTrigger>
        </TabsList>

        {/* ── TAB: PUBLISH ── */}
        <TabsContent value="publish" className="space-y-6">
          {/* Platform selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Seleccionar Plataformas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {accounts.map((acc) => {
                  const selected = selectedPlatforms.includes(acc.platform)
                  const disabled = !acc.configured
                  return (
                    <button
                      key={acc.platform}
                      type="button"
                      disabled={disabled}
                      onClick={() => togglePlatform(acc.platform)}
                      className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                        disabled
                          ? 'opacity-40 cursor-not-allowed border-gray-200'
                          : selected
                          ? platformSelectedColors[acc.platform]
                          : platformColors[acc.platform]
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {platformIcons[acc.platform]}
                        <span className="font-medium text-sm">{acc.label}</span>
                        {acc.configured ? (
                          <Badge className="bg-green-100 text-green-700 text-xs">Configurado</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-500 text-xs">Sin credenciales</Badge>
                        )}
                      </div>
                      {selected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              {accounts.some((a) => !a.configured) && (
                <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Las plataformas sin credenciales requieren variables de entorno en Vercel. Ve a la pestaña &quot;Cuentas&quot;.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Compose */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Composición del Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  placeholder="Escribe tu mensaje de marketing aquí..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className={`mt-1 ${charWarning ? 'border-amber-400' : ''}`}
                />
                <p className={`text-xs mt-1 text-right ${charWarning ? 'text-amber-600' : 'text-gray-400'}`}>
                  {charCount} caracteres {charWarning && '— puede exceder límites de plataforma'}
                </p>
              </div>

              <div>
                <Label htmlFor="imageUrl" className="flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  URL de Imagen (opcional)
                </Label>
                <Input
                  id="imageUrl"
                  placeholder="https://imagen.ejemplo.com/foto.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Instagram requiere imagen para publicar. Usa una URL pública de tu CDN o storage.
                </p>
              </div>

              <div>
                <Label htmlFor="scheduledAt" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Programar para (opcional)
                </Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handlePublish}
                disabled={isPosting || !content.trim() || selectedPlatforms.length === 0}
                className="w-full"
              >
                {isPosting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : scheduledAt ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Programar Post
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publicar Ahora en {selectedPlatforms.length > 0 ? selectedPlatforms.join(', ') : '...'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {lastResults && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resultados de Publicación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(lastResults).map(([platform, result]) => (
                  <div
                    key={platform}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {platformIcons[platform]}
                    <div>
                      <p className={`text-sm font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                        {platform}
                      </p>
                      <p className="text-xs text-gray-600">{result.message}</p>
                      {result.postId && (
                        <p className="text-xs text-gray-400 mt-1">Post ID: {result.postId}</p>
                      )}
                    </div>
                    {result.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 ml-auto flex-shrink-0" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── TAB: ACCOUNTS ── */}
        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estado de Cuentas de Marketing</CardTitle>
              <CardDescription>
                Configura las siguientes variables de entorno en Vercel para activar cada plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Facebook */}
              <div className="rounded-xl border border-blue-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Facebook className="h-7 w-7 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Facebook Page</h3>
                    <p className="text-xs text-gray-500">Publica en la página de Facebook de Khesed-Tek</p>
                  </div>
                  <div className="ml-auto">
                    {accounts.find((a) => a.platform === 'FACEBOOK')?.configured ? (
                      <Badge className="bg-green-100 text-green-700">Activo</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500">No configurado</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                    <code className="text-purple-700 font-mono text-xs">PLATFORM_FB_PAGE_ID</code>
                    <span className="text-gray-500 text-xs">ID de tu Página de Facebook</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                    <code className="text-purple-700 font-mono text-xs">PLATFORM_FB_ACCESS_TOKEN</code>
                    <span className="text-gray-500 text-xs">Token de acceso de larga duración (Meta)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Obtén el token en Meta for Developers → Tu App → Graph API Explorer → Generar token de página permanente.
                </p>
              </div>

              {/* Instagram */}
              <div className="rounded-xl border border-pink-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Instagram className="h-7 w-7 text-pink-500" />
                  <div>
                    <h3 className="font-semibold">Instagram Business</h3>
                    <p className="text-xs text-gray-500">Publica en el perfil de Instagram de Khesed-Tek</p>
                  </div>
                  <div className="ml-auto">
                    {accounts.find((a) => a.platform === 'INSTAGRAM')?.configured ? (
                      <Badge className="bg-green-100 text-green-700">Activo</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500">No configurado</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                    <code className="text-purple-700 font-mono text-xs">PLATFORM_IG_ACCOUNT_ID</code>
                    <span className="text-gray-500 text-xs">Instagram Business Account ID</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                    <code className="text-purple-700 font-mono text-xs">PLATFORM_FB_ACCESS_TOKEN</code>
                    <span className="text-gray-500 text-xs">Mismo token que Facebook (API de Meta)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Instagram usa la misma API de Meta. Requiere cuenta de Instagram Business conectada a una Página de Facebook.
                  Posts deben incluir imagen.
                </p>
              </div>

              {/* YouTube */}
              <div className="rounded-xl border border-red-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Youtube className="h-7 w-7 text-red-600" />
                  <div>
                    <h3 className="font-semibold">YouTube Community</h3>
                    <p className="text-xs text-gray-500">Publica en el canal de YouTube de Khesed-Tek</p>
                  </div>
                  <div className="ml-auto">
                    {accounts.find((a) => a.platform === 'YOUTUBE')?.configured ? (
                      <Badge className="bg-green-100 text-green-700">Activo</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500">No configurado</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                    <code className="text-purple-700 font-mono text-xs">PLATFORM_YT_CHANNEL_ID</code>
                    <span className="text-gray-500 text-xs">ID del canal de YouTube</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                    <code className="text-purple-700 font-mono text-xs">PLATFORM_YT_ACCESS_TOKEN</code>
                    <span className="text-gray-500 text-xs">OAuth2 Access Token de Google</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Los posts de comunidad en YouTube requieren canal con 500+ suscriptores.
                  Token generado vía Google Cloud Console → YouTube Data API v3.
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-800 font-medium mb-1">
                  Cómo agregar las variables en Vercel:
                </p>
                <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                  <li>Ve a vercel.com → Tu proyecto → Settings → Environment Variables</li>
                  <li>Agrega cada variable con su valor correspondiente</li>
                  <li>Redeploya la aplicación (o espera el próximo push automático)</li>
                  <li>Vuelve aquí y haz clic en &quot;Actualizar&quot; para ver el nuevo estado</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
