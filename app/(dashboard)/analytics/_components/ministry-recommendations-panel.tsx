'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart,
  Users,
  BookOpen,
  Mic,
  Music,
  Baby,
  Globe,
  Laptop,
  HandHeart,
  GraduationCap,
  Star,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface PathwayRecommendation {
  id: string;
  type: 'ministry' | 'growth' | 'leadership' | 'service';
  title: string;
  description: string;
  matchScore: number;
  priority: 'high' | 'medium' | 'low';
  timeCommitment?: string;
  requiredSkills: string[];
  currentParticipants?: number;
  maxCapacity?: number;
  nextSteps: string[];
  mentor?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

interface Member {
  id: string;
  name: string;
  currentStage: string;
  engagementScore: number;
  spiritualGifts: string[];
  recommendations: PathwayRecommendation[];
}

interface MinistryRecommendationsPanelProps {
  churchId: string;
  className?: string;
}

export function MinistryRecommendationsPanel({ churchId, className }: MinistryRecommendationsPanelProps) {
  const [recommendationsData, setRecommendationsData] = useState<{
    topRecommendations: PathwayRecommendation[];
    memberRecommendations: Member[];
    ministryStats: {
      totalOpenings: number;
      urgentNeeds: number;
      recentMatches: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<PathwayRecommendation | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [churchId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockRecommendations: PathwayRecommendation[] = [
        {
          id: '1',
          type: 'ministry',
          title: 'Ministerio de Enseñanza',
          description: 'Desarrolla tus dones de enseñanza en clases bíblicas y grupos pequeños',
          matchScore: 92,
          priority: 'high',
          timeCommitment: '4-6 horas semanales',
          requiredSkills: ['Conocimiento bíblico', 'Comunicación efectiva', 'Paciencia'],
          currentParticipants: 8,
          maxCapacity: 12,
          nextSteps: ['Reunión con coordinador', 'Taller de preparación', 'Asignación de grupo'],
          mentor: {
            name: 'Pastor Juan Pérez',
            role: 'Coordinador de Enseñanza',
            avatar: '/avatars/pastor-juan.jpg'
          }
        },
        {
          id: '2',
          type: 'leadership',
          title: 'Desarrollo de Liderazgo Juvenil',
          description: 'Programa de formación para líderes del ministerio juvenil',
          matchScore: 88,
          priority: 'high',
          timeCommitment: '6-8 horas semanales',
          requiredSkills: ['Liderazgo', 'Trabajo en equipo', 'Creatividad', 'Comunicación'],
          currentParticipants: 5,
          maxCapacity: 8,
          nextSteps: ['Aplicación formal', 'Entrevista con pastor juvenil', 'Período de prueba'],
          mentor: {
            name: 'Líder María González',
            role: 'Pastora Juvenil',
            avatar: '/avatars/maria-gonzalez.jpg'
          }
        },
        {
          id: '3',
          type: 'service',
          title: 'Equipo de Hospitalidad',
          description: 'Dar la bienvenida y crear un ambiente acogedor para visitantes',
          matchScore: 85,
          priority: 'medium',
          timeCommitment: '2-3 horas semanales',
          requiredSkills: ['Amabilidad', 'Organización', 'Comunicación'],
          currentParticipants: 15,
          maxCapacity: 20,
          nextSteps: ['Orientación básica', 'Asignación de turnos', 'Capacitación en protocolos'],
          mentor: {
            name: 'Carlos Rodríguez',
            role: 'Coordinador de Hospitalidad'
          }
        },
        {
          id: '4',
          type: 'growth',
          title: 'Grupo de Discipulado',
          description: 'Crecimiento espiritual a través de estudio bíblico intensivo',
          matchScore: 78,
          priority: 'medium',
          timeCommitment: '2-3 horas semanales',
          requiredSkills: ['Compromiso', 'Deseo de crecimiento', 'Disponibilidad'],
          currentParticipants: 12,
          maxCapacity: 15,
          nextSteps: ['Evaluación espiritual', 'Asignación de mentor', 'Plan de estudio personalizado']
        }
      ];

      const mockMembers: Member[] = [
        {
          id: '1',
          name: 'Ana Martínez',
          currentStage: 'NEW_MEMBER',
          engagementScore: 75,
          spiritualGifts: ['ENSEÑANZA', 'HOSPITALIDAD'],
          recommendations: mockRecommendations.slice(0, 2)
        },
        {
          id: '2',
          name: 'Pedro López',
          currentStage: 'ESTABLISHED_MEMBER',
          engagementScore: 82,
          spiritualGifts: ['LIDERAZGO', 'EVANGELISMO'],
          recommendations: mockRecommendations.slice(1, 3)
        }
      ];

      const mockData = {
        topRecommendations: mockRecommendations,
        memberRecommendations: mockMembers,
        ministryStats: {
          totalOpenings: 23,
          urgentNeeds: 5,
          recentMatches: 8
        }
      };

      setRecommendationsData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getMinistryIcon = (type: string) => {
    const icons = {
      'ministry': Heart,
      'leadership': Users,
      'growth': BookOpen,
      'service': HandHeart,
      'worship': Music,
      'teaching': GraduationCap,
      'children': Baby,
      'youth': Star,
      'technology': Laptop,
      'missions': Globe
    };
    return icons[type as keyof typeof icons] || Heart;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low':
        return 'text-green-700 bg-green-100 border-green-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const handleRecommendationAction = (recommendationId: string, action: 'apply' | 'learn_more' | 'schedule') => {
    console.log(`Action ${action} for recommendation ${recommendationId}`);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recomendaciones de Ministerio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
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
            <Target className="h-5 w-5" />
            Error en Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchRecommendations} className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!recommendationsData) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Recomendaciones de Ministerio
        </CardTitle>
        <CardDescription>
          Oportunidades personalizadas basadas en dones espirituales y etapa de crecimiento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Oportunidades Disponibles</p>
                <p className="text-2xl font-bold text-blue-900">{recommendationsData.ministryStats.totalOpenings}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Necesidades Urgentes</p>
                <p className="text-2xl font-bold text-red-900">{recommendationsData.ministryStats.urgentNeeds}</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Conexiones Recientes</p>
                <p className="text-2xl font-bold text-green-900">{recommendationsData.ministryStats.recentMatches}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="top-recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="top-recommendations">Recomendaciones Top</TabsTrigger>
            <TabsTrigger value="by-member">Por Miembro</TabsTrigger>
            <TabsTrigger value="urgent-needs">Necesidades Urgentes</TabsTrigger>
          </TabsList>

          <TabsContent value="top-recommendations" className="space-y-4">
            {recommendationsData.topRecommendations.map((recommendation) => {
              const IconComponent = getMinistryIcon(recommendation.type);
              const capacityPercentage = recommendation.maxCapacity 
                ? (recommendation.currentParticipants! / recommendation.maxCapacity) * 100 
                : 0;

              return (
                <div
                  key={recommendation.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedRecommendation(recommendation)}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority === 'high' ? 'Alta' : 
                           recommendation.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          {recommendation.matchScore}% Match
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{recommendation.description}</p>

                      {/* Progress Bar */}
                      {recommendation.maxCapacity && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Capacidad</span>
                            <span>{recommendation.currentParticipants}/{recommendation.maxCapacity}</span>
                          </div>
                          <Progress value={capacityPercentage} className="h-2" />
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Tiempo requerido:</span>
                          <p className="font-medium">{recommendation.timeCommitment}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Tipo:</span>
                          <p className="font-medium capitalize">{recommendation.type}</p>
                        </div>
                        {recommendation.mentor && (
                          <div>
                            <span className="text-gray-500">Mentor:</span>
                            <p className="font-medium">{recommendation.mentor.name}</p>
                          </div>
                        )}
                      </div>

                      {/* Skills Required */}
                      <div className="mt-3">
                        <span className="text-gray-500 text-xs">Habilidades requeridas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recommendation.requiredSkills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {recommendation.requiredSkills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{recommendation.requiredSkills.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecommendationAction(recommendation.id, 'apply');
                        }}
                      >
                        Aplicar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecommendationAction(recommendation.id, 'learn_more');
                        }}
                      >
                        Más Info
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="by-member" className="space-y-4">
            {recommendationsData.memberRecommendations.map((member) => (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">
                      {member.currentStage.replace(/_/g, ' ')} • Compromiso: {member.engagementScore}%
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    {member.recommendations.length} recomendaciones
                  </Badge>
                </div>

                {/* Spiritual Gifts */}
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Dones espirituales:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.spiritualGifts.map((gift, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {gift}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Member Recommendations */}
                <div className="space-y-2">
                  {member.recommendations.slice(0, 2).map((rec) => {
                    const IconComponent = getMinistryIcon(rec.type);
                    return (
                      <div key={rec.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rec.title}</p>
                          <p className="text-xs text-gray-600">{rec.matchScore}% match</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="urgent-needs" className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Ministerios con Necesidades Urgentes</h4>
              </div>
              <p className="text-red-700 text-sm">
                Los siguientes ministerios necesitan voluntarios con urgencia para mantener sus actividades.
              </p>
            </div>

            {recommendationsData.topRecommendations
              .filter(rec => rec.priority === 'high')
              .map((recommendation) => {
                const IconComponent = getMinistryIcon(recommendation.type);
                const urgencyLevel = recommendation.maxCapacity 
                  ? recommendation.currentParticipants! / recommendation.maxCapacity 
                  : 0;

                return (
                  <div key={recommendation.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-red-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-red-900">{recommendation.title}</h4>
                          <Badge className="bg-red-200 text-red-800 border-red-300">
                            URGENTE
                          </Badge>
                        </div>
                        
                        <p className="text-red-800 text-sm mb-2">{recommendation.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-red-700">
                          <div>
                            <span className="font-medium">Necesita:</span>
                            <span className="ml-1">
                              {recommendation.maxCapacity! - recommendation.currentParticipants!} personas más
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Compromiso:</span>
                            <span className="ml-1">{recommendation.timeCommitment}</span>
                          </div>
                        </div>

                        {recommendation.mentor && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-red-700">
                            <span className="font-medium">Contacto:</span>
                            <span>{recommendation.mentor.name} ({recommendation.mentor.role})</span>
                          </div>
                        )}
                      </div>

                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Ayudar Ahora
                      </Button>
                    </div>
                  </div>
                );
              })}
          </TabsContent>
        </Tabs>

        {/* Recommendation Detail Modal */}
        {selectedRecommendation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedRecommendation.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRecommendation(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">{selectedRecommendation.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Compromiso de tiempo:</span>
                    <p>{selectedRecommendation.timeCommitment}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Nivel de match:</span>
                    <p>{selectedRecommendation.matchScore}%</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Habilidades requeridas:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRecommendation.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Próximos pasos:</span>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    {selectedRecommendation.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600">{step}</li>
                    ))}
                  </ol>
                </div>

                {selectedRecommendation.mentor && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <span className="font-medium text-gray-700">Tu mentor será:</span>
                    <div className="flex items-center gap-3 mt-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedRecommendation.mentor.avatar} />
                        <AvatarFallback className="bg-blue-200 text-blue-700">
                          {selectedRecommendation.mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedRecommendation.mentor.name}</p>
                        <p className="text-sm text-gray-600">{selectedRecommendation.mentor.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => handleRecommendationAction(selectedRecommendation.id, 'apply')}
                    className="flex-1"
                  >
                    Aplicar Ahora
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleRecommendationAction(selectedRecommendation.id, 'schedule')}
                  >
                    Programar Reunión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={fetchRecommendations}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            🔄 Actualizar Recomendaciones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MinistryRecommendationsPanel;