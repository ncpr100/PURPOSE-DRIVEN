'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-hot-toast'
import { QrCode, Download, Copy, Palette, Settings, WandSparkles, Image, Layers, Shapes } from 'lucide-react'

type DotStyle = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
type CornerSquareStyle = 'square' | 'extra-rounded' | 'dot'
type CornerDotStyle = 'square' | 'dot'
type GradientType = 'linear' | 'radial'
type LogoBgShape = 'none' | 'circle' | 'rounded' | 'square'

interface QRConfig {
  size: number
  margin: number
  backgroundColor: string
  foregroundColor: string
  dotStyle: DotStyle
  cornerSquareStyle: CornerSquareStyle
  cornerDotStyle: CornerDotStyle
  cornerSquareColor: string
  cornerDotColor: string
  useGradient: boolean
  gradientType: GradientType
  gradientColor1: string
  gradientColor2: string
  gradientAngle: number
  logoImage: string | null
  logoSize: number
  logoMargin: number
  hideLogoDots: boolean
  logoBackgroundColor: string
  logoBackgroundShape: LogoBgShape
  logoBorderWidth: number
}

const DEFAULT_CONFIG: QRConfig = {
  size: 512,
  margin: 2,
  backgroundColor: '#FFFFFF',
  foregroundColor: '#000000',
  dotStyle: 'square',
  cornerSquareStyle: 'square',
  cornerDotStyle: 'square',
  cornerSquareColor: '#000000',
  cornerDotColor: '#000000',
  useGradient: false,
  gradientType: 'linear',
  gradientColor1: '#000000',
  gradientColor2: '#000000',
  gradientAngle: 0,
  logoImage: null,
  logoSize: 0.28,
  logoMargin: 8,
  hideLogoDots: true,
  logoBackgroundColor: '#FFFFFF',
  logoBackgroundShape: 'rounded',
  logoBorderWidth: 22,
}

const PRESET_THEMES: { name: string; color: string; bg: string; config: QRConfig }[] = [
  {
    name: 'Clásico',
    color: '#374151',
    bg: '#F3F4F6',
    config: { ...DEFAULT_CONFIG }
  },
  {
    name: 'Azul Profundo',
    color: '#1d4ed8',
    bg: '#EFF6FF',
    config: {
      ...DEFAULT_CONFIG,
      useGradient: true,
      gradientType: 'linear',
      gradientColor1: '#1d4ed8',
      gradientColor2: '#7c3aed',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerSquareColor: '#1d4ed8',
      cornerDotColor: '#7c3aed',
    }
  },
  {
    name: 'Oro Iglesia',
    color: '#d97706',
    bg: '#FFFBEB',
    config: {
      ...DEFAULT_CONFIG,
      useGradient: true,
      gradientType: 'linear',
      gradientColor1: '#d97706',
      gradientColor2: '#b45309',
      dotStyle: 'classy',
      cornerSquareStyle: 'dot',
      cornerSquareColor: '#d97706',
      cornerDotColor: '#b45309',
    }
  },
  {
    name: 'Gracia Morada',
    color: '#7c3aed',
    bg: '#F5F3FF',
    config: {
      ...DEFAULT_CONFIG,
      useGradient: true,
      gradientType: 'radial',
      gradientColor1: '#7c3aed',
      gradientColor2: '#db2777',
      dotStyle: 'classy-rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerSquareColor: '#7c3aed',
      cornerDotColor: '#db2777',
    }
  },
  {
    name: 'Bosque verde',
    color: '#059669',
    bg: '#ECFDF5',
    config: {
      ...DEFAULT_CONFIG,
      useGradient: true,
      gradientType: 'linear',
      gradientColor1: '#059669',
      gradientColor2: '#0284c7',
      dotStyle: 'extra-rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerSquareColor: '#059669',
      cornerDotColor: '#0284c7',
    }
  },
  {
    name: 'Atardecer',
    color: '#f59e0b',
    bg: '#FFF7ED',
    config: {
      ...DEFAULT_CONFIG,
      useGradient: true,
      gradientType: 'linear',
      gradientColor1: '#f59e0b',
      gradientColor2: '#ef4444',
      dotStyle: 'rounded',
      cornerSquareStyle: 'dot',
      cornerSquareColor: '#f59e0b',
      cornerDotColor: '#ef4444',
    }
  },
]

