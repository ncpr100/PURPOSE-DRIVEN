'use client'

import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { QrCode, Download, Copy } from 'lucide-react'
import QRCode from 'qrcode'

interface PlatformQRGeneratorProps {
  formId?: string
}

export default function PlatformQRGenerator({ formId }: PlatformQRGeneratorProps) {
  const [qrCodeUrl, setQRCodeUrl] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null)

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
      
      // Generate QR using toCanvas method (NOT toDataURL)
      await QRCode.toCanvas(canvas, formUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

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
    
    navigator.clipboard.writeText(url)
    toast.success('URL copiada al portapapeles')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-purple-600" />
          Generador de Códigos QR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form QR Generator */}
        {formId && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Generar QR para Formulario</h3>
            <p className="text-sm text-gray-600">
              Crea un código QR que dirige al formulario de captura de leads
            </p>
            <Button 
              onClick={() => generateQRCode()} 
              disabled={isGenerating}
              className="w-full"
            >
              <QrCode className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generando...' : 'Generar QR del Formulario'}
            </Button>
          </div>
        )}

        {/* Custom URL Generator */}
        {!formId && (
          <div className="space-y-3">
            <Label htmlFor="custom-url">URL Personalizada</Label>
            <Input
              id="custom-url"
              type="url"
              placeholder="https://ejemplo.com/mi-pagina"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
            <Button 
              onClick={() => generateQRCode()} 
              disabled={isGenerating || !customUrl.trim()}
              className="w-full"
            >
              <QrCode className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generando...' : 'Generar QR Personalizado'}
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        {qrCodeUrl && (
          <div className="flex gap-2">
            <Button onClick={downloadQRCode} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
            <Button onClick={copyToClipboard} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copiar URL
            </Button>
          </div>
        )}

        {/* QR Code Display */}
        {qrCodeUrl && (
          <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg border-2 border-purple-200">
            <img 
              src={qrCodeUrl} 
              alt="Código QR generado" 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
            <p className="text-xs text-gray-500 text-center">
              Escanea este código para acceder al formulario
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
