'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  DollarSign, 
  Calendar, 
  UserCheck, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface RealTimeAnalyticsOverviewProps {
  className?: string
  showDetails?: boolean
  autoRefresh?: boolean
}

export function RealTimeAnalyticsOverview({ 
  className, 
  showDetails = true,
  autoRefresh = true 
}: RealTimeAnalyticsOverviewProps) {
  const [analyticsData, setAnalyticsData] = useState({
    memberCount: 0,
    donationCount: 0,
    eventCount: 0,
    volunteerCount: 0,
    changes: {
      members: 0,
      donations: 0,
      events: 0,
      volunteers: 0
    },
    lastUpdated: null as string | null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date())
  const [isConnected, setIsConnected] = useState(true)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(autoRefresh)
  const [hasRecentChanges, setHasRecentChanges] = useState(false)
  const [totalChanges, setTotalChanges] = useState(0)

  const fetchRealTimeData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/analytics/realtime-overview')
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
        setLastUpdateTime(new Date(data.lastUpdated || Date.now()))
        setIsConnected(true)
        
        // Calculate total changes for notification
        const totalChanges = data.changes.members + data.changes.donations + data.changes.events + data.changes.volunteers
        setTotalChanges(Math.abs(totalChanges))
        setHasRecentChanges(totalChanges > 0)
      } else {
        setIsConnected(false)
        console.error('Failed to fetch real-time data:', response.statusText)
      }
    } catch (error) {
      setIsConnected(false)
      console.error('Error fetching real-time data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchRealTimeData()
  }

  // Initial data fetch
  useEffect(() => {
    fetchRealTimeData()
  }, [])

  // Auto-refresh interval
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      fetchRealTimeData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [isRealTimeEnabled])

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  const metrics = [
    {
      title: 'Miembros',
      value: analyticsData?.memberCount ?? 0,
      change: analyticsData?.changes.members ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Donaciones Hoy',
      value: analyticsData?.donationCount ?? 0,
      change: analyticsData?.changes.donations ?? 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Eventos Hoy',
      value: analyticsData?.eventCount ?? 0,
      change: analyticsData?.changes.events ?? 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Voluntarios',
      value: analyticsData?.volunteerCount ?? 0,
      change: analyticsData?.changes.volunteers ?? 0,
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Real-time Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {isConnected ? 'Tiempo Real Activo' : 'Sin Conexión'}
            </span>
          </div>
          
          {hasRecentChanges && (
            <Badge variant="secondary" className="gap-1">
              <Bell className="h-3 w-3" />
              {totalChanges} cambio{totalChanges !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {analyticsData ? format(lastUpdateTime, "HH:mm:ss", { locale: es }) : '--:--:--'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="gap-1"
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-lg", metric.bgColor)}>
                    <Icon className={cn("h-4 w-4", metric.color)} />
                  </div>
                  
                  {showDetails && (
                    <div className="flex items-center gap-1">
                      {getChangeIcon(metric.change)}
                      <span className={cn("text-xs font-medium", getChangeColor(metric.change))}>
                        {metric.change > 0 ? '+' : ''}{metric.change}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2">
                  <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{metric.title}</div>
                </div>

                {/* Live Activity Indicator */}
                {isConnected && metric.change > 0 && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Connection Status Details */}
      {showDetails && (
        <Card className="bg-muted/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  <span>Estado:</span>
                  <span className={cn(
                    "font-medium",
                    isConnected ? "text-green-600" : "text-red-600"
                  )}>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Actualizaciones:</span>
                  <span className="font-medium">
                    {isRealTimeEnabled ? 'Automáticas' : 'Manuales'}
                  </span>
                </div>
              </div>
              
              <div className="text-muted-foreground">
                Última actualización: {format(lastUpdateTime, "dd/MM/yyyy HH:mm:ss", { locale: es })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}