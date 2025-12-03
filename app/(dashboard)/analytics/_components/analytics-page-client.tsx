'use client'

import { Suspense, useEffect, useState } from 'react';
import AnalyticsClient from './analytics-client';
import IntelligentAnalyticsDashboard from './intelligent-analytics-dashboard';
import MemberJourneyAnalytics from './member-journey-analytics';
import { RealTimeAnalyticsOverview } from '@/components/analytics/realtime-analytics-overview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, BarChart3, Activity, Users } from 'lucide-react';

interface AnalyticsPageClientProps {
  userRole: string;
  churchId: string;
}

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-16 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AnalyticsPageClient({ userRole, churchId }: AnalyticsPageClientProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Handle hash-based navigation (for direct links to specific tabs)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && ['overview', 'intelligent-analytics', 'member-journey', 'realtime'].includes(hash)) {
      setActiveTab(hash)
      // Clear the hash after setting the tab
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
      {/* Enhanced Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Centro de Analíticas</h1>
        <p className="text-sm md:text-base text-gray-600">Insights y métricas para el crecimiento de la iglesia</p>
      </div>

      {/* Real-time Analytics Overview */}
      <div className="mb-4 md:mb-6">
        <RealTimeAnalyticsOverview />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="realtime" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Activity className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Tiempo Real</span>
            <span className="md:hidden">Tiempo</span>
          </TabsTrigger>
          
          <TabsTrigger value="overview" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Generales</span>
            <span className="md:hidden">General</span>
          </TabsTrigger>

          <TabsTrigger value="intelligent-analytics" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Brain className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Inteligentes</span>
            <span className="md:hidden">AI</span>
          </TabsTrigger>

          <TabsTrigger value="member-journey" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Miembros</span>
            <span className="md:hidden">Usuarios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <RealTimeAnalyticsOverview />
          </Suspense>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <AnalyticsClient userRole={userRole} churchId={churchId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="intelligent-analytics" className="space-y-4">
          <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <IntelligentAnalyticsDashboard userRole={userRole} churchId={churchId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="member-journey" className="space-y-4">
          <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <MemberJourneyAnalytics userRole={userRole} churchId={churchId} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}