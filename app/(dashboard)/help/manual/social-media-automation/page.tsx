'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Share2, 
  Facebook, 
  Instagram, 
  Linkedin,
  Settings,
  Zap,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react'

export default function SocialMediaAutomationManual() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          📱 Automatización de Redes Sociales
          <Badge variant="secondary">🆕 Nuevo</Badge>
        </h1>
        <p className="text-muted-foreground">
          Publique automáticamente contenido en múltiples plataformas sociales con reglas inteligentes
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              ¿Qué es la Automatización de Redes Sociales?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Sistema que automáticamente publica contenido relacionado con eventos, sermones, 
              peticiones de oración y otros contenidos de la iglesia en Facebook, Instagram, LinkedIn y YouTube.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">8 Disparadores</h3>
                <p className="text-sm text-muted-foreground">
                  Eventos automáticos inteligentes
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Share2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">4 Plataformas</h3>
                <p className="text-sm text-muted-foreground">
                  Facebook, Instagram, LinkedIn, YouTube
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Programación</h3>
                <p className="text-sm text-muted-foreground">
                  Horarios optimizados automáticamente
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Métricas de engagement completas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access */}
        <Card>
          <CardHeader>
            <CardTitle>📍 Acceder al Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Ruta:</strong> Panel de Control → Redes Sociales → Automatización
              </p>
              <p className="text-sm text-blue-700 mt-2">
                <strong>Permisos:</strong> PASTOR, ADMIN_IGLESIA, LIDER (con permisos de social media)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Automation Triggers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              8 Disparadores de Automatización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid gap-4">
              {/* Event Creation */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  1. Creación de Eventos
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Trigger Automático:</h4>
                    <p className="text-sm text-muted-foreground">
                      Cuando se crea un nuevo evento, automáticamente se publica anuncio en redes sociales.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contenido Generado:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Título y descripción del evento</li>
                      <li>• Fecha, hora y ubicación</li>
                      <li>• Imagen/logo de la iglesia</li>
                      <li>• Call-to-action para asistir</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Event Reminders */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  2. Recordatorios de Eventos
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Programación Inteligente:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>1 semana antes:</strong> Anuncio inicial</li>
                      <li>• <strong>3 días antes:</strong> Recordatorio</li>
                      <li>• <strong>1 día antes:</strong> Último llamado</li>
                      <li>• <strong>2 horas antes:</strong> Recordatorio final</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Personalización:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Mensajes únicos por timing</li>
                      <li>• Tono adaptado al evento</li>
                      <li>• Hashtags relevantes automáticos</li>
                      <li>• Menciones de líderes cuando aplica</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Prayer Requests */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <div className="h-5 w-5 text-purple-500">🙏</div>
                  3. Peticiones de Oración
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Tipos de Publicación:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Peticiones públicas:</strong> Compartidas con permiso</li>
                      <li>• <strong>Llamados generales:</strong> Invitación a orar</li>
                      <li>• <strong>Testimonios de oración:</strong> Respuestas recibidas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Privacidad y Sensibilidad:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Solo peticiones marcadas como "públicas"</li>
                      <li>• Anonimización automática cuando necesaria</li>
                      <li>• Moderación pastoral antes de publicación</li>
                      <li>• Opción de cancelación inmediata</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sermon Content */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <div className="h-5 w-5 text-orange-500">📖</div>
                  4. Contenido de Sermones
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Automatización de Sermones:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Anuncio previo del tema semanal</li>
                      <li>• Versículos clave destacados</li>
                      <li>• Preguntas de reflexión</li>
                      <li>• Enlaces a sermón grabado</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contenido Derivado:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Citas inspiradoras del sermón</li>
                      <li>• Resumen de puntos clave</li>
                      <li>• Aplicaciones prácticas</li>
                      <li>• Serie de posts de la semana</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Member Celebrations */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <div className="h-5 w-5 text-pink-500">🎉</div>
                  5-8. Celebraciones y Hitos
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Tipos de Celebraciones:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Bautismos:</strong> Celebración de nuevos miembros</li>
                      <li>• <strong>Aniversarios:</strong> Miembros de largo plazo</li>
                      <li>• <strong>Logros ministeriales:</strong> Reconocimientos</li>
                      <li>• <strong>Hitos de iglesia:</strong> Crecimiento y logros</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Personalización:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Mensaje personalizado por tipo de celebración</li>
                      <li>• Incluye fotos cuando están disponibles</li>
                      <li>• Menciona a la persona (con permiso)</li>
                      <li>• Invita a la comunidad a celebrar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Platform Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración de Plataformas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Plataformas Soportadas:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Facebook</p>
                      <p className="text-xs text-muted-foreground">Posts, eventos, fotos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="font-medium">Instagram</p>
                      <p className="text-xs text-muted-foreground">Posts visuales, stories</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Linkedin className="h-5 w-5 text-blue-700" />
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-xs text-muted-foreground">Contenido profesional</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-5 w-5 bg-red-500 rounded flex items-center justify-center text-white text-xs">Y</div>
                    <div>
                      <p className="font-medium">YouTube</p>
                      <p className="text-xs text-muted-foreground">Videos, live streams</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Configuración por Plataforma:</h4>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">Facebook/Instagram:</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• API de Facebook Business</li>
                      <li>• Páginas de iglesia conectadas</li>
                      <li>• Programación óptima automática</li>
                      <li>• Hashtags locales y temáticos</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">LinkedIn:</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Perfil organizacional</li>
                      <li>• Contenido de liderazgo pastoral</li>
                      <li>• Networking cristiano profesional</li>
                      <li>• Eventos de capacitación/conferencias</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">YouTube:</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Canal de iglesia conectado</li>
                      <li>• Upload automático de sermones</li>
                      <li>• Playlists organizadas por serie</li>
                      <li>• Notificaciones de nuevos videos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics & Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics y Monitoreo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Métricas de Engagement:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Likes, comentarios, shares</li>
                  <li>• Alcance e impresiones</li>
                  <li>• Click-through rates</li>
                  <li>• Crecimiento de seguidores</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Performance de Contenido:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Posts con mejor performance</li>
                  <li>• Horarios óptimos de publicación</li>
                  <li>• Tipos de contenido más populares</li>
                  <li>• Hashtags más efectivos</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Insights Estratégicos:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Demografía de audiencia</li>
                  <li>• Patrones de engagement</li>
                  <li>• Recomendaciones de mejora</li>
                  <li>• ROI de campañas automatizadas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Mejores Prácticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Recomendaciones:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Contenido auténtico:</strong> Mantenga voz genuina de la iglesia</li>
                  <li>• <strong>Moderación:</strong> Revise contenido automático regularmente</li>
                  <li>• <strong>Engagement:</strong> Responda a comentarios personalmente</li>
                  <li>• <strong>Equilibrio:</strong> Mezcle contenido automático con posts manuales</li>
                  <li>• <strong>Horarios:</strong> Respete horarios óptimos por plataforma</li>
                  <li>• <strong>Calidad visual:</strong> Use imágenes de alta calidad</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Evitar:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Sobre-publicación:</strong> No sature feeds con contenido</li>
                  <li>• <strong>Contenido irrelevante:</strong> Mantenga relevancia ministerial</li>
                  <li>• <strong>Falta de personalización:</strong> Adapte por plataforma</li>
                  <li>• <strong>Ignorar analytics:</strong> Use datos para mejorar estrategia</li>
                  <li>• <strong>Automatización 100%:</strong> Mantenga toque humano</li>
                  <li>• <strong>Controversia:</strong> Evite temas divisivos automáticamente</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Configuración Inicial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Requisitos Previos:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Cuentas de redes sociales de la iglesia creadas</li>
                  <li>• Acceso de administrador a las páginas/canales</li>
                  <li>• APIs configuradas (se hace una sola vez)</li>
                  <li>• Permisos de publicación otorgados al sistema</li>
                </ul>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">1</div>
                  <p className="font-medium text-sm">Conectar Cuentas</p>
                  <p className="text-xs text-muted-foreground">Vincular redes sociales</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">2</div>
                  <p className="font-medium text-sm">Configurar Reglas</p>
                  <p className="text-xs text-muted-foreground">Activar disparadores</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">3</div>
                  <p className="font-medium text-sm">Monitorear</p>
                  <p className="text-xs text-muted-foreground">Revisar analytics</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}