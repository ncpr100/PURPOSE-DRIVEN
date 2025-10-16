/**
 * Template Browser Component
 * Browse and search automation rule templates
 * with category filtering and detailed previews
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TemplateDetailModal } from './template-detail-modal';
import {
  Grid,
  List,
  Search,
  Eye,
  Zap,
  Users,
  Heart,
  MessageCircle,
  Calendar,
  Loader2,
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  icon: string;
  color: string;
  isSystemTemplate: boolean;
  priorityLevel: string;
  businessHoursOnly: boolean;
  urgentMode24x7: boolean;
  installCount: number;
  lastUsedAt?: string;
  tags: string[];
  createdAt: string;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'prayer request':
      return <Heart className="h-5 w-5" />;
    case 'visitor followup':
      return <Users className="h-5 w-5" />;
    case 'social media':
      return <MessageCircle className="h-5 w-5" />;
    case 'events':
      return <Calendar className="h-5 w-5" />;
    default:
      return <Zap className="h-5 w-5" />;
  }
};

export function TemplateBrowser() {
  const [templates, setTemplates] = useState<AutomationTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<AutomationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch templates
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter templates when search or category changes
  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedCategory, templates]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/automation-templates');
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las plantillas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleViewDetails = (template: AutomationTemplate) => {
    setSelectedTemplateId(template.id);
    setModalOpen(true);
  };

  const handleActivateFromModal = async (templateId: string, customizations: any) => {
    try {
      const response = await fetch(`/api/automation-templates/${templateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customizations })
      });

      if (!response.ok) {
        throw new Error('Failed to activate template');
      }

      await fetchTemplates(); // Refresh list
      
      toast({
        title: 'Plantilla Activada',
        description: 'La regla de automatización está ahora activa',
      });
    } catch (error) {
      console.error('Error activating template:', error);
      throw error;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'PRAYER_REQUEST': 'bg-blue-500',
      'VISITOR_FOLLOWUP': 'bg-purple-500',
      'SOCIAL_MEDIA': 'bg-pink-500',
      'EVENT': 'bg-green-500',
      'DONATION': 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
      'URGENT': 'destructive',
      'HIGH': 'default',
      'NORMAL': 'secondary',
      'LOW': 'outline'
    };
    return variants[priority] || 'secondary';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Plantillas de Automatización</h2>
          <p className="text-muted-foreground">
            Activa flujos de trabajo pre-construidos con un solo clic
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Cuadrícula
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            Lista
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar plantillas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="all">
            Todas ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="PRAYER_REQUEST">
            Oración ({templates.filter(t => t.category === 'PRAYER_REQUEST').length})
          </TabsTrigger>
          <TabsTrigger value="VISITOR_FOLLOWUP">
            Visitantes ({templates.filter(t => t.category === 'VISITOR_FOLLOWUP').length})
          </TabsTrigger>
          <TabsTrigger value="SOCIAL_MEDIA">
            Social Media ({templates.filter(t => t.category === 'SOCIAL_MEDIA').length})
          </TabsTrigger>
          <TabsTrigger value="EVENT">
            Eventos ({templates.filter(t => t.category === 'EVENT').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron plantillas</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }>
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                  onClick={() => handleViewDetails(template)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                          style={{ backgroundColor: template.color + '20' }}
                        >
                          {template.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          {template.isSystemTemplate && (
                            <Badge variant="secondary" className="mt-1">
                              <Sparkles className="mr-1 h-3 w-3" />
                              Sistema
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {template.description}
                    </CardDescription>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant={getPriorityBadge(template.priorityLevel)}>
                        {template.priorityLevel}
                      </Badge>
                      
                      {template.urgentMode24x7 && (
                        <Badge variant="destructive" className="gap-1">
                          <Clock className="h-3 w-3" />
                          24/7
                        </Badge>
                      )}
                      
                      {template.businessHoursOnly && (
                        <Badge variant="outline">
                          Horario laboral
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {template.installCount} instalaciones
                      </div>
                    </div>

                    {/* Tags */}
                    {template.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(template);
                      }}
                    >
                      Activar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(template);
                      }}
                    >
                      Ver Detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Template Detail Modal */}
      <TemplateDetailModal
        templateId={selectedTemplateId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onActivate={handleActivateFromModal}
      />
    </div>
  );
}
