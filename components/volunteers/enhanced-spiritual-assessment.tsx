'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  SPIRITUAL_GIFT_CATEGORIES,
  MINISTRY_PASSIONS,
  EXPERIENCE_LEVELS,
  type SpiritualGiftCategory,
  type SpiritualGiftSubcategory,
  type MinistryPassion,
  type SpiritualAssessmentData
} from '@/lib/spiritual-gifts-config'
import { 
  Sparkles, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnhancedSpiritualAssessmentProps {
  memberId?: string
  initialData?: SpiritualAssessmentData
  onSave?: (data: SpiritualAssessmentData) => Promise<void>
  onCancel?: () => void
  readOnly?: boolean
  showHeader?: boolean
  className?: string
}

interface GiftSelection {
  subcategoryId: string
  type: 'primary' | 'secondary'
}

export function EnhancedSpiritualAssessment({
  memberId,
  initialData,
  onSave,
  onCancel,
  readOnly = false,
  showHeader = true,
  className
}: EnhancedSpiritualAssessmentProps) {
  // State management
  const [giftSelections, setGiftSelections] = useState<GiftSelection[]>([])
  const [ministryPassions, setMinistryPassions] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState<string>('')
  const [spiritualCalling, setSpiritualCalling] = useState('')
  const [motivation, setMotivation] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Initialize from existing data
  useEffect(() => {
    if (initialData) {
      setGiftSelections(initialData.giftSelections || [])
      setMinistryPassions(initialData.ministryPassions || [])
      setExperienceLevel(initialData.experienceLevel || '')
      setSpiritualCalling(initialData.spiritualCalling || '')
      setMotivation(initialData.motivation || '')
      
      // Expand categories with selections
      const categoriesWithSelections = initialData.giftSelections
        ?.map(sel => {
          const category = SPIRITUAL_GIFT_CATEGORIES.find(cat =>
            cat.subcategories.some(sub => sub.id === sel.subcategoryId)
          )
          return category?.id
        })
        .filter((id): id is string => id !== undefined) || []
      
      setExpandedCategories(Array.from(new Set(categoriesWithSelections)))
    }
  }, [initialData])

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Handle gift selection (primary/secondary/none)
  const handleGiftSelection = (subcategoryId: string, type: 'primary' | 'secondary' | 'none') => {
    setGiftSelections(prev => {
      // Remove existing selection for this subcategory
      const filtered = prev.filter(sel => sel.subcategoryId !== subcategoryId)
      
      // Add new selection if not 'none'
      if (type !== 'none') {
        return [...filtered, { subcategoryId, type }]
      }
      
      return filtered
    })
  }

  // Get current selection for a subcategory
  const getGiftSelectionType = (subcategoryId: string): 'primary' | 'secondary' | 'none' => {
    const selection = giftSelections.find(sel => sel.subcategoryId === subcategoryId)
    return selection?.type || 'none'
  }

  // Handle ministry passion toggle
  const handlePassionToggle = (passionId: string) => {
    setMinistryPassions(prev =>
      prev.includes(passionId)
        ? prev.filter(id => id !== passionId)
        : [...prev, passionId]
    )
  }

  // Calculate completion percentage
  const calculateCompletion = (): number => {
    let completed = 0
    let total = 5 // 5 sections: gifts, passions, experience, calling, motivation

    // Check if at least one gift is selected
    if (giftSelections.length > 0) completed++
    
    // Check if at least one passion is selected
    if (ministryPassions.length > 0) completed++
    
    // Check experience level
    if (experienceLevel) completed++
    
    // Check spiritual calling (optional but recommended)
    if (spiritualCalling.trim()) completed++
    
    // Check motivation (optional but recommended)
    if (motivation.trim()) completed++

    return Math.round((completed / total) * 100)
  }

  // Validate before save
  const validateAssessment = (): { valid: boolean; message?: string } => {
    if (giftSelections.length === 0) {
      return { valid: false, message: 'Por favor selecciona al menos un don espiritual' }
    }

    if (ministryPassions.length === 0) {
      return { valid: false, message: 'Por favor selecciona al menos una pasión ministerial' }
    }

    if (!experienceLevel) {
      return { valid: false, message: 'Por favor selecciona tu nivel de experiencia' }
    }

    if (!spiritualCalling.trim()) {
      return { valid: false, message: 'Por favor describe tu llamado espiritual' }
    }

    if (!motivation.trim()) {
      return { valid: false, message: 'Por favor describe tu motivación para servir' }
    }

    return { valid: true }
  }

  // Handle save
  const handleSave = async () => {
    setSaveError(null)
    setSaveSuccess(false)

    const validation = validateAssessment()
    if (!validation.valid) {
      setSaveError(validation.message || 'Por favor completa todos los campos requeridos')
      return
    }

    const assessmentData: SpiritualAssessmentData = {
      giftSelections,
      ministryPassions,
      experienceLevel,
      spiritualCalling,
      motivation,
      completedAt: new Date().toISOString()
    }

    setIsSaving(true)

    try {
      if (onSave) {
        await onSave(assessmentData)
        setSaveSuccess(true)
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        console.log('Assessment data:', assessmentData)
        setSaveSuccess(true)
      }
    } catch (error) {
      console.error('Error saving assessment:', error)
      setSaveError(error instanceof Error ? error.message : 'Error al guardar la evaluación')
    } finally {
      setIsSaving(false)
    }
  }

  const completion = calculateCompletion()
  const primaryGifts = giftSelections.filter(sel => sel.type === 'primary')
  const secondaryGifts = giftSelections.filter(sel => sel.type === 'secondary')

  return (
    <div className={cn('w-full max-w-6xl mx-auto', className)}>
      {/* Header Section */}
      {showHeader && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Evaluación de Dones Espirituales</h2>
              <p className="text-muted-foreground mt-1">
                Descubre tus dones y encuentra tu lugar en el ministerio
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso de Evaluación</span>
              <span className="font-semibold">{completion}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          {/* Status Messages */}
          {saveSuccess && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  ¡Evaluación Guardada!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Tu evaluación de dones espirituales se ha guardado correctamente.
                </p>
              </div>
            </div>
          )}

          {saveError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{saveError}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dones Primarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{primaryGifts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dones Secundarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{secondaryGifts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pasiones Ministeriales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ministryPassions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nivel Experiencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {experienceLevel ? EXPERIENCE_LEVELS.find(e => e.id === experienceLevel)?.name : '-'}
            </div>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-[800px] pr-4">
        <div className="space-y-6">
          {/* Section 1: Spiritual Gifts (8 Categories) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Dones Espirituales
                <Badge variant="secondary" className="ml-auto">
                  {giftSelections.length} seleccionados
                </Badge>
              </CardTitle>
              <CardDescription>
                Selecciona <strong>Promete</strong> para dones primarios o <strong>Secundario</strong> para
                dones de apoyo. Puedes seleccionar múltiples dones en diferentes categorías.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {SPIRITUAL_GIFT_CATEGORIES.map((category) => {
                const isExpanded = expandedCategories.includes(category.id)
                const categorySelections = giftSelections.filter(sel =>
                  category.subcategories.some(sub => sub.id === sel.subcategoryId)
                )

                return (
                  <div key={category.id} className="space-y-3">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      disabled={readOnly}
                      className={cn(
                        'w-full p-4 rounded-lg border-2 transition-all',
                        'flex items-center justify-between',
                        'hover:shadow-md disabled:cursor-not-allowed',
                        isExpanded ? 'border-primary bg-primary/5' : 'border-border'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
                            `bg-gradient-to-br ${category.color}`
                          )}
                        >
                          {category.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {categorySelections.length > 0 && (
                          <Badge variant="default">
                            {categorySelections.length}
                          </Badge>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </button>

                    {/* Category Subcategories */}
                    {isExpanded && (
                      <div className="pl-4 space-y-3 animate-in slide-in-from-top-2">
                        {category.subcategories.map((subcategory) => {
                          const selectionType = getGiftSelectionType(subcategory.id)

                          return (
                            <div
                              key={subcategory.id}
                              className={cn(
                                'p-4 rounded-lg border-2 transition-all',
                                selectionType === 'primary' && 'border-primary bg-primary/5',
                                selectionType === 'secondary' && 'border-secondary bg-secondary/5',
                                selectionType === 'none' && 'border-border'
                              )}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-medium mb-1">{subcategory.name}</h4>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {subcategory.description}
                                  </p>
                                  
                                  {/* Related Ministries */}
                                  {subcategory.relatedMinistries.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {subcategory.relatedMinistries.map((ministry) => (
                                        <Badge key={ministry} variant="outline" className="text-xs">
                                          {ministry}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Selection Radio Group */}
                                {!readOnly && (
                                  <RadioGroup
                                    value={selectionType}
                                    onValueChange={(value) =>
                                      handleGiftSelection(
                                        subcategory.id,
                                        value as 'primary' | 'secondary' | 'none'
                                      )
                                    }
                                    className="flex flex-col gap-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="primary" id={`${subcategory.id}-primary`} />
                                      <Label
                                        htmlFor={`${subcategory.id}-primary`}
                                        className="text-sm font-medium cursor-pointer"
                                      >
                                        Promete
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="secondary"
                                        id={`${subcategory.id}-secondary`}
                                      />
                                      <Label
                                        htmlFor={`${subcategory.id}-secondary`}
                                        className="text-sm cursor-pointer"
                                      >
                                        Secundario
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="none" id={`${subcategory.id}-none`} />
                                      <Label
                                        htmlFor={`${subcategory.id}-none`}
                                        className="text-sm text-muted-foreground cursor-pointer"
                                      >
                                        Ninguno
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                )}

                                {readOnly && selectionType !== 'none' && (
                                  <Badge
                                    variant={selectionType === 'primary' ? 'default' : 'secondary'}
                                  >
                                    {selectionType === 'primary' ? 'Promete' : 'Secundario'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Section 2: Ministry Passions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pasiones Ministeriales
                <Badge variant="secondary" className="ml-auto">
                  {ministryPassions.length} seleccionadas
                </Badge>
              </CardTitle>
              <CardDescription>
                ¿Qué áreas del ministerio te apasionan? Selecciona todas las que apliquen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MINISTRY_PASSIONS.map((passion) => (
                  <div
                    key={passion.id}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all cursor-pointer',
                      ministryPassions.includes(passion.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50',
                      readOnly && 'cursor-default'
                    )}
                    onClick={() => !readOnly && handlePassionToggle(passion.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={ministryPassions.includes(passion.id)}
                        onCheckedChange={() => !readOnly && handlePassionToggle(passion.id)}
                        disabled={readOnly}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label className="font-medium cursor-pointer">{passion.name}</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {passion.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Experience Level */}
          <Card>
            <CardHeader>
              <CardTitle>Nivel de Experiencia en Ministerio</CardTitle>
              <CardDescription>
                ¿Cuánta experiencia tienes sirviendo en ministerios cristianos?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={experienceLevel}
                onValueChange={setExperienceLevel}
                disabled={readOnly}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu nivel de experiencia" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{level.name}</span>
                        <span className="text-sm text-muted-foreground">{level.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Section 4: Spiritual Calling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Llamado Espiritual
                <span className="text-red-500">*</span>
              </CardTitle>
              <CardDescription>
                Describe brevemente lo que sientes que Dios te está llamando a hacer. Esto puede ser
                general o específico.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={spiritualCalling}
                onChange={(e) => setSpiritualCalling(e.target.value)}
                disabled={readOnly}
                placeholder="Ej: Siento un llamado a trabajar con jóvenes, enseñar la Palabra, servir a los necesitados..."
                className="min-h-[100px] resize-none"
                maxLength={500}
                required
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">
                  {spiritualCalling.length}/500 caracteres
                </span>
                {!spiritualCalling.trim() && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Motivation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Motivación para Servir
                <span className="text-red-500">*</span>
              </CardTitle>
              <CardDescription>
                ¿Qué te motiva a servir en la iglesia? ¿Qué esperas lograr o aprender?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                disabled={readOnly}
                placeholder="Ej: Quiero usar mis dones para glorificar a Dios, crecer espiritualmente, impactar vidas..."
                className="min-h-[100px] resize-none"
                maxLength={500}
                required
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">
                  {motivation.length}/500 caracteres
                </span>
                {!motivation.trim() && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {!readOnly && (
            <div className="flex items-center justify-end gap-4 pt-4 pb-8">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                  Cancelar
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving || completion < 60}
                className="min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Evaluación
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Completion Info */}
          {!readOnly && completion < 60 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Completa al menos el 60% de la evaluación para poder guardarla. Necesitas
                  seleccionar dones espirituales, pasiones ministeriales y nivel de experiencia.
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
