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
  Save,
  Sparkles,
  BarChart3,
  FileText,
  Zap,
  Lightbulb,
  Users,
  MapPin,
  ArrowLeft,
  MessageSquare,
  Heart,
  Calendar,
  Share2,
  HandHeart,
  Mail,
  Phone
} from 'lucide-react'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { toast } from 'sonner'

// Helper function to render preset field icons as JSX components
const getPresetFieldIcon = (iconName: string) => {
  const iconProps = { className: "h-4 w-4 mr-2" }
  
  switch (iconName) {
    case 'Mail':
      return <Mail {...iconProps} className="h-4 w-4 mr-2 text-cyan-600" />
    case 'Phone':
      return <Phone {...iconProps} className="h-4 w-4 mr-2 text-green-600" />
    case 'MapPin':
      return <MapPin {...iconProps} className="h-4 w-4 mr-2 text-red-600" />
    case 'Share2':
      return <Share2 {...iconProps} className="h-4 w-4 mr-2 text-blue-600" />
    case 'BarChart3':
      return <BarChart3 {...iconProps} className="h-4 w-4 mr-2 text-indigo-600" />
    case 'Users':
      return <Users {...iconProps} className="h-4 w-4 mr-2 text-purple-600" />
    case 'Heart':
      return <Heart {...iconProps} className="h-4 w-4 mr-2 text-pink-600" />
    case 'Calendar':
      return <Calendar {...iconProps} className="h-4 w-4 mr-2 text-orange-600" />
    case 'MessageSquare':
      return <MessageSquare {...iconProps} className="h-4 w-4 mr-2 text-gray-600" />
    default:
      return <FileText {...iconProps} className="h-4 w-4 mr-2 text-gray-600" />
  }
}

// Helper function to render template icons as JSX components
const getTemplateIcon = (iconName: string) => {
  const iconProps = { className: "h-8 w-8" }
  
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles {...iconProps} className="h-8 w-8 text-purple-600" />
    case 'BarChart3':
      return <BarChart3 {...iconProps} className="h-8 w-8 text-blue-600" />
    case 'Share2':
      return <Share2 {...iconProps} className="h-8 w-8 text-green-600" />
    case 'Heart':
      return <Heart {...iconProps} className="h-8 w-8 text-pink-600" />
    case 'Calendar':
      return <Calendar {...iconProps} className="h-8 w-8 text-orange-600" />
    case 'Users':
      return <Users {...iconProps} className="h-8 w-8 text-indigo-600" />
    case 'FileText':
      return <FileText {...iconProps} className="h-8 w-8 text-gray-600" />
    default:
      return <FileText {...iconProps} className="h-8 w-8 text-gray-600" />
  }
}

