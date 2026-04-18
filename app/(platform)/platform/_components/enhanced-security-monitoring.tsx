'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Ban,
  Activity,
  RefreshCw,
  Download,
  Clock,
  Users,
  Server,
  Database,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface SecurityMetrics {
  overallScore: number
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  lastScanTime: string
  vulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
  accessAttempts: {
    successful: number
    failed: number
    blocked: number
    suspicious: number
  }
  systemSecurity: {
    firewallStatus: 'ACTIVE' | 'INACTIVE'
    encryptionStatus: 'ENABLED' | 'DISABLED'
    backupStatus: 'CURRENT' | 'OUTDATED'
    updateStatus: 'CURRENT' | 'PENDING'
  }
  recentIncidents: SecurityIncident[]
  auditLogs: AuditLogEntry[]
}

interface SecurityIncident {
  id: string
  type: 'LOGIN_ATTEMPT' | 'SUSPICIOUS_ACTIVITY' | 'SYSTEM_BREACH' | 'DATA_ACCESS'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  timestamp: string
  resolved: boolean
  affectedResource: string
  sourceIP?: string
  userAgent?: string
}

interface AuditLogEntry {
  id: string
  action: string
  user: string
  resource: string
  timestamp: string
  result: 'SUCCESS' | 'FAILURE' | 'BLOCKED'
  details: string
}

