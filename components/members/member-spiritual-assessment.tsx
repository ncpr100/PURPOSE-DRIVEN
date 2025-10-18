'use client'

import { useState, useEffect } from 'react'
import { EnhancedSpiritualAssessment } from '@/components/volunteers/enhanced-spiritual-assessment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, User, Sparkles } from 'lucide-react'
import type { SpiritualAssessmentData } from '@/lib/spiritual-gifts-config'

interface MemberSpiritualAssessmentProps {
  memberId: string
  memberName?: string
  readOnly?: boolean
  onAssessmentComplete?: (data: SpiritualAssessmentData) => void
}

interface AssessmentState {
  data: SpiritualAssessmentData | null
  loading: boolean
  error: string | null
  hasExistingAssessment: boolean
}

export function MemberSpiritualAssessment({
  memberId,
  memberName,
  readOnly = false,
  onAssessmentComplete
}: MemberSpiritualAssessmentProps) {
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    data: null,
    loading: true,
    error: null,
    hasExistingAssessment: false
  })

  const [showComponent, setShowComponent] = useState(false)

  // Load existing assessment data
  useEffect(() => {
    const loadAssessmentData = async () => {
      try {
        const response = await fetch(`/api/spiritual-assessment?memberId=${memberId}`)
        
        if (response.ok) {
          const result = await response.json()
          const existingData = result.data.assessmentData
          
          if (existingData) {
            setAssessmentState({
              data: existingData,
              loading: false,
              error: null,
              hasExistingAssessment: true
            })
          } else {
            setAssessmentState({
              data: null,
              loading: false,
              error: null,
              hasExistingAssessment: false
            })
          }
        } else {
          throw new Error('Error al cargar datos de evaluación')
        }
      } catch (error) {
        console.error('Error loading assessment:', error)
        setAssessmentState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
          hasExistingAssessment: false
        })
      }
    }

    loadAssessmentData()
  }, [memberId])

  const handleSave = async (data: SpiritualAssessmentData) => {
    try {
      const response = await fetch('/api/spiritual-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          memberId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar evaluación')
      }

      const result = await response.json()
      console.log('Assessment saved:', result)
      
      // Update state
      setAssessmentState(prev => ({
        ...prev,
        data,
        hasExistingAssessment: true
      }))

      // Hide component after save
      setShowComponent(false)

      // Notify parent
      if (onAssessmentComplete) {
        onAssessmentComplete(data)
      }

    } catch (error) {
      console.error('Error saving assessment:', error)
      throw error // Re-throw to be handled by the component
    }
  }

  const handleCancel = () => {
    setShowComponent(false)
  }

  if (assessmentState.loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Cargando datos de evaluación...</span>
        </CardContent>
      </Card>
    )
  }

  if (assessmentState.error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error: {assessmentState.error}
        </AlertDescription>
      </Alert>
    )
  }

  // Show component if editing
  if (showComponent) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Evaluación Espiritual - {memberName || `Miembro ${memberId}`}
            </CardTitle>
            <CardDescription>
              {assessmentState.hasExistingAssessment 
                ? 'Editando evaluación existente' 
                : 'Nueva evaluación de dones espirituales'
              }
            </CardDescription>
          </CardHeader>
        </Card>

        <EnhancedSpiritualAssessment
          memberId={memberId}
          initialData={assessmentState.data || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          readOnly={readOnly}
          showHeader={false}
        />
      </div>
    )
  }

  // Show summary/status view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Evaluación de Dones Espirituales
          </div>
          {!readOnly && (
            <Button
              onClick={() => setShowComponent(true)}
              variant={assessmentState.hasExistingAssessment ? "outline" : "default"}
            >
              {assessmentState.hasExistingAssessment ? 'Editar Evaluación' : 'Completar Evaluación'}
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          {memberName && `Evaluación para ${memberName}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {assessmentState.hasExistingAssessment && assessmentState.data ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Evaluación Completada</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Dones Seleccionados</h4>
                <div className="text-2xl font-bold">
                  {assessmentState.data.giftSelections?.length || 0}
                </div>
                <div className="flex flex-wrap gap-1">
                  {assessmentState.data.giftSelections?.slice(0, 3).map((gift, index) => (
                    <Badge key={index} variant={gift.type === 'primary' ? 'default' : 'secondary'}>
                      {gift.type === 'primary' ? 'Promete' : 'Secundario'}
                    </Badge>
                  ))}
                  {(assessmentState.data.giftSelections?.length || 0) > 3 && (
                    <Badge variant="outline">
                      +{(assessmentState.data.giftSelections?.length || 0) - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Pasiones Ministeriales</h4>
                <div className="text-2xl font-bold">
                  {assessmentState.data.ministryPassions?.length || 0}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Nivel de Experiencia</h4>
                <Badge variant="outline" className="text-sm">
                  {assessmentState.data.experienceLevel || 'No especificado'}
                </Badge>
              </div>
            </div>

            {assessmentState.data.completedAt && (
              <div className="text-sm text-muted-foreground">
                Completado: {new Date(assessmentState.data.completedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                Este miembro aún no ha completado su evaluación de dones espirituales.
                {!readOnly && ' Haz clic en "Completar Evaluación" para comenzar.'}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}