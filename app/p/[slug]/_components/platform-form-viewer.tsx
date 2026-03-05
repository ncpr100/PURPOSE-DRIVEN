'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface PlatformFormField {
  id: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'email' | 'phone' | 'number'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface PlatformFormStyle {
  backgroundColor?: string
  primaryColor?: string
  fontFamily?: string
  logoUrl?: string
}

interface PlatformFormSettings {
  thankYouMessage?: string
  redirectUrl?: string
}

interface PlatformFormData {
  id: string
  name: string
  description?: string
  fields: PlatformFormField[]
  style: PlatformFormStyle
  settings: PlatformFormSettings
  campaignTag?: string
}

export default function PlatformFormViewer({ slug }: { slug: string }) {
  const [form, setForm] = useState<PlatformFormData | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [thankYouMessage, setThankYouMessage] = useState('Gracias por tu envío. Nos pondremos en contacto pronto.')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/platform/forms/${slug}/submit`)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          const f = result.data as PlatformFormData
          setForm(f)
          // Pre-initialize checkbox fields to false
          const initial: Record<string, any> = {}
          const fields = Array.isArray(f.fields) ? f.fields : []
          fields.forEach((field) => {
            if (field.type === 'checkbox') initial[field.id] = false
          })
          setFormValues(initial)
          if (f.settings?.thankYouMessage) {
            setThankYouMessage(f.settings.thankYouMessage)
          }
        } else {
          setError('Formulario no encontrado o no disponible.')
        }
      })
      .catch(() => setError('No se pudo cargar el formulario.'))
      .finally(() => setIsLoading(false))
  }, [slug])

  const handleChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    // Validate required fields
    const fields = Array.isArray(form.fields) ? form.fields : []
    const missing = fields.filter(field => {
      if (!field.required) return false
      const val = formValues[field.id]
      if (field.type === 'checkbox') return !val
      return !val || String(val).trim() === ''
    })

    if (missing.length > 0) {
      setError(`Completa los campos requeridos: ${missing.map(f => f.label).join(', ')}`)
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/platform/forms/${slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: formValues,
          source: 'qr_scan',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      })
      const result = await res.json()
      if (result.success) {
        setIsSubmitted(true)
        if (result.data?.redirectUrl) {
          setTimeout(() => { window.location.href = result.data.redirectUrl }, 2000)
        }
      } else {
        setError(result.error || 'Error al enviar el formulario.')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error && !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-800">Formulario no disponible</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: form?.style?.backgroundColor || '#F9FAFB' }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center space-y-4">
          <CheckCircle className="h-14 w-14 mx-auto" style={{ color: form?.style?.primaryColor || '#2563EB' }} />
          <h2 className="text-2xl font-bold text-gray-800">¡Enviado con éxito!</h2>
          <p className="text-gray-600">{thankYouMessage}</p>
        </div>
      </div>
    )
  }

  if (!form) return null

  const fields: PlatformFormField[] = Array.isArray(form.fields) ? form.fields : []
  const style = form.style || {}
  const primaryColor = style.primaryColor || '#2563EB'
  const bgColor = style.backgroundColor || '#F9FAFB'

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: bgColor, fontFamily: style.fontFamily || 'inherit' }}>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="h-2" style={{ backgroundColor: primaryColor }} />
          <div className="p-6 pb-4">
            {style.logoUrl && (
              <img src={style.logoUrl} alt="Logo" className="h-12 object-contain mb-4" />
            )}
            <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
            {form.description && (
              <p className="mt-1 text-gray-500 text-sm">{form.description}</p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="text-gray-700 font-medium text-sm">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {field.type === 'textarea' && (
                <textarea
                  id={field.id}
                  rows={4}
                  required={field.required}
                  placeholder={field.placeholder || ''}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
              )}

              {(field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'number') && (
                <Input
                  id={field.id}
                  type={field.type === 'phone' ? 'tel' : field.type}
                  required={field.required}
                  placeholder={field.placeholder || ''}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="border-gray-300"
                />
              )}

              {field.type === 'select' && field.options && (
                <select
                  id={field.id}
                  required={field.required}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent"
                >
                  <option value="">{field.placeholder || 'Seleccionar...'}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.type === 'radio' && field.options && (
                <div className="space-y-2">
                  {field.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="radio"
                        name={field.id}
                        value={opt}
                        required={field.required}
                        checked={formValues[field.id] === opt}
                        onChange={() => handleChange(field.id, opt)}
                        className="accent-blue-600"
                        style={{ accentColor: primaryColor }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    id={field.id}
                    checked={!!formValues[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.checked)}
                    style={{ accentColor: primaryColor }}
                  />
                  {field.placeholder || field.label}
                </label>
              )}
            </div>
          ))}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 font-semibold text-white"
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enviando...</>
            ) : 'Enviar'}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">Con tecnología de Khesed-tek</p>
      </div>
    </div>
  )
}
