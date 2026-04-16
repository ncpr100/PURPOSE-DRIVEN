"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen, Phone, RefreshCw, User } from "lucide-react";
import { toast } from "sonner";
import type { ShepherdsMemberEntry } from "@/lib/shepherds-log-service";

interface ShepherdsLogData {
  members: ShepherdsMemberEntry[];
  generatedAt: string;
  cached: boolean;
}

export default function ShepherdsLogClient() {
  const [data, setData] = useState<ShepherdsLogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLog = useCallback(async () => {
    try {
      const res = await fetch("/api/shepherds-log");
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error del servidor" }));
        toast.error(err.error ?? "Error al cargar el diario del pastor");
        return;
      }
      const json: ShepherdsLogData = await res.json();
      setData(json);
    } catch {
      toast.error("Error de conexión al cargar el diario");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    fetchLog();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
        <span>Cargando diario del pastor...</span>
      </div>
    );
  }

  if (!data || data.members.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
          <BookOpen className="h-10 w-10 text-indigo-400" />
          <p className="text-lg font-medium">Sin alertas pastorales esta semana</p>
          <p className="text-sm text-center max-w-xs">
            No hay miembros con riesgo alto de desconexión ni ausencias
            prolongadas en este momento.
          </p>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </CardContent>
      </Card>
    );
  }

  const criticalCount = data.members.filter((m) => m.urgency === "CRITICAL").length;
  const highCount = data.members.filter((m) => m.urgency === "HIGH").length;

  return (
    <div className="space-y-4">
      {/* Header summary */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              <AlertTriangle className="h-3 w-3 mr-1 text-red-600" />
              {criticalCount} crítico{criticalCount > 1 ? "s" : ""}
            </Badge>
          )}
          {highCount > 0 && (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              {highCount} prioritario{highCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {data.cached ? "En caché" : "En vivo"} ·{" "}
            {new Date(data.generatedAt).toLocaleDateString("es-CO", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 text-gray-500 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Member cards */}
      <div className="grid gap-3">
        {data.members.map((member) => (
          <Card
            key={member.id}
            className={`border-l-4 ${
              member.urgency === "CRITICAL"
                ? "border-l-red-500"
                : "border-l-orange-400"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <User
                    className={`h-5 w-5 ${
                      member.urgency === "CRITICAL"
                        ? "text-red-600"
                        : "text-orange-500"
                    }`}
                  />
                  <CardTitle className="text-base">{member.name}</CardTitle>
                </div>
                <Badge
                  className={
                    member.urgency === "CRITICAL"
                      ? "bg-red-100 text-red-700 border-red-200 text-xs"
                      : "bg-orange-100 text-orange-700 border-orange-200 text-xs"
                  }
                >
                  {member.urgency === "CRITICAL" ? "Crítico" : "Prioritario"}
                </Badge>
              </div>
              <CardDescription className="text-sm mt-1">
                {member.reason}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                {member.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    {member.phone}
                  </span>
                )}
                {member.lastAttendance && (
                  <span>Última asistencia: {member.lastAttendance}</span>
                )}
                {member.daysAbsent && (
                  <span>{member.daysAbsent} días sin asistir</span>
                )}
                {member.lastContactedAt ? (
                  <span>Último contacto: {member.lastContactedAt}</span>
                ) : (
                  <span className="text-amber-600">Sin contacto registrado</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