// SMART TEMPLATES for Non-Technical Users
const SMART_TEMPLATES = [
  // SIMPLE VISITOR TRACKING - Exactly what the user requested
  {
    id: 'simple-visitor-tracking',
    name: 'Visitante Básico',
    description: 'Solo 4 campos: Nombre, Teléfono, Email (opcional), Fuente',
    icon: 'Sparkles',
    category: 'Visitantes',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'phone', label: 'Número de Teléfono', type: 'text', required: true },
      { id: 'email', label: 'Email (opcional)', type: 'email', required: false },
      { 
        id: 'source', 
        label: '¿Cómo nos conociste?', 
        type: 'select', 
        required: true,
        options: [
          'Facebook',
          'Instagram', 
          'WhatsApp',
          'YouTube',
          'TikTok',
          'Familia/Amigo',
          'Invitación Personal',
          'Página Web',
          'Google',
          'Pasé por aquí',
          'Evento Especial',
          'Radio/TV',
          'Volante',
          'Otro'
        ]
      }
    ]
  },
  {
    id: 'visitor-source-tracking',
    name: 'Rastreo de Fuentes de Visitantes',
    description: 'Formulario completo para conocer cómo llegaron los visitantes',
    icon: 'BarChart3',
    category: 'Visitantes',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: false },
      { 
        id: 'source', 
        label: '¿Cómo se enteró de nuestra iglesia?', 
        type: 'select', 
        required: true,
        options: ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Google', 'Sitio Web', 'Amigo/Familiar', 'Volante', 'Radio/TV', 'Pasando por aquí', 'Evento especial', 'Otro']
      },
      { id: 'visit_reason', label: 'Motivo de la visita', type: 'textarea', required: false }
    ]
  },
  {
    id: 'social-media-engagement',
    name: 'Interacción Redes Sociales',
    description: 'Para eventos específicos o campañas digitales',
    icon: 'Share2',
    category: 'Marketing',
    fields: [
      { id: 'name', label: 'Nombre', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      {
        id: 'social_platform',
        label: '¿En qué red social nos sigues?',
        type: 'select',
        required: true,
        options: ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'LinkedIn', 'Twitter/X', 'WhatsApp', 'No uso redes sociales']
      },
      {
        id: 'content_interest',
        label: '¿Qué contenido te interesa más?',
        type: 'select',
        required: false,
        options: ['Sermones', 'Música/Adoración', 'Testimonios', 'Eventos', 'Estudios bíblicos', 'Contenido juvenil', 'Familia', 'Oración']
      }
    ]
  },
  {
    id: 'prayer-request-intake',
    name: 'Recepción de Peticiones',
    description: 'Formulario especializado para peticiones de oración',
    icon: 'Heart',
    category: 'Ministerio',
    fields: [
      { id: 'name', label: 'Nombre (opcional)', type: 'text', required: false },
      { id: 'email', label: 'Email de contacto', type: 'email', required: false },
      { id: 'prayer_request', label: 'Su petición de oración', type: 'textarea', required: true },
      {
        id: 'prayer_type',
        label: 'Tipo de petición',
        type: 'select',
        required: false,
        options: ['Salud', 'Familia', 'Trabajo', 'Finanzas', 'Espiritual', 'Agradecimiento', 'Otro']
      },
      {
        id: 'urgency',
        label: 'Urgencia',
        type: 'select',
        required: false,
        options: ['Normal', 'Urgente', 'Muy urgente']
      }
    ]
  },
  {
    id: 'event-registration',
    name: 'Registro para Eventos',
    description: 'Inscripción para conferencias, retiros, actividades',
    icon: 'Calendar',
    category: 'Eventos',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: true },
      {
        id: 'age_group',
        label: 'Grupo de Edad',
        type: 'select',
        required: false,
        options: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
      },
      {
        id: 'dietary_restrictions',
        label: 'Restricciones alimentarias',
        type: 'text',
        required: false
      },
      { id: 'special_needs', label: 'Necesidades especiales', type: 'textarea', required: false }
    ]
  },
  {
    id: 'ministry-interest',
    name: 'Interés Ministerial',
    description: 'Para conectar personas con ministerios específicos',
    icon: 'Users',
    category: 'Ministerios',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: false },
      {
        id: 'ministry_area',
        label: '¿En qué ministerio te gustaría participar?',
        type: 'select',
        required: true,
        options: ['Música/Adoración', 'Enseñanza', 'Niños', 'Jóvenes', 'Intercesión', 'Evangelismo', 'Tecnología', 'Limpieza', 'Cocina', 'Recepción', 'Seguridad', 'Otro']
      },
      {
        id: 'experience_level',
        label: 'Nivel de experiencia',
        type: 'select',
        required: false,
        options: ['Principiante', 'Intermedio', 'Avanzado', 'Profesional']
      },
      {
        id: 'availability',
        label: 'Disponibilidad',
        type: 'select',
        required: false,
        options: ['Solo domingos', 'Entre semana', 'Fines de semana', 'Horario flexible', 'Solo eventos especiales']
      }
    ]
  },
  {
    id: 'blank-template',
    name: 'Formulario en Blanco',
    description: 'Comienza desde cero con un formulario personalizado',
    icon: 'FileText',
    category: 'Personalizado',
    fields: [
      { id: 'name', label: 'Nombre', type: 'text', required: true }
    ]
  }
]

