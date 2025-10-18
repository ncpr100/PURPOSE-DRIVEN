'use client'

import { useState } from 'react'
import { EnhancedSpiritualAssessment } from '@/components/volunteers/enhanced-spiritual-assessment'
import type { SpiritualAssessmentData } from '@/lib/spiritual-gifts-config'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SpiritualAssessmentTestPage() {
  const [savedData, setSavedData] = useState<SpiritualAssessmentData | null>(null)
  const [showSavedView, setShowSavedView] = useState(false)

  const handleSave = async (data: SpiritualAssessmentData) => {
    console.log('Assessment data to save:', data)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSavedData(data)
    
    // Show success for 2 seconds, then show the read-only view
    setTimeout(() => {
      setShowSavedView(true)
    }, 2000)
  }

  const handleEdit = () => {
    setShowSavedView(false)
  }

  return (
    <div className="container py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/volunteers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Voluntarios
          </Button>
        </Link>
      </div>

      {/* Test Page Header */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <h1 className="text-2xl font-bold mb-2">Página de Prueba - Evaluación Espiritual</h1>
        <p className="text-muted-foreground">
          Esta es una página de prueba para el nuevo componente de evaluación de dones espirituales.
          Los datos se guardan en el estado local (no en la base de datos aún).
        </p>
        {savedData && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              ✅ Datos guardados exitosamente
            </p>
            <div className="mt-2 text-xs text-green-800 dark:text-green-200">
              <p>• Dones primarios: {savedData.giftSelections.filter(g => g.type === 'primary').length}</p>
              <p>• Dones secundarios: {savedData.giftSelections.filter(g => g.type === 'secondary').length}</p>
              <p>• Pasiones: {savedData.ministryPassions.length}</p>
              <p>• Nivel: {savedData.experienceLevel}</p>
            </div>
            {!showSavedView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSavedView(true)}
                className="mt-3"
              >
                Ver Evaluación Guardada
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Component Test */}
      {showSavedView && savedData ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Vista de Solo Lectura</h2>
            <Button onClick={handleEdit}>
              Editar Evaluación
            </Button>
          </div>
          <EnhancedSpiritualAssessment
            initialData={savedData}
            onSave={handleSave}
            readOnly={true}
            showHeader={true}
          />
        </>
      ) : (
        <EnhancedSpiritualAssessment
          initialData={savedData || undefined}
          onSave={handleSave}
          onCancel={() => console.log('Cancelled')}
          showHeader={true}
        />
      )}
    </div>
  )
}
