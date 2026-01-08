import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import MinistriesSettingsClient from './_components/ministries-settings-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function MinistriesSettingsLoadingSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function MinistriesSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.churchId) {
    redirect('/auth/signin');
  }

  // Check permissions
  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  // Fetch initial ministries data
  const ministries = await db.ministries.findMany({
    where: {
      churchId: session.user.churchId
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<MinistriesSettingsLoadingSkeleton />}>
        <MinistriesSettingsClient 
          churchId={session.user.churchId}
          userRole={session.user.role}
          initialMinistries={ministries}
        />
      </Suspense>
    </div>
  );
}
