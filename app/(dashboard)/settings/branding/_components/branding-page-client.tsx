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
  // Category background colors
  prayerRequest: string
  visitorFollowup: string
  socialMedia: string
  events: string
  // Category text / icon accent colors
  prayerRequestText: string
  visitorFollowupText: string
  socialMediaText: string
  eventsText: string
  // Badge colors
  badgeBackground: string
  badgeText: string
  // Button colors
  buttonBackground: string
  buttonText: string
  // System palette
  primary: string
  secondary: string
}

const DEFAULT_COLORS: ChurchBrandColors = {
  prayerRequest: '#DDD6FE',        // Purple-200 pastel
  visitorFollowup: '#DBEAFE',      // Blue-200 pastel
  socialMedia: '#D1FAE5',          // Green-200 pastel
  events: '#FED7AA',               // Orange-200 pastel
  prayerRequestText: '#7C3AED',    // Purple-700
  visitorFollowupText: '#1D4ED8',  // Blue-700
  socialMediaText: '#047857',      // Green-700
  eventsText: '#C2410C',           // Orange-700
  badgeBackground: '#EDE9FE',      // Purple-100
  badgeText: '#6D28D9',            // Purple-700
  buttonBackground: '#7C3AED',     // Purple-700
  buttonText: '#FFFFFF',           // White
  primary: '#DBEAFE',              // Blue-200 pastel
  secondary: '#D1FAE5'             // Green-200 pastel
}

const CATEGORY_COLOR_PAIRS = [
  {
    bgKey: 'prayerRequest' as keyof ChurchBrandColors,
    textKey: 'prayerRequestText' as keyof ChurchBrandColors,
    label: 'Solicitudes de Oración',
    bgDesc: 'Fondo de tarjetas de oración',
    textDesc: 'Color de texto e íconos'
  },
  {
    bgKey: 'visitorFollowup' as keyof ChurchBrandColors,
    textKey: 'visitorFollowupText' as keyof ChurchBrandColors,
    label: 'Seguimiento de Visitantes',
    bgDesc: 'Fondo de tarjetas de visitantes',
    textDesc: 'Color de texto e íconos'
  },
  {
    bgKey: 'socialMedia' as keyof ChurchBrandColors,
    textKey: 'socialMediaText' as keyof ChurchBrandColors,
    label: 'Redes Sociales',
    bgDesc: 'Fondo de tarjetas de redes sociales',
    textDesc: 'Color de texto e íconos'
  },
  {
    bgKey: 'events' as keyof ChurchBrandColors,
    textKey: 'eventsText' as keyof ChurchBrandColors,
    label: 'Eventos',
    bgDesc: 'Fondo de tarjetas de eventos',
    textDesc: 'Color de texto e íconos'
  },
]

