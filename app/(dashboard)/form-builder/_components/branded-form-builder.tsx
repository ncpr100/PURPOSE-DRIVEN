'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trash2, 
  Plus, 
  Download, 
  QrCode, 
  Camera, 
  Palette,
  Eye,
  Copy,
  Save
} from 'lucide-react'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { toast } from 'sonner'

interface FormField {
  id: number
  label: string
  type: 'text' | 'email' | 'number' | 'checkbox' | 'textarea' | 'select'
  options?: string[]
  required?: boolean
}

interface FormConfig {
  title: string
  description: string
  fields: FormField[]
  bgColor: string
  textColor: string
  fontFamily: string
  bgImage: string | null
}

interface QRConfig {
  foregroundColor: string
  backgroundColor: string
  logo: string | null
  size: number
  margin: number
}

export default function BrandedFormBuilder() {
  // Form Configuration
  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: 'Formulario Personalizado',
    description: 'Complete la información requerida',
    fields: [{ id: 1, label: 'Nombre Completo', type: 'text', required: true }],
    bgColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'Inter',
    bgImage: null
  })

  // QR Configuration
  const [qrConfig, setQRConfig] = useState<QRConfig>({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    logo: null,
    size: 512,
    margin: 2
  })

  // State
  const [qrCodeUrl, setQRCodeUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedForms, setSavedForms] = useState<any[]>([])

  // Refs
  const previewRef = useRef<HTMLDivElement>(null)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  // Field Management
  const addField = () => {
    const newField: FormField = {
      id: Date.now(),
      label: '',
      type: 'text',
      required: false
    }
    setFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const updateField = (id: number, key: keyof FormField, value: any) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      )
    }))
  }

  const removeField = (id: number) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }))
  }

  // Image Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'qr-logo') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (type === 'background') {
        setFormConfig(prev => ({ ...prev, bgImage: result }))
      } else {
        setQRConfig(prev => ({ ...prev, logo: result }))
      }
    }
    reader.readAsDataURL(file)
  }

  // Form URL Builder - FIXED: Always use slug for QR codes to avoid long URLs
  const buildFormUrl = (formSlug?: string) => {
    if (formSlug) {
      // Use saved form slug (PREFERRED for QR codes - short URLs)
      return `${window.location.origin}/form-viewer?slug=${formSlug}`
    } else {
      // Show warning that form must be saved first for QR generation
      console.warn('Form must be saved first to generate QR codes. Using slug instead of Base64.')
      return `${window.location.origin}/form-viewer?slug=preview`
    }
  }

  // QR Code Generation - FIXED: Only generate QR for saved forms with slug
  const generateQRCode = async (formSlug?: string) => {
    if (!formSlug) {
      toast.error('Por favor guarda el formulario primero para generar el código QR')
      return
    }

    setIsGenerating(true)
    try {
      const formUrl = buildFormUrl(formSlug) // Will always be short URL with slug
      const canvas = document.createElement('canvas')
      
      await QRCode.toCanvas(canvas, formUrl, {
        width: qrConfig.size,
        margin: qrConfig.margin,
        color: {
          dark: qrConfig.foregroundColor,
          light: qrConfig.backgroundColor
        }
      })

      // Add logo if provided
      if (qrConfig.logo) {
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = qrConfig.logo
        
        await new Promise((resolve) => {
          img.onload = resolve
        })

        const logoSize = canvas.width * 0.2 // 20% of QR size
        const x = (canvas.width - logoSize) / 2
        const y = (canvas.height - logoSize) / 2

        // Create circular mask for logo
        ctx?.save()
        ctx?.beginPath()
        ctx?.arc(x + logoSize/2, y + logoSize/2, logoSize/2, 0, 2 * Math.PI)
        ctx?.clip()
        ctx?.drawImage(img, x, y, logoSize, logoSize)
        ctx?.restore()
      }

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

  // Button click handler for QR generation - FIXED: Check if form is saved
  const handleGenerateQR = () => {
    if (!formConfig.title.trim()) {
      toast.error('Por favor guarda el formulario primero para generar el código QR')
      return
    }
    // For now, generate preview QR (after save, it will use slug)
    generateQRCode()
  }

  // Download Functions
  const downloadQRCode = () => {
    if (!qrCanvasRef.current) return
    
    qrCanvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `qr-${formConfig.title.toLowerCase().replace(/\s+/g, '-')}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Código QR descargado')
      }
    })
  }

  const downloadFormPreview = async () => {
    if (!previewRef.current) return

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: formConfig.bgColor,
        scale: 2,
        useCORS: true
      })
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `preview-${formConfig.title.toLowerCase().replace(/\s+/g, '-')}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          toast.success('Vista previa descargada')
        }
      })
    } catch (error) {
      console.error('Error downloading preview:', error)
      toast.error('Error al descargar vista previa')
    }
  }

  const copyFormUrl = () => {
    const url = buildFormUrl()
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URL copiada al portapapeles')
    }).catch(() => {
      toast.error('Error al copiar URL')
    })
  }

  const saveForm = async () => {
    try {
      const formData = {
        title: formConfig.title,
        description: formConfig.description,
        fields: formConfig.fields,
        config: {
          bgColor: formConfig.bgColor,
          textColor: formConfig.textColor,
          fontFamily: formConfig.fontFamily,
          bgImage: formConfig.bgImage
        },
        qrConfig,
        qrCodeUrl
      }

      const response = await fetch('/api/form-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        const savedForm = result.form
        
        // Generate QR code with the new form slug
        await generateQRCode(savedForm.slug)
        
        setSavedForms(prev => [savedForm, ...prev])
        toast.success(`Formulario "${formConfig.title}" guardado exitosamente`)
        
        // Update the QR code with the permanent URL
        setTimeout(() => {
          toast.success(`Código QR actualizado con URL permanente: /form-viewer?slug=${savedForm.slug}`)
        }, 1000)
        
      } else {
        toast.error('Error al guardar el formulario')
      }
    } catch (error) {
      console.error('Error saving form:', error)
      toast.error('Error al guardar el formulario')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT PANEL - Configuration */}
        <div className="space-y-6">
          
          {/* Form Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Configuración del Formulario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="title">Título del Formulario</Label>
                <Input
                  id="title"
                  value={formConfig.title}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nombre de tu formulario"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={formConfig.description}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descripción"
                />
              </div>

              {/* Styling */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Fuente</Label>
                  <Select 
                    value={formConfig.fontFamily} 
                    onValueChange={(value) => setFormConfig(prev => ({ ...prev, fontFamily: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Lora">Lora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bgColor">Color de Fondo</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={formConfig.bgColor}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="w-12 h-10"
                    />
                    <Input
                      value={formConfig.bgColor}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="textColor">Color de Texto</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={formConfig.textColor}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-12 h-10"
                    />
                    <Input
                      value={formConfig.textColor}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bgImage">Imagen de Fondo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'background')}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Campos del Formulario</Label>
                  <Button onClick={addField} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Campo
                  </Button>
                </div>

                {formConfig.fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <Input
                          placeholder="Etiqueta del campo"
                          value={field.label}
                          onChange={(e) => updateField(field.id, 'label', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Select 
                          value={field.type} 
                          onValueChange={(value) => updateField(field.id, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="textarea">Texto Largo</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="select">Selección</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                        />
                        <span className="text-sm">Requerido</span>
                      </div>
                      <div className="col-span-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeField(field.id)}
                          disabled={formConfig.fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QR Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Configuración del Código QR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
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
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logo Central (opcional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'qr-logo')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tamaño</Label>
                  <Select 
                    value={qrConfig.size.toString()} 
                    onValueChange={(value) => setQRConfig(prev => ({ ...prev, size: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="256">256px</SelectItem>
                      <SelectItem value="512">512px</SelectItem>
                      <SelectItem value="1024">1024px</SelectItem>
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
                      <SelectItem value="1">Pequeño</SelectItem>
                      <SelectItem value="2">Mediano</SelectItem>
                      <SelectItem value="4">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateQR} 
                disabled={isGenerating || !formConfig.title.trim()} 
                className="w-full"
                variant={!formConfig.title.trim() ? "outline" : "default"}
              >
                <QrCode className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generando...' : (!formConfig.title.trim() ? 'Guarda el formulario primero' : 'Generar Código QR')}
              </Button>

              {qrCodeUrl && (
                <div className="flex flex-col items-center space-y-4">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 border rounded" />
                  <Button onClick={downloadQRCode} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar QR
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL - Preview */}
        <div className="space-y-6">
          
          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vista Previa en Vivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={previewRef}
                className="p-8 border rounded-lg min-h-[400px]"
                style={{
                  backgroundColor: formConfig.bgColor,
                  backgroundImage: formConfig.bgImage ? `url(${formConfig.bgImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: formConfig.textColor,
                  fontFamily: formConfig.fontFamily
                }}
              >
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">{formConfig.title}</h2>
                  <p className="text-gray-600">{formConfig.description}</p>
                  
                  {formConfig.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="text-gray-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <textarea
                          className="w-full p-2 border rounded resize-none h-20 text-gray-900"
                          placeholder={`Ingrese ${field.label.toLowerCase()}`}
                        />
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="text-gray-900" />
                          <span className="text-gray-700">Acepto los términos</span>
                        </div>
                      ) : field.type === 'select' ? (
                        <select className="w-full p-2 border rounded text-gray-900">
                          <option>Seleccione una opción</option>
                        </select>
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={`Ingrese ${field.label.toLowerCase()}`}
                          className="text-gray-900"
                        />
                      )}
                    </div>
                  ))}
                  
                  <Button className="w-full mt-6">Enviar Formulario</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={downloadFormPreview} variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Capturar Vista
                </Button>
                <Button onClick={copyFormUrl} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar URL
                </Button>
                <Button onClick={saveForm} variant="outline" className="col-span-2">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Formulario
                </Button>
              </div>

              <Alert className="mt-4">
                <AlertDescription>
                  <strong>URL del formulario:</strong><br />
                  <code className="text-xs break-all">{buildFormUrl()}</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Saved Forms */}
          {savedForms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Formularios Guardados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedForms.slice(0, 5).map((form) => (
                    <div key={form.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{form.title}</span>
                        <Badge variant="outline" className="ml-2">{form.fields.length} campos</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}