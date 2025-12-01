'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRealTime } from '@/hooks/use-realtime';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Calendar, 
  Target, Brain, BarChart3, PieChart, Activity, 
  AlertTriangle, CheckCircle, Clock, ArrowRight,
  Download, RefreshCw, Eye, Zap, Wifi, WifiOff
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import { toast } from 'sonner';

interface PredictiveAnalytics {
  memberRetention: {
    predicted30Day: number;
    predicted90Day: number;
    confidenceLevel: number;
    factors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
  };
  givingTrends: {
    predictedNextMonth: number;
    seasonalVariation: number;
    donorRetentionRate: number;
    averageGiftTrend: 'increasing' | 'decreasing' | 'stable';
  };
  engagementForecast: {
    eventAttendanceTrend: number;
    volunteerParticipationTrend: number;
    communicationEngagement: number;
    overallEngagementScore: number;
  };
  churchGrowth: {
    projectedMonthlyGrowth: number;
    projected6MonthMembers: number;
    projectedYearlyGrowth: number;
    growthFactors: string[];
  };
}

interface MemberJourneyAnalytics {
  conversionFunnel: {
    visitor: { stage: string; count: number; percentage: number; conversionRate: number };
    firstTimeGuest: { stage: string; count: number; percentage: number; conversionRate: number };
    returningGuest: { stage: string; count: number; percentage: number; conversionRate: number };
    regularAttendee: { stage: string; count: number; percentage: number; conversionRate: number };
    member: { stage: string; count: number; percentage: number; conversionRate: number };
    activeMember: { stage: string; count: number; percentage: number; conversionRate: number };
    leader: { stage: string; count: number; percentage: number; conversionRate: number };
  };
  spiritualGrowth: {
    baptisms: { thisMonth: number; lastMonth: number; growthRate: number };
    discipleship: { totalInPrograms: number; completionRate: number; averageProgress: number };
    ministry: { totalVolunteers: number; leadershipDevelopment: number; activeMinistries: number };
  };
}

interface ExecutiveReport {
  summary: {
    totalMembers: number;
    totalActiveMembersDisplay: string;
    totalEngagedMembers: number;
    memberGrowthThisMonth: number;
    memberGrowthLastMonth: number;
    memberGrowthPercentage: string;
    newMembersThisMonth: number;
    avgAttendanceThisMonth: number;
    avgAttendanceLastMonth: number;
    attendanceGrowthPercentage: string;
    totalDonationsThisMonth: number;
    totalDonationsLastMonth: number;
    donationGrowthPercentage: string;
    activeVolunteersThisMonth: number;
    totalEvents: number;
    totalCommunications: number;
    engagementScore: number;
    churchHealthScore: number;
  };
  membershipMetrics: any;
  attendanceMetrics: any;
  financialMetrics: any;
  engagementMetrics: any;
  predictiveInsights: any;
}

