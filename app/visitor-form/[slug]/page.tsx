'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MapPin, Phone, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
  validation?: any
  description?: string
}

interface FormData {
  form: {
    id: string
    name: string
    description: string
    fields: FormField[]
    style: any
    settings: any
  }
  church: {
    id: string
    name: string
    address?: string
    city?: string
    state?: string
    phone?: string
    email?: string
  }
  qrCode?: string
}

export default function PublicVisitorForm({ params }: { params: { slug: string } }) {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [submission, setSubmission] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [thankYouMessage, setThankYouMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const qr = urlParams.get('qr')
        
        const url = `/api/visitor-form/${params.slug}${qr ? `?qr=${qr}` : ''}`
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Formulario no encontrado')
        }
        
        const data = await response.json()
        setFormData(data)
      } catch (error) {
        console.error('Error fetching form:', error)
        setError('No se pudo cargar el formulario')
      } finally {
        setIsLoading(false)
      }
    }

    fetchForm()
  }, [params.slug])

  const handleInputChange = (fieldId: string, value: any) => {
    setSubmission(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const validateForm = () => {
    if (!formData) return false

    for (const field of formData.form.fields) {
      if (field.required && !submission[field.id]) {
        toast.error(`${field.label} es requerido`)
        return false
      }

      // Email validation
      if (field.type === 'email' && submission[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(submission[field.id])) {
          toast.error('Email inválido')
          return false
        }
      }

      // Phone validation
      if (field.type === 'tel' && submission[field.id]) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/
        if (!phoneRegex.test(submission[field.id])) {
          toast.error('Teléfono inválido')
          return false
        }
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/visitor-form/${params.slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: submission,
          qrCode: formData?.qrCode
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      const result = await response.json()
      setIsSubmitted(true)
      setThankYouMessage(result.thankYouMessage)

      // Redirect if specified
      if (result.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.redirectUrl
        }, 3000)
      }

    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error al enviar el formulario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = submission[field.id] || ''

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className="w-full"
          />
        )

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            rows={4}
            className="w-full resize-none"
          />
        )

      case 'select':
        return (
          <Select onValueChange={(value) => handleInputChange(field.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Seleccionar...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'radio':
        return (
          <RadioGroup
            value={value}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => {
              const currentValues = Array.isArray(value) ? value : []
              return (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${index}`}
                    checked={currentValues.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleInputChange(field.id, [...currentValues, option])
                      } else {
                        handleInputChange(field.id, currentValues.filter((v: string) => v !== option))
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              )
            })}
          </div>
        )

      default:
        return <Input placeholder="Campo no soportado" disabled />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    )
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error || 'Formulario no encontrado'}</p>
            <Button onClick={() => window.location.reload()}>
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-600">¡Gracias!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{thankYouMessage}</p>
            <p className="text-sm text-gray-500">
              Nos pondremos en contacto contigo pronto.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formStyle = formData.form.style || {}

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: formStyle.backgroundColor || '#f9fafb',
        backgroundImage: formStyle.backgroundImage ? `url(${formStyle.backgroundImage})` : undefined
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Church Info Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {formData.church.name}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                {formData.church.address && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{formData.church.address}</span>
                  </div>
                )}
                {formData.church.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{formData.church.phone}</span>
                  </div>
                )}
                {formData.church.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{formData.church.email}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle 
              style={{ color: formStyle.primaryColor || '#1f2937' }}
            >
              {formData.form.name}
            </CardTitle>
            {formData.form.description && (
              <CardDescription>
                {formData.form.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label 
                  htmlFor={field.id}
                  className="text-sm font-medium"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.description && (
                  <p className="text-sm text-gray-500">{field.description}</p>
                )}
                {renderField(field)}
              </div>
            ))}

            <div className="pt-6 border-t">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
                style={{
                  backgroundColor: formStyle.primaryColor || '#3b82f6',
                  color: formStyle.buttonTextColor || '#ffffff'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Información'
                )}
              </Button>
            </div>

            {formData.qrCode && (
              <p className="text-xs text-center text-gray-500">
                Accedido vía código QR
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}