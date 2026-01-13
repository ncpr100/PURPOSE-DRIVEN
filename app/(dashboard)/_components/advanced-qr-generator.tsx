'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Link as LinkIcon, 
  Star, 
  Phone, 
  MessageSquare, 
  Mail, 
  CreditCard, 
  MessageCircle,
  Layers,
  FileText,
  ClipboardCheck,
  Sparkles,
  User,
  IdCard,
  Briefcase,
  QrCode,
  Download,
  Save,
  Eye,
  Copy,
  Palette
} from 'lucide-react'
import { toast } from 'sonner'
import QRCodeStyling from 'qr-code-styling'

interface QRType {
  id: string
  name: string
  icon: any
  description: string
}

const QR_TYPES: QRType[] = [
  { id: 'website', name: 'Website', icon: LinkIcon, description: 'URL de sitio web' },
  { id: 'review', name: 'Review Link', icon: Star, description: 'Enlace de reseñas' },
  { id: 'call', name: 'Call', icon: Phone, description: 'Llamada telefónica' },
  { id: 'sms', name: 'SMS', icon: MessageSquare, description: 'Mensaje de texto' },
  { id: 'email', name: 'Email', icon: Mail, description: 'Correo electrónico' },
  { id: 'payment', name: 'Payment', icon: CreditCard, description: 'Pago/Donación' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, description: 'Chat WhatsApp' },
  { id: 'funnel', name: 'Funnel', icon: Layers, description: 'Embudo de ventas' },
  { id: 'form', name: 'Form', icon: FileText, description: 'Formulario' },
  { id: 'survey', name: 'Survey', icon: ClipboardCheck, description: 'Encuesta' },
  { id: 'quiz', name: 'Quiz', icon: Sparkles, description: 'Cuestionario' },
  { id: 'profile', name: 'Profile Card', icon: User, description: 'Tarjeta de perfil' },
  { id: 'vcard', name: 'V Card', icon: IdCard, description: 'Tarjeta de contacto' },
  { id: 'business', name: 'Business Card', icon: Briefcase, description: 'Tarjeta de negocio' }
]

const DOT_STYLES = [
  { value: 'rounded', label: 'Redondeado' },
  { value: 'dots', label: 'Puntos' },
  { value: 'classy', label: 'Clásico' },
  { value: 'classy-rounded', label: 'Clásico Redondeado' },
  { value: 'square', label: 'Cuadrado' },
  { value: 'extra-rounded', label: 'Extra Redondeado' }
]

const CORNER_STYLES = [
  { value: 'square', label: 'Cuadrado' },
  { value: 'extra-rounded', label: 'Redondeado' },
  { value: 'dot', label: 'Punto' }
]

interface AdvancedQRGeneratorProps {
  onSave?: (qrData: any) => void
  availableForms?: any[]
  defaultType?: string
  defaultData?: any
}