interface PlatformQRGeneratorProps {
  formSlug?: string
}

export default function PlatformQRGenerator({ formSlug }: PlatformQRGeneratorProps) {
  const [qrBlobUrl, setQRBlobUrl] = useState('')
  const [qrBlob, setQRBlob] = useState<Blob | null>(null)
  const [customUrl, setCustomUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrConfig, setQRConfig] = useState<QRConfig>(DEFAULT_CONFIG)
  const prevBlobUrl = useRef<string>('')

  const updateConfig = useCallback((updates: Partial<QRConfig>) => {
    setQRConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
    setQRConfig(preset.config)
    toast.success(`Tema "${preset.name}" aplicado`)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('El logo debe ser menor a 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      updateConfig({ logoImage: event.target?.result as string })
      toast.success('Logo cargado')
    }
    reader.readAsDataURL(file)
  }

  const applyLogoBackground = (originalBlob: Blob, logoSrc: string, config: QRConfig): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(originalBlob); return }

      const qrImg = new window.Image()
      qrImg.onload = () => {
        canvas.width = qrImg.width
        canvas.height = qrImg.height
        ctx.drawImage(qrImg, 0, 0)

        const cx = canvas.width / 2
        const cy = canvas.height / 2
        // bgRadius includes the logo area + generous padding for enterprise look
        const logoSize = canvas.width * config.logoSize
        const bgRadius = logoSize / 2 + config.logoBorderWidth

        // Step 1: Erase QR dots in center by drawing the background color first
        // This creates the clean "open center" enterprise look
        ctx.fillStyle = config.backgroundColor || '#FFFFFF'
        ctx.beginPath()
        ctx.arc(cx, cy, bgRadius + 4, 0, Math.PI * 2)
        ctx.fill()

        // Step 2: Draw the styled badge shape on top
        ctx.shadowColor = 'rgba(0,0,0,0.12)'
        ctx.shadowBlur = 8
        ctx.fillStyle = config.logoBackgroundColor
        ctx.beginPath()
        if (config.logoBackgroundShape === 'circle') {
          ctx.arc(cx, cy, bgRadius, 0, Math.PI * 2)
        } else if (config.logoBackgroundShape === 'rounded') {
          const r = bgRadius * 0.28
          const x = cx - bgRadius
          const y = cy - bgRadius
          const w = bgRadius * 2
          const h = bgRadius * 2
          ctx.moveTo(x + r, y)
          ctx.lineTo(x + w - r, y)
          ctx.quadraticCurveTo(x + w, y, x + w, y + r)
          ctx.lineTo(x + w, y + h - r)
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
          ctx.lineTo(x + r, y + h)
          ctx.quadraticCurveTo(x, y + h, x, y + h - r)
          ctx.lineTo(x, y + r)
          ctx.quadraticCurveTo(x, y, x + r, y)
        } else {
          ctx.rect(cx - bgRadius, cy - bgRadius, bgRadius * 2, bgRadius * 2)
        }
        ctx.fill()
        ctx.shadowBlur = 0

        // Step 3: Draw the logo centered on the clean badge
        const logoImg = new window.Image()
        logoImg.onerror = () => resolve(originalBlob)
        logoImg.onload = () => {
          ctx.drawImage(logoImg, cx - logoSize / 2, cy - logoSize / 2, logoSize, logoSize)
          canvas.toBlob((blob) => resolve(blob ?? originalBlob), 'image/png')
        }
        logoImg.src = logoSrc
      }
      qrImg.onerror = () => resolve(originalBlob)
      qrImg.src = URL.createObjectURL(originalBlob)
    })
  }

  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const targetUrl = customUrl.trim() || (formSlug ? `${baseUrl}/p/${formSlug}` : '')
      if (!targetUrl) {
        toast.error('Proporciona una URL o selecciona un formulario')
        setIsGenerating(false)
        return
      }

      // Dynamic import to avoid SSR issues with browser-only library
      const { default: QRCodeStyling } = await import('qr-code-styling')

      const dotsGradient = qrConfig.useGradient ? {
        type: qrConfig.gradientType as 'linear' | 'radial',
        rotation: qrConfig.gradientAngle * (Math.PI / 180),
        colorStops: [
          { offset: 0, color: qrConfig.gradientColor1 },
          { offset: 1, color: qrConfig.gradientColor2 }
        ]
      } : undefined

      const qrInstance = new QRCodeStyling({
        width: qrConfig.size,
        height: qrConfig.size,
        margin: qrConfig.margin,
        data: targetUrl,
        // No logo in library — canvas compositing handles logo + badge professionally
        qrOptions: { errorCorrectionLevel: 'H' },
        imageOptions: {
          hideBackgroundDots: false,
          imageSize: 0,
          margin: 0,
          saveAsBlob: true,
        },
        dotsOptions: {
          type: qrConfig.dotStyle as any,
          color: qrConfig.useGradient ? undefined : qrConfig.foregroundColor,
          gradient: dotsGradient,
        },
        cornersSquareOptions: {
          type: qrConfig.cornerSquareStyle as any,
          color: qrConfig.cornerSquareColor,
        },
        cornersDotOptions: {
          type: qrConfig.cornerDotStyle as any,
          color: qrConfig.cornerDotColor,
        },
        backgroundOptions: {
          color: qrConfig.backgroundColor,
        },
      })

      let blob = await qrInstance.getRawData('png')
      if (!blob) throw new Error('No se pudo generar el QR')

      // Apply enterprise logo — canvas compositing always handles logo placement
      if (qrConfig.logoImage) {
        blob = await applyLogoBackground(blob as Blob, qrConfig.logoImage, qrConfig)
      }

      if (prevBlobUrl.current) URL.revokeObjectURL(prevBlobUrl.current)
      const blobUrl = URL.createObjectURL(blob as Blob)
      prevBlobUrl.current = blobUrl
      setQRBlobUrl(blobUrl)
      setQRBlob(blob as Blob)
      toast.success('Código QR generado exitosamente')
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Error al generar código QR')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrBlob) { toast.error('Genera un código QR primero'); return }
    const link = document.createElement('a')
    link.download = `qr-platform-${formSlug || 'form'}-${Date.now()}.png`
    link.href = URL.createObjectURL(qrBlob)
    link.click()
    toast.success('Código QR descargado')
  }

  const copyToClipboard = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const url = customUrl.trim() || (formSlug ? `${baseUrl}/p/${formSlug}` : '')
    if (!url) { toast.error('No hay URL para copiar'); return }
    navigator.clipboard.writeText(url)
    toast.success('URL copiada al portapapeles')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ─── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="space-y-5">

        {/* URL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-[hsl(var(--info))]" />
              Configuración de URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formSlug && (
              <div className="space-y-1">
                <Label>URL del Formulario (QR apunta aquí)</Label>
                <Input
                  value={typeof window !== 'undefined' ? `${window.location.origin}/p/${formSlug}` : ''}
                  readOnly className="bg-muted/30 text-sm font-mono"
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="custom-url">URL Alternativa</Label>
              <Input id="custom-url" type="url"
                placeholder="https://ejemplo.com/tu-pagina"
                value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Preset Themes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WandSparkles className="h-5 w-5 text-[hsl(var(--lavender))]" />
              Temas Predefinidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_THEMES.map((preset) => (
                <button key={preset.name} onClick={() => applyPreset(preset)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 border-border hover:border-[hsl(var(--lavender)/0.30)] hover:shadow-sm transition-all group"
                >
                  <div className="w-8 h-8 rounded-md border border-border"
                    style={{ background: preset.config.useGradient
                      ? `linear-gradient(135deg, ${preset.config.gradientColor1}, ${preset.config.gradientColor2})`
                      : preset.config.foregroundColor }} />
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-[hsl(var(--lavender))] text-center leading-tight">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Base Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-[hsl(var(--lavender))]" />
              Colores Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>QR Principal</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={qrConfig.foregroundColor}
                    onChange={(e) => updateConfig({ foregroundColor: e.target.value })}
                    className="w-10 h-9 rounded border cursor-pointer flex-shrink-0" />
                  <Input value={qrConfig.foregroundColor}
                    onChange={(e) => updateConfig({ foregroundColor: e.target.value })}
                    className="font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Fondo</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={qrConfig.backgroundColor}
                    onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                    className="w-10 h-9 rounded border cursor-pointer flex-shrink-0" />
                  <Input value={qrConfig.backgroundColor}
                    onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                    className="font-mono text-sm" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dots & Corners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shapes className="h-5 w-5 text-primary" />
              Estilo de Puntos y Esquinas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Tipo de Puntos del QR</Label>
              <Select value={qrConfig.dotStyle}
                onValueChange={(v) => updateConfig({ dotStyle: v as DotStyle })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Clásico (cuadrado)</SelectItem>
                  <SelectItem value="rounded">Moderno (redondeado)</SelectItem>
                  <SelectItem value="dots">Puntos (círculos)</SelectItem>
                  <SelectItem value="extra-rounded">Muy Redondeado</SelectItem>
                  <SelectItem value="classy">Elegante</SelectItem>
                  <SelectItem value="classy-rounded">Elegante Redondeado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Estilo Marco Esquinas</Label>
                <Select value={qrConfig.cornerSquareStyle}
                  onValueChange={(v) => updateConfig({ cornerSquareStyle: v as CornerSquareStyle })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Cuadrado</SelectItem>
                    <SelectItem value="extra-rounded">Redondeado</SelectItem>
                    <SelectItem value="dot">Circular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Centro de Esquinas</Label>
                <Select value={qrConfig.cornerDotStyle}
                  onValueChange={(v) => updateConfig({ cornerDotStyle: v as CornerDotStyle })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Cuadrado</SelectItem>
                    <SelectItem value="dot">Punto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Color Marco Esquinas</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={qrConfig.cornerSquareColor}
                    onChange={(e) => updateConfig({ cornerSquareColor: e.target.value })}
                    className="w-10 h-9 rounded border cursor-pointer flex-shrink-0" />
                  <Input value={qrConfig.cornerSquareColor}
                    onChange={(e) => updateConfig({ cornerSquareColor: e.target.value })}
                    className="font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Color Centro Esquinas</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={qrConfig.cornerDotColor}
                    onChange={(e) => updateConfig({ cornerDotColor: e.target.value })}
                    className="w-10 h-9 rounded border cursor-pointer flex-shrink-0" />
                  <Input value={qrConfig.cornerDotColor}
                    onChange={(e) => updateConfig({ cornerDotColor: e.target.value })}
                    className="font-mono text-sm" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gradient */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[hsl(var(--info))]" />
              Gradiente en Puntos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Activar Gradiente</Label>
                <p className="text-xs text-muted-foreground/70">Dos colores en los puntos del QR</p>
              </div>
              <Switch checked={qrConfig.useGradient}
                onCheckedChange={(v) => updateConfig({ useGradient: v })} />
            </div>
            {qrConfig.useGradient && (
              <>
                <div className="space-y-1.5">
                  <Label>Tipo de Gradiente</Label>
                  <Select value={qrConfig.gradientType}
                    onValueChange={(v) => updateConfig({ gradientType: v as GradientType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Lineal</SelectItem>
                      <SelectItem value="radial">Radial (Centro a borde)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Color Inicial</Label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={qrConfig.gradientColor1}
                        onChange={(e) => updateConfig({ gradientColor1: e.target.value })}
                        className="w-10 h-9 rounded border cursor-pointer flex-shrink-0" />
                      <Input value={qrConfig.gradientColor1}
                        onChange={(e) => updateConfig({ gradientColor1: e.target.value })}
                        className="font-mono text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Color Final</Label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={qrConfig.gradientColor2}
                        onChange={(e) => updateConfig({ gradientColor2: e.target.value })}
                        className="w-10 h-9 rounded border cursor-pointer flex-shrink-0" />
                      <Input value={qrConfig.gradientColor2}
                        onChange={(e) => updateConfig({ gradientColor2: e.target.value })}
                        className="font-mono text-sm" />
                    </div>
                  </div>
                </div>
                {qrConfig.gradientType === 'linear' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Ángulo del Gradiente</Label>
                      <span className="text-sm font-medium text-muted-foreground">{qrConfig.gradientAngle}°</span>
                    </div>
                    <Slider value={[qrConfig.gradientAngle]}
                      onValueChange={([v]) => updateConfig({ gradientAngle: v })}
                      min={0} max={360} step={5} />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-[hsl(var(--info))]" />
              Logo Central
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subir Logo de la Iglesia</Label>
              <Input type="file" accept="image/*" onChange={handleLogoUpload} />
              <p className="text-xs text-muted-foreground">PNG con fondo transparente · Máx. 2MB</p>
            </div>
            {qrConfig.logoImage && (
              <>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                  <img src={qrConfig.logoImage} alt="Vista previa del logo"
                    className="h-14 w-14 rounded-lg object-contain bg-white border shadow-sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Logo cargado</p>
                    <p className="text-xs text-muted-foreground">Se mostrará en el centro del QR</p>
                  </div>
                  <Button variant="ghost" size="sm"
                    onClick={() => updateConfig({ logoImage: null })}
                    className="text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.10)]">
                    Quitar
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Tamaño del Logo</Label>
                      <span className="text-sm font-medium text-muted-foreground">{Math.round(qrConfig.logoSize * 100)}%</span>
                    </div>
                    <Slider value={[qrConfig.logoSize * 100]}
                      onValueChange={([v]) => updateConfig({ logoSize: v / 100 })}
                      min={15} max={40} step={1} />
                    <p className="text-xs text-muted-foreground/70">Recomendado: 25-30% para mejor escaneabilidad</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Margen alrededor del Logo</Label>
                      <span className="text-sm font-medium text-muted-foreground">{qrConfig.logoMargin}px</span>
                    </div>
                    <Slider value={[qrConfig.logoMargin]}
                      onValueChange={([v]) => updateConfig({ logoMargin: v })}
                      min={0} max={20} step={1} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Label className="text-sm">Ocultar puntos detrás del logo</Label>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">Crea espacio limpio alrededor del logo</p>
                    </div>
                    <Switch checked={qrConfig.hideLogoDots}
                      onCheckedChange={(v) => updateConfig({ hideLogoDots: v })} />
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground">Fondo del Logo (Empresarial)</Label>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Forma del Fondo</Label>
                      <Select value={qrConfig.logoBackgroundShape}
                        onValueChange={(v) => updateConfig({ logoBackgroundShape: v as LogoBgShape })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin fondo</SelectItem>
                          <SelectItem value="rounded">Redondeado (recomendado)</SelectItem>
                          <SelectItem value="circle">Círculo</SelectItem>
                          <SelectItem value="square">Cuadrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {qrConfig.logoBackgroundShape !== 'none' && (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Color del Fondo</Label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={qrConfig.logoBackgroundColor}
                              onChange={(e) => updateConfig({ logoBackgroundColor: e.target.value })}
                              className="w-10 h-9 rounded border cursor-pointer flex-shrink-0" />
                            <Input value={qrConfig.logoBackgroundColor}
                              onChange={(e) => updateConfig({ logoBackgroundColor: e.target.value })}
                              className="font-mono text-sm" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs text-muted-foreground">Borde alrededor del Logo</Label>
                            <span className="text-sm font-medium text-muted-foreground">{qrConfig.logoBorderWidth}px</span>
                          </div>
                          <Slider value={[qrConfig.logoBorderWidth]}
                            onValueChange={([v]) => updateConfig({ logoBorderWidth: v })}
                            min={0} max={20} step={1} />
                          <p className="text-xs text-muted-foreground/70">Mayor borde = fondo más visible y limpio</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Size */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-muted-foreground" />
              Tamaño y Margen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Resolución del QR</Label>
                <Select value={qrConfig.size.toString()}
                  onValueChange={(v) => updateConfig({ size: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256">Pequeño (256px)</SelectItem>
                    <SelectItem value="512">Mediano (512px)</SelectItem>
                    <SelectItem value="1024">Grande – Imprimir (1024px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Margen Exterior</Label>
                <Select value={qrConfig.margin.toString()}
                  onValueChange={(v) => updateConfig({ margin: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Mínimo (1)</SelectItem>
                    <SelectItem value="2">Normal (2)</SelectItem>
                    <SelectItem value="4">Amplio (4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={generateQRCode}
          disabled={isGenerating || (!formSlug && !customUrl.trim())}
          className="w-full bg-[hsl(var(--lavender))] hover:bg-[hsl(var(--lavender))] text-white" size="lg">
          <QrCode className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generando QR...' : 'Generar Código QR Empresarial'}
        </Button>
      </div>

      {/* ─── RIGHT PANEL ────────────────────────────────────────── */}
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-[hsl(var(--lavender))]" />
              Vista Previa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qrBlobUrl ? (
              <>
                <div className="flex flex-col items-center space-y-3 p-6 bg-white rounded-xl border-2 border-[hsl(var(--lavender)/0.30)] shadow-sm">
                  <img src={qrBlobUrl} alt="Código QR generado"
                    className="max-w-full h-auto rounded-xl shadow-md"
                    style={{ maxWidth: '380px' }} />
                  <p className="text-xs text-muted-foreground/70 text-center">
                    {qrConfig.size}px · {qrConfig.dotStyle} · {qrConfig.useGradient ? 'Con gradiente' : 'Color sólido'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={downloadQRCode} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PNG
                  </Button>
                  <Button onClick={copyToClipboard} variant="outline" className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar URL
                  </Button>
                </div>
                <div className="bg-[hsl(var(--lavender)/0.08)] border border-[hsl(var(--lavender)/0.30)] rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-[hsl(var(--lavender))] mb-2">Configuración Aplicada</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[hsl(var(--lavender))]">
                    <p><strong>Resolución:</strong> {qrConfig.size}px</p>
                    <p><strong>Puntos:</strong> {qrConfig.dotStyle}</p>
                    <p><strong>Esquinas:</strong> {qrConfig.cornerSquareStyle}</p>
                    <p><strong>Gradiente:</strong> {qrConfig.useGradient ? `${qrConfig.gradientType}` : 'No'}</p>
                    <p><strong>Logo:</strong> {qrConfig.logoImage ? `${Math.round(qrConfig.logoSize * 100)}%` : 'Sin logo'}</p>
                    <p><strong>Corrección:</strong> Alta (H)</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground/70">
                <QrCode className="h-20 w-20 mb-4 opacity-20" />
                <p className="text-sm font-medium text-muted-foreground">Sin vista previa aún</p>
                <p className="text-xs mt-1 text-muted-foreground/70">
                  Elige un tema o personaliza las opciones<br />
                  y pulsa "Generar Código QR Empresarial"
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enterprise Tips */}
        <Card className="bg-[hsl(var(--warning)/0.10)] border-[hsl(var(--warning)/0.3)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-800 flex items-center gap-2">
              <WandSparkles className="h-4 w-4" />
              Consejos para QR Empresariales
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[hsl(var(--warning))] space-y-1.5">
            <p>• Usa <strong>PNG con fondo transparente</strong> para el logo de la iglesia</p>
            <p>• Tamaño de logo <strong>25-30%</strong> es la proporción ideal para escanear sin problema</p>
            <p>• Activa <strong>"Ocultar puntos detrás del logo"</strong> para un aspecto limpio y profesional</p>
            <p>• Los <strong>gradientes</strong> dan identidad visual única sin perder funcionalidad</p>
            <p>• Genera en <strong>1024px</strong> para impresión de alta calidad en banner o folleto</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
