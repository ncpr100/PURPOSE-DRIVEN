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
    totalSubmissions: number
    totalQRCodes: number
    conversionRate: number
    averageLeadScore: number
    todaySubmissions: number
    weekSubmissions: number
  }
  formPerformance: Array<{
    formName: string
    submissions: number
    conversionRate: number
    averageLeadScore: number
    qrScans: number
    campaignTag: string
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
    leadScore: number
    conversions: number
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

  // Mock analytics data for now - replace with real API calls
  const mockAnalyticsData: AnalyticsData = {
    overview: {
      totalForms: 8,
      totalSubmissions: 156,
      totalQRCodes: 24,
      conversionRate: 12.5,
      averageLeadScore: 67,
      todaySubmissions: 4,
      weekSubmissions: 23
    },
    formPerformance: [
      {
        formName: 'Registro de Nueva Iglesia',
        submissions: 45,
        conversionRate: 22.5,
        averageLeadScore: 78,
        qrScans: 89,
        campaignTag: 'church_acquisition'
      },
      {
        formName: 'Solicitud de Demo',
        submissions: 38,
        conversionRate: 15.8,
        averageLeadScore: 72,
        qrScans: 112,
        campaignTag: 'demo_request'
      },
      {
        formName: 'Newsletter Signup',
        submissions: 73,
        conversionRate: 8.2,
        averageLeadScore: 45,
        qrScans: 234,
        campaignTag: 'newsletter'
      }
    ],
    campaignPerformance: [
      { campaignTag: 'church_acquisition', forms: 2, submissions: 67, averageLeadScore: 82, conversionRate: 28.5 },
      { campaignTag: 'demo_request', forms: 3, submissions: 54, averageLeadScore: 74, conversionRate: 18.2 },
      { campaignTag: 'newsletter', forms: 2, submissions: 89, averageLeadScore: 48, conversionRate: 9.1 },
      { campaignTag: 'consultation', forms: 1, submissions: 23, averageLeadScore: 88, conversionRate: 34.8 }
    ],
    timelineData: [
      { date: '2026-01-01', submissions: 8, leadScore: 65, conversions: 2 },
      { date: '2026-01-02', submissions: 12, leadScore: 72, conversions: 3 },
      { date: '2026-01-03', submissions: 15, leadScore: 68, conversions: 4 },
      { date: '2026-01-04', submissions: 9, leadScore: 71, conversions: 2 },
      { date: '2026-01-05', submissions: 18, leadScore: 73, conversions: 5 }
    ]
  }

  useEffect(() => {
    if (isOpen !== false) {
      setLoading(true)
      // Simulate API call - in production, use real forms data
      setTimeout(() => {
        setAnalyticsData(mockAnalyticsData)
        setLoading(false)
      }, 1000)
    }
  }, [isOpen, timeRange, forms])

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
            <div className="flex items-center text-xs text-green-600">
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
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Conversiones"
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