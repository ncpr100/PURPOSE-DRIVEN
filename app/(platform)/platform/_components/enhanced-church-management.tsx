'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Eye,
  Settings,
  Ban,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ChurchData {
  id: string
  name: string
  contactEmail: string
  contactPhone?: string
  city: string
  country: string
  isActive: boolean
  subscription: string
  createdAt: string
  memberCount: number
  activeUsers: number
  lastActivity: string
  monthlyRevenue: number
  healthScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  recentActivity: {
    events: number
    donations: number
    communications: number
  }
}

interface ChurchFilter {
  search: string
  status: 'all' | 'active' | 'inactive'
  risk: 'all' | 'low' | 'medium' | 'high'
  subscription: 'all' | 'free' | 'basic' | 'premium'
}

export default function EnhancedChurchManagement() {
  const [churches, setChurches] = useState<ChurchData[]>([])
  const [filteredChurches, setFilteredChurches] = useState<ChurchData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChurch, setSelectedChurch] = useState<ChurchData | null>(null)
  const [showChurchDetails, setShowChurchDetails] = useState(false)
  
  const [filters, setFilters] = useState<ChurchFilter>({
    search: '',
    status: 'all',
    risk: 'all',
    subscription: 'all'
  })

  const fetchChurches = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/platform/churches/enhanced')
      if (response.ok) {
        const data = await response.json()
        setChurches(data.churches)
        setFilteredChurches(data.churches)
      }
    } catch (error) {
      console.error('Error fetching churches:', error)
      toast.error('Error al cargar las iglesias')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChurchAction = async (churchId: string, action: 'activate' | 'deactivate' | 'reset') => {
    try {
      const response = await fetch(`/api/platform/churches/${churchId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        toast.success(`Acción ${action} completada exitosamente`)
        fetchChurches()
      } else {
        toast.error('Error al ejecutar la acción')
      }
    } catch (error) {
      console.error('Error performing church action:', error)
      toast.error('Error al ejecutar la acción')
    }
  }

  // Filter churches based on criteria
  useEffect(() => {
    let filtered = churches.filter(church => {
      const matchesSearch = church.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           church.contactEmail.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = filters.status === 'all' || 
                           (filters.status === 'active' && church.isActive) ||
                           (filters.status === 'inactive' && !church.isActive)
      
      const matchesRisk = filters.risk === 'all' || 
                         church.riskLevel.toLowerCase() === filters.risk.toLowerCase()
      
      const matchesSubscription = filters.subscription === 'all' || 
                                 church.subscription.toLowerCase() === filters.subscription.toLowerCase()

      return matchesSearch && matchesStatus && matchesRisk && matchesSubscription
    })

    setFilteredChurches(filtered)
  }, [churches, filters])

  useEffect(() => {
    fetchChurches()
  }, [])

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'destructive'
      case 'MEDIUM': return 'secondary'
      default: return 'outline'
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSubscriptionBadgeColor = (subscription: string) => {
    switch (subscription.toLowerCase()) {
      case 'premium': return 'bg-purple-100 text-purple-800'
      case 'basic': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-lg">Cargando gestión de iglesias...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión Avanzada de Iglesias</h2>
          <p className="text-muted-foreground">
            Administración completa de inquilinos con métricas de salud
          </p>
        </div>
        <Button onClick={fetchChurches} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar iglesia o email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters({ ...filters, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nivel de Riesgo</label>
              <Select 
                value={filters.risk} 
                onValueChange={(value) => setFilters({ ...filters, risk: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar riesgo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="low">Bajo</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Suscripción</label>
              <Select 
                value={filters.subscription} 
                onValueChange={(value) => setFilters({ ...filters, subscription: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Iglesias</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredChurches.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredChurches.filter(c => c.isActive).length} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salud Promedio</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(filteredChurches.reduce((sum, c) => sum + c.healthScore, 0) / filteredChurches.length || 0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredChurches.filter(c => c.healthScore >= 70).length} saludables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alto Riesgo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredChurches.filter(c => c.riskLevel === 'HIGH').length}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${filteredChurches.reduce((sum, c) => sum + c.monthlyRevenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total estimado</p>
          </CardContent>
        </Card>
      </div>

      {/* Churches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Iglesias ({filteredChurches.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Iglesia</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Salud</TableHead>
                  <TableHead>Miembros</TableHead>
                  <TableHead>Actividad</TableHead>
                  <TableHead>Ingresos</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChurches.map((church) => (
                  <TableRow key={church.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{church.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {church.city}, {church.country}
                        </div>
                        <Badge className={cn("text-xs mt-1", getSubscriptionBadgeColor(church.subscription))}>
                          {church.subscription}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {church.contactEmail}
                        </div>
                        {church.contactPhone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {church.contactPhone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={church.isActive ? 'default' : 'secondary'}>
                          {church.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                        <Badge variant={getRiskBadgeVariant(church.riskLevel)} className="text-xs">
                          {church.riskLevel}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn("text-lg font-bold", getHealthScoreColor(church.healthScore))}>
                        {church.healthScore}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{church.memberCount}</div>
                        <div className="text-sm text-muted-foreground">
                          {church.activeUsers} activos
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>{church.recentActivity.events} eventos</div>
                        <div>{church.recentActivity.donations} donaciones</div>
                        <div>{church.recentActivity.communications} comunicaciones</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">
                        ${church.monthlyRevenue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedChurch(church)
                            setShowChurchDetails(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChurchAction(church.id, church.isActive ? 'deactivate' : 'activate')}
                        >
                          {church.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Church Details Modal */}
      <Dialog open={showChurchDetails} onOpenChange={setShowChurchDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Iglesia: {selectedChurch?.name}</DialogTitle>
          </DialogHeader>
          {selectedChurch && (
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="metrics">Métricas</TabsTrigger>
                  <TabsTrigger value="activity">Actividad</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información General</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Estado:</span>
                          <Badge variant={selectedChurch.isActive ? 'default' : 'secondary'}>
                            {selectedChurch.isActive ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Suscripción:</span>
                          <Badge className={getSubscriptionBadgeColor(selectedChurch.subscription)}>
                            {selectedChurch.subscription}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Creada:</span>
                          <span>{new Date(selectedChurch.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Última Actividad:</span>
                          <span>{new Date(selectedChurch.lastActivity).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Puntuación de Salud</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className={cn("text-4xl font-bold mb-2", getHealthScoreColor(selectedChurch.healthScore))}>
                            {selectedChurch.healthScore}%
                          </div>
                          <Badge variant={getRiskBadgeVariant(selectedChurch.riskLevel)}>
                            Riesgo {selectedChurch.riskLevel}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="metrics">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Miembros</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedChurch.memberCount}</div>
                        <p className="text-sm text-muted-foreground">{selectedChurch.activeUsers} activos</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Ingresos Mensuales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          ${selectedChurch.monthlyRevenue.toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">Estimado</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>{selectedChurch.recentActivity.events} eventos</div>
                          <div>{selectedChurch.recentActivity.donations} donaciones</div>
                          <div>{selectedChurch.recentActivity.communications} comunicaciones</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Actividad Reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Funcionalidad de actividad detallada disponible próximamente...
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}