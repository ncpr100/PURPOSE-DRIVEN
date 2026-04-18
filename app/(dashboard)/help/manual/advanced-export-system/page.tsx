'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileDown, 
  FileText, 
  BarChart3, 
  Download,
  FileSpreadsheet,
  Printer,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react'

export default function AdvancedExportSystemManual() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          📤 Sistema de Exportación Avanzado
          <Badge variant="secondary">🆕 Nuevo</Badge>
        </h1>
        <p className="text-muted-foreground">
          Exportación profesional de datos con branding de iglesia y múltiples formatos
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              ¿Qué es el Sistema de Exportación Avanzado?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Sistema que permite exportar datos de cualquier módulo de la plataforma en formatos 
              profesionales con branding personalizado de la iglesia, optimizado para presentaciones 
              ejecutivas y reportes ministeriales.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">PDF Ejecutivo</h3>
                <p className="text-sm text-muted-foreground">
                  Reportes profesionales con branding
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Excel Avanzado</h3>
                <p className="text-sm text-muted-foreground">
                  Hojas de cálculo con fórmulas y gráficos
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Download className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">CSV Estructurado</h3>
                <p className="text-sm text-muted-foreground">
                  Datos limpios para análisis externo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Formats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Formatos de Exportación Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* PDF Executive */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[hsl(var(--destructive))]" />
                PDF Ejecutivo (Recomendado)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Características:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Branding completo:</strong> Logo y colores de iglesia</li>
                    <li>• <strong>Layout profesional:</strong> Diseño limpio y organizado</li>
                    <li>• <strong>Gráficos integrados:</strong> Visualizaciones automáticas</li>
                    <li>• <strong>Metadatos incluidos:</strong> Fecha, autor, confidencialidad</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Ideal Para:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Presentaciones a liderazgo</li>
                    <li>• Reportes de junta directiva</li>
                    <li>• Informes ministeriales</li>
                    <li>• Documentación oficial</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Excel Advanced */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-[hsl(var(--success))]" />
                Excel Avanzado
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Funcionalidades:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Múltiples hojas:</strong> Datos organizados por categoría</li>
                    <li>• <strong>Fórmulas incluidas:</strong> Cálculos automáticos</li>
                    <li>• <strong>Gráficos dinámicos:</strong> Visualizaciones interactivas</li>
                    <li>• <strong>Formato condicional:</strong> Destacado inteligente de datos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Casos de Uso:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Análisis financiero detallado</li>
                    <li>• Planificación presupuestaria</li>
                    <li>• Seguimiento de crecimiento</li>
                    <li>• Análisis de tendencias temporales</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CSV Structured */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Download className="h-5 w-5 text-[hsl(var(--info))]" />
                CSV Estructurado
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Ventajas:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Datos limpios:</strong> Sin formato, solo información</li>
                    <li>• <strong>Universal:</strong> Compatible con cualquier sistema</li>
                    <li>• <strong>Ligero:</strong> Archivos pequeños y rápidos</li>
                    <li>• <strong>Programático:</strong> Fácil de procesar con scripts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Perfecto Para:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Migración de datos</li>
                    <li>• Integración con otros sistemas</li>
                    <li>• Análisis con herramientas externas</li>
                    <li>• Backup de datos estructurados</li>
                  </ul>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Available Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Fuentes de Datos Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Puede exportar datos de todos los módulos principales de la plataforma:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📊 Datos Administrativos:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Miembros:</strong> Perfiles completos, estado espiritual, contactos</li>
                  <li>• <strong>Voluntarios:</strong> Posiciones, habilidades, disponibilidad</li>
                  <li>• <strong>Donaciones:</strong> Transacciones, categorías, análisis</li>
                  <li>• <strong>Eventos:</strong> Asistencia, check-ins, logística</li>
                  <li>• <strong>Comunicaciones:</strong> Campañas, engagement, efectividad</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">📈 Datos Analíticos:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Analíticas Generales:</strong> Métricas de crecimiento</li>
                  <li>• <strong>Analíticas IA:</strong> Predicciones y recomendaciones</li>
                  <li>• <strong>Dones Espirituales:</strong> Evaluaciones y desarrollo</li>
                  <li>• <strong>Automatización:</strong> Performance de reglas</li>
                  <li>• <strong>Redes Sociales:</strong> Engagement y alcance</li>
                </ul>
              </div>
            </div>

            <div className="bg-[hsl(var(--info)/0.10)] border border-[hsl(var(--info)/0.3)] rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-[hsl(var(--info))] mb-2">🔐 Datos Sensibles:</h4>
              <p className="text-sm text-[hsl(var(--info))]">
                El sistema automáticamente anonimiza datos personales sensibles según configuración de privacidad. 
                Solo usuarios con permisos adecuados pueden exportar información completa.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Church Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Personalización y Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🎨 Elementos de Branding:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Logo de iglesia:</strong> Automáticamente incluido en header</li>
                  <li>• <strong>Colores corporativos:</strong> Según configuración de tema</li>
                  <li>• <strong>Información de contacto:</strong> Dirección, teléfono, web</li>
                  <li>• <strong>Slogan/visión:</strong> Mensaje distintivo de la iglesia</li>
                  <li>• <strong>Footer personalizado:</strong> Información adicional</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">📋 Metadatos Incluidos:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Fecha de generación:</strong> Timestamp automático</li>
                  <li>• <strong>Usuario generador:</strong> Responsable del reporte</li>
                  <li>• <strong>Rango de datos:</strong> Período o filtros aplicados</li>
                  <li>• <strong>Confidencialidad:</strong> Nivel de privacidad</li>
                  <li>• <strong>Versión del sistema:</strong> Para referencia técnica</li>
                </ul>
              </div>
            </div>

            <div className="bg-[hsl(var(--success)/0.10)] border border-[hsl(var(--success)/0.3)] rounded-lg p-4">
              <h4 className="font-semibold text-[hsl(var(--success))] mb-2">✨ Auto-Configuración:</h4>
              <p className="text-sm text-[hsl(var(--success))]">
                El branding se configura automáticamente desde el perfil de la iglesia. 
                No necesita configurar nada adicional - el sistema usa la información ya guardada.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How to Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Cómo Exportar Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</div>
                  Desde Cualquier Vista de Datos
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Ubicación del Botón:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Esquina superior derecha</strong> en listas y tablas</li>
                      <li>• <strong>Menú de acciones</strong> en vistas detalladas</li>
                      <li>• <strong>Barra de herramientas</strong> en dashboards</li>
                      <li>• <strong>Botón flotante</strong> en reportes complejos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Opciones Disponibles:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Exportar vista actual (con filtros)</li>
                      <li>• Exportar selección marcada</li>
                      <li>• Exportar datos completos</li>
                      <li>• Exportar con rango de fechas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</div>
                  Seleccionar Formato y Opciones
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Formatos:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>PDF Ejecutivo</strong> (recomendado para reportes)</li>
                      <li>• <strong>Excel Avanzado</strong> (para análisis)</li>
                      <li>• <strong>CSV Estructurado</strong> (para integraciones)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Configuraciones:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Incluir/excluir gráficos</li>
                      <li>• Nivel de detalle (resumen vs completo)</li>
                      <li>• Anonimizar datos sensibles</li>
                      <li>• Incluir notas y comentarios</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="bg-[hsl(var(--lavender)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</div>
                  Descarga y Uso
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Proceso de Descarga:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Generación automática:</strong> 2-10 segundos</li>
                      <li>• <strong>Descarga directa:</strong> Sin necesidad de email</li>
                      <li>• <strong>Notificación visual:</strong> Progreso en tiempo real</li>
                      <li>• <strong>Verificación de calidad:</strong> Validación automática</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Post-Descarga:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Archivo listo para usar inmediatamente</li>
                      <li>• Compatible con software estándar</li>
                      <li>• Tamaño optimizado para compartir</li>
                      <li>• Calidad profesional garantizada</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Performance and Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Rendimiento y Límites
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">⚡ Velocidad:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Hasta 1,000 registros:</strong> &lt;3 segundos</li>
                  <li>• <strong>1,000-10,000 registros:</strong> &lt;10 segundos</li>
                  <li>• <strong>10,000+ registros:</strong> &lt;30 segundos</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">📏 Límites:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Máximo por export:</strong> 50,000 registros</li>
                  <li>• <strong>Tamaño de archivo:</strong> &lt;50MB</li>
                  <li>• <strong>Exports por día:</strong> Sin límite</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🎯 Optimización:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Caching inteligente:</strong> Datos pre-procesados</li>
                  <li>• <strong>Compresión automática:</strong> Archivos más pequeños</li>
                  <li>• <strong>Generación asíncrona:</strong> No bloquea interfaz</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Casos de Uso Comunes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-[hsl(var(--success))]">🏛️ Uso Administrativo:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Reportes de junta:</strong> PDF ejecutivo con métricas clave</li>
                  <li>• <strong>Informes ministeriales:</strong> Performance por departamento</li>
                  <li>• <strong>Análisis presupuestario:</strong> Excel con gráficos financieros</li>
                  <li>• <strong>Planificación estratégica:</strong> Datos para toma de decisiones</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-[hsl(var(--info))]">⚙️ Uso Técnico:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Migración de datos:</strong> CSV para otros sistemas</li>
                  <li>• <strong>Backup selectivo:</strong> Respaldo de información crítica</li>
                  <li>• <strong>Auditorías:</strong> Datos para revisiones externas</li>
                  <li>• <strong>Integración:</strong> Alimentar herramientas de BI</li>
                </ul>
              </div>
            </div>

            <div className="bg-[hsl(var(--warning)/0.10)] border border-[hsl(var(--warning)/0.3)] rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-[hsl(var(--warning))] mb-2">💡 Sugerencia Pro:</h4>
              <p className="text-sm text-[hsl(var(--warning))]">
                Para reportes recurrentes (mensuales, trimestrales), considere configurar automatización 
                que envíe exportes por email en fechas específicas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}