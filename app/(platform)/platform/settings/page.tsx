"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import EnhancedSecurityMonitoring from "../_components/enhanced-security-monitoring";
import {
  Settings,
  Shield,
  Bell,
  Mail,
  Database,
  Key,
  Globe,
  Users,
  CreditCard,
  Activity,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { SubscriptionManagement } from "@/components/platform/subscription/subscription-management";

// ─── Professional default welcome email template ───────────────────────────
const DEFAULT_WELCOME_SUBJECT =
  "Bienvenido a Kḥesed-tek CMS - Credenciales de {{churchName}}";

const DEFAULT_WELCOME_BODY = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a Kḥesed-tek CMS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f0f4f8;
      color: #1a202c;
      padding: 32px 16px;
    }
    .wrapper {
      max-width: 620px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
      padding: 40px 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .header p {
      color: #bfdbfe;
      font-size: 14px;
    }
    .body {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #1e3a5f;
      margin-bottom: 12px;
    }
    .intro {
      font-size: 15px;
      color: #4a5568;
      line-height: 1.7;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    .card {
      border-radius: 8px;
      padding: 20px 24px;
      margin-bottom: 20px;
    }
    .card-blue {
      background: #eff6ff;
      border-left: 4px solid #2563eb;
    }
    .card-orange {
      background: #fff7ed;
      border-left: 4px solid #f97316;
    }
    .card-green {
      background: #f0fdf4;
      border-left: 4px solid #16a34a;
    }
    .card p {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
      margin-bottom: 6px;
    }
    .card p:last-child { margin-bottom: 0; }
    .label { font-weight: 600; color: #1e3a5f; }
    .credential-code {
      background: #1e3a5f;
      color: #93c5fd;
      font-family: 'Courier New', monospace;
      font-size: 15px;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
    .cta {
      display: block;
      width: 100%;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff !important;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      padding: 14px 24px;
      border-radius: 8px;
      text-decoration: none;
      margin: 28px 0;
    }
    .steps ol {
      padding-left: 20px;
    }
    .steps li {
      font-size: 14px;
      color: #374151;
      line-height: 1.7;
      margin-bottom: 4px;
    }
    .divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 28px 0;
    }
    .footer {
      background: #f8fafc;
      border-top: 1px solid #e5e7eb;
      padding: 24px 32px;
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .footer strong {
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Header -->
    <div class="header">
      <h1>Kḥesed-tek CMS</h1>
      <p>44 años de corazón pastoral, ahora potenciados por tecnología</p>
    </div>

    <!-- Body -->
    <div class="body">

      <p class="greeting">Hola, Pastor {{adminName}}</p>
      <p class="intro">
        ¡Es un honor caminar junto a usted en esta nueva etapa para su ministerio!<br />
        Le confirmamos que el perfil de <strong>{{churchName}}</strong> ha sido creado y configurado
        exitosamente en nuestra plataforma. A partir de hoy, usted cuenta con un equipo de agentes de IA
        diseñados desde la experiencia pastoral para ayudarle a recuperar su tiempo y cuidar mejor de su congregación.
      </p>

      <!-- Credentials -->
      <p class="section-title">Sus credenciales de acceso</p>
      <div class="card card-blue">
        <p>Para comenzar a explorar su nuevo panel administrativo, utilice los siguientes datos:</p>
        <br />
        <p><span class="label">Enlace de acceso:</span> <a href="{{loginUrl}}">{{loginUrl}}</a></p>
        <p><span class="label">Usuario:</span> {{adminEmail}}</p>
        <p><span class="label">Contraseña temporal:</span> <span class="credential-code">{{tempPassword}}</span></p>
        <br />
        <p style="font-size:13px; color:#6b7280;">{{authStatus}}</p>
      </div>

      <!-- CTA Button -->
      <a href="{{loginUrl}}" class="cta">Acceder a mi Panel Administrativo</a>

      <!-- Warning -->
      <div class="card card-orange">
        <p><span class="label">Importante:</span> Le recomendamos cambiar su contraseña en su primer inicio de sesión por seguridad.</p>
      </div>

      <!-- First Steps -->
      <p class="section-title">Sus primeros pasos recomendados</p>
      <div class="steps">
        <p style="font-size:14px; color:#4a5568; margin-bottom:10px;">
          Sabemos que su tiempo es valioso, por eso le sugerimos comenzar con estas 3 acciones simples:
        </p>
        <ol>
          <li>Salude a sus Agentes: Ingrese al panel y vea el estado actual de su Shepherd's Log.</li>
          <li>Revise su WhatsApp: En breve recibirá un mensaje de prueba de nuestro Agent 12 para verificar la conexión con su equipo de voluntarios.</li>
          <li>Agende su sesión de bienvenida: Si aún no lo ha hecho, puede programar una llamada de 15 minutos con nosotros para resolver dudas técnicas.</li>
        </ol>
      </div>

      <hr class="divider" />

      <!-- Support -->
      <div class="card card-green">
        <p>
          <span class="label">Estamos para servirle.</span><br />
          Recuerde que, como Iglesia Fundadora, usted tiene línea directa con nosotros.
          Si tiene cualquier duda o necesita ayuda configurando a su equipo, simplemente
          responda a este correo o escríbanos por WhatsApp al <strong>+57 302 1234410</strong>.
        </p>
      </div>

      <p style="font-size:14px; color:#4a5568; margin-top:24px; line-height:1.7;">
        Estamos orando para que esta herramienta sea de bendición para su vida, su familia
        y toda la congregación de <strong>{{churchName}}</strong>.<br /><br />
        En Cristo,<br />
        <strong>El Equipo de Khesed-Tek Systems</strong>
      </p>

    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Kḥesed-tek Church Management Systems</strong></p>
      <p>soporte@khesed-tek-systems.org &nbsp;|&nbsp; Sistema completo de gestión para iglesias</p>
    </div>

  </div>
</body>
</html>`;
// ─────────────────────────────────────────────────────────────────────────────

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState({
    platform: {
      name: "Kḥesed-tek Church Management Systems",
      description: "Plataforma completa de gestión para iglesias",
      supportEmail: "soporte@khesed-tek-systems.org",
      maintenanceMode: false,
      allowRegistrations: true,
      maxChurchesPerAdmin: 5,
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      maintenanceAlerts: true,
      securityAlerts: true,
    },
    security: {
      requireTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
    },
    billing: {
      currency: "USD",
      taxRate: 0.0,
      freeTrialDays: 14,
      gracePeriodDays: 7,
    },
    welcomeEmail: {
      subject: "",
      body: "",
    },
  });
  const [platformSettingsId, setPlatformSettingsId] = useState<string | null>(
    null,
  );

  const [systemActionLoading, setSystemActionLoading] = useState(false);

  const [gatewayStatus, setGatewayStatus] = useState<
    Record<
      string,
      {
        name: string;
        configured: boolean;
        envVar: string;
        webhookConfigured: boolean;
        description: string;
        website: string;
      }
    >
  >({});
  const [gatewayLoading, setGatewayLoading] = useState(false);

  // Refs for variable insertion into welcome email fields
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const lastFocused = useRef<"subject" | "body">("body");

  const loadDefaultTemplate = () => {
    handleSettingChange("welcomeEmail", "subject", DEFAULT_WELCOME_SUBJECT);
    handleSettingChange("welcomeEmail", "body", DEFAULT_WELCOME_BODY);
  };

  const insertVariable = (token: string) => {
    const isSubject = lastFocused.current === "subject";
    const target = isSubject ? subjectRef.current : bodyRef.current;
    const field = isSubject ? "subject" : "body";
    if (!target) return;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const next = target.value.slice(0, start) + token + target.value.slice(end);
    handleSettingChange("welcomeEmail", field, next);
    requestAnimationFrame(() => {
      target.focus();
      const pos = start + token.length;
      target.setSelectionRange(pos, pos);
    });
  };

  const loadGatewayStatus = async () => {
    setGatewayLoading(true);
    try {
      const res = await fetch("/api/platform/gateway-status");
      if (res.ok) {
        const data = await res.json();
        setGatewayStatus(data.gateways || {});
      }
    } catch {
      /* silently fail */
    } finally {
      setGatewayLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformSettings();
    loadGatewayStatus();
  }, []);

  const loadPlatformSettings = async () => {
    try {
      const response = await fetch("/api/platform/settings");
      if (response.ok) {
        const data = await response.json();
        setPlatformSettingsId(data.id);
        setSettings((prev) => ({
          ...prev,
          platform: {
            ...prev.platform,
            name: data.platformName || prev.platform.name,
            supportEmail: data.supportEmail || prev.platform.supportEmail,
            maintenanceMode:
              data.maintenanceMode ?? prev.platform.maintenanceMode,
            allowRegistrations:
              data.allowRegistrations ?? prev.platform.allowRegistrations,
          },
          billing: {
            ...prev.billing,
            currency: data.currency || prev.billing.currency,
            taxRate: data.taxRate ?? prev.billing.taxRate,
            freeTrialDays: data.freeTrialDays ?? prev.billing.freeTrialDays,
            gracePeriodDays:
              data.gracePeriodDays ?? prev.billing.gracePeriodDays,
          },
          welcomeEmail: {
            subject: data.welcomeEmailSubject || "",
            body: data.welcomeEmailBody || "",
          },
        }));
      }
    } catch (error) {
      console.error("Error loading platform settings:", error);
      toast.error("Error al cargar configuración de plataforma");
    }
  };

  const handleDatabaseBackup = async () => {
    setSystemActionLoading(true);
    try {
      const response = await fetch("/api/platform/system/backup", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Backup de base de datos completado exitosamente");
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al crear backup de base de datos");
      }
    } catch (error) {
      console.error("Error creating database backup:", error);
      toast.error("Error de conexión al crear backup");
    } finally {
      setSystemActionLoading(false);
    }
  };

  const handleClearCache = async () => {
    setSystemActionLoading(true);
    try {
      const response = await fetch("/api/platform/system/cache", {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Cache del sistema limpiado exitosamente");
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al limpiar cache del sistema");
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error("Error de conexión al limpiar cache");
    } finally {
      setSystemActionLoading(false);
    }
  };

  const handleRegenerateKeys = async () => {
    if (
      !confirm(
        "¿Estás seguro de regenerar las claves del sistema? Esto requerirá que todos los usuarios inicien sesión nuevamente.",
      )
    ) {
      return;
    }

    setSystemActionLoading(true);
    try {
      const response = await fetch("/api/platform/system/keys", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Claves del sistema regeneradas exitosamente");

        // Show warning about application restart
        setTimeout(() => {
          toast("Las nuevas claves requieren reinicio de la aplicación", {
            duration: 5000,
          });
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al regenerar claves del sistema");
      }
    } catch (error) {
      console.error("Error regenerating keys:", error);
      toast.error("Error de conexión al regenerar claves");
    } finally {
      setSystemActionLoading(false);
    }
  };

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async (section: string) => {
    try {
      const response = await fetch("/api/platform/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: platformSettingsId,
          platformName: settings.platform.name,
          supportEmail: settings.platform.supportEmail,
          maintenanceMode: settings.platform.maintenanceMode,
          allowRegistrations: settings.platform.allowRegistrations,
          currency: settings.billing.currency,
          taxRate: settings.billing.taxRate,
          freeTrialDays: settings.billing.freeTrialDays,
          gracePeriodDays: settings.billing.gracePeriodDays,
          welcomeEmailSubject: settings.welcomeEmail.subject || null,
          welcomeEmailBody: settings.welcomeEmail.body || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlatformSettingsId(data.id);
        toast.success(`Configuración de ${section} guardada exitosamente`);

        // If currency was changed, show notification about refreshing subscription display
        if (section === "billing") {
          toast.success(
            "Precios de suscripción actualizados con nueva moneda",
            {
              duration: 4000,
            },
          );
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error de conexión al guardar la configuración");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Configuración de Plataforma
          </h1>
          <p className="text-muted-foreground">
            Administrar configuración global del sistema
          </p>
        </div>

        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Super Admin Only
        </Badge>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="platform" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Plataforma
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Suscripciones
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoreo
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Facturación
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Bienvenida
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuración General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platformName">Nombre de la Plataforma</Label>
                  <Input
                    id="platformName"
                    value={settings.platform.name}
                    onChange={(e) =>
                      handleSettingChange("platform", "name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="supportEmail">Email de Soporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.platform.supportEmail}
                    onChange={(e) =>
                      handleSettingChange(
                        "platform",
                        "supportEmail",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="platformDescription">Descripción</Label>
                <Textarea
                  id="platformDescription"
                  value={settings.platform.description}
                  onChange={(e) =>
                    handleSettingChange(
                      "platform",
                      "description",
                      e.target.value,
                    )
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Desactivar acceso a la plataforma temporalmente
                    </p>
                  </div>
                  <Switch
                    checked={settings.platform.maintenanceMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "platform",
                        "maintenanceMode",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Permitir Registros</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilitar registro de nuevas iglesias
                    </p>
                  </div>
                  <Switch
                    checked={settings.platform.allowRegistrations}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "platform",
                        "allowRegistrations",
                        checked,
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="maxChurches">Máximo Iglesias por Admin</Label>
                  <Input
                    id="maxChurches"
                    type="number"
                    value={settings.platform.maxChurchesPerAdmin}
                    onChange={(e) =>
                      handleSettingChange(
                        "platform",
                        "maxChurchesPerAdmin",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-32"
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("platform")}>
                Guardar Configuración General
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          {/* Subscription Management Instructions */}
          <Card className="border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.10)]/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--success))]">
                <CreditCard className="h-5 w-5" />
                <span>Gestión de Suscripciones SUPER_ADMIN</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-[hsl(var(--success))] space-y-2">
                <p>
                  <strong>Control Total de Precios y Características:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Editar precios mensuales/anuales de todos los planes</li>
                  <li>
                    Modificar límites de iglesias, miembros y usuarios
                    administradores
                  </li>
                  <li>
                    Agregar/eliminar características y complementos de
                    suscripción
                  </li>
                  <li>
                    <strong>
                      Cambios se reflejan automáticamente en página de registro
                    </strong>
                  </li>
                </ul>
                <div className="mt-3 p-2 bg-[hsl(var(--success)/0.15)] rounded border-l-4 border-[hsl(var(--success)/0.30)]">
                  <strong>Sincronización en Tiempo Real:</strong> Cualquier
                  actualización aquí aparece instantáneamente en el formulario
                  de registro de nuevos tenants.
                </div>
              </div>
            </CardContent>
          </Card>

          <SubscriptionManagement />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificaciones importantes por email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "notifications",
                        "emailNotifications",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertas del Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre eventos del sistema
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "notifications",
                        "systemAlerts",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertas de Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre ventanas de mantenimiento
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.maintenanceAlerts}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "notifications",
                        "maintenanceAlerts",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertas de Seguridad</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre eventos de seguridad críticos
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.securityAlerts}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "notifications",
                        "securityAlerts",
                        checked,
                      )
                    }
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("notifications")}>
                Guardar Configuración de Notificaciones
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Requerir Autenticación de Dos Factores</Label>
                  <p className="text-sm text-muted-foreground">
                    Forzar 2FA para todos los administradores
                  </p>
                </div>
                <Switch
                  checked={settings.security.requireTwoFactor}
                  onCheckedChange={(checked) =>
                    handleSettingChange("security", "requireTwoFactor", checked)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">
                    Timeout de Sesión (min)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "sessionTimeout",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="maxLoginAttempts">
                    Máx. Intentos de Login
                  </Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "maxLoginAttempts",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="passwordMinLength">
                    Long. Mínima Contraseña
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "passwordMinLength",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("security")}>
                Guardar Configuración de Seguridad
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <EnhancedSecurityMonitoring />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* USD Billing Model Info Card */}
          <Card className="border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.06)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--info))]">
                <Globe className="h-5 w-5" />
                <span>Modelo de Facturación USD</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-[hsl(var(--info))] space-y-2">
                <p>
                  <strong>Proceso de Facturación Manual:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    Todos los precios se muestran en{" "}
                    <strong>USD (Dólares Americanos)</strong>
                  </li>
                  <li>
                    Facturas son generadas y enviadas manualmente por el
                    administrador
                  </li>
                  <li>Los tenants reciben acceso tras confirmación de pago</li>
                  <li>
                    Períodos de prueba de 14 días siguen activos para evaluación
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Configuración de Facturación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Moneda</Label>
                  <select
                    id="currency"
                    value={settings.billing.currency}
                    onChange={(e) =>
                      handleSettingChange("billing", "currency", e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="USD">
                      USD - Dólar Americano (Recomendado)
                    </option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="COP">COP - Peso Colombiano</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="taxRate">Tasa de Impuesto (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.billing.taxRate}
                    onChange={(e) =>
                      handleSettingChange(
                        "billing",
                        "taxRate",
                        parseFloat(e.target.value),
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="freeTrialDays">Días de Prueba Gratuita</Label>
                  <Input
                    id="freeTrialDays"
                    type="number"
                    value={settings.billing.freeTrialDays}
                    onChange={(e) =>
                      handleSettingChange(
                        "billing",
                        "freeTrialDays",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="gracePeriodDays">
                    Período de Gracia (días)
                  </Label>
                  <Input
                    id="gracePeriodDays"
                    type="number"
                    value={settings.billing.gracePeriodDays}
                    onChange={(e) =>
                      handleSettingChange(
                        "billing",
                        "gracePeriodDays",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("billing")}>
                Guardar Configuración de Facturación
              </Button>
            </CardContent>
          </Card>

          {/* Platform Payment Gateways Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[hsl(var(--info))]" />
                  <span>Pasarelas de Pago de la Plataforma</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadGatewayStatus}
                  disabled={gatewayLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-1 ${gatewayLoading ? "animate-spin" : ""}`}
                  />
                  Actualizar
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Estado de las integraciones de pago para suscripciones de la
                plataforma. Configure las variables de entorno en Vercel para
                activar cada pasarela.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(gatewayStatus).map((gw) => (
                  <div
                    key={gw.name}
                    className={`rounded-lg border p-4 space-y-3 ${gw.configured ? "border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.10)]/50" : "border-border bg-muted/30/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-base">{gw.name}</span>
                      {gw.configured ? (
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground/70" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {gw.description}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <Key className="h-3.5 w-3.5 text-muted-foreground" />
                        <code className="bg-[hsl(var(--muted))] border rounded px-1.5 py-0.5 font-mono text-[11px]">
                          {gw.envVar}
                        </code>
                        {gw.configured ? (
                          <span className="text-[hsl(var(--success))] font-medium">
                            Configurado
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            No configurado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Webhook:</span>
                        {gw.webhookConfigured ? (
                          <span className="text-[hsl(var(--success))] font-medium">
                            Configurado
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            No configurado
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={gw.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[hsl(var(--info))] hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {gw.website.replace("https://", "")}
                    </a>
                  </div>
                ))}
                {Object.keys(gatewayStatus).length === 0 && !gatewayLoading && (
                  <p className="col-span-3 text-sm text-muted-foreground text-center py-4">
                    No se pudo cargar el estado de las pasarelas. Intente
                    actualizar.
                  </p>
                )}
                {gatewayLoading && (
                  <p className="col-span-3 text-sm text-muted-foreground text-center py-4">
                    Cargando estado de pasarelas...
                  </p>
                )}
              </div>
              <div className="mt-4 p-3 bg-[hsl(var(--info)/0.10)] border border-[hsl(var(--info)/0.3)] rounded-lg text-xs text-[hsl(var(--info))] space-y-1">
                <p className="font-medium">¿Cómo activar una pasarela?</p>
                <ol className="list-decimal list-inside space-y-0.5 ml-1">
                  <li>
                    Ve a tu panel de Vercel → Settings → Environment Variables
                  </li>
                  <li>
                    Agrega la variable de entorno indicada con tu clave API
                  </li>
                  <li>
                    Redeploya la aplicación para que los cambios tomen efecto
                  </li>
                  <li>
                    Haz clic en &quot;Actualizar&quot; aquí para ver el nuevo
                    estado
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Manual Invoicing Workflow Card */}
          <Card className="border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.10)]/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--warning))]">
                <RefreshCw className="h-5 w-5" />
                <span>Flujo de Facturación Manual</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-[hsl(var(--warning))] space-y-2">
                <p>
                  <strong>Proceso Paso a Paso:</strong>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <p>
                      <strong>1. Registro del Tenant:</strong>
                    </p>
                    <ul className="list-disc list-inside text-xs ml-4">
                      <li>Tenant se registra y selecciona plan</li>
                      <li>Recibe acceso de prueba por 14 días</li>
                      <li>Notificación automática al SUPER_ADMIN</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <strong>2. Facturación & Pago:</strong>
                    </p>
                    <ul className="list-disc list-inside text-xs ml-4">
                      <li>SUPER_ADMIN calcula y envía factura USD</li>
                      <li>Tenant realiza pago según factura</li>
                      <li>SUPER_ADMIN confirma pago y activa acceso</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[hsl(var(--success)/0.10)] border border-[hsl(var(--success)/0.3)] rounded-lg">
                  <div className="w-3 h-3 bg-[hsl(var(--success)/0.10)]0 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Base de Datos</p>
                  <p className="text-xs text-muted-foreground">Conectada</p>
                </div>

                <div className="text-center p-4 bg-[hsl(var(--success)/0.10)] border border-[hsl(var(--success)/0.3)] rounded-lg">
                  <div className="w-3 h-3 bg-[hsl(var(--success)/0.10)]0 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Email Service</p>
                  <p className="text-xs text-muted-foreground">Operativo</p>
                </div>

                <div className="text-center p-4 bg-[hsl(var(--success)/0.10)] border border-[hsl(var(--success)/0.3)] rounded-lg">
                  <div className="w-3 h-3 bg-[hsl(var(--success)/0.10)]0 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium">API External</p>
                  <p className="text-xs text-muted-foreground">Activo</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Acciones del Sistema</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDatabaseBackup}
                    disabled={systemActionLoading}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Backup BD
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCache}
                    disabled={systemActionLoading}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Limpiar Cache
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateKeys}
                    disabled={systemActionLoading}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Regenerar Keys
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Bienvenida Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Plantilla de Email de Bienvenida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Personalice el email que reciben los administradores cuando se
                crea una nueva iglesia. Si se deja en blanco, se usará la
                plantilla predeterminada del sistema.
              </p>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="welcomeSubject">Asunto del Email</Label>
                <Input
                  id="welcomeSubject"
                  ref={subjectRef}
                  placeholder="Bienvenido a Kḥesed-tek - Credenciales de {{churchName}}"
                  value={settings.welcomeEmail.subject}
                  onFocus={() => { lastFocused.current = "subject"; }}
                  onChange={(e) =>
                    handleSettingChange(
                      "welcomeEmail",
                      "subject",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <Label htmlFor="welcomeBody">Cuerpo del Email (HTML)</Label>
                <Textarea
                  id="welcomeBody"
                  ref={bodyRef}
                  placeholder="<html>...</html> — deje en blanco para usar la plantilla predeterminada"
                  value={settings.welcomeEmail.body}
                  onFocus={() => { lastFocused.current = "body"; }}
                  onChange={(e) =>
                    handleSettingChange("welcomeEmail", "body", e.target.value)
                  }
                  className="min-h-[300px] font-mono text-xs"
                />
              </div>

              {/* Variable reference — click to insert */}
              <div className="rounded-md border p-4 bg-muted/30 space-y-3">
                <p className="text-sm font-semibold">Variables disponibles <span className="font-normal text-muted-foreground">(haga clic para insertar en el campo activo)</span>:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    ["{{adminName}}", "Nombre del administrador"],
                    ["{{churchName}}", "Nombre de la iglesia"],
                    ["{{adminEmail}}", "Email del administrador"],
                    ["{{tempPassword}}", "Contraseña temporal"],
                    ["{{loginUrl}}", "URL de acceso al sistema"],
                    ["{{authStatus}}", "Mensaje de estado de autenticación"],
                  ].map(([token, desc]) => (
                    <div key={token} className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={() => insertVariable(token)}
                        className="bg-muted hover:bg-blue-100 hover:text-blue-800 px-1.5 py-0.5 rounded text-blue-700 font-mono text-xs shrink-0 cursor-pointer transition-colors border border-transparent hover:border-blue-300"
                        title={`Insertar ${token}`}
                      >
                        {token}
                      </button>
                      <span className="text-muted-foreground">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => handleSaveSettings("Email Bienvenida")}>
                  <Mail className="h-4 w-4 mr-2" />
                  Guardar Plantilla
                </Button>
                <Button
                  variant="outline"
                  disabled={!settings.welcomeEmail.body}
                  onClick={() => {
                    // Replace variables with realistic demo values so the
                    // preview shows exactly what the pastor will receive.
                    const preview = settings.welcomeEmail.body
                      .replaceAll("{{adminName}}", "Pastor Carlos García")
                      .replaceAll("{{churchName}}", "Iglesia Central")
                      .replaceAll("{{adminEmail}}", "pastor@iglesiacentral.com")
                      .replaceAll("{{tempPassword}}", "Khesed2024#")
                      .replaceAll(
                        "{{loginUrl}}",
                        "https://khesed-tek-cms-org.vercel.app",
                      )
                      .replaceAll(
                        "{{authStatus}}",
                        "Tu cuenta de autenticación ha sido creada automáticamente.",
                      );
                    const win = window.open("about:blank", "_blank");
                    if (win) {
                      win.document.write(preview);
                      win.document.close();
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Vista Previa
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    loadDefaultTemplate();
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cargar Plantilla Profesional
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  disabled={
                    !settings.welcomeEmail.subject &&
                    !settings.welcomeEmail.body
                  }
                  onClick={() => {
                    handleSettingChange("welcomeEmail", "subject", "");
                    handleSettingChange("welcomeEmail", "body", "");
                    handleSaveSettings("Email Bienvenida");
                  }}
                >
                  Limpiar Plantilla
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
