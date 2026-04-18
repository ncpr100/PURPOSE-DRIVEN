

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Church,
  Activity,
  UserCheck,
  UserX,
  Edit
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  church: {
    id: string
    name: string
  } | null
}

const ROLE_NAMES = {
  'SUPER_ADMIN': 'Super Administrador',
  'ADMIN_IGLESIA': 'Administrador de Iglesia',
  'PASTOR': 'Pastor',
  'LIDER': 'Líder',
  'MIEMBRO': 'Miembro'
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchUserDetails()
    }
  }, [params.id])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/platform/users/${params.id}`)
      
      if (response.ok) {
        const payload = await response.json()
        // API returns { user: {...} } — unwrap the nested user object
        setUser(payload.user ?? payload)
      } else {
        toast.error('Error al cargar los detalles del usuario')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.20)]'
      case 'ADMIN_IGLESIA':
        return 'bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))] hover:bg-[hsl(var(--info)/0.20)]'
      case 'PASTOR':
        return 'bg-[hsl(var(--lavender)/0.15)] text-[hsl(var(--lavender))] hover:bg-[hsl(var(--lavender)/0.20)]'
      case 'LIDER':
        return 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] hover:bg-[hsl(var(--warning)/0.15)]'
      default:
        return 'bg-muted/50 text-muted-foreground hover:bg-muted'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Cargando...</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Usuario no encontrado</h1>
        </div>
        <p className="text-muted-foreground">No se pudo encontrar el usuario solicitado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Detalles del Usuario</h1>
            <p className="text-muted-foreground">Información completa del usuario</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/platform/users/${user.id}/role`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Rol
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Correo Electrónico</label>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Rol</label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <Badge variant="secondary" className={getRoleColor(user.role)}>
                    {ROLE_NAMES[user.role as keyof typeof ROLE_NAMES] || user.role}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <div className="flex items-center gap-2">
                  {user.isActive ? (
                    <>
                      <UserCheck className="h-4 w-4 text-[hsl(var(--success))]" />
                      <Badge variant="secondary" className="bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] hover:bg-[hsl(var(--success)/0.20)]">
                        Activo
                      </Badge>
                    </>
                  ) : (
                    <>
                      <UserX className="h-4 w-4 text-[hsl(var(--destructive))]" />
                      <Badge variant="destructive">
                        Inactivo
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Church Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Church className="h-5 w-5" />
              Iglesia Asociada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.church ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre de la Iglesia</label>
                  <p className="text-lg font-medium">{user.church.name}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/platform/churches/${user.church?.id}/details`)}
                >
                  Ver Detalles de la Iglesia
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Church className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Sin iglesia asignada</p>
                <p className="text-sm">Este usuario no está asociado a ninguna iglesia</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

