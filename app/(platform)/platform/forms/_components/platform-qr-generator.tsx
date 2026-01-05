'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  QrCode, 
  Download, 
  Copy, 
  Share2, 
  Palette, 
  Target,
  TrendingUp,
  Users,
  Eye,
  Settings,
  Link,
  Smartphone,
  MapPin,
  Calendar,
  Mail,
  Globe
} from 'lucide-react'
import { toast } from 'sonner'
import QRCode from 'qrcode'

interface QRConfig {
  size: number
  margin: number
  foregroundColor: string
  backgroundColor: string
  logo?: string
  logoSize: number
  borderStyle: 'square' | 'rounded' | 'dots'
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
}

interface TrackingConfig {
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm?: string
  utmContent?: string
  customParams?: Record<string, string>
}

interface PlatformQRGeneratorProps {
  formId?: string
  formName?: string
  formSlug?: string
  isOpen: boolean
  onClose: () => void
  onQRGenerated?: () => void
}

const CAMPAIGN_PRESETS = [
  { 
    id: 'church_acquisition', 
    name: 'Adquisición de Iglesias',
    icon: Users,
    utmSource: 'qr_code',
    utmMedium: 'offline',
    utmCampaign: 'church_acquisition'
  },
  { 
    id: 'demo_request', 
    name: 'Solicitudes de Demo',
    icon: Eye,
    utmSource: 'qr_code',
    utmMedium: 'print',
    utmCampaign: 'demo_request'
  },
  { 
    id: 'lead_generation', 
    name: 'Generación de Leads',
    icon: TrendingUp,
    utmSource: 'qr_code',
    utmMedium: 'marketing',
    utmCampaign: 'lead_generation'
  },
  {
    id: 'event_promotion',
    name: 'Promoción de Eventos',
    icon: Calendar,
    utmSource: 'qr_code',
    utmMedium: 'event',
    utmCampaign: 'event_promotion'
  },
  {
    id: 'newsletter_signup',
    name: 'Newsletter Signup',
    icon: Mail,
    utmSource: 'qr_code',
    utmMedium: 'newsletter',
    utmCampaign: 'newsletter_signup'
  }
]

const PLACEMENT_CONTEXTS = [
  { value: 'business_card', label: 'Tarjetas de Presentación', size: 150 },
  { value: 'flyer', label: 'Volantes', size: 200 },
  { value: 'poster', label: 'Pósters', size: 300 },
  { value: 'banner', label: 'Banners', size: 400 },
  { value: 'trade_show', label: 'Ferias Comerciales', size: 250 },
  { value: 'church_bulletin', label: 'Boletines de Iglesia', size: 180 },
  { value: 'conference_materials', label: 'Materiales de Conferencia', size: 220 },
  { value: 'digital_display', label: 'Pantallas Digitales', size: 500 }
]