export default function AdvancedQRGenerator({ 
  onSave, 
  availableForms = [],
  defaultType = 'website',
  defaultData 
}: AdvancedQRGeneratorProps) {
  const [step, setStep] = useState(1)
  const [qrName, setQRName] = useState('')
  const [selectedType, setSelectedType] = useState(defaultType)
  const [qrData, setQRData] = useState('')
  const [selectedForm, setSelectedForm] = useState('')
  
  // Color customization
  const [bgColor, setBgColor] = useState('#ffffff')
  const [dotsColor, setDotsColor] = useState('#000000')
  const [markerBorderColor, setMarkerBorderColor] = useState('#000000')
  const [markerCenterColor, setMarkerCenterColor] = useState('#000000')
  
  // Style customization
  const [dotStyle, setDotStyle] = useState('rounded')
  const [cornerSquareStyle, setCornerSquareStyle] = useState('extra-rounded')
  const [cornerDotStyle, setCornerDotStyle] = useState('dot')
  
  // Logo
  const [logo, setLogo] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(0.3) // 30% of QR size
  
  // Page background
  const [pageBackground, setPageBackground] = useState<string | null>(null)
  
  // QR Code instance
  const [qrCode, setQRCode] = useState<any>(null)
  const [qrPreview, setQRPreview] = useState<string>('')

  useEffect(() => {
    if (defaultData) {
      setQRName(defaultData.name || '')
      setSelectedType(defaultData.type || 'website')
      setQRData(defaultData.data || '')
      setBgColor(defaultData.bgColor || '#ffffff')
      setDotsColor(defaultData.dotsColor || '#000000')
      setMarkerBorderColor(defaultData.markerBorderColor || '#000000')
      setMarkerCenterColor(defaultData.markerCenterColor || '#000000')
      setDotStyle(defaultData.dotStyle || 'rounded')
      setCornerSquareStyle(defaultData.cornerSquareStyle || 'extra-rounded')
      setCornerDotStyle(defaultData.cornerDotStyle || 'dot')
      setLogo(defaultData.logo || null)
      setPageBackground(defaultData.pageBackground || null)
    }
  }, [defaultData])

  useEffect(() => {
    generateQRPreview()
  }, [bgColor, dotsColor, markerBorderColor, markerCenterColor, dotStyle, cornerSquareStyle, cornerDotStyle, logo, qrData])

  const generateQRPreview = () => {
    if (!qrData && selectedType !== 'form') return

    const data = getQRData()
    if (!data) return

    const qrCodeInstance = new QRCodeStyling({
      width: 400,
      height: 400,
      type: 'svg',
      data: data,
      dotsOptions: {
        color: dotsColor,
        type: dotStyle as any
      },
      backgroundOptions: {
        color: bgColor
      },
      cornersSquareOptions: {
        color: markerBorderColor,
        type: cornerSquareStyle as any
      },
      cornersDotOptions: {
        color: markerCenterColor,
        type: cornerDotStyle as any
      },
      imageOptions: logo ? {
        crossOrigin: 'anonymous',
        margin: 10,
        imageSize: logoSize
      } : undefined,
      image: logo || undefined
    })

    setQRCode(qrCodeInstance)
    
    // Generate preview
    const canvas = document.createElement('canvas')
    qrCodeInstance.append(canvas)
    qrCodeInstance.getRawData('png').then((blob) => {
      if (blob) {
        setQRPreview(URL.createObjectURL(blob))
      }
    })
  }

  const getQRData = () => {
    switch (selectedType) {
      case 'website':
        return qrData
      case 'call':
        return `tel:${qrData}`
      case 'sms':
        return `sms:${qrData}`
      case 'email':
        return `mailto:${qrData}`
      case 'whatsapp':
        return `https://wa.me/${qrData}`
      case 'form':
        const form = availableForms.find(f => f.id === selectedForm)
        return form ? `${window.location.origin}/form-viewer?slug=${form.slug}` : ''
      default:
        return qrData
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setLogo(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setPageBackground(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDownload = async (format: 'png' | 'svg' = 'png') => {
    if (!qrCode) return

    try {
      const blob = await qrCode.getRawData(format)
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${qrName || 'qr-code'}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success(`Código QR descargado como ${format.toUpperCase()}`)
      }
    } catch (error) {
      toast.error('Error al descargar QR')
    }
  }

  const handleSave = async () => {
    const qrConfig = {
      name: qrName,
      type: selectedType,
      data: qrData,
      formId: selectedForm,
      bgColor,
      dotsColor,
      markerBorderColor,
      markerCenterColor,
      dotStyle,
      cornerSquareStyle,
      cornerDotStyle,
      logo,
      logoSize,
      pageBackground,
      preview: qrPreview
    }

    if (onSave) {
      await onSave(qrConfig)
    } else {
      // Default save to API
      try {
        const response = await fetch('/api/qr-codes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(qrConfig)
        })

        if (response.ok) {
          toast.success('Código QR guardado exitosamente')
        } else {
          toast.error('Error al guardar código QR')
        }
      } catch (error) {
        toast.error('Error de conexión')
      }
    }
  }

  const renderTypeStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>QR Name</Label>
        <Input 
          value={qrName} 
          onChange={(e) => setQRName(e.target.value)}
          placeholder="Nombre descriptivo para tu QR"
        />
      </div>

      <div className="space-y-2">
        <Label>Select QR Type (dynamic URL's supported)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QR_TYPES.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => setSelectedType(type.id)}
            >
              <type.icon className="h-6 w-6" />
              <span className="text-xs">{type.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDataStep = () => (
    <div className="space-y-4">
      {selectedType === 'form' ? (
        <div className="space-y-2">
          <Label>Form *</Label>
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un formulario" />
            </SelectTrigger>
            <SelectContent>
              {availableForms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.title || form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedForm && (
            <p className="text-xs text-muted-foreground mt-2">
              URL: {availableForms.find(f => f.id === selectedForm)?.slug ? 
                `/form-viewer?slug=${availableForms.find(f => f.id === selectedForm)?.slug}` : 
                'Form ID: ' + selectedForm}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label>
            {selectedType === 'website' && 'URL del sitio web'}
            {selectedType === 'call' && 'Número de teléfono'}
            {selectedType === 'sms' && 'Número de teléfono'}
            {selectedType === 'email' && 'Dirección de correo'}
            {selectedType === 'whatsapp' && 'Número de WhatsApp (con código país)'}
            {selectedType === 'payment' && 'URL de pago/donación'}
          </Label>
          <Input 
            value={qrData} 
            onChange={(e) => setQRData(e.target.value)}
            placeholder={
              selectedType === 'website' ? 'https://ejemplo.com' :
              selectedType === 'call' || selectedType === 'sms' ? '+57 300 123 4567' :
              selectedType === 'email' ? 'correo@ejemplo.com' :
              selectedType === 'whatsapp' ? '573001234567' :
              'Ingresa la información'
            }
          />
        </div>
      )}
    </div>
  )

  const renderCustomizationStep = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Colors */}
        <div className="space-y-4">
          <h3 className="font-semibold">Colores</h3>
          
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-16 h-10" />
              <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dots Color</Label>
            <div className="flex gap-2">
              <Input type="color" value={dotsColor} onChange={(e) => setDotsColor(e.target.value)} className="w-16 h-10" />
              <Input value={dotsColor} onChange={(e) => setDotsColor(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Marker Border Color</Label>
            <div className="flex gap-2">
              <Input type="color" value={markerBorderColor} onChange={(e) => setMarkerBorderColor(e.target.value)} className="w-16 h-10" />
              <Input value={markerBorderColor} onChange={(e) => setMarkerBorderColor(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Marker Center Color</Label>
            <div className="flex gap-2">
              <Input type="color" value={markerCenterColor} onChange={(e) => setMarkerCenterColor(e.target.value)} className="w-16 h-10" />
              <Input value={markerCenterColor} onChange={(e) => setMarkerCenterColor(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Shape & Form */}
        <div className="space-y-4">
          <h3 className="font-semibold">Shape & Form</h3>
          
          <div className="space-y-2">
            <Label>Estilo de Puntos</Label>
            <Select value={dotStyle} onValueChange={setDotStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOT_STYLES.map(style => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estilo de Esquinas Cuadradas</Label>
            <Select value={cornerSquareStyle} onValueChange={setCornerSquareStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CORNER_STYLES.map(style => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estilo de Puntos de Esquina</Label>
            <Select value={cornerDotStyle} onValueChange={setCornerDotStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CORNER_STYLES.map(style => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Logo */}
        <div className="space-y-4">
          <h3 className="font-semibold">Logo</h3>
          <Input type="file" accept="image/*" onChange={handleLogoUpload} />
          {logo && (
            <div className="space-y-2">
              <Label>Tamaño del Logo ({Math.round(logoSize * 100)}%)</Label>
              <Input 
                type="range" 
                min="0.1" 
                max="0.5" 
                step="0.05"
                value={logoSize}
                onChange={(e) => setLogoSize(parseFloat(e.target.value))}
              />
            </div>
          )}
        </div>

        {/* Page Background */}
        <div className="space-y-4">
          <h3 className="font-semibold">Page Background</h3>
          <Input type="file" accept="image/*" onChange={handleBackgroundUpload} />
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h3 className="font-semibold">Vista Previa</h3>
        <div 
          className="relative aspect-square border-2 rounded-lg p-8 flex items-center justify-center"
          style={{ 
            backgroundImage: pageBackground ? `url(${pageBackground})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {qrPreview ? (
            <img src={qrPreview} alt="QR Preview" className="w-full h-full object-contain" />
          ) : (
            <div className="text-center text-muted-foreground">
              <QrCode className="h-16 w-16 mx-auto mb-2" />
              <p>El QR se generará aquí</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => handleDownload('png')} variant="outline" size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            PNG
          </Button>
          <Button onClick={() => handleDownload('svg')} variant="outline" size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            SVG
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Choose Type' },
          { num: 2, label: 'Additional Information' },
          { num: 3, label: 'QR Color and Shape' }
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step >= s.num ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'
              }`}>
                {s.num}
              </div>
              <span className={`text-xs mt-1 ${step >= s.num ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
            {idx < 2 && (
              <div className={`flex-1 h-0.5 mx-4 ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          {step === 1 && renderTypeStep()}
          {step === 2 && renderDataStep()}
          {step === 3 && renderCustomizationStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Prev
        </Button>
        <div className="flex gap-2">
          {step === 3 && (
            <Button onClick={handleSave} variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          <Button 
            onClick={() => {
              if (step < 3) {
                setStep(step + 1)
              }
            }}
            disabled={step === 3}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
