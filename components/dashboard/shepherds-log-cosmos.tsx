"use client";
// components/dashboard/shepherds-log-cosmos.tsx
// Pastoral watchlist with urgency indicators and direct WhatsApp action.

import { useState } from "react";
import { Phone, MessageCircle, Eye, RefreshCw, CheckCircle } from "lucide-react";

type Urgency = "CRITICAL" | "HIGH" | "GOLD" | "EMERALD";

interface ShepherdEntry {
  id: string;
  initials: string;
  name: string;
  reason: string;
  urgency: Urgency;
  phone?: string | null;
}

const URGENCY_COLOR: Record<Urgency, string> = {
  CRITICAL: "#E84855",
  HIGH:     "#F0B83C",
  GOLD:     "#C9922A",
  EMERALD:  "#1DC98C",
};

const DEFAULT_ENTRIES: ShepherdEntry[] = [
  { id: "1", initials: "JM", name: "José Martínez",  reason: "Sin asistir 23 días · riesgo CRÍTICO",    urgency: "CRITICAL", phone: "+573001234567" },
  { id: "2", initials: "PG", name: "Patricia G.",    reason: "Primera ofrenda — momento espiritual",     urgency: "EMERALD",  phone: "+573009876543" },
  { id: "3", initials: "RT", name: "Rafael T.",      reason: "Pipeline liderazgo · score 84/100",        urgency: "GOLD",     phone: "+573001112222" },
  { id: "4", initials: "CV", name: "Carmen V.",      reason: "Voluntaria 11 sem. consecutivas",          urgency: "HIGH",     phone: "+573003334444" },
];

interface Props {
  entries?: ShepherdEntry[];
  onRefresh?: () => Promise<void>;
}

export function ShepherdsLogCosmos({ entries = DEFAULT_ENTRIES, onRefresh }: Props) {
  const [localEntries, setLocalEntries] = useState(entries);
  const [refreshing, setRefreshing] = useState(false);

  const logContact = (id: string) => {
    setLocalEntries(prev => prev.filter(e => e.id !== id));
  };

  const refresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "10px",
      }}>
        <div style={{
          fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase",
          color: "#7A5218", display: "flex", alignItems: "center", gap: "6px",
        }}>
          Registro del Pastor
          <div style={{ flex: 1, height: "1px", background: "rgba(201,146,42,0.12)", width: "40px" }} />
        </div>
        {onRefresh && (
          <button
            onClick={refresh}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "rgba(138,147,168,0.5)", padding: "2px",
            }}
          >
            <RefreshCw size={12} style={{ animation: refreshing ? "rotateSlow 1s linear infinite" : "none" }} />
          </button>
        )}
      </div>

      {localEntries.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px",
            textAlign: "center", padding: "20px 0",
            fontSize: "11px", color: "rgba(138,147,168,0.5)",
          }}>
            <CheckCircle size={14} style={{ color: "#1DC98C" }} /> Todas las ovejas cuidadas esta semana
          </div>
      ) : (
        localEntries.map((entry) => (
          <div
            key={entry.id}
            style={{
              display: "flex", alignItems: "flex-start", gap: "8px",
              padding: "8px 8px",
              borderRadius: "9px", marginBottom: "5px",
              border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(13,22,40,0.45)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              const color = URGENCY_COLOR[entry.urgency];
              (e.currentTarget as HTMLDivElement).style.borderColor = color + "40";
              (e.currentTarget as HTMLDivElement).style.background = color + "08";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLDivElement).style.background = "rgba(13,22,40,0.45)";
            }}
          >
            {/* Urgency bar */}
            <div style={{
              width: "3px", borderRadius: "2px",
              background: URGENCY_COLOR[entry.urgency],
              alignSelf: "stretch", flexShrink: 0,
              boxShadow: `0 0 6px ${URGENCY_COLOR[entry.urgency]}66`,
            }} />

            {/* Avatar */}
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 600,
              background: `linear-gradient(135deg, ${URGENCY_COLOR[entry.urgency]}30, ${URGENCY_COLOR[entry.urgency]}10)`,
              border: `1px solid ${URGENCY_COLOR[entry.urgency]}40`,
              color: URGENCY_COLOR[entry.urgency],
              fontFamily: "var(--font-display)",
            }}>
              {entry.initials}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "11px", color: "hsl(var(--foreground))", fontWeight: 500, marginBottom: "2px" }}>
                {entry.name}
              </div>
              <div style={{
                fontSize: "9px", color: "hsl(var(--muted-foreground))",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {entry.reason}
              </div>
            </div>

            {/* WhatsApp action */}
            {entry.phone && (
              <a
                href={`https://wa.me/${entry.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => logContact(entry.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "3px",
                  fontSize: "9px", color: "#1DC98C",
                  padding: "3px 6px", borderRadius: "5px",
                  border: "1px solid rgba(29,201,140,0.2)",
                  background: "rgba(29,201,140,0.05)",
                  textDecoration: "none", flexShrink: 0,
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1DC98C";
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(29,201,140,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(29,201,140,0.2)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(29,201,140,0.05)";
                }}
              >
                <MessageCircle size={9} />
                WA
              </a>
            )}
          </div>
        ))
      )}

      <div style={{
        fontSize: "8px", color: "rgba(138,147,168,0.4)",
        textAlign: "center", marginTop: "6px", lineHeight: 1.5,
      }}>
        Generado por IA como apoyo ministerial.<br />
        La decisión pastoral pertenece al pastor.
      </div>
    </div>
  );
}
