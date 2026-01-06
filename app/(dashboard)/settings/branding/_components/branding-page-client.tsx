'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Palette, Save, RotateCcw, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ChurchBrandColors {
  prayerRequest: string
  visitorFollowup: string
  socialMedia: string
  events: string
  primary: string
  secondary: string
}

const DEFAULT_COLORS: ChurchBrandColors = {
  prayerRequest: '#8B5CF6',    // Purple-500 (platform stats)
  visitorFollowup: '#3B82F6',  // Blue-500 (platform stats)
  socialMedia: '#10B981',      // Green-500 (platform stats)
  events: '#F59E0B',           // Orange-500 (platform stats)
  primary: '#3B82F6',          // Blue-500
  secondary: '#10B981'         // Green-500
}

const COLOR_DESCRIPTIONS = {
  prayerRequest: {
    label: 'Solicitudes de Oración',
    description: 'Color para plantillas de oración (default: azul sutil de plataforma)'
  },
  visitorFollowup: {
    label: 'Seguimiento de Visitantes',
    description: 'Color para plantillas de bienvenida (default: verde sutil de plataforma)'
  },
  socialMedia: {
    label: 'Redes Sociales',
    description: 'Color para plantillas de marketing (default: morado sutil de plataforma)'
  },
  events: {
    label: 'Eventos',
    description: 'Color para plantillas de eventos (default: naranja sutil de plataforma)'
  },
  primary: {
    label: 'Color Primario',
    description: 'Color principal de tu iglesia (default: azul sutil)'
  },
  secondary: {
    label: 'Color Secundario',
    description: 'Color secundario para acentos (default: verde sutil)'
  }
}

interface BrandingPageClientProps {
  churchId: string
}

export default function BrandingPageClient({ churchId }: BrandingPageClientProps) {
  const router = useRouter()
  const [colors, setColors] = useState<ChurchBrandColors>(DEFAULT_COLORS)
  const [originalColors, setOriginalColors] = useState<ChurchBrandColors>(DEFAULT_COLORS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch current brand colors
  useEffect(() => {
    const fetchBrandColors = async () => {
      try {
        const response = await fetch('/api/church-theme')
        if (!response.ok) throw new Error('Failed to fetch brand colors')
        
        const data = await response.json()
        const fetchedColors = data.brandColors || DEFAULT_COLORS
        
        setColors(fetchedColors)
        setOriginalColors(fetchedColors)
      } catch (error) {
        console.error('Error fetching brand colors:', error)
        toast.error('Error al cargar los colores')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrandColors()
  }, [])

  // Check for changes
  useEffect(() => {
    const changed = Object.keys(colors).some(
      (key) => colors[key as keyof ChurchBrandColors] !== originalColors[key as keyof ChurchBrandColors]
    )
    setHasChanges(changed)
  }, [colors, originalColors])

  const handleColorChange = (colorKey: keyof ChurchBrandColors, value: string) => {
    setColors((prev) => ({
      ...prev,
      [colorKey]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/church-theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandColors: colors })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save colors')
      }

      const result = await response.json()
      setOriginalColors(colors)
      setHasChanges(false)
      toast.success('✅ Colores guardados exitosamente')
    } catch (error) {
      console.error('Error saving brand colors:', error)
      toast.error('Error al guardar los colores')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setColors(originalColors)
    setHasChanges(false)
    toast('Cambios descartados', { icon: 'ℹ️' })
  }

  const handleResetToDefaults = () => {
    setColors(DEFAULT_COLORS)
    toast('Colores restablecidos a valores predeterminados', { icon: '🎨' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="-ml-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Configuración de Marca
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Personaliza los colores de tu iglesia para automatizaciones y plantillas
          </p>
        </div>

        <div className="flex gap-2">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Descartar
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {/* Color Pickers */}
      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold">Colores de Categorías</CardTitle>
          <CardDescription className="text-sm">
            Estos colores se aplicarán automáticamente a las plantillas de automatización
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Object.entries(COLOR_DESCRIPTIONS).map(([key, { label, description }]) => {
              const colorKey = key as keyof ChurchBrandColors
              const colorValue = colors[colorKey]

              return (
                <div key={key} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
                  {/* Color Preview */}
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: colorValue }}
                  />

                  {/* Color Info */}
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={key} className="text-sm font-medium text-gray-900">
                      {label}
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                  </div>

                  {/* Color Picker */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Input
                      id={key}
                      type="color"
                      value={colorValue}
                      onChange={(e) => handleColorChange(colorKey, e.target.value)}
                      className="w-14 h-9 cursor-pointer border-gray-300"
                    />
                    <Input
                      type="text"
                      value={colorValue}
                      onChange={(e) => handleColorChange(colorKey, e.target.value)}
                      className="w-24 h-9 font-mono text-xs border-gray-300"
                      placeholder="#000000"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Vista Previa
          </CardTitle>
          <CardDescription className="text-sm">
            Así se verán las plantillas con tus colores personalizados
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Prayer Request Preview */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: `${colors.prayerRequest}10`,
                borderColor: `${colors.prayerRequest}40`
              }}
            >
              <h3 className="font-medium text-sm mb-1" style={{ color: colors.prayerRequest }}>
                Solicitud de Oración
              </h3>
              <p className="text-xs text-gray-500">Ejemplo de plantilla</p>
            </div>

            {/* Visitor Followup Preview */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: `${colors.visitorFollowup}10`,
                borderColor: `${colors.visitorFollowup}40`
              }}
            >
              <h3 className="font-medium text-sm mb-1" style={{ color: colors.visitorFollowup }}>
                Seguimiento de Visitante
              </h3>
              <p className="text-xs text-gray-500">Ejemplo de plantilla</p>
            </div>

            {/* Social Media Preview */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: `${colors.socialMedia}10`,
                borderColor: `${colors.socialMedia}40`
              }}
            >
              <h3 className="font-medium text-sm mb-1" style={{ color: colors.socialMedia }}>
                Redes Sociales
              </h3>
              <p className="text-xs text-gray-500">Ejemplo de plantilla</p>
            </div>

            {/* Events Preview */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: `${colors.events}10`,
                borderColor: `${colors.events}40`
              }}
            >
              <h3 className="font-medium text-sm mb-1" style={{ color: colors.events }}>
                Eventos
              </h3>
              <p className="text-xs text-gray-500">Ejemplo de plantilla</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset to Defaults */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Restablecer Colores</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Volver a los colores predeterminados del sistema
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefaults}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RotateCcw className="h-3 w-3 mr-2" />
              Restablecer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
