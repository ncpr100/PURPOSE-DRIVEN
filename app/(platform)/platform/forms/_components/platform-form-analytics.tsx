'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp,
  TrendingDown,
  Users,
  MousePointer,
  Target,
  DollarSign,
  Calendar,
  Activity,
  Eye,
  Star
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalForms: number
    activeForms: number
    totalSubmissions: number
    totalQRCodes: number
    conversionRate: number
    averageLeadScore: number
    todaySubmissions: number
    weekSubmissions: number
  }
  formPerformance: Array<{
    id: string
    formName: string
    slug: string
    isActive: boolean
    campaignTag: string
    qrScans: number
    submissions: number
    submissionsInPeriod: number
    conversionRate: number
    averageLeadScore: number
    createdAt: string
  }>
  campaignPerformance: Array<{
    campaignTag: string
    forms: number
    submissions: number
    averageLeadScore: number
    conversionRate: number
  }>
  timelineData: Array<{
    date: string
    submissions: number
  }>
}

interface PlatformFormAnalyticsProps {
  forms?: any[]
  isOpen?: boolean
  onClose?: () => void
  selectedForm?: any
  detailed?: boolean
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function PlatformFormAnalytics({ forms = [], isOpen = true, onClose, selectedForm, detailed = false }: PlatformFormAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    if (isOpen === false) return
    setLoading(true)
    const daysParam = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : 30
    fetch(`/api/platform/forms/analytics?days=${daysParam}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.overview) setAnalyticsData(data as AnalyticsData)
      })
      .catch(err => console.error('Analytics fetch error:', err))
      .finally(() => setLoading(false))
  }, [isOpen, timeRange])

  if (isOpen === false) return null

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const { overview, formPerformance, campaignPerformance, timelineData } = analyticsData

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Formularios</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalForms}</div>
            <p className="text-xs text-muted-foreground">
              Activos y configurados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envíos Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              +{overview.todaySubmissions} hoy, +{overview.weekSubmissions} esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.conversionRate}%</div>
            <div className="flex items-center text-xs text-[hsl(var(--success))]">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.4% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Score Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.averageLeadScore}</div>
            <Progress value={overview.averageLeadScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Envíos en el Tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Envíos"
                />

              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Campaña</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="campaignTag" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="submissions" fill="#3b82f6" name="Envíos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Form Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Formulario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formPerformance.map((form, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{form.formName}</div>
                  <div className="text-sm text-muted-foreground">
                    <Badge variant="outline" className="mr-2">
                      {form.campaignTag?.replace('_', ' ')}
                    </Badge>
                    {form.submissions} envíos • {form.qrScans} escaneos QR
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{form.conversionRate}%</div>
                  <div className="text-sm text-muted-foreground">
                    Score: {form.averageLeadScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Campañas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {campaignPerformance.map((campaign, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    className="text-white"
                  >
                    {campaign.campaignTag.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {campaign.forms} forms
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{campaign.submissions}</div>
                  <div className="text-sm text-muted-foreground">envíos</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span>Conv: {campaign.conversionRate}%</span>
                    <span>Score: {campaign.averageLeadScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}