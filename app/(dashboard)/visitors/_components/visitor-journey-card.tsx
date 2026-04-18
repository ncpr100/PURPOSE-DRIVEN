"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MessageSquare,
  Heart,
  Star,
  CheckCircle2,
  Clock,
  ArrowUpCircle,
  RefreshCw,
  Target,
} from "lucide-react";
import { toast } from "sonner";

interface FollowUp {
  id: string;
  followUpType: string;
  status: string;
  scheduledAt?: string;
  priority?: string;
  users?: { name: string };
}

interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  isFirstTime: boolean;
  visitorType?: string;
  displayCategory: string;
  visitCount: number;
  engagementScore: number;
  checkedInAt: string;
  lastContactDate?: string;
  visitReason?: string;
  prayerRequest?: string;
  ageGroup?: string;
  familyStatus?: string;
  referredBy?: string;
  ministryInterest: string[];
  openFollowUps: number;
  closedFollowUps: number;
  visitor_follow_ups: FollowUp[];
  events?: { id: string; title: string };
}

interface Props {
  visitor: Visitor;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "first_time", label: "Primera vez" },
  { value: "returning", label: "Regresó" },
  { value: "regular", label: "Regular" },
  { value: "member_candidate", label: "Candidato a miembro" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "PRIMERA VEZ": "bg-success/20 text-success",
  REGRESÓ: "bg-info/20 text-info",
  REGULAR: "bg-primary/20 text-primary",
  "CANDIDATO A MIEMBRO": "bg-warning/20 text-warning",
  "SIN CATEGORÍA": "bg-muted text-muted-foreground",
};

const FOLLOW_UP_STATUS_COLORS: Record<string, string> = {
  pending: "bg-warning/20 text-warning",
  completed: "bg-success/20 text-success",
  scheduled: "bg-info/20 text-info",
  skipped: "bg-muted text-muted-foreground",
};

const FOLLOW_UP_TYPE_LABELS: Record<string, string> = {
  call: "Llamada",
  email: "Correo",
  visit: "Visita",
  automatic: "Automático",
  custom_form_submission: "Formulario",
  visitor_form_submission: "Formulario QR",
  prayer_request: "Petición de oración",
};

