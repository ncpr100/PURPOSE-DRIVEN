"use client";

import { useState, useEffect } from "react";
import { Sparkles, AlertTriangle, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AntiphonyAnalysisTabProps {
  sermonId: string;
  existingAnalysis?: any;
  onTensionGenerated?: (data: any) => void;
  canAnalyze?: boolean;
}

export function AntiphonyAnalysisTab({
  sermonId,
  existingAnalysis,
  onTensionGenerated,
  canAnalyze = true,
}: AntiphonyAnalysisTabProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(existingAnalysis || null);
  const [error, setError] = useState("");

  // Si cambia el existingAnalysis desde el padre, actualizamos el estado
  useEffect(() => {
    if (existingAnalysis) {
      setAnalysis(existingAnalysis);
    }
  }, [existingAnalysis]);

  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const res = await fetch(`/api/sermons/${sermonId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAnalysis(data.analysis);
        if (onTensionGenerated) {
          onTensionGenerated(data.analysis);
        }
      } else {
        setError(data.error || "Error al analizar el sermón");
      }
    } catch (err) {
      console.error("Error en análisis:", err);
      setError("Error de red al conectar con el Motor Antifonal");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!analysis && !isAnalyzing) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6 pb-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Motor Antifonal (Agente 1)
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Analiza tu sermón para detectar puntos ciegos culturales,
              tensiones doctrinales y recomendaciones de aplicación para el
              contexto latinoamericano.
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </p>
          )}
          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Analizando con
                IA...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" /> Analizar Sermón
              </>
            )}
          </Button>
          {!canAnalyze && (
            <p className="text-xs text-muted-foreground">
              Guarda el título y el texto base del sermón antes de analizar.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-12 pb-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground font-medium">
            El Motor Antifonal está analizando tu mensaje...
          </p>
          <p className="text-sm text-muted-foreground">
            Esto puede tomar unos 10-15 segundos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Puntos Ciegos Culturales */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
            <AlertTriangle className="h-5 w-5" />
            Puntos Ciegos Culturales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis?.culturalBlindSpots?.length > 0 ? (
            <ul className="space-y-2">
              {analysis.culturalBlindSpots.map((spot: string, idx: number) => (
                <li
                  key={idx}
                  className="text-sm text-yellow-800 dark:text-yellow-200 flex gap-2 items-start"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400 flex-shrink-0" />
                  {spot}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              No se detectaron puntos ciegos culturales significativos.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tensiones Doctrinales */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-orange-900 dark:text-orange-100">
            <AlertTriangle className="h-5 w-5" />
            Tensiones Doctrinales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis?.doctrinalTensions?.length > 0 ? (
            <ul className="space-y-2">
              {analysis.doctrinalTensions.map(
                (tension: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-orange-800 dark:text-orange-200 flex gap-2 items-start"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-600 dark:bg-orange-400 flex-shrink-0" />
                    {tension}
                  </li>
                ),
              )}
            </ul>
          ) : (
            <p className="text-sm text-orange-800 dark:text-orange-200">
              No se detectaron tensiones doctrinales.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recomendaciones de Aplicación */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-green-900 dark:text-green-100">
            <Lightbulb className="h-5 w-5" />
            Recomendaciones de Aplicación
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis?.applicationSuggestions?.length > 0 ? (
            <ul className="space-y-2">
              {analysis.applicationSuggestions.map(
                (suggestion: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-green-800 dark:text-green-200 flex gap-2 items-start"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400 flex-shrink-0" />
                    {suggestion}
                  </li>
                ),
              )}
            </ul>
          ) : (
            <p className="text-sm text-green-800 dark:text-green-200">
              No hay recomendaciones adicionales.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setAnalysis(null)}
          className="border-border text-muted-foreground hover:text-foreground"
        >
          Analizar de nuevo
        </Button>
      </div>
    </div>
  );
}
