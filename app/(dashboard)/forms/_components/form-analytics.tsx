'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Users, Eye, Calendar } from 'lucide-react'

interface FormAnalyticsProps {
  formId: string
  formName: string
  submissionCount?: number
  totalForms?: number
}

export function FormAnalytics({ formId, formName, submissionCount = 0, totalForms = 0 }: FormAnalyticsProps) {
  const stats = {
    totalForms,
    totalSubmissions: submissionCount,
    avgPerForm: totalForms > 0 ? Math.round(submissionCount / totalForms) : 0,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics - {formName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{stats.totalForms}</div>
            <div className="text-sm text-muted-foreground">Formularios</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <div className="text-sm text-muted-foreground">Respuestas</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Eye className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{stats.avgPerForm}</div>
            <div className="text-sm text-muted-foreground">Prom. por Form.</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-lg font-bold">{stats.totalSubmissions > 0 ? 'Activo' : 'Sin datos'}</div>
            <div className="text-sm text-muted-foreground">Estado</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Datos en tiempo real.</strong> Las respuestas y formularios activos se actualizan automáticamente.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}