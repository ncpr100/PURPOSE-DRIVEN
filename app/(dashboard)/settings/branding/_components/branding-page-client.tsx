'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Palette, Save, RotateCcw, Sparkles } from 'lucide-react'
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
  prayerRequest: '#EC4899',    // Pink
  visitorFollowup: '#3B82F6',  // Blue
  socialMedia: '#8B5CF6',      // Purple
  events: '#F59E0B',           // Orange
  primary: '#8B5CF6',          // Purple
  secondary: '#3B82F6'         // Blue
}

const COLOR_DESCRIPTIONS = {
  prayerRequest: {
    label: 'Solicitudes de Oración',
    description: 'Color para plantillas de oración y ministerio espiritual'
  },
  visitorFollowup: {
    label: 'Seguimiento de Visitantes',
    description: 'Color para plantillas de bienvenida y visitantes'
  },
  socialMedia: {
    label: 'Redes Sociales',
    description: 'Color para plantillas de marketing y redes sociales'
  },
  events: {
    label: 'Eventos',
    description: 'Color para plantillas de eventos y actividades'
  },
  primary: {
    label: 'Color Primario',
    description: 'Color principal de tu iglesia (botones, encabezados)'
  },
  secondary: {
    label: 'Color Secundario',
    description: 'Color secundario para acentos y detalles'
  }
}

interface BrandingPageClientProps {
  churchId: string
}

export default function BrandingPageClient({ churchId }: BrandingPageClientProps) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="h-8 w-8 text-purple-600" />
            Configuración de Marca
          </h1>
          <p className="text-gray-600 mt-2">
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
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {/* Color Pickers */}
      <Card>
        <CardHeader>
          <CardTitle>Colores de Categorías</CardTitle>
          <CardDescription>
            Estos colores se aplicarán automáticamente a las plantillas de automatización
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(COLOR_DESCRIPTIONS).map(([key, { label, description }]) => {
            const colorKey = key as keyof ChurchBrandColors
            const colorValue = colors[colorKey]

            return (
              <div key={key} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                {/* Color Preview */}
                <div
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: colorValue }}
                />

                {/* Color Info */}
                <div className="flex-1">
                  <Label htmlFor={key} className="text-base font-semibold">
                    {label}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>

                {/* Color Picker */}
                <div className="flex items-center gap-2">
                  <Input
                    id={key}
                    type="color"
                    value={colorValue}
                    onChange={(e) => handleColorChange(colorKey, e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={colorValue}
                    onChange={(e) => handleColorChange(colorKey, e.target.value)}
                    className="w-28 font-mono text-sm"
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Vista Previa
          </CardTitle>
          <CardDescription>
            Así se verán las plantillas con tus colores personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prayer Request Preview */}
            <div
              className="p-4 rounded-lg border-2"
              style={{
                backgroundColor: `${colors.prayerRequest}15`,
                borderColor: colors.prayerRequest
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: colors.prayerRequest }}>
                Solicitud de Oración
              </h3>
              <p className="text-sm text-gray-600">Ejemplo de plantilla de oración</p>
            </div>

            {/* Visitor Followup Preview */}
            <div
              className="p-4 rounded-lg border-2"
              style={{
                backgroundColor: `${colors.visitorFollowup}15`,
                borderColor: colors.visitorFollowup
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: colors.visitorFollowup }}>
                Seguimiento de Visitante
              </h3>
              <p className="text-sm text-gray-600">Ejemplo de plantilla de bienvenida</p>
            </div>

            {/* Social Media Preview */}
            <div
              className="p-4 rounded-lg border-2"
              style={{
                backgroundColor: `${colors.socialMedia}15`,
                borderColor: colors.socialMedia
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: colors.socialMedia }}>
                Redes Sociales
              </h3>
              <p className="text-sm text-gray-600">Ejemplo de plantilla de marketing</p>
            </div>

            {/* Events Preview */}
            <div
              className="p-4 rounded-lg border-2"
              style={{
                backgroundColor: `${colors.events}15`,
                borderColor: colors.events
              }}
            >
              <h3 className="font-semibold mb-2" style={{ color: colors.events }}>
                Eventos
              </h3>
              <p className="text-sm text-gray-600">Ejemplo de plantilla de eventos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset to Defaults */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-amber-900">Restablecer Colores</h3>
              <p className="text-sm text-amber-700 mt-1">
                Volver a los colores predeterminados del sistema
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleResetToDefaults}
              className="border-amber-300 text-amber-900 hover:bg-amber-100"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restablecer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
