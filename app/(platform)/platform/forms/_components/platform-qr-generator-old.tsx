'use client'

import { useState } from 'react'
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
  const [qrUrl, setQrUrl] = useState('')
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [customUrl, setCustomUrl] = useState('')
  const [generating, setGenerating] = useState(false)

  // Generate QR code for form
  const generateFormQR = async () => {
    if (!formId) {
      toast.error('No se ha seleccionado ningún formulario')
      return
    }

    try {
      setGenerating(true)
      const formUrl = `${window.location.origin}/api/platform/forms/${formId}/submit`
      
      const qrDataUrl = await QRCode.toDataURL(formUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      setQrImage(qrDataUrl)
      setQrUrl(formUrl)
      toast.success('Código QR generado')
    } catch (error) {
      console.error('Error generating QR:', error)
      toast.error('Error al generar código QR')
    } finally {
      setGenerating(false)
    }
  }

  // Generate QR for custom URL
  const generateCustomQR = async () => {
    if (!customUrl.trim()) {
      toast.error('Ingresa una URL')
      return
    }

    try {
      setGenerating(true)
      const qrDataUrl = await QRCode.toDataURL(customUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      setQrImage(qrDataUrl)
      setQrUrl(customUrl)
      toast.success('Código QR generado')
    } catch (error) {
      console.error('Error generating QR:', error)
      toast.error('Error al generar código QR')
    } finally {
      setGenerating(false)
    }
  }

  // Download QR code
  const downloadQR = () => {
    if (!qrImage) return

    const link = document.createElement('a')
    link.href = qrImage
    link.download = `qr-code-${Date.now()}.png`
    link.click()
    toast.success('QR descargado')
  }

  // Copy QR URL
  const copyQRUrl = () => {
    if (!qrUrl) return
    navigator.clipboard.writeText(qrUrl)
    toast.success('URL copiada')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Generador de Códigos QR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form QR Generator */}
        {formId && (
          <div className="space-y-3">
            <h3 className="font-semibold">Generar QR para Formulario</h3>
            <p className="text-sm text-gray-600">
              Crea un código QR que dirige al formulario de captura de leads
            </p>
            <Button 
              onClick={generateFormQR} 
              disabled={generating}
              className="w-full"
            >
              <QrCode className="h-4 w-4 mr-2" />
              {generating ? 'Generando...' : 'Generar QR de Formulario'}
            </Button>
          </div>
        )}

        {/* Custom URL QR Generator */}
        <div className="space-y-3">
          <h3 className="font-semibold">Generar QR Personalizado</h3>
          <div>
            <Label htmlFor="customUrl">URL Personalizada</Label>
            <Input
              id="customUrl"
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://khesedtek.com/promo"
            />
          </div>
          <Button 
            onClick={generateCustomQR} 
            disabled={generating || !customUrl.trim()}
            className="w-full"
            variant="outline"
          >
            <QrCode className="h-4 w-4 mr-2" />
            {generating ? 'Generando...' : 'Generar QR Personalizado'}
          </Button>
        </div>

        {/* QR Code Display */}
        {qrImage && (
          <div className="space-y-3 border-t pt-6">
            <div className="flex justify-center">
              <img src={qrImage} alt="QR Code" className="w-64 h-64 border rounded-lg" />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-600 mb-1">URL del QR:</p>
              <p className="text-sm font-mono break-all">{qrUrl}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadQR} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button onClick={copyQRUrl} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copiar URL
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
