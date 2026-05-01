/**
 * Automation Template Management Page
 * Allows church admins to browse, preview, customize, and activate
 * pre-built automation rule templates
 */

import { Suspense } from 'react';
import { TemplateBrowser } from '@/components/automation-rules/template-browser';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';

export const metadata = {
  title: 'Plantillas de Automatización | Khesed-tek',
  description: 'Explora y activa plantillas de reglas de automatización prediseñadas para tu iglesia'
};

function TemplateManagerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-9 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function TemplateManagementPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Plantillas de Automatización
          </h1>
          <p className="text-muted-foreground">
            Activa reglas de automatización prediseñadas para optimizar el seguimiento de
            peticiones de oración, visitantes, y más. Personaliza cada plantilla según las
            necesidades de tu iglesia.
          </p>
        </div>

        {/* Template Browser */}
        <Suspense fallback={<TemplateManagerSkeleton />}>
          <TemplateBrowser />
        </Suspense>

        {/* Info Footer */}
        <Card className="p-6 bg-muted/50">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              ¿Cómo funcionan las plantillas?
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">1. Explora</p>
                <p className="text-muted-foreground">
                  Navega por las plantillas disponibles organizadas por categorías
                  (Peticiones de Oración, Seguimiento de Visitantes, etc.)
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">2. Personaliza</p>
                <p className="text-muted-foreground">
                  Ajusta el nombre, prioridad, horarios, y configuración de cada
                  plantilla según tu iglesia
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">3. Activa</p>
                <p className="text-muted-foreground">
                  Con un clic, la regla de automatización se activará y comenzará a
                  procesar eventos automáticamente
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
