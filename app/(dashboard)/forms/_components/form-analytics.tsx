'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Users, Eye, Calendar } from 'lucide-react'

interface FormAnalyticsProps {
  formId: string
  formName: string
}

export function FormAnalytics({ formId, formName }: FormAnalyticsProps) {
  // Mock data for now - would be replaced with real analytics
  const mockStats = {
    totalViews: 245,
    totalSubmissions: 67,
    conversionRate: 27.3,
    lastSubmission: '2 hours ago'
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
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{mockStats.totalViews}</div>
            <div className="text-sm text-muted-foreground">Views</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{mockStats.totalSubmissions}</div>
            <div className="text-sm text-muted-foreground">Submissions</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{mockStats.conversionRate}%</div>
            <div className="text-sm text-muted-foreground">Conversion</div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-lg font-bold">{mockStats.lastSubmission}</div>
            <div className="text-sm text-muted-foreground">Last Submit</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Form analytics feature is in development. 
            Real-time analytics coming soon with detailed conversion tracking and visitor insights.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}