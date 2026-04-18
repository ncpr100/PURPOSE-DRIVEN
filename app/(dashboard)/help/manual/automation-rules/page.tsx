"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Zap,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  Heart,
  Settings,
  Plus,
  MessageSquare,
  Pencil,
} from "lucide-react";
import Link from "next/link";

export default function AutomationRulesManual() {
  return (
    <div className="container mx-auto p-6">
      <Link href="/help/manual/complete">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Manual
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">
            Manual: Reglas de Automatización
          </h1>
          <p className="text-muted-foreground">
            Guía completa del sistema de automatización inteligente
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Overview */}
        <Card className="border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.10)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[hsl(var(--info))]" />
              🎉 NUEVO: Ecosistema de Automatización Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Sistema Completo Integrado:</strong> Formularios + Códigos
              QR + Plantillas de Automatización = Seguimiento automático 24/7 de
              visitantes, peticiones de oración, voluntarios y eventos.
            </p>
            <div className="p-4 bg-white rounded-lg border border-[hsl(var(--info)/0.3)] my-4">
              <h4 className="font-semibold text-foreground mb-2">
                🔄 Flujo de Trabajo Completo:
              </h4>
              <div className="text-sm space-y-1 text-[hsl(var(--info))]">
                <div className="flex items-center gap-2">
                  <span className="font-bold">1. FORMULARIOS:</span>
                  <span>
                    Crear formularios personalizados para cualquier propósito
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">2. CÓDIGOS QR:</span>
                  <span>
                    Cada formulario genera un QR único para fácil acceso
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">3. PLANTILLAS:</span>
                  <span>
                    8+ plantillas de automatización listas para activar
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">4. AUTOMATIZACIÓN:</span>
                  <span>
                    Respuestas automáticas por SMS/Email/WhatsApp/Push
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">5. SEGUIMIENTO:</span>
                  <span>
                    Dashboard de todas las respuestas y acciones ejecutadas
                  </span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">⚡ Velocidad</h4>
                <p className="text-2xl font-bold text-[hsl(var(--info))]">Instantánea</p>
                <p className="text-xs text-muted-foreground">
                  Respuesta en segundos
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">🔄 Reintentos</h4>
                <p className="text-2xl font-bold text-[hsl(var(--success))]">3x</p>
                <p className="text-xs text-muted-foreground">
                  Con respaldo automático
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">📱 Canales</h4>
                <p className="text-2xl font-bold text-[hsl(var(--lavender))]">5</p>
                <p className="text-xs text-muted-foreground">
                  SMS, Email, WhatsApp, Push, Phone
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">🎯 Plantillas</h4>
                <p className="text-2xl font-bold text-[hsl(var(--warning))]">8+</p>
                <p className="text-xs text-muted-foreground">
                  Listas para usar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 ¿Cómo Funciona?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="bg-[hsl(var(--info)/0.15)] rounded-full p-2">
                <span className="text-2xl">1️⃣</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Evento Disparador</h4>
                <p className="text-sm text-muted-foreground">
                  Una petición de oración es enviada o un visitante hace
                  check-in en su iglesia.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground rotate-[-90deg]" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="bg-[hsl(var(--success)/0.15)] rounded-full p-2">
                <span className="text-2xl">2️⃣</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Evaluación de Reglas</h4>
                <p className="text-sm text-muted-foreground">
                  El sistema verifica qué reglas de automatización están activas
                  y si las condiciones coinciden (prioridad, categoría, horario
                  laboral, etc.).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground rotate-[-90deg]" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="bg-[hsl(var(--lavender)/0.15)] rounded-full p-2">
                <span className="text-2xl">3️⃣</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Ejecución de Acciones</h4>
                <p className="text-sm text-muted-foreground">
                  Si la regla tiene <strong>bypass approval</strong> (omitir
                  aprobación), las acciones se ejecutan inmediatamente: SMS,
                  Email, WhatsApp, notificaciones push.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Si NO tiene bypass, se crea una tarea de aprobación manual
                  para el pastor o administrador.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground rotate-[-90deg]" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-[hsl(var(--success)/0.10)] rounded-lg border-2 border-[hsl(var(--success)/0.3)]">
              <div className="bg-[hsl(var(--success)/0.15)] rounded-full p-2">
                <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Reintentos y Respaldo</h4>
                <p className="text-sm text-muted-foreground">
                  Si falla el primer intento (ej: SMS no entregado), el sistema
                  reintenta 3 veces con espera exponencial. Si sigue fallando,
                  usa canales de respaldo: SMS → Email → WhatsApp → Push →
                  Llamada telefónica.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complete Ecosystem Guide */}
        <Card>
          <CardHeader>
            <CardTitle>
              🎯 Ecosistema Completo: Formularios + QR + Automatización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Su iglesia ahora tiene un sistema completo e integrado que
              automatiza todo el proceso desde la captura inicial hasta el
              seguimiento personalizado.
            </p>

            {/* Ecosystem Flow */}
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg bg-[hsl(var(--success)/0.08)]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    1
                  </span>
                  📝 CREACIÓN DE FORMULARIOS
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>
                    • <strong>Constructor de Formularios:</strong> Cree
                    formularios personalizados para visitantes, peticiones de
                    oración, voluntarios, eventos
                  </li>
                  <li>
                    • <strong>Campos Dinámicos:</strong> Texto, email, teléfono,
                    selección múltiple, fechas, archivos
                  </li>
                  <li>
                    • <strong>Configuraciones Avanzadas:</strong> Mensajes de
                    agradecimiento, redirecciones, notificaciones
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg btn-cta-gradient">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    2
                  </span>
                  📱 GENERACIÓN DE CÓDIGOS QR
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>
                    • <strong>QR Automático:</strong> Cada formulario genera un
                    código QR único
                  </li>
                  <li>
                    • <strong>Fácil Distribución:</strong> Imprima y coloque en
                    bancos, boletines, pantallas
                  </li>
                  <li>
                    • <strong>Seguimiento:</strong> Vea cuántas personas
                    escanean cada código
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-[hsl(var(--lavender)/0.10)]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-[hsl(var(--lavender)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    3
                  </span>
                  🤖 PLANTILLAS DE AUTOMATIZACIÓN
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>
                    • <strong>8 Plantillas Listas:</strong> Flujos
                    pre-construidos para casos comunes
                  </li>
                  <li>
                    • <strong>Activación 1-Clic:</strong> No necesita programar,
                    solo activar
                  </li>
                  <li>
                    • <strong>Personalización:</strong> Ajuste mensajes,
                    horarios, canales de comunicación
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-gradient-to-r from-[hsl(var(--lavender))] to-[hsl(var(--destructive))]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-[hsl(var(--destructive)/0.08)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    4
                  </span>
                  ⚡ AUTOMATIZACIÓN INTELIGENTE
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>
                    • <strong>Respuesta Instantánea:</strong> Automación se
                    ejecuta en segundos
                  </li>
                  <li>
                    • <strong>Multi-Canal:</strong> SMS, Email, WhatsApp, Push
                    notifications
                  </li>
                  <li>
                    • <strong>Seguimiento Inteligente:</strong> Crea registros
                    CRM, asigna tareas, programa recordatorios
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-[hsl(var(--destructive)/0.10)]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-[hsl(var(--destructive)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    5
                  </span>
                  📊 DASHBOARD DE SEGUIMIENTO
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>
                    • <strong>Envíos de Formularios:</strong> Vea todos los
                    datos enviados
                  </li>
                  <li>
                    • <strong>Ejecuciones de Automatización:</strong> Monitoree
                    qué automatizaciones se ejecutaron
                  </li>
                  <li>
                    • <strong>Análisis Completo:</strong> Tasas de respuesta,
                    engagement, conversión
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border border-[hsl(var(--warning)/0.3)]">
              <h4 className="font-semibold mb-2 text-[hsl(var(--warning))]">
                🚀 Ejemplo Práctico: Visitante Primera Vez
              </h4>
              <ol className="text-sm text-[hsl(var(--warning))] space-y-2">
                <li>
                  <strong>1.</strong> Visitante escanea QR en banco → Abre
                  formulario de visitante
                </li>
                <li>
                  <strong>2.</strong> Completa formulario → Datos guardados
                  automáticamente
                </li>
                <li>
                  <strong>3.</strong> Sistema detecta nueva submisión → Ejecuta
                  plantilla "Visitante Primera Vez"
                </li>
                <li>
                  <strong>4.</strong> Automatización envía:
                </li>
                <div className="ml-6 space-y-1">
                  <li>• SMS de bienvenida al visitante (30 segundos)</li>
                  <li>• Email con información de la iglesia (1 minuto)</li>
                  <li>• Notificación al pastor (inmediato)</li>
                  <li>
                    • Registro en CRM como "Visitante Primera Vez" (automático)
                  </li>
                  <li>
                    • Recordatorio para llamada de seguimiento (programado 2
                    días)
                  </li>
                </div>
                <li>
                  <strong>5.</strong> Todo sucede automáticamente ¡sin
                  intervención manual!
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start Guide */}
        <Card className="border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.10)]">
          <CardHeader>
            <CardTitle className="text-foreground">
              🚀 Guía de Inicio Rápido (5 Minutos)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-white p-4 rounded-lg border border-[hsl(var(--success)/0.3)]">
                <h4 className="font-semibold mb-2 text-foreground">
                  🛠️ PASO 1: Crear Primer Formulario
                </h4>
                <ol className="text-sm text-[hsl(var(--success))] space-y-1">
                  <li>
                    <strong>1.</strong> Vaya a{" "}
                    <Link
                      href="/form-builder"
                      className="text-[hsl(var(--info))] underline"
                    >
                      Constructor de Formularios
                    </Link>
                  </li>
                  <li>
                    <strong>2.</strong> Cree "Formulario de Visitantes" con
                    campos: Nombre, Email, Teléfono
                  </li>
                  <li>
                    <strong>3.</strong> Genere código QR automáticamente
                  </li>
                  <li>
                    <strong>4.</strong> Publique y copie el enlace del
                    formulario
                  </li>
                </ol>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[hsl(var(--success)/0.3)]">
                <h4 className="font-semibold mb-2 text-foreground">
                  ⚡ PASO 2: Activar Primera Automatización
                </h4>
                <ol className="text-sm text-[hsl(var(--success))] space-y-1">
                  <li>
                    <strong>1.</strong> Vaya a{" "}
                    <Link
                      href="/automation-rules/templates"
                      className="text-[hsl(var(--info))] underline"
                    >
                      Plantillas de Automatización
                    </Link>
                  </li>
                  <li>
                    <strong>2.</strong> Busque "Visitor: First-Time Welcome"
                  </li>
                  <li>
                    <strong>3.</strong> Haga clic en "Ver Detalles" → "Activar
                    Plantilla"
                  </li>
                  <li>
                    <strong>4.</strong> Personalice mensajes (opcional) →
                    "Activar"
                  </li>
                </ol>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[hsl(var(--success)/0.3)]">
                <h4 className="font-semibold mb-2 text-foreground">
                  🧪 PASO 3: Probar el Sistema
                </h4>
                <ol className="text-sm text-[hsl(var(--success))] space-y-1">
                  <li>
                    <strong>1.</strong> Abra el enlace de su formulario de
                    visitantes
                  </li>
                  <li>
                    <strong>2.</strong> Complete el formulario con sus datos de
                    prueba
                  </li>
                  <li>
                    <strong>3.</strong> Envíe → Verifique que recibe SMS/Email
                    de bienvenida
                  </li>
                  <li>
                    <strong>4.</strong> Revise el{" "}
                    <Link
                      href="/form-submissions"
                      className="text-[hsl(var(--info))] underline"
                    >
                      Dashboard de Envíos
                    </Link>{" "}
                    para ver el registro
                  </li>
                </ol>
              </div>
            </div>
            <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg border border-[hsl(var(--info)/0.3)] mt-4">
              <h4 className="font-semibold mb-2 text-foreground">
                🎉 ¡Felicitaciones!
              </h4>
              <p className="text-sm text-[hsl(var(--info))]">
                Su sistema de automatización ahora está funcionando. Cada nuevo
                visitante recibirá una respuesta automática y será registrado en
                su CRM para seguimiento pastoral.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start Guide */}
        <Card className="border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.10)]">
          <CardHeader>
            <CardTitle className="text-foreground">
              🚀 Guía de Inicio Rápido (5 Minutos)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-white p-4 rounded-lg border border-[hsl(var(--success)/0.3)]">
                <h4 className="font-semibold mb-2 text-foreground">
                  🛠️ PASO 1: Crear Primer Formulario
                </h4>
                <ol className="text-sm text-[hsl(var(--success))] space-y-1">
                  <li>
                    <strong>1.</strong> Vaya a{" "}
                    <Link
                      href="/form-builder"
                      className="text-[hsl(var(--info))] underline"
                    >
                      Constructor de Formularios
                    </Link>
                  </li>
                  <li>
                    <strong>2.</strong> Cree "Formulario de Visitantes" con
                    campos: Nombre, Email, Teléfono
                  </li>
                  <li>
                    <strong>3.</strong> Genere código QR automáticamente
                  </li>
                  <li>
                    <strong>4.</strong> Publique y copie el enlace del
                    formulario
                  </li>
                </ol>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[hsl(var(--success)/0.3)]">
                <h4 className="font-semibold mb-2 text-foreground">
                  ⚡ PASO 2: Activar Primera Automatización
                </h4>
                <ol className="text-sm text-[hsl(var(--success))] space-y-1">
                  <li>
                    <strong>1.</strong> Vaya a{" "}
                    <Link
                      href="/automation-rules/templates"
                      className="text-[hsl(var(--info))] underline"
                    >
                      Plantillas de Automatización
                    </Link>
                  </li>
                  <li>
                    <strong>2.</strong> Busque "Visitor: First-Time Welcome"
                  </li>
                  <li>
                    <strong>3.</strong> Haga clic en "Ver Detalles" → "Activar
                    Plantilla"
                  </li>
                  <li>
                    <strong>4.</strong> Personalice mensajes (opcional) →
                    "Activar"
                  </li>
                </ol>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[hsl(var(--success)/0.3)]">
                <h4 className="font-semibold mb-2 text-foreground">
                  🧪 PASO 3: Probar el Sistema
                </h4>
                <ol className="text-sm text-[hsl(var(--success))] space-y-1">
                  <li>
                    <strong>1.</strong> Abra el enlace de su formulario de
                    visitantes
                  </li>
                  <li>
                    <strong>2.</strong> Complete el formulario con sus datos de
                    prueba
                  </li>
                  <li>
                    <strong>3.</strong> Envíe → Verifique que recibe SMS/Email
                    de bienvenida
                  </li>
                  <li>
                    <strong>4.</strong> Revise el{" "}
                    <Link
                      href="/form-submissions"
                      className="text-[hsl(var(--info))] underline"
                    >
                      Dashboard de Envíos
                    </Link>{" "}
                    para ver el registro
                  </li>
                </ol>
              </div>
            </div>
            <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg border border-[hsl(var(--info)/0.3)] mt-4">
              <h4 className="font-semibold mb-2 text-foreground">
                🎉 ¡Felicitaciones!
              </h4>
              <p className="text-sm text-[hsl(var(--info))]">
                Su sistema de automatización ahora está funcionando. Cada nuevo
                visitante recibirá una respuesta automática y será registrado en
                su CRM para seguimiento pastoral.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Template Browser */}
        <Card>
          <CardHeader>
            <CardTitle>📚 Explorador de Plantillas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              El sistema incluye 8+ plantillas prediseñadas listas para activar
              con un solo clic:
            </p>

            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🙏</span>
                  <h4 className="font-semibold">Peticiones de Oración</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                  <li>• Notificación inmediata al equipo de oración</li>
                  <li>• Confirmación automática al solicitante</li>
                  <li>• Oración por mensaje de texto/WhatsApp</li>
                  <li>• Llamada de oración para casos urgentes</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👋</span>
                  <h4 className="font-semibold">Seguimiento de Visitantes</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                  <li>• Bienvenida para visitantes por primera vez</li>
                  <li>• Engagement para visitantes recurrentes</li>
                  <li>• Invitación a membresía (4+ visitas)</li>
                  <li>• Seguimiento urgente 24/7</li>
                </ul>
              </div>
            </div>

            <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg border border-[hsl(var(--info)/0.3)]">
              <h4 className="font-semibold mb-2 text-foreground">
                💡 Cómo Activar una Plantilla
              </h4>
              <ol className="text-sm text-[hsl(var(--info))] space-y-2">
                <li>
                  <strong>1.</strong> Vaya a{" "}
                  <strong>Automatización → Plantillas</strong>
                </li>
                <li>
                  <strong>2.</strong> Navegue por categorías: Peticiones de
                  Oración, Visitantes, Redes Sociales, Eventos
                </li>
                <li>
                  <strong>3.</strong> Haga clic en{" "}
                  <strong>&quot;Ver Detalles&quot;</strong> para ver el flujo
                  completo
                </li>
                <li>
                  <strong>4.</strong> Personalice el nombre, prioridad, horarios
                  y canales
                </li>
                <li>
                  <strong>5.</strong> Haga clic en{" "}
                  <strong>&quot;Activar Plantilla&quot;</strong>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Section Urgency Routing */}
        <Card className="border-[hsl(var(--lavender)/0.3)] bg-[hsl(var(--lavender)/0.10)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-[hsl(var(--lavender))]" />
              Sistema de Urgencia por Sección (A / B / C)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[hsl(var(--lavender))]">
              Cuando configura categorías de oración con una{" "}
              <strong>sección (A, B o C)</strong>, el sistema deriva
              automáticamente la prioridad y el tiempo de respuesta SLA sin que
              el solicitante tenga que elegirlo.
            </p>

            <div className="space-y-3">
              {/* Section A */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[hsl(var(--success)/0.3)]">
                <div className="bg-[hsl(var(--success)/0.15)] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-[hsl(var(--success))]">A</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">
                      Sección A — Oración Estándar
                    </h4>
                    <span className="bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] text-xs px-2 py-0.5 rounded-full font-medium">
                      Prioridad NORMAL
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Peticiones de oración generales. El equipo de oración recibe
                    notificación dentro de <strong>1 hora</strong>.
                  </p>
                  <div className="bg-[hsl(var(--success)/0.10)] rounded p-2 text-xs text-[hsl(var(--success))]">
                    <strong>Acciones automáticas:</strong> Email al equipo de
                    oración + respuesta de confirmación al solicitante
                  </div>
                </div>
              </div>

              {/* Section B */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[hsl(var(--warning)/0.3)]">
                <div className="bg-[hsl(var(--warning)/0.15)] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-[hsl(var(--warning))]">B</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[hsl(var(--warning))]">
                      Sección B — Oración Media
                    </h4>
                    <span className="bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] text-xs px-2 py-0.5 rounded-full font-medium">
                      Prioridad ALTA
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Peticiones que necesitan atención. El pastor o líder recibe
                    respuesta dentro de <strong>4 horas</strong>.
                  </p>
                  <div className="bg-[hsl(var(--warning)/0.10)] rounded p-2 text-xs text-[hsl(var(--warning))]">
                    <strong>Acciones automáticas:</strong> Email al equipo +
                    mensaje WhatsApp al pastor
                  </div>
                </div>
              </div>

              {/* Section C */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[hsl(var(--destructive)/0.3)]">
                <div className="bg-[hsl(var(--destructive)/0.15)] rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-[hsl(var(--destructive))]">C</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[hsl(var(--destructive))]">
                      Sección C — Urgencia Inmediata
                    </h4>
                    <span className="bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))] text-xs px-2 py-0.5 rounded-full font-medium">
                      Prioridad URGENTE – 24/7
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Crisis, enfermedad grave, peligro. Respuesta{" "}
                    <strong>en 10 minutos</strong>, ignora horario laboral.
                  </p>
                  <div className="bg-[hsl(var(--destructive)/0.10)] rounded p-2 text-xs text-[hsl(var(--destructive))]">
                    <strong>Acciones automáticas:</strong> Email URGENTE +
                    WhatsApp inmediato al pastor (modo 24/7 activo)
                  </div>
                </div>
              </div>
            </div>

            {/* Setup steps */}
            <div className="bg-white rounded-lg border border-[hsl(var(--lavender)/0.3)] p-4 mt-4">
              <h4 className="font-semibold text-foreground mb-3">
                <Settings className="h-4 w-4 inline mr-1 text-[hsl(var(--lavender))]" />
                Cómo Activar el Sistema de Secciones
              </h4>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li>
                  <strong>1. Instalar las 3 reglas base:</strong> Vaya a{" "}
                  <Link
                    href="/automation-rules/templates"
                    className="text-[hsl(var(--info))] underline"
                  >
                    Plantillas
                  </Link>
                  , haga clic en{" "}
                  <strong>
                    &quot;Instalar Reglas de Urgencia de Oración&quot;
                  </strong>{" "}
                  (botón azul). Esto crea automáticamente las 3 reglas para A, B
                  y C.
                </li>
                <li>
                  <strong>2. Asignar secciones a categorías:</strong> En{" "}
                  <Link
                    href="/prayer-requests"
                    className="text-[hsl(var(--info))] underline"
                  >
                    Peticiones de Oración
                  </Link>{" "}
                  → Configuración de Categorías, asigne{" "}
                  <code className="bg-muted/50 px-1 rounded">A</code>,{" "}
                  <code className="bg-muted/50 px-1 rounded">B</code> o{" "}
                  <code className="bg-muted/50 px-1 rounded">C</code> a cada
                  categoría.
                </li>
                <li>
                  <strong>3. Configurar destinatarios WhatsApp:</strong> En cada
                  regla creada (Sección B y C), edite la acción SEND_WHATSAPP y
                  coloque el número del pastor en el campo{" "}
                  <em>recipientPhone</em>.
                </li>
                <li>
                  <strong>4. Probar:</strong> Envíe una petición de prueba con
                  una categoría Sección C — debe llegar un WhatsApp en menos de
                  1 minuto.
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Custom Template Creation */}
        <Card className="border-primary/20 bg-primary/[0.06]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Plus className="h-5 w-5 text-primary" />
              Crear Plantilla Personalizada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-primary">
              Además de las plantillas del sistema,{" "}
              <strong>pastores y administradores</strong> pueden crear sus
              propias plantillas para reutilizar flujos de trabajo específicos
              de su iglesia.
            </p>

            <div className="bg-white rounded-lg border border-primary/20 p-4">
              <h4 className="font-semibold text-foreground mb-3">
                Pasos para crear una plantilla
              </h4>
              <ol className="text-sm text-muted-foreground space-y-3">
                <li className="flex gap-2">
                  <span className="bg-primary/[0.06]0 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Vaya a{" "}
                    <Link
                      href="/automation-rules/templates"
                      className="text-[hsl(var(--info))] underline"
                    >
                      Plantillas de Automatización
                    </Link>{" "}
                    y haga clic en el botón{" "}
                    <strong>&ldquo;Crear Plantilla Personalizada&rdquo;</strong>{" "}
                    (esquina superior derecha).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-primary/[0.06]0 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Ingrese un <strong>nombre descriptivo</strong> (ej:
                    &ldquo;Confirmación Evento Jóvenes&rdquo;) y una{" "}
                    <strong>descripción</strong>.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-primary/[0.06]0 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Seleccione la <strong>Categoría</strong> (Petición de
                    Oración, Visitantes, Redes Sociales, Eventos, General).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-primary/[0.06]0 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span>
                    Elija el <strong>Tipo de Disparador</strong> — el evento que
                    activará la automatización. Ej:{" "}
                    <code className="bg-muted/50 px-1 rounded">
                      PRAYER_REQUEST_SUBMITTED
                    </code>{" "}
                    o{" "}
                    <code className="bg-muted/50 px-1 rounded">
                      VISITOR_FIRST_TIME
                    </code>
                    .
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-primary/[0.06]0 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    5
                  </span>
                  <span>
                    Seleccione la <strong>Acción</strong> (Email, SMS, WhatsApp,
                    Notificación push, etc.) y escriba el
                    <strong> mensaje</strong>. Use variables como{" "}
                    <code className="bg-muted/50 px-1 rounded">{`{{contactName}}`}</code>{" "}
                    para personalización.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-primary/[0.06]0 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    6
                  </span>
                  <span>
                    Haga clic en <strong>&ldquo;Crear Plantilla&rdquo;</strong>.
                    La plantilla aparecerá al inicio de la lista para activarla.
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-primary/[0.12] rounded p-3 text-sm text-primary">
              <strong>Nota:</strong> Las plantillas personalizadas son visibles
              solo para su iglesia. Las plantillas del sistema son globales y no
              pueden modificarse.
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Setup */}
        <Card className="border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.10)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageSquare className="h-5 w-5 text-[hsl(var(--success))]" />
              Configurar WhatsApp Business
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[hsl(var(--success))]">
              Para enviar mensajes de WhatsApp desde las automatizaciones
              necesita una cuenta de
              <strong> WhatsApp Business API</strong>. Es el mismo número que
              usa para contactar miembros.
            </p>

            <div className="bg-white rounded-lg border border-[hsl(var(--success)/0.3)] p-4">
              <h4 className="font-semibold text-foreground mb-3">Requisitos</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>WHATSAPP_ACCESS_TOKEN</strong> — Token de Meta
                    Business. Configúrelo en
                    <Link
                      href="/settings/integrations"
                      className="text-[hsl(var(--info))] underline ml-1"
                    >
                      Configuración → Integraciones
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>WHATSAPP_PHONE_NUMBER_ID</strong> — ID del número en
                    Meta Business Suite.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                  <span>
                    El número destinatario debe tener WhatsApp activo y haber
                    aceptado recibir mensajes.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[hsl(var(--warning)/0.10)] rounded p-3 text-sm text-[hsl(var(--warning))] border border-[hsl(var(--warning)/0.3)]">
              <AlertTriangle className="h-4 w-4 inline mr-1 text-[hsl(var(--warning))]" />
              <strong>Sin WhatsApp configurado:</strong> Las acciones
              SEND_WHATSAPP se omiten automáticamente y el sistema usa Email
              como canal de respaldo.
            </div>
          </CardContent>
        </Card>

        {/* Template Variables Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[hsl(var(--warning))]" />
              Variables de Plantilla
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use estas variables en los mensajes de sus automatizaciones. Se
              reemplazan automáticamente con los datos reales cuando se ejecuta
              la acción.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 border border-border font-semibold">
                      Variable
                    </th>
                    <th className="text-left p-2 border border-border font-semibold">
                      Descripción
                    </th>
                    <th className="text-left p-2 border border-border font-semibold">
                      Ejemplo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-2 border border-border">
                      <code className="bg-muted/50 px-1 rounded">{`{{contactName}}`}</code>
                    </td>
                    <td className="p-2 border border-border">
                      Nombre del contacto o solicitante
                    </td>
                    <td className="p-2 border border-border text-muted-foreground">
                      María González
                    </td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="p-2 border border-border">
                      <code className="bg-muted/50 px-1 rounded">{`{{prayerCategory}}`}</code>
                    </td>
                    <td className="p-2 border border-border">
                      Categoría de la petición de oración
                    </td>
                    <td className="p-2 border border-border text-muted-foreground">
                      Salud y Sanidad
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-border">
                      <code className="bg-muted/50 px-1 rounded">{`{{prayerPriority}}`}</code>
                    </td>
                    <td className="p-2 border border-border">
                      Prioridad derivada (normal/high/urgent)
                    </td>
                    <td className="p-2 border border-border text-muted-foreground">
                      urgent
                    </td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="p-2 border border-border">
                      <code className="bg-muted/50 px-1 rounded">{`{{prayerSection}}`}</code>
                    </td>
                    <td className="p-2 border border-border">
                      Sección de urgencia de la categoría
                    </td>
                    <td className="p-2 border border-border text-muted-foreground">
                      C
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-border">
                      <code className="bg-muted/50 px-1 rounded">{`{{responseTimeMinutes}}`}</code>
                    </td>
                    <td className="p-2 border border-border">
                      SLA de respuesta en minutos
                    </td>
                    <td className="p-2 border border-border text-muted-foreground">
                      10
                    </td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="p-2 border border-border">
                      <code className="bg-muted/50 px-1 rounded">{`{{visitReason}}`}</code>
                    </td>
                    <td className="p-2 border border-border">
                      Motivo de visita del nuevo contacto
                    </td>
                    <td className="p-2 border border-border text-muted-foreground">
                      Primera visita
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-border">
                      <code className="bg-muted/50 px-1 rounded">{`{{contactPhone}}`}</code>
                    </td>
                    <td className="p-2 border border-border">
                      Teléfono del contacto
                    </td>
                    <td className="p-2 border border-border text-muted-foreground">
                      +1 555 000 1234
                    </td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="p-2 border border-border">
                      <code className="bg-muted/50 px-1 rounded">{`{{contactEmail}}`}</code>
                    </td>
                    <td className="p-2 border border-border">
                      Email del contacto
                    </td>
                    <td className="p-2 border border-border text-muted-foreground">
                      maria@example.com
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[hsl(var(--info)/0.10)] p-3 rounded text-sm text-[hsl(var(--info))] border border-[hsl(var(--info)/0.3)]">
              <strong>Ejemplo de mensaje con variables:</strong>
              <br />
              <code className="block mt-1 bg-white rounded p-2 text-xs">{`Hola {{contactName}}, recibimos tu petición de oración (Sección {{prayerSection}}). Nuestro equipo responderá en {{responseTimeMinutes}} minutos. ¡Dios te bendiga!`}</code>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Características Clave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-5 w-5 text-[hsl(var(--success))]" />
                  <h4 className="font-semibold">Reintentos Inteligentes</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  3 reintentos automáticos con espera exponencial (1s, 2s, 4s).
                  Nunca pierde un mensaje.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
                  <h4 className="font-semibold">Canales de Respaldo</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Si un canal falla, usa el siguiente: SMS → Email → WhatsApp →
                  Push → Llamada.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-[hsl(var(--info))]" />
                  <h4 className="font-semibold">Horario Laboral</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure para ejecutar solo durante horas de oficina. Los
                  casos urgentes pueden ejecutarse 24/7.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--lavender))]" />
                  <h4 className="font-semibold">Bypass Approval</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Omita la aprobación manual para respuestas instantáneas.
                  Perfecto para bienvenidas y confirmaciones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Levels */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Niveles de Prioridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[hsl(var(--destructive)/0.10)] border border-[hsl(var(--destructive)/0.3)] rounded-lg">
              <span className="text-2xl">🔴</span>
              <div className="flex-1">
                <h4 className="font-semibold text-[hsl(var(--destructive))]">URGENTE</h4>
                <p className="text-sm text-[hsl(var(--destructive))]">
                  Ejecuta inmediatamente, ignora horario laboral. Escalamiento a
                  supervisor en 15 minutos si no hay respuesta.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[hsl(var(--warning)/0.10)] border border-[hsl(var(--warning)/0.3)] rounded-lg">
              <span className="text-2xl">🟠</span>
              <div className="flex-1">
                <h4 className="font-semibold text-[hsl(var(--warning))]">ALTA</h4>
                <p className="text-sm text-[hsl(var(--warning))]">
                  Prioridad alta, ejecuta dentro de 1 hora. Escalamiento en 2
                  horas sin respuesta.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[hsl(var(--success)/0.10)] border border-[hsl(var(--success)/0.3)] rounded-lg">
              <span className="text-2xl">🟢</span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">NORMAL</h4>
                <p className="text-sm text-[hsl(var(--success))]">
                  Prioridad estándar. Respeta horario laboral. Escalamiento en
                  24 horas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-lg">
              <span className="text-2xl">⚪</span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">BAJA</h4>
                <p className="text-sm text-muted-foreground">
                  Ejecuta cuando hay disponibilidad. Sin escalamiento
                  automático.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Solución de Problemas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">
                  ❓ La automatización no se ejecuta
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>
                    • Verifique que la regla esté <strong>Activa</strong>
                  </li>
                  <li>• Revise las condiciones: ¿coinciden con el evento?</li>
                  <li>• Si tiene horario laboral, ¿está dentro del horario?</li>
                  <li>
                    • ¿El disparador es correcto? (PRAYER_REQUEST_SUBMITTED,
                    VISITOR_FIRST_TIME, etc.)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  ❓ Los mensajes no llegan
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>
                    • Revise la configuración de Twilio (SMS/WhatsApp) en
                    Configuración
                  </li>
                  <li>• Verifique la configuración de Mailgun (Email)</li>
                  <li>
                    • El sistema intentará canales de respaldo automáticamente
                  </li>
                  <li>
                    • Revise el historial de ejecución en el dashboard de
                    automatización
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  ❓ Quiero desactivar una regla temporalmente
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>
                    • Vaya a <strong>Automatización → Mis Reglas</strong>
                  </li>
                  <li>
                    • Haga clic en el toggle <strong>&quot;Activo&quot;</strong>{" "}
                    para desactivar
                  </li>
                  <li>• La regla permanece configurada pero no se ejecutará</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="border-[hsl(var(--success)/0.3)]">
          <CardHeader>
            <CardTitle className="text-foreground">
              ✅ Mejores Prácticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
              <p className="text-sm">
                <strong>Use bypass approval para bienvenidas:</strong> Los
                mensajes de bienvenida pueden enviarse inmediatamente sin
                aprobación.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
              <p className="text-sm">
                <strong>Active modo urgente 24/7:</strong> Para peticiones de
                oración marcadas como urgentes, ignora el horario laboral.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
              <p className="text-sm">
                <strong>Configure canales de respaldo:</strong> Siempre tenga al
                menos 2 canales configurados (ej: SMS y Email).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
              <p className="text-sm">
                <strong>Personalice los mensajes:</strong> Use variables como
                &#123;nombre&#125;, &#123;iglesia&#125;, &#123;mensaje&#125;
                para personalizar.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
              <p className="text-sm">
                <strong>Monitoree el dashboard:</strong> Revise regularmente el
                historial de ejecución para detectar problemas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.10)]">
          <CardHeader>
            <CardTitle className="text-foreground">
              🚀 Siguientes Pasos Recomendados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">📝 Ampliar Formularios</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>Peticiones de Oración:</strong> Cree formulario
                    para peticiones urgentes y programadas
                  </li>
                  <li>
                    • <strong>Voluntarios:</strong> Formulario de registro con
                    habilidades y disponibilidad
                  </li>
                  <li>
                    • <strong>Eventos:</strong> Formularios de inscripción para
                    eventos especiales
                  </li>
                  <li>
                    • <strong>Testimonios:</strong> Recopile testimonios de
                    miembros para compartir
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">
                  ⚡ Activar Más Automatizaciones
                </h4>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>"Prayer Request: Church Notification":</strong>{" "}
                    Notifica pastores de peticiones urgentes
                  </li>
                  <li>
                    • <strong>"Prayer Request: Auto-Acknowledgment":</strong>{" "}
                    Confirma recepción de peticiones
                  </li>
                  <li>
                    • <strong>"Visitor: Returning Engagement":</strong>{" "}
                    Seguimiento de visitantes recurrentes
                  </li>
                  <li>
                    • <strong>"Prayer Request: 24/7 Urgent":</strong> Sistema de
                    alertas 24 horas
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">
                  📊 Monitoreo y Optimización
                </h4>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>Dashboard de Envíos:</strong> Revise{" "}
                    <Link
                      href="/form-submissions"
                      className="text-[hsl(var(--info))] underline"
                    >
                      todos los formularios enviados
                    </Link>
                  </li>
                  <li>
                    • <strong>Estadísticas de QR:</strong> Vea qué códigos son
                    más utilizados
                  </li>
                  <li>
                    • <strong>Tasas de Automatización:</strong> Monitoree éxito
                    de envíos automáticos
                  </li>
                  <li>
                    • <strong>Seguimiento de Conversión:</strong> Visitantes que
                    se vuelven miembros
                  </li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">🌐 Distribución de QR</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    • <strong>Bancos de Iglesia:</strong> Imprima QR de
                    visitantes en tarjetas pequeñas
                  </li>
                  <li>
                    • <strong>Boletines:</strong> Incluya QR para peticiones de
                    oración
                  </li>
                  <li>
                    • <strong>Redes Sociales:</strong> Comparta QR en
                    Facebook/Instagram/WhatsApp
                  </li>
                  <li>
                    • <strong>Eventos:</strong> QR específicos para
                    inscripciones de eventos
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg border border-[hsl(var(--success)/0.3)] mt-4">
              <h4 className="font-semibold mb-2 text-foreground">
                🏆 Meta de Implementación Completa
              </h4>
              <p className="text-sm text-[hsl(var(--success))]">
                <strong>Objetivo:</strong> Que el 100% de las interacciones de
                su iglesia (visitantes, peticiones, voluntarios, eventos) sean
                capturadas automáticamente y reciban seguimiento personalizado
                sin intervención manual.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Tips */}
        <Card>
          <CardHeader>
            <CardTitle>🧠 Consejos Avanzados de Automatización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">
                  🔗 Integración con Sistemas Existentes
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • <strong>CRM Automático:</strong> Todos los formularios
                    crean registros CRM automáticamente
                  </li>
                  <li>
                    • <strong>Check-ins Inteligentes:</strong> Visitantes se
                    registran automáticamente para seguimiento
                  </li>
                  <li>
                    • <strong>Sistema de Miembros:</strong> Integración completa
                    con perfiles de miembros
                  </li>
                  <li>
                    • <strong>Calendario de Eventos:</strong> Formularios de
                    eventos crean entradas de calendario
                  </li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">
                  📋 Personalización de Plantillas
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • <strong>Mensajes Dinámicos:</strong> Use variables como
                    &#123;nombre&#125;, &#123;iglesia&#125;, &#123;fecha&#125;
                  </li>
                  <li>
                    • <strong>Horarios Personalizados:</strong> Configure
                    horarios de envío por tipo de mensaje
                  </li>
                  <li>
                    • <strong>Canales Preferenciales:</strong> SMS para urgente,
                    Email para información detallada
                  </li>
                  <li>
                    • <strong>Escalación Inteligente:</strong> Si SMS falla,
                    intenta WhatsApp, luego Email
                  </li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">📈 Métricas de Éxito</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • <strong>Tasa de Respuesta:</strong> % de visitantes que
                    responden a automatizaciones
                  </li>
                  <li>
                    • <strong>Tasa de Conversión:</strong> % de visitantes que
                    se vuelven miembros regulares
                  </li>
                  <li>
                    • <strong>Tiempo de Respuesta:</strong> Rapidez promedio de
                    respuestas automáticas
                  </li>
                  <li>
                    • <strong>Engagement Score:</strong> Nivel de compromiso
                    basado en interacciones
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Solución de Problemas Comunes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-[hsl(var(--warning)/0.10)]">
                <h4 className="font-semibold mb-2">
                  ⚠️ Problema: No se envían mensajes automáticos
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Solución:</strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>
                      1. Verifique que la plantilla está{" "}
                      <strong>"Activa"</strong> en el dashboard
                    </li>
                    <li>
                      2. Revise que los campos del formulario coinciden con los
                      esperados
                    </li>
                    <li>
                      3. Confirme que las credenciales de SMS/Email están
                      configuradas
                    </li>
                    <li>
                      4. Vaya a{" "}
                      <Link
                        href="/settings/integrations"
                        className="text-[hsl(var(--info))] underline"
                      >
                        Configuración de Integraciones
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-[hsl(var(--info)/0.10)]">
                <h4 className="font-semibold mb-2">
                  📱 Problema: Código QR no funciona
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Solución:</strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>
                      1. Verifique que el formulario está{" "}
                      <strong>"Público"</strong> y <strong>"Activo"</strong>
                    </li>
                    <li>2. Pruebe el enlace directo del formulario primero</li>
                    <li>3. Regenere el código QR si es necesario</li>
                    <li>
                      4. Use cámara del teléfono o app QR reader para probar
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-[hsl(var(--success)/0.10)]">
                <h4 className="font-semibold mb-2">
                  📋 Problema: Datos no aparecen en dashboard
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Solución:</strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>
                      1. Refresque la página del{" "}
                      <Link
                        href="/form-submissions"
                        className="text-[hsl(var(--info))] underline"
                      >
                        Dashboard de Envíos
                      </Link>
                    </li>
                    <li>2. Verifique filtros de fecha y tipo de formulario</li>
                    <li>
                      3. Confirme que el envío fue exitoso (mensaje de
                      confirmación)
                    </li>
                    <li>
                      4. Revise la consola del navegador para errores JavaScript
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-2">📞 Soporte Técnico</h4>
              <p className="text-sm text-muted-foreground">
                Para problemas técnicos avanzados, contacte al equipo de soporte
                en
                <Link
                  href="/help/support/ticket"
                  className="text-[hsl(var(--info))] underline"
                >
                  Crear Ticket de Soporte
                </Link>
                con detalles específicos del problema.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── TEST GUIDE ─────────────────────────────────────── */}
        <Card className="border-primary/20 bg-primary/[0.06]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Guía de Pruebas — Verificar que las Automatizaciones Funcionan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-primary">
              Use esta guía para confirmar que cada automatización está
              funcionando correctamente en producción. Siga los pasos en orden y
              verifique el resultado esperado.
            </p>

            {/* Test 1 */}
            <div className="bg-white rounded-lg border border-primary/20 p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                Prueba: Petición de Oración Sección A (Normal / 1 hora)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary whitespace-nowrap">Pasos:</span>
                  <ol className="space-y-1 text-muted-foreground list-decimal ml-4">
                    <li>Vaya a <strong>Peticiones de Oración</strong> → formulario público o link directo</li>
                    <li>Seleccione una categoría asignada a <strong>Sección A</strong></li>
                    <li>Complete nombre, teléfono (o email) y mensaje</li>
                    <li>Envíe el formulario</li>
                  </ol>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="font-bold text-[hsl(var(--success))] whitespace-nowrap">Resultado esperado:</span>
                  <ul className="space-y-1 text-muted-foreground ml-2">
                    <li>✅ Email de confirmación enviado al solicitante (si tiene email)</li>
                    <li>✅ Registro de petición creado en Dashboard de Oración</li>
                    <li>✅ Tarea de respuesta creada (responder en 1 hora)</li>
                    <li>✅ En <strong>Mis Reglas</strong> → contador de ejecuciones aumenta en 1</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Test 2 */}
            <div className="bg-white rounded-lg border border-primary/20 p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="bg-[hsl(var(--warning)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                Prueba: Petición de Oración Sección B (Alta / 4 horas)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary whitespace-nowrap">Pasos:</span>
                  <ol className="space-y-1 text-muted-foreground list-decimal ml-4">
                    <li>Repita el formulario de oración eligiendo una categoría de <strong>Sección B</strong></li>
                    <li>Incluya un número de teléfono válido en el campo de teléfono</li>
                    <li>Envíe el formulario</li>
                  </ol>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="font-bold text-[hsl(var(--success))] whitespace-nowrap">Resultado esperado:</span>
                  <ul className="space-y-1 text-muted-foreground ml-2">
                    <li>✅ Email de confirmación enviado</li>
                    <li>✅ <strong>WhatsApp enviado al pastor</strong> con información de la petición</li>
                    <li>✅ Prioridad mostrada como <strong>ALTA</strong> en el dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Test 3 */}
            <div className="bg-white rounded-lg border border-[hsl(var(--destructive)/0.3)] p-4">
              <h4 className="font-semibold text-[hsl(var(--destructive))] mb-3 flex items-center gap-2">
                <span className="bg-[hsl(var(--destructive))] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                Prueba: Petición de Oración Sección C (Urgente / 10 minutos)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--destructive))] whitespace-nowrap">Pasos:</span>
                  <ol className="space-y-1 text-muted-foreground list-decimal ml-4">
                    <li>Seleccione una categoría de <strong>Sección C</strong> (Crisis/Emergencia)</li>
                    <li>Incluya teléfono y email</li>
                    <li>Envíe y monitore los próximos 10 minutos</li>
                  </ol>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="font-bold text-[hsl(var(--success))] whitespace-nowrap">Resultado esperado:</span>
                  <ul className="space-y-1 text-muted-foreground ml-2">
                    <li>✅ WhatsApp urgente enviado al pastor <strong>en menos de 10 minutos</strong></li>
                    <li>✅ Modo 24/7 activo — llega aunque sea fuera de horario</li>
                    <li>✅ Prioridad mostrada como <strong>URGENTE</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Test 4 */}
            <div className="bg-white rounded-lg border border-primary/20 p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="bg-[hsl(var(--info))] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                Prueba: Pausar y Reactivar una Regla
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary whitespace-nowrap">Pasos:</span>
                  <ol className="space-y-1 text-muted-foreground list-decimal ml-4">
                    <li>Vaya a <strong>Reglas de Automatización → Mis Reglas</strong></li>
                    <li>Haga clic en <strong>Pausar</strong> en cualquier regla activa</li>
                    <li>Verifique que el estado cambia a <em>Inactiva</em></li>
                    <li>Envíe una petición de oración — la regla <strong>no debe ejecutarse</strong></li>
                    <li>Regrese y haga clic en <strong>Activar</strong></li>
                    <li>Verifique que la regla vuelve a <em>Activa</em></li>
                  </ol>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="font-bold text-[hsl(var(--success))] whitespace-nowrap">Resultado esperado:</span>
                  <ul className="space-y-1 text-muted-foreground ml-2">
                    <li>✅ Badge cambia entre <strong>Activa</strong> e <strong>Inactiva</strong> sin error</li>
                    <li>✅ La regla pausada NO dispara automatizaciones</li>
                    <li>✅ La regla reactivada SÍ dispara automatizaciones</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Test 5 */}
            <div className="bg-white rounded-lg border border-primary/20 p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="bg-[hsl(var(--lavender))] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                Prueba: Editar una Regla Existente
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary whitespace-nowrap">Pasos:</span>
                  <ol className="space-y-1 text-muted-foreground list-decimal ml-4">
                    <li>Haga clic en <strong>Editar</strong> en cualquier regla</li>
                    <li>Cambie el nombre de la regla</li>
                    <li>Haga clic en <strong>Guardar</strong></li>
                  </ol>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="font-bold text-[hsl(var(--success))] whitespace-nowrap">Resultado esperado:</span>
                  <ul className="space-y-1 text-muted-foreground ml-2">
                    <li>✅ El nombre actualizado aparece en la lista inmediatamente</li>
                    <li>✅ No aparece mensaje de error rojo</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Test 6 */}
            <div className="bg-white rounded-lg border border-primary/20 p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="bg-[hsl(var(--success))] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</span>
                Prueba: Personalizar Icono y Color de Plantilla
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary whitespace-nowrap">Pasos:</span>
                  <ol className="space-y-1 text-muted-foreground list-decimal ml-4">
                    <li>Vaya a la pestaña <strong>Plantillas</strong></li>
                    <li>Haga clic en el icono de lápiz (<Pencil className="inline h-3 w-3" />) en cualquier plantilla</li>
                    <li>Cambie el <strong>Icono</strong> usando el selector desplegable</li>
                    <li>Cambie el <strong>Color de Fondo</strong> usando el selector de color</li>
                    <li>Puede también cambiar <strong>Nombre</strong>, <strong>Descripción</strong>, <strong>Disparador</strong></li>
                    <li>Haga clic en <strong>Guardar Cambios</strong></li>
                  </ol>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="font-bold text-[hsl(var(--success))] whitespace-nowrap">Resultado esperado:</span>
                  <ul className="space-y-1 text-muted-foreground ml-2">
                    <li>✅ La tarjeta muestra el nuevo icono seleccionado</li>
                    <li>✅ El fondo de la tarjeta refleja el nuevo color</li>
                    <li>✅ El nombre/descripción actualizados son visibles</li>
                    <li>✅ No aparece error rojo</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Checklist summary */}
            <div className="bg-primary/[0.12] rounded-lg p-4 border border-primary/30">
              <h4 className="font-semibold text-foreground mb-3">Lista de Verificación Rápida</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-primary">
                {[
                  "Sección A → Email confirmación ✓",
                  "Sección B → Email + WhatsApp pastor ✓",
                  "Sección C → WhatsApp urgente ≤ 10 min ✓",
                  "Pausar regla → sin ejecuciones ✓",
                  "Reactivar regla → ejecuciones reinician ✓",
                  "Editar nombre → sin error 500 ✓",
                  "Cambiar icono → visible en tarjeta ✓",
                  "Cambiar color → visible en tarjeta ✓",
                  "Editar disparador → guardado correctamente ✓",
                  "Agregar/eliminar acciones → guardado ✓",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
