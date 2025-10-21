'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { EnhancedSpiritualAssessment } from '@/components/volunteers/enhanced-spiritual-assessment'
import type { SpiritualAssessmentData } from '@/lib/spiritual-gifts-config'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function SpiritualAssessmentTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const memberId = searchParams.get('memberId')
  const volunteerId = searchParams.get('volunteerId')
  
  const [savedData, setSavedData] = useState<SpiritualAssessmentData | null>(null)
  const [showSavedView, setShowSavedView] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [initialData, setInitialData] = useState<SpiritualAssessmentData | null>(null)

  useEffect(() => {
    if (memberId) {
      loadExistingProfile()
    } else {
      setIsLoading(false)
    }
  }, [memberId])

  const loadExistingProfile = async () => {
    try {
      const response = await fetch(`/api/members/${memberId}/spiritual-profile`)
      if (response.ok) {
        const { profile } = await response.json()
        if (profile) {
          // Convert database format to component format
          const data: SpiritualAssessmentData = {
            giftSelections: [
              ...(profile.primaryGifts as string[]).map((id: string) => ({ subcategoryId: id, type: 'primary' as const })),
              ...(profile.secondaryGifts as string[]).map((id: string) => ({ subcategoryId: id, type: 'secondary' as const }))
            ],
            ministryPassions: profile.ministryPassions as string[],
            experienceLevel: profile.experienceLevel === 3 ? 'NOVATO' : profile.experienceLevel === 6 ? 'INTERMEDIO' : 'AVANZADO',
            spiritualCalling: profile.spiritualCalling || '',
            motivation: profile.servingMotivation || ''
          }
          setInitialData(data)
        }
      }
    } catch (error) {
      console.error('Error loading spiritual profile:', error)
      toast.error('Error al cargar el perfil espiritual')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data: SpiritualAssessmentData) => {
    if (!memberId) {
      toast.error('No se pudo identificar al miembro')
      return
    }

    try {
      const response = await fetch(`/api/members/${memberId}/spiritual-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar')
      }

      setSavedData(data)
      toast.success('Evaluación espiritual guardada exitosamente')
      
      // Redirect back to volunteers after 2 seconds
      setTimeout(() => {
        router.push('/volunteers')
      }, 2000)
    } catch (error) {
      console.error('Error saving assessment:', error)
      throw error
    }
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

      {/* Page Header */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <h1 className="text-2xl font-bold mb-2">Evaluación Espiritual</h1>
        <p className="text-muted-foreground">
          Completa esta evaluación para identificar tus dones espirituales y áreas de ministerio.
          {!memberId && (
            <span className="block mt-2 text-amber-600 font-medium">
              ⚠️ Advertencia: No se proporcionó ID de miembro. Los datos no se guardarán.
            </span>
          )}
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

      {/* Component */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Cargando evaluación...</span>
        </div>
      ) : showSavedView && savedData ? (
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
          memberId={memberId || undefined}
          initialData={initialData || savedData || undefined}
          onSave={handleSave}
          onCancel={() => router.push('/volunteers')}
          showHeader={true}
        />
      )}
    </div>
  )
}
