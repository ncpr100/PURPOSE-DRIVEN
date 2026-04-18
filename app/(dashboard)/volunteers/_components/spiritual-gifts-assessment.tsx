
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Brain, Sparkles, Heart, Users, BookOpen, Crown, Target, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useFormAnalytics } from '@/lib/form-analytics'

interface SpiritualGift {
  id: string
  name: string
  category: string
  description?: string
}

interface SpiritualGiftsAssessmentProps {
  memberId: string
  onSave?: (profile: any) => void
  onCancel?: () => void
  existingProfile?: any
}

export function SpiritualGiftsAssessment({ 
  memberId, 
  onSave, 
  onCancel, 
  existingProfile 
}: SpiritualGiftsAssessmentProps) {
  const [spiritualGifts, setSpiritualGifts] = useState<SpiritualGift[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    primaryGifts: existingProfile?.primaryGifts || [],
    secondaryGifts: existingProfile?.secondaryGifts || [],
    spiritualCalling: existingProfile?.spiritualCalling || '',
    ministryPassions: existingProfile?.ministryPassions || [],
    experienceLevel: existingProfile?.experienceLevel || 1,
    leadershipScore: existingProfile?.leadershipScore || 1,
    servingMotivation: existingProfile?.servingMotivation || '',
    previousExperience: existingProfile?.previousExperience || [],
    trainingCompleted: existingProfile?.trainingCompleted || []
  })
  // Form Analytics Tracking
  const analytics = useFormAnalytics(
    'spiritual-gifts-assessment',
    'spiritual_assessment',
    'iglesia-demo' // TODO: Get from props or context
  )

  // Calculate form completeness percentage for analytics
  const calculateFormCompleteness = () => {
    const fields = {
      primaryGifts: formData.primaryGifts.length > 0,
      ministryPassions: formData.ministryPassions.length > 0,
      spiritualCalling: !!formData.spiritualCalling,
      servingMotivation: !!formData.servingMotivation,
      experienceLevel: formData.experienceLevel > 0,
      leadershipScore: formData.leadershipScore > 0
    }
    
    const completedFields = Object.values(fields).filter(Boolean).length
    const totalFields = Object.keys(fields).length
    
    return Math.round((completedFields / totalFields) * 100)
  }
  useEffect(() => {
    // Track form start
    analytics.trackStart()
    
    // Track abandonment on page unload
    const handleBeforeUnload = () => {
      analytics.trackAbandonment()
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [analytics])

  useEffect(() => {
    fetchSpiritualGifts()
  }, [])

  const fetchSpiritualGifts = async () => {
    try {
      const response = await fetch('/api/spiritual-gifts')
      if (response.ok) {
        const data = await response.json()
        const gifts = data.gifts || []
        setSpiritualGifts(gifts)
      } else {
        toast.error('Error al cargar dones espirituales')
      }
    } catch (error) {
      toast.error('Error al cargar dones espirituales')
    } finally {
      setLoading(false)
    }
  }

  const handleGiftToggle = (giftId: string, isPrimary: boolean) => {
    if (isPrimary) {
      setFormData(prev => ({
        ...prev,
        primaryGifts: prev.primaryGifts.includes(giftId)
          ? prev.primaryGifts.filter((id: string) => id !== giftId)
          : [...prev.primaryGifts, giftId]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        secondaryGifts: prev.secondaryGifts.includes(giftId)
          ? prev.secondaryGifts.filter((id: string) => id !== giftId)
          : [...prev.secondaryGifts, giftId]
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.primaryGifts.length === 0) {
      analytics.trackError('primaryGifts', 'required_field_empty')
      toast.error('Por favor selecciona al menos un don espiritual principal')
      setSaving(false)
      return
    }

    if (formData.ministryPassions.length === 0) {
      analytics.trackError('ministryPassions', 'required_field_empty')
      toast.error('Por favor selecciona al menos una pasión ministerial')
      setSaving(false)
      return
    }
    
    setSaving(true)

    try {
      const payload = {
        memberId,
        ...formData
      }
      
      const response = await fetch('/api/member-spiritual-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Track successful form completion
        analytics.trackSubmission({
          primaryGiftsCount: formData.primaryGifts.length,
          secondaryGiftsCount: formData.secondaryGifts.length,
          ministryPassionsCount: formData.ministryPassions.length,
          experienceLevel: formData.experienceLevel,
          hasSpirituaCallingText: !!formData.spiritualCalling,
          formCompleteness: calculateFormCompleteness()
        })
        
        toast.success('Perfil espiritual guardado exitosamente')
        onSave?.(data.profile)
      } else {
        try {
          const error = await response.json()
          if (response.status === 401) {
            toast.error('Error de autenticación. Por favor, inicie sesión nuevamente.')
          } else if (response.status === 403) {
            toast.error('No tiene permisos para realizar esta acción.')
          } else {
            toast.error(error.message || `Error al guardar el perfil (${response.status})`)
          }
        } catch (parseError) {
          toast.error(`Error al guardar el perfil (Status: ${response.status})`)
        }
      }
    } catch (error) {
      toast.error('Error de red al guardar el perfil espiritual')
    } finally {
      setSaving(false)
    }
  }

  const giftsByCategory = spiritualGifts.reduce((acc, gift) => {
    if (!acc[gift.category]) {
      acc[gift.category] = []
    }
    acc[gift.category].push(gift)
    return acc
  }, {} as Record<string, SpiritualGift[]>)
  
  console.log('🏷️ GIFTS BY CATEGORY:', giftsByCategory)
  console.log('🏷️ TOTAL CATEGORIES:', Object.keys(giftsByCategory).length)
  console.log('🏷️ SPIRITUAL GIFTS COUNT:', spiritualGifts.length)

  const categoryIcons: Record<string, any> = {
    'Liderazgo': Crown,
    'Servicio': Heart,
    'Enseñanza': BookOpen,
    'Pastoral': Users,
    'Profecía': Zap,
    'Evangelismo': Target,
    'Adoración': Sparkles,
    'Administración': Brain
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--info))]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <Brain className="mx-auto h-12 w-12 text-[hsl(var(--info))] mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Evaluación de Dones Espirituales</h2>
        <p className="text-muted-foreground mt-2">
          Identifique sus dones espirituales y pasiones ministeriales
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Spiritual Gifts Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Selección de Dones Espirituales
            </CardTitle>
            <CardDescription>
              Marque sus dones primarios y secundarios por categoría
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(giftsByCategory).map(([category, gifts]) => {
              const IconComponent = categoryIcons[category] || Brain
              console.log(`🎯 RENDERING CATEGORY: ${category} with ${gifts.length} gifts`)
              return (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="flex items-center gap-2 font-medium mb-3">
                    <IconComponent className="h-4 w-4" />
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {gifts.map((gift) => {
                      const isPrimarySelected = formData.primaryGifts.includes(gift.id)
                      const isSecondarySelected = formData.secondaryGifts.includes(gift.id)
                      console.log(`🎯 RENDERING GIFT: ${gift.name} (ID: ${gift.id}) - Primary: ${isPrimarySelected}, Secondary: ${isSecondarySelected}`)
                      return (
                      <div key={gift.id} className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`primary-${gift.id}`}
                              checked={isPrimarySelected}
                              onCheckedChange={(checked) => {
                                console.log(`🎯 PRIMARY CHECKBOX CLICKED: ${gift.name} (${gift.id}) - New state: ${checked}`)
                                handleGiftToggle(gift.id, true)
                              }}
                            />
                            <label
                              htmlFor={`primary-${gift.id}`}
                              className="text-sm font-medium text-[hsl(var(--info))]"
                            >
                              Primario
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`secondary-${gift.id}`}
                              checked={isSecondarySelected}
                              onCheckedChange={(checked) => {
                                console.log(`🎯 SECONDARY CHECKBOX CLICKED: ${gift.name} (${gift.id}) - New state: ${checked}`)
                                handleGiftToggle(gift.id, false)
                              }}
                            />
                            <label
                              htmlFor={`secondary-${gift.id}`}
                              className="text-sm text-muted-foreground"
                            >
                              Secundario
                            </label>
                          </div>
                        </div>
                        <div className="ml-6">
                          <p className="font-medium text-sm">{gift.name}</p>
                          {gift.description && (
                            <p className="text-xs text-muted-foreground">{gift.description}</p>
                          )}
                        </div>
                      </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Spiritual Calling */}
        <Card>
          <CardHeader>
            <CardTitle>Llamado Espiritual</CardTitle>
            <CardDescription>
              Describa su llamado o propósito espiritual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describa cómo siente que Dios le está llamando a servir..."
              value={formData.spiritualCalling}
              onChange={(e) => setFormData(prev => ({...prev, spiritualCalling: e.target.value}))}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Ministry Passions */}
        <Card>
          <CardHeader>
            <CardTitle>Pasiones Ministeriales</CardTitle>
            <CardDescription>
              Áreas del ministerio que le apasionan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Niños y Adolescentes', 'Jóvenes', 'Adultos Jóvenes', 'Familias',
                'Adultos Mayores', 'Misiones', 'Evangelismo', 'Discipulado',
                'Adoración', 'Música', 'Oración', 'Cuidado Pastoral',
                'Administración', 'Tecnología', 'Medios', 'Hospitaliría'
              ].map((passion) => (
                <div key={passion} className="flex items-center space-x-2">
                  <Checkbox
                    id={`passion-${passion}`}
                    checked={formData.ministryPassions.includes(passion)}
                    onCheckedChange={(checked) => {
                      console.log('🎯 MINISTRY PASSION SELECTION:', { passion, checked })
                      console.log('🎯 MINISTRY PASSION - Current array:', formData.ministryPassions)
                      
                      if (checked) {
                        setFormData(prev => {
                          const newPassions = [...prev.ministryPassions, passion]
                          console.log('🎯 MINISTRY PASSION - Adding, new array:', newPassions)
                          return {
                            ...prev,
                            ministryPassions: newPassions
                          }
                        })
                      } else {
                        setFormData(prev => {
                          const newPassions = prev.ministryPassions.filter((p: string) => p !== passion)
                          console.log('🎯 MINISTRY PASSION - Removing, new array:', newPassions)
                          return {
                            ...prev,
                            ministryPassions: newPassions
                          }
                        })
                      }
                    }}
                  />
                  <label htmlFor={`passion-${passion}`} className="text-sm">
                    {passion}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience Level */}
        <Card>
          <CardHeader>
            <CardTitle>Nivel de Experiencia</CardTitle>
            <CardDescription>
              Su nivel de experiencia en el ministerio (1-10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.experienceLevel.toString()} 
              onValueChange={(value) => setFormData(prev => ({...prev, experienceLevel: parseInt(value)}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 10}, (_, i) => i + 1).map(level => (
                  <SelectItem key={level} value={level.toString()}>
                    Nivel {level} {level <= 3 ? '(Principiante)' : level <= 6 ? '(Intermedio)' : level <= 8 ? '(Avanzado)' : '(Experto)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Serving Motivation */}
        <Card>
          <CardHeader>
            <CardTitle>Motivación para Servir</CardTitle>
            <CardDescription>
              ¿Qué le motiva a servir en el ministerio?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describa qué le motiva a servir..."
              value={formData.servingMotivation}
              onChange={(e) => setFormData(prev => ({...prev, servingMotivation: e.target.value}))}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Perfil Espiritual'}
          </Button>
        </div>
      </form>
    </div>
  )
}
