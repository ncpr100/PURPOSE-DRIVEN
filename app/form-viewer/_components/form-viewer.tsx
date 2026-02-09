'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
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
  submitButtonText?: string
  submitButtonColor?: string
  submitButtonTextColor?: string
  // Church Branding
  churchLogo?: string | null
  primaryColor?: string
  secondaryColor?: string
  headerTextColor?: string
  bodyTextColor?: string
  formBackgroundColor?: string
  borderColor?: string
  inputBorderColor?: string
  inputFocusColor?: string
  timestamp?: number
  church?: any
}

export default function FormViewer() {
  const searchParams = useSearchParams()
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const data = searchParams.get('data')
    const slug = searchParams.get('slug')
    
    if (slug) {
      // PREFERRED: Load form from database using slug (short URLs)
      fetchFormBySlug(slug)
    } else if (data) {
      // LEGACY: Support old Base64 URLs but warn about length
      if (data.length > 2000) {
        console.warn('⚠️ URL muy larga detectada. Recomendamos guardar el formulario para URLs más cortas.')
        toast.error('URL muy larga. Por favor, usa la versión guardada del formulario para obtener un enlace más corto.')
      }
      try {
        const decoded = JSON.parse(atob(data))
        setFormConfig(decoded)
        initializeFormData(decoded.fields)
        setIsLoading(false)
      } catch (err) {
        console.error('Error decoding form data:', err)
        setError('Error al decodificar los datos del formulario. El enlace puede estar dañado o ser demasiado largo.')
        setIsLoading(false)
      }
    } else {
      setError('No se encontraron datos del formulario')
      setIsLoading(false)
    }
  }, [searchParams])

  const fetchFormBySlug = async (slug: string) => {
    try {
      const response = await fetch(`/api/custom-form/${slug}`)
      if (response.ok) {
        const result = await response.json()
        const form = result.form
        
        // Convert database format to component format
        const formConfigData = {
          title: form.title,
          description: form.description,
          fields: form.fields,
          bgColor: form.config.bgColor,
          textColor: form.config.textColor,
          fontFamily: form.config.fontFamily,
          bgImage: form.config.bgImage,
          submitButtonText: form.config.submitButtonText,
          submitButtonColor: form.config.submitButtonColor,
          submitButtonTextColor: form.config.submitButtonTextColor,
          // Church Branding
          churchLogo: form.config.churchLogo,
          primaryColor: form.config.primaryColor,
          secondaryColor: form.config.secondaryColor,
          headerTextColor: form.config.headerTextColor,
          bodyTextColor: form.config.bodyTextColor,
          formBackgroundColor: form.config.formBackgroundColor,
          borderColor: form.config.borderColor,
          inputBorderColor: form.config.inputBorderColor,
          inputFocusColor: form.config.inputFocusColor,
          church: result.church
        }
        
        setFormConfig(formConfigData)
        initializeFormData(form.fields)
      } else {
        setError('Formulario no encontrado')
      }
    } catch (err) {
      setError('Error al cargar el formulario')
    } finally {
      setIsLoading(false)
    }
  }

  const initializeFormData = (fields: FormField[]) => {
    const initialData: Record<string, any> = {}
    fields.forEach((field: FormField) => {
      initialData[field.id] = field.type === 'checkbox' ? false : ''
    })
    setFormData(initialData)
  }

  const handleInputChange = (fieldId: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formConfig) return false

    for (const field of formConfig.fields) {
      if (field.required) {
        const value = formData[field.id]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          toast.error(`El campo "${field.label}" es requerido`)
          return false
        }
        
        // Email validation
        if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            toast.error('Por favor ingrese un email válido')
            return false
          }
        }
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const slug = searchParams.get('slug')
      const isLegacyForm = !slug && searchParams.get('data')
      
      let response
      
      if (slug) {
        // Submit to specific form endpoint
        response = await fetch(`/api/custom-form/${slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: formData
          })
        })
      } else {
        // Legacy submission handler
        response = await fetch('/api/custom-form-submission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            formTitle: formConfig?.title,
            formData: formData,
            timestamp: new Date().toISOString()
          })
        })
      }

      if (response.ok) {
        const result = await response.json()
        setIsSubmitted(true)
        toast.success(result.message || 'Formulario enviado exitosamente')
        
        console.log('Form submitted successfully:', {
          formTitle: formConfig?.title,
          submissionId: result.submissionId,
          visitorId: result.visitorId
        })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al enviar el formulario')
      }
    } catch (err) {
      console.error('Submission error:', err)
      toast.error('Error al enviar el formulario. Intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    if (formConfig) {
      const initialData: Record<string, any> = {}
      formConfig.fields.forEach((field) => {
        initialData[field.id] = field.type === 'checkbox' ? false : ''
      })
      setFormData(initialData)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando formulario...</p>
        </div>
      </div>
    )
  }

  if (error || !formConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Error</h2>
              <p className="text-muted-foreground">{error || 'Formulario no encontrado'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundColor: formConfig.bgColor,
          backgroundImage: formConfig.bgImage ? `url(${formConfig.bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">¡Formulario Enviado!</h2>
              <p className="text-muted-foreground mb-6">
                Gracias por completar el formulario. Hemos recibido su información exitosamente.
              </p>
              <Button onClick={resetForm} variant="outline">
                Enviar Otro Formulario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen p-4 flex items-center justify-center"
      style={{
        backgroundColor: formConfig.formBackgroundColor || formConfig.bgColor,
        backgroundImage: formConfig.bgImage ? `url(${formConfig.bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: formConfig.bodyTextColor || formConfig.textColor,
        fontFamily: formConfig.fontFamily
      }}
    >
      <Card 
        className="w-full max-w-2xl bg-white/95 backdrop-blur-sm"
        style={{
          borderColor: formConfig.borderColor,
          borderWidth: formConfig.borderColor ? '2px' : undefined
        }}
      >
        <CardHeader className="text-center">
          {/* Church Logo */}
          {formConfig.churchLogo && (
            <div className="flex justify-center mb-4">
              <img src={formConfig.churchLogo} alt="Church Logo" className="h-20 object-contain" />
            </div>
          )}
          
          <h1 
            className="text-2xl font-bold"
            style={{ color: formConfig.headerTextColor || formConfig.primaryColor || '#1f2937' }}
          >
            {formConfig.title}
          </h1>
          {formConfig.description && (
            <p
              style={{ color: formConfig.bodyTextColor || '#4b5563' }}
            >
              {formConfig.description}
            </p>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {formConfig.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label 
                  htmlFor={`field-${field.id}`}
                  style={{ color: formConfig.bodyTextColor || '#374151' }}
                >
                  {field.label}
                  {field.required && <span style={{ color: formConfig.primaryColor || '#ef4444' }} className="ml-1">*</span>}
                </Label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    id={`field-${field.id}`}
                    className="w-full p-3 rounded-md resize-none h-24"
                    style={{
                      borderColor: formConfig.inputBorderColor || '#d1d5db',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: '#1f2937'
                    }}
                    placeholder={`Ingrese ${field.label.toLowerCase()}`}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    onFocus={(e) => {
                      if (formConfig.inputFocusColor) {
                        e.target.style.borderColor = formConfig.inputFocusColor
                        e.target.style.outline = `2px solid ${formConfig.inputFocusColor}40`
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formConfig.inputBorderColor || '#d1d5db'
                      e.target.style.outline = 'none'
                    }}
                  />
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      id={`field-${field.id}`}
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      style={{
                        accentColor: formConfig.primaryColor || '#2563eb'
                      }}
                      checked={formData[field.id] || false}
                      onChange={(e) => handleInputChange(field.id, e.target.checked)}
                    />
                    <Label 
                      htmlFor={`field-${field.id}`} 
                      className="cursor-pointer"
                      style={{ color: formConfig.bodyTextColor || '#374151' }}
                    >
                      Acepto los términos y condiciones
                    </Label>
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    id={`field-${field.id}`}
                    className="w-full p-3 rounded-md"
                    style={{
                      borderColor: formConfig.inputBorderColor || '#d1d5db',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: '#1f2937'
                    }}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    onFocus={(e) => {
                      if (formConfig.inputFocusColor) {
                        e.target.style.borderColor = formConfig.inputFocusColor
                        e.target.style.outline = `2px solid ${formConfig.inputFocusColor}40`
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formConfig.inputBorderColor || '#d1d5db'
                      e.target.style.outline = 'none'
                    }}
                  >
                    <option value="">Seleccione una opción</option>
                    {field.options?.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={`field-${field.id}`}
                    type={field.type}
                    className=""
                    style={{
                      borderColor: formConfig.inputBorderColor || '#d1d5db',
                      color: '#1f2937'
                    }}
                    placeholder={`Ingrese ${field.label.toLowerCase()}`}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    onFocus={(e) => {
                      if (formConfig.inputFocusColor) {
                        e.target.style.borderColor = formConfig.inputFocusColor
                        e.target.style.outline = `2px solid ${formConfig.inputFocusColor}40`
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formConfig.inputBorderColor || '#d1d5db'
                      e.target.style.outline = 'none'
                    }}
                  />
                )}
              </div>
            ))}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-semibold"
              style={{
                backgroundColor: formConfig.submitButtonColor || '#2563eb',
                color: formConfig.submitButtonTextColor || '#ffffff'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                formConfig.submitButtonText || 'Enviar Formulario'
              )}
            </Button>
          </form>

          <Alert className="mt-6">
            <AlertDescription className="text-center text-sm text-gray-600">
              Sus datos están protegidos y serán tratados con confidencialidad según nuestras políticas de privacidad.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}