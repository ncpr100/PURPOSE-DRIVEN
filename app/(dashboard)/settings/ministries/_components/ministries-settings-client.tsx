'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, Plus, Edit, Trash2, Save, AlertCircle, CheckCircle, Heart, Users
} from 'lucide-react';
import { toast } from 'sonner';

interface Ministry {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  churchId: string;
}

interface MinistriesSettingsClientProps {
  churchId: string;
  userRole: string;
  initialMinistries: Ministry[];
}

export default function MinistriesSettingsClient({
  churchId,
  userRole,
  initialMinistries
}: MinistriesSettingsClientProps) {
  const [ministries, setMinistries] = useState<Ministry[]>(initialMinistries);
  const [saving, setSaving] = useState(false);
  
  // Ministry form state
  const [ministryForm, setMinistryForm] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [editingMinistry, setEditingMinistry] = useState<string | null>(null);
  const [ministryDialogOpen, setMinistryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ministryToDelete, setMinistryToDelete] = useState<string | null>(null);

  const resetForm = () => {
    setMinistryForm({
      name: '',
      description: '',
      isActive: true
    });
    setEditingMinistry(null);
  };

  const handleCreateMinistry = async () => {
    if (!ministryForm.name.trim()) {
      toast.error('El nombre del ministerio es requerido');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/ministries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ministryForm,
          churchId
        })
      });

      if (response.ok) {
        const newMinistry = await response.json();
        setMinistries(prev => [...prev, newMinistry]);
        resetForm();
        setMinistryDialogOpen(false);
        toast.success('Ministerio creado exitosamente');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al crear ministerio');
      }
    } catch (error) {
      toast.error('Error al crear ministerio');
    } finally {
      setSaving(false);
    }
  };

  const handleEditMinistry = async () => {
    if (!editingMinistry) return;
    if (!ministryForm.name.trim()) {
      toast.error('El nombre del ministerio es requerido');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/ministries/${editingMinistry}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ministryForm.name,
          description: ministryForm.description,
          isActive: ministryForm.isActive
        })
      });

      if (response.ok) {
        const updatedMinistry = await response.json();
        setMinistries(prev => prev.map(m => 
          m.id === editingMinistry ? updatedMinistry : m
        ));
        resetForm();
        setMinistryDialogOpen(false);
        toast.success('Ministerio actualizado exitosamente');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al actualizar ministerio');
      }
    } catch (error) {
      toast.error('Error al actualizar ministerio');
    } finally {
      setSaving(false);
    }
  };

  const openEditDialog = (ministry: Ministry) => {
    setEditingMinistry(ministry.id);
    setMinistryForm({
      name: ministry.name,
      description: ministry.description || '',
      isActive: ministry.isActive
    });
    setMinistryDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setMinistryDialogOpen(true);
  };

  const toggleMinistryStatus = async (ministryId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/ministries/${ministryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        setMinistries(prev => prev.map(m => 
          m.id === ministryId ? { ...m, isActive } : m
        ));
        toast.success(`Ministerio ${isActive ? 'activado' : 'desactivado'}`);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al actualizar ministerio');
      }
    } catch (error) {
      toast.error('Error al actualizar ministerio');
    }
  };

  const handleDeleteMinistry = async () => {
    if (!ministryToDelete) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/ministries/${ministryToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMinistries(prev => prev.filter(m => m.id !== ministryToDelete));
        setDeleteDialogOpen(false);
        setMinistryToDelete(null);
        toast.success('Ministerio eliminado exitosamente');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al eliminar ministerio');
      }
    } catch (error) {
      toast.error('Error al eliminar ministerio');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (ministryId: string) => {
    setMinistryToDelete(ministryId);
    setDeleteDialogOpen(true);
  };

  const activeMinistries = ministries.filter(m => m.isActive);
  const inactiveMinistries = ministries.filter(m => !m.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="h-8 w-8 text-purple-600" />
            Gestión de Ministerios
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra los ministerios de tu iglesia
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Ministerio
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Los ministerios se utilizan en el sistema de miembros, voluntarios y asignaciones de eventos.
          Puedes activar/desactivar ministerios sin eliminarlos para mantener el historial.
        </AlertDescription>
      </Alert>

      {/* Active Ministries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Ministerios Activos
          </CardTitle>
          <CardDescription>
            {activeMinistries.length} ministerio{activeMinistries.length !== 1 ? 's' : ''} activo{activeMinistries.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeMinistries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay ministerios activos</p>
              <Button onClick={openCreateDialog} variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Crear primer ministerio
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeMinistries.map((ministry) => (
                <div key={ministry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{ministry.name}</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Activo
                      </Badge>
                    </div>
                    {ministry.description && (
                      <p className="text-sm text-muted-foreground">{ministry.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={ministry.isActive}
                      onCheckedChange={(checked) => toggleMinistryStatus(ministry.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(ministry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(ministry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive Ministries */}
      {inactiveMinistries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Settings className="h-5 w-5" />
              Ministerios Inactivos
            </CardTitle>
            <CardDescription>
              {inactiveMinistries.length} ministerio{inactiveMinistries.length !== 1 ? 's' : ''} inactivo{inactiveMinistries.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inactiveMinistries.map((ministry) => (
                <div key={ministry.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-1 flex-1 opacity-60">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{ministry.name}</h3>
                      <Badge variant="secondary">Inactivo</Badge>
                    </div>
                    {ministry.description && (
                      <p className="text-sm text-muted-foreground">{ministry.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={ministry.isActive}
                      onCheckedChange={(checked) => toggleMinistryStatus(ministry.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(ministry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(ministry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Ministry Dialog */}
      <Dialog open={ministryDialogOpen} onOpenChange={setMinistryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMinistry ? 'Editar Ministerio' : 'Nuevo Ministerio'}
            </DialogTitle>
            <DialogDescription>
              {editingMinistry 
                ? 'Actualiza la información del ministerio'
                : 'Crea un nuevo ministerio para tu iglesia'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ministry-name">Nombre *</Label>
              <Input
                id="ministry-name"
                placeholder="Ej: Ministerio de Jóvenes"
                value={ministryForm.name}
                onChange={(e) => setMinistryForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ministry-description">Descripción</Label>
              <Textarea
                id="ministry-description"
                placeholder="Descripción del ministerio (opcional)"
                value={ministryForm.description}
                onChange={(e) => setMinistryForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            {editingMinistry && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Estado</Label>
                  <p className="text-sm text-muted-foreground">
                    {ministryForm.isActive ? 'Ministerio activo' : 'Ministerio inactivo'}
                  </p>
                </div>
                <Switch
                  checked={ministryForm.isActive}
                  onCheckedChange={(checked) => setMinistryForm(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setMinistryDialogOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingMinistry ? handleEditMinistry : handleCreateMinistry}
              disabled={saving}
            >
              {saving ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingMinistry ? 'Actualizar' : 'Crear'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este ministerio? Esta acción no se puede deshacer.
              <br /><br />
              <strong>Recomendación:</strong> En lugar de eliminar, considera desactivar el ministerio 
              para mantener el historial de asignaciones y datos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setMinistryToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMinistry}
              disabled={saving}
            >
              {saving ? 'Eliminando...' : 'Eliminar Ministerio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
