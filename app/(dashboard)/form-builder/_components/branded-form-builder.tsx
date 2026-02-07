'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { toast } from 'react-hot-toast'

// Import extracted modules to reduce bundle size
import { SMART_TEMPLATES, PRESET_FIELDS } from './form-templates'
import { getPresetFieldIcon, getTemplateIcon } from './form-icons'
import type { FormConfig, QRConfig, FormField } from './form-types'

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
  ArrowLeft,
  RefreshCcw,
  Loader2,
  Settings,
  ImageIcon,
  AlertTriangle,
  Upload,
  Archive
} from 'lucide-react'

export default function BrandedFormBuilder() {
  // AUTO-SAVE STATE
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [hasLocalDraft, setHasLocalDraft] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Form Configuration
  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: 'Formulario Personalizado',
    description: 'Descripción del formulario',
    fields: [{ id: 1, label: 'Nombre Completo', type: 'text', required: true }],
    submitButtonText: 'Enviar Formulario',
    submitButtonColor: '#2563eb',
    submitButtonTextColor: '#ffffff'
  })

  // QR Configuration
  const [qrConfig, setQRConfig] = useState<QRConfig>({
    size: 300,
    margin: 4,
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    dotType: 'square',
    cornerType: 'square',
    useGradient: false,
    gradientType: 'linear',
    gradientColors: ['#000000', '#333333'],
    gradientAngle: 0,
    useBackgroundImage: false,
    backgroundOpacity: 100,
    logoSize: 20,
    logoOpacity: 100,
    logoMargin: 10,
    logoShape: 'circle',
    logoBackgroundColor: '#ffffff',
    logoBackgroundOpacity: 100,
    eyeColor: '#000000',
    eyeBorderColor: '#000000',
    eyeShape: 'square'
  })

  // UI State
  const [qrCodeUrl, setQRCodeUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedForms, setSavedForms] = useState<any[]>([])
  const [showTemplates, setShowTemplates] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [currentFormSlug, setCurrentFormSlug] = useState<string | null>(null)

  // 🚀 AUTO-SAVE FUNCTIONALITY - NEVER LOSE YOUR WORK!
  const AUTO_SAVE_KEY = 'form-builder-draft'
  
  // Save to localStorage immediately (instant backup)
  const saveToLocalStorage = useCallback((config: FormConfig, qrConfiguration: QRConfig) => {
    try {
      const draftData = {
        formConfig: config,
        qrConfig: qrConfiguration,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(draftData))
      setHasLocalDraft(true)
      console.log('💾 Auto-saved to localStorage') // DEBUG
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error)
    }
  }, [])
  
  // Restore from localStorage on page load
  const restoreFromLocalStorage = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(AUTO_SAVE_KEY)
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft)
        const savedTime = new Date(draftData.timestamp)
        const hoursAgo = (Date.now() - savedTime.getTime()) / (1000 * 60 * 60)
        
        if (hoursAgo < 24) { // Only restore if less than 24 hours old
          setFormConfig(draftData.formConfig)
          setQRConfig(draftData.qrConfig) 
          setLastSaved(savedTime)
          setHasUnsavedChanges(false)
          
          toast.success(`🔄 Borrador restaurado desde ${savedTime.toLocaleTimeString()}`)
          console.log('✅ Draft restored from localStorage') // DEBUG
          return true
        } else {
          // Clear expired draft
          localStorage.removeItem(AUTO_SAVE_KEY)
        }
      }
      return false
    } catch (error) {
      console.error('❌ Failed to restore from localStorage:', error)
      return false
    }
  }, [])
  
  // Auto-save wrapper functions
  const updateFormConfig = useCallback((updater: (prev: FormConfig) => FormConfig) => {
    const newConfig = updater(formConfig)
    setFormConfig(newConfig)
    
    // Auto-save debounced
    clearTimeout(autoSaveTimeoutRef.current)
    setHasUnsavedChanges(true)
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage(newConfig, qrConfig)
      setIsAutoSaving(false)
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    }, 2000) // 2 second delay
  }, [formConfig, qrConfig, saveToLocalStorage])
  
  const updateQRConfig = useCallback((updater: (prev: QRConfig) => QRConfig) => {
    const newConfig = updater(qrConfig)
    setQRConfig(newConfig)
    
    // Auto-save debounced
    clearTimeout(autoSaveTimeoutRef.current)
    setHasUnsavedChanges(true)
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage(formConfig, newConfig)
      setIsAutoSaving(false)
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    }, 2000) // 2 second delay
  }, [formConfig, qrConfig, saveToLocalStorage])
  
  // Clear localStorage when form is successfully saved
  const clearAutoSave = useCallback(() => {
    try {
      localStorage.removeItem(AUTO_SAVE_KEY)
      setHasUnsavedChanges(false)
      setHasLocalDraft(false)
      console.log('🗑️ Auto-save cleared after successful save') // DEBUG
    } catch (error) {
      console.error('❌ Failed to clear auto-save:', error)
    }
  }, [])
  
  // Restore draft on component mount
  useEffect(() => {
    // Check if draft exists
    const savedData = localStorage.getItem('form-builder-draft')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      const saveDate = new Date(parsed.timestamp)
      const hoursSinceLastSave = (Date.now() - saveDate.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceLastSave < 24) {
        setHasLocalDraft(true)
      } else {
        localStorage.removeItem('form-builder-draft')
        setHasLocalDraft(false)
      }
    } else {
      setHasLocalDraft(false)
    }
    
    const restored = restoreFromLocalStorage()
    if (!restored) {
      // No draft found, start fresh
      console.log('🆕 Starting with fresh form') // DEBUG
    }
  }, [restoreFromLocalStorage])
  
  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?'
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Generate QR Code
  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      const url = buildFormUrl()
      const qrDataURL = await QRCode.toDataURL(url, {
        width: qrConfig.size,
        margin: qrConfig.margin,
        color: {
          dark: qrConfig.foregroundColor,
          light: qrConfig.backgroundColor
        }
      })
      setQRCodeUrl(qrDataURL)
      toast.success('QR generado exitosamente')
    } catch (error) {
      console.error('QR generation failed:', error)
      toast.error('Error generando QR')
    } finally {
      setIsGenerating(false)
    }
  }

  // Save form function
  const saveForm = async () => {
    try {
      const response = await fetch('/api/form-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formConfig.title,
          description: formConfig.description,
          fields: formConfig.fields,
          config: {
            submitButtonText: formConfig.submitButtonText,
            submitButtonColor: formConfig.submitButtonColor,
            submitButtonTextColor: formConfig.submitButtonTextColor
          },
          qrConfig
        }),
      })

      if (response.ok) {
        const savedForm = await response.json()
        setCurrentFormSlug(savedForm.slug)
        setSavedForms(prev => [savedForm, ...prev])
        clearAutoSave() // Clear local draft after successful save
        toast.success('Formulario guardado exitosamente')
      } else {
        throw new Error('Failed to save form')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Error guardando formulario')
    }
  }

  // Helper functions
  const addField = () => {
    const newField: FormField = {
      id: Date.now(),
      label: `Campo ${formConfig.fields.length + 1}`,
      type: 'text',
      required: false
    }
    updateFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const removeField = (fieldId: number | string) => {
    updateFormConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
  }

  const updateField = (fieldId: number | string, key: string, value: any) => {
    updateFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, [key]: value } : field
      )
    }))
  }

  const buildFormUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return currentFormSlug 
      ? `${baseUrl}/form-viewer?slug=${currentFormSlug}`
      : `${baseUrl}/form-viewer?preview=true&title=${encodeURIComponent(formConfig.title)}`
  }

  const copyFormUrl = () => {
    navigator.clipboard.writeText(buildFormUrl())
    toast.success('URL copiada al portapapeles')
  }

  // Apply template
  const applyTemplate = (template: any) => {
    const templateFields = template.fields.map((field: any, index: number) => ({
      id: Date.now() + index,
      ...field
    }))
    
    updateFormConfig(prev => ({
      ...prev,
      title: template.name.trim(),
      description: template.description,
      fields: templateFields
    }))
    
    setSelectedTemplate(template.id)
    setShowTemplates(false)
    toast.success(`Plantilla "${template.name}" aplicada`)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        {!showTemplates ? (
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowTemplates(true)} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Plantillas
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Constructor de Formularios</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-xs">
                  {hasUnsavedChanges ? (
                    <>
                      <div className="flex items-center gap-1 text-orange-600">
                        <RefreshCcw className="h-3 w-3 animate-spin" />
                        <span>Guardando...</span>
                      </div>
                    </>
                  ) : lastSaved ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Save className="h-3 w-3" />
                      <span>Guardado {lastSaved.toLocaleTimeString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Save className="h-3 w-3" />
                      <span>Sin guardar</span>
                    </div>
                  )}
                  {hasLocalDraft && (
                    <div className="flex items-center gap-1 text-blue-600 ml-4">
                      <Archive className="h-3 w-3" />
                      <span>Borrador disponible</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-bold">Plantillas de Formularios</h1>
        )}
      </div>

      {showTemplates ? (
        // SMART TEMPLATES SECTION
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SMART_TEMPLATES.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-all cursor-pointer border border-gray-200">
              <CardHeader onClick={() => applyTemplate(template)} className="pb-3">
                <div className="flex items-center gap-3">
                  {getTemplateIcon(template.icon)}
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent onClick={() => applyTemplate(template)} className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>
                <div className="text-xs text-gray-500">
                  {template.fields.length} campos incluidos
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // FORM BUILDER INTERFACE
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Formulario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="formTitle">Título del Formulario</Label>
                  <Input
                    id="formTitle"
                    value={formConfig.title}
                    onChange={(e) => updateFormConfig(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nombre del formulario"
                  />
                </div>
                
                <div>
                  <Label htmlFor="formDescription">Descripción</Label>
                  <Input
                    id="formDescription"
                    value={formConfig.description || ''}
                    onChange={(e) => updateFormConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción del formulario"
                  />
                </div>

                {/* Submit Button Customization */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <h4 className="font-medium">Personalización del Botón de Envío</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label>Texto del Botón</Label>
                      <Input
                        value={formConfig.submitButtonText || 'Enviar Formulario'}
                        onChange={(e) => updateFormConfig(prev => ({ ...prev, submitButtonText: e.target.value }))}
                        placeholder="Enviar Formulario"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Color de Fondo</Label>
                        <Input
                          type="color"
                          value={formConfig.submitButtonColor || '#2563eb'}
                          onChange={(e) => updateFormConfig(prev => ({ ...prev, submitButtonColor: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Color del Texto</Label>
                        <Input
                          type="color"
                          value={formConfig.submitButtonTextColor || '#ffffff'}
                          onChange={(e) => updateFormConfig(prev => ({ ...prev, submitButtonTextColor: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Campos del Formulario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formConfig.fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Campo {index + 1}</span>
                        <Button 
                          onClick={() => removeField(field.id)} 
                          variant="ghost" 
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Etiqueta</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(field.id, 'label', e.target.value)}
                            placeholder="Nombre del campo"
                          />
                        </div>
                        <div>
                          <Label>Tipo</Label>
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
                              <SelectItem value="tel">Teléfono</SelectItem>
                              <SelectItem value="textarea">Área de Texto</SelectItem>
                              <SelectItem value="select">Lista Desplegable</SelectItem>
                              <SelectItem value="checkbox">Casilla</SelectItem>
                              <SelectItem value="radio">Botón de Radio</SelectItem>
                              <SelectItem value="date">Fecha</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${field.id}`}
                          checked={field.required}
                          onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`required-${field.id}`} className="text-sm">
                          Campo obligatorio
                        </label>
                      </div>

                      {(field.type === 'select' || field.type === 'radio') && (
                        <div className="mt-3">
                          <Label>Opciones</Label>
                          <div className="space-y-2">
                            {field.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(field.options || [])]
                                    newOptions[optIndex] = e.target.value
                                    updateField(field.id, 'options', newOptions)
                                  }}
                                  placeholder={`Opción ${optIndex + 1}`}
                                />
                                <Button 
                                  onClick={() => {
                                    const newOptions = field.options?.filter((_, i) => i !== optIndex) || []
                                    updateField(field.id, 'options', newOptions)
                                  }}
                                  variant="ghost" 
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button 
                              onClick={() => {
                                const newOptions = [...(field.options || []), `Opción ${(field.options?.length || 0) + 1}`]
                                updateField(field.id, 'options', newOptions)
                              }}
                              variant="outline" 
                              size="sm"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar Opción
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <Button onClick={addField} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Campo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & QR Generation */}
          <div className="space-y-6">
            {/* Form Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa del Formulario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 border rounded-lg bg-gray-50">
                  <h3 className="text-xl font-bold mb-2">{formConfig.title}</h3>
                  {formConfig.description && (
                    <p className="text-gray-600 mb-4">{formConfig.description}</p>
                  )}
                  
                  <div className="space-y-4">
                    {formConfig.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium mb-1">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {field.type === 'textarea' ? (
                          <textarea 
                            className="w-full p-2 border rounded" 
                            rows={3}
                            disabled
                          />
                        ) : field.type === 'select' ? (
                          <select className="w-full p-2 border rounded" disabled>
                            <option>Seleccionar...</option>
                            {field.options?.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : field.type === 'checkbox' ? (
                          <div className="flex items-center">
                            <input type="checkbox" className="mr-2" disabled />
                            <span className="text-sm">{field.label}</span>
                          </div>
                        ) : field.type === 'radio' && field.options ? (
                          <div className="space-y-2">
                            {field.options.map((option, index) => (
                              <div key={index} className="flex items-center">
                                <input type="radio" name={`field-${field.id}`} className="mr-2" disabled />
                                <span className="text-sm">{option}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <input 
                            type={field.type} 
                            className="w-full p-2 border rounded" 
                            disabled
                          />
                        )}
                      </div>
                    ))}
                    
                    <button 
                      className="px-6 py-2 rounded font-medium"
                      style={{ 
                        backgroundColor: formConfig.submitButtonColor || '#2563eb',
                        color: formConfig.submitButtonTextColor || '#ffffff'
                      }}
                      disabled
                    >
                      {formConfig.submitButtonText || 'Enviar Formulario'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Código QR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  <Button onClick={generateQRCode} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <QrCode className="h-4 w-4 mr-2" />}
                    Generar QR
                  </Button>
                  <Button onClick={copyFormUrl} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar URL
                  </Button>
                  {hasLocalDraft && (
                    <Button onClick={restoreFromLocalStorage} variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Cargar Borrador
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      saveToLocalStorage(formConfig, qrConfig)
                      toast.success('Borrador guardado localmente')
                    }} 
                    variant="outline" 
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Guardar Borrador
                  </Button>
                  <Button onClick={saveForm} variant="outline" className="col-span-2">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Formulario
                  </Button>
                </div>

                {qrCodeUrl && (
                  <div className="flex justify-center">
                    <img src={qrCodeUrl} alt="QR Code" className="border rounded-lg shadow-sm max-w-[200px]" />
                  </div>
                )}

                <Alert className="mt-4">
                  <AlertDescription>
                    <strong>URL del formulario:</strong><br />
                    <code className="text-xs break-all">{buildFormUrl()}</code>
                  </AlertDescription>
                </Alert>
                
                {hasLocalDraft && (
                  <Alert className="mt-2 border-blue-500 bg-blue-50">
                    <Archive className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Borrador disponible:</strong> Tienes un borrador guardado. 
                      Usa "Cargar Borrador" para restaurar tu trabajo anterior.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Alert className="mt-2 border-green-500 bg-green-50">
                  <Save className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>🚀 No más trabajo perdido:</strong> Tus cambios se guardan automáticamente. 
                    Usa "Guardar Borrador" para crear copias de seguridad manuales.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}