const COLOR_DESCRIPTIONS = {
  badgeBackground: {
    label: 'Fondo de Insignias',
    description: 'Color de fondo de las insignias de categoría'
  },
  badgeText: {
    label: 'Texto de Insignias',
    description: 'Color del texto en las insignias de categoría'
  },
  buttonBackground: {
    label: 'Fondo del Botón',
    description: 'Color del botón "Usar Plantilla" y acciones principales'
  },
  buttonText: {
    label: 'Texto del Botón',
    description: 'Color del texto en los botones de acción'
  },
  primary: {
    label: 'Color Primario',
    description: 'Color principal de tu iglesia'
  },
  secondary: {
    label: 'Color Secundario',
    description: 'Color secundario para acentos'
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
      toast.success('Colores guardados exitosamente')
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
    toast('Cambios descartados')
  }

  const handleResetToDefaults = () => {
    setColors(DEFAULT_COLORS)
    toast('Colores restablecidos a valores predeterminados')
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

      {/* Section 1: Category Colors (background + text pairs) */}
      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold">Colores de Categorías</CardTitle>
          <CardDescription className="text-sm">
            Personaliza el fondo y el color de texto/íconos para cada categoría de plantilla
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {CATEGORY_COLOR_PAIRS.map(({ bgKey, textKey, label, bgDesc, textDesc }) => (
              <div key={bgKey} className="p-4 rounded-lg border border-gray-200 bg-white">
                <p className="text-sm font-semibold text-gray-800 mb-3">{label}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Background color */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: colors[bgKey] }}
                    />
                    <div className="flex-1 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">{bgDesc}</Label>
                      <div className="flex items-center gap-1 mt-1">
                        <Input
                          type="color"
                          value={colors[bgKey]}
                          onChange={(e) => handleColorChange(bgKey, e.target.value)}
                          className="w-10 h-8 cursor-pointer border-gray-300 p-0.5"
                        />
                        <Input
                          type="text"
                          value={colors[bgKey]}
                          onChange={(e) => handleColorChange(bgKey, e.target.value)}
                          className="w-24 h-8 font-mono text-xs border-gray-300"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Text / icon color */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: colors[bgKey] }}
                    >
                      <span className="text-lg font-bold" style={{ color: colors[textKey] }}>A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label className="text-xs font-medium text-gray-700">{textDesc}</Label>
                      <div className="flex items-center gap-1 mt-1">
                        <Input
                          type="color"
                          value={colors[textKey]}
                          onChange={(e) => handleColorChange(textKey, e.target.value)}
                          className="w-10 h-8 cursor-pointer border-gray-300 p-0.5"
                        />
                        <Input
                          type="text"
                          value={colors[textKey]}
                          onChange={(e) => handleColorChange(textKey, e.target.value)}
                          className="w-24 h-8 font-mono text-xs border-gray-300"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Badge & Button Colors */}
      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold">Insignias y Botones</CardTitle>
          <CardDescription className="text-sm">
            Personaliza los colores de las insignias de categoría y los botones de acción
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Badge preview row */}
            <div className="p-4 rounded-lg border border-gray-200 bg-white">
              <p className="text-xs font-medium text-gray-600 mb-3">Vista previa de insignia</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: colors.badgeBackground, color: colors.badgeText }}
                >
                  Peticiones de Oración
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: colors.badgeBackground, color: colors.badgeText }}
                >
                  Seguimiento de Visitantes
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0" style={{ backgroundColor: colors.badgeBackground }} />
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-gray-700">Fondo de Insignias</Label>
                    <div className="flex items-center gap-1 mt-1">
                      <Input type="color" value={colors.badgeBackground} onChange={(e) => handleColorChange('badgeBackground', e.target.value)} className="w-10 h-8 cursor-pointer border-gray-300 p-0.5" />
                      <Input type="text" value={colors.badgeBackground} onChange={(e) => handleColorChange('badgeBackground', e.target.value)} className="w-24 h-8 font-mono text-xs border-gray-300" placeholder="#000000" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: colors.badgeBackground }}>
                    <span className="text-xs font-bold" style={{ color: colors.badgeText }}>Ab</span>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-gray-700">Texto de Insignias</Label>
                    <div className="flex items-center gap-1 mt-1">
                      <Input type="color" value={colors.badgeText} onChange={(e) => handleColorChange('badgeText', e.target.value)} className="w-10 h-8 cursor-pointer border-gray-300 p-0.5" />
                      <Input type="text" value={colors.badgeText} onChange={(e) => handleColorChange('badgeText', e.target.value)} className="w-24 h-8 font-mono text-xs border-gray-300" placeholder="#000000" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Button preview row */}
            <div className="p-4 rounded-lg border border-gray-200 bg-white">
              <p className="text-xs font-medium text-gray-600 mb-3">Vista previa de botón</p>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium mb-3"
                style={{ backgroundColor: colors.buttonBackground, color: colors.buttonText }}
              >
                Usar Plantilla
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0" style={{ backgroundColor: colors.buttonBackground }} />
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-gray-700">Fondo del Botón</Label>
                    <div className="flex items-center gap-1 mt-1">
                      <Input type="color" value={colors.buttonBackground} onChange={(e) => handleColorChange('buttonBackground', e.target.value)} className="w-10 h-8 cursor-pointer border-gray-300 p-0.5" />
                      <Input type="text" value={colors.buttonBackground} onChange={(e) => handleColorChange('buttonBackground', e.target.value)} className="w-24 h-8 font-mono text-xs border-gray-300" placeholder="#000000" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: colors.buttonBackground }}>
                    <span className="text-xs font-bold" style={{ color: colors.buttonText }}>Ab</span>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-gray-700">Texto del Botón</Label>
                    <div className="flex items-center gap-1 mt-1">
                      <Input type="color" value={colors.buttonText} onChange={(e) => handleColorChange('buttonText', e.target.value)} className="w-10 h-8 cursor-pointer border-gray-300 p-0.5" />
                      <Input type="text" value={colors.buttonText} onChange={(e) => handleColorChange('buttonText', e.target.value)} className="w-24 h-8 font-mono text-xs border-gray-300" placeholder="#000000" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: System Palette */}
      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold">Paleta del Sistema</CardTitle>
          <CardDescription className="text-sm">
            Colores primario y secundario usados en toda la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {(['primary', 'secondary'] as (keyof ChurchBrandColors)[]).map((key) => {
              const info = COLOR_DESCRIPTIONS[key as keyof typeof COLOR_DESCRIPTIONS]
              if (!info) return null
              return (
                <div key={key} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
                  <div className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0" style={{ backgroundColor: colors[key] }} />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={key} className="text-sm font-medium text-gray-900">{info.label}</Label>
                    <p className="text-xs text-gray-500 mt-0.5">{info.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Input id={key} type="color" value={colors[key]} onChange={(e) => handleColorChange(key, e.target.value)} className="w-14 h-9 cursor-pointer border-gray-300" />
                    <Input type="text" value={colors[key]} onChange={(e) => handleColorChange(key, e.target.value)} className="w-24 h-9 font-mono text-xs border-gray-300" placeholder="#000000" />
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
                backgroundColor: colors.prayerRequest,
                borderColor: `${colors.prayerRequestText}30`
              }}
            >
              <h3 className="font-medium text-sm mb-1" style={{ color: colors.prayerRequestText }}>
                Solicitud de Oración
              </h3>
              <p className="text-xs" style={{ color: colors.prayerRequestText, opacity: 0.7 }}>Ejemplo de plantilla</p>
              <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: colors.badgeBackground, color: colors.badgeText }}>Oración</span>
            </div>

            {/* Visitor Followup Preview */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.visitorFollowup,
                borderColor: `${colors.visitorFollowupText}30`
              }}
            >
              <h3 className="font-medium text-sm mb-1" style={{ color: colors.visitorFollowupText }}>
                Seguimiento de Visitante
              </h3>
              <p className="text-xs" style={{ color: colors.visitorFollowupText, opacity: 0.7 }}>Ejemplo de plantilla</p>
              <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: colors.badgeBackground, color: colors.badgeText }}>Visitantes</span>
              <p className="text-xs text-gray-500">Ejemplo de plantilla</p>
            </div>

            {/* Social Media Preview */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.socialMedia,
                borderColor: `${colors.socialMediaText}30`
              }}
            >
              <h3 className="font-medium text-sm mb-1" style={{ color: colors.socialMediaText }}>
                Redes Sociales
              </h3>
              <p className="text-xs" style={{ color: colors.socialMediaText, opacity: 0.7 }}>Ejemplo de plantilla</p>
              <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: colors.badgeBackground, color: colors.badgeText }}>Redes</span>
            </div>

            {/* Events Preview */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.events,
                borderColor: `${colors.eventsText}30`
              }}
            >
              <h3 className="font-medium text-sm mb-1" style={{ color: colors.eventsText }}>
                Eventos
              </h3>
              <p className="text-xs" style={{ color: colors.eventsText, opacity: 0.7 }}>Ejemplo de plantilla</p>
              <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: colors.badgeBackground, color: colors.badgeText }}>Evento</span>
            </div>
          </div>
          {/* Button preview */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-600 mb-2">Vista previa del botón de acción</p>
            <button
              className="px-4 py-2 rounded-md text-sm font-medium"
              style={{ backgroundColor: colors.buttonBackground, color: colors.buttonText }}
            >
              Usar Plantilla
            </button>
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
