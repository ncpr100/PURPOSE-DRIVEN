
'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Plus, Trash2, RefreshCw, Facebook, Twitter, Instagram, Youtube, Music, ExternalLink } from 'lucide-react';

interface SocialMediaAccount {
  id: string;
  platform: string;
  username?: string;
  displayName?: string;
  isActive: boolean;
  lastSync?: string;
  createdAt: string;
}

interface AccountsManagerProps {
  accounts: SocialMediaAccount[];
  onAccountsChanged: () => void;
}

const platformIcons = {
  FACEBOOK: Facebook,
  TWITTER: Twitter,
  INSTAGRAM: Instagram,
  YOUTUBE: Youtube,
  TIKTOK: Music
};

const platformColors = {
  FACEBOOK: 'bg-blue-500',
  TWITTER: 'bg-sky-500',
  INSTAGRAM: 'bg-pink-500',
  YOUTUBE: 'bg-red-500',
  TIKTOK: 'bg-black'
};

const platformNames = {
  FACEBOOK: 'Facebook',
  TWITTER: 'Twitter/X',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'YouTube',
  TIKTOK: 'TikTok'
};

export default function AccountsManager({ accounts, onAccountsChanged }: AccountsManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'FACEBOOK',
    accountId: '',
    username: '',
    displayName: '',
    accessToken: '',
    refreshToken: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      platform: 'FACEBOOK',
      accountId: '',
      username: '',
      displayName: '',
      accessToken: '',
      refreshToken: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.platform || !formData.accountId || !formData.accessToken) {
      toast.error('Plataforma, ID de Cuenta y Token de Acceso son requeridos');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/social-media-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: formData.platform,
          accountId: formData.accountId,
          username: formData.username,
          displayName: formData.displayName,
          accessToken: formData.accessToken,
          refreshToken: formData.refreshToken || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect account');
      }

      toast.success('Cuenta conectada exitosamente');
      setShowAddDialog(false);
      resetForm();
      onAccountsChanged();
    } catch (error: any) {
      console.error('Error connecting account:', error);
      toast.error(error.message || 'Error al conectar cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('¿Estás seguro de que deseas desconectar esta cuenta?')) {
      return;
    }

    try {
      const response = await fetch(`/api/social-media-accounts/${accountId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect account');
      }

      toast.success('Cuenta desconectada exitosamente');
      onAccountsChanged();
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast.error('Error al desconectar cuenta');
    }
  };

  const handleToggleActive = async (accountId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/social-media-accounts/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update account status');
      }

      toast.success(`Cuenta ${!currentStatus ? 'activada' : 'desactivada'} exitosamente`);
      onAccountsChanged();
    } catch (error) {
      console.error('Error updating account status:', error);
      toast.error('Error al actualizar estado de cuenta');
    }
  };

  const getOAuthUrl = (platform: string) => {
    // In a real implementation, these would be actual OAuth URLs
    const urls = {
      FACEBOOK: 'https://www.facebook.com/v18.0/dialog/oauth',
      TWITTER: 'https://api.twitter.com/oauth/authorize',
      INSTAGRAM: 'https://api.instagram.com/oauth/authorize',
      YOUTUBE: 'https://accounts.google.com/oauth2/v2/auth',
      TIKTOK: 'https://www.tiktok.com/auth/authorize'
    };
    return urls[platform as keyof typeof urls] || '#';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Cuentas Conectadas
            </CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Conectar Cuenta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {accounts.length > 0 ? (
            <div className="space-y-4">
              {accounts.map(account => {
                const Icon = platformIcons[account.platform as keyof typeof platformIcons];
                const colorClass = platformColors[account.platform as keyof typeof platformColors];
                const platformName = platformNames[account.platform as keyof typeof platformNames];

                return (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                        {Icon && <Icon className="h-5 w-5 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-medium">{platformName}</h3>
                        <div className="text-sm text-gray-500 space-x-2">
                          <span>{account.displayName || account.username}</span>
                          {account.lastSync && (
                            <span>• Last sync: {new Date(account.lastSync).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge variant={account.isActive ? 'default' : 'secondary'}>
                        {account.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(account.id, account.isActive)}
                      >
                        {account.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Settings className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium">No hay cuentas conectadas</h3>
              <p className="mt-1 text-sm">Conecta tus cuentas de redes sociales para comenzar a publicar posts.</p>
              <div className="mt-6">
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Conectar Cuenta
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      {showAddDialog && (
        <Dialog open={true} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Conectar Cuenta de Redes Sociales</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="platform">Plataforma *</Label>
                <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FACEBOOK">Facebook</SelectItem>
                    <SelectItem value="TWITTER">Twitter/X</SelectItem>
                    <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                    <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Instrucciones de Configuración:</strong>
                </p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Visita el Portal de Desarrolladores de {platformNames[formData.platform as keyof typeof platformNames]}</li>
                  <li>Crea una aplicación y obtén tus claves API</li>
                  <li>Completa el flujo OAuth para obtener el token de acceso</li>
                  <li>Copia la información requerida a continuación</li>
                </ol>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.open(getOAuthUrl(formData.platform), '_blank')}
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Configuración OAuth
                </Button>
              </div>

              <div>
                <Label htmlFor="accountId">ID de Cuenta *</Label>
                <Input
                  id="accountId"
                  value={formData.accountId}
                  onChange={(e) => handleInputChange('accountId', e.target.value)}
                  placeholder="ID de cuenta específico de la plataforma"
                  required
                />
              </div>

              <div>
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="@usuario o nombre"
                />
              </div>

              <div>
                <Label htmlFor="displayName">Nombre para Mostrar</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Nombre de visualización de la cuenta"
                />
              </div>

              <div>
                <Label htmlFor="accessToken">Token de Acceso *</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={formData.accessToken}
                  onChange={(e) => handleInputChange('accessToken', e.target.value)}
                  placeholder="Token de acceso OAuth"
                  required
                />
              </div>

              <div>
                <Label htmlFor="refreshToken">Token de Actualización</Label>
                <Input
                  id="refreshToken"
                  type="password"
                  value={formData.refreshToken}
                  onChange={(e) => handleInputChange('refreshToken', e.target.value)}
                  placeholder="Token de actualización OAuth (opcional)"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Conectando...' : 'Conectar Cuenta'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