export function VisitorJourneyCard({
  visitor,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [overrideCategory, setOverrideCategory] = useState(
    visitor.visitorType || "",
  );
  const [saving, setSaving] = useState(false);
  const [promoting, setPromoting] = useState(false);

  const handleCategoryOverride = async () => {
    if (!overrideCategory) return;
    setSaving(true);
    try {
      const res = await fetch("/api/visitors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: visitor.id, visitorType: overrideCategory }),
      });
      if (!res.ok) throw new Error();
      toast.success("Categoría actualizada");
      onUpdated();
    } catch {
      toast.error("Error al actualizar categoría");
    } finally {
      setSaving(false);
    }
  };

  const handlePromoteMember = async () => {
    setPromoting(true);
    try {
      const res = await fetch("/api/visitors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: visitor.id,
          visitorType: "member_candidate",
          engagementScore: 100,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Promovido a candidato a miembro");
      onUpdated();
      onClose();
    } catch {
      toast.error("Error al promover");
    } finally {
      setPromoting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              {visitor.firstName[0]}
              {visitor.lastName[0]}
            </div>
            <div>
              <DialogTitle className="text-xl">
                {visitor.firstName} {visitor.lastName}
              </DialogTitle>
              <Badge
                className={`mt-1 text-xs ${CATEGORY_COLORS[visitor.displayCategory] || CATEGORY_COLORS["SIN CATEGORÍA"]}`}
              >
                {visitor.displayCategory}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {visitor.email && (
              <a
                href={`mailto:${visitor.email}`}
                className="flex items-center gap-2 text-primary hover:underline col-span-2"
              >
                <Mail className="h-4 w-4" />
                {visitor.email}
              </a>
            )}
            {visitor.phone && (
              <a
                href={`tel:${visitor.phone}`}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                {visitor.phone}
              </a>
            )}
            {visitor.ageGroup && (
              <span className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                {visitor.ageGroup}
              </span>
            )}
            {visitor.familyStatus && (
              <span className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                {visitor.familyStatus}
              </span>
            )}
            {visitor.referredBy && (
              <span className="flex items-center gap-2 text-muted-foreground col-span-2">
                <MapPin className="h-4 w-4" />
                {visitor.referredBy}
              </span>
            )}
          </div>

          {/* Visit Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Visitas",
                value: visitor.visitCount,
                icon: <Calendar className="h-4 w-4 text-info" />,
              },
              {
                label: "Compromiso",
                value: `${visitor.engagementScore}%`,
                icon: <Target className="h-4 w-4 text-green-500" />,
              },
              {
                label: "Seguimientos",
                value: `${visitor.closedFollowUps}/${visitor.openFollowUps + visitor.closedFollowUps}`,
                icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-muted rounded-lg p-3"
              >
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* First visit date */}
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Primera visita:{" "}
            {new Date(visitor.checkedInAt).toLocaleDateString("es", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          {/* Ministry Interests */}
          {visitor.ministryInterest?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                <Star className="h-3 w-3" />
                Interés en ministerios
              </p>
              <div className="flex flex-wrap gap-1">
                {visitor.ministryInterest.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Visit Reason */}
          {visitor.visitReason && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Razón de visita
              </p>
              <p className="text-sm text-foreground bg-muted rounded p-2">
                {visitor.visitReason}
              </p>
            </div>
          )}

          {/* Prayer Request */}
          {visitor.prayerRequest && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                <Heart className="h-3 w-3 text-destructive" />
                Petición de oración
              </p>
              <p className="text-sm text-foreground bg-destructive/10 rounded p-2 border border-destructive/20">
                {visitor.prayerRequest}
              </p>
            </div>
          )}

          <Separator />

          {/* Follow-ups */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Seguimientos
            </p>
            {visitor.visitor_follow_ups?.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Sin seguimientos registrados
              </p>
            ) : (
              <div className="space-y-2">
                {(visitor.visitor_follow_ups || []).map((fu) => (
                  <div
                    key={fu.id}
                    className="flex items-start justify-between text-sm bg-gray-50 rounded p-2"
                  >
                    <div>
                      <span className="font-medium capitalize">
                        {FOLLOW_UP_TYPE_LABELS[fu.followUpType] ||
                          fu.followUpType}
                      </span>
                      {fu.scheduledAt && (
                        <span className="text-gray-500 ml-2 text-xs">
                          {new Date(fu.scheduledAt).toLocaleDateString("es")}
                        </span>
                      )}
                      {fu.users?.name && (
                        <span className="text-gray-500 block text-xs">
                          Asignado: {fu.users.name}
                        </span>
                      )}
                    </div>
                    <Badge
                      className={`text-xs ${FOLLOW_UP_STATUS_COLORS[fu.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {fu.status === "pending"
                        ? "Pendiente"
                        : fu.status === "completed"
                          ? "Completado"
                          : fu.status === "scheduled"
                            ? "Programado"
                            : fu.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Category Override */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Cambiar categoría manualmente
            </p>
            <div className="flex gap-2">
              <Select
                value={overrideCategory}
                onValueChange={setOverrideCategory}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCategoryOverride}
                disabled={saving}
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "Guardar"
                )}
              </Button>
            </div>
          </div>

          {/* Promote to Member */}
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handlePromoteMember}
            disabled={promoting || visitor.visitorType === "member_candidate"}
          >
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            {visitor.visitorType === "member_candidate"
              ? "Ya es candidato a miembro"
              : promoting
                ? "Procesando…"
                : "Promover a Candidato a Miembro"}
          </Button>

          <Button variant="ghost" className="w-full" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
