
import { Suspense } from 'react';
import AnalyticsClient from './_components/analytics-client';
import P2AnalyticsDashboard from './_components/p2-analytics-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Brain, BarChart3 } from 'lucide-react';

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
    <div className="container mx-auto py-6">
      {/* Enhanced Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Analíticas</h1>
        <p className="text-gray-600">Insights y métricas para el crecimiento de la iglesia</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analíticas Generales
          </TabsTrigger>
          <TabsTrigger value="p2-analytics" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Analíticas Inteligentes P2
            <Badge variant="secondary" className="ml-1 text-xs">NUEVO</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <AnalyticsClient />
          </Suspense>
        </TabsContent>

        <TabsContent value="p2-analytics">
          <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <P2AnalyticsDashboard />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
