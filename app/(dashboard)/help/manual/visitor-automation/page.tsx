'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Users, Star, TrendingUp, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function VisitorAutomationManual() {
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
          <h1 className="text-3xl font-bold">Manual: Automatización de Seguimiento de Visitantes</h1>
          <p className="text-muted-foreground">Sistema inteligente de categorización y seguimiento automático</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <Card className="border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.10)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[hsl(var(--info))]" />
              🎯 Seguimiento Inteligente de Visitantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              El sistema analiza automáticamente cada visitante y determina el seguimiento perfecto basado en:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">📊 Historial de Visitas</h4>
                <p className="text-sm text-muted-foreground">
                  ¿Primera vez? ¿Visitante recurrente? ¿Candidato a membresía? El sistema lo detecta automáticamente.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">🎯 Intereses Personalizados</h4>
                <p className="text-sm text-muted-foreground">
                  Conecta visitantes con ministerios relevantes basado en sus intereses expresados.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">⚡ Respuesta Instantánea</h4>
                <p className="text-sm text-muted-foreground">
                  Envía bienvenidas y seguimientos automáticos en segundos, no días.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">📈 Escalamiento Inteligente</h4>
                <p className="text-sm text-muted-foreground">
                  Aumenta el nivel de seguimiento automáticamente según el compromiso.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-Categorization */}
        <Card>
          <CardHeader>
            <CardTitle>🤖 Auto-Categorización de Visitantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground mb-4">
              El sistema analiza el historial y automáticamente categoriza a cada visitante:
            </p>

            <div className="space-y-3">
              <div className="p-4 border-2 border-[hsl(var(--success)/0.3)] rounded-lg bg-[hsl(var(--success)/0.10)]">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="h-5 w-5 text-[hsl(var(--success))]" />
                  <h4 className="font-semibold text-foreground">FIRST_TIME - Primera Vez</h4>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm mb-2"><strong>Criterio:</strong> 0 visitas anteriores</p>
                  <p className="text-sm mb-2"><strong>Seguimiento automático:</strong></p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Bienvenida por SMS/Email (inmediato)</li>
                    <li>• Video de bienvenida del pastor (2 días)</li>
                    <li>• Invitación a evento de bienvenida (1 semana)</li>
                    <li>• Invitación a grupo pequeño (2 semanas)</li>
                    <li>• Encuesta de experiencia (1 mes)</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border-2 border-[hsl(var(--info)/0.3)] rounded-lg bg-[hsl(var(--info)/0.10)]">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-[hsl(var(--info))]" />
                  <h4 className="font-semibold text-foreground">RETURNING - Visitante Recurrente</h4>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm mb-2"><strong>Criterio:</strong> 1-2 visitas anteriores</p>
                  <p className="text-sm mb-2"><strong>Seguimiento automático:</strong></p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Mensaje de agradecimiento por regresar (3 días)</li>
                    <li>• Invitación personalizada a ministerios (1 semana)</li>
                    <li>• Conexión con persona de su edad/intereses</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border-2 border-[hsl(var(--lavender)/0.3)] rounded-lg bg-[hsl(var(--lavender)/0.10)]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-[hsl(var(--lavender))]" />
                  <h4 className="font-semibold text-foreground">REGULAR - Asistente Regular</h4>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm mb-2"><strong>Criterio:</strong> 3+ visitas</p>
                  <p className="text-sm mb-2"><strong>Seguimiento automático:</strong></p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Reconocimiento de compromiso</li>
                    <li>• Invitación a servir como voluntario</li>
                    <li>• Conexión con líderes de ministerio</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border-2 border-[hsl(var(--warning)/0.3)] rounded-lg bg-[hsl(var(--warning)/0.10)]">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-[hsl(var(--warning))]" />
                  <h4 className="font-semibold text-[hsl(var(--warning))]">MEMBER_CANDIDATE - Candidato a Miembro</h4>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm mb-2"><strong>Criterio:</strong> 4+ visitas O expresó interés en membresía</p>
                  <p className="text-sm mb-2"><strong>Seguimiento automático:</strong></p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Invitación a clase de membresía</li>
                    <li>• Reunión personal con pastor</li>
                    <li>• Información sobre proceso de membresía</li>
                    <li>• Asignación de mentor</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complete Flow */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Flujo Completo de Automatización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="bg-[hsl(var(--info))] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Visitante Hace Check-In</h4>
                  <p className="text-sm text-muted-foreground">
                    La persona se registra en la recepción, app móvil o escanea código QR en el templo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="bg-[hsl(var(--success))] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Análisis del Historial</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    El sistema busca check-ins anteriores por email/teléfono:
                  </p>
                  <div className="bg-white p-2 rounded text-xs font-mono">
                    visitasPrevias = count(check-ins anteriores)<br/>
                    SI visitasPrevias === 0 → FIRST_TIME<br/>
                    SI visitasPrevias === 1-2 → RETURNING<br/>
                    SI visitasPrevias &gt;= 3 → REGULAR<br/>
                    SI visitasPrevias &gt;= 4 O membresiaInterés → MEMBER_CANDIDATE
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="bg-[hsl(var(--lavender))] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Creación/Actualización de Perfil</h4>
                  <p className="text-sm text-muted-foreground">
                    Crea o actualiza el VisitorProfile con:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 mt-2">
                    <li>• Categoría actual</li>
                    <li>• Contador de visitas</li>
                    <li>• Fecha de primera y última visita</li>
                    <li>• Áreas de interés (ministerios)</li>
                    <li>• Información de contacto preferida</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="bg-[hsl(var(--warning))] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Selección de Reglas</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Busca reglas activas que coincidan con la categoría:
                  </p>
                  <div className="bg-white p-2 rounded text-xs">
                    <strong>Ejemplo:</strong> Para FIRST_TIME, busca reglas con trigger &quot;VISITOR_FIRST_TIME&quot;
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[hsl(var(--success)/0.10)] rounded-lg border-2 border-[hsl(var(--success)/0.30)]">
                <div className="bg-[hsl(var(--success))] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Ejecución con Bypass Approval</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>CON bypass:</strong> Ejecuta acciones inmediatamente (SMS, Email, WhatsApp)<br/>
                    <strong>SIN bypass:</strong> Crea tarea de follow-up para staff
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Available */}
        <Card>
          <CardHeader>
            <CardTitle>📦 Plantillas de Visitantes Disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 border-2 border-[hsl(var(--success)/0.3)] rounded-lg bg-[hsl(var(--success)/0.10)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👋</span>
                <h4 className="font-semibold text-foreground">Bienvenida Visitante Primera Vez</h4>
              </div>
              <p className="text-sm text-[hsl(var(--success))] mb-3">
                Secuencia completa de 5 toques para visitantes nuevos.
              </p>
              <div className="bg-white p-3 rounded space-y-2 text-xs">
                <div><strong>Disparador:</strong> Check-in con categoría FIRST_TIME</div>
                <div><strong>Bypass Approval:</strong> ✅ Sí (para bienvenida inmediata)</div>
                <div><strong>Secuencia de 5 Toques:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• <strong>Toque 1 (Inmediato):</strong> SMS/Email de bienvenida</li>
                  <li>• <strong>Toque 2 (2 días):</strong> Video personalizado del pastor</li>
                  <li>• <strong>Toque 3 (7 días):</strong> Información de ministerios</li>
                  <li>• <strong>Toque 4 (14 días):</strong> Invitación a grupo pequeño</li>
                  <li>• <strong>Toque 5 (30 días):</strong> Encuesta de experiencia</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-2 border-[hsl(var(--info)/0.3)] rounded-lg bg-[hsl(var(--info)/0.10)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔄</span>
                <h4 className="font-semibold text-foreground">Engagement Visitante Recurrente</h4>
              </div>
              <p className="text-sm text-[hsl(var(--info))] mb-3">
                Profundiza la relación con visitantes que regresan.
              </p>
              <div className="bg-white p-3 rounded space-y-2 text-xs">
                <div><strong>Disparador:</strong> Check-in con categoría RETURNING</div>
                <div><strong>Bypass Approval:</strong> ✅ Sí</div>
                <div><strong>Acciones:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• Mensaje de &quot;¡Qué bueno verte de nuevo!&quot;</li>
                  <li>• Invitación personalizada basada en intereses</li>
                  <li>• Conexión con alguien de su edad/situación</li>
                  <li>• Invitación a evento social</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-2 border-[hsl(var(--warning)/0.3)] rounded-lg bg-[hsl(var(--warning)/0.10)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌟</span>
                <h4 className="font-semibold text-[hsl(var(--warning))]">Invitación a Membresía</h4>
              </div>
              <p className="text-sm text-[hsl(var(--warning))] mb-3">
                Para visitantes regulares listos para dar el siguiente paso.
              </p>
              <div className="bg-white p-3 rounded space-y-2 text-xs">
                <div><strong>Disparador:</strong> Check-in con categoría MEMBER_CANDIDATE</div>
                <div><strong>Bypass Approval:</strong> ❌ No (requiere revisión pastoral)</div>
                <div><strong>Acciones:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• Notifica al pastor sobre candidato</li>
                  <li>• Programa reunión personal</li>
                  <li>• Envía información sobre clase de membresía</li>
                  <li>• Asigna mentor o guía espiritual</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-2 border-[hsl(var(--destructive)/0.3)] rounded-lg bg-[hsl(var(--destructive)/0.10)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🚨</span>
                <h4 className="font-semibold text-[hsl(var(--destructive))]">Seguimiento Urgente 24/7</h4>
              </div>
              <p className="text-sm text-[hsl(var(--destructive))] mb-3">
                Para visitantes que necesitan atención pastoral inmediata.
              </p>
              <div className="bg-white p-3 rounded space-y-2 text-xs">
                <div><strong>Disparador:</strong> Check-in con petición de oración o necesidad especial</div>
                <div><strong>Bypass Approval:</strong> ✅ Sí</div>
                <div><strong>Modo Urgente 24/7:</strong> ✅ Activo</div>
                <div><strong>Acciones:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• Notificación inmediata al pastor y equipo pastoral</li>
                  <li>• Llamada telefónica dentro de 30 minutos</li>
                  <li>• Escalamiento a supervisor si no hay respuesta en 15 min</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visitor Profile Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Seguimiento del Perfil de Visitante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Cada visitante tiene un perfil que rastrea automáticamente:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">📈 Métricas de Compromiso</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Número total de visitas</li>
                  <li>• Fecha de primera visita</li>
                  <li>• Fecha de última visita</li>
                  <li>• Categoría actual</li>
                  <li>• Tendencia (aumentando/disminuyendo)</li>
                </ul>
              </div>
              <div className="p-3 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">💬 Historial de Comunicación</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Follow-ups enviados</li>
                  <li>• Follow-ups respondidos</li>
                  <li>• Canal preferido (SMS/Email/WhatsApp)</li>
                  <li>• Mejor hora de contacto</li>
                </ul>
              </div>
              <div className="p-3 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">🎯 Intereses y Conexiones</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Ministerios de interés</li>
                  <li>• Eventos a los que asistió</li>
                  <li>• Peticiones de oración hechas</li>
                  <li>• Staff asignado para seguimiento</li>
                </ul>
              </div>
              <div className="p-3 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-2">🔄 Acciones Automatizadas</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Auto-agregado a CRM</li>
                  <li>• Follow-ups programados</li>
                  <li>• Próximas acciones sugeridas</li>
                  <li>• Estado de conversión (visitante → miembro)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="border-[hsl(var(--success)/0.3)]">
          <CardHeader>
            <CardTitle className="text-foreground">✨ Mejores Prácticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-[hsl(var(--success))] font-bold">1.</span>
              <p>
                <strong>Responda rápido a visitantes nuevos:</strong> Los primeros 24-48 horas son críticos. Use bypass approval para bienvenidas inmediatas.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[hsl(var(--success))] font-bold">2.</span>
              <p>
                <strong>Personalice según la categoría:</strong> No trate a un visitante por primera vez igual que a un candidato a miembro.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[hsl(var(--success))] font-bold">3.</span>
              <p>
                <strong>Conecte con intereses:</strong> Si expresaron interés en música, conéctelos con el ministerio de música.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[hsl(var(--success))] font-bold">4.</span>
              <p>
                <strong>Escale progresivamente:</strong> Comience con mensajes automáticos, luego llamadas personales para candidatos a miembro.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[hsl(var(--success))] font-bold">5.</span>
              <p>
                <strong>Monitoree y ajuste:</strong> Revise qué plantillas tienen mejor tasa de respuesta y ajuste según los resultados.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <Card className="border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.10)]">
          <CardHeader>
            <CardTitle className="text-foreground">🚀 Inicio Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="font-bold text-[hsl(var(--info))]">1.</span>
                <span>Vaya a <Link href="/automation-rules/templates" className="text-[hsl(var(--info))] underline font-semibold">Plantillas de Automatización</Link></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[hsl(var(--info))]">2.</span>
                <span>Filtre por categoría <strong>&quot;Seguimiento de Visitantes&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[hsl(var(--info))]">3.</span>
                <span>Active las 4 plantillas de visitantes</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[hsl(var(--info))]">4.</span>
                <span>Registre un visitante de prueba en Check-Ins</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[hsl(var(--info))]">5.</span>
                <span>Verifique que los mensajes se envíen automáticamente</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[hsl(var(--info))]">6.</span>
                <span>Revise el VisitorProfile creado para ver el seguimiento</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
