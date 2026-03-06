
import { MarketingCampaign } from '@/types/social-media';
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, DollarSign, Calendar, Tags, Users } from 'lucide-react';


interface CampaignFormProps {
  campaign?: MarketingCampaign | null;
  onClose: () => void;
  onCampaignCreated: (campaign: MarketingCampaign) => void;
  onCampaignUpdated: (campaign: MarketingCampaign) => void;
}

const platformOptions = [
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'TWITTER', label: 'Twitter/X' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'LINKEDIN', label: 'LinkedIn' }
];

const objectiveOptions = [
  { value: 'brand_awareness', label: 'Reconocimiento de marca' },
  { value: 'engagement', label: 'Participación' },
  { value: 'lead_generation', label: 'Generación de contactos' },
  { value: 'event_promotion', label: 'Promoción de eventos' },
  { value: 'community_growth', label: 'Crecimiento comunitario' },
  { value: 'content_promotion', label: 'Promoción de contenido' }
];

export default function CampaignForm({
  campaign,
  onClose,
  onCampaignCreated,
  onCampaignUpdated
}: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    currency: 'USD',
    startDate: '',
    endDate: '',
    status: 'DRAFT',
    targetAudience: {
      demographics: '',
      interests: '',
      location: '',
      ageRange: ''
    }
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        description: campaign.description || '',
        budget: campaign.budget?.toString() || '',
        currency: campaign.currency,
        startDate: new Date(campaign.startDate).toISOString().slice(0, 16),
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 16) : '',
        status: campaign.status,
        targetAudience: campaign.targetAudience ? JSON.parse(campaign.targetAudience) : {
          demographics: '',
          interests: '',
          location: '',
          ageRange: ''
        }
      });

      setSelectedPlatforms(campaign.platforms ? JSON.parse(campaign.platforms) : []);
      setSelectedObjectives(campaign.objectives ? JSON.parse(campaign.objectives) : []);
      setTags(campaign.tags ? JSON.parse(campaign.tags) : []);
    }
  }, [campaign]);

  const handleInputChange = (field: string, value: string | object) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleObjectiveToggle = (objective: string) => {
    setSelectedObjectives(prev =>
      prev.includes(objective)
        ? prev.filter(o => o !== objective)
        : [...prev, objective]
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTargetAudienceChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Campaign name is required');
      return;
    }

    if (!formData.startDate) {
      toast.error('La fecha de inicio es requerida');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Por favor seleccione al menos una plataforma');
      return;
    }

    setIsSubmitting(true);

    try {
      const campaignData = {
        name: formData.name,
        description: formData.description || null,
        objectives: selectedObjectives.length > 0 ? selectedObjectives : null,
        targetAudience: Object.values(formData.targetAudience).some(v => v) ? formData.targetAudience : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        currency: formData.currency,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        status: formData.status,
        platforms: selectedPlatforms,
        tags: tags.length > 0 ? tags : null
      };

      const url = campaign ? `/api/marketing-campaigns/${campaign.id}` : '/api/marketing-campaigns';
      const method = campaign ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la campaña');
      }

      const savedCampaign = await response.json();

      if (campaign) {
        onCampaignUpdated(savedCampaign);
      } else {
        onCampaignCreated(savedCampaign);
      }
    } catch (error: any) {
      console.error('Error saving campaign:', error);
      toast.error(error.message || 'Error al guardar la campaña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {campaign ? 'Editar Campaña' : 'Crear Nueva Campaña'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Basic Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Target className="mr-2 h-4 w-4" />
                    <h3 className="font-medium">Detalles de la Campaña</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre de Campaña *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Campaña Domingo de Resurrección"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describa los objetivos y mensaje de su campaña..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget">Presupuesto</Label>
                        <Input
                          id="budget"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Moneda</Label>
                        <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="COP">COP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Fecha de Inicio *</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Fecha de Fin</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          min={formData.startDate}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Borrador</SelectItem>
                          <SelectItem value="ACTIVE">Activa</SelectItem>
                          <SelectItem value="PAUSED">En pausa</SelectItem>
                          <SelectItem value="COMPLETED">Completada</SelectItem>
                          <SelectItem value="CANCELLED">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Users className="mr-2 h-4 w-4" />
                    <h3 className="font-medium">Público Objetivo</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="demographics">Demógraficos</Label>
                      <Input
                        id="demographics"
                        value={formData.targetAudience.demographics}
                        onChange={(e) => handleTargetAudienceChange('demographics', e.target.value)}
                        placeholder="Adultos, familias, jóvenes profesionales..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="interests">Intereses</Label>
                      <Input
                        id="interests"
                        value={formData.targetAudience.interests}
                        onChange={(e) => handleTargetAudienceChange('interests', e.target.value)}
                        placeholder="Fe, comunidad, adoración..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={formData.targetAudience.location}
                        onChange={(e) => handleTargetAudienceChange('location', e.target.value)}
                        placeholder="Ciudad, región o área..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="ageRange">Rango de Edad</Label>
                      <Input
                        id="ageRange"
                        value={formData.targetAudience.ageRange}
                        onChange={(e) => handleTargetAudienceChange('ageRange', e.target.value)}
                        placeholder="18-65, 25-45, etc..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Platforms */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <h3 className="font-medium">Plataformas Objetivo *</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {platformOptions.map(platform => (
                      <div key={platform.value} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedPlatforms.includes(platform.value)}
                          onCheckedChange={() => handlePlatformToggle(platform.value)}
                        />
                        <Label className="cursor-pointer">{platform.label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Objectives */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Target className="mr-2 h-4 w-4" />
                    <h3 className="font-medium">Objetivos de la Campaña</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {objectiveOptions.map(objective => (
                      <div key={objective.value} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedObjectives.includes(objective.value)}
                          onCheckedChange={() => handleObjectiveToggle(objective.value)}
                        />
                        <Label className="cursor-pointer">{objective.label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Tags className="mr-2 h-4 w-4" />
                    <h3 className="font-medium">Tags</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Añadir etiqueta..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag} size="sm">
                        Añadir
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : campaign ? 'Actualizar Campaña' : 'Crear Campaña'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