export default function EnhancedSecurityMonitoring() {
  const [securityData, setSecurityData] = useState<SecurityMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [activeIncident, setActiveIncident] = useState<SecurityIncident | null>(null)

  const fetchSecurityData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/platform/security/monitoring')
      if (response.ok) {
        const result = await response.json()
        setSecurityData(result)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Error fetching security data:', error)
      toast.error('Error al cargar datos de seguridad')
    } finally {
      setIsLoading(false)
    }
  }

  const handleIncidentAction = async (incidentId: string, action: 'resolve' | 'investigate' | 'block') => {
    try {
      const response = await fetch(`/api/platform/security/incidents/${incidentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        toast.success(`Incidente ${action === 'resolve' ? 'resuelto' : action === 'investigate' ? 'marcado para investigación' : 'bloqueado'}`)
        fetchSecurityData()
      } else {
        toast.error('Error al procesar el incidente')
      }
    } catch (error) {
      console.error('Error handling incident:', error)
      toast.error('Error al procesar el incidente')
    }
  }

  const exportSecurityReport = async () => {
    try {
      const response = await fetch('/api/platform/security/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: '30d' })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `security-report-${new Date().toISOString().split('T')[0]}.pdf`
        a.click()
        toast.success('Reporte de seguridad descargado')
      }
    } catch (error) {
      console.error('Error exporting security report:', error)
      toast.error('Error al descargar el reporte')
    }
  }

  useEffect(() => {
    fetchSecurityData()
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchSecurityData, 120000)
    return () => clearInterval(interval)
  }, [])

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.15)]'
      case 'HIGH': return 'text-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.15)]'
      case 'MEDIUM': return 'text-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.15)]'
      default: return 'text-[hsl(var(--success))] bg-[hsl(var(--success)/0.15)]'
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive'
      case 'HIGH': return 'destructive'
      case 'MEDIUM': return 'secondary'
      default: return 'outline'
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
      case 'FAILURE': return <XCircle className="h-4 w-4 text-[hsl(var(--destructive))]" />
      case 'BLOCKED': return <Ban className="h-4 w-4 text-[hsl(var(--warning))]" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (isLoading && !securityData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-[hsl(var(--lavender))]" />
        <span className="ml-2 text-lg">Cargando métricas de seguridad...</span>
      </div>
    )
  }

  if (!securityData) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Shield className="h-7 w-7 mr-2 text-[hsl(var(--info))]" />
            Centro de Seguridad Avanzado
          </h2>
          <p className="text-muted-foreground">
            Última actualización: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={exportSecurityReport}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
          <Button 
            onClick={fetchSecurityData} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Security Score Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.10)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--info))]">Puntuación General</CardTitle>
            <Shield className="h-4 w-4 text-[hsl(var(--info))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--info))]">
              {securityData.overallScore}%
            </div>
            <Progress value={securityData.overallScore} className="w-full mt-2" />
          </CardContent>
        </Card>

        <Card className={cn("border-2", getThreatLevelColor(securityData.threatLevel))}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel de Amenaza</CardTitle>
            <AlertTriangle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityData.threatLevel}
            </div>
            <p className="text-xs text-muted-foreground">
              Último escaneo: {new Date(securityData.lastScanTime).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilidades</CardTitle>
            <Activity className="h-4 w-4 text-[hsl(var(--destructive))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--destructive))]">
              {securityData.vulnerabilities.critical + securityData.vulnerabilities.high}
            </div>
            <p className="text-xs text-muted-foreground">
              {securityData.vulnerabilities.critical} críticas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes Activos</CardTitle>
            <Eye className="h-4 w-4 text-[hsl(var(--warning))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--warning))]">
              {securityData.recentIncidents.filter(i => !i.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {securityData.recentIncidents.filter(i => !i.resolved && i.severity === 'CRITICAL').length > 0 && (
        <Alert className="border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.10)]">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-[hsl(var(--destructive))]">
            <strong>ALERTA CRÍTICA:</strong> Hay {securityData.recentIncidents.filter(i => !i.resolved && i.severity === 'CRITICAL').length} incidentes críticos que requieren atención inmediata.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilidades</TabsTrigger>
          <TabsTrigger value="incidents">Incidentes</TabsTrigger>
          <TabsTrigger value="access">Control de Acceso</TabsTrigger>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* System Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Firewall</span>
                  <Badge variant={securityData.systemSecurity.firewallStatus === 'ACTIVE' ? 'default' : 'destructive'}>
                    {securityData.systemSecurity.firewallStatus === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cifrado</span>
                  <Badge variant={securityData.systemSecurity.encryptionStatus === 'ENABLED' ? 'default' : 'destructive'}>
                    {securityData.systemSecurity.encryptionStatus === 'ENABLED' ? 'Habilitado' : 'Deshabilitado'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Respaldos</span>
                  <Badge variant={securityData.systemSecurity.backupStatus === 'CURRENT' ? 'default' : 'secondary'}>
                    {securityData.systemSecurity.backupStatus === 'CURRENT' ? 'Actualizado' : 'Desactualizado'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Actualizaciones</span>
                  <Badge variant={securityData.systemSecurity.updateStatus === 'CURRENT' ? 'default' : 'secondary'}>
                    {securityData.systemSecurity.updateStatus === 'CURRENT' ? 'Actualizado' : 'Pendiente'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Access Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Resumen de Acceso (24h)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--success))]">Exitosos</span>
                  <span className="font-bold text-[hsl(var(--success))]">{securityData.accessAttempts.successful}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--destructive))]">Fallidos</span>
                  <span className="font-bold text-[hsl(var(--destructive))]">{securityData.accessAttempts.failed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--warning))]">Bloqueados</span>
                  <span className="font-bold text-[hsl(var(--warning))]">{securityData.accessAttempts.blocked}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--warning))]">Sospechosos</span>
                  <span className="font-bold text-[hsl(var(--warning))]">{securityData.accessAttempts.suspicious}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerabilidades Detectadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-[hsl(var(--destructive)/0.10)] p-4 rounded-lg border border-[hsl(var(--destructive)/0.3)]">
                  <div className="text-2xl font-bold text-[hsl(var(--destructive))]">
                    {securityData.vulnerabilities.critical}
                  </div>
                  <p className="text-sm text-[hsl(var(--destructive))]">Críticas</p>
                </div>
                <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border border-[hsl(var(--warning)/0.3)]">
                  <div className="text-2xl font-bold text-[hsl(var(--warning))]">
                    {securityData.vulnerabilities.high}
                  </div>
                  <p className="text-sm text-[hsl(var(--warning))]">Altas</p>
                </div>
                <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border border-[hsl(var(--warning)/0.3)]">
                  <div className="text-2xl font-bold text-[hsl(var(--warning))]">
                    {securityData.vulnerabilities.medium}
                  </div>
                  <p className="text-sm text-[hsl(var(--warning))]">Medias</p>
                </div>
                <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg border border-[hsl(var(--info)/0.3)]">
                  <div className="text-2xl font-bold text-[hsl(var(--info))]">
                    {securityData.vulnerabilities.low}
                  </div>
                  <p className="text-sm text-[hsl(var(--info))]">Bajas</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Recomendaciones Prioritarias:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {securityData.vulnerabilities.critical > 0 && (
                    <li>Resolver inmediatamente las {securityData.vulnerabilities.critical} vulnerabilidades críticas</li>
                  )}
                  {securityData.vulnerabilities.high > 0 && (
                    <li>Programar corrección de {securityData.vulnerabilities.high} vulnerabilidades de alta prioridad</li>
                  )}
                  <li>Realizar escaneo completo del sistema semanalmente</li>
                  <li>Mantener todos los componentes actualizados</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incidentes de Seguridad Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityData.recentIncidents.map((incident) => (
                  <div key={incident.id} className={cn(
                    "flex items-center justify-between p-4 border rounded-lg",
                    !incident.resolved && incident.severity === 'CRITICAL' && "border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.10)]",
                    !incident.resolved && incident.severity === 'HIGH' && "border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.10)]"
                  )}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {incident.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="font-medium">{incident.description}</p>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span>Recurso: {incident.affectedResource}</span>
                        {incident.sourceIP && <span> • IP: {incident.sourceIP}</span>}
                        <span> • {new Date(incident.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {incident.resolved ? (
                        <Badge variant="outline" className="text-[hsl(var(--success))]">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resuelto
                        </Badge>
                      ) : (
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleIncidentAction(incident.id, 'resolve')}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleIncidentAction(incident.id, 'investigate')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleIncidentAction(incident.id, 'block')}
                          >
                            <Ban className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Control de Acceso y Intentos de Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Estadísticas de Acceso (24h)</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[hsl(var(--success)/0.10)] rounded">
                      <span className="text-[hsl(var(--success))]">Accesos Exitosos</span>
                      <span className="font-bold text-[hsl(var(--success))]">{securityData.accessAttempts.successful}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[hsl(var(--destructive)/0.10)] rounded">
                      <span className="text-[hsl(var(--destructive))]">Intentos Fallidos</span>
                      <span className="font-bold text-[hsl(var(--destructive))]">{securityData.accessAttempts.failed}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[hsl(var(--warning)/0.10)] rounded">
                      <span className="text-[hsl(var(--warning))]">IPs Bloqueadas</span>
                      <span className="font-bold text-[hsl(var(--warning))]">{securityData.accessAttempts.blocked}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[hsl(var(--warning)/0.10)] rounded">
                      <span className="text-[hsl(var(--warning))]">Actividad Sospechosa</span>
                      <span className="font-bold text-[hsl(var(--warning))]">{securityData.accessAttempts.suspicious}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Tasa de Éxito de Acceso</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exitosos</span>
                      <span>{Math.round((securityData.accessAttempts.successful / (securityData.accessAttempts.successful + securityData.accessAttempts.failed)) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(securityData.accessAttempts.successful / (securityData.accessAttempts.successful + securityData.accessAttempts.failed)) * 100} 
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-sm mb-2">Recomendaciones:</h5>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Implementar autenticación de dos factores</li>
                      <li>Configurar bloqueo automático después de 3 intentos fallidos</li>
                      <li>Monitorear patrones de acceso inusuales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Registro de Auditoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Acción</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Recurso</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityData.auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getResultIcon(log.result)}
                            <span className="ml-2">{log.result}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}