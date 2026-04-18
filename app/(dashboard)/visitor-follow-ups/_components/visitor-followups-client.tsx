"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Phone,
  Mail,
  RefreshCw,
  Star,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface FollowUp {
  id: string;
  followUpType: string;
  status: string;
  priority?: string;
  scheduledAt?: string;
  completedAt?: string;
  notes?: string;
  checkIn?: {
    id?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    isFirstTime?: boolean;
    visitorType?: string;
  };
  users?: { id: string; name: string };
}

interface Props {
  userRole: string;
  churchId: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)]",
  completed: "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)]",
  scheduled: "bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))] border-[hsl(var(--info)/0.3)]",
  skipped: "bg-muted/50 text-muted-foreground border-border",
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]",
  medium: "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]",
  low: "bg-muted/50 text-muted-foreground",
};

const TYPE_LABELS: Record<string, string> = {
  call: "Llamada",
  email: "Correo",
  visit: "Visita personal",
  automatic: "Automático",
  custom_form_submission: "Formulario personalizado",
  visitor_form_submission: "Formulario QR",
  prayer_request: "Petición de oración",
  first_time: "Primera visita",
};

export function VisitorFollowUpsClient({ userRole }: Props) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchFollowUps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/visitor-follow-ups?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Sort: first-timers first, then by scheduledAt
      const sorted = (Array.isArray(data) ? data : data.followUps || []).sort(
        (a: FollowUp, b: FollowUp) => {
          const aFirst = a.checkIn?.isFirstTime ? 0 : 1;
          const bFirst = b.checkIn?.isFirstTime ? 0 : 1;
          if (aFirst !== bFirst) return aFirst - bFirst;
          if (!a.scheduledAt) return 1;
          if (!b.scheduledAt) return -1;
          return (
            new Date(a.scheduledAt).getTime() -
            new Date(b.scheduledAt).getTime()
          );
        },
      );
      setFollowUps(sorted);
    } catch {
      toast.error("Error al cargar seguimientos");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const markComplete = async (id: string) => {
    setCompleting(id);
    try {
      const res = await fetch(`/api/visitor-follow-ups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          completedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Seguimiento marcado como completado");
      fetchFollowUps();
    } catch {
      toast.error("Error al actualizar seguimiento");
    } finally {
      setCompleting(null);
    }
  };

  const stats = {
    pending: followUps.filter((f) => f.status === "pending").length,
    today: followUps.filter((f) => {
      if (!f.scheduledAt) return false;
      const d = new Date(f.scheduledAt);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length,
    overdue: followUps.filter((f) => {
      if (!f.scheduledAt || f.status !== "pending") return false;
      return new Date(f.scheduledAt) < new Date();
    }).length,
    firstTime: followUps.filter((f) => f.checkIn?.isFirstTime).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-[hsl(var(--warning))]" />
            Seguimientos de Visitantes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tareas de contacto asignadas a nuevos visitantes y candidatos
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <a
            href="/visitors"
            className="text-sm text-[hsl(var(--info))] hover:underline flex items-center gap-1"
          >
            Ver CRM de Visitantes <ArrowRight className="h-4 w-4" />
          </a>
          <Button variant="outline" size="sm" onClick={fetchFollowUps}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Pendientes",
            value: stats.pending,
            icon: <Clock className="h-5 w-5 text-[hsl(var(--warning))]" />,
            bg: "bg-[hsl(var(--warning)/0.10)]",
          },
          {
            label: "Para hoy",
            value: stats.today,
            icon: <Calendar className="h-5 w-5 text-[hsl(var(--info))]" />,
            bg: "bg-[hsl(var(--info)/0.10)]",
          },
          {
            label: "Vencidos",
            value: stats.overdue,
            icon: <AlertCircle className="h-5 w-5 text-[hsl(var(--destructive))]" />,
            bg: "bg-[hsl(var(--destructive)/0.10)]",
          },
          {
            label: "Primera visita",
            value: stats.firstTime,
            icon: <Star className="h-5 w-5 text-[hsl(var(--success))]" />,
            bg: "bg-[hsl(var(--success)/0.10)]",
          },
        ].map((s) => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="p-4 flex items-center gap-3">
              {s.icon}
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4 flex gap-3 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="scheduled">Programados</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            {followUps.length} seguimiento{followUps.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground/70">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Cargando seguimientos…</p>
            </div>
          ) : followUps.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground/70">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">
                {statusFilter === "pending"
                  ? "No hay seguimientos pendientes"
                  : "No se encontraron seguimientos"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {followUps.map((fu) => {
                const isOverdue =
                  fu.scheduledAt &&
                  fu.status === "pending" &&
                  new Date(fu.scheduledAt) < new Date();
                const isToday =
                  fu.scheduledAt &&
                  new Date(fu.scheduledAt).toDateString() ===
                    new Date().toDateString();
                return (
                  <div
                    key={fu.id}
                    className={`px-4 py-3 flex items-start gap-3 ${isOverdue ? "bg-[hsl(var(--destructive)/0.10)]" : ""}`}
                  >
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--warning)/0.15)] flex items-center justify-center text-[hsl(var(--warning))] font-semibold text-sm flex-shrink-0">
                      {fu.checkIn?.firstName?.[0] || "?"}
                      {fu.checkIn?.lastName?.[0] || ""}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground text-sm">
                          {fu.checkIn?.firstName} {fu.checkIn?.lastName}
                        </span>
                        {fu.checkIn?.isFirstTime && (
                          <Badge className="text-xs px-1.5 py-0 bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]">
                            Primera vez
                          </Badge>
                        )}
                        <Badge
                          className={`text-xs px-1.5 py-0 ${STATUS_COLORS[fu.status] || STATUS_COLORS.pending}`}
                        >
                          {fu.status === "pending"
                            ? "Pendiente"
                            : fu.status === "completed"
                              ? "Completado"
                              : fu.status === "scheduled"
                                ? "Programado"
                                : fu.status}
                        </Badge>
                        {fu.priority && (
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${PRIORITY_COLORS[fu.priority] || ""}`}
                          >
                            {fu.priority === "high"
                              ? "Alta prioridad"
                              : fu.priority === "medium"
                                ? "Media"
                                : "Baja"}
                          </span>
                        )}
                        {isOverdue && (
                          <Badge className="text-xs px-1.5 py-0 bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]">
                            Vencido
                          </Badge>
                        )}
                        {isToday && !isOverdue && (
                          <Badge className="text-xs px-1.5 py-0 bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]">
                            Hoy
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                        <span>
                          {TYPE_LABELS[fu.followUpType] || fu.followUpType}
                        </span>
                        {fu.checkIn?.email && (
                          <a
                            href={`mailto:${fu.checkIn.email}`}
                            className="flex items-center gap-1 text-[hsl(var(--info))] hover:underline"
                          >
                            <Mail className="h-3 w-3" />
                            {fu.checkIn.email}
                          </a>
                        )}
                        {fu.checkIn?.phone && (
                          <a
                            href={`tel:${fu.checkIn.phone}`}
                            className="flex items-center gap-1 text-[hsl(var(--info))] hover:underline"
                          >
                            <Phone className="h-3 w-3" />
                            {fu.checkIn.phone}
                          </a>
                        )}
                        {fu.scheduledAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(fu.scheduledAt).toLocaleDateString("es", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                        {fu.users?.name && (
                          <span>Asignado: {fu.users.name}</span>
                        )}
                      </div>
                      {fu.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {fu.notes}
                        </p>
                      )}
                    </div>
                    {/* Action */}
                    {fu.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-shrink-0 text-[hsl(var(--success))] border-[hsl(var(--success)/0.4)] hover:bg-[hsl(var(--success)/0.10)]"
                        onClick={() => markComplete(fu.id)}
                        disabled={completing === fu.id}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {completing === fu.id ? "…" : "Hecho"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
