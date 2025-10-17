/**
 * Template Detail Modal Component
 * Shows full template configuration with customization form
 * and workflow preview
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowRight,
  Clock,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface TemplateDetail {
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
  businessHoursConfig?: any;
  urgentMode24x7: boolean;
  retryConfig?: any;
  fallbackChannels?: string[];
  createManualTaskOnFail: boolean;
  escalationConfig?: any;
  triggerConfig: any;
  conditionsConfig: any[];
  actionsConfig: any[];
  installCount: number;
  tags: string[];
}

interface TemplateDetailModalProps {
  templateId: string | null;
  open: boolean;
  onClose: () => void;
  onActivate: (templateId: string, customizations: any) => Promise<void>;
}

export function TemplateDetailModal({
  templateId,
  open,
  onClose,
  onActivate
}: TemplateDetailModalProps) {
  const [template, setTemplate] = useState<TemplateDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [customizations, setCustomizations] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    if (templateId && open) {
      fetchTemplateDetails();
    }
  }, [templateId, open]);

  const fetchTemplateDetails = async () => {
    if (!templateId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/automation-templates/${templateId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch template details');
      }

      const data = await response.json();
      setTemplate(data.template);
      
      // Initialize customizations with template defaults
      setCustomizations({
        name: data.template.name,
        priorityLevel: data.template.priorityLevel,
        businessHoursOnly: data.template.businessHoursOnly,
        urgentMode24x7: data.template.urgentMode24x7,
        createManualTaskOnFail: data.template.createManualTaskOnFail,
        bypassApproval: true
      });
    } catch (error) {
      console.error('Error fetching template details:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los detalles de la plantilla',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!template) return;

    try {
      setActivating(true);
      await onActivate(template.id, customizations);
      
      toast({
        title: 'Plantilla Activada',
        description: `"${template.name}" se activó correctamente`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error activating template:', error);
      toast({
        title: 'Error',
        description: 'No se pudo activar la plantilla',
        variant: 'destructive'
      });
    } finally {
      setActivating(false);
    }
  };

  if (loading || !template) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pr-10">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
              style={{ backgroundColor: template.color + '20' }}
            >
              {template.icon}
            </div>
            <div>
              <DialogTitle>{template.name}</DialogTitle>
              <DialogDescription>{template.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="workflow" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflow">Flujo de Trabajo</TabsTrigger>
            <TabsTrigger value="customize">Personalizar</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
          </TabsList>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            {/* Trigger */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Disparador</h3>
              </div>
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="font-medium">{template.triggerConfig.type}</p>
                {template.triggerConfig.eventSource && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Origen: {template.triggerConfig.eventSource}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            {/* Conditions */}
            {template.conditionsConfig && template.conditionsConfig.length > 0 && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold">Condiciones</h3>
                  </div>
                  <div className="space-y-2">
                    {template.conditionsConfig.map((condition: any, index: number) => (
                      <div key={index} className="rounded-lg border p-4 bg-muted/50">
                        <p className="text-sm">
                          <span className="font-medium">{condition.field}</span>{' '}
                          <span className="text-muted-foreground">{condition.operator}</span>{' '}
                          <span className="font-medium">{JSON.stringify(condition.value)}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              </>
            )}

            {/* Actions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Acciones</h3>
              </div>
              <div className="space-y-3">
                {template.actionsConfig.map((action: any, index: number) => (
                  <div key={index} className="rounded-lg border p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{action.type}</p>
                        {action.configuration && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {Object.keys(action.configuration).length} configuraciones
                          </p>
                        )}
                      </div>
                      {action.delay > 0 && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor(action.delay / 60)} min
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Retry & Fallback */}
            {(template.retryConfig || template.fallbackChannels) && (
              <>
                <Separator />
                <div className="space-y-3">
                  {template.retryConfig && (
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw className="h-4 w-4" />
                      <span>
                        Reintentos: {template.retryConfig.maxRetries}x con espera exponencial
                      </span>
                    </div>
                  )}
                  {template.fallbackChannels && template.fallbackChannels.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowRight className="h-4 w-4" />
                      <span>
                        Canales de respaldo: {template.fallbackChannels.join(' → ')}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Regla</Label>
                <Input
                  id="name"
                  value={customizations.name || ''}
                  onChange={(e) => setCustomizations({ ...customizations, name: e.target.value })}
                  placeholder="Ej: Bienvenida Personalizada"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Nivel de Prioridad</Label>
                <Select
                  value={customizations.priorityLevel}
                  onValueChange={(value) => setCustomizations({ ...customizations, priorityLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URGENT">🔴 URGENTE</SelectItem>
                    <SelectItem value="HIGH">🟠 ALTA</SelectItem>
                    <SelectItem value="NORMAL">🟢 NORMAL</SelectItem>
                    <SelectItem value="LOW">⚪ BAJA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Horario Laboral</Label>
                  <p className="text-sm text-muted-foreground">
                    Ejecutar solo durante horas de trabajo
                  </p>
                </div>
                <Switch
                  checked={customizations.businessHoursOnly}
                  onCheckedChange={(checked) => 
                    setCustomizations({ ...customizations, businessHoursOnly: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Urgente 24/7</Label>
                  <p className="text-sm text-muted-foreground">
                    Ignorar horario laboral para casos urgentes
                  </p>
                </div>
                <Switch
                  checked={customizations.urgentMode24x7}
                  onCheckedChange={(checked) => 
                    setCustomizations({ ...customizations, urgentMode24x7: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Omitir Aprobación Manual</Label>
                  <p className="text-sm text-muted-foreground">
                    Ejecutar acciones inmediatamente sin aprobación
                  </p>
                </div>
                <Switch
                  checked={customizations.bypassApproval}
                  onCheckedChange={(checked) => 
                    setCustomizations({ ...customizations, bypassApproval: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Crear Tarea Manual al Fallar</Label>
                  <p className="text-sm text-muted-foreground">
                    Crear tarea manual si todos los canales fallan
                  </p>
                </div>
                <Switch
                  checked={customizations.createManualTaskOnFail}
                  onCheckedChange={(checked) => 
                    setCustomizations({ ...customizations, createManualTaskOnFail: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <div className="grid gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoría</span>
                <span className="font-medium">{template.category}</span>
              </div>
              {template.subcategory && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subcategoría</span>
                  <span className="font-medium">{template.subcategory}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instalaciones</span>
                <span className="font-medium">{template.installCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plantilla del Sistema</span>
                <span className="font-medium">{template.isSystemTemplate ? 'Sí' : 'No'}</span>
              </div>

              <Separator />

              {template.tags.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2">Etiquetas</p>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={activating}>
            Cancelar
          </Button>
          <Button onClick={handleActivate} disabled={activating}>
            {activating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activando...
              </>
            ) : (
              'Activar Plantilla'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
