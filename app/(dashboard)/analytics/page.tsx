
import { Suspense } from 'react';
import AnalyticsClient from './_components/analytics-client';
import IntelligentAnalyticsDashboard from './_components/intelligent-analytics-dashboard';
import MemberJourneyAnalytics from './_components/member-journey-analytics';
import { RealTimeAnalyticsOverview } from '@/components/analytics/realtime-analytics-overview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, BarChart3, Activity, Users } from 'lucide-react';

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
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  );
}

export default function AnalyticsPage() {
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="realtime" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Activity className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Tiempo Real</span>
            <span className="sm:hidden">Real</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Analíticas Generales</span>
            <span className="sm:hidden">General</span>
          </TabsTrigger>
          <TabsTrigger value="intelligent-analytics" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Brain className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Analíticas Inteligentes</span>
            <span className="sm:hidden">IA</span>
          </TabsTrigger>
          <TabsTrigger value="member-journey" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Recorrido de Miembros</span>
            <span className="sm:hidden">Miembros</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realtime">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Dashboard en Tiempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimeAnalyticsOverview showDetails={true} autoRefresh={true} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview">
          <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <AnalyticsClient />
          </Suspense>
        </TabsContent>

        <TabsContent value="intelligent-analytics">
          <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <IntelligentAnalyticsDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="member-journey">
          <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <MemberJourneyAnalytics churchId="default" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
