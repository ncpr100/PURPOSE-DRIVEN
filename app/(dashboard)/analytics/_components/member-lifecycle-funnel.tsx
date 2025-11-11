'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ArrowRight,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Types based on our member-journey-analytics.ts
interface LifecycleStage {
  name: string;
  count: number;
  percentage: number;
  averageDuration: number;
  conversionRate?: number;
  trend: 'up' | 'down' | 'stable';
}

interface ConversionFunnelData {
  totalVisitors: number;
  stages: LifecycleStage[];
  conversionRates: {
    visitorToFirstTime: number;
    firstTimeToReturning: number;
    returningToRegular: number;
    regularToMember: number;
    memberToActive: number;
    activeToLeader: number;
  };
}

interface MemberLifecycleFunnelProps {
  churchId: string;
  period?: number;
  className?: string;
}

export function MemberLifecycleFunnel({ churchId, period = 365, className }: MemberLifecycleFunnelProps) {
  const [funnelData, setFunnelData] = useState<ConversionFunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  // Stage configuration with colors and descriptions
  const stageConfig = {
    'VISITOR': {
      label: 'Visitantes',
      color: 'bg-gray-500',
      lightColor: 'bg-gray-100',
      description: 'Personas que han mostrado interés inicial',
      icon: Users
    },
    'FIRST_TIME_GUEST': {
      label: 'Primera Visita',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      description: 'Visitantes que asistieron por primera vez',
      icon: Users
    },
    'RETURNING_VISITOR': {
      label: 'Visitante Recurrente',
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-100',
      description: 'Visitantes que han regresado múltiples veces',
      icon: Users
    },
    'REGULAR_ATTENDEE': {
      label: 'Asistente Regular',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      description: 'Asiste regularmente pero no es miembro',
      icon: CheckCircle
    },
    'NEW_MEMBER': {
      label: 'Nuevo Miembro',
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      description: 'Miembros recién unidos (menos de 6 meses)',
      icon: CheckCircle
    },
    'ESTABLISHED_MEMBER': {
      label: 'Miembro Establecido',
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-100',
      description: 'Miembros activos y comprometidos',
      icon: CheckCircle
    },
    'SERVING_MEMBER': {
      label: 'Miembro Servidor',
      color: 'bg-teal-500',
      lightColor: 'bg-teal-100',
      description: 'Miembros activos en ministerios',
      icon: TrendingUp
    },
    'LEADING_MEMBER': {
      label: 'Miembro Líder',
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      description: 'Líderes de ministerio y mentores',
      icon: TrendingUp
    }
  };

  useEffect(() => {
    fetchFunnelData();
  }, [churchId, period]);

  const fetchFunnelData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/member-journey?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar datos del journey de miembros');
      }

      const data = await response.json();
      
      // Transform API data to funnel format
      const stages: LifecycleStage[] = Object.entries(data.enhancedAnalytics?.lifecycleDistribution || {})
        .map(([stageName, stageData]: [string, any]) => ({
          name: stageName,
          count: stageData.count || 0,
          percentage: stageData.percentage || 0,
          averageDuration: stageData.averageDuration || 0,
          trend: Math.random() > 0.5 ? 'up' : 'down' // TODO: Calculate actual trend
        }));

      const transformedData: ConversionFunnelData = {
        totalVisitors: data.conversionFunnel?.totalVisitors || 0,
        stages,
        conversionRates: data.conversionFunnel?.conversionRates || {
          visitorToFirstTime: 0,
          firstTimeToReturning: 0,
          returningToRegular: 0,
          regularToMember: 0,
          memberToActive: 0,
          activeToLeader: 0
        }
      };

      setFunnelData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (days: number) => {
    if (days < 7) return `${days} días`;
    if (days < 30) return `${Math.round(days / 7)} semanas`;
    if (days < 365) return `${Math.round(days / 30)} meses`;
    return `${Math.round(days / 365)} años`;
  };

  const getConversionRate = (stageIndex: number) => {
    if (stageIndex === 0) return null;
    const rates = Object.values(funnelData?.conversionRates || {});
    return rates[stageIndex - 1] || 0;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Embudo de Crecimiento de Miembros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Error en el Embudo de Miembros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchFunnelData} className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!funnelData || funnelData.stages.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Embudo de Crecimiento de Miembros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No hay datos disponibles para el período seleccionado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Embudo de Crecimiento de Miembros
          </CardTitle>
          <CardDescription>
            Visualización del journey espiritual y crecimiento de miembros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Personas</p>
                  <p className="text-2xl font-bold text-blue-900">{funnelData.totalVisitors.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Tasa Conversión Promedio</p>
                  <p className="text-2xl font-bold text-green-900">
                    {Math.round(Object.values(funnelData.conversionRates).reduce((a, b) => a + b, 0) / 6)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Tiempo Promedio Journey</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatDuration(
                      funnelData.stages.reduce((total, stage) => total + stage.averageDuration, 0) / funnelData.stages.length
                    )}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="space-y-3">
            {funnelData.stages.map((stage, index) => {
              const config = stageConfig[stage.name as keyof typeof stageConfig];
              const conversionRate = getConversionRate(index);
              const isSelected = selectedStage === index;
              const IconComponent = config?.icon || Users;

              if (!config) return null;

              return (
                <div key={stage.name} className="space-y-2">
                  {/* Conversion Rate Arrow (between stages) */}
                  {conversionRate !== null && (
                    <div className="flex items-center justify-center py-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ArrowRight className="h-4 w-4" />
                        <span className="font-medium">{conversionRate}% conversión</span>
                        {conversionRate > 70 ? (
                          <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">
                            Excelente
                          </Badge>
                        ) : conversionRate > 40 ? (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                            Bueno
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300">
                            Mejorable
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stage Card */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          relative cursor-pointer transition-all duration-200 transform
                          ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102 hover:shadow-md'}
                        `}
                        onClick={() => setSelectedStage(isSelected ? null : index)}
                      >
                        {/* Funnel Shape Background */}
                        <div 
                          className={`
                            h-20 ${config.lightColor} rounded-lg border-2 border-gray-200 
                            relative overflow-hidden
                            ${isSelected ? `border-opacity-100 shadow-lg ${config.color.replace('bg-', 'border-')}` : ''}
                          `}
                          style={{
                            width: `${Math.max(20, stage.percentage * 3)}%`,
                            marginLeft: `${(100 - Math.max(20, stage.percentage * 3)) / 2}%`
                          }}
                        >
                          {/* Progress Bar */}
                          <div 
                            className={`absolute top-0 left-0 h-full ${config.color} transition-all duration-500`}
                            style={{ width: `${Math.min(100, stage.percentage * 5)}%` }}
                          />
                          
                          {/* Content */}
                          <div className="relative h-full flex items-center justify-between px-4 z-10">
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-6 w-6 text-gray-700" />
                              <div>
                                <h4 className="font-semibold text-gray-900">{config.label}</h4>
                                <p className="text-sm text-gray-600">{stage.count.toLocaleString()} personas</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">{stage.percentage}%</span>
                                {stage.trend === 'up' ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                ⏱ {formatDuration(stage.averageDuration)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <h4 className="font-semibold">{config.label}</h4>
                        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs">📊 {stage.count} personas ({stage.percentage}%)</p>
                          <p className="text-xs">⏱ Duración promedio: {formatDuration(stage.averageDuration)}</p>
                          {conversionRate && (
                            <p className="text-xs">🔄 Tasa de conversión: {conversionRate}%</p>
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
          </div>

          {/* Detailed Stage Info (when selected) */}
          {selectedStage !== null && funnelData.stages[selectedStage] && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">
                  Detalles: {stageConfig[funnelData.stages[selectedStage].name as keyof typeof stageConfig]?.label}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cantidad</p>
                  <p className="text-xl font-bold">{funnelData.stages[selectedStage].count.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Porcentaje del Total</p>
                  <p className="text-xl font-bold">{funnelData.stages[selectedStage].percentage}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo Promedio en Etapa</p>
                  <p className="text-xl font-bold">{formatDuration(funnelData.stages[selectedStage].averageDuration)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Miembros
                </Button>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Estrategias de Crecimiento
                </Button>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={fetchFunnelData}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              🔄 Actualizar Datos
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

export default MemberLifecycleFunnel;