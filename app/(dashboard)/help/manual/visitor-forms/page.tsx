'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  QrCode, 
  Smartphone, 
  BarChart3,
  Settings,
  Users,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

export default function VisitorFormsManual() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          📝 Sistema de Formularios de Visitantes
          <Badge variant="secondary">🆕 Nuevo</Badge>
        </h1>
        <p className="text-muted-foreground">
          Capture información de visitantes con formularios personalizables y códigos QR
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              ¿Qué son los Formularios de Visitantes?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              El Sistema de Formularios de Visitantes le permite crear formularios web personalizados 
              para capturar información de visitantes, con códigos QR para acceso móvil fácil y 
              seguimiento automático de conversiones.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Formularios Web</h3>
                <p className="text-sm text-muted-foreground">
                  7 tipos de campos personalizables
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <QrCode className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Códigos QR</h3>
                <p className="text-sm text-muted-foreground">
                  Acceso móvil con tracking automático
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Seguimiento completo de conversiones
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creating Forms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              1. Crear Formulario de Visitantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[hsl(var(--info)/0.10)] border border-[hsl(var(--info)/0.3)] rounded-lg p-4">
              <p className="text-sm text-[hsl(var(--info))] mb-2">
                <strong>Ruta:</strong> Panel de Control → Formularios de Visitantes → Nuevo Formulario
              </p>
            </div>

            <h4 className="font-semibold">Pasos para crear un formulario:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Información Básica</p>
                  <p className="text-sm text-muted-foreground">
                    • Nombre del formulario<br />
                    • Descripción (opcional)<br />
                    • Configurar como público/privado
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Agregar Campos</p>
                  <p className="text-sm text-muted-foreground">
                    • <strong>Text:</strong> Nombre, apellido<br />
                    • <strong>Email:</strong> Correo electrónico<br />
                    • <strong>Tel:</strong> Número telefónico<br />
                    • <strong>Textarea:</strong> Comentarios largos<br />
                    • <strong>Select:</strong> Lista desplegable<br />
                    • <strong>Radio:</strong> Opción única<br />
                    • <strong>Checkbox:</strong> Múltiples opciones
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Personalizar Estilo</p>
                  <p className="text-sm text-muted-foreground">
                    • Color de fondo<br />
                    • Color primario (botones)<br />
                    • Color de texto de botones<br />
                    • Imagen de fondo (opcional)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Configurar Comportamiento</p>
                  <p className="text-sm text-muted-foreground">
                    • Mensaje de agradecimiento<br />
                    • URL de redirección<br />
                    • Notificaciones por email<br />
                    • Auto-seguimiento de visitantes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Codes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              2. Generar Códigos QR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[hsl(var(--success)/0.10)] border border-[hsl(var(--success)/0.3)] rounded-lg p-4">
              <p className="text-sm text-[hsl(var(--success))]">
                Los códigos QR permiten a visitantes acceder fácilmente al formulario desde sus móviles
              </p>
            </div>

            <h4 className="font-semibold">Características de QR Codes:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-2">Personalización:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tamaño (150px - 400px)</li>
                  <li>• Color del código</li>
                  <li>• Color de fondo</li>
                  <li>• Estilo (cuadrado/redondeado)</li>
                  <li>• Logo de iglesia (opcional)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Gestión:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Nombres descriptivos por ubicación</li>
                  <li>• Seguimiento de escaneos</li>
                  <li>• Última fecha de escaneo</li>
                  <li>• Activar/desactivar códigos</li>
                  <li>• Descarga en PNG de alta calidad</li>
                </ul>
              </div>
            </div>

            <div className="bg-[hsl(var(--warning)/0.10)] border border-[hsl(var(--warning)/0.3)] rounded-lg p-4">
              <p className="text-sm text-[hsl(var(--warning))]">
                <strong>Sugerencia:</strong> Cree QR codes específicos para diferentes ubicaciones 
                (Entrada Principal, Lobby, Santuario) para mejor tracking.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Analytics & Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              3. Analytics y Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Métricas Disponibles:</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Analytics
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Número total de escaneos</li>
                  <li>• Escaneos por código QR</li>
                  <li>• Última fecha de escaneo</li>
                  <li>• Ubicaciones más populares</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Form Analytics
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Total de submissions</li>
                  <li>• Tasa de conversión QR → Form</li>
                  <li>• Fuente de tráfico (QR vs directo)</li>
                  <li>• Submissions por día/semana</li>
                </ul>
              </div>
            </div>

            <h4 className="font-semibold mt-6">Integración con Sistema de Visitantes:</h4>
            <div className="bg-[hsl(var(--info)/0.10)] border border-[hsl(var(--info)/0.3)] rounded-lg p-4">
              <p className="text-sm text-[hsl(var(--info))] mb-2">
                <strong>Auto-Conversión:</strong> Los formularios pueden convertir automáticamente 
                submissions en registros de visitantes en el sistema principal.
              </p>
              <ul className="text-sm text-[hsl(var(--info))] space-y-1">
                <li>• ✅ Crea check-in automático</li>
                <li>• ✅ Marca como "primera vez"</li>
                <li>• ✅ Asigna engagement score alto (70)</li>
                <li>• ✅ Activa secuencia de seguimiento</li>
              </ul>
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
                <h4 className="font-semibold mb-3 text-[hsl(var(--success))]">✅ Recomendaciones:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Formularios cortos:</strong> Máximo 7 campos para mejor conversión</li>
                  <li>• <strong>Campos obligatorios mínimos:</strong> Solo nombre y email esenciales</li>
                  <li>• <strong>Diseño consistente:</strong> Use colores de su iglesia</li>
                  <li>• <strong>QR codes múltiples:</strong> Uno por ubicación física</li>
                  <li>• <strong>Auto-seguimiento activado:</strong> Para mejor retención</li>
                  <li>• <strong>Mensaje personalizado:</strong> Mensaje de bienvenida cálido</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-[hsl(var(--destructive))]">❌ Evitar:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Formularios largos:</strong> Más de 10 campos reduce conversión</li>
                  <li>• <strong>Muchos campos obligatorios:</strong> Puede intimidar visitantes</li>
                  <li>• <strong>QR codes muy pequeños:</strong> Difíciles de escanear</li>
                  <li>• <strong>Sin mensaje de agradecimiento:</strong> Experiencia incompleta</li>
                  <li>• <strong>No revisar analytics:</strong> Perdida de insights valiosos</li>
                  <li>• <strong>Formularios inactivos:</strong> Mantener actualizados</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Detalles Técnicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">URLs del Sistema:</h4>
                <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                  <p>Formulario público:</p>
                  <p className="text-[hsl(var(--info))]">/visitor-form/[slug]</p>
                  <p className="mt-2">Con QR code:</p>
                  <p className="text-[hsl(var(--info))]">/visitor-form/[slug]?qr=[code]</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Características Móviles:</h4>
                <ul className="text-sm space-y-1">
                  <li>• ✅ Totalmente responsive</li>
                  <li>• ✅ Touch-friendly</li>
                  <li>• ✅ Validación en tiempo real</li>
                  <li>• ✅ Carga rápida (&lt;2s)</li>
                  <li>• ✅ Funciona sin JavaScript</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}