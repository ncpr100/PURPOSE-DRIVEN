'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditEntry {
  id: string;
  action: string;
  target: string | null;
  oldValue: unknown;
  newValue: unknown;
  ipAddress: string | null;
  createdAt: string;
  actor: { id: string; name: string; email: string };
}

const ACTION_COLORS: Record<string, string> = {
  'agent.toggle': 'bg-blue-100 text-blue-800',
  'pricing.plan.create': 'bg-green-100 text-green-800',
  'pricing.plan.update': 'bg-yellow-100 text-yellow-800',
  'church.create': 'bg-purple-100 text-purple-800',
};

function ActionBadge({ action }: { action: string }) {
  const color = ACTION_COLORS[action] ?? 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${color}`}>
      {action}
    </span>
  );
}

export function AuditLogClient() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>('all');

  const fetchEntries = useCallback(async (page: number, action: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '25' });
      if (action !== 'all') params.set('action', action);
      const res = await fetch(`/api/platform/audit-log?${params}`);
      const data = await res.json();
      setEntries(data.entries ?? []);
      setPagination(data.pagination ?? { page: 1, limit: 25, total: 0, pages: 1 });
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries(1, actionFilter);
  }, [actionFilter, fetchEntries]);

  const handlePage = (p: number) => fetchEntries(p, actionFilter);

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex items-center gap-3">
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filtrar por acción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las acciones</SelectItem>
            <SelectItem value="agent.toggle">agent.toggle</SelectItem>
            <SelectItem value="pricing.plan.create">pricing.plan.create</SelectItem>
            <SelectItem value="pricing.plan.update">pricing.plan.update</SelectItem>
            <SelectItem value="church.create">church.create</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchEntries(pagination.page, actionFilter)}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
        <span className="text-sm text-muted-foreground ml-auto">
          {pagination.total} registros totales
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Acción</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Objetivo</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actor</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nuevo valor</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">IP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Cargando registros...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No hay registros de auditoría
                </td>
              </tr>
            ) : entries.map((entry) => (
              <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(entry.createdAt).toLocaleString('es-CO', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-4 py-3">
                  <ActionBadge action={entry.action} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {entry.target ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{entry.actor.name}</div>
                  <div className="text-xs text-muted-foreground">{entry.actor.email}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs max-w-[200px] truncate">
                  {entry.newValue ? JSON.stringify(entry.newValue) : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                  {entry.ipAddress ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePage(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePage(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages || loading}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