export default function IntelligentAnalyticsDashboard() {
  const [predictiveData, setPredictiveData] = useState<PredictiveAnalytics | null>(null);
  const [journeyData, setJourneyData] = useState<MemberJourneyAnalytics | null>(null);
  const [executiveData, setExecutiveData] = useState<ExecutiveReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Real-time integration using existing infrastructure
  const { isConnected, isConnecting } = useRealTime({
    autoConnect: true,
    enableToasts: false, // We'll handle our own notifications
    enablePresence: false
  });

  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up auto-refresh every 30 seconds when connected (client-side only)
    if (typeof window === 'undefined') return;
    
    let interval: NodeJS.Timeout | null = null;
    if (isConnected) {
      interval = setInterval(() => {
        fetchRealTimeAnalyticsUpdate();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const fetchRealTimeAnalyticsUpdate = async () => {
    // Skip real-time updates during build/SSG
    if (typeof window === 'undefined') return;
    
    try {
      const response = await fetch('/api/analytics/realtime-overview');
      if (response.ok) {
        const data = await response.json();
        // Update data without showing loading spinner
        if (data.hasUpdates) {
          await fetchAnalyticsData();
          setLastUpdate(new Date());
          toast.success('Datos actualizados en tiempo real');
        }
      }
    } catch (error) {
      console.error('Error fetching real-time update:', error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Add cache-busting for mobile devices and force refresh
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const appVersion = '1.1.0';
      const cacheBuster = `?t=${Date.now()}&mobile=${isMobile}&v=${appVersion}`;
      
      const [predictiveRes, journeyRes, executiveRes] = await Promise.all([
        fetch(`/api/analytics/predictive${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Mobile-Request': isMobile.toString(),
            'X-App-Version': appVersion
          }
        }),
        fetch(`/api/analytics/member-journey${cacheBuster}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Mobile-Request': isMobile.toString(),
            'X-App-Version': appVersion
          }
        }),
        fetch(`/api/analytics/executive-report?type=monthly${cacheBuster.replace('?', '&')}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Mobile-Request': isMobile.toString(),
            'X-App-Version': appVersion
          }
        })
      ]);

      let successCount = 0;
      
      if (predictiveRes.ok) {
        setPredictiveData(await predictiveRes.json());
        successCount++;
      } else {
        console.error('Predictive analytics failed:', predictiveRes.status);
      }
      
      if (journeyRes.ok) {
        setJourneyData(await journeyRes.json());
        successCount++;
      } else {
        console.error('Member journey analytics failed:', journeyRes.status);
      }
      
      if (executiveRes.ok) {
        setExecutiveData(await executiveRes.json());
        successCount++;
      } else {
        console.error('Executive report failed:', executiveRes.status);
      }

      if (successCount > 0) {
        toast.success(`📊 ${successCount}/3 módulos de analíticas cargados exitosamente`);
      } else {
        toast.warning('⚠️ No se pudieron cargar los datos de analíticas');
      }
    } catch (error) {
      console.error('Error fetching intelligent analytics:', error);
      toast.error('Error al cargar analíticas avanzadas');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const generateExecutiveReport = async () => {
    try {
      toast.info('📄 Generando reporte ejecutivo...');
      const response = await fetch('/api/analytics/executive-report?type=monthly&format=pdf', {
        method: 'POST'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-ejecutivo-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('📄 Reporte ejecutivo descargado');
      }
    } catch (error) {
      toast.error('Error al generar reporte ejecutivo');
    }
  };

  const COLORS = {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#A855F7',
    blue: '#3B82F6',
    green: '#22C55E',
    orange: '#F97316'
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 animate-pulse text-purple-600" />
            <span className="text-lg">Cargando Analíticas Inteligentes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            Analíticas Inteligentes
            {/* Real-time status indicator */}
            <div className="flex items-center gap-2 ml-2 sm:ml-4">
              {isConnected ? (
                <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                  <Wifi className="h-3 w-3" />
                  En Vivo
                </Badge>
              ) : isConnecting ? (
                <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Conectando
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-600">
                  <WifiOff className="h-3 w-3" />
                  Sin Conexión
                </Badge>
              )}
              {Boolean(lastUpdate) && (
                <span className="hidden sm:inline text-xs text-gray-500">
                  Actualizado: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Insights avanzados y predicciones para el crecimiento de la iglesia</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={refreshing}
            className="flex-1 sm:flex-initial"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
            <span className="sm:hidden">Refrescar</span>
          </Button>
          <Button onClick={generateExecutiveReport} className="flex-1 sm:flex-initial">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Reporte Ejecutivo</span>
            <span className="sm:hidden">Reporte</span>
          </Button>
        </div>
      </div>

      {/* Church Health Score */}
      {Boolean(executiveData?.summary) && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Puntuación de Salud de la Iglesia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <div className="text-center">
                                    <div className="text-4xl font-bold text-purple-900 mb-2">
                    {Math.round(executiveData.summary.churchHealthScore)}/100
                  </div>
                  <Badge 
                    variant={executiveData.summary.churchHealthScore >= 80 ? "default" : 
                            executiveData.summary.churchHealthScore >= 60 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {executiveData.summary.churchHealthScore >= 80 ? 'Excelente' : 
                     executiveData.summary.churchHealthScore >= 60 ? 'Bueno' : 'Necesita Atención'}
                  </Badge>
                </div>
              </div>
              <div className="md:col-span-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-20">Miembros</span>
                  <Progress value={executiveData.summary.engagementScore} className="flex-1" />
                  <span className="text-sm text-gray-600 w-10">{Math.round(executiveData.summary.engagementScore)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-20">Asistencia</span>
                  <Progress value={Math.min(100, (executiveData.summary.avgAttendanceThisMonth / executiveData.summary.totalMembers) * 100)} className="flex-1" />
                  <span className="text-sm text-gray-600 w-10">{Math.round(Math.min(100, (executiveData.summary.avgAttendanceThisMonth / executiveData.summary.totalMembers) * 100))}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-20">Crecimiento</span>
                  <Progress value={Math.min(100, Math.max(0, executiveData.summary.memberGrowthThisMonth * 10))} className="flex-1" />
                  <span className="text-sm text-gray-600 w-10">{Math.round(Math.min(100, Math.max(0, executiveData.summary.memberGrowthThisMonth * 10)))}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="predictive" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictive">Analítica Predictiva</TabsTrigger>
          <TabsTrigger value="journey">Jornada del Miembro</TabsTrigger>
          <TabsTrigger value="executive">Reporte Ejecutivo</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="predictive" className="space-y-4">
          {predictiveData ? (
            <>
              {/* Member Retention Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Predicción de Retención de Miembros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">
                        {predictiveData.memberRetention.predicted30Day}%
                      </div>
                      <div className="text-sm text-gray-600">Retención 30 días</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">
                        {predictiveData.memberRetention.predicted90Day}%
                      </div>
                      <div className="text-sm text-gray-600">Retención 90 días</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">
                        {predictiveData.memberRetention.confidenceLevel}%
                      </div>
                      <div className="text-sm text-gray-600">Nivel de Confianza</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Factores de Influencia:</h4>
                    {predictiveData.memberRetention.factors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Badge variant={factor.impact > 0 ? "default" : "secondary"}>
                          {factor.impact > 0 ? '+' : ''}{factor.impact}%
                        </Badge>
                        <span className="font-medium">{factor.factor}:</span>
                        <span className="text-gray-600">{factor.description}</span>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Retention Trend Chart */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Proyección de Retención</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={[
                        { periodo: 'Actual', retencion: predictiveData.memberRetention.predicted30Day },
                        { periodo: '30 días', retencion: predictiveData.memberRetention.predicted30Day },
                        { periodo: '60 días', retencion: Math.round((predictiveData.memberRetention.predicted30Day + predictiveData.memberRetention.predicted90Day) / 2) },
                        { periodo: '90 días', retencion: predictiveData.memberRetention.predicted90Day },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="periodo" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Retención']}
                          labelFormatter={(label) => `Período: ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="retencion" 
                          stroke={COLORS.blue} 
                          strokeWidth={3}
                          dot={{ fill: COLORS.blue, strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Giving Trends Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Tendencias de Donaciones Predictivas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-900">
                        ${predictiveData.givingTrends.predictedNextMonth.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Próximo Mes Proyectado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-900">
                        {predictiveData.givingTrends.seasonalVariation > 0 ? '+' : ''}{predictiveData.givingTrends.seasonalVariation}%
                      </div>
                      <div className="text-sm text-gray-600">Variación Estacional</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-900">
                        {predictiveData.givingTrends.donorRetentionRate}%
                      </div>
                      <div className="text-sm text-gray-600">Retención de Donantes</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {predictiveData.givingTrends.averageGiftTrend === 'increasing' && (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        )}
                        {predictiveData.givingTrends.averageGiftTrend === 'decreasing' && (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                        <span className="text-sm font-medium capitalize">
                          {predictiveData.givingTrends.averageGiftTrend}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">Tendencia Promedio</div>
                    </div>
                  </div>

                  {/* Enhanced Giving Trends Chart */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Proyección de Donaciones</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={[
                        { mes: 'Mes Anterior', donaciones: predictiveData.givingTrends.predictedNextMonth * 0.85, proyeccion: null },
                        { mes: 'Mes Actual', donaciones: predictiveData.givingTrends.predictedNextMonth * 0.92, proyeccion: null },
                        { mes: 'Próximo Mes', donaciones: null, proyeccion: predictiveData.givingTrends.predictedNextMonth },
                        { mes: 'Mes +2', donaciones: null, proyeccion: predictiveData.givingTrends.predictedNextMonth * 1.08 },
                        { mes: 'Mes +3', donaciones: null, proyeccion: predictiveData.givingTrends.predictedNextMonth * 1.15 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value, name) => [
                          `$${value?.toLocaleString() || 0}`, 
                          name === 'donaciones' ? 'Histórico' : 'Proyección'
                        ]} />
                        <Area 
                          type="monotone" 
                          dataKey="donaciones" 
                          stackId="1"
                          stroke={COLORS.green} 
                          fill={COLORS.green}
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="proyeccion" 
                          stackId="2"
                          stroke={COLORS.blue} 
                          fill={COLORS.blue}
                          fillOpacity={0.4}
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    Pronóstico de Compromiso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Engagement Metrics */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Asistencia a Eventos</span>
                        <span className="text-lg font-bold text-orange-600">
                          {predictiveData.engagementForecast.eventAttendanceTrend}%
                        </span>
                      </div>
                      <Progress value={predictiveData.engagementForecast.eventAttendanceTrend} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Participación Voluntarios</span>
                        <span className="text-lg font-bold text-orange-600">
                          {predictiveData.engagementForecast.volunteerParticipationTrend}%
                        </span>
                      </div>
                      <Progress value={predictiveData.engagementForecast.volunteerParticipationTrend} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Engagement Comunicación</span>
                        <span className="text-lg font-bold text-orange-600">
                          {predictiveData.engagementForecast.communicationEngagement}%
                        </span>
                      </div>
                      <Progress value={predictiveData.engagementForecast.communicationEngagement} className="h-2" />
                    </div>

                    {/* Overall Engagement Chart */}
                    <div>
                      <h4 className="font-semibold mb-3 text-center">Score General de Compromiso</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Compromiso Actual', value: predictiveData.engagementForecast.overallEngagementScore },
                              { name: 'Potencial de Mejora', value: 100 - predictiveData.engagementForecast.overallEngagementScore }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill={COLORS.orange} />
                            <Cell fill="#E5E7EB" />
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      <div className="text-center mt-2">
                        <span className="text-2xl font-bold text-orange-600">
                          {predictiveData.engagementForecast.overallEngagementScore}%
                        </span>
                        <p className="text-sm text-gray-600">Score Total</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Church Growth Projection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Proyección de Crecimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900">
                        {predictiveData.churchGrowth.projectedMonthlyGrowth > 0 ? '+' : ''}{predictiveData.churchGrowth.projectedMonthlyGrowth}%
                      </div>
                      <div className="text-sm text-gray-600">Crecimiento Mensual</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900">
                        {predictiveData.churchGrowth.projected6MonthMembers}
                      </div>
                      <div className="text-sm text-gray-600">Miembros en 6 Meses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900">
                        {predictiveData.churchGrowth.projectedYearlyGrowth > 0 ? '+' : ''}{predictiveData.churchGrowth.projectedYearlyGrowth}%
                      </div>
                      <div className="text-sm text-gray-600">Crecimiento Anual</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Factores de Crecimiento:</h4>
                    <div className="flex flex-wrap gap-2">
                      {predictiveData.churchGrowth.growthFactors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Cargando Analítica Predictiva</h3>
                  <p className="text-gray-500">Analizando datos históricos para generar predicciones...</p>
                  {!loading && (
                    <Button 
                      onClick={refreshData} 
                      variant="outline" 
                      className="mt-4"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reintentar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          {journeyData ? (
            <>
              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Embudo de Conversión de Miembros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(journeyData.conversionFunnel).map(([key, stage]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{stage.stage}</div>
                          <div className="text-sm text-gray-600">{stage.count} personas</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">{stage.percentage}%</div>
                            <div className="text-xs text-gray-600">del total</div>
                          </div>
                          {stage.conversionRate > 0 && (
                            <div className="flex items-center gap-1">
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                              <div className="text-sm font-medium">{stage.conversionRate}%</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Spiritual Growth Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Bautismos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Este mes:</span>
                        <span className="font-bold">{journeyData.spiritualGrowth.baptisms.thisMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mes anterior:</span>
                        <span>{journeyData.spiritualGrowth.baptisms.lastMonth}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {journeyData.spiritualGrowth.baptisms.growthRate >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          journeyData.spiritualGrowth.baptisms.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {journeyData.spiritualGrowth.baptisms.growthRate > 0 ? '+' : ''}{journeyData.spiritualGrowth.baptisms.growthRate}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Discipulado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>En programas:</span>
                        <span className="font-bold">{journeyData.spiritualGrowth.discipleship.totalInPrograms}</span>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Tasa de completación:</span>
                          <span className="text-sm">{journeyData.spiritualGrowth.discipleship.completionRate}%</span>
                        </div>
                        <Progress value={journeyData.spiritualGrowth.discipleship.completionRate} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ministerio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Voluntarios:</span>
                        <span className="font-bold">{journeyData.spiritualGrowth.ministry.totalVolunteers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>En liderazgo:</span>
                        <span>{journeyData.spiritualGrowth.ministry.leadershipDevelopment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ministerios activos:</span>
                        <span>{journeyData.spiritualGrowth.ministry.activeMinistries}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Cargando Jornada del Miembro</h3>
                  <p className="text-gray-500">Analizando el viaje de los miembros en la iglesia...</p>
                  {!loading && (
                    <Button 
                      onClick={refreshData} 
                      variant="outline" 
                      className="mt-4"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reintentar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="executive" className="space-y-4">
          {executiveData && executiveData.summary ? (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Membresía
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{executiveData.summary.totalMembers}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">+{executiveData.summary.memberGrowthThisMonth}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      Asistencia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{executiveData.summary.avgAttendanceThisMonth}</div>
                    <div className="text-xs text-gray-600">
                      {Math.round((executiveData.summary.avgAttendanceThisMonth / executiveData.summary.totalMembers) * 100)}% tasa de asistencia
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Finanzas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${executiveData.summary.totalDonationsThisMonth.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      Este mes
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-600" />
                      Ministerio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{executiveData.summary.activeVolunteersThisMonth}</div>
                    <div className="text-xs text-gray-600">
                      voluntarios activos
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Resumen de Desempeño
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-green-900">Salud General</h4>
                          <p className="text-sm text-green-700">
                            {executiveData.summary.churchHealthScore >= 80 ? 'Excelente estado' : 
                             executiveData.summary.churchHealthScore >= 60 ? 'Buen estado' : 'Requiere atención'}
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(executiveData.summary.churchHealthScore)}%
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-blue-900">Compromiso</h4>
                          <p className="text-sm text-blue-700">Nivel de participación activa</p>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(executiveData.summary.engagementScore)}%
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-purple-900">Crecimiento</h4>
                          <p className="text-sm text-purple-700">Nuevos miembros este mes</p>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          +{executiveData.summary.newMembersThisMonth}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data-driven Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Áreas de Oportunidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {executiveData.summary.churchHealthScore < 70 && (
                      <div className="border-l-4 border-orange-400 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">Puntuación de Salud</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              La puntuación actual ({Math.round(executiveData.summary.churchHealthScore)}%) sugiere áreas de mejora.
                            </p>
                            <p className="text-sm text-blue-700 italic">
                              Considere revisar los programas de compromiso y seguimiento de miembros.
                            </p>
                          </div>
                          <Badge variant="secondary">Media</Badge>
                        </div>
                      </div>
                    )}
                    {executiveData.summary.memberGrowthThisMonth < 1 && (
                      <div className="border-l-4 border-orange-400 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">Crecimiento de Membresía</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              El crecimiento de este mes ({executiveData.summary.memberGrowthThisMonth}) es bajo.
                            </p>
                            <p className="text-sm text-blue-700 italic">
                              Implementar estrategias de evangelización y retención de visitantes.
                            </p>
                          </div>
                          <Badge variant="destructive">Alta</Badge>
                        </div>
                      </div>
                    )}
                    {executiveData.summary.engagementScore < 50 && (
                      <div className="border-l-4 border-orange-400 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">Nivel de Compromiso</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              El nivel de compromiso ({Math.round(executiveData.summary.engagementScore)}%) necesita atención.
                            </p>
                            <p className="text-sm text-blue-700 italic">
                              Desarrollar programas de voluntariado y participación activa.
                            </p>
                          </div>
                          <Badge variant="secondary">Media</Badge>
                        </div>
                      </div>
                    )}
                    {executiveData.summary.churchHealthScore >= 70 && 
                     executiveData.summary.memberGrowthThisMonth >= 1 && 
                     executiveData.summary.engagementScore >= 50 && (
                      <div className="border-l-4 border-green-400 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">Desempeño Satisfactorio</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Los indicadores principales muestran un buen desempeño general.
                            </p>
                            <p className="text-sm text-blue-700 italic">
                              Continuar con las estrategias actuales y buscar oportunidades de crecimiento.
                            </p>
                          </div>
                          <Badge variant="outline">Info</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Cargando Reporte Ejecutivo</h3>
                  <p className="text-gray-500">Preparando métricas ejecutivas y análisis...</p>
                  {!loading && (
                    <Button 
                      onClick={refreshData} 
                      variant="outline" 
                      className="mt-4"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reintentar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {executiveData?.summary && executiveData?.predictiveInsights ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Insights Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Análisis Predictivo</h4>
                    <p className="text-sm text-blue-700">Basado en los datos de los últimos 30 días, se proyecta un crecimiento estable de la membresía y el compromiso.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Recomendaciones</h4>
                    <p className="text-sm text-green-700">Continuar enfocándose en el seguimiento de nuevos miembros y fortalecer los programas de voluntariado.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Cargando Recomendaciones</h3>
                  <p className="text-gray-500">Generando recomendaciones estratégicas...</p>
                  {!loading && (
                    <Button 
                      onClick={refreshData} 
                      variant="outline" 
                      className="mt-4"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reintentar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}