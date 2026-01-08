import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DonationsSettingsClient from './_components/donations-settings-client';
import { Skeleton } from '@/components/ui/skeleton';

function DonationsSettingsLoadingSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

async function getDonationCategories(churchId: string) {
  try {
    return await prisma.donation_categories.findMany({
      where: { churchId },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching donation categories:', error);
    return [];
  }
}

async function getPaymentMethods(churchId: string) {
  try {
    return await prisma.payment_methods.findMany({
      where: { churchId },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

export default async function DonationsSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.churchId) {
    redirect('/auth/signin');
  }

  // Check permissions
  if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
    redirect('/home');
  }

  const churchId = session.user.churchId;
  
  const [categories, paymentMethods] = await Promise.all([
    getDonationCategories(churchId),
    getPaymentMethods(churchId)
  ]);

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<DonationsSettingsLoadingSkeleton />}>
        <DonationsSettingsClient 
          churchId={churchId}
          userRole={session.user.role}
          initialCategories={categories}
          initialPaymentMethods={paymentMethods}
        />
      </Suspense>
    </div>
  );
}