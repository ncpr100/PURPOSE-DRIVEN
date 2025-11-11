'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Heart,
  Users,
  MessageCircle,
  DollarSign,
  Calendar,
  Award,
  Target,
  AlertCircle,
  CheckCircle2,
  Activity
} from 'lucide-react';

interface EngagementMetrics {
  averageWeeklyAttendance: number;
  eventParticipationRate: number;
  communicationResponseRate: number;
  ministryInvolvementLevel: number;
  givingConsistency: number;
  socialConnectionScore: number;
}

interface EngagementDistribution {
  HIGH: number;
  MEDIUM_HIGH: number;
  MEDIUM: number;
  MEDIUM_LOW: number;
  LOW: number;
}

interface EngagementScoreDashboardProps {
  churchId: string;
  className?: string;
}

export function EngagementScoreDashboard({ churchId, className }: EngagementScoreDashboardProps) {
  const [engagementData, setEngagementData] = useState<{
    averageScore: number;
    distribution: EngagementDistribution;
    metrics: EngagementMetrics;
    trends: { [key: string]: 'up' | 'down' | 'stable' };
    totalMembers: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEngagementData();
  }, [churchId]);

  const fetchEngagementData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/member-journey`);
      
      if (!response.ok) {
        throw new Error('Error al cargar métricas de compromiso');
      }

      const data = await response.json();
      
      // Mock data for now - replace with actual API response
      const mockData = {
        averageScore: 73,
        distribution: {
          HIGH: 45,
          MEDIUM_HIGH: 32,
          MEDIUM: 18,
          MEDIUM_LOW: 8,
          LOW: 5
        } as EngagementDistribution,
        metrics: {
          averageWeeklyAttendance: 82,
          eventParticipationRate: 65,
          communicationResponseRate: 71,
          ministryInvolvementLevel: 58,
          givingConsistency: 69,
          socialConnectionScore: 77
        } as EngagementMetrics,
        trends: {
          attendance: 'up',
          participation: 'up',
          communication: 'stable',
          ministry: 'down',
          giving: 'up',
          social: 'stable'
        } as { [key: string]: 'up' | 'down' | 'stable' },
        totalMembers: 234
      };

      setEngagementData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getEngagementLevel = (score: number): { level: string; color: string; description: string } => {
    if (score >= 90) return { level: 'Excepcional', color: 'text-green-600 bg-green-100', description: 'Compromiso extraordinario' };
    if (score >= 80) return { level: 'Muy Alto', color: 'text-emerald-600 bg-emerald-100', description: 'Altamente comprometido' };
    if (score >= 70) return { level: 'Alto', color: 'text-blue-600 bg-blue-100', description: 'Buen nivel de compromiso' };
    if (score >= 60) return { level: 'Medio', color: 'text-yellow-600 bg-yellow-100', description: 'Compromiso moderado' };
    if (score >= 40) return { level: 'Bajo', color: 'text-orange-600 bg-orange-100', description: 'Necesita atención' };
    return { level: 'Muy Bajo', color: 'text-red-600 bg-red-100', description: 'Requiere intervención urgente' };
  };

  const metricConfig = [
    {
      key: 'averageWeeklyAttendance',
      label: 'Asistencia Semanal',
      description: 'Porcentaje de asistencia a servicios semanales',
      icon: Calendar,
      color: 'blue',
      trend: 'attendance'
    },
    {
      key: 'eventParticipationRate',
      label: 'Participación en Eventos',
      description: 'Involucramiento en eventos y actividades especiales',
      icon: Users,
      color: 'purple',
      trend: 'participation'
    },
    {
      key: 'communicationResponseRate',
      label: 'Respuesta a Comunicaciones',
      description: 'Interacción con mensajes y comunicados',
      icon: MessageCircle,
      color: 'green',
      trend: 'communication'
    },
    {
      key: 'ministryInvolvementLevel',
      label: 'Involucramiento en Ministerio',
      description: 'Participación activa en ministerios',
      icon: Heart,
      color: 'red',
      trend: 'ministry'
    },
    {
      key: 'givingConsistency',
      label: 'Consistencia en Ofrendas',
      description: 'Regularidad en contribuciones financieras',
      icon: DollarSign,
      color: 'emerald',
      trend: 'giving'
    },
    {
      key: 'socialConnectionScore',
      label: 'Conexión Social',
      description: 'Nivel de conexión con otros miembros',
      icon: Users,
      color: 'indigo',
      trend: 'social'
    }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Dashboard de Compromiso de Miembros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error en Métricas de Compromiso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchEngagementData} className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!engagementData) return null;

  const engagementLevel = getEngagementLevel(engagementData.averageScore);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Dashboard de Compromiso de Miembros
        </CardTitle>
        <CardDescription>
          Análisis detallado del nivel de compromiso y participación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="metrics">Métricas Detalladas</TabsTrigger>
            <TabsTrigger value="distribution">Distribución</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overall Score Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Puntuación Promedio de Compromiso</h3>
                  <p className="text-sm text-gray-600">Basado en {engagementData.totalMembers} miembros</p>
                </div>
                <Award className="h-8 w-8 text-blue-500" />
              </div>
              
              <div className="flex items-end gap-4">
                <span className="text-4xl font-bold text-blue-900">{engagementData.averageScore}</span>
                <span className="text-2xl text-blue-700">/100</span>
                <Badge className={`${engagementLevel.color} px-3 py-1`}>
                  {engagementLevel.level}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mt-2">{engagementLevel.description}</p>
              
              <Progress 
                value={engagementData.averageScore} 
                className="h-3 mt-4"
                // @ts-ignore
                indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metricConfig.slice(0, 6).map((metric) => {
                const value = engagementData.metrics[metric.key as keyof EngagementMetrics];
                const trend = engagementData.trends[metric.trend];
                const IconComponent = metric.icon;
                
                return (
                  <div key={metric.key} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                        <IconComponent className={`h-4 w-4 text-${metric.color}-600`} />
                      </div>
                      {getTrendIcon(trend)}
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{metric.label}</h4>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(value)}%</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Action Recommendations */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Recomendaciones de Acción</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    {engagementData.averageScore < 70 && (
                      <li>• Implementar programa de seguimiento personalizado</li>
                    )}
                    {engagementData.metrics.ministryInvolvementLevel < 60 && (
                      <li>• Desarrollar estrategias para incrementar participación en ministerios</li>
                    )}
                    {engagementData.metrics.communicationResponseRate < 70 && (
                      <li>• Mejorar canales de comunicación y engagement digital</li>
                    )}
                    <li>• Crear programas de mentoría para miembros con bajo compromiso</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            {metricConfig.map((metric) => {
              const value = engagementData.metrics[metric.key as keyof EngagementMetrics];
              const trend = engagementData.trends[metric.trend];
              const IconComponent = metric.icon;
              const level = getEngagementLevel(value);
              
              return (
                <div key={metric.key} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                        <IconComponent className={`h-5 w-5 text-${metric.color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{metric.label}</h4>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{Math.round(value)}%</span>
                        {getTrendIcon(trend)}
                      </div>
                      <Badge className={`${level.color} text-xs`}>
                        {level.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <Progress 
                    value={value} 
                    className="h-2"
                    // @ts-ignore
                    indicatorClassName={`bg-${metric.color}-500`}
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(engagementData.distribution).map(([levelKey, count]) => {
                const level = levelKey.replace(/_/g, ' ');
                const percentage = Math.round((count / engagementData.totalMembers) * 100);
                
                const levelConfig = {
                  'HIGH': { label: 'Alto', color: 'bg-green-500', bgColor: 'bg-green-100' },
                  'MEDIUM HIGH': { label: 'Medio-Alto', color: 'bg-blue-500', bgColor: 'bg-blue-100' },
                  'MEDIUM': { label: 'Medio', color: 'bg-yellow-500', bgColor: 'bg-yellow-100' },
                  'MEDIUM LOW': { label: 'Medio-Bajo', color: 'bg-orange-500', bgColor: 'bg-orange-100' },
                  'LOW': { label: 'Bajo', color: 'bg-red-500', bgColor: 'bg-red-100' }
                };
                
                const config = levelConfig[level as keyof typeof levelConfig];
                if (!config) return null;
                
                return (
                  <div key={levelKey} className={`${config.bgColor} p-4 rounded-lg border`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Compromiso {config.label}</h4>
                      <Badge variant="outline">
                        {count} miembros ({percentage}%)
                      </Badge>
                    </div>
                    
                    <Progress 
                      value={percentage} 
                      className="h-3"
                      // @ts-ignore
                      indicatorClassName={config.color}
                    />
                    
                    <div className="mt-2 flex justify-between text-sm text-gray-600">
                      <span>{count} personas</span>
                      <span>{percentage}% del total</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Miembros Altamente Comprometidos</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-2">
                  {engagementData.distribution.HIGH + engagementData.distribution.MEDIUM_HIGH}
                </p>
                <p className="text-sm text-green-600">
                  {Math.round(((engagementData.distribution.HIGH + engagementData.distribution.MEDIUM_HIGH) / engagementData.totalMembers) * 100)}% del total
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-800">Miembros que Necesitan Atención</span>
                </div>
                <p className="text-2xl font-bold text-red-900 mt-2">
                  {engagementData.distribution.MEDIUM_LOW + engagementData.distribution.LOW}
                </p>
                <p className="text-sm text-red-600">
                  {Math.round(((engagementData.distribution.MEDIUM_LOW + engagementData.distribution.LOW) / engagementData.totalMembers) * 100)}% del total
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Refresh Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={fetchEngagementData}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            🔄 Actualizar Métricas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EngagementScoreDashboard;