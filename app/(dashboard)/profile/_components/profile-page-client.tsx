'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  ChevronRight,
  Activity,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Edit3,
  Upload,
  Camera,
  Settings,
  Lock,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import ChangePasswordDialog from './change-password-dialog'

interface ProfilePageClientProps {
  userRole: string
  churchId: string
}

export function ProfilePageClient({ userRole, churchId }: ProfilePageClientProps) {
  const { data: session, status, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [isFirstLogin, setIsFirstLogin] = useState(false)

  // Check if user needs to change password (first login)
  useEffect(() => {
    const checkFirstLogin = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}/status`)
          if (response.ok) {
            const data = await response.json()
            if (data.isFirstLogin) {
              setIsFirstLogin(true)
              setShowPasswordDialog(true)
            }
          }
        } catch (error) {
          console.error('Error checking first login:', error)
        }
      }
    }
    checkFirstLogin()
  }, [session])
  
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    birthDate: '',
    bio: '',
    emergencyContact: '',
    emergencyPhone: '',
    membershipDate: '',
    spiritualGifts: [] as string[],
    ministries: [] as string[],
    skills: [] as string[],
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyUpdates: true,
    eventReminders: true,
    prayerRequests: true,
    privacyLevel: 'church', // public, church, private
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: new Date(),
    activeDevices: 3,
  })

  const updateProfile = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        toast.success('Perfil actualizado exitosamente')
        // Update session data if name or email changed
        if (profileData.name !== session.user.name) {
          await update({
            name: profileData.name,
          })
        }
      } else {
        throw new Error('Error al actualizar perfil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        toast.success('Preferencias actualizadas exitosamente')
      } else {
        throw new Error('Error al actualizar preferencias')
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Error al actualizar preferencias')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (response.ok) {
        toast.success('Contraseña actualizada exitosamente')
      } else {
        const error = await response.text()
        throw new Error(error || 'Error al actualizar contraseña')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Error al actualizar contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No se pudo cargar la información del perfil.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu información personal y configuraciones
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {userRole?.toLowerCase()?.replace('_', ' ')}
        </Badge>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
              <AvatarFallback className="text-lg">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{session.user.name}</h2>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Cuenta verificada</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Preferencias
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Actividad
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualiza tu información personal y datos de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Tu dirección completa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Cuéntanos un poco sobre ti..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={updateProfile} disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setProfileData({
                    name: session?.user?.name || '',
                    email: session?.user?.email || '',
                    phone: '',
                    address: '',
                    birthDate: '',
                    bio: '',
                    emergencyContact: '',
                    emergencyPhone: '',
                    membershipDate: '',
                    spiritualGifts: [],
                    ministries: [],
                    skills: [],
                  })
                }}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Configura cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo electrónico</p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones SMS</Label>
                    <p className="text-sm text-muted-foreground">Recibe mensajes de texto importantes</p>
                  </div>
                  <Switch
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones Push</Label>
                    <p className="text-sm text-muted-foreground">Notificaciones en tiempo real en tu dispositivo</p>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Label htmlFor="privacy">Nivel de Privacidad</Label>
                <Select
                  value={preferences.privacyLevel}
                  onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, privacyLevel: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona nivel de privacidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Público - Visible para todos</SelectItem>
                    <SelectItem value="church">Iglesia - Solo miembros de la iglesia</SelectItem>
                    <SelectItem value="private">Privado - Solo yo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={updatePreferences} disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Preferencias'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>
                Gestiona la seguridad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span className="font-medium">Cambiar Contraseña</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Última actualización: {securitySettings.lastPasswordChange.toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    Cambiar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      <span className="font-medium">Autenticación de Dos Factores</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {securitySettings.twoFactorEnabled ? 'Activada' : 'Desactivada'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {securitySettings.twoFactorEnabled ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span className="font-medium">Dispositivos Activos</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {securitySettings.activeDevices} dispositivos conectados
                    </p>
                    <Button variant="outline" size="sm">
                      Ver Dispositivos
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>
                Tu actividad en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">Perfil actualizado</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">Inicio de sesión</p>
                    <p className="text-xs text-muted-foreground">Hace 1 día</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">Completaste tu evaluación espiritual</p>
                    <p className="text-xs text-muted-foreground">Hace 3 días</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <ChangePasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        isFirstLogin={isFirstLogin}
        canClose={!isFirstLogin}
      />
    </div>
  )
}