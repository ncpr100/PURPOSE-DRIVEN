'use client'

import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-hot-toast'
import { QrCode, Download, Copy, Palette, Settings } from 'lucide-react'
import QRCode from 'qrcode'

interface QRConfig {
  foregroundColor: string
  backgroundColor: string
  logo: string | null
  size: number
  margin: number
}

interface PlatformQRGeneratorProps {
  formId?: string
}

export default function PlatformQRGenerator({ formId }: PlatformQRGeneratorProps) {
  const [qrCodeUrl, setQRCodeUrl] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null)
  
  // QR Customization Configuration
  const [qrConfig, setQRConfig] = useState<QRConfig>({
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    logo: null,
    size: 512,
    margin: 2
  })

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setQRConfig(prev => ({ ...prev, logo: result }))
      toast.success('Logo cargado')
    }
    reader.readAsDataURL(file)
  }

  // Generate QR code using canvas-based pattern (matches form-builder)
  const generateQRCode = async (urlToEncode?: string) => {
    setIsGenerating(true)
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const formUrl = urlToEncode || (formId ? `${baseUrl}/api/platform/forms/${formId}/submit` : customUrl)
      
      if (!formUrl) {
        toast.error('Proporciona una URL o selecciona un formulario')
        setIsGenerating(false)
        return
      }

      // Create canvas element (MATCHES existing pattern)
      const canvas = document.createElement('canvas')
      
      // Generate QR using toCanvas method with custom configuration
      await QRCode.toCanvas(canvas, formUrl, {
        width: qrConfig.size,
        margin: qrConfig.margin,
        color: {
          dark: qrConfig.foregroundColor,
          light: qrConfig.backgroundColor
        }
      })

      // Add logo overlay if provided (matches branded-form-builder pattern)
      if (qrConfig.logo) {
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = qrConfig.logo
        
        await new Promise((resolve) => {
          img.onload = resolve
        })
        
        // Calculate logo size (20% of QR code)
        const logoSize = canvas.width * 0.2
        const x = (canvas.width - logoSize) / 2
        const y = (canvas.height - logoSize) / 2
        
        // Draw circular mask for logo
        ctx?.save()
        ctx?.beginPath()
        ctx?.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, 2 * Math.PI)
        ctx?.clip()
        ctx?.drawImage(img, x, y, logoSize, logoSize)
        ctx?.restore()
      }

      // Convert canvas to data URL for display
      setQRCodeUrl(canvas.toDataURL())
      qrCanvasRef.current = canvas
      toast.success('Código QR generado exitosamente')
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Error al generar código QR')
    } finally {
      setIsGenerating(false)
    }
  }

  // Download QR code as PNG
  const downloadQRCode = () => {
    if (!qrCanvasRef.current) {
      toast.error('Genera un código QR primero')
      return
    }
    
    const link = document.createElement('a')
    link.download = `qr-platform-form-${formId || Date.now()}.png`
    link.href = qrCanvasRef.current.toDataURL()
    link.click()
    toast.success('Código QR descargado')
  }

  // Copy QR code URL to clipboard
  const copyToClipboard = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const url = customUrl || (formId ? `${baseUrl}/api/platform/forms/${formId}/submit` : '')
    
    if (!url) {
      toast.error('No hay URL para copiar')
      return
    }
    
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url)
      toast.success('URL copiada al portapapeles')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT PANEL - QR Configuration & Customization */}
      <div className="space-y-6">
        
        {/* URL Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Configuración de URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formId ? (
              <div className="space-y-2">
                <Label>URL del Formulario</Label>
                <Input
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/platform/forms/${formId}/submit`}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  Esta es la URL predeterminada del formulario
                </p>
              </div>
            ) : null}
            
            <div className="space-y-2">
              <Label htmlFor="custom-url">URL Personalizada (Opcional)</Label>
              <Input
                id="custom-url"
                type="url"
                placeholder="https://ejemplo.com/mi-landing-page"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Personaliza la URL de destino del código QR
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Personalización del Código QR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Color Principal</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={qrConfig.foregroundColor}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                    className="w-12 h-10"
                  />
                  <Input
                    value={qrConfig.foregroundColor}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color de Fondo</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={qrConfig.backgroundColor}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-12 h-10"
                  />
                  <Input
                    value={qrConfig.backgroundColor}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Logo Central (Opcional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
              {qrConfig.logo && (
                <div className="flex items-center gap-2">
                  <img src={qrConfig.logo} alt="Logo preview" className="h-12 w-12 rounded object-cover" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQRConfig(prev => ({ ...prev, logo: null }))}
                  >
                    Eliminar Logo
                  </Button>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Agrega un logo en el centro del QR (recomendado: imagen cuadrada)
              </p>
            </div>

            <Separator />

            {/* Size and Margin */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tamaño del QR</Label>
                <Select 
                  value={qrConfig.size.toString()} 
                  onValueChange={(value) => setQRConfig(prev => ({ ...prev, size: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256">Pequeño (256px)</SelectItem>
                    <SelectItem value="512">Mediano (512px)</SelectItem>
                    <SelectItem value="1024">Grande (1024px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Margen</Label>
                <Select 
                  value={qrConfig.margin.toString()} 
                  onValueChange={(value) => setQRConfig(prev => ({ ...prev, margin: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Mínimo (1)</SelectItem>
                    <SelectItem value="2">Normal (2)</SelectItem>
                    <SelectItem value="4">Amplio (4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={() => generateQRCode()} 
              disabled={isGenerating || (!formId && !customUrl.trim())}
              className="w-full"
              size="lg"
            >
              <QrCode className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generando...' : 'Generar Código QR'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT PANEL - QR Preview & Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-purple-600" />
              Vista Previa del Código QR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {qrCodeUrl ? (
              <>
                {/* QR Code Display */}
                <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
                  <img 
                    src={qrCodeUrl} 
                    alt="Código QR generado" 
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxWidth: '400px' }}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Escanea este código para acceder al formulario
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={downloadQRCode} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button onClick={copyToClipboard} variant="outline" className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar URL
                  </Button>
                </div>

                {/* QR Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm text-blue-900">Información del QR</h4>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p><strong>Tamaño:</strong> {qrConfig.size}px</p>
                    <p><strong>Color:</strong> {qrConfig.foregroundColor}</p>
                    <p><strong>Logo:</strong> {qrConfig.logo ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                <QrCode className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-sm">
                  Personaliza tu código QR en el panel izquierdo<br/>
                  y haz clic en "Generar Código QR"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
