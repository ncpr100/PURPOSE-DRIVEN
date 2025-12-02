'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Zap, CheckCircle2, Clock, RefreshCw, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

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
          <h1 className="text-3xl font-bold">Manual: Reglas de Automatización</h1>
          <p className="text-muted-foreground">Guía completa del sistema de automatización inteligente</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Overview */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              🎉 NUEVO: Ecosistema de Automatización Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              <strong>Sistema Completo Integrado:</strong> Formularios + Códigos QR + Plantillas de Automatización = 
              Seguimiento automático 24/7 de visitantes, peticiones de oración, voluntarios y eventos.
            </p>
            <div className="p-4 bg-white rounded-lg border border-blue-200 my-4">
              <h4 className="font-semibold text-blue-900 mb-2">🔄 Flujo de Trabajo Completo:</h4>
              <div className="text-sm space-y-1 text-blue-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold">1. FORMULARIOS:</span>
                  <span>Crear formularios personalizados para cualquier propósito</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">2. CÓDIGOS QR:</span>
                  <span>Cada formulario genera un QR único para fácil acceso</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">3. PLANTILLAS:</span>
                  <span>8+ plantillas de automatización listas para activar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">4. AUTOMATIZACIÓN:</span>
                  <span>Respuestas automáticas por SMS/Email/WhatsApp/Push</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">5. SEGUIMIENTO:</span>
                  <span>Dashboard de todas las respuestas y acciones ejecutadas</span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">⚡ Velocidad</h4>
                <p className="text-2xl font-bold text-blue-600">Instantánea</p>
                <p className="text-xs text-muted-foreground">Respuesta en segundos</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">🔄 Reintentos</h4>
                <p className="text-2xl font-bold text-green-600">3x</p>
                <p className="text-xs text-muted-foreground">Con respaldo automático</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">📱 Canales</h4>
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-xs text-muted-foreground">SMS, Email, WhatsApp, Push, Phone</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">🎯 Plantillas</h4>
                <p className="text-2xl font-bold text-orange-600">8+</p>
                <p className="text-xs text-muted-foreground">Listas para usar</p>
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
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 rounded-full p-2">
                <span className="text-2xl">1️⃣</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Evento Disparador</h4>
                <p className="text-sm text-muted-foreground">
                  Una petición de oración es enviada o un visitante hace check-in en su iglesia.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground rotate-[-90deg]" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 rounded-full p-2">
                <span className="text-2xl">2️⃣</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Evaluación de Reglas</h4>
                <p className="text-sm text-muted-foreground">
                  El sistema verifica qué reglas de automatización están activas y si las condiciones coinciden 
                  (prioridad, categoría, horario laboral, etc.).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground rotate-[-90deg]" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 rounded-full p-2">
                <span className="text-2xl">3️⃣</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Ejecución de Acciones</h4>
                <p className="text-sm text-muted-foreground">
                  Si la regla tiene <strong>bypass approval</strong> (omitir aprobación), las acciones se ejecutan 
                  inmediatamente: SMS, Email, WhatsApp, notificaciones push.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Si NO tiene bypass, se crea una tarea de aprobación manual para el pastor o administrador.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground rotate-[-90deg]" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Reintentos y Respaldo</h4>
                <p className="text-sm text-muted-foreground">
                  Si falla el primer intento (ej: SMS no entregado), el sistema reintenta 3 veces con espera exponencial. 
                  Si sigue fallando, usa canales de respaldo: SMS → Email → WhatsApp → Push → Llamada telefónica.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complete Ecosystem Guide */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Ecosistema Completo: Formularios + QR + Automatización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Su iglesia ahora tiene un sistema completo e integrado que automatiza todo el proceso desde 
              la captura inicial hasta el seguimiento personalizado.
            </p>

            {/* Ecosystem Flow */}
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  📝 CREACIÓN DE FORMULARIOS
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>• <strong>Constructor de Formularios:</strong> Cree formularios personalizados para visitantes, peticiones de oración, voluntarios, eventos</li>
                  <li>• <strong>Campos Dinámicos:</strong> Texto, email, teléfono, selección múltiple, fechas, archivos</li>
                  <li>• <strong>Configuraciones Avanzadas:</strong> Mensajes de agradecimiento, redirecciones, notificaciones</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  📱 GENERACIÓN DE CÓDIGOS QR
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>• <strong>QR Automático:</strong> Cada formulario genera un código QR único</li>
                  <li>• <strong>Fácil Distribución:</strong> Imprima y coloque en bancos, boletines, pantallas</li>
                  <li>• <strong>Seguimiento:</strong> Vea cuántas personas escanean cada código</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  🤖 PLANTILLAS DE AUTOMATIZACIÓN
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>• <strong>8 Plantillas Listas:</strong> Flujos pre-construidos para casos comunes</li>
                  <li>• <strong>Activación 1-Clic:</strong> No necesita programar, solo activar</li>
                  <li>• <strong>Personalización:</strong> Ajuste mensajes, horarios, canales de comunicación</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-red-50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                  ⚡ AUTOMATIZACIÓN INTELIGENTE
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>• <strong>Respuesta Instantánea:</strong> Automación se ejecuta en segundos</li>
                  <li>• <strong>Multi-Canal:</strong> SMS, Email, WhatsApp, Push notifications</li>
                  <li>• <strong>Seguimiento Inteligente:</strong> Crea registros CRM, asigna tareas, programa recordatorios</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-gradient-to-r from-red-50 to-orange-50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                  📊 DASHBOARD DE SEGUIMIENTO
                </h4>
                <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                  <li>• <strong>Envíos de Formularios:</strong> Vea todos los datos enviados</li>
                  <li>• <strong>Ejecuciones de Automatización:</strong> Monitoree qué automatizaciones se ejecutaron</li>
                  <li>• <strong>Análisis Completo:</strong> Tasas de respuesta, engagement, conversión</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold mb-2 text-orange-900">🚀 Ejemplo Práctico: Visitante Primera Vez</h4>
              <ol className="text-sm text-orange-800 space-y-2">
                <li><strong>1.</strong> Visitante escanea QR en banco → Abre formulario de visitante</li>
                <li><strong>2.</strong> Completa formulario → Datos guardados automáticamente</li>
                <li><strong>3.</strong> Sistema detecta nueva submisión → Ejecuta plantilla "Visitante Primera Vez"</li>
                <li><strong>4.</strong> Automatización envía:</li>
                <div className="ml-6 space-y-1">
                  <li>• SMS de bienvenida al visitante (30 segundos)</li>
                  <li>• Email con información de la iglesia (1 minuto)</li>
                  <li>• Notificación al pastor (inmediato)</li>
                  <li>• Registro en CRM como "Visitante Primera Vez" (automático)</li>
                  <li>• Recordatorio para llamada de seguimiento (programado 2 días)</li>
                </div>
                <li><strong>5.</strong> Todo sucede automáticamente ¡sin intervención manual!</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start Guide */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">🚀 Guía de Inicio Rápido (5 Minutos)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-green-900">🛠️ PASO 1: Crear Primer Formulario</h4>
                <ol className="text-sm text-green-800 space-y-1">
                  <li><strong>1.</strong> Vaya a <Link href="/form-builder" className="text-blue-600 underline">Constructor de Formularios</Link></li>
                  <li><strong>2.</strong> Cree "Formulario de Visitantes" con campos: Nombre, Email, Teléfono</li>
                  <li><strong>3.</strong> Genere código QR automáticamente</li>
                  <li><strong>4.</strong> Publique y copie el enlace del formulario</li>
                </ol>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-green-900">⚡ PASO 2: Activar Primera Automatización</h4>
                <ol className="text-sm text-green-800 space-y-1">
                  <li><strong>1.</strong> Vaya a <Link href="/automation-rules/templates" className="text-blue-600 underline">Plantillas de Automatización</Link></li>
                  <li><strong>2.</strong> Busque "Visitor: First-Time Welcome"</li>
                  <li><strong>3.</strong> Haga clic en "Ver Detalles" → "Activar Plantilla"</li>
                  <li><strong>4.</strong> Personalice mensajes (opcional) → "Activar"</li>
                </ol>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-green-900">🧪 PASO 3: Probar el Sistema</h4>
                <ol className="text-sm text-green-800 space-y-1">
                  <li><strong>1.</strong> Abra el enlace de su formulario de visitantes</li>
                  <li><strong>2.</strong> Complete el formulario con sus datos de prueba</li>
                  <li><strong>3.</strong> Envíe → Verifique que recibe SMS/Email de bienvenida</li>
                  <li><strong>4.</strong> Revise el <Link href="/form-submissions" className="text-blue-600 underline">Dashboard de Envíos</Link> para ver el registro</li>
                </ol>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
              <h4 className="font-semibold mb-2 text-blue-900">🎉 ¡Felicitaciones!</h4>
              <p className="text-sm text-blue-800">
                Su sistema de automatización ahora está funcionando. Cada nuevo visitante recibirá 
                una respuesta automática y será registrado en su CRM para seguimiento pastoral.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start Guide */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">🚀 Guía de Inicio Rápido (5 Minutos)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-green-900">🛠️ PASO 1: Crear Primer Formulario</h4>
                <ol className="text-sm text-green-800 space-y-1">
                  <li><strong>1.</strong> Vaya a <Link href="/form-builder" className="text-blue-600 underline">Constructor de Formularios</Link></li>
                  <li><strong>2.</strong> Cree "Formulario de Visitantes" con campos: Nombre, Email, Teléfono</li>
                  <li><strong>3.</strong> Genere código QR automáticamente</li>
                  <li><strong>4.</strong> Publique y copie el enlace del formulario</li>
                </ol>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-green-900">⚡ PASO 2: Activar Primera Automatización</h4>
                <ol className="text-sm text-green-800 space-y-1">
                  <li><strong>1.</strong> Vaya a <Link href="/automation-rules/templates" className="text-blue-600 underline">Plantillas de Automatización</Link></li>
                  <li><strong>2.</strong> Busque "Visitor: First-Time Welcome"</li>
                  <li><strong>3.</strong> Haga clic en "Ver Detalles" → "Activar Plantilla"</li>
                  <li><strong>4.</strong> Personalice mensajes (opcional) → "Activar"</li>
                </ol>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-green-900">🧪 PASO 3: Probar el Sistema</h4>
                <ol className="text-sm text-green-800 space-y-1">
                  <li><strong>1.</strong> Abra el enlace de su formulario de visitantes</li>
                  <li><strong>2.</strong> Complete el formulario con sus datos de prueba</li>
                  <li><strong>3.</strong> Envíe → Verifique que recibe SMS/Email de bienvenida</li>
                  <li><strong>4.</strong> Revise el <Link href="/form-submissions" className="text-blue-600 underline">Dashboard de Envíos</Link> para ver el registro</li>
                </ol>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
              <h4 className="font-semibold mb-2 text-blue-900">🎉 ¡Felicitaciones!</h4>
              <p className="text-sm text-blue-800">
                Su sistema de automatización ahora está funcionando. Cada nuevo visitante recibirá 
                una respuesta automática y será registrado en su CRM para seguimiento pastoral.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Template Browser */}}
        <Card>
          <CardHeader>
            <CardTitle>📚 Explorador de Plantillas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              El sistema incluye 8+ plantillas prediseñadas listas para activar con un solo clic:
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

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-900">💡 Cómo Activar una Plantilla</h4>
              <ol className="text-sm text-blue-800 space-y-2">
                <li><strong>1.</strong> Vaya a <strong>Automatización → Plantillas</strong></li>
                <li><strong>2.</strong> Navegue por categorías: Peticiones de Oración, Visitantes, Redes Sociales, Eventos</li>
                <li><strong>3.</strong> Haga clic en <strong>&quot;Ver Detalles&quot;</strong> para ver el flujo completo</li>
                <li><strong>4.</strong> Personalice el nombre, prioridad, horarios y canales</li>
                <li><strong>5.</strong> Haga clic en <strong>&quot;Activar Plantilla&quot;</strong></li>
              </ol>
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
                  <RefreshCw className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold">Reintentos Inteligentes</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  3 reintentos automáticos con espera exponencial (1s, 2s, 4s). Nunca pierde un mensaje.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold">Canales de Respaldo</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Si un canal falla, usa el siguiente: SMS → Email → WhatsApp → Push → Llamada.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Horario Laboral</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure para ejecutar solo durante horas de oficina. Los casos urgentes pueden ejecutarse 24/7.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold">Bypass Approval</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Omita la aprobación manual para respuestas instantáneas. Perfecto para bienvenidas y confirmaciones.
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
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-2xl">🔴</span>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">URGENTE</h4>
                <p className="text-sm text-red-700">
                  Ejecuta inmediatamente, ignora horario laboral. Escalamiento a supervisor en 15 minutos si no hay respuesta.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <span className="text-2xl">🟠</span>
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900">ALTA</h4>
                <p className="text-sm text-orange-700">
                  Prioridad alta, ejecuta dentro de 1 hora. Escalamiento en 2 horas sin respuesta.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-2xl">🟢</span>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">NORMAL</h4>
                <p className="text-sm text-green-700">
                  Prioridad estándar. Respeta horario laboral. Escalamiento en 24 horas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-2xl">⚪</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">BAJA</h4>
                <p className="text-sm text-gray-700">
                  Ejecuta cuando hay disponibilidad. Sin escalamiento automático.
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
                <h4 className="font-semibold mb-2">❓ La automatización no se ejecuta</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Verifique que la regla esté <strong>Activa</strong></li>
                  <li>• Revise las condiciones: ¿coinciden con el evento?</li>
                  <li>• Si tiene horario laboral, ¿está dentro del horario?</li>
                  <li>• ¿El disparador es correcto? (PRAYER_REQUEST_SUBMITTED, VISITOR_FIRST_TIME, etc.)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">❓ Los mensajes no llegan</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Revise la configuración de Twilio (SMS/WhatsApp) en Configuración</li>
                  <li>• Verifique la configuración de Mailgun (Email)</li>
                  <li>• El sistema intentará canales de respaldo automáticamente</li>
                  <li>• Revise el historial de ejecución en el dashboard de automatización</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">❓ Quiero desactivar una regla temporalmente</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Vaya a <strong>Automatización → Mis Reglas</strong></li>
                  <li>• Haga clic en el toggle <strong>&quot;Activo&quot;</strong> para desactivar</li>
                  <li>• La regla permanece configurada pero no se ejecutará</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">✅ Mejores Prácticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Use bypass approval para bienvenidas:</strong> Los mensajes de bienvenida pueden enviarse inmediatamente sin aprobación.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Active modo urgente 24/7:</strong> Para peticiones de oración marcadas como urgentes, ignora el horario laboral.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Configure canales de respaldo:</strong> Siempre tenga al menos 2 canales configurados (ej: SMS y Email).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Personalice los mensajes:</strong> Use variables como {'{nombre}'}, {'{iglesia}'}, {'{mensaje}'} para personalizar.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Monitoree el dashboard:</strong> Revise regularmente el historial de ejecución para detectar problemas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🚀 Siguientes Pasos Recomendados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">📝 Ampliar Formularios</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Peticiones de Oración:</strong> Cree formulario para peticiones urgentes y programadas</li>
                  <li>• <strong>Voluntarios:</strong> Formulario de registro con habilidades y disponibilidad</li>
                  <li>• <strong>Eventos:</strong> Formularios de inscripción para eventos especiales</li>
                  <li>• <strong>Testimonios:</strong> Recopile testimonios de miembros para compartir</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">⚡ Activar Más Automatizaciones</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>"Prayer Request: Church Notification":</strong> Notifica pastores de peticiones urgentes</li>
                  <li>• <strong>"Prayer Request: Auto-Acknowledgment":</strong> Confirma recepción de peticiones</li>
                  <li>• <strong>"Visitor: Returning Engagement":</strong> Seguimiento de visitantes recurrentes</li>
                  <li>• <strong>"Prayer Request: 24/7 Urgent":</strong> Sistema de alertas 24 horas</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">📊 Monitoreo y Optimización</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Dashboard de Envíos:</strong> Revise <Link href="/form-submissions" className="text-blue-600 underline">todos los formularios enviados</Link></li>
                  <li>• <strong>Estadísticas de QR:</strong> Vea qué códigos son más utilizados</li>
                  <li>• <strong>Tasas de Automatización:</strong> Monitoree éxito de envíos automáticos</li>
                  <li>• <strong>Seguimiento de Conversión:</strong> Visitantes que se vuelven miembros</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">🌐 Distribución de QR</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Bancos de Iglesia:</strong> Imprima QR de visitantes en tarjetas pequeñas</li>
                  <li>• <strong>Boletines:</strong> Incluya QR para peticiones de oración</li>
                  <li>• <strong>Redes Sociales:</strong> Comparta QR en Facebook/Instagram/WhatsApp</li>
                  <li>• <strong>Eventos:</strong> QR específicos para inscripciones de eventos</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
              <h4 className="font-semibold mb-2 text-green-900">🏆 Meta de Implementación Completa</h4>
              <p className="text-sm text-green-800">
                <strong>Objetivo:</strong> Que el 100% de las interacciones de su iglesia (visitantes, peticiones, voluntarios, eventos) 
                sean capturadas automáticamente y reciban seguimiento personalizado sin intervención manual.
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
                <h4 className="font-semibold mb-2">🔗 Integración con Sistemas Existentes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>CRM Automático:</strong> Todos los formularios crean registros CRM automáticamente</li>
                  <li>• <strong>Check-ins Inteligentes:</strong> Visitantes se registran automáticamente para seguimiento</li>
                  <li>• <strong>Sistema de Miembros:</strong> Integración completa con perfiles de miembros</li>
                  <li>• <strong>Calendario de Eventos:</strong> Formularios de eventos crean entradas de calendario</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">📋 Personalización de Plantillas</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Mensajes Dinámicos:</strong> Use variables como {nombre}, {iglesia}, {fecha}</li>
                  <li>• <strong>Horarios Personalizados:</strong> Configure horarios de envío por tipo de mensaje</li>
                  <li>• <strong>Canales Preferenciales:</strong> SMS para urgente, Email para información detallada</li>
                  <li>• <strong>Escalación Inteligente:</strong> Si SMS falla, intenta WhatsApp, luego Email</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">📈 Métricas de Éxito</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Tasa de Respuesta:</strong> % de visitantes que responden a automatizaciones</li>
                  <li>• <strong>Tasa de Conversión:</strong> % de visitantes que se vuelven miembros regulares</li>
                  <li>• <strong>Tiempo de Respuesta:</strong> Rapidez promedio de respuestas automáticas</li>
                  <li>• <strong>Engagement Score:</strong> Nivel de compromiso basado en interacciones</li>
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
              <div className="p-4 border rounded-lg bg-yellow-50">
                <h4 className="font-semibold mb-2">⚠️ Problema: No se envían mensajes automáticos</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Solución:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>1. Verifique que la plantilla está <strong>"Activa"</strong> en el dashboard</li>
                    <li>2. Revise que los campos del formulario coinciden con los esperados</li>
                    <li>3. Confirme que las credenciales de SMS/Email están configuradas</li>
                    <li>4. Vaya a <Link href="/settings/integrations" className="text-blue-600 underline">Configuración de Integraciones</Link></li>
                  </ul>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-semibold mb-2">📱 Problema: Código QR no funciona</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Solución:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>1. Verifique que el formulario está <strong>"Público"</strong> y <strong>"Activo"</strong></li>
                    <li>2. Pruebe el enlace directo del formulario primero</li>
                    <li>3. Regenere el código QR si es necesario</li>
                    <li>4. Use cámara del teléfono o app QR reader para probar</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-semibold mb-2">📋 Problema: Datos no aparecen en dashboard</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Solución:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>1. Refresque la página del <Link href="/form-submissions" className="text-blue-600 underline">Dashboard de Envíos</Link></li>
                    <li>2. Verifique filtros de fecha y tipo de formulario</li>
                    <li>3. Confirme que el envío fue exitoso (mensaje de confirmación)</li>
                    <li>4. Revise la consola del navegador para errores JavaScript</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-2">📞 Soporte Técnico</h4>
              <p className="text-sm text-muted-foreground">
                Para problemas técnicos avanzados, contacte al equipo de soporte en 
                <Link href="/help/support/ticket" className="text-blue-600 underline">Crear Ticket de Soporte</Link> 
                con detalles específicos del problema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
