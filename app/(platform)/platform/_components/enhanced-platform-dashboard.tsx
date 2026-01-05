'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Activity, Server, Shield, Users, TrendingUp, TrendingDown, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface SystemHealth {
  uptime: number
  responseTime: number
  errorRate: number
  memoryUsage: number
  cpuUsage: number
  diskUsage: number
  activeConnections: number
  requestsPerMinute: number
  lastUpdated: string
}

interface TenantHealth {
  churchId: string
  churchName: string
  isActive: boolean
  subscription: string
  memberCount: number
  recentActivity: number
  activeUsers: number
  totalDonations: number
  daysSinceCreated: number
  healthScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  lastActivity: string
}

interface ResourceMetrics {
  totalDatabaseSize: number
  totalFileStorage: number
  apiRequestsToday: number
  emailsSentToday: number
  smsSentToday: number
  backupStatus: {
    lastBackup: string
    backupSize: number
    status: string
  }
}

interface SecurityMetrics {
  failedLoginAttempts: number
  suspiciousActivities: number
  blockedIPs: number
  lastSecurityScan: string
  vulnerabilitiesFound: number
  securityScore: number
}

interface OperationalAlert {
  id: string
  type: 'INFO' | 'WARNING' | 'CRITICAL'
  message: string
  timestamp: string
}

interface PlatformMonitoringData {
  systemHealth: SystemHealth
  tenantsHealth: TenantHealth[]
  resourceMetrics: ResourceMetrics
  securityMetrics: SecurityMetrics
  operationalAlerts: OperationalAlert[]
  summary: {
    totalTenants: number
    activeTenants: number
    healthyTenants: number
    atRiskTenants: number
    averageHealthScore: number
  }
  timestamp: string
}

export default function EnhancedPlatformDashboard() {
  const [data, setData] = useState<PlatformMonitoringData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchMonitoringData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/platform/monitoring?period=24')
      if (response.ok) {
        const result = await response.json()
        setData(result)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Error fetching monitoring data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonitoringData()
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchMonitoringData, 60000)
    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'WARNING': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default: return <CheckCircle className="h-4 w-4 text-blue-600" />
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'destructive'
      case 'MEDIUM': return 'secondary'
      default: return 'outline'
    }
  }

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-lg">Cargando métricas de la plataforma...</span>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Panel de Control Avanzado</h2>
          <p className="text-muted-foreground">
            Última actualización: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          onClick={fetchMonitoringData} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Actualizar
        </Button>
      </div>

      {/* Operational Alerts */}
      {data.operationalAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertas Operacionales ({data.operationalAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.operationalAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center">
                  {getAlertIcon(alert.type)}
                  <span className="ml-2">{alert.message}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="tenants">Inquilinos</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Iglesias</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.totalTenants}</div>
                <p className="text-xs text-muted-foreground">
                  {data.summary.activeTenants} activas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salud Promedio</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", getHealthScoreColor(data.summary.averageHealthScore))}>
                  {data.summary.averageHealthScore}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.summary.healthyTenants} saludables
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Riesgo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {data.summary.atRiskTenants}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requieren atención
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
                <Server className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {data.systemHealth.uptime}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Últimas 24 horas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU</span>
                    <span className="text-sm">{data.systemHealth.cpuUsage}%</span>
                  </div>
                  <Progress value={data.systemHealth.cpuUsage} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Memoria</span>
                    <span className="text-sm">{data.systemHealth.memoryUsage}%</span>
                  </div>
                  <Progress value={data.systemHealth.memoryUsage} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Disco</span>
                    <span className="text-sm">{data.systemHealth.diskUsage}%</span>
                  </div>
                  <Progress value={data.systemHealth.diskUsage} className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tiempo de Respuesta</span>
                  <Badge variant={data.systemHealth.responseTime > 300 ? "destructive" : "outline"}>
                    {data.systemHealth.responseTime}ms
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tasa de Errores</span>
                  <Badge variant={data.systemHealth.errorRate > 0.1 ? "destructive" : "outline"}>
                    {data.systemHealth.errorRate}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Conexiones Activas</span>
                  <Badge variant="outline">{data.systemHealth.activeConnections}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Requests/min</span>
                  <Badge variant="outline">{data.systemHealth.requestsPerMinute}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso de Recursos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU ({data.systemHealth.cpuUsage}%)</span>
                  </div>
                  <Progress 
                    value={data.systemHealth.cpuUsage} 
                    className={cn(
                      "w-full",
                      data.systemHealth.cpuUsage > 80 && "bg-red-100"
                    )} 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Memoria ({data.systemHealth.memoryUsage}%)</span>
                  </div>
                  <Progress 
                    value={data.systemHealth.memoryUsage} 
                    className={cn(
                      "w-full",
                      data.systemHealth.memoryUsage > 80 && "bg-red-100"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Disco ({data.systemHealth.diskUsage}%)</span>
                  </div>
                  <Progress 
                    value={data.systemHealth.diskUsage} 
                    className={cn(
                      "w-full",
                      data.systemHealth.diskUsage > 80 && "bg-red-100"
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salud de Inquilinos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.tenantsHealth.map((tenant) => (
                  <div key={tenant.churchId} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{tenant.churchName}</h4>
                        <Badge variant={getRiskBadgeVariant(tenant.riskLevel)}>
                          {tenant.riskLevel}
                        </Badge>
                        {!tenant.isActive && <Badge variant="secondary">Inactiva</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tenant.memberCount} miembros • {tenant.activeUsers} activos • 
                        ${tenant.totalDonations.toFixed(2)} donaciones
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-lg font-bold", getHealthScoreColor(tenant.healthScore))}>
                        {tenant.healthScore}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tenant.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Almacenamiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Base de Datos</span>
                  <Badge variant="outline">{data.resourceMetrics.totalDatabaseSize} MB</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Archivos</span>
                  <Badge variant="outline">{data.resourceMetrics.totalFileStorage} MB</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Último Backup</span>
                  <Badge variant={data.resourceMetrics.backupStatus.status === 'SUCCESS' ? 'outline' : 'destructive'}>
                    {data.resourceMetrics.backupStatus.backupSize} MB
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad Diaria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>API Requests</span>
                  <Badge variant="outline">{data.resourceMetrics.apiRequestsToday.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Emails Enviados</span>
                  <Badge variant="outline">{data.resourceMetrics.emailsSentToday.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>SMS Enviados</span>
                  <Badge variant="outline">{data.resourceMetrics.smsSentToday.toLocaleString()}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Puntuación de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {data.securityMetrics.securityScore}%
                  </div>
                  <p className="text-muted-foreground">Sistema Seguro</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad de Seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Intentos de Login Fallidos</span>
                  <Badge variant={data.securityMetrics.failedLoginAttempts > 10 ? 'destructive' : 'outline'}>
                    {data.securityMetrics.failedLoginAttempts}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Actividades Sospechosas</span>
                  <Badge variant={data.securityMetrics.suspiciousActivities > 5 ? 'destructive' : 'outline'}>
                    {data.securityMetrics.suspiciousActivities}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>IPs Bloqueadas</span>
                  <Badge variant="outline">{data.securityMetrics.blockedIPs}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vulnerabilidades</span>
                  <Badge variant={data.securityMetrics.vulnerabilitiesFound > 0 ? 'destructive' : 'outline'}>
                    {data.securityMetrics.vulnerabilitiesFound}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}