export function PlatformQRGenerator({ 
  formId, 
  formName = 'Formulario de Plataforma', 
  formSlug, 
  isOpen, 
  onClose,
  onQRGenerated 
}: PlatformQRGeneratorProps) {
  const [qrConfig, setQRConfig] = useState<QRConfig>({
    size: 300,
    margin: 4,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    logoSize: 20,
    borderStyle: 'square',
    errorCorrectionLevel: 'M'
  })

  const [trackingConfig, setTrackingConfig] = useState<TrackingConfig>({
    utmSource: 'qr_code',
    utmMedium: 'offline',
    utmCampaign: 'platform_marketing',
    utmTerm: '',
    utmContent: '',
    customParams: {}
  })

  const [qrCodeUrl, setQRCodeUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [placementContext, setPlacementContext] = useState<string>('')
  const [customUrl, setCustomUrl] = useState<string>('')
  const [useCustomUrl, setUseCustomUrl] = useState(false)
  const [qrTitle, setQRTitle] = useState<string>('')
  const [qrDescription, setQRDescription] = useState<string>('')

  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  // Generate QR code URL with tracking parameters
  const buildQRUrl = () => {
    if (useCustomUrl && customUrl) {
      return customUrl
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://khesedtek.com' 
      : 'http://localhost:3000'
    
    const formUrl = formSlug 
      ? `${baseUrl}/api/platform/forms/${formSlug}/submit`
      : `${baseUrl}/platform/forms`

    const params = new URLSearchParams()
    
    // UTM parameters
    if (trackingConfig.utmSource) params.set('utm_source', trackingConfig.utmSource)
    if (trackingConfig.utmMedium) params.set('utm_medium', trackingConfig.utmMedium)
    if (trackingConfig.utmCampaign) params.set('utm_campaign', trackingConfig.utmCampaign)
    if (trackingConfig.utmTerm) params.set('utm_term', trackingConfig.utmTerm)
    if (trackingConfig.utmContent) params.set('utm_content', trackingConfig.utmContent)
    
    // QR-specific tracking
    params.set('qr_id', `qr_${Date.now()}`)
    params.set('placement', placementContext || 'unknown')
    
    // Custom parameters
    if (trackingConfig.customParams) {
      Object.entries(trackingConfig.customParams).forEach(([key, value]) => {
        if (key && value) params.set(key, value)
      })
    }

    return `${formUrl}?${params.toString()}`
  }

  // Apply campaign preset
  const applyPreset = (presetId: string) => {
    const preset = CAMPAIGN_PRESETS.find(p => p.id === presetId)
    if (!preset) return

    setTrackingConfig(prev => ({
      ...prev,
      utmSource: preset.utmSource,
      utmMedium: preset.utmMedium,
      utmCampaign: preset.utmCampaign
    }))

    setSelectedPreset(presetId)
    toast.success(`Preset "${preset.name}" aplicado`)
  }

  // Apply placement context
  const applyPlacementContext = (contextValue: string) => {
    const context = PLACEMENT_CONTEXTS.find(c => c.value === contextValue)
    if (!context) return

    setQRConfig(prev => ({
      ...prev,
      size: context.size
    }))

    setTrackingConfig(prev => ({
      ...prev,
      utmContent: context.label.toLowerCase().replace(/\s+/g, '_')
    }))

    setPlacementContext(contextValue)
  }

  // Generate QR code
  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      const qrUrl = buildQRUrl()
      const canvas = document.createElement('canvas')
      
      await QRCode.toCanvas(canvas, qrUrl, {
        width: qrConfig.size,
        margin: qrConfig.margin,
        color: {
          dark: qrConfig.foregroundColor,
          light: qrConfig.backgroundColor
        },
        errorCorrectionLevel: qrConfig.errorCorrectionLevel
      })

      // Add logo if provided (Khesed-tek branding)
      if (qrConfig.logo) {
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = qrConfig.logo
        
        await new Promise((resolve) => {
          img.onload = resolve
        })

        const logoSizePixels = canvas.width * (qrConfig.logoSize / 100)
        const x = (canvas.width - logoSizePixels) / 2
        const y = (canvas.height - logoSizePixels) / 2

        // Create circular mask for logo
        ctx?.save()
        ctx?.beginPath()
        ctx?.arc(x + logoSizePixels/2, y + logoSizePixels/2, logoSizePixels/2, 0, 2 * Math.PI)
        ctx?.clip()
        ctx?.drawImage(img, x, y, logoSizePixels, logoSizePixels)
        ctx?.restore()
      }

      setQRCodeUrl(canvas.toDataURL())
      qrCanvasRef.current = canvas

      // Save QR code generation analytics
      if (formId) {
        await saveQRAnalytics({
          formId,
          qrConfig,
          trackingConfig,
          placementContext,
          qrUrl
        })
      }

      toast.success('Código QR generado exitosamente')
      
      // Call callback if provided
      if (onQRGenerated) {
        onQRGenerated()
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Error al generar código QR')
    } finally {
      setIsGenerating(false)
    }
  }

  // Save QR analytics
  const saveQRAnalytics = async (data: any) => {
    try {
      await fetch('/api/platform/qr-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          generatedAt: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to save QR analytics:', error)
    }
  }

  // Download functions
  const downloadQRCode = () => {
    if (!qrCanvasRef.current) return
    
    qrCanvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `qr-${(qrTitle || formName).toLowerCase().replace(/\s+/g, '-')}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Código QR descargado')
      }
    })
  }

  const copyQRUrl = () => {
    const url = buildQRUrl()
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URL del QR copiada al portapapeles')
    }).catch(() => {
      toast.error('Error al copiar URL')
    })
  }

  const shareQRCode = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: qrTitle || `QR Code - ${formName}`,
          text: qrDescription || `Código QR para ${formName}`,
          url: buildQRUrl()
        })
      } catch (error) {
        // Fallback to copy URL
        copyQRUrl()
      }
    } else {
      copyQRUrl()
    }
  }

  return (
    <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Generador de Códigos QR - {formName}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="design">Diseño</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="advanced">Avanzado</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título del QR</Label>
                    <Input
                      value={qrTitle}
                      onChange={(e) => setQRTitle(e.target.value)}
                      placeholder={`QR - ${formName}`}
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={qrDescription}
                      onChange={(e) => setQRDescription(e.target.value)}
                      placeholder="Breve descripción del propósito del QR"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contexto de Uso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>¿Dónde se colocará el QR?</Label>
                    <Select value={placementContext} onValueChange={applyPlacementContext}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el contexto" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLACEMENT_CONTEXTS.map(context => (
                          <SelectItem key={context.value} value={context.value}>
                            {context.label} (recomendado: {context.size}px)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Presets de Campaña</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {CAMPAIGN_PRESETS.map(preset => {
                        const Icon = preset.icon
                        return (
                          <Button
                            key={preset.id}
                            variant={selectedPreset === preset.id ? "default" : "outline"}
                            className="h-auto p-3 justify-start"
                            onClick={() => applyPreset(preset.id)}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            <span className="text-xs">{preset.name}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Apariencia del QR</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tamaño (px)</Label>
                      <Input
                        type="number"
                        min="100"
                        max="1000"
                        value={qrConfig.size}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, size: parseInt(e.target.value) || 300 }))}
                      />
                    </div>
                    <div>
                      <Label>Margen</Label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={qrConfig.margin}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, margin: parseInt(e.target.value) || 4 }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Color Primer Plano</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={qrConfig.foregroundColor}
                          onChange={(e) => setQRConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={qrConfig.foregroundColor}
                          onChange={(e) => setQRConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Color de Fondo</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={qrConfig.backgroundColor}
                          onChange={(e) => setQRConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={qrConfig.backgroundColor}
                          onChange={(e) => setQRConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>URL del Logo (Opcional)</Label>
                    <Input
                      value={qrConfig.logo || ''}
                      onChange={(e) => setQRConfig(prev => ({ ...prev, logo: e.target.value }))}
                      placeholder="https://ejemplo.com/logo.png"
                    />
                  </div>

                  <div>
                    <Label>Tamaño del Logo (%)</Label>
                    <Input
                      type="range"
                      min="10"
                      max="30"
                      value={qrConfig.logoSize}
                      onChange={(e) => setQRConfig(prev => ({ ...prev, logoSize: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground">{qrConfig.logoSize}%</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Parámetros UTM</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>UTM Source</Label>
                      <Input
                        value={trackingConfig.utmSource}
                        onChange={(e) => setTrackingConfig(prev => ({ ...prev, utmSource: e.target.value }))}
                        placeholder="qr_code"
                      />
                    </div>
                    <div>
                      <Label>UTM Medium</Label>
                      <Input
                        value={trackingConfig.utmMedium}
                        onChange={(e) => setTrackingConfig(prev => ({ ...prev, utmMedium: e.target.value }))}
                        placeholder="offline"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>UTM Campaign</Label>
                    <Input
                      value={trackingConfig.utmCampaign}
                      onChange={(e) => setTrackingConfig(prev => ({ ...prev, utmCampaign: e.target.value }))}
                      placeholder="platform_marketing"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>UTM Term</Label>
                      <Input
                        value={trackingConfig.utmTerm || ''}
                        onChange={(e) => setTrackingConfig(prev => ({ ...prev, utmTerm: e.target.value }))}
                        placeholder="optional"
                      />
                    </div>
                    <div>
                      <Label>UTM Content</Label>
                      <Input
                        value={trackingConfig.utmContent || ''}
                        onChange={(e) => setTrackingConfig(prev => ({ ...prev, utmContent: e.target.value }))}
                        placeholder="optional"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Configuración Avanzada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nivel de Corrección de Errores</Label>
                    <Select 
                      value={qrConfig.errorCorrectionLevel}
                      onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => 
                        setQRConfig(prev => ({ ...prev, errorCorrectionLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Bajo (~7%)</SelectItem>
                        <SelectItem value="M">Medio (~15%)</SelectItem>
                        <SelectItem value="Q">Alto (~25%)</SelectItem>
                        <SelectItem value="H">Muy Alto (~30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={useCustomUrl}
                      onCheckedChange={setUseCustomUrl}
                    />
                    <Label>Usar URL personalizada</Label>
                  </div>

                  {useCustomUrl && (
                    <div>
                      <Label>URL Personalizada</Label>
                      <Input
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://ejemplo.com/mi-url"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button onClick={generateQRCode} disabled={isGenerating} className="flex-1">
              {isGenerating ? 'Generando...' : 'Generar QR Code'}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrCodeUrl ? (
                <div className="text-center">
                  <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
                    <img src={qrCodeUrl} alt="Generated QR Code" className="mx-auto" />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-medium">
                      {qrTitle || `QR Code - ${formName}`}
                    </div>
                    {qrDescription && (
                      <div className="text-xs text-muted-foreground">
                        {qrDescription}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={downloadQRCode}>
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyQRUrl}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar URL
                    </Button>
                    <Button size="sm" variant="outline" onClick={shareQRCode}>
                      <Share2 className="h-4 w-4 mr-1" />
                      Compartir
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Haz clic en "Generar QR Code" para ver la vista previa</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* URL Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Link className="h-4 w-4" />
                URL del QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-mono bg-muted p-3 rounded break-all">
                {buildQRUrl()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}