"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import toast from "react-hot-toast";

interface ConversionPattern {
  pattern: string;
  impact: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  affectedCount: number;
  recommendation: string;
}

interface ConversionReport {
  id: string;
  reportMonth: string;
  totalVisitors: number;
  returnedVisitors: number;
  retentionRate: number;
  patterns: ConversionPattern[];
  narrative: string;
}

interface Props {
  initialReport: ConversionReport | null;
}

const IMPACT_ICON = {
  POSITIVE: <TrendingUp className="h-4 w-4 text-green-600" />,
  NEGATIVE: <TrendingDown className="h-4 w-4 text-red-500" />,
  NEUTRAL: <Minus className="h-4 w-4 text-gray-400" />,
};

const IMPACT_LABEL = {
  POSITIVE: "Positivo",
  NEGATIVE: "Negativo",
  NEUTRAL: "Neutral",
};

export function VisitorConversionWidget({ initialReport }: Props) {
  const [report, setReport] = useState(initialReport);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/visitors/conversion-report");
      const data = await res.json();
      setReport(data.report ?? null);
      toast.success("Informe actualizado");
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  const generate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/visitors/conversion-report", {
        method: "POST",
      });
      const data = await res.json();
      setReport(data.report ?? null);
      toast.success("Informe generado");
    } catch {
      toast.error("Error al generar informe");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          Inteligencia de Conversión de Visitantes
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generando..." : "Generar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!report ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay informe disponible. Haz clic en &quot;Generar&quot; para
            crear el análisis.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-muted rounded-lg p-2">
                <p className="text-lg font-bold">{report.totalVisitors}</p>
                <p className="text-xs text-muted-foreground">Visitantes</p>
              </div>
              <div className="bg-muted rounded-lg p-2">
                <p className="text-lg font-bold">{report.returnedVisitors}</p>
                <p className="text-xs text-muted-foreground">Regresaron</p>
              </div>
              <div className="bg-muted rounded-lg p-2">
                <p className="text-lg font-bold">{report.retentionRate}%</p>
                <p className="text-xs text-muted-foreground">Retención</p>
              </div>
            </div>

            {/* Narrative */}
            {report.narrative && (
              <p className="text-sm text-muted-foreground italic">
                {report.narrative}
              </p>
            )}

            {/* Patterns */}
            {report.patterns && report.patterns.length > 0 && (
              <ul className="space-y-2">
                {report.patterns.map((p, i) => (
                  <li key={i} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {IMPACT_ICON[p.impact]}
                      <span className="text-sm font-medium">{p.pattern}</span>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {IMPACT_LABEL[p.impact]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {p.recommendation}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
