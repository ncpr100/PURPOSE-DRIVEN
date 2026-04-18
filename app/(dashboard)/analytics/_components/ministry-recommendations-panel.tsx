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
      
      const response = await fetch(`/api/analytics/ministry-recommendations`);

      if (!response.ok) {
        throw new Error('Error al cargar recomendaciones de ministerio');
      }

      const data = await response.json();

      // Map API response to component's expected shape
      const mapRec = (rec: any): PathwayRecommendation => ({
        id: rec.id || String(Math.random()),
        type: (rec.type || rec.recommendationType || 'ministry') as PathwayRecommendation['type'],
        title: rec.title || 'Sin título',
        description: rec.description || '',
        matchScore: rec.matchScore || 0,
        priority: (rec.priority || 'medium') as PathwayRecommendation['priority'],
        timeCommitment: rec.timeCommitment,
        requiredSkills: Array.isArray(rec.requiredSkills) ? rec.requiredSkills : [],
        currentParticipants: rec.currentParticipants,
        maxCapacity: rec.maxCapacity,
        nextSteps: Array.isArray(rec.nextSteps) ? rec.nextSteps : (Array.isArray(rec.basedOnFactors) ? rec.basedOnFactors : []),
        mentor: rec.mentor,
      });

      const topRecommendations = (data.topRecommendations || []).map(mapRec);
      const memberRecommendations: Member[] = (data.memberRecommendations || []).map((m: any) => ({
        id: m.id || String(Math.random()),
        name: m.name || 'Sin nombre',
        currentStage: m.currentStage || '',
        engagementScore: m.engagementScore || 0,
        spiritualGifts: Array.isArray(m.spiritualGifts) ? m.spiritualGifts : [],
        recommendations: Array.isArray(m.recommendations) ? m.recommendations.map(mapRec) : [],
      }));

      setRecommendationsData({
        topRecommendations,
        memberRecommendations,
        ministryStats: {
          totalOpenings: data.ministryStats?.totalOpenings || 0,
          urgentNeeds: data.ministryStats?.urgentNeeds || 0,
          recentMatches: data.ministryStats?.recentMatches || 0,
        }
      });
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
        return 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.15)] border-[hsl(var(--destructive)/0.4)]';
      case 'medium':
        return 'text-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.15)] border-[hsl(var(--warning)/0.4)]';
      case 'low':
        return 'text-[hsl(var(--success))] bg-[hsl(var(--success)/0.15)] border-[hsl(var(--success)/0.4)]';
      default:
        return 'text-muted-foreground bg-muted/50 border-border';
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
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
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
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--destructive))]">
            <Target className="h-5 w-5" />
            Error en Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[hsl(var(--destructive))]">{error}</p>
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
          <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg border border-[hsl(var(--info)/0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--info))]">Oportunidades Disponibles</p>
                <p className="text-2xl font-bold text-foreground">{recommendationsData.ministryStats.totalOpenings}</p>
              </div>
              <Target className="h-8 w-8 text-[hsl(var(--info))]" />
            </div>
          </div>
          
          <div className="bg-[hsl(var(--destructive)/0.10)] p-4 rounded-lg border border-[hsl(var(--destructive)/0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--destructive))]">Necesidades Urgentes</p>
                <p className="text-2xl font-bold text-[hsl(var(--destructive))]">{recommendationsData.ministryStats.urgentNeeds}</p>
              </div>
              <Clock className="h-8 w-8 text-[hsl(var(--destructive))]" />
            </div>
          </div>

          <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg border border-[hsl(var(--success)/0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--success))]">Conexiones Recientes</p>
                <p className="text-2xl font-bold text-foreground">{recommendationsData.ministryStats.recentMatches}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[hsl(var(--success))]" />
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
                    <div className="bg-[hsl(var(--info)/0.15)] p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-[hsl(var(--info))]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{recommendation.title}</h4>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority === 'high' ? 'Alta' : 
                           recommendation.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                        </Badge>
                        <Badge variant="outline" className="bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]">
                          {recommendation.matchScore}% Match
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-sm mb-3">{recommendation.description}</p>

                      {/* Progress Bar */}
                      {Boolean(recommendation.maxCapacity) && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Capacidad</span>
                            <span>{recommendation.currentParticipants}/{recommendation.maxCapacity}</span>
                          </div>
                          <Progress value={capacityPercentage} className="h-2" />
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tiempo requerido:</span>
                          <p className="font-medium">{recommendation.timeCommitment}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tipo:</span>
                          <p className="font-medium capitalize">{recommendation.type}</p>
                        </div>
                        {recommendation.mentor != null && (
                          <div>
                            <span className="text-muted-foreground">Mentor:</span>
                            <p className="font-medium">{recommendation.mentor.name}</p>
                          </div>
                        )}
                      </div>

                      {/* Skills Required */}
                      <div className="mt-3">
                        <span className="text-muted-foreground text-xs">Habilidades requeridas:</span>
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
                    <AvatarFallback className="bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {member.currentStage.replace(/_/g, ' ')} • Compromiso: {member.engagementScore}%
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-[hsl(var(--lavender)/0.15)] text-[hsl(var(--lavender))]">
                    {member.recommendations.length} recomendaciones
                  </Badge>
                </div>

                {/* Spiritual Gifts */}
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground">Dones espirituales:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(member.spiritualGifts || []).map((gift, index) => (
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
                      <div key={rec.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <IconComponent className="h-4 w-4 text-[hsl(var(--info))]" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rec.title}</p>
                          <p className="text-xs text-muted-foreground">{rec.matchScore}% match</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/70" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="urgent-needs" className="space-y-4">
            <div className="bg-[hsl(var(--destructive)/0.10)] border border-[hsl(var(--destructive)/0.3)] rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-[hsl(var(--destructive))]" />
                <h4 className="font-semibold text-[hsl(var(--destructive))]">Ministerios con Necesidades Urgentes</h4>
              </div>
              <p className="text-[hsl(var(--destructive))] text-sm">
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
                  <div key={recommendation.id} className="border-l-4 border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.10)] p-4 rounded-r-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-[hsl(var(--destructive)/0.15)] p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-[hsl(var(--destructive))]" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-[hsl(var(--destructive))]">{recommendation.title}</h4>
                          <Badge className="bg-[hsl(var(--destructive)/0.20)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.4)]">
                            URGENTE
                          </Badge>
                        </div>
                        
                        <p className="text-[hsl(var(--destructive))] text-sm mb-2">{recommendation.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-[hsl(var(--destructive))]">
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
                          <div className="mt-2 flex items-center gap-2 text-xs text-[hsl(var(--destructive))]">
                            <span className="font-medium">Contacto:</span>
                            <span>{recommendation.mentor.name} ({recommendation.mentor.role})</span>
                          </div>
                        )}
                      </div>

                      <Button size="sm" className="bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]">
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
                <p className="text-muted-foreground">{selectedRecommendation.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-muted-foreground">Compromiso de tiempo:</span>
                    <p>{selectedRecommendation.timeCommitment}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Nivel de match:</span>
                    <p>{selectedRecommendation.matchScore}%</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-muted-foreground">Habilidades requeridas:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRecommendation.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-muted-foreground">Próximos pasos:</span>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    {selectedRecommendation.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </div>

                {selectedRecommendation.mentor && (
                  <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
                    <span className="font-medium text-muted-foreground">Tu mentor será:</span>
                    <div className="flex items-center gap-3 mt-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedRecommendation.mentor.avatar} />
                        <AvatarFallback className="bg-[hsl(var(--info)/0.20)] text-[hsl(var(--info))]">
                          {selectedRecommendation.mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedRecommendation.mentor.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedRecommendation.mentor.role}</p>
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
            className="text-muted-foreground hover:text-foreground"
          >
            🔄 Actualizar Recomendaciones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MinistryRecommendationsPanel;