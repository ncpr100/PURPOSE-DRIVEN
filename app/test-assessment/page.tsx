'use client'

import { useState } from 'react'
import { EnhancedSpiritualAssessment } from '@/components/volunteers/enhanced-spiritual-assessment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { SpiritualAssessmentData } from '@/lib/spiritual-gifts-config'

export default function TestAssessmentPage() {
  const [assessmentData, setAssessmentData] = useState<SpiritualAssessmentData | null>(null)
  const [showComponent, setShowComponent] = useState(true)

  const handleSave = async (data: SpiritualAssessmentData) => {
    console.log('Assessment data received:', data)
    
    try {
      const response = await fetch('/api/spiritual-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar evaluación')
      }

      const result = await response.json()
      console.log('Assessment saved successfully:', result)
      setAssessmentData(data)
      
    } catch (error) {
      console.error('Error saving assessment:', error)
      throw error // This will be caught by the component
    }
  }

  const handleCancel = () => {
    setShowComponent(false)
  }

  const resetTest = () => {
    setAssessmentData(null)
    setShowComponent(true)
  }

  if (!showComponent) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Cancelado</CardTitle>
            <CardDescription>
              El componente fue cancelado por el usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={resetTest}>
              Reiniciar Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Test - Enhanced Spiritual Assessment</h1>
        <p className="text-muted-foreground mb-4">
          Esta página prueba el componente de evaluación de dones espirituales mejorado.
        </p>
        
        {assessmentData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>✅ Assessment Guardado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Dones Seleccionados:</strong> {assessmentData.giftSelections?.length || 0}</p>
                <p><strong>Pasiones Ministeriales:</strong> {assessmentData.ministryPassions?.length || 0}</p>
                <p><strong>Nivel de Experiencia:</strong> {assessmentData.experienceLevel}</p>
                <p><strong>Completado en:</strong> {assessmentData.completedAt}</p>
              </div>
              <Button onClick={resetTest} className="mt-4">
                Nuevo Test
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <EnhancedSpiritualAssessment
        memberId="test-member-123"
        onSave={handleSave}
        onCancel={handleCancel}
        showHeader={true}
        className="mb-8"
      />
    </div>
  )
}