// QUICK ADD FIELD PRESETS for instant field creation
const QUICK_FIELD_PRESETS = [
  // Contact Fields
  { name: 'Email', field: { label: 'Correo Electrónico', type: 'email', required: true }, icon: 'Mail' },
  { name: 'Teléfono', field: { label: 'Teléfono', type: 'text', required: false }, icon: 'Phone' },
  { name: 'Dirección', field: { label: 'Dirección', type: 'text', required: false }, icon: 'MapPin' },
  
  // Social Media Tracking
  { 
    name: 'Redes Sociales', 
    field: { 
      label: '¿Cómo nos conociste?', 
      type: 'select', 
      required: true,
      options: ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Google', 'Amigo/Familiar', 'Otro']
    },
    icon: 'Share2'
  },
  {
    name: 'Fuente de Tráfico',
    field: {
      label: 'Fuente de referencia',
      type: 'select',
      required: false,
      options: ['Sitio Web', 'Redes Sociales', 'Volante', 'Radio/TV', 'Boca a boca', 'Google', 'Evento', 'Otro']
    },
    icon: 'BarChart3'
  },
  
  // Demographics
  {
    name: 'Grupo de Edad',
    field: {
      label: 'Rango de Edad',
      type: 'select',
      required: false,
      options: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
    },
    icon: 'Users'
  },
  {
    name: 'Estado Familiar',
    field: {
      label: 'Estado Familiar',
      type: 'select',
      required: false,
      options: ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión libre']
    },
    icon: 'Heart'
  },
  
  // Ministry & Interests
  {
    name: 'Interés Ministerial',
    field: {
      label: 'Ministerio de Interés',
      type: 'select',
      required: false,
      options: ['Música', 'Enseñanza', 'Niños', 'Jóvenes', 'Intercesión', 'Evangelismo', 'Tecnología', 'Otro']
    },
    icon: 'Calendar'
  },
  
  // Text Fields
  { name: 'Comentarios', field: { label: 'Comentarios', type: 'textarea', required: false }, icon: 'MessageSquare' },
  { name: 'Petición de Oración', field: { label: 'Petición de Oración', type: 'textarea', required: false }, icon: 'Heart' }
]

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
  const [showTemplates, setShowTemplates] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Smart Templates Functions
  const applyTemplate = (template: any) => {
    const templateFields = template.fields.map((field: any, index: number) => ({
      id: Date.now() + index,
      ...field
    }))
    
    setFormConfig(prev => ({
      ...prev,
      title: template.name.trim(),
      description: template.description,
      fields: templateFields
    }))
    
    setSelectedTemplate(template.id)
    setShowTemplates(false)
    toast.success(`Plantilla "${template.name}" aplicada exitosamente`)
  }

  const addQuickField = (preset: any) => {
    const newField: FormField = {
      id: Date.now(),
      ...preset.field,
      required: preset.field.required ?? false
    }
    
    setFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
    
    toast.success(`Campo "${preset.field.label}" agregado`)
  }

  const resetToBlank = () => {
    setFormConfig({
      title: 'Formulario Personalizado',
      description: 'Complete la información requerida',
      fields: [{ id: 1, label: 'Nombre Completo', type: 'text', required: true }],
      bgColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'Inter',
      bgImage: null
    })
    setShowTemplates(true)
    setSelectedTemplate(null)
  }

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

  // Option Management for Selection Fields
  const addOption = (fieldId: number, option: string) => {
    if (!option.trim()) return
    
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId
          ? { ...field, options: [...(field.options || []), option.trim()] }
          : field
      )
    }))
  }

  const removeOption = (fieldId: number, optionIndex: number) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options?.filter((_, index) => index !== optionIndex) || []
            }
          : field
      )
    }))
  }

  const updateOption = (fieldId: number, optionIndex: number, newValue: string) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options?.map((option, index) =>
                index === optionIndex ? newValue : option
              ) || []
            }
          : field
      )
    }))
  }

  // Initialize options when field type changes to select
  const handleFieldTypeChange = (fieldId: number, newType: string) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.id === fieldId) {
          if (newType === 'select' && !field.options) {
            return { ...field, type: newType as any, options: ['Opción 1'] }
          }
          return { ...field, type: newType as any }
        }
        return field
      })
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
      
      {/* NAVIGATION HEADER - When not showing templates */}
      {!showTemplates && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Constructor de Formularios</span>
              </div>
              {selectedTemplate && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-blue-600 font-medium">
                    {SMART_TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Formulario Personalizado'}
                  </span>
                </>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Plantillas
            </Button>
          </div>
        </div>
      )}
      
      {/* SMART TEMPLATES SECTION - Shown when templates are visible */}
      {showTemplates && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="text-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Plantillas Inteligentes</h2>
            </div>
            <p className="text-gray-600">Elige una plantilla para crear tu formulario en segundos</p>
          </div>
          
          {/* Template Categories */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Rastreo de Visitantes
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Interacción Social
              </Badge>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Ministerio
              </Badge>
              <Badge variant="outline" className="bg-orange-100 text-orange-800 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Eventos
              </Badge>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {SMART_TEMPLATES.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => applyTemplate(template)}>
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="flex justify-center mb-2">{getTemplateIcon(template.icon)}</div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 text-center leading-relaxed">{template.description}</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1 justify-center">
                      <span className="font-medium">{template.fields.length} campos:</span>
                    </div>
                    <div className="text-center">
                      {template.fields.slice(0, 3).map((field, idx) => (
                        <span key={idx} className="inline-block">
                          {field.label}
                          {idx < Math.min(template.fields.length - 1, 2) ? ', ' : ''}
                        </span>
                      ))}
                      {template.fields.length > 3 && <span>...</span>}
                    </div>
                  </div>
                  <Button className="w-full mt-3 text-sm" size="sm" variant="outline">
                    Usar esta Plantilla
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Skip Templates Option */}
          <div className="text-center">
            <Button variant="ghost" onClick={() => setShowTemplates(false)} className="text-gray-600">
              Saltar plantillas y crear desde cero
            </Button>
          </div>
        </div>
      )}

      {/* Show template selection summary when template is selected */}
      {selectedTemplate && !showTemplates && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Plantilla aplicada: {SMART_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                </h3>
                <p className="text-sm text-green-600">Puedes personalizar los campos abajo</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowTemplates(true)}>
                Ver Otras Plantillas
              </Button>
              <Button size="sm" variant="outline" onClick={resetToBlank}>
                Empezar de Nuevo
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT PANEL - Configuration */}
        <div className="space-y-6">
          
          {/* Form Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Configuración del Formulario
                </CardTitle>
                {!showTemplates && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowTemplates(true)}
                    className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Plantillas
                  </Button>
                )}
              </div>
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
              
              {/* QUICK ADD FIELD PRESETS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Agregar Campos Rápidos</Label>
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Nuevo
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {QUICK_FIELD_PRESETS.map((preset, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      size="sm" 
                      onClick={() => addQuickField(preset)}
                      className="text-xs px-2 py-1 h-auto whitespace-normal text-left justify-start flex items-center"
                    >
                      {preset.icon && getPresetFieldIcon(preset.icon)}
                      <span>{preset.name}</span>
                    </Button>
                  ))}
                </div>
                
                <p className="text-xs text-gray-500 italic">
                  <div className="flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-amber-600" />
                    <span>Haz clic en cualquier botón para agregar ese campo instantáneamente</span>
                  </div>
                </p>
              </div>
              
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
                          onValueChange={(value) => handleFieldTypeChange(field.id, value)}
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

                    {/* Options Management for Selection Fields */}
                    {field.type === 'select' && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium">Opciones de Selección</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newOption = `Opción ${(field.options?.length || 0) + 1}`
                              addOption(field.id, newOption)
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Agregar Opción
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {field.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                placeholder={`Opción ${optionIndex + 1}`}
                                className="text-sm"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeOption(field.id, optionIndex)}
                                disabled={(field.options?.length || 0) <= 1}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )) || []}
                        </div>
                        
                        {(!field.options || field.options.length === 0) && (
                          <div className="text-sm text-gray-500 italic">
                            No hay opciones. Agrega al menos una opción.
                          </div>
                        )}
                      </div>
                    )}
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
                          {field.options?.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
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