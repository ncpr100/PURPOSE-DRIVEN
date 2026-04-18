"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Brain,
  Eye,
  Globe,
  Heart,
  HelpCircle,
  Loader2,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AntiphonyAnalysis {
  culturalMirror: string | null;
  skepticFilter: string | null;
  unresolvedTension: string | null;
  comfortSentence: string | null;
  discomfortSentence: string | null;
  generatedAt?: string;
}

interface Props {
  sermonId: string;
  existingAnalysis?: AntiphonyAnalysis | null;
  onTensionGenerated?: (tension: string) => void;
  canAnalyze?: boolean;
}

export function AntiphonyAnalysisTab({
  sermonId,
  existingAnalysis,
  onTensionGenerated,
  canAnalyze = true,
}: Props) {
  const [analysis, setAnalysis] = useState<AntiphonyAnalysis | null>(
    existingAnalysis || null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = async () => {
    if (!canAnalyze) {
      toast.error("Solo los pastores pueden ejecutar este análisis.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/sermons/${sermonId}/antiphony-analysis`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al analizar el sermón");
      setAnalysis(data.analysis);
      toast.success("Análisis completado");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendToSmallGroups = () => {
    if (analysis?.unresolvedTension && onTensionGenerated) {
      onTensionGenerated(analysis.unresolvedTension);
      toast.success("Pregunta enviada al módulo de grupos pequeños");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Análisis ministerial</h3>
          <p className="text-sm text-muted-foreground">
            IA como espejo cultural y teológico, no como predicador
          </p>
        </div>
        <Button onClick={runAnalysis} disabled={isLoading || !canAnalyze}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              {analysis ? "Revisar análisis" : "Analizar sermón"}
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.10)] p-3 text-sm text-amber-800">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-[hsl(var(--warning))]" />
          <span>
            Generado por IA como apoyo ministerial. La decisión pastoral final
            pertenece al pastor.
          </span>
        </div>
      </div>

      {analysis && (
        <div className="grid gap-4">
          <Card className="border-[hsl(var(--success)/0.3)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Heart className="h-4 w-4 text-[hsl(var(--success))]" />
                Frase de consuelo
                <Badge variant="outline" className="border-[hsl(var(--success)/0.4)] text-[hsl(var(--success))]">
                  Para redes sociales
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-4 border-[hsl(var(--success)/0.30)] pl-4 text-sm italic">
                “{analysis.comfortSentence || "No disponible"}”
              </blockquote>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--warning)/0.3)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-[hsl(var(--warning))]" />
                Frase de incomodidad profética
                <Badge variant="outline" className="border-[hsl(var(--warning)/0.30)] text-[hsl(var(--warning))]">
                  Para reflexión
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-4 border-[hsl(var(--warning)/0.30)] pl-4 text-sm italic">
                “{analysis.discomfortSentence || "No disponible"}”
              </blockquote>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-[hsl(var(--info))]" />
                Espejo cultural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{analysis.culturalMirror || "No disponible"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-[hsl(var(--lavender))]" />
                Filtro del escéptico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{analysis.skepticFilter || "No disponible"}</p>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--info)/0.3)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <HelpCircle className="h-4 w-4 text-[hsl(var(--info))]" />
                Tensión no resuelta
                <Badge variant="outline" className="border-[hsl(var(--info)/0.4)] text-[hsl(var(--info))]">
                  Para grupos pequeños
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm font-medium">
                {analysis.unresolvedTension || "No disponible"}
              </p>
              {onTensionGenerated && (
                <Button size="sm" variant="outline" onClick={sendToSmallGroups}>
                  Enviar a grupos pequeños
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!analysis && !isLoading && (
        <div className="py-12 text-center text-muted-foreground">
          <Brain className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p>Haga clic en analizar sermón para iniciar el análisis ministerial.</p>
          <p className="mt-1 text-xs">
            Requiere transcripción o contenido completo del sermón.
          </p>
        </div>
      )}
    </div>
  );
}
