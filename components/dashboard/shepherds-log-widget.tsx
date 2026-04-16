"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  phone: string | null;
  reason: string;
  urgency: "HIGH" | "CRITICAL";
  lastAttendance: string | null;
  daysAbsent: number | null;
}

interface Props {
  initialMembers: Member[];
  churchId: string;
}

export function ShepherdsLogWidget({ initialMembers, churchId: _churchId }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/shepherds-log/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setMembers(data.members);
      toast.success("Lista actualizada");
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  const logContact = async (memberId: string, method: string) => {
    try {
      const res = await fetch("/api/shepherds-log/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, method }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error desconocido");
      }
      // Remove from list after contact logged
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success("Contacto registrado");
    } catch {
      toast.error("Error al registrar el contacto");
    }
  };

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          Todas las ovejas están siendo cuidadas esta semana.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Esta semana: {members.length} personas necesitan su atención
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={refresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-start justify-between p-3 rounded-lg border bg-muted/30"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{member.name}</span>
                <Badge
                  variant={
                    member.urgency === "CRITICAL" ? "destructive" : "outline"
                  }
                  className="text-xs"
                >
                  {member.urgency === "CRITICAL" ? "Urgente" : "Atención"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{member.reason}</p>
              {member.lastAttendance && (
                <p className="text-xs text-muted-foreground">
                  Última asistencia: {member.lastAttendance}
                </p>
              )}
            </div>
            <div className="flex gap-1 shrink-0 ml-3">
              {member.phone && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    title="Llamar"
                    onClick={() => logContact(member.id, "call")}
                    asChild
                  >
                    <a href={`tel:${member.phone}`}>
                      <Phone className="w-3 h-3" />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    title="WhatsApp"
                    onClick={() => logContact(member.id, "whatsapp")}
                    asChild
                  >
                    <a
                      href={`https://wa.me/${member.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </a>
                  </Button>
                </>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                title="Ver perfil"
                asChild
              >
                <a href={`/members/${member.id}`}>
                  <Eye className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground text-center pt-1">
          Generado por IA como apoyo ministerial. La decisión pastoral es del
          pastor.
        </p>
      </CardContent>
    </Card>
  );
}
