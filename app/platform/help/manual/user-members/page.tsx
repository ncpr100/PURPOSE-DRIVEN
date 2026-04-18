

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, BookOpen, Shield, Database, Users, Upload, Download, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function UserMembersManual() {
  return (
    <div className="container mx-auto p-6">
      <Link href="/platform/help">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Centro de Ayuda
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manual: Gestión de Miembros (SUPER ADMIN)</h1>
          <p className="text-muted-foreground">Administración global de datos de miembros y migración entre sistemas</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>🏢 Sistema de Importación de Miembros - Perspectiva SUPER ADMIN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Sistema Implementado y Operacional</AlertTitle>
              <AlertDescription>
                El sistema de importación de miembros está completamente implementado y disponible para todas las iglesias registradas. 
                Soporta migración desde cualquier plataforma de gestión eclesiástica existente.
              </AlertDescription>
            </Alert>
            
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-[hsl(var(--info)/0.10)] rounded-lg">
                <h4 className="font-semibold">🏛️ Iglesias</h4>
                <p className="text-xl font-bold text-[hsl(var(--info))]">100%</p>
                <p className="text-xs text-muted-foreground">Con acceso al sistema</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--success)/0.10)] rounded-lg">
                <h4 className="font-semibold">📊 Formatos</h4>
                <p className="text-xl font-bold text-[hsl(var(--success))]">3</p>
                <p className="text-xs text-muted-foreground">Excel, CSV, Direct</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--lavender)/0.10)] rounded-lg">
                <h4 className="font-semibold">🤖 Auto-Map</h4>
                <p className="text-xl font-bold text-[hsl(var(--lavender))]">25+</p>
                <p className="text-xs text-muted-foreground">Campos reconocidos</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--warning)/0.10)] rounded-lg">
                <h4 className="font-semibold">⚡ Límites</h4>
                <p className="text-xl font-bold text-[hsl(var(--warning))]">1K</p>
                <p className="text-xs text-muted-foreground">Registros por lote</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-muted/300 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">🔧</span>
              Arquitectura Técnica del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🛠️ Componentes del Sistema</h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>API Endpoint:</strong> <code>/api/members/import</code></p>
                    <p className="text-muted-foreground">Procesamiento backend con validación completa</p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Motor de Mapeo:</strong> Auto-recognition engine</p>
                    <p className="text-muted-foreground">25+ variaciones de campo detectadas automáticamente</p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Procesador XLSX/CSV:</strong> SheetJS integration</p>
                    <p className="text-muted-foreground">Soporte completo Excel 2007+ y CSV UTF-8</p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Validación de Datos:</strong> Multi-layer validation</p>
                    <p className="text-muted-foreground">Email, teléfono, fechas, campos requeridos</p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Detección de Duplicados:</strong> Smart matching</p>
                    <p className="text-muted-foreground">Por email y combinación nombre completo</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">📋 Especificaciones Técnicas</h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-[hsl(var(--info)/0.10)] rounded-lg">
                    <p><strong>Límites del Sistema:</strong></p>
                    <ul className="text-muted-foreground space-y-1 mt-1">
                      <li>• Máximo 1,000 registros por importación</li>
                      <li>• Tamaño máximo de archivo: 10MB</li>
                      <li>• Formatos: .xlsx, .xls, .csv</li>
                      <li>• Codificación: UTF-8 recomendada</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-[hsl(var(--success)/0.10)] rounded-lg">
                    <p><strong>Seguridad y Permisos:</strong></p>
                    <ul className="text-muted-foreground space-y-1 mt-1">
                      <li>• Solo SUPER_ADMIN, ADMIN_IGLESIA, PASTOR</li>
                      <li>• Validación de sesión en cada operación</li>
                      <li>• Datos aislados por churchId</li>
                      <li>• Logging completo de operaciones</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-[hsl(var(--lavender)/0.10)] rounded-lg">
                    <p><strong>Integración con Automatizaciones:</strong></p>
                    <ul className="text-muted-foreground space-y-1 mt-1">
                      <li>• Trigger automático en nuevos miembros</li>
                      <li>• Emails de bienvenida configurables</li>
                      <li>• Asignación automática a ministerios</li>
                      <li>• Notificaciones a líderes de iglesia</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Migration Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Escenarios de Migración por Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🏢 Planning Center Online (PCO)</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Proceso de Exportación:</strong></p>
                  <ol className="ml-4 space-y-1 text-muted-foreground">
                    <li>1. People → Lists → All People</li>
                    <li>2. Filter → Active Members</li>
                    <li>3. Export → CSV (include all fields)</li>
                    <li>4. Download file</li>
                  </ol>
                  <p><strong>Campos Comunes en PCO:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <li>• First Name, Last Name ✅</li>
                    <li>• Email, Phone ✅</li>
                    <li>• Address, City, State, Zip ✅</li>
                    <li>• Birthdate, Anniversary ✅</li>
                    <li>• Status, Membership Date ✅</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">🏛️ ChurchTrac</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Proceso de Exportación:</strong></p>
                  <ol className="ml-4 space-y-1 text-muted-foreground">
                    <li>1. Members → Member List</li>
                    <li>2. Select All → Filter: Active</li>
                    <li>3. Export → Excel Format</li>
                    <li>4. Include all contact fields</li>
                  </ol>
                  <p><strong>Campos Comunes en ChurchTrac:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <li>• FirstName, LastName ✅</li>
                    <li>• EmailAddress, CellPhone ✅</li>
                    <li>• HomeAddress, City, State ✅</li>
                    <li>• Birthday, JoinDate ✅</li>
                    <li>• Gender, MaritalStatus ✅</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">⛪ FellowshipOne</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Proceso de Exportación:</strong></p>
                  <ol className="ml-4 space-y-1 text-muted-foreground">
                    <li>1. People → Advanced Search</li>
                    <li>2. Search All Members</li>
                    <li>3. Export Results → CSV</li>
                    <li>4. Select relevant fields</li>
                  </ol>
                  <p><strong>Consideraciones Especiales:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <li>• Fechas en formato MM/DD/YYYY</li>
                    <li>• Nombres pueden estar combinados</li>
                    <li>• Multiple phone fields</li>
                    <li>• Status codes específicos</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">🎸 Rock RMS</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Proceso de Exportación:</strong></p>
                  <ol className="ml-4 space-y-1 text-muted-foreground">
                    <li>1. Tools → Data Integrity</li>
                    <li>2. Person Duplicate Detection</li>
                    <li>3. Export Validated List</li>
                    <li>4. CSV with standard fields</li>
                  </ol>
                  <p><strong>Campos de Rock RMS:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <li>• NickName, LastName ✅</li>
                    <li>• Email, MobilePhone ✅</li>
                    <li>• ConnectionStatus ✅</li>
                    <li>• BirthDate, AnniversaryDate ✅</li>
                    <li>• Campus, GroupMemberships ✅</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Quality & Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Control de Calidad y Validación de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🔍 Validaciones Automáticas</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-semibold text-sm">Validación de Campos Requeridos</p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      <li>• <strong>firstName:</strong> No puede estar vacío</li>
                      <li>• <strong>lastName:</strong> No puede estar vacío</li>
                      <li>• <strong>email:</strong> Formato válido + único por iglesia</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-semibold text-sm">Validación de Formatos</p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      <li>• <strong>Email:</strong> Regex pattern /^[^\s@]+@[^\s@]+\.[^\s@]+$/</li>
                      <li>• <strong>Teléfono:</strong> Solo números, espacios, guiones, paréntesis</li>
                      <li>• <strong>Fechas:</strong> Auto-parsing con Date() constructor</li>
                      <li>• <strong>Género:</strong> Normalizado a Masculino/Femenino</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-semibold text-sm">Detección de Duplicados</p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      <li>• <strong>Primary Match:</strong> Email address exacto</li>
                      <li>• <strong>Secondary Match:</strong> firstName + lastName</li>
                      <li>• <strong>Scope:</strong> Solo dentro de la misma iglesia</li>
                      <li>• <strong>Action:</strong> Skip o Update según configuración</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">📊 Métricas de Importación</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-[hsl(var(--success)/0.10)] rounded-lg border border-[hsl(var(--success)/0.3)]">
                    <h5 className="font-semibold text-sm mb-2">✅ Importaciones Exitosas</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Registros procesados sin errores</li>
                      <li>• Automatizaciones trigger correctamente</li>
                      <li>• Datos integrados en sistema completo</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-[hsl(var(--info)/0.10)] rounded-lg border border-[hsl(var(--info)/0.3)]">
                    <h5 className="font-semibold text-sm mb-2">🔄 Actualizaciones</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Miembros existentes actualizados</li>
                      <li>• Preservación de datos críticos</li>
                      <li>• Historial de cambios mantenido</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-[hsl(var(--destructive)/0.10)] rounded-lg border border-[hsl(var(--destructive)/0.3)]">
                    <h5 className="font-semibold text-sm mb-2">❌ Fallos y Errores</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Datos inválidos o incompletos</li>
                      <li>• Duplicados sin permiso de actualización</li>
                      <li>• Errores de formato o tipo de archivo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Field Mapping Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--lavender)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Referencia Completa de Mapeo de Campos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>Motor de Mapeo Inteligente</AlertTitle>
              <AlertDescription>
                El sistema reconoce automáticamente variaciones de nombres de campos y los mapea a la estructura de datos de KHESED-TEK.
                No es necesario renombrar columnas manualmente.
              </AlertDescription>
            </Alert>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-semibold mb-2 text-sm">👤 Campos de Identificación</h5>
                <div className="text-xs bg-muted/30 p-3 rounded-lg">
                  <p><strong>firstName:</strong></p>
                  <p className="text-muted-foreground">first name, firstname, first_name, name (si es completo)</p>
                  
                  <p className="mt-2"><strong>lastName:</strong></p>
                  <p className="text-muted-foreground">last name, lastname, last_name, surname</p>
                  
                  <p className="mt-2"><strong>email:</strong></p>
                  <p className="text-muted-foreground">email, email address, e-mail, emailaddress</p>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2 text-sm">📞 Campos de Contacto</h5>
                <div className="text-xs bg-muted/30 p-3 rounded-lg">
                  <p><strong>phone:</strong></p>
                  <p className="text-muted-foreground">phone, phone number, mobile, cell, telephone</p>
                  
                  <p className="mt-2"><strong>address:</strong></p>
                  <p className="text-muted-foreground">address, street address, street, home address</p>
                  
                  <p className="mt-2"><strong>zipCode:</strong></p>
                  <p className="text-muted-foreground">zip, zip code, zipcode, postal code</p>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2 text-sm">📅 Campos de Fecha</h5>
                <div className="text-xs bg-muted/30 p-3 rounded-lg">
                  <p><strong>birthDate:</strong></p>
                  <p className="text-muted-foreground">birth date, birthdate, date of birth, dob</p>
                  
                  <p className="mt-2"><strong>membershipDate:</strong></p>
                  <p className="text-muted-foreground">membership date, join date, start date</p>
                  
                  <p className="mt-2"><strong>baptismDate:</strong></p>
                  <p className="text-muted-foreground">baptism date, baptized, baptism</p>
                </div>
              </div>
            </div>

            <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg border border-[hsl(var(--info)/0.3)]">
              <h5 className="font-semibold mb-2">🤖 Procesamientos Automáticos Especiales</h5>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nombres Completos:</strong></p>
                  <p className="text-muted-foreground">&quot;Juan Carlos Pérez&quot; → firstName: &quot;Juan Carlos&quot;, lastName: &quot;Pérez&quot;</p>
                  
                  <p className="mt-2"><strong>Géneros:</strong></p>
                  <p className="text-muted-foreground">M/Male/H/Hombre → &quot;Masculino&quot;, F/Female/W/Woman → &quot;Femenino&quot;</p>
                </div>
                <div>
                  <p><strong>Fechas Flexibles:</strong></p>
                  <p className="text-muted-foreground">15/05/1985, 1985-05-15, May 15 1985 → 1985-05-15T00:00:00Z</p>
                  
                  <p className="mt-2"><strong>Teléfonos:</strong></p>
                  <p className="text-muted-foreground">(555) 123-4567, 555.123.4567, 5551234567 → Conserva formato original</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--destructive)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Monitoreo y Soporte para Iglesias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🔍 Métricas de Uso del Sistema</h4>
                <div className="space-y-3 text-sm">
                  <p><strong>Acceder a Analytics:</strong></p>
                  <ol className="ml-4 space-y-1 text-muted-foreground">
                    <li>1. Platform Dashboard → Analytics</li>
                    <li>2. Filter: Member Import Operations</li>
                    <li>3. Time Range: Select period</li>
                    <li>4. View detailed breakdown</li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <p><strong>KPIs Importantes:</strong></p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      <li>• Total importaciones por período</li>
                      <li>• Tasa de éxito promedio</li>
                      <li>• Iglesias usando importación</li>
                      <li>• Errores más comunes</li>
                      <li>• Tamaño promedio de lotes</li>
                      <li>• Tiempo promedio de procesamiento</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">🚨 Troubleshooting y Soporte</h4>
                <div className="space-y-3 text-sm">
                  <p><strong>Problemas Comunes:</strong></p>
                  
                  <div className="p-3 bg-[hsl(var(--destructive)/0.10)] rounded-lg border border-[hsl(var(--destructive)/0.3)]">
                    <p><strong>Error: &quot;Archivo muy grande&quot;</strong></p>
                    <p className="text-muted-foreground">Solución: Dividir en lotes de máximo 1000 registros</p>
                  </div>
                  
                  <div className="p-3 bg-[hsl(var(--warning)/0.10)] rounded-lg border border-[hsl(var(--warning)/0.3)]">
                    <p><strong>Error: &quot;Muchos duplicados&quot;</strong></p>
                    <p className="text-muted-foreground">Solución: Activar &quot;Actualizar existentes&quot; o limpiar datos</p>
                  </div>
                  
                  <div className="p-3 bg-[hsl(var(--info)/0.10)] rounded-lg border border-[hsl(var(--info)/0.3)]">
                    <p><strong>Error: &quot;Campos no reconocidos&quot;</strong></p>
                    <p className="text-muted-foreground">Solución: Usar plantilla o mapear manualmente</p>
                  </div>
                  
                  <div className="mt-4 p-3 bg-[hsl(var(--success)/0.10)] rounded-lg border border-[hsl(var(--success)/0.3)]">
                    <p><strong>💡 Escalación a Soporte:</strong></p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                      <li>• Migraciones de +5000 miembros</li>
                      <li>• Sistemas no estándar</li>
                      <li>• Campos custom complejos</li>
                      <li>• Integraciones especiales requeridas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Administration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--warning)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
              Administración de Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">⚙️ Configuraciones del Sistema</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Límites Configurables:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <li>• Máximo registros por importación: 1000 (configurable)</li>
                    <li>• Tamaño máximo archivo: 10MB (configurable)</li>
                    <li>• Rate limiting: 1 importación por minuto por iglesia</li>
                    <li>• Timeout processing: 5 minutos máximo</li>
                  </ul>
                  
                  <p className="mt-3"><strong>Configuración de Automatizaciones:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <li>• Email de bienvenida automático</li>
                    <li>• Asignación a ministerios por defecto</li>
                    <li>• Notificaciones a líderes de iglesia</li>
                    <li>• Triggers de automatización personalizada</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">📋 Logging y Auditoría</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Logs Automáticos:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <li>• Timestamp de cada importación</li>
                    <li>• Usuario que ejecutó la importación</li>
                    <li>• Resultados detallados (éxito/fallo)</li>
                    <li>• Errores específicos por registro</li>
                    <li>• Performance metrics (tiempo procesamiento)</li>
                  </ul>
                  
                  <p className="mt-3"><strong>Acceso a Logs:</strong></p>
                  <ol className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <li>1. Platform → Churches → [Select Church]</li>
                    <li>2. Tabs → Member Operations</li>
                    <li>3. Import History → View Details</li>
                    <li>4. Export logs if needed</li>
                  </ol>
                  
                  <div className="mt-3 p-2 bg-[hsl(var(--warning)/0.10)] rounded border border-[hsl(var(--warning)/0.3)]">
                    <p className="text-xs"><strong>🔒 Privacidad:</strong> Los logs están aislados por iglesia y solo son accesibles por SUPER_ADMIN y la iglesia propietaria.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices for Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary/[0.06]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
              Mejores Prácticas para Soporte a Iglesias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🤝 Protocolo de Migración Asistida</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Para iglesias con +1000 miembros:</strong></p>
                  <ol className="ml-4 space-y-1 text-muted-foreground">
                    <li>1. Coordinar horario de migración</li>
                    <li>2. Backup completo previo</li>
                    <li>3. Revisión de datos pre-importación</li>
                    <li>4. Importación supervisada</li>
                    <li>5. Validación post-importación</li>
                    <li>6. Configuración de automatizaciones</li>
                  </ol>
                  
                  <div className="mt-3 p-3 bg-[hsl(var(--info)/0.10)] rounded-lg border border-[hsl(var(--info)/0.3)]">
                    <p><strong>🎯 SLA de Migración:</strong></p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                      <li>• Iglesias pequeñas (&lt;500): 2-4 horas</li>
                      <li>• Iglesias medianas (500-2000): 1 día</li>
                      <li>• Iglesias grandes (+2000): 2-3 días</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">📞 Escalación y Soporte Especializado</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Casos para Escalación:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Sistemas de iglesia no estándar</li>
                    <li>• Campos custom complejos</li>
                    <li>• Integraciones con bases de datos externas</li>
                    <li>• Migraciones time-sensitive</li>
                    <li>• Errores de data corruption</li>
                  </ul>
                  
                  <div className="mt-3 p-3 bg-[hsl(var(--success)/0.10)] rounded-lg border border-[hsl(var(--success)/0.3)]">
                    <p><strong>📋 Checklist Pre-Migración:</strong></p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                      <li>☑️ Backup de datos actual</li>
                      <li>☑️ Validar acceso de administrador</li>
                      <li>☑️ Confirmar format compliance</li>
                      <li>☑️ Test con muestra pequeña</li>
                      <li>☑️ Plan de rollback definido</li>
                      <li>☑️ Ventana de mantenimiento coordinada</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Referencia Rápida para SUPER ADMIN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🔧 Comandos de Diagnóstico</h4>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• <code>GET /api/members?churchId=X</code> - Listar miembros</li>
                  <li>• <code>POST /api/members/import</code> - Procesar importación</li>
                  <li>• <code>GET /api/platform/churches/[id]/stats</code> - Stats iglesia</li>
                  <li>• Database query: <code>SELECT COUNT(*) FROM members WHERE churchId=&apos;X&apos;</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Métricas Clave</h4>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• <strong>Éxito Rate:</strong> Target &gt;95%</li>
                  <li>• <strong>Processing Time:</strong> &lt;30 seg per 100 records</li>
                  <li>• <strong>Error Rate:</strong> &lt;5% acceptable</li>
                  <li>• <strong>Duplicate Rate:</strong> Varía por iglesia</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🚨 Alertas Críticas</h4>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• <strong>High Error Rate:</strong> &gt;20% fallos</li>
                  <li>• <strong>Large Import:</strong> &gt;500 registros</li>
                  <li>• <strong>Duplicate Overload:</strong> &gt;50% duplicados</li>
                  <li>• <strong>System Timeout:</strong> Procesamiento &gt;5 min</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

