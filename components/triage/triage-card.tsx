"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, Phone, Mail, Tag } from "lucide-react";

type TriageStatus = "PENDING" | "ASSIGNED" | "HUMAN_RESPONDED" | "RESOLVED" | "ESCALATED";

interface TriageEvent {
  id: string;
  churchId: string;
  triggerSource: string;
  sourceId: string;
  detectedKeyword: string;
  requesterName: string | null;
  requesterPhone: string | null;
  requesterEmail: string | null;
  messageBody: string;
  status: TriageStatus;
  assignedToId: string | null;
  resolvedAt: Date | null;
  humanRespondedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TriageCardProps {
  event: TriageEvent;
}

const STATUS_LABELS: Record<TriageStatus, string> = {
  PENDING: "Pendiente",
  ASSIGNED: "Asignado",
  HUMAN_RESPONDED: "Respondido",
  RESOLVED: "Resuelto",
  ESCALATED: "Escalado",
};

const STATUS_VARIANT: Record<
  TriageStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "destructive",
  ASSIGNED: "default",
  HUMAN_RESPONDED: "secondary",
  RESOLVED: "outline",
  ESCALATED: "destructive",
};

const SOURCE_LABELS: Record<string, string> = {
  prayer_form: "Petición de oración",
  visitor_form: "Formulario de visitante",
  chat: "Chat",
};

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `hace ${diffHrs} h`;
  const diffDays = Math.floor(diffHrs / 24);
  return `hace ${diffDays} días`;
}

export function TriageCard({ event }: TriageCardProps) {
  const [status, setStatus] = useState<TriageStatus>(event.status);
  const [loading, setLoading] = useState(false);

  const isResolvable =
    status === "PENDING" || status === "ASSIGNED" || status === "ESCALATED";

  const handleMarkResponded = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/triage/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "HUMAN_RESPONDED" }),
      });
      if (res.ok) {
        setStatus("HUMAN_RESPONDED");
      }
    } catch {
      // Silent — card remains actionable for retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0" />
            <span className="font-semibold text-base">
              {event.requesterName ?? "Persona anónima"}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={STATUS_VARIANT[status]}>
              {STATUS_LABELS[status]}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(event.createdAt)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Detected keyword + source */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            {SOURCE_LABELS[event.triggerSource] ?? event.triggerSource}
          </span>
          <Badge variant="outline" className="text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.4)] bg-[hsl(var(--destructive)/0.10)]">
            Palabra clave: &ldquo;{event.detectedKeyword}&rdquo;
          </Badge>
        </div>

        {/* Message excerpt */}
        <p className="text-sm bg-muted/50 rounded p-3 leading-relaxed line-clamp-4">
          {event.messageBody}
        </p>

        {/* Contact info */}
        {(event.requesterPhone || event.requesterEmail) && (
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {event.requesterPhone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {event.requesterPhone}
              </span>
            )}
            {event.requesterEmail && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {event.requesterEmail}
              </span>
            )}
          </div>
        )}

        {/* Action */}
        {isResolvable && (
          <div className="pt-1">
            <Button
              size="sm"
              variant="outline"
              className="text-[hsl(var(--success))] border-[hsl(var(--success)/0.30)] hover:bg-[hsl(var(--success)/0.10)]"
              onClick={handleMarkResponded}
              disabled={loading}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {loading ? "Guardando..." : "Marcar como respondido"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
