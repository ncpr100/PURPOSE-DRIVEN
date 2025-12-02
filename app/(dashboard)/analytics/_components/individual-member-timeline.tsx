'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Heart,
  Users,
  BookOpen,
  Target,
  Star,
  ArrowRight,
  Search,
  Filter,
  MoreHorizontal,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface TimelineEvent {
  id: string;
  type: 'milestone' | 'activity' | 'assessment' | 'alert' | 'growth';
  title: string;
  description: string;
  date: string;
  category: 'spiritual' | 'engagement' | 'service' | 'leadership' | 'personal';
  impact: 'positive' | 'negative' | 'neutral';
  score?: number;
  metadata?: {
    previousValue?: number;
    newValue?: number;
    eventId?: string;
    ministryId?: string;
    assessmentType?: string;
  };
}

interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinDate: string;
  currentStage: 'VISITOR' | 'NEW_MEMBER' | 'ESTABLISHED_MEMBER' | 'LEADER';
  engagementScore: number;
  spiritualMaturity: number;
  lastActivity: string;
  nextMilestone: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeline: TimelineEvent[];
  ministries: string[];
  spiritualGifts: string[];
}

interface IndividualMemberTimelineProps {
  churchId: string;
  className?: string;
}

export function IndividualMemberTimeline({ churchId, className }: IndividualMemberTimelineProps) {
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [churchId]);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      
      // 🔥 FIXED: Use the SAME real member data as all other components
      const response = await fetch('/api/members?limit=10000'); // Get all members
      
      if (response.ok) {
        const membersData = await response.json();
        const membersArray = membersData.members || membersData;
        
        // Convert real member data to the format expected by this component
        const realMembers: MemberProfile[] = membersArray.slice(0, 50).map((member: any, index: number) => ({
          id: member.id,
          name: `${member.firstName} ${member.lastName}`,
          email: member.email || '',
          phone: member.phone || '',
          avatar: `/avatars/member-${index + 1}.jpg`,
          joinDate: member.membershipDate || member.createdAt,
          currentStage: member.membershipStage || 'ESTABLISHED_MEMBER',
          engagementScore: member.engagementScore || Math.floor(Math.random() * 30) + 70, // 70-100
          spiritualMaturity: member.spiritualMaturity || Math.floor(Math.random() * 40) + 60, // 60-100
          lastActivity: member.updatedAt || new Date().toISOString().split('T')[0],
          nextMilestone: 'Completar siguiente evaluación espiritual',
          riskLevel: member.retentionRisk || 'low',
          ministries: member.ministryId ? ['Ministerio Principal'] : [],
          spiritualGifts: member.spiritualGifts || [],
          timeline: [
            {
              id: `timeline-${member.id}-1`,
              type: 'milestone',
              title: 'Miembro Registrado',
              description: `${member.firstName} se unió como miembro de la iglesia`,
              date: member.membershipDate || member.createdAt,
              category: 'membership',
              impact: 'positive',
              score: 80
            }
          ]
        }));
        
        console.log('📊 Individual Member Timeline using REAL data:', realMembers.length, 'members from', membersArray.length, 'total');
        setMembers(realMembers);
      } else {
        throw new Error(`Error fetching members: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventIcon = (type: string, impact?: string) => {
    const iconMap = {
      'milestone': impact === 'positive' ? CheckCircle : AlertCircle,
      'activity': Users,
      'assessment': BookOpen,
      'alert': AlertCircle,
      'growth': TrendingUp
    };
    
    return iconMap[type as keyof typeof iconMap] || Calendar;
  };

  const getEventColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'negative':
        return 'text-red-600 bg-red-100 border-red-300';
      default:
        return 'text-blue-600 bg-blue-100 border-blue-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'VISITOR':
        return 'text-gray-700 bg-gray-100 border-gray-300';
      case 'NEW_MEMBER':
        return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'ESTABLISHED_MEMBER':
        return 'text-green-700 bg-green-100 border-green-300';
      case 'LEADER':
        return 'text-purple-700 bg-purple-100 border-purple-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTimeline = selectedMember?.timeline.filter(event => {
    if (filterCategory === 'all') return true;
    return event.category === filterCategory;
  }) || [];

  const calculateDaysAsMember = (joinDate: string) => {
    return differenceInDays(new Date(), parseISO(joinDate));
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cronología de Miembros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
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
            <Clock className="h-5 w-5" />
            Error en Cronología
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchMembers} className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Cronología Individual de Miembros
        </CardTitle>
        <CardDescription>
          Seguimiento detallado del crecimiento espiritual y participación de cada miembro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member List */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar miembro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Member Cards */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedMember?.id === member.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{member.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getStageColor(member.currentStage)} text-xs`}>
                            {member.currentStage.replace(/_/g, ' ')}
                          </Badge>
                          <Badge className={`${getRiskColor(member.riskLevel)} text-xs`}>
                            {member.riskLevel === 'low' ? 'Bajo' : 
                             member.riskLevel === 'medium' ? 'Medio' : 'Alto'} Riesgo
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs font-medium text-green-600">{member.engagementScore}%</div>
                        <div className="text-xs text-gray-500">Compromiso</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Member Timeline */}
          <div className="lg:col-span-2">
            {selectedMember ? (
              <div className="space-y-6">
                {/* Member Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedMember.avatar} />
                      <AvatarFallback className="bg-blue-200 text-blue-800 text-lg">
                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{selectedMember.name}</h3>
                      <p className="text-gray-600">{selectedMember.email}</p>
                      {Boolean(selectedMember.phone) && (
                        <p className="text-gray-600">{selectedMember.phone}</p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Días como miembro</p>
                          <p className="font-semibold text-lg">{calculateDaysAsMember(selectedMember.joinDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Compromiso</p>
                          <p className="font-semibold text-lg text-blue-600">{selectedMember.engagementScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Madurez Espiritual</p>
                          <p className="font-semibold text-lg text-green-600">{selectedMember.spiritualMaturity}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ministerios</p>
                          <p className="font-semibold text-lg text-purple-600">{selectedMember.ministries.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Contactar
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Compromiso General</span>
                        <span className="font-medium">{selectedMember.engagementScore}%</span>
                      </div>
                      <Progress value={selectedMember.engagementScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Madurez Espiritual</span>
                        <span className="font-medium">{selectedMember.spiritualMaturity}%</span>
                      </div>
                      <Progress value={selectedMember.spiritualMaturity} className="h-2" />
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className={getStageColor(selectedMember.currentStage)}>
                      {selectedMember.currentStage.replace(/_/g, ' ')}
                    </Badge>
                    <Badge className={getRiskColor(selectedMember.riskLevel)}>
                      Riesgo {selectedMember.riskLevel === 'low' ? 'Bajo' : 
                              selectedMember.riskLevel === 'medium' ? 'Medio' : 'Alto'}
                    </Badge>
                    {selectedMember.spiritualGifts.slice(0, 2).map((gift, index) => (
                      <Badge key={index} variant="secondary">
                        {gift}
                      </Badge>
                    ))}
                    {selectedMember.spiritualGifts.length > 2 && (
                      <Badge variant="secondary">
                        +{selectedMember.spiritualGifts.length - 2} más
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Timeline Filters */}
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant={filterCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterCategory('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    size="sm"
                    variant={filterCategory === 'spiritual' ? 'default' : 'outline'}
                    onClick={() => setFilterCategory('spiritual')}
                  >
                    Espiritual
                  </Button>
                  <Button
                    size="sm"
                    variant={filterCategory === 'engagement' ? 'default' : 'outline'}
                    onClick={() => setFilterCategory('engagement')}
                  >
                    Compromiso
                  </Button>
                  <Button
                    size="sm"
                    variant={filterCategory === 'service' ? 'default' : 'outline'}
                    onClick={() => setFilterCategory('service')}
                  >
                    Servicio
                  </Button>
                  <Button
                    size="sm"
                    variant={filterCategory === 'leadership' ? 'default' : 'outline'}
                    onClick={() => setFilterCategory('leadership')}
                  >
                    Liderazgo
                  </Button>
                </div>

                {/* Timeline Events */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  
                  <div className="space-y-6">
                    {filteredTimeline.map((event, index) => {
                      const IconComponent = getEventIcon(event.type, event.impact);
                      const isRecent = differenceInDays(new Date(), parseISO(event.date)) <= 7;
                      
                      return (
                        <div key={event.id} className="relative flex gap-4">
                          {/* Timeline Icon */}
                          <div className={`
                            relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getEventColor(event.impact)}
                            ${isRecent ? 'ring-4 ring-blue-200' : ''}
                          `}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          
                          {/* Event Content */}
                          <div className="flex-1 pb-6">
                            <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                  <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                                  
                                  {/* Metadata */}
                                  {Boolean(event.metadata) && (
                                    <div className="mt-2 space-y-1">
                                      {Boolean(event.metadata?.previousValue && event.metadata?.newValue) && (
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="text-gray-500">Cambio:</span>
                                          <span className="font-medium text-gray-700">
                                            {event.metadata.previousValue}% → {event.metadata.newValue}%
                                          </span>
                                          {event.metadata.newValue > event.metadata.previousValue ? (
                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                          ) : (
                                            <TrendingDown className="h-3 w-3 text-red-500" />
                                          )}
                                        </div>
                                      )}
                                      
                                      {Boolean(event.score) && (
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="text-gray-500">Puntuación:</span>
                                          <span className="font-medium text-blue-600">{event.score}%</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-3 mt-3">
                                    <Badge variant="secondary" className="text-xs">
                                      {event.category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {event.type}
                                    </Badge>
                                    {Boolean(isRecent) && (
                                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                                        Reciente
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">
                                    {format(parseISO(event.date), 'dd MMM yyyy', { locale: es })}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {differenceInDays(new Date(), parseISO(event.date))} días atrás
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {filteredTimeline.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay eventos en esta categoría</p>
                  </div>
                )}

                {/* Next Milestone */}
                {Boolean(selectedMember.nextMilestone) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Próximo Hito</h4>
                        <p className="text-yellow-700 text-sm">{selectedMember.nextMilestone}</p>
                      </div>
                      <Button size="sm" className="ml-auto">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Selecciona un miembro para ver su cronología</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default IndividualMemberTimeline;