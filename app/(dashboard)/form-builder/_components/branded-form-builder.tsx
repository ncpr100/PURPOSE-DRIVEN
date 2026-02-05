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
  Phone,
  RefreshCcw,
  Loader2,
  Settings,
  ImageIcon
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
    id: 'spiritual-assessment-public',
    name: 'Evaluación Espiritual Pública',
    description: 'Evaluación espiritual para miembros y visitantes sin acceso a la plataforma',
    icon: 'Heart',
    category: 'Ministerio',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: false },
      {
        id: 'spiritual_gifts',
        label: 'Dones Espirituales (selecciona los que sientes que tienes)',
        type: 'checkbox',
        required: false,
        options: ['Liderazgo', 'Enseñanza', 'Evangelismo', 'Pastoreo', 'Servicio', 'Hospitalidad', 'Música', 'Arte Creativo', 'Administración', 'Tecnología', 'Intercesión', 'Discernimiento']
      },
      {
        id: 'ministry_passions',
        label: 'Ministerios de Interés',
        type: 'checkbox',
        required: false,
        options: ['Niños', 'Jóvenes', 'Familia', 'Evangelismo', 'Música', 'Administración', 'Hospitalidad', 'Educación', 'Misiones', 'Cuidado Pastoral', 'Medios', 'Adultos Jóvenes']
      },
      {
        id: 'experience_level',
        label: 'Experiencia en Ministerio',
        type: 'select',
        required: false,
        options: ['Novato (0-1 años)', 'Intermedio (2-5 años)', 'Avanzado (5+ años)']
      },
      { id: 'spiritual_calling', label: 'Describe cómo sientes que Dios te está llamando a servir', type: 'textarea', required: false },
      { id: 'availability_comments', label: 'Comentarios sobre disponibilidad o intereses especiales', type: 'textarea', required: false }
    ]
  },
  {
    id: 'volunteer-availability-assessment',
    name: 'Disponibilidad de Voluntarios',
    description: 'Recopila información de voluntarios potenciales sin acceso a la plataforma',
    icon: 'Users',
    category: 'Voluntarios',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: false },
      {
        id: 'ministry_interest',
        label: 'Ministerios de Interés para Voluntariado',
        type: 'checkbox',
        required: true,
        options: ['Niños', 'Jóvenes', 'Música/Adoración', 'Evangelismo', 'Administración', 'Tecnología', 'Hospitalidad/Recepción', 'Limpieza/Mantenimiento', 'Eventos Especiales', 'Medios/Comunicación']
      },
      {
        id: 'skills',
        label: 'Habilidades y Talentos',
        type: 'checkbox',
        required: false,
        options: ['Música', 'Tecnología', 'Diseño Gráfico', 'Fotografía', 'Cocina', 'Carpintería', 'Electricidad', 'Primeros Auxilios', 'Idiomas', 'Contabilidad', 'Marketing', 'Enseñanza']
      },
      {
        id: 'availability_days',
        label: 'Días Disponibles',
        type: 'checkbox',
        required: true,
        options: ['Domingo Mañana', 'Domingo Tarde', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      },
      {
        id: 'time_commitment',
        label: 'Tiempo que Podría Dedicar',
        type: 'select',
        required: true,
        options: ['1-2 horas por semana', '3-5 horas por semana', '6-10 horas por semana', 'Más de 10 horas por semana']
      },
      {
        id: 'leadership_interest',
        label: '¿Interés en Roles de Liderazgo?',
        type: 'select',
        required: false,
        options: ['Sí, me interesa liderar', 'Tal vez en el futuro', 'Prefiero servir sin liderar']
      },
      { id: 'special_requirements', label: 'Necesidades Especiales o Comentarios Adicionales', type: 'textarea', required: false }
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
  // Basic settings
  foregroundColor: string
  backgroundColor: string
  size: number
  margin: number
  
  // Advanced styling
  cornerStyle: 'square' | 'rounded' | 'extra-rounded' | 'dot'
  cornerColor: string
  dotStyle: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded'
  
  // Gradient options
  useGradient: boolean
  gradientType: 'linear' | 'radial'
  gradientDirection: string
  gradientColors: string[]
  
  // Background options
  useBackgroundImage: boolean
  backgroundImage: string | null
  backgroundImageOpacity: number
  
  // Logo/overlay
  logo: string | null
  logoSize: number
  logoOpacity: number
  
  // Eye (corner squares) customization
  eyeStyle: 'square' | 'rounded' | 'circle'
  eyeColor: string
  eyeBorderColor: string
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
    // Basic settings
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    size: 512,
    margin: 2,
    
    // Advanced styling
    cornerStyle: 'square',
    cornerColor: '#000000',
    dotStyle: 'square',
    
    // Gradient options
    useGradient: false,
    gradientType: 'linear',
    gradientDirection: '0deg',
    gradientColors: ['#000000', '#333333'],
    
    // Background options
    useBackgroundImage: false,
    backgroundImage: null,
    backgroundImageOpacity: 0.1,
    
    // Logo/overlay
    logo: null,
    logoSize: 0.2,
    logoOpacity: 1.0,
    
    // Eye customization
    eyeStyle: 'square',
    eyeColor: '#000000',
    eyeBorderColor: '#000000'
  })

  // State
  const [qrCodeUrl, setQRCodeUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedForms, setSavedForms] = useState<any[]>([])
  const [showTemplates, setShowTemplates] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [currentFormSlug, setCurrentFormSlug] = useState<string | null>(null)

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
    setCurrentFormSlug(null) // Reset slug for new template
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
    setCurrentFormSlug(null) // Reset slug for new form
    setQRCodeUrl('') // Clear any existing QR code
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

  // Advanced QR Code Generation with full customization
  const generateQRCode = async (formSlug?: string) => {
    if (!formSlug) {
      toast.error('Por favor guarda el formulario primero para generar el código QR')
      return
    }

    setIsGenerating(true)
    try {
      const formUrl = buildFormUrl(formSlug)
      
      // Generate QR data using the basic library first
      const qrDataURL = await QRCode.toDataURL(formUrl, {
        width: qrConfig.size,
        margin: qrConfig.margin,
        color: {
          dark: '#000000', // We'll customize this later
          light: '#ffffff'
        }
      })

      // Create canvas for advanced customization
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = qrConfig.size
      canvas.height = qrConfig.size

      // Load the basic QR image
      const qrImg = new Image()
      qrImg.onload = async () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background
        await drawQRBackground(ctx, canvas, qrConfig)

        // Apply advanced styling to QR pattern
        await drawStyledQR(ctx, canvas, qrImg, qrConfig)

        // Add logo if provided
        if (qrConfig.logo) {
          await drawQRLogo(ctx, canvas, qrConfig)
        }

        setQRCodeUrl(canvas.toDataURL())
        qrCanvasRef.current = canvas
        toast.success('Código QR personalizado generado exitosamente')
        setIsGenerating(false)
      }
      qrImg.src = qrDataURL

    } catch (error) {
      console.error('Error generating custom QR code:', error)
      toast.error('Error al generar código QR personalizado')
      setIsGenerating(false)
    }
  }

  // Draw QR background (solid color, gradient, or image)
  const drawQRBackground = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: QRConfig) => {
    if (config.useBackgroundImage && config.backgroundImage) {
      // Background image
      const bgImg = new Image()
      bgImg.crossOrigin = 'anonymous'
      
      return new Promise<void>((resolve) => {
        bgImg.onload = () => {
          ctx.globalAlpha = config.backgroundImageOpacity
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
          ctx.globalAlpha = 1.0
          resolve()
        }
        bgImg.src = config.backgroundImage!
      })
    } else if (config.useGradient) {
      // Gradient background
      let gradient
      if (config.gradientType === 'linear') {
        const angle = parseInt(config.gradientDirection) * Math.PI / 180
        const x1 = canvas.width / 2 + Math.cos(angle) * canvas.width / 2
        const y1 = canvas.height / 2 + Math.sin(angle) * canvas.height / 2
        const x2 = canvas.width / 2 - Math.cos(angle) * canvas.width / 2
        const y2 = canvas.height / 2 - Math.sin(angle) * canvas.height / 2
        gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      } else {
        gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        )
      }
      
      config.gradientColors.forEach((color, index) => {
        gradient.addColorStop(index / (config.gradientColors.length - 1), color)
      })
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      // Solid background color
      ctx.fillStyle = config.backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  // Draw styled QR pattern with custom corners and dots
  const drawStyledQR = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, qrImg: HTMLImageElement, config: QRConfig) => {
    // Create a temporary canvas to analyze the QR pattern
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')!
    tempCanvas.width = qrImg.width
    tempCanvas.height = qrImg.height
    
    tempCtx.drawImage(qrImg, 0, 0)
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    
    // Calculate module size (QR code unit size)
    const moduleSize = canvas.width / tempCanvas.width
    
    // Set up QR color (gradient or solid)
    let qrColor = config.foregroundColor
    if (config.useGradient) {
      let gradient
      if (config.gradientType === 'linear') {
        const angle = parseInt(config.gradientDirection) * Math.PI / 180
        const x1 = canvas.width / 2 + Math.cos(angle) * canvas.width / 2
        const y1 = canvas.height / 2 + Math.sin(angle) * canvas.height / 2
        const x2 = canvas.width / 2 - Math.cos(angle) * canvas.width / 2
        const y2 = canvas.height / 2 - Math.sin(angle) * canvas.height / 2
        gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      } else {
        gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        )
      }
      
      config.gradientColors.forEach((color, index) => {
        gradient.addColorStop(index / (config.gradientColors.length - 1), color)
      })
      qrColor = gradient
    }

    // Draw QR modules with custom styling
    for (let y = 0; y < tempCanvas.height; y++) {
      for (let x = 0; x < tempCanvas.width; x++) {
        const pixelIndex = (y * tempCanvas.width + x) * 4
        const isBlack = imageData.data[pixelIndex] < 128 // Black pixel in QR
        
        if (isBlack) {
          const canvasX = x * moduleSize
          const canvasY = y * moduleSize
          
          // Check if this is an eye (corner square)
          if (isQREye(x, y, tempCanvas.width)) {
            drawQREye(ctx, canvasX, canvasY, moduleSize, config)
          } else {
            drawQRModule(ctx, canvasX, canvasY, moduleSize, config, qrColor)
          }
        }
      }
    }
  }

  // Check if coordinates are part of QR eye (corner detection squares)
  const isQREye = (x: number, y: number, qrSize: number) => {
    const cornerSize = 7 // Standard QR eye size is 7x7 modules
    
    // Top-left eye
    if (x < cornerSize && y < cornerSize) return true
    // Top-right eye  
    if (x >= qrSize - cornerSize && y < cornerSize) return true
    // Bottom-left eye
    if (x < cornerSize && y >= qrSize - cornerSize) return true
    
    return false
  }

  // Draw individual QR module (dot/square) with custom styling
  const drawQRModule = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, config: QRConfig, color: string | CanvasGradient) => {
    ctx.fillStyle = color
    
    switch (config.dotStyle) {
      case 'rounded':
        ctx.beginPath()
        ctx.roundRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8, size * 0.2)
        ctx.fill()
        break
      case 'dots':
        ctx.beginPath()
        ctx.arc(x + size / 2, y + size / 2, size * 0.35, 0, 2 * Math.PI)
        ctx.fill()
        break
      case 'classy':
        // Diamond-like shape
        ctx.beginPath()
        ctx.moveTo(x + size / 2, y + size * 0.1)
        ctx.lineTo(x + size * 0.9, y + size / 2)
        ctx.lineTo(x + size / 2, y + size * 0.9)
        ctx.lineTo(x + size * 0.1, y + size / 2)
        ctx.closePath()
        ctx.fill()
        break
      case 'classy-rounded':
        ctx.beginPath()
        ctx.roundRect(x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.7, size * 0.35)
        ctx.fill()
        break
      default: // square
        ctx.fillRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8)
        break
    }
  }

  // Draw QR eye (corner detection pattern) with custom styling
  const drawQREye = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number, config: QRConfig) => {
    const eyeSize = moduleSize * 7 // QR eyes are 7x7 modules
    
    ctx.fillStyle = config.eyeColor
    ctx.strokeStyle = config.eyeBorderColor
    ctx.lineWidth = moduleSize * 0.2
    
    switch (config.eyeStyle) {
      case 'rounded':
        // Outer square with rounded corners
        ctx.beginPath()
        ctx.roundRect(x, y, eyeSize, eyeSize, eyeSize * 0.15)
        ctx.fill()
        ctx.stroke()
        
        // Inner square
        ctx.fillStyle = config.backgroundColor
        ctx.beginPath()
        ctx.roundRect(x + moduleSize, y + moduleSize, eyeSize - moduleSize * 2, eyeSize - moduleSize * 2, eyeSize * 0.1)
        ctx.fill()
        
        // Center dot
        ctx.fillStyle = config.eyeColor
        ctx.beginPath()
        ctx.roundRect(x + moduleSize * 2, y + moduleSize * 2, eyeSize - moduleSize * 4, eyeSize - moduleSize * 4, moduleSize * 0.5)
        ctx.fill()
        break
        
      case 'circle':
        // Outer circle
        ctx.beginPath()
        ctx.arc(x + eyeSize / 2, y + eyeSize / 2, eyeSize / 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        
        // Inner circle (white)
        ctx.fillStyle = config.backgroundColor
        ctx.beginPath()
        ctx.arc(x + eyeSize / 2, y + eyeSize / 2, eyeSize / 2 - moduleSize, 0, 2 * Math.PI)
        ctx.fill()
        
        // Center dot
        ctx.fillStyle = config.eyeColor
        ctx.beginPath()
        ctx.arc(x + eyeSize / 2, y + eyeSize / 2, moduleSize * 1.5, 0, 2 * Math.PI)
        ctx.fill()
        break
        
      default: // square
        // Outer square
        ctx.fillRect(x, y, eyeSize, eyeSize)
        ctx.strokeRect(x, y, eyeSize, eyeSize)
        
        // Inner square (white)
        ctx.fillStyle = config.backgroundColor
        ctx.fillRect(x + moduleSize, y + moduleSize, eyeSize - moduleSize * 2, eyeSize - moduleSize * 2)
        
        // Center square
        ctx.fillStyle = config.eyeColor
        ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, eyeSize - moduleSize * 4, eyeSize - moduleSize * 4)
        break
    }
  }

  // Draw logo overlay
  const drawQRLogo = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: QRConfig) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    return new Promise<void>((resolve) => {
      img.onload = () => {
        const logoSize = canvas.width * config.logoSize
        const x = (canvas.width - logoSize) / 2
        const y = (canvas.height - logoSize) / 2

        ctx.globalAlpha = config.logoOpacity
        
        // Draw white background circle for logo
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(x + logoSize/2, y + logoSize/2, logoSize/2 + 10, 0, 2 * Math.PI)
        ctx.fill()
        
        // Draw logo
        ctx.save()
        ctx.beginPath()
        ctx.arc(x + logoSize/2, y + logoSize/2, logoSize/2, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(img, x, y, logoSize, logoSize)
        ctx.restore()
        
        ctx.globalAlpha = 1.0
        resolve()
      }
      img.src = config.logo!
    })
  }

  // Button click handler for QR generation - FIXED: Check if form has slug or save first
  const handleGenerateQR = async () => {
    if (!formConfig.title.trim()) {
      toast.error('Por favor añade un título al formulario antes de generar el código QR')
      return
    }

    // If form already has a slug (is saved), generate QR immediately
    if (currentFormSlug) {
      await generateQRCode(currentFormSlug)
      return
    }

    // If not saved, save the form first, then generate QR
    toast.info('Guardando formulario para generar código QR...')
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
      }

      const response = await fetch('/api/form-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const savedForm = await response.json()
        setCurrentFormSlug(savedForm.slug)
        // Now generate QR with the new slug
        await generateQRCode(savedForm.slug)
        toast.success('Formulario guardado y código QR generado exitosamente')
      } else {
        throw new Error('Failed to save form')
      }
    } catch (error) {
      console.error('Error saving form for QR generation:', error)
      toast.error('Error al guardar formulario para generar código QR')
    }
  }

  // Download Functions
  const downloadQR = downloadQRCode // Alias for consistency
  
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
        
        // Update current form slug
        setCurrentFormSlug(savedForm.slug)
        
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

          {/* Advanced QR Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                Código QR Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* QR Preview Section */}
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center space-y-3" style={{ minHeight: '280px' }}>
                {qrCodeUrl ? (
                  <>
                    <img src={qrCodeUrl} alt="QR Code" className="border rounded-lg shadow-sm max-w-[200px]" />
                    <div className="text-center text-sm text-gray-600">
                      <p>Tamaño: {qrConfig.size}px</p>
                      <p>Estilo: {qrConfig.dotStyle}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    <QrCode className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Vista previa del QR personalizado</p>
                    <p className="text-sm">Configura y genera para ver</p>
                  </div>
                )}
              </div>

              {/* Quick Style Presets */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Estilos Rápidos
                </Label>
                
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant={qrConfig.dotStyle === 'square' ? 'default' : 'outline'}
                    className="h-auto p-2 flex flex-col gap-1"
                    onClick={() => setQRConfig(prev => ({ ...prev, dotStyle: 'square', eyeStyle: 'square' }))}
                  >
                    <div className="grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-current"></div>
                      ))}
                    </div>
                    <span className="text-xs">Clásico</span>
                  </Button>
                  
                  <Button
                    variant={qrConfig.dotStyle === 'rounded' ? 'default' : 'outline'}
                    className="h-auto p-2 flex flex-col gap-1"
                    onClick={() => setQRConfig(prev => ({ ...prev, dotStyle: 'rounded', eyeStyle: 'rounded' }))}
                  >
                    <div className="grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                      ))}
                    </div>
                    <span className="text-xs">Moderno</span>
                  </Button>
                  
                  <Button
                    variant={qrConfig.dotStyle === 'dots' ? 'default' : 'outline'}
                    className="h-auto p-2 flex flex-col gap-1"
                    onClick={() => setQRConfig(prev => ({ ...prev, dotStyle: 'dots', eyeStyle: 'circle' }))}
                  >
                    <div className="grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-current rounded-full"></div>
                      ))}
                    </div>
                    <span className="text-xs">Puntos</span>
                  </Button>
                  
                  <Button
                    variant={qrConfig.dotStyle === 'classy' ? 'default' : 'outline'}
                    className="h-auto p-2 flex flex-col gap-1"
                    onClick={() => setQRConfig(prev => ({ ...prev, dotStyle: 'classy', eyeStyle: 'rounded' }))}
                  >
                    <div className="grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-current rotate-45 mx-auto"></div>
                      ))}
                    </div>
                    <span className="text-xs">Elegante</span>
                  </Button>
                </div>
              </div>

              {/* Basic Settings */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-600" />
                  Configuración Básica
                </Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Tamaño (px)</Label>
                    <Input
                      type="number"
                      value={qrConfig.size}
                      onChange={(e) => setQRConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                      min="200"
                      max="800"
                      step="50"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Margen</Label>
                    <Input
                      type="number"
                      value={qrConfig.margin}
                      onChange={(e) => setQRConfig(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                      min="0"
                      max="10"
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-pink-600" />
                  Colores
                </Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">QR Principal</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={qrConfig.foregroundColor}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        className="w-10 h-9 p-1 rounded"
                      />
                      <Input
                        value={qrConfig.foregroundColor}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        placeholder="#000000"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Fondo</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={qrConfig.backgroundColor}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-10 h-9 p-1 rounded"
                      />
                      <Input
                        value={qrConfig.backgroundColor}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        placeholder="#ffffff"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useGradient"
                    checked={qrConfig.useGradient}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, useGradient: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="useGradient" className="text-sm">Usar gradiente</Label>
                </div>

                {qrConfig.useGradient && (
                  <div className="space-y-3 ml-6 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Tipo</Label>
                        <Select
                          value={qrConfig.gradientType}
                          onValueChange={(value: 'linear' | 'radial') => setQRConfig(prev => ({ ...prev, gradientType: value }))}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Lineal</SelectItem>
                            <SelectItem value="radial">Radial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {qrConfig.gradientType === 'linear' && (
                        <div>
                          <Label className="text-sm">Ángulo</Label>
                          <Input
                            type="number"
                            value={qrConfig.gradientDirection}
                            onChange={(e) => setQRConfig(prev => ({ ...prev, gradientDirection: e.target.value }))}
                            min="0"
                            max="360"
                            step="45"
                            className="h-8"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm">Colores</Label>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {qrConfig.gradientColors.map((color, index) => (
                          <div key={index} className="flex gap-1">
                            <Input
                              type="color"
                              value={color}
                              onChange={(e) => {
                                const newColors = [...qrConfig.gradientColors]
                                newColors[index] = e.target.value
                                setQRConfig(prev => ({ ...prev, gradientColors: newColors }))
                              }}
                              className="w-8 h-8 p-1 rounded"
                            />
                            {index >= 2 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newColors = qrConfig.gradientColors.filter((_, i) => i !== index)
                                  setQRConfig(prev => ({ ...prev, gradientColors: newColors }))
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                        {qrConfig.gradientColors.length < 4 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setQRConfig(prev => ({ 
                                ...prev, 
                                gradientColors: [...prev.gradientColors, '#ff0000'] 
                              }))
                            }}
                            className="h-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Eye Customization */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  Esquinas (Ojos)
                </Label>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={qrConfig.eyeStyle === 'square' ? 'default' : 'outline'}
                    className="h-auto p-2 flex flex-col gap-1"
                    onClick={() => setQRConfig(prev => ({ ...prev, eyeStyle: 'square' }))}
                  >
                    <div className="w-6 h-6 border-2 border-current">
                      <div className="w-full h-full border border-current m-0.5">
                        <div className="w-1.5 h-1.5 bg-current m-0.5"></div>
                      </div>
                    </div>
                    <span className="text-xs">Cuadrado</span>
                  </Button>
                  
                  <Button
                    variant={qrConfig.eyeStyle === 'rounded' ? 'default' : 'outline'}
                    className="h-auto p-2 flex flex-col gap-1"
                    onClick={() => setQRConfig(prev => ({ ...prev, eyeStyle: 'rounded' }))}
                  >
                    <div className="w-6 h-6 border-2 border-current rounded">
                      <div className="w-full h-full border border-current rounded m-0.5">
                        <div className="w-1.5 h-1.5 bg-current rounded m-0.5"></div>
                      </div>
                    </div>
                    <span className="text-xs">Redondeado</span>
                  </Button>
                  
                  <Button
                    variant={qrConfig.eyeStyle === 'circle' ? 'default' : 'outline'}
                    className="h-auto p-2 flex flex-col gap-1"
                    onClick={() => setQRConfig(prev => ({ ...prev, eyeStyle: 'circle' }))}
                  >
                    <div className="w-6 h-6 border-2 border-current rounded-full">
                      <div className="w-full h-full border border-current rounded-full m-0.5">
                        <div className="w-1.5 h-1.5 bg-current rounded-full m-0.5"></div>
                      </div>
                    </div>
                    <span className="text-xs">Circular</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Color Esquinas</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={qrConfig.eyeColor}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, eyeColor: e.target.value }))}
                        className="w-10 h-9 p-1 rounded"
                      />
                      <Input
                        value={qrConfig.eyeColor}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, eyeColor: e.target.value }))}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Color Borde</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={qrConfig.eyeBorderColor}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, eyeBorderColor: e.target.value }))}
                        className="w-10 h-9 p-1 rounded"
                      />
                      <Input
                        value={qrConfig.eyeBorderColor}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, eyeBorderColor: e.target.value }))}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-green-600" />
                  Logo Central
                </Label>
                
                <div>
                  <Input
                    value={qrConfig.logo || ''}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, logo: e.target.value }))}
                    placeholder="URL del logo (ej: https://ejemplo.com/logo.png)"
                    className="h-9 text-sm"
                  />
                </div>
                
                {qrConfig.logo && (
                  <div className="grid grid-cols-2 gap-3 ml-6 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm">Tamaño ({Math.round(qrConfig.logoSize * 100)}%)</Label>
                      <Input
                        type="range"
                        min="0.1"
                        max="0.3"
                        step="0.05"
                        value={qrConfig.logoSize}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, logoSize: parseFloat(e.target.value) }))}
                        className="w-full h-8"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Opacidad ({Math.round(qrConfig.logoOpacity * 100)}%)</Label>
                      <Input
                        type="range"
                        min="0.3"
                        max="1"
                        step="0.1"
                        value={qrConfig.logoOpacity}
                        onChange={(e) => setQRConfig(prev => ({ ...prev, logoOpacity: parseFloat(e.target.value) }))}
                        className="w-full h-8"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleGenerateQR} 
                  disabled={isGenerating || !formConfig.title.trim()} 
                  className="flex-1"
                  variant={!formConfig.title.trim() ? "outline" : "default"}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      {!formConfig.title.trim() ? 'Guarda Primero' : 'Generar QR'}
                    </>
                  )}
                </Button>
                {qrCodeUrl && (
                  <Button variant="outline" onClick={downloadQR}>
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>

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