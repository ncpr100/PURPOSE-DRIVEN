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
import { toast } from 'react-hot-toast'

// Import extracted modules to reduce bundle size
import { SMART_TEMPLATES, PRESET_FIELDS } from './form-templates'
import { getPresetFieldIcon, getTemplateIcon } from './form-icons'
import type { FormConfig, QRConfig, FormField } from './form-types'
import QRCustomizationPanel from './qr-customization-panel'
import { generateAdvancedQR, uploadImage } from './qr-generator'

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
  Archive,
  X
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
    
    // Submit Button Defaults
    submitButtonText: 'Enviar Formulario',
    submitButtonColor: '#2563eb',
    submitButtonTextColor: '#ffffff',
    
    // Church Branding Defaults
    primaryColor: '#2563eb',        // Blue
    secondaryColor: '#10b981',      // Green
    headerTextColor: '#1f2937',     // Dark gray
    bodyTextColor: '#4b5563',       // Medium gray
    fontFamily: 'Inter, sans-serif',
    formBackgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    inputBorderColor: '#d1d5db',
    inputFocusColor: '#2563eb'
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
  // 🎨 ADVANCED QR GENERATION (using modular function)
  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      const url = buildFormUrl()
      const qrDataURL = await generateAdvancedQR(url, qrConfig)
      setQRCodeUrl(qrDataURL)
      toast.success('QR generado exitosamente con personalización avanzada')
    } catch (error) {
      console.error('QR generation failed:', error)
      toast.error('Error generando QR')
    } finally {
      setIsGenerating(false)
    }
  }

  // 📤 HANDLE IMAGE UPLOADS (using modular function)
  const handleImageUpload = async (file: File, type: 'form-background' | 'qr-logo' | 'qr-background') => {
    try {
      const url = await uploadImage(file, type)
      
      // Update appropriate config
      if (type === 'qr-logo') {
        setQRConfig(prev => ({ ...prev, logoImage: url }))
        toast.success('Logo del QR subido exitosamente')
      } else if (type === 'qr-background') {
        setQRConfig(prev => ({ ...prev, backgroundImage: url, useBackgroundImage: true }))
        toast.success('Fondo del QR subido exitosamente')
      } else {
        setFormConfig(prev => ({ ...prev, backgroundImage: url }))
        toast.success('Fondo del formulario subido exitosamente')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al subir la imagen')
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
            bgColor: formConfig.formBackgroundColor || '#ffffff',
            textColor: formConfig.bodyTextColor || '#000000',
            fontFamily: formConfig.fontFamily || 'Inter, sans-serif',
            bgImage: formConfig.backgroundImage || null,
            submitButtonText: formConfig.submitButtonText,
            submitButtonColor: formConfig.submitButtonColor,
            submitButtonTextColor: formConfig.submitButtonTextColor,
            // Church Branding
            churchLogo: formConfig.churchLogo,
            primaryColor: formConfig.primaryColor,
            secondaryColor: formConfig.secondaryColor,
            headerTextColor: formConfig.headerTextColor,
            bodyTextColor: formConfig.bodyTextColor,
            borderColor: formConfig.borderColor,
            inputBorderColor: formConfig.inputBorderColor,
            inputFocusColor: formConfig.inputFocusColor
          },
          qrConfig: {
            // 🎨 ALL ADVANCED QR CUSTOMIZATION FIELDS
            size: qrConfig.size,
            margin: qrConfig.margin,
            backgroundColor: qrConfig.backgroundColor,
            foregroundColor: qrConfig.foregroundColor,
            dotType: qrConfig.dotType,
            cornerType: qrConfig.cornerType,
            useGradient: qrConfig.useGradient,
            gradientType: qrConfig.gradientType,
            gradientColors: qrConfig.gradientColors,
            gradientAngle: qrConfig.gradientAngle,
            useBackgroundImage: qrConfig.useBackgroundImage,
            backgroundImage: qrConfig.backgroundImage,
            backgroundOpacity: qrConfig.backgroundOpacity,
            logo: qrConfig.logoImage || null,
            logoImage: qrConfig.logoImage,
            logoSize: qrConfig.logoSize,
            logoOpacity: qrConfig.logoOpacity,
            logoMargin: qrConfig.logoMargin,
            logoShape: qrConfig.logoShape,
            logoBackgroundColor: qrConfig.logoBackgroundColor,
            logoBackgroundOpacity: qrConfig.logoBackgroundOpacity,
            eyeColor: qrConfig.eyeColor,
            eyeBorderColor: qrConfig.eyeBorderColor,
            eyeShape: qrConfig.eyeShape
          }
        }),
      })

      if (response.ok) {
        const savedForm = await response.json()
        setCurrentFormSlug(savedForm.form.slug)
        setSavedForms(prev => [savedForm.form, ...prev])
        clearAutoSave()
        toast.success('✅ Formulario guardado con personalización completa de iglesia')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save form')
      }
    } catch (error: any) {
      console.error('❌ Save error:', error)
      toast.error(error.message || 'Error guardando formulario')
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

                {/* 🎨 CHURCH BRANDING & PERSONALIZATION */}
                <div className="space-y-3 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                  <h4 className="font-semibold flex items-center gap-2 text-blue-900">
                    <Palette className="h-5 w-5 text-blue-600" />
                    Personalización de Marca de la Iglesia
                  </h4>
                  
                  {/* Church Logo Upload */}
                  <div className="space-y-2">
                    <Label className="font-medium">Logo de la Iglesia</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center bg-white">
                      <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-1" />
                      <Label htmlFor="church-logo-upload" className="cursor-pointer">
                        <div className="text-xs text-gray-600 mb-1">
                          {formConfig.churchLogo ? 'Logo cargado' : 'Subir logo de la iglesia'}
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-3 w-3 mr-1" />
                          {formConfig.churchLogo ? 'Cambiar' : 'Subir'}
                        </Button>
                      </Label>
                      <input
                        id="church-logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            uploadImage(file, 'form-background').then(url => {
                              updateFormConfig(prev => ({ ...prev, churchLogo: url }))
                              toast.success('Logo de iglesia subido')
                            }).catch(err => toast.error(err.message))
                          }
                        }}
                      />
                      {formConfig.churchLogo && (
                        <div className="mt-2">
                          <img src={formConfig.churchLogo} alt="Logo" className="max-w-[80px] mx-auto rounded" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => updateFormConfig(prev => ({ ...prev, churchLogo: undefined }))}
                            className="mt-1 text-red-600 text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brand Colors */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium">Color Primario</Label>
                      <Input
                        type="color"
                        value={formConfig.primaryColor || '#2563eb'}
                        onChange={(e) => updateFormConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Color Secundario</Label>
                      <Input
                        type="color"
                        value={formConfig.secondaryColor || '#10b981'}
                        onChange={(e) => updateFormConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium">Color Título</Label>
                      <Input
                        type="color"
                        value={formConfig.headerTextColor || '#1f2937'}
                        onChange={(e) => updateFormConfig(prev => ({ ...prev, headerTextColor: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Color Texto</Label>
                      <Input
                        type="color"
                        value={formConfig.bodyTextColor || '#4b5563'}
                        onChange={(e) => updateFormConfig(prev => ({ ...prev, bodyTextColor: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <Label className="text-xs font-medium">Fuente</Label>
                    <Select
                      value={formConfig.fontFamily || 'Inter, sans-serif'}
                      onValueChange={(value) => updateFormConfig(prev => ({ ...prev, fontFamily: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter, sans-serif">Inter (Moderna)</SelectItem>
                        <SelectItem value="Georgia, serif">Georgia (Clásica)</SelectItem>
                        <SelectItem value="Arial, sans-serif">Arial (Simple)</SelectItem>
                        <SelectItem value="'Times New Roman', serif">Times New Roman (Tradicional)</SelectItem>
                        <SelectItem value="'Courier New', monospace">Courier (Monoespaciada)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Form Styling */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium">Fondo Formulario</Label>
                      <Input
                        type="color"
                        value={formConfig.formBackgroundColor || '#ffffff'}
                        onChange={(e) => updateFormConfig(prev => ({ ...prev, formBackgroundColor: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Color Borde</Label>
                      <Input
                        type="color"
                        value={formConfig.borderColor || '#e5e7eb'}
                        onChange={(e) => updateFormConfig(prev => ({ ...prev, borderColor: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* 🎨 FORM BACKGROUND IMAGE */}
                <div className="space-y-3 p-4 border-2 border-dashed border-purple-300 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-purple-600" />
                    Imagen de Fondo del Formulario
                  </h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <ImageIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <Label htmlFor="form-background-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600 mb-2">
                        {formConfig.backgroundImage ? 'Fondo cargado - Haz clic para cambiar' : 'Subir imagen de fondo para el formulario'}
                      </div>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        {formConfig.backgroundImage ? 'Cambiar Fondo' : 'Subir Fondo'}
                      </Button>
                    </Label>
                    <input
                      id="form-background-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, 'form-background')
                      }}
                    />
                    {formConfig.backgroundImage && (
                      <div className="mt-3">
                        <img src={formConfig.backgroundImage} alt="Fondo" className="max-w-[150px] mx-auto rounded" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateFormConfig(prev => ({ ...prev, backgroundImage: undefined }))}
                          className="mt-2 text-red-600"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Eliminar Fondo
                        </Button>
                      </div>
                    )}
                  </div>
                  <Alert className="border-purple-200 bg-purple-50">
                    <Palette className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-800 text-xs">
                      La imagen de fondo se mostrará detrás del formulario con opacidad reducida para mejor legibilidad.
                    </AlertDescription>
                  </Alert>
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
                <div 
                  className="p-6 rounded-lg relative overflow-hidden"
                  style={{
                    backgroundColor: formConfig.backgroundImage ? 'transparent' : (formConfig.formBackgroundColor || '#f9fafb'),
                    backgroundImage: formConfig.backgroundImage ? `url(${formConfig.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderColor: formConfig.borderColor || '#e5e7eb',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    fontFamily: formConfig.fontFamily || 'Inter, sans-serif'
                  }}
                >
                  {/* Church Logo */}
                  {formConfig.churchLogo && (
                    <div className="flex justify-center mb-4">
                      <img src={formConfig.churchLogo} alt="Church Logo" className="h-16 object-contain" />
                    </div>
                  )}
                  
                  {/* Background overlay for better readability */}
                  {formConfig.backgroundImage && (
                    <div className="absolute inset-0 bg-white/80 -z-10" />
                  )}
                  
                  <div className="relative z-10">
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ color: formConfig.headerTextColor || '#1f2937' }}
                    >
                      {formConfig.title}
                    </h3>
                    {formConfig.description && (
                      <p 
                        className="mb-4"
                        style={{ color: formConfig.bodyTextColor || '#4b5563' }}
                      >
                        {formConfig.description}
                      </p>
                    )}
                    
                    <div className="space-y-4">
                      {formConfig.fields.map((field) => (
                      <div key={field.id}>
                        <label 
                          className="block text-sm font-medium mb-1"
                          style={{ color: formConfig.bodyTextColor || '#4b5563' }}
                        >
                          {field.label}
                          {field.required && <span style={{ color: formConfig.primaryColor || '#ef4444' }} className="ml-1">*</span>}
                        </label>
                        
                        {field.type === 'textarea' ? (
                          <textarea 
                            className="w-full p-2 rounded" 
                            style={{
                              borderColor: formConfig.inputBorderColor || '#d1d5db',
                              borderWidth: '1px',
                              borderStyle: 'solid'
                            }}
                            rows={3}
                            disabled
                          />
                        ) : field.type === 'select' ? (
                          <select 
                            className="w-full p-2 rounded" 
                            style={{
                              borderColor: formConfig.inputBorderColor || '#d1d5db',
                              borderWidth: '1px',
                              borderStyle: 'solid'
                            }}
                            disabled
                          >
                            <option>Seleccionar...</option>
                            {field.options?.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : field.type === 'checkbox' ? (
                          <div className="flex items-center">
                            <input type="checkbox" className="mr-2" disabled />
                            <span className="text-sm" style={{ color: formConfig.bodyTextColor || '#4b5563' }}>{field.label}</span>
                          </div>
                        ) : field.type === 'radio' && field.options ? (
                          <div className="space-y-2">
                            {field.options.map((option, index) => (
                              <div key={index} className="flex items-center">
                                <input type="radio" name={`field-${field.id}`} className="mr-2" disabled />
                                <span className="text-sm" style={{ color: formConfig.bodyTextColor || '#4b5563' }}>{option}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <input 
                            type={field.type} 
                            className="w-full p-2 rounded" 
                            style={{
                              borderColor: formConfig.inputBorderColor || '#d1d5db',
                              borderWidth: '1px',
                              borderStyle: 'solid'
                            }}
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
                </div>
              </CardContent>
            </Card>

            {/* 🎨 ADVANCED QR CODE CUSTOMIZATION (Modular Component) */}
            <QRCustomizationPanel
              qrConfig={qrConfig}
              setQRConfig={setQRConfig}
              qrCodeUrl={qrCodeUrl}
              isGenerating={isGenerating}
              onGenerate={generateQRCode}
              onCopyUrl={copyFormUrl}
              onImageUpload={handleImageUpload}
              formUrl={buildFormUrl()}
              formTitle={formConfig.title}
            />

            {/* 💾 SAVE & DRAFT MANAGEMENT */}
            <Card className="border-2 border-green-500">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Save className="h-5 w-5" />
                  Guardar y Gestionar Borradores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <div className="grid grid-cols-2 gap-3">
                  {hasLocalDraft && (
                    <Button 
                      onClick={restoreFromLocalStorage} 
                      variant="outline" 
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
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
                    className="border-orange-500 text-orange-600 hover:bg-range-50"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Guardar Borrador
                  </Button>
                </div>

                <Button 
                  onClick={saveForm} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Formulario Completo
                </Button>

                <Alert className="border-green-200 bg-green-50">
                  <Settings className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 text-xs">
                    <strong>Guardar Formulario Completo</strong> guarda en la base de datos con todas las personalizaciones avanzadas (QR, imágenes, colores).
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