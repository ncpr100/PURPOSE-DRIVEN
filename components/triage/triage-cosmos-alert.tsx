"use client";
// components/triage/triage-cosmos-alert.tsx
// Real-time spiritual triage alert that appears when a distress keyword is detected.
// Auto-dismisses after 8 seconds. Routes to human immediately.

import { useState, useEffect } from "react";
import { X, AlertTriangle, Clock } from "lucide-react";

interface TriageAlertProps {
  message?: string;
  keyword?: string;
  requesterName?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}

export function TriageCosmosAlert({
  message = "Petición detectada: \"divorcio\" — Enrutando al pastor",
  keyword = "divorcio",
  requesterName,
  onDismiss,
  autoDismissMs = 8000,
}: TriageAlertProps) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    requestAnimationFrame(() => setOpacity(1));

    // Auto dismiss
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 500);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  const dismiss = () => {
    setOpacity(0);
    setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "300px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "12px",
        background: "rgba(10,16,30,0.96)",
        border: "1px solid rgba(232,72,85,0.5)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 30px rgba(232,72,85,0.12)",
        maxWidth: "300px",
        opacity,
        transform: opacity === 1 ? "translateX(0)" : "translateX(20px)",
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        cursor: "pointer",
      }}
      onClick={dismiss}
    >
      {/* Pulsing icon */}
      <div style={{
        flexShrink: 0,
        animation: "alertPulse 0.8s ease-in-out infinite",
      }}>
        <AlertTriangle size={22} style={{ color: "#E84855" }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "12px", fontWeight: 600, color: "#E84855",
          marginBottom: "3px",
        }}>
          Triaje Espiritual Activo
        </div>
        <div style={{ fontSize: "10px", color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }}>
          {requesterName && <strong style={{ color: "hsl(var(--foreground))" }}>{requesterName} — </strong>}
          {message}
        </div>
        <div style={{
          fontSize: "9px", color: "#E84855", marginTop: "4px",
          animation: "countdown 1s ease-in-out infinite",
        }}>
          <Clock size={9} style={{ display: "inline", marginRight: "3px" }} /> Notificando al pastor ahora...
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        aria-label="Cerrar alerta"
        style={{
          width: "22px", height: "22px", borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(138,147,168,0.7)", flexShrink: 0,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
      >
        <X size={10} />
      </button>

      {/* Alert keyframes (injected once) */}
      <style>{`
        @keyframes alertPulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
