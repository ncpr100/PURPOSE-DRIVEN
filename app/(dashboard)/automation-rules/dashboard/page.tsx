'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Users,
  Bell,
  Zap,
  BarChart3
} from 'lucide-react'

interface AutomationStats {
  totalRules: number
  activeRules: number
  inactiveRules: number
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  pendingExecutions: number
  retryingExecutions: number
  avgExecutionTime: number
  successRate: number
}

interface ExecutionRecord {
  id: string
  automationRuleId: string
  ruleName: string
  entityType: string
  entityId: string
  status: string
  retryCount: number
  startedAt: Date
  completedAt: Date | null
  error: string | null
}

interface ManualTask {
  id: string
  visitorName: string
  followUpType: string
  status: string
  priority: string
  contactMethod: string
  assignedTo: string | null
  scheduledFor: Date
}

export default function AutomationDashboard() {
  const [stats, setStats] = useState<AutomationStats | null>(null)
  const [recentExecutions, setRecentExecutions] = useState<ExecutionRecord[]>([])
  const [manualTasks, setManualTasks] = useState<ManualTask[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/automation-dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentExecutions(data.recentExecutions)
        setManualTasks(data.manualTasks)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 30 seconds if enabled
    const interval = autoRefresh ? setInterval(fetchDashboardData, 30000) : null

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'text-green-600 bg-green-50'
      case 'FAILED':
      case 'ERROR':
        return 'text-red-600 bg-red-50'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50'
      case 'RETRYING':
        return 'text-orange-600 bg-orange-50'
      case 'RUNNING':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return 'destructive'
      case 'HIGH':
        return 'default'
      case 'NORMAL':
        return 'secondary'
      case 'LOW':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">📊 Dashboard de Automatización</h1>
          <p className="text-muted-foreground">Monitoreo en tiempo real del sistema de automatización</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-pulse' : ''}`} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reglas Activas</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeRules || 0}</div>
            <p className="text-xs text-muted-foreground">
              de {stats?.totalRules || 0} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ejecuciones Hoy</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalExecutions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.successRate?.toFixed(1) || 0}% éxito
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exitosas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.successfulExecutions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingExecutions || 0} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fallos/Reintentos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.failedExecutions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.retryingExecutions || 0} reintentando
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tasa de Éxito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.successRate?.toFixed(1) || 0}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${stats?.successRate || 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.avgExecutionTime?.toFixed(1) || 0}s
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Por ejecución
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Tareas Manuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {manualTasks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Requieren aprobación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Executions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ejecuciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentExecutions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay ejecuciones recientes</p>
              <p className="text-sm mt-2">Las ejecuciones aparecerán aquí cuando se activen las automatizaciones</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentExecutions.map((execution) => (
                <div
                  key={execution.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-full ${getStatusColor(execution.status)}`}>
                      {execution.status === 'SUCCESS' || execution.status === 'COMPLETED' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : execution.status === 'FAILED' ? (
                        <XCircle className="h-4 w-4" />
                      ) : execution.status === 'RETRYING' ? (
                        <RefreshCw className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{execution.ruleName || 'Regla sin nombre'}</div>
                      <div className="text-sm text-muted-foreground">
                        {execution.entityType} · {execution.entityId?.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {execution.retryCount > 0 && (
                      <Badge variant="outline">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reintento {execution.retryCount}
                      </Badge>
                    )}
                    <Badge className={getStatusColor(execution.status)}>
                      {execution.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground text-right">
                      {new Date(execution.startedAt).toLocaleTimeString('es-MX')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Approval Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Cola de Aprobación Manual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {manualTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600 opacity-50" />
              <p>No hay tareas pendientes de aprobación</p>
              <p className="text-sm mt-2">Las tareas con bypassApproval=false aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-2">
              {manualTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-full bg-yellow-50 text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{task.visitorName}</div>
                      <div className="text-sm text-muted-foreground">
                        {task.followUpType} · {task.contactMethod}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant="outline">
                      {task.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
