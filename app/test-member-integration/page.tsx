'use client'

import { useState } from 'react'
import { MemberSpiritualAssessment } from '@/components/members/member-spiritual-assessment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, User } from 'lucide-react'
import type { SpiritualAssessmentData } from '@/lib/spiritual-gifts-config'

export default function TestMemberIntegrationPage() {
  const [testMemberId, setTestMemberId] = useState('test-member-456')
  const [memberName, setMemberName] = useState('Juan Pérez')
  const [assessmentCompleted, setAssessmentCompleted] = useState(false)
  const [completedData, setCompletedData] = useState<SpiritualAssessmentData | null>(null)

  const handleAssessmentComplete = (data: SpiritualAssessmentData) => {
    console.log('Assessment completed for member:', testMemberId)
    console.log('Assessment data:', data)
    setAssessmentCompleted(true)
    setCompletedData(data)
  }

  const resetTest = () => {
    setAssessmentCompleted(false)
    setCompletedData(null)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Test - Member Spiritual Assessment Integration</h1>
        <p className="text-muted-foreground mb-6">
          Esta página prueba la integración del componente de evaluación espiritual con el sistema de gestión de miembros.
        </p>

        {/* Test Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configuración de Prueba</CardTitle>
            <CardDescription>
              Configura los datos del miembro para la prueba
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>
                <Input
                  id="memberId"
                  value={testMemberId}
                  onChange={(e) => setTestMemberId(e.target.value)}
                  placeholder="Ej: test-member-456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memberName">Nombre del Miembro</Label>
                <Input
                  id="memberName"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            </div>
            <Button onClick={resetTest} variant="outline">
              Reiniciar Test
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {assessmentCompleted && completedData && (
          <Alert className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>✅ Assessment Completado Exitosamente</strong>
              <br />
              <div className="mt-2 space-y-1 text-sm">
                <div>• Dones seleccionados: {completedData.giftSelections?.length || 0}</div>
                <div>• Pasiones ministeriales: {completedData.ministryPassions?.length || 0}</div>
                <div>• Nivel de experiencia: {completedData.experienceLevel}</div>
                <div>• Completado: {completedData.completedAt ? new Date(completedData.completedAt).toLocaleString('es-ES') : 'N/A'}</div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Member Assessment Integration */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Simulación de Perfil de Miembro
            </CardTitle>
            <CardDescription>
              Este componente simula cómo se vería la evaluación espiritual en un perfil real de miembro
            </CardDescription>
          </CardHeader>
        </Card>

        <MemberSpiritualAssessment
          memberId={testMemberId}
          memberName={memberName}
          onAssessmentComplete={handleAssessmentComplete}
        />
      </div>

      {/* Technical Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>Componente:</strong> MemberSpiritualAssessment</div>
            <div><strong>API Endpoint:</strong> /api/spiritual-assessment</div>
            <div><strong>Database Field:</strong> spiritualGiftsStructured (JSON)</div>
            <div><strong>Experience Field:</strong> experienceLevelEnum</div>
            <div><strong>Test Member ID:</strong> {testMemberId}</div>
            <div><strong>Authentication:</strong> Required (Protected Route)</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}