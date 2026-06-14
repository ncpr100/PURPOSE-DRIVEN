"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, ShieldAlert, Copy, Check } from "lucide-react";
export default function TenantSecuritySettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [totpCode, setTotpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (status === "authenticated") {
      checkMfaStatus();
    }
  }, [status]);
  const checkMfaStatus = async () => {
    try {
      const res = await fetch("/api/platform/settings/mfa/status");
      if (res.ok) {
        const data = await res.json();
        setIsEnabled(data.isEnabled);
      }
    } catch (err) {
      console.error("Error checking MFA status:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (setupData?.otpauthUrl) {
      QRCode.toDataURL(setupData.otpauthUrl, {
        width: 200,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      })
        .then((url) => {
          setQrDataUrl(url);
        })
        .catch((err) => {
          console.error("Error generando QR Code:", err);
        });
    }
  }, [setupData]);
  const handleSetup = async () => {
    setError("");
    setSuccess("");
    setIsSettingUp(true);
    try {
      const res = await fetch("/api/platform/settings/mfa/setup", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setSetupData({ secret: data.secret, otpauthUrl: data.otpauthUrl });
      } else {
        const errData = await res.json();
        setError(errData.error || "Error iniciando configuración");
      }
    } catch (err) {
      setError("Error de red al iniciar configuración");
    } finally {
      setIsSettingUp(false);
    }
  };
  const handleVerify = async () => {
    if (totpCode.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }
    setError("");
    setIsVerifying(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch("/api/platform/settings/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totpCode }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        setIsEnabled(true);
        setSetupData(null);
        setQrDataUrl("");
        setTotpCode("");
        setBackupCodes(data.backupCodes || []);
        setSuccess("¡2FA activado exitosamente! Guarda tus códigos de respaldo.");
      } else {
        const errData = await res.json();
        setError(errData.error || "Código inválido o expirado");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("La verificación tardó demasiado. Intenta de nuevo.");
      } else {
        setError("Error de red al verificar.");
      }
    } finally {
      setIsVerifying(false);
    }
  };
  const handleDisable = async () => {
    if (!confirm("¿Estás seguro de que deseas desactivar la autenticación de dos factores?")) return;
    try {
      const res = await fetch("/api/platform/settings/mfa/disable", { method: "POST" });
      if (res.ok) {
        setIsEnabled(false);
        setSuccess("2FA desactivado correctamente.");
      } else {
        setError("Error al desactivar 2FA");
      }
    } catch (err) {
      setError("Error de red al desactivar");
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Seguridad de la Cuenta</h1>
        <p className="text-muted-foreground">
          Gestiona la autenticación de dos factores (2FA) para proteger los datos de tu congregación.
        </p>
      </div>
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">{error}</div>
      )}
      {success && (
        <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-lg border border-green-500/20">{success}</div>
      )}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            {isEnabled ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-yellow-500" />
            )}
            Autenticación de Dos Factores (2FA)
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isEnabled
              ? "Tu cuenta está protegida con 2FA. Cada vez que inicies sesión, necesitarás un código de tu aplicación de autenticación."
              : "Agrega una capa extra de seguridad a tu cuenta requiriendo un código de verificación además de tu contraseña."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEnabled && !setupData && (
            <Button onClick={handleSetup} disabled={isSettingUp} className="w-full sm:w-auto">
              {isSettingUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activar 2FA
            </Button>
          )}
          {setupData && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Instrucciones para activar 2FA
                </h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">1</span>
                    <span>Abre tu aplicación de autenticación (Google Authenticator, Authy, 1Password, etc.).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">2</span>
                    <span>Escanea el código QR o ingresa la clave secreta manualmente.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">3</span>
                    <span>Ingresa el <strong className="text-foreground">código de 6 dígitos</strong> que muestra la app y haz clic en Verificar.</span>
                  </li>
                </ol>
              </div>
              <div className="flex flex-col items-center space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code 2FA" className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm" />
                ) : (
                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border border-border">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                <div className="text-center w-full max-w-xs">
                  <p className="text-xs text-muted-foreground mb-1">Clave secreta (ingreso manual):</p>
                  <div className="flex items-center justify-center gap-2 bg-background border border-border rounded-md p-2">
                    <code className="text-sm font-mono text-foreground select-all">{setupData.secret}</code>
                    <button onClick={() => copyToClipboard(setupData.secret)} className="text-muted-foreground hover:text-foreground transition-colors" title="Copiar">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3 max-w-sm mx-auto">
                <div>
                  <Label htmlFor="totp-code" className="text-foreground">Código de 6 dígitos</Label>
                  <Input
                    id="totp-code"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Ej: 123456"
                    className="text-center text-2xl tracking-widest font-mono mt-2 bg-background text-foreground border-border"
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleVerify} disabled={isVerifying || totpCode.length !== 6} className="flex-1">
                    {isVerifying ? "Verificando..." : "Verificar Código"}
                  </Button>
                  <Button variant="outline" onClick={() => { setSetupData(null); setQrDataUrl(""); setTotpCode(""); setError(""); }} disabled={isVerifying}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
          {isEnabled && !setupData && backupCodes.length === 0 && (
            <Button variant="destructive" onClick={handleDisable} className="w-full sm:w-auto">
              Desactivar 2FA
            </Button>
          )}
          {backupCodes.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h3 className="text-base font-semibold text-yellow-600 dark:text-yellow-400 mb-2">⚠️ Guarda estos códigos de respaldo</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  Si pierdes acceso a tu aplicación, usa uno de estos códigos. Cada código es de un solo uso.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="bg-background border border-border rounded p-2 text-center font-mono text-sm text-foreground">{code}</div>
                  ))}
                </div>
              </div>
              <Button onClick={() => { setBackupCodes([]); setSuccess(""); }} className="w-full">
                He guardado los códigos de forma segura
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
