

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  Users,
  DollarSign,
  Activity,
  Settings,
  Edit
} from 'lucide-react'
import Link from 'next/link'

interface Church {
  id: string
  name: string
  email: string
  address: string | null
  phone: string | null
  website: string | null
  founded: string | null
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    users: number
    members: number
    events: number
    donations: number
  }
  stats: {
    totalMembers: number
    activeUsers: number
    totalEvents: number
    totalDonations: number
  }
}

export default function ChurchDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [church, setChurch] = useState<Church | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchChurchDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/platform/churches/${params.id}`)
        
        if (response.ok) {
          const data = await response.json()
          setChurch(data.church)
        } else if (response.status === 404) {
          setError('Iglesia no encontrada')
        } else {
          setError('Error al cargar los detalles de la iglesia')
        }
      } catch (error) {
        console.error('Error fetching church details:', error)
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchChurchDetails()
    }
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="h-6 bg-muted rounded w-64 animate-pulse"></div>
        </div>
        
        <div className="grid gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/platform/churches">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Error</h1>
        </div>
        
        <Card>
          <CardContent className="text-center p-12">
            <Building2 className="h-16 w-16 text-[hsl(var(--destructive)/0.8)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[hsl(var(--destructive))] mb-2">{error}</h3>
            <p className="text-[hsl(var(--destructive))] mb-6">No se pudieron cargar los detalles de la iglesia</p>
            <Button asChild>
              <Link href="/platform/churches">
                Volver a Iglesias
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!church) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/platform/churches">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg btn-cta-gradient flex items-center justify-center text-white font-bold text-xl">
                {church.name.charAt(0)}
              </div>
              {church.name}
            </h1>
            <p className="text-muted-foreground mt-1">Detalles completos de la iglesia</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {church.isActive ? (
            <Badge variant="default" className="bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]">
              <Activity className="h-3 w-3 mr-1" />
              Activa
            </Badge>
          ) : (
            <Badge variant="destructive">
              <Activity className="h-3 w-3 mr-1" />
              Inactiva
            </Badge>
          )}
          <Button asChild>
            <Link href={`/platform/churches/${church.id}/settings`}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="text-sm text-foreground mt-1">{church.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground/70" />
                    <a href={`mailto:${church.email}`} className="text-sm text-[hsl(var(--info))] hover:underline">
                      {church.email}
                    </a>
                  </div>
                </div>
                
                {church.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground/70" />
                      <a href={`tel:${church.phone}`} className="text-sm text-[hsl(var(--info))] hover:underline">
                        {church.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {church.website && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Sitio Web</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4 text-muted-foreground/70" />
                      <a href={church.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[hsl(var(--info))] hover:underline">
                        {church.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {church.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground/70 mt-0.5" />
                    <p className="text-sm text-foreground">{church.address}</p>
                  </div>
                </div>
              )}
              
              {church.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                  <p className="text-sm text-foreground mt-1">{church.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-[hsl(var(--info)/0.10)] rounded-lg">
                <div className="w-2 h-2 bg-[hsl(var(--info))] rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Registrada en la Plataforma</p>
                  <p className="text-sm text-[hsl(var(--info))]">{formatDate(church.createdAt)}</p>
                </div>
              </div>
              
              {church.founded && (
                <div className="flex items-center gap-4 p-3 bg-[hsl(var(--success)/0.10)] rounded-lg">
                  <div className="w-2 h-2 bg-[hsl(var(--success))] rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Iglesia Fundada</p>
                    <p className="text-sm text-[hsl(var(--success))]">
                      {new Date(church.founded).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Última Actualización</p>
                  <p className="text-sm text-muted-foreground">{formatDate(church.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-[hsl(var(--info)/0.10)] rounded-lg">
                  <Users className="h-6 w-6 text-[hsl(var(--info))] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[hsl(var(--info))]">{church.stats.activeUsers}</div>
                  <div className="text-xs text-[hsl(var(--info))]">Usuarios Activos</div>
                </div>
                
                <div className="text-center p-3 bg-[hsl(var(--success)/0.10)] rounded-lg">
                  <Users className="h-6 w-6 text-[hsl(var(--success))] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[hsl(var(--success))]">{church.stats.totalMembers}</div>
                  <div className="text-xs text-[hsl(var(--success))]">Miembros Totales</div>
                </div>
                
                <div className="text-center p-3 bg-[hsl(var(--lavender)/0.10)] rounded-lg">
                  <Calendar className="h-6 w-6 text-[hsl(var(--lavender))] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[hsl(var(--lavender))]">{church.stats.totalEvents}</div>
                  <div className="text-xs text-[hsl(var(--lavender))]">Eventos</div>
                </div>
                
                <div className="text-center p-3 bg-[hsl(var(--warning)/0.10)] rounded-lg">
                  <DollarSign className="h-6 w-6 text-[hsl(var(--warning))] mx-auto mb-2" />
                  <div className="text-lg font-bold text-[hsl(var(--warning))]">
                    {formatCurrency(church.stats.totalDonations)}
                  </div>
                  <div className="text-xs text-[hsl(var(--warning))]">Donaciones</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/platform/churches/${church.id}/users`}>
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Usuarios
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/platform/churches/${church.id}/settings`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Link>
              </Button>
              
              <Separator />
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/platform/analytics">
                  <Activity className="h-4 w-4 mr-2" />
                  Ver Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

