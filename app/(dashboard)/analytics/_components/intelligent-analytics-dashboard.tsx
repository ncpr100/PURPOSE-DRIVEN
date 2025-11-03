'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Calendar, 
  Target, Brain, BarChart3, PieChart, Activity, 
  AlertTriangle, CheckCircle, Clock, ArrowRight,
  Download, RefreshCw, Eye, Zap
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Cell, Legend
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
  churchHealthScore: {
    overall: number;
    breakdown: {
      growth: number;
      engagement: number;
      financial: number;
      ministry: number;
      community: number;
    };
  };
  keyMetrics: {
    membership: { total: number; growth: number; retention: number; newMembers: number };
    attendance: { average: number; trend: number; eventsHeld: number; attendanceRate: number };
    financial: { totalDonations: number; averageDonation: number; donorCount: number; financialGrowth: number };
    ministry: { activeVolunteers: number; ministries: number; outreachEvents: number; communityImpact: number };
  };
  achievements: Array<{
    category: string;
    title: string;
    metric: string;
    improvement: number;
  }>;
  challenges: Array<{
    area: string;
    issue: string;
    impact: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    area: string;
    action: string;
    expectedImpact: string;
    timeline: string;
  }>;
}

export default function IntelligentAnalyticsDashboard() {
  const [predictiveData, setPredictiveData] = useState<PredictiveAnalytics | null>(null);
  const [journeyData, setJourneyData] = useState<MemberJourneyAnalytics | null>(null);
  const [executiveData, setExecutiveData] = useState<ExecutiveReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [predictiveRes, journeyRes, executiveRes] = await Promise.all([
        fetch('/api/analytics/predictive'),
        fetch('/api/analytics/member-journey'),
        fetch('/api/analytics/executive-report?type=monthly')
      ]);

      if (predictiveRes.ok) {
        setPredictiveData(await predictiveRes.json());
      }
      if (journeyRes.ok) {
        setJourneyData(await journeyRes.json());
      }
      if (executiveRes.ok) {
        setExecutiveData(await executiveRes.json());
      }

      toast.success('📊 Analíticas Inteligentes cargadas exitosamente');
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Analíticas Inteligentes
          </h1>
          <p className="text-gray-600">Insights avanzados y predicciones para el crecimiento de la iglesia</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={generateExecutiveReport}>
            <Download className="h-4 w-4 mr-2" />
            Reporte Ejecutivo
          </Button>
        </div>
      </div>

      {/* Church Health Score */}
      {executiveData && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Puntuación de Salud de la Iglesia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-900 mb-2">
                    {executiveData.churchHealthScore.overall}/100
                  </div>
                  <Badge 
                    variant={executiveData.churchHealthScore.overall >= 80 ? "default" : 
                            executiveData.churchHealthScore.overall >= 60 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {executiveData.churchHealthScore.overall >= 80 ? 'Excelente' : 
                     executiveData.churchHealthScore.overall >= 60 ? 'Bueno' : 'Necesita Atención'}
                  </Badge>
                </div>
              </div>
              <div className="md:col-span-4 space-y-3">
                {Object.entries(executiveData.churchHealthScore.breakdown).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-20 capitalize">{key}</span>
                    <Progress value={value} className="flex-1" />
                    <span className="text-sm text-gray-600 w-10">{value}%</span>
                  </div>
                ))}
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
          {predictiveData && (
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          )}
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          {journeyData && (
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
          )}
        </TabsContent>

        <TabsContent value="executive" className="space-y-4">
          {executiveData && (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Membresía
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{executiveData.keyMetrics.membership.total}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">+{executiveData.keyMetrics.membership.growth}%</span>
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
                    <div className="text-2xl font-bold">{executiveData.keyMetrics.attendance.average}</div>
                    <div className="text-xs text-gray-600">
                      {executiveData.keyMetrics.attendance.attendanceRate}% tasa de asistencia
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
                      ${executiveData.keyMetrics.financial.totalDonations.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      {executiveData.keyMetrics.financial.donorCount} donantes
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
                    <div className="text-2xl font-bold">{executiveData.keyMetrics.ministry.activeVolunteers}</div>
                    <div className="text-xs text-gray-600">
                      {executiveData.keyMetrics.ministry.ministries} ministerios activos
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Achievements */}
              {executiveData.achievements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Logros Destacados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {executiveData.achievements.map((achievement, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-green-900">{achievement.title}</h4>
                              <p className="text-sm text-green-700">{achievement.metric}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {achievement.category}
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              +{achievement.improvement}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Challenges */}
              {executiveData.challenges.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Áreas de Mejora
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {executiveData.challenges.map((challenge, index) => (
                        <div key={index} className="border-l-4 border-orange-400 pl-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{challenge.area}</h4>
                              <p className="text-sm text-gray-600 mb-2">{challenge.issue}</p>
                              <p className="text-sm text-blue-700 italic">{challenge.recommendation}</p>
                            </div>
                            <Badge 
                              variant={challenge.impact === 'high' ? 'destructive' : 
                                      challenge.impact === 'medium' ? 'secondary' : 'outline'}
                            >
                              {challenge.impact}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {executiveData?.recommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Recomendaciones Estratégicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executiveData.recommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={rec.priority === 'high' ? 'destructive' : 
                                    rec.priority === 'medium' ? 'secondary' : 'outline'}
                          >
                            {rec.priority} prioridad
                          </Badge>
                          <span className="font-semibold">{rec.area}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {rec.timeline}
                        </div>
                      </div>
                      <h4 className="font-medium mb-1">{rec.action}</h4>
                      <p className="text-sm text-gray-600">{rec.expectedImpact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}