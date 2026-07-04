import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shield } from 'lucide-react';
import { AuditLogClient } from './_components/audit-log-client';

export const metadata = { title: 'Registro de Auditoría | Khesed-Tek' };

export default async function AuditLogPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/platform');
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-7 w-7 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registro de Auditoría</h1>
          <p className="text-muted-foreground text-sm">
            Historial de acciones administrativas — G05 Compliance
          </p>
        </div>
      </div>
      <AuditLogClient />
    </div>
  );
}
