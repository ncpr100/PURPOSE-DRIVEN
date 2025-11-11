'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle,
  AlertCircle,
  TrendingDown,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  Users,
  Shield,
  CheckCircle,
  Calendar,
  DollarSign,
  UserX
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  membershipDate: string;
  lastAttendance?: string;
  currentStage: string;
  engagementScore: number;
}

interface RetentionRiskMember extends Member {
  riskLevel: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY_LOW';
  riskScore: number;
  riskFactors: string[];
  daysSinceLastContact: number;
  recommendedActions: string[];
  priority: number;
}

interface RetentionRiskAlertsProps {
  churchId: string;
  className?: string;
}

export function RetentionRiskAlerts({ churchId, className }: RetentionRiskAlertsProps) {
  const [riskData, setRiskData] = useState<{
    highRiskMembers: RetentionRiskMember[];
    riskDistribution: { [key: string]: number };
    totalAtRisk: number;
    trends: { [key: string]: 'improving' | 'worsening' | 'stable' };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<RetentionRiskMember | null>(null);

  useEffect(() => {
    fetchRetentionData();
  }, [churchId]);

  const fetchRetentionData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API call
      const mockMembers: RetentionRiskMember[] = [
        {
          id: '1',
          name: 'María González',
          email: 'maria.gonzalez@email.com',
          membershipDate: '2023-06-15',
          lastAttendance: '2024-10-20',
          currentStage: 'ESTABLISHED_MEMBER',
          engagementScore: 25,
          riskLevel: 'VERY_HIGH',
          riskScore: 85,
          riskFactors: ['Sin asistencia reciente', 'Bajo compromiso en comunicaciones', 'Sin participación en ministerios'],
          daysSinceLastContact: 22,
          recommendedActions: ['Llamada personal del pastor', 'Visita domiciliaria', 'Invitación a evento especial'],
          priority: 1
        },
        {
          id: '2',
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@email.com',
          membershipDate: '2022-03-10',
          lastAttendance: '2024-11-03',
          currentStage: 'SERVING_MEMBER',
          engagementScore: 45,
          riskLevel: 'HIGH',
          riskScore: 65,
          riskFactors: ['Reducción en asistencia', 'Sin ofrendas recientes'],
          daysSinceLastContact: 8,
          recommendedActions: ['Conversación con líder de ministerio', 'Seguimiento pastoral'],
          priority: 2
        },
        {
          id: '3',
          name: 'Ana Martínez',
          email: 'ana.martinez@email.com',
          membershipDate: '2024-01-20',
          lastAttendance: '2024-11-10',
          currentStage: 'NEW_MEMBER',
          engagementScore: 60,
          riskLevel: 'MEDIUM',
          riskScore: 40,
          riskFactors: ['Nuevo miembro sin consolidación'],
          daysSinceLastContact: 1,
          recommendedActions: ['Asignar mentor', 'Invitar a grupo pequeño'],
          priority: 3
        }
      ];

      const mockData = {
        highRiskMembers: mockMembers,
        riskDistribution: {
          'VERY_HIGH': 12,
          'HIGH': 18,
          'MEDIUM': 25,
          'LOW': 45,
          'VERY_LOW': 134
        },
        totalAtRisk: 30, // VERY_HIGH + HIGH
        trends: {
          'retention': 'improving',
          'engagement': 'stable',
          'followup': 'worsening'
        }
      };

      setRiskData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getRiskConfig = (riskLevel: string) => {
    const configs = {
      'VERY_HIGH': {
        label: 'Riesgo Muy Alto',
        color: 'text-red-700 bg-red-100 border-red-300',
        icon: AlertTriangle,
        urgency: 'Acción Inmediata Requerida'
      },
      'HIGH': {
        label: 'Riesgo Alto',
        color: 'text-orange-700 bg-orange-100 border-orange-300',
        icon: AlertCircle,
        urgency: 'Atención Prioritaria'
      },
      'MEDIUM': {
        label: 'Riesgo Medio',
        color: 'text-yellow-700 bg-yellow-100 border-yellow-300',
        icon: Clock,
        urgency: 'Seguimiento Recomendado'
      },
      'LOW': {
        label: 'Riesgo Bajo',
        color: 'text-blue-700 bg-blue-100 border-blue-300',
        icon: Shield,
        urgency: 'Monitoreo Regular'
      },
      'VERY_LOW': {
        label: 'Riesgo Muy Bajo',
        color: 'text-green-700 bg-green-100 border-green-300',
        icon: CheckCircle,
        urgency: 'Miembro Estable'
      }
    };
    return configs[riskLevel as keyof typeof configs] || configs['MEDIUM'];
  };

  const formatDaysAgo = (days: number) => {
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `${days} días`;
    if (days < 30) return `${Math.round(days / 7)} semanas`;
    return `${Math.round(days / 30)} meses`;
  };

  const handleContactMember = (member: RetentionRiskMember, method: 'phone' | 'email' | 'whatsapp') => {
    // Implementation for contacting member
    console.log(`Contacting ${member.name} via ${method}`);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Riesgo de Retención
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
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
            <AlertTriangle className="h-5 w-5" />
            Error en Alertas de Retención
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchRetentionData} className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!riskData) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas de Riesgo de Retención
        </CardTitle>
        <CardDescription>
          Miembros que requieren atención inmediata o seguimiento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Critical Alert Summary */}
        {riskData.totalAtRisk > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">
              {riskData.totalAtRisk} Miembros en Riesgo Alto/Muy Alto
            </AlertTitle>
            <AlertDescription className="text-red-700">
              Requieren atención inmediata para prevenir la desconexión de la iglesia.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts">Alertas Activas</TabsTrigger>
            <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
            <TabsTrigger value="actions">Plan de Acción</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            {riskData.highRiskMembers
              .filter(member => ['VERY_HIGH', 'HIGH'].includes(member.riskLevel))
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((member) => {
                const config = getRiskConfig(member.riskLevel);
                const IconComponent = config.icon;

                return (
                  <div
                    key={member.id}
                    className={`border rounded-lg p-4 ${config.color} cursor-pointer transition-all hover:shadow-md`}
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-white text-gray-700">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Member Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                          <Badge variant="outline" className={`${config.color} text-xs`}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{config.urgency}</p>

                        {/* Risk Factors */}
                        <div className="space-y-1 mb-3">
                          {member.riskFactors.slice(0, 2).map((factor, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                              <TrendingDown className="h-3 w-3" />
                              <span>{factor}</span>
                            </div>
                          ))}
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-gray-500">Riesgo:</span>
                            <span className="font-medium ml-1">{member.riskScore}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Compromiso:</span>
                            <span className="font-medium ml-1">{member.engagementScore}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Último contacto:</span>
                            <span className="font-medium ml-1">{formatDaysAgo(member.daysSinceLastContact)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Etapa:</span>
                            <span className="font-medium ml-1">{member.currentStage.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactMember(member, 'phone');
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactMember(member, 'email');
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactMember(member, 'whatsapp');
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Medium Risk Members (Collapsed) */}
            {riskData.highRiskMembers.filter(member => member.riskLevel === 'MEDIUM').length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  Miembros con Riesgo Medio ({riskData.highRiskMembers.filter(member => member.riskLevel === 'MEDIUM').length})
                </h4>
                <div className="space-y-2">
                  {riskData.highRiskMembers
                    .filter(member => member.riskLevel === 'MEDIUM')
                    .slice(0, 3)
                    .map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg bg-yellow-50">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-white text-gray-700 text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-600">Riesgo: {member.riskScore}% • {member.riskFactors[0]}</p>
                        </div>
                        <Badge variant="outline" className="text-yellow-700 bg-yellow-100">
                          Seguimiento
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            {/* Risk Distribution */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Distribución de Riesgo</h4>
              {Object.entries(riskData.riskDistribution).map(([level, count]) => {
                const config = getRiskConfig(level);
                const total = Object.values(riskData.riskDistribution).reduce((a, b) => a + b, 0);
                const percentage = Math.round((count / total) * 100);
                
                return (
                  <div key={level} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`w-4 h-4 rounded ${config.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900">{config.label}</span>
                        <span className="text-sm text-gray-600">{count} miembros</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${config.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                  </div>
                );
              })}
            </div>

            {/* Trends */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Tendencias</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(riskData.trends).map(([metric, trend]) => (
                  <div key={metric} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{metric}</span>
                      {trend === 'improving' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : trend === 'worsening' ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        trend === 'improving' ? 'text-green-700 bg-green-100' :
                        trend === 'worsening' ? 'text-red-700 bg-red-100' :
                        'text-gray-700 bg-gray-100'
                      }
                    >
                      {trend === 'improving' ? 'Mejorando' : 
                       trend === 'worsening' ? 'Empeorando' : 'Estable'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Plan de Acción Recomendado</h4>
              
              {/* Immediate Actions */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Acciones Inmediatas (Riesgo Muy Alto)
                </h5>
                <ul className="space-y-2 text-sm text-red-700">
                  <li className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    Contacto telefónico personal del pastor o líder
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Visita domiciliaria si es posible
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-3 w-3" />
                    Conversación de cuidado pastoral
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Invitación a evento especial o actividad de reconexión
                  </li>
                </ul>
              </div>

              {/* Priority Actions */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h5 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Acciones Prioritarias (Riesgo Alto)
                </h5>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li className="flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" />
                    Seguimiento via WhatsApp o llamada
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Conversación con líder de ministerio
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-3 w-3" />
                    Asignación de mentor o compañero de fe
                  </li>
                </ul>
              </div>

              {/* Preventive Actions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-medium text-yellow-800 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Acciones Preventivas (Riesgo Medio)
                </h5>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Invitación a grupo pequeño
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-3 w-3" />
                    Participación en ministerio adecuado
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Seguimiento mensual regular
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Member Detail Modal (simplified) */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMember(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nivel de Riesgo:</span>
                    <p className="font-medium">{getRiskConfig(selectedMember.riskLevel).label}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Puntuación de Riesgo:</span>
                    <p className="font-medium">{selectedMember.riskScore}%</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500 text-sm">Factores de Riesgo:</span>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {selectedMember.riskFactors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <span className="text-gray-500 text-sm">Acciones Recomendadas:</span>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {selectedMember.recommendedActions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    size="sm" 
                    onClick={() => handleContactMember(selectedMember, 'phone')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleContactMember(selectedMember, 'email')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={fetchRetentionData}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            🔄 Actualizar Alertas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default RetentionRiskAlerts;