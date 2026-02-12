'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Share, 
  Eye,
  Trash2,
  Plus,
  Settings,
  Palette
} from 'lucide-react'
import { toast } from 'sonner'
import QRCode from 'qrcode'

interface QRCodeData {
  id?: string
  name: string
  description?: string
  formId: string
  code: string
  design?: {
    size: number
    color: string
    backgroundColor: string
    logoUrl?: string
    logoSize: number
    margin: number
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  }
  url?: string
  scanCount?: number
  lastScan?: string
  form?: {
    id: string
    name: string
    slug: string
  }
}

interface QRCodeGeneratorProps {
  isOpen: boolean
  onClose: () => void
  formId: string
  formName: string
  onQRGenerated: () => void
}

export function QRCodeGenerator({ 
  isOpen, 
  onClose, 
  formId, 
  formName,
  onQRGenerated 
}: QRCodeGeneratorProps) {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [newQR, setNewQR] = useState({
    name: '',
    description: '',
    design: {
      size: 300,
      color: '#000000',
      backgroundColor: '#ffffff',
      logoSize: 20,
      margin: 10,
      errorCorrectionLevel: 'M' as 'L' | 'M' | 'Q' | 'H'
    }
  })
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      fetchQRCodes()
    }
  }, [isOpen, formId])

  const fetchQRCodes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/visitor-qr-codes?formId=${formId}`)
      if (response.ok) {
        const data = await response.json()
        setQrCodes(data)
      }
    } catch (error) {
      toast.error('Error al cargar códigos QR')
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async () => {
    if (!newQR.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    try {
      setGenerating(true)
      
      const response = await fetch('/api/visitor-qr-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newQR.name,
          description: newQR.description,
          formId,
          design: newQR.design
        })
      })

      if (response.ok) {
        const qrData = await response.json()
        
        // Generate QR code image
        const qrImageUrl = await QRCode.toDataURL(qrData.url, {
          width: newQR.design.size,
          color: {
            dark: newQR.design.color,
            light: newQR.design.backgroundColor
          },
          margin: newQR.design.margin,
          errorCorrectionLevel: newQR.design.errorCorrectionLevel
        })
        
        setQrDataUrl(qrImageUrl)
        await fetchQRCodes()
        onQRGenerated()
        
        // Reset form
        setNewQR({
          name: '',
          description: '',
          design: {
            size: 300,
            color: '#000000',
            backgroundColor: '#ffffff',
            logoSize: 20,
            margin: 10,
            errorCorrectionLevel: 'M'
          }
        })
        
        toast.success('Código QR generado exitosamente')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al generar código QR')
      }
    } catch (error) {
      toast.error('Error al generar código QR')
    } finally {
      setGenerating(false)
    }
  }

  const deleteQRCode = async (qrId: string) => {
    try {
      const response = await fetch(`/api/visitor-qr-codes?id=${qrId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchQRCodes()
        toast.success('Código QR eliminado')
      } else {
        toast.error('Error al eliminar código QR')
      }
    } catch (error) {
      toast.error('Error al eliminar código QR')
    }
  }

  const downloadQR = async (qrCode: QRCodeData) => {
    try {
      const qrImageUrl = await QRCode.toDataURL(qrCode.url || '', {
        width: 800,
        color: {
          dark: qrCode.design?.color || '#000000',
          light: qrCode.design?.backgroundColor || '#ffffff'
        },
        margin: qrCode.design?.margin || 10,
        errorCorrectionLevel: qrCode.design?.errorCorrectionLevel || 'M'
      })
      
      const link = document.createElement('a')
      link.download = `qr-${qrCode.name.replace(/[^a-z0-9]/gi, '-')}.png`
      link.href = qrImageUrl
      link.click()
      
      toast.success('QR descargado')
    } catch (error) {
      toast.error('Error al descargar QR')
    }
  }

  const copyQRUrl = (url: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url)
      toast.success('URL copiada al portapapeles')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Códigos QR para {formName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generar Nuevo QR
              </CardTitle>
              <CardDescription>
                Crea códigos QR únicos para diferentes ubicaciones o campañas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-name">Nombre del QR *</Label>
                <Input
                  id="qr-name"
                  value={newQR.name}
                  onChange={(e) => setNewQR(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ej. Entrada Principal, Lobby, etc."
                />
              </div>

              <div>
                <Label htmlFor="qr-description">Descripción</Label>
                <Textarea
                  id="qr-description"
                  value={newQR.description}
                  onChange={(e) => setNewQR(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ubicación o propósito del código QR"
                  rows={2}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Diseño del QR
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Tamaño</Label>
                    <Select
                      value={newQR.design.size.toString()}
                      onValueChange={(value) => setNewQR(prev => ({
                        ...prev,
                        design: { ...prev.design, size: parseInt(value) }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="200">200px</SelectItem>
                        <SelectItem value="300">300px</SelectItem>
                        <SelectItem value="400">400px</SelectItem>
                        <SelectItem value="500">500px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={newQR.design.color}
                      onChange={(e) => setNewQR(prev => ({
                        ...prev,
                        design: { ...prev.design, color: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <Label>Fondo</Label>
                    <Input
                      type="color"
                      value={newQR.design.backgroundColor}
                      onChange={(e) => setNewQR(prev => ({
                        ...prev,
                        design: { ...prev.design, backgroundColor: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <Label>Corrección de Error</Label>
                    <Select
                      value={newQR.design.errorCorrectionLevel}
                      onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setNewQR(prev => ({
                        ...prev,
                        design: { ...prev.design, errorCorrectionLevel: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Bajo (L)</SelectItem>
                        <SelectItem value="M">Medio (M)</SelectItem>
                        <SelectItem value="Q">Alto (Q)</SelectItem>
                        <SelectItem value="H">Máximo (H)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                onClick={generateQRCode}
                disabled={generating || !newQR.name.trim()}
                className="w-full"
              >
                {generating ? 'Generando...' : 'Generar Código QR'}
              </Button>

              {qrDataUrl && (
                <div className="border rounded-lg p-4 text-center">
                  <img src={qrDataUrl} alt="QR Code Preview" className="mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Vista previa del QR generado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Existing QR Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Códigos QR Existentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Cargando códigos QR...</p>
              ) : qrCodes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay códigos QR generados para este formulario
                </p>
              ) : (
                <div className="space-y-4">
                  {qrCodes.map((qr) => (
                    <div key={qr.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{qr.name}</h4>
                          {qr.description && (
                            <p className="text-sm text-muted-foreground">{qr.description}</p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {qr.scanCount || 0} escaneos
                        </Badge>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadQR(qr)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Descargar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyQRUrl(qr.url || '')}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copiar URL
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(qr.url, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteQRCode(qr.id!)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}