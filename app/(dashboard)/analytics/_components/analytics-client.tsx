
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Calendar, 
  MessageSquare, Share2, UserCheck, Loader2, RefreshCw,
  BarChart3, PieChart as PieChartIcon, Activity, ExternalLink,
  FileText, Download, Heart, Phone, Zap, FileSpreadsheet,
  FileImage, FileArchive, Printer, Share, FileCheck, Upload,
  Database, ChevronDown, Brain, Target, Lightbulb, Star, 
  Sparkles, Eye, CheckCircle, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AnalyticsOverview {
  period: number;
  members: { total: number; growth: number };
  donations: { total: number; count: number; average: number; growth: number };
  events: { total: number; growth: number };
  communications: { total: number; growth: number };
  socialMedia: { posts: number; growth: number };
  volunteers: { total: number; growth: number };
  comprehensive?: any; // Allow comprehensive data to be added dynamically
}

interface TrendData {
  period: string;
  start: string;
  end: string;
  donations: { amount: number; count: number };
  events: number;
  communications: number;
  attendance: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface AIInsight {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  confidence: number;
  type: string;
}

interface AIInsightsResponse {
  insights: AIInsight[];
  summary: {
    total: number;
    highPriority: number;
    patterns: number;
    opportunities: number;
    averageConfidence: number;
  };
  generatedAt: string;
}

interface AnalyticsClientProps {
  userRole: string;
  churchId: string;
}

export default function AnalyticsClient({ userRole, churchId }: AnalyticsClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [trends, setTrends] = useState<{ trends: TrendData[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30');
  const [granularity, setGranularity] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsightsResponse | null>(null);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);

  const fetchAnalyticsData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setRefreshing(!showLoader);
    setError(null);

    try {
      const [overviewRes, trendsRes, comprehensiveRes] = await Promise.all([
        fetch(`/api/analytics/overview?period=${period}`, {
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch(`/api/analytics/trends?period=${period}&granularity=${granularity}`, {
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch(`/api/analytics/comprehensive-overview?period=${period}`, {
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      if (!overviewRes.ok || !trendsRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [overviewData, trendsData, comprehensiveData] = await Promise.all([
        overviewRes.json(),
        trendsRes.json(),
        comprehensiveRes.ok ? comprehensiveRes.json() : null
      ]);

      setOverview(overviewData);
      setTrends(trendsData);
      
      // Enhance overview with comprehensive data if available
      if (comprehensiveData) {
        setOverview(prev => prev ? ({
          ...prev,
          comprehensive: comprehensiveData
        }) : null);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Error al cargar los datos analíticos. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period, granularity]);

  const fetchAIInsights = useCallback(async () => {
    // Skip AI insights during build/SSG
    if (typeof window === 'undefined') return;
    
    setAiInsightsLoading(true);
    try {
      const response = await fetch('/api/analytics/ai-insights');
      if (response.ok) {
        const data = await response.json();
        setAiInsights(data);
      } else {
        console.error('Failed to fetch AI insights:', response.status);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    } finally {
      setAiInsightsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchAnalyticsData();
      // Fetch AI insights when viewing insights tab or on initial load
      if (activeTab === 'insights') {
        fetchAIInsights();
      }
    }
  }, [session, period, granularity, activeTab, fetchAnalyticsData, fetchAIInsights]);

  // Export Utilities
  const convertToCSV = (data: any) => {
    const headers = ['Métrica', 'Valor', 'Crecimiento', 'Período']
    const rows = []
    
    if (overview) {
      rows.push(['Miembros Totales', overview.members.total, `${overview.members.growth}%`, `${period} días`])
      rows.push(['Donaciones Totales', formatCurrency(overview.donations.total), `${overview.donations.growth}%`, `${period} días`])
      rows.push(['Promedio Donación', formatCurrency(overview.donations.average), '', `${period} días`])
      rows.push(['Eventos Realizados', overview.events.total, `${overview.events.growth}%`, `${period} días`])
      rows.push(['Comunicaciones Enviadas', overview.communications.total, `${overview.communications.growth}%`, `${period} días`])
      rows.push(['Voluntarios Activos', overview.volunteers.total, `${overview.volunteers.growth}%`, `${period} días`])
      rows.push(['Publicaciones Sociales', overview.socialMedia.posts, `${overview.socialMedia.growth}%`, `${period} días`])
      
      if (overview.comprehensive) {
        rows.push(['Peticiones de Oración', overview.comprehensive.prayerMinistry.requestsReceived, '', `${period} días`])
        rows.push(['Check-ins Registrados', overview.comprehensive.engagement.checkIns, '', `${period} días`])
        rows.push(['Seguimientos Realizados', overview.comprehensive.engagement.followUps, '', `${period} días`])
      }
    }
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    return csvContent
  }

  const convertToExcelData = () => {
    const data = {
      worksheets: [
        {
          name: 'Métricas Principales',
          data: overview ? [
            ['Métrica', 'Valor Actual', 'Crecimiento (%)', 'Período'],
            ['Miembros Activos', overview.members.total, overview.members.growth, `${period} días`],
            ['Donaciones Totales', overview.donations.total, overview.donations.growth, `${period} días`],
            ['Promedio por Donación', overview.donations.average, '', `${period} días`],
            ['Total Donaciones', overview.donations.count, '', `${period} días`],
            ['Eventos Realizados', overview.events.total, overview.events.growth, `${period} días`],
            ['Comunicaciones', overview.communications.total, overview.communications.growth, `${period} días`],
            ['Voluntarios Activos', overview.volunteers.total, overview.volunteers.growth, `${period} días`],
            ['Publicaciones Sociales', overview.socialMedia.posts, overview.socialMedia.growth, `${period} días`]
          ] : []
        },
        {
          name: 'Tendencias',
          data: trends?.trends ? [
            ['Período', 'Donaciones (Monto)', 'Donaciones (Cantidad)', 'Eventos', 'Comunicaciones', 'Asistencia'],
            ...trends.trends.map(trend => [
              trend.period,
              trend.donations.amount,
              trend.donations.count,
              trend.events,
              trend.communications,
              trend.attendance
            ])
          ] : []
        }
      ]
    }

    if (overview?.comprehensive) {
      data.worksheets.push({
        name: 'Métricas Avanzadas',
        data: [
          ['Categoría', 'Métrica', 'Valor', 'Detalles'],
          ['Oración', 'Peticiones Recibidas', overview.comprehensive.prayerMinistry.requestsReceived, ''],
          ['Oración', 'Respuestas Dadas', overview.comprehensive.prayerMinistry.responsesGiven, ''],
          ['Oración', 'Tasa de Respuesta', `${overview.comprehensive.prayerMinistry.responseRate}%`, ''],
          ['Participación', 'Check-ins', overview.comprehensive.engagement.checkIns, ''],
          ['Participación', 'Seguimientos', overview.comprehensive.engagement.followUps, ''],
          ['Participación', 'Automatizaciones Activas', overview.comprehensive.engagement.activeAutomations, ''],
          ['Membresía', 'Nuevos Miembros', overview.comprehensive.membership.newMembers, `${period} días`],
          ['Comunicación', 'Total Destinatarios', overview.comprehensive.communications.totalRecipients, ''],
          ['Comunicación', 'Promedio por Mensaje', Math.round(overview.comprehensive.communications.averageRecipientsPerMessage), '']
        ]
      })
    }

    return data
  }

  // Advanced Export System - Enhanced Professional Reports
  const handleAdvancedExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      setExportingReport(true);
      toast.info(`🔄 Generando reporte profesional en formato ${format.toUpperCase()}...`);
      
      const exportRequest = {
        format,
        reportType: activeTab === 'insights' ? 'insights' : 'overview',
        period,
        includeCharts: true,
        includeAI: activeTab === 'insights' && aiInsights?.insights && aiInsights.insights.length > 0
      };

      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exportRequest)
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || `reporte-${format}-${Date.now()}`;

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const formatLabels = {
        pdf: 'PDF (Profesional con branding)',
        excel: 'Excel (Múltiples hojas con gráficos)',
        csv: 'CSV (Compatible con sistemas externos)'
      };

      toast.success(`📊 Reporte ${formatLabels[format]} generado exitosamente`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`❌ Error generando reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setExportingReport(false);
    }
  };

  // Legacy Export for Backward Compatibility
  const handleExportReport = async (format: 'json' | 'csv' | 'excel') => {
    try {
      toast.info(`🔄 Preparando reporte en formato ${format.toUpperCase()}...`)
      
      const timestamp = new Date().toISOString().split('T')[0]
      const baseFilename = `reporte-analitico-${timestamp}`
      
      const reportData = {
        title: `Reporte Analítico - ${new Date().toLocaleDateString('es-ES')}`,
        period: period,
        metrics: overview,
        trends: trends,
        generatedBy: session?.user?.name || 'Usuario',
        createdAt: new Date().toISOString(),
        exportFormat: format,
        church: session?.user?.church?.name || 'Iglesia'
      }

      let content: string | ArrayBuffer
      let mimeType: string
      let filename: string

      switch (format) {
        case 'json':
          content = JSON.stringify(reportData, null, 2)
          mimeType = 'application/json'
          filename = `${baseFilename}.json`
          break

        case 'csv':
          content = convertToCSV(reportData)
          mimeType = 'text/csv;charset=utf-8;'
          filename = `${baseFilename}.csv`
          break

        case 'excel':
          // For Excel, we'll create a simple tab-separated format that Excel can import
          const excelData = convertToExcelData()
          const sheets = excelData.worksheets.map(sheet => {
            const sheetContent = sheet.data.map(row => row.join('\t')).join('\n')
            return `=== ${sheet.name} ===\n${sheetContent}\n\n`
          }).join('')
          
          content = `Reporte Analítico - ${reportData.title}\nGenerado: ${reportData.createdAt}\nPeríodo: ${period} días\nIglesia: ${reportData.church}\n\n${sheets}`
          mimeType = 'application/vnd.ms-excel'
          filename = `${baseFilename}.xls`
          break

        default:
          throw new Error('Formato no soportado')
      }

      // Simulate processing time
      setTimeout(() => {
        const dataBlob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        const formatLabels = {
          json: 'JSON (API integración)',
          csv: 'CSV (Google Sheets listo)',
          excel: 'Excel (múltiples hojas)'
        }
        
        toast.success(`📊 Reporte ${formatLabels[format]} descargado exitosamente`)
      }, 1500)
      
    } catch (error) {
      console.error('Error creating report:', error)
      toast.error('Error al crear el reporte personalizado')
    }
  }

  const handleViewDashboard = () => {
    toast.info('🚀 Navegando a Perspectivas Pastorales...')
    router.push('/business-intelligence')
  }

  const handleUpdateKPIs = async () => {
    try {
      toast.info('⏳ Actualizando KPIs y métricas...')
      
      // Trigger KPI calculation
      const response = await fetch('/api/kpi-metrics/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshAll: true })
      })

      if (response.ok) {
        // Refresh current data
        await fetchAnalyticsData(false)
        toast.success('✅ KPIs actualizados exitosamente')
      } else {
        throw new Error('Failed to update KPIs')
      }
    } catch (error) {
      console.error('Error updating KPIs:', error)
      toast.error('Error al actualizar KPIs. Se ha refrescado la información actual.')
      // Fallback to just refreshing current data
      await fetchAnalyticsData(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth > 0;
    const icon = isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
    const colorClass = isPositive ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]';
    
    return (
      <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
        {icon}
        {Math.abs(growth)}%
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando analíticas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.10)]">
        <AlertDescription className="text-[hsl(var(--destructive))]">
          {error}
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => fetchAnalyticsData()}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analíticas Generales</h1>
          <p className="text-muted-foreground mt-2">
            Métricas operacionales y perspectivas basadas en datos para la gestión diaria de tu ministerio
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnalyticsData(false)}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Actualizar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="insights">Perspectivas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          {overview !== null && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-[hsl(var(--info))]" />
                    Miembros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.members.total}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Miembros activos</span>
                    {formatGrowth(overview.members.growth)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[hsl(var(--success))]" />
                    Donaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(overview.donations.total)}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{overview.donations.count} donaciones</span>
                    {formatGrowth(overview.donations.growth)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[hsl(var(--lavender))]" />
                    Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.events.total}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Eventos realizados</span>
                    {formatGrowth(overview.events.growth)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[hsl(var(--warning))]" />
                    Comunicaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.communications.total}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Mensajes enviados</span>
                    {formatGrowth(overview.communications.growth)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-[hsl(var(--destructive))]" />
                    Redes Sociales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.socialMedia.posts}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Publicaciones creadas</span>
                    {formatGrowth(overview.socialMedia.growth)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-[hsl(var(--info))]" />
                    Voluntarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.volunteers.total}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Voluntarios activos</span>
                    {formatGrowth(overview.volunteers.growth)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Donación Promedio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(overview.donations.average)}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Por donación</span>
                    <Badge variant="secondary" className="text-xs">
                      {period} días
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[hsl(var(--info))]" />
                    Participación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overview.communications.total + overview.socialMedia.posts}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Interacciones totales</span>
                    <Badge variant="outline" className="text-xs">
                      Alta
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Analytics Cards - Only show if comprehensive data is available */}
              {Boolean(overview?.comprehensive) && (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Heart className="h-4 w-4 text-[hsl(var(--destructive))]" />
                        Ministerio de Oración
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {overview.comprehensive.prayerMinistry.requestsReceived}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Peticiones recibidas</span>
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(overview.comprehensive.prayerMinistry.responseRate)}% respondidas
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-[hsl(var(--success))]" />
                        Asistencia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {overview.comprehensive.engagement.checkIns}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Check-ins registrados</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(overview.comprehensive.insights.memberEngagement.checkInRate)}% miembros
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[hsl(var(--info))]" />
                        Seguimientos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {overview.comprehensive.engagement.followUps}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Seguimientos realizados</span>
                        <Badge variant="secondary" className="text-xs">
                          Cuidado pastoral
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[hsl(var(--warning))]" />
                        Automatizaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {overview.comprehensive.engagement.activeAutomations}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Reglas activas</span>
                        <Badge variant="outline" className="text-xs">
                          Optimizando
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {trends !== null && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Tendencias de Donaciones
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={granularity} onValueChange={setGranularity}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Diario</SelectItem>
                        <SelectItem value="week">Semanal</SelectItem>
                        <SelectItem value="month">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trends.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip 
                        formatter={(value: any) => [formatCurrency(value), 'Monto']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="donations.amount" 
                        stroke="#0088FE" 
                        fill="#0088FE" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Resumen de Actividad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="events" 
                        stroke="#00C49F" 
                        strokeWidth={2}
                        name="Eventos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="communications" 
                        stroke="#FFBB28" 
                        strokeWidth={2}
                        name="Comunicaciones"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="attendance" 
                        stroke="#FF8042" 
                        strokeWidth={2}
                        name="Asistencia"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI-Powered Insights Section */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[hsl(var(--lavender))]" />
                  Insights Inteligentes
                  <Badge variant="secondary" className="ml-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    IA
                  </Badge>
                </CardTitle>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Análisis automático de patrones y recomendaciones inteligentes
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAIInsights}
                    disabled={aiInsightsLoading}
                    className="ml-auto"
                  >
                    {aiInsightsLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Actualizar IA
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {aiInsightsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="border rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded mb-1"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (aiInsights?.insights?.length ?? 0) > 0 ? (
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-[hsl(var(--lavender)/0.10)] rounded-lg">
                        <div className="text-2xl font-bold text-[hsl(var(--lavender))]">
                          {aiInsights?.insights?.length || 0}
                        </div>
                        <div className="text-xs text-[hsl(var(--lavender))]">Total Insights</div>
                      </div>
                      <div className="text-center p-3 bg-[hsl(var(--destructive)/0.10)] rounded-lg">
                        <div className="text-2xl font-bold text-[hsl(var(--destructive))]">
                          {aiInsights?.summary?.highPriority}
                        </div>
                        <div className="text-xs text-[hsl(var(--destructive))]">Alta Prioridad</div>
                      </div>
                      <div className="text-center p-3 bg-[hsl(var(--info)/0.10)] rounded-lg">
                        <div className="text-2xl font-bold text-[hsl(var(--info))]">
                          {aiInsights?.summary?.patterns}
                        </div>
                        <div className="text-xs text-[hsl(var(--info))]">Patrones</div>
                      </div>
                      <div className="text-center p-3 bg-[hsl(var(--success)/0.10)] rounded-lg">
                        <div className="text-2xl font-bold text-[hsl(var(--success))]">
                          {aiInsights?.summary?.opportunities}
                        </div>
                        <div className="text-xs text-[hsl(var(--success))]">Oportunidades</div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(aiInsights?.insights || []).slice(0, 6).map((insight: any, index: number) => {
                        const getInsightIcon = (type: string) => {
                          switch (type) {
                            case 'pattern': return <Target className="h-4 w-4" />
                            case 'recommendation': return <Lightbulb className="h-4 w-4" />
                            case 'opportunity': return <Star className="h-4 w-4" />
                            case 'anomaly': return <AlertTriangle className="h-4 w-4" />
                            default: return <Eye className="h-4 w-4" />
                          }
                        }

                        const getInsightColor = (priority: string) => {
                          switch (priority) {
                            case 'high': return 'border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.10)]'
                            case 'medium': return 'border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.10)]'
                            default: return 'border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.10)]'
                          }
                        }

                        const getPriorityColor = (priority: string) => {
                          switch (priority) {
                            case 'high': return 'bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]'
                            case 'medium': return 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]'
                            default: return 'bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]'
                          }
                        }

                        return (
                          <div key={insight.id} className={`border rounded-lg p-4 ${getInsightColor(insight.priority)}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getInsightIcon(insight.type)}
                                <h4 className="font-medium text-sm">{insight.title}</h4>
                              </div>
                              <div className="flex gap-1">
                                <Badge variant="secondary" className={getPriorityColor(insight.priority)}>
                                  {insight.priority}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(insight.confidence * 100)}%
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                            {insight.actionItems?.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-muted-foreground">Acciones recomendadas:</div>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {(insight.actionItems || []).slice(0, 2).map((action: string, i: number) => (
                                    <li key={i} className="flex items-start gap-1">
                                      <span className="text-[hsl(var(--success))] mt-0.5">•</span>
                                      <span>{action}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {(aiInsights?.insights?.length || 0) > 6 && (
                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver todos los insights ({aiInsights?.insights?.length || 0})
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground/70 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">Generando Insights Inteligentes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Haz clic en &quot;Actualizar IA&quot; para generar análisis automático de patrones
                    </p>
                    <Button onClick={fetchAIInsights} disabled={aiInsightsLoading}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generar Insights IA
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Existing Perspectivas Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Perspectivas Clave Tradicionales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Las donaciones muestran una tendencia al alza</strong> con un incremento del {overview?.donations.growth}% 
                    comparado al período anterior. Considera lanzar una campaña especial para mantener el impulso.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>La participación de los miembros es sólida</strong> con {overview?.communications.total} comunicaciones 
                    enviadas en los últimos {period} días. Mantén esta estrategia de comunicación consistente.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>La participación en eventos está {overview && overview.events.growth > 0 ? 'creciendo' : 'estable'}</strong>. 
                    Considera diversificar los tipos de eventos para atraer diferentes demografías.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[hsl(var(--success))]" />
                  Multi-Format Export Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Export Format Features */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-[hsl(var(--success)/0.10)] rounded-lg border border-[hsl(var(--success)/0.30)]">
                      <FileSpreadsheet className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-[hsl(var(--success))]">Excel (.xlsx)</div>
                        <div className="text-sm text-[hsl(var(--success))] space-y-1">
                          <div>• Múltiples hojas de trabajo</div>
                          <div>• Tablas de datos organizadas</div>
                          <div>• Importación directa a Excel</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-[hsl(var(--warning)/0.10)] rounded-lg border border-[hsl(var(--warning)/0.30)]">
                      <Database className="h-5 w-5 text-[hsl(var(--warning))] mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-[hsl(var(--warning))]">CSV (.csv)</div>
                        <div className="text-sm text-[hsl(var(--warning))] space-y-1">
                          <div>• Listo para Google Sheets</div>
                          <div>• Compatibilidad universal</div>
                          <div>• Importación fácil de datos</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-[hsl(var(--info)/0.10)] rounded-lg border border-blue-100">
                      <Download className="h-5 w-5 text-[hsl(var(--info))] mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-[hsl(var(--info))]">JSON (.json)</div>
                        <div className="text-sm text-[hsl(var(--info))] space-y-1">
                          <div>• Estructura de datos completa</div>
                          <div>• Integración con APIs</div>
                          <div>• Amigable para desarrolladores</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
                    <p className="text-sm text-muted-foreground text-center">
                      Los reportes se generan en tiempo real con datos actuales y están listos para uso inmediato en tu plataforma de análisis preferida
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Advanced Export Section */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">📊 Reportes Profesionales</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleAdvancedExport('pdf')}
                      disabled={exportingReport}
                    >
                      {exportingReport ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileImage className="h-4 w-4 mr-2 text-[hsl(var(--destructive))]" />
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-medium">PDF Ejecutivo</div>
                        <div className="text-xs text-muted-foreground">Con branding • Gráficos • Insights IA</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleAdvancedExport('excel')}
                      disabled={exportingReport}
                    >
                      {exportingReport ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-[hsl(var(--success))]" />
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-medium">Excel Avanzado</div>
                        <div className="text-xs text-muted-foreground">Múltiples hojas • Datos detallados • Métricas</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleAdvancedExport('csv')}
                      disabled={exportingReport}
                    >
                      {exportingReport ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileCheck className="h-4 w-4 mr-2 text-[hsl(var(--info))]" />
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-medium">CSV Estructurado</div>
                        <div className="text-xs text-muted-foreground">Optimizado • Insights IA incluidos</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Legacy Export Section */}
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium text-sm text-muted-foreground">📋 Exportes Básicos</h4>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between" 
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Crear Reporte Personalizado
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    <DropdownMenuItem 
                      onClick={() => handleExportReport('excel')}
                      className="flex items-center p-3"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-3 text-[hsl(var(--success))]" />
                      <div className="flex-1">
                        <div className="font-medium">Excel (.xlsx)</div>
                        <div className="text-xs text-muted-foreground">Múltiples hojas • Tablas organizadas</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExportReport('csv')}
                      className="flex items-center p-3"
                    >
                      <Database className="h-4 w-4 mr-3 text-[hsl(var(--warning))]" />
                      <div className="flex-1">
                        <div className="font-medium">CSV (.csv)</div>
                        <div className="text-xs text-muted-foreground">Google Sheets listo • Compatible universal</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExportReport('json')}
                      className="flex items-center p-3"
                    >
                      <Download className="h-4 w-4 mr-3 text-[hsl(var(--info))]" />
                      <div className="flex-1">
                        <div className="font-medium">JSON (.json)</div>
                        <div className="text-xs text-muted-foreground">Estructura completa • Integración API</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 border-t pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewDashboard}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Perspectivas Pastorales
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleUpdateKPIs}
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Actualizar KPIs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
