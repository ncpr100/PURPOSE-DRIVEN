"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

interface BoardReport {
  id: string;
  reportMonth: string;
  narrative: string;
  actionItems: string;
  attendanceDelta: number;
  newMembers: number;
  retentionRate: number;
  generatedAt: string;
}

interface Props {
  initialReport: BoardReport | null;
}

export function BoardReportWidget({ initialReport }: Props) {
  const [report, setReport] = useState(initialReport);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFullNarrative, setShowFullNarrative] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/reports/board-report");
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
      const res = await fetch("/api/reports/board-report", { method: "POST" });
      const data = await res.json();
      setReport(data.report ?? null);
      toast.success("Informe de junta generado");
    } catch {
      toast.error("Error al generar informe");
    } finally {
      setIsGenerating(false);
    }
  };

  const parsedActionItems: string[] = report?.actionItems
    ? (() => {
        try {
          return JSON.parse(report.actionItems);
        } catch {
          return [];
        }
      })()
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-500" />
          Informe de Junta Directiva
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
            No hay informe para este mes. Haz clic en &quot;Generar&quot; para
            crear el análisis.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Month & key metrics */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Período:{" "}
                <span className="font-medium text-foreground">
                  {report.reportMonth}
                </span>
              </span>
              <span>
                Generado:{" "}
                <span className="font-medium text-foreground">
                  {new Date(report.generatedAt).toLocaleDateString("es-CO")}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-muted rounded-lg p-2">
                <p
                  className={`text-lg font-bold ${report.attendanceDelta >= 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {report.attendanceDelta >= 0 ? "+" : ""}
                  {report.attendanceDelta}%
                </p>
                <p className="text-xs text-muted-foreground">Asistencia</p>
              </div>
              <div className="bg-muted rounded-lg p-2">
                <p className="text-lg font-bold">{report.newMembers}</p>
                <p className="text-xs text-muted-foreground">Nuevos</p>
              </div>
              <div className="bg-muted rounded-lg p-2">
                <p className="text-lg font-bold">{report.retentionRate}%</p>
                <p className="text-xs text-muted-foreground">Retención</p>
              </div>
            </div>

            {/* Narrative with expand/collapse */}
            {report.narrative && (
              <div>
                <p
                  className={`text-sm text-muted-foreground ${!showFullNarrative ? "line-clamp-3" : ""}`}
                >
                  {report.narrative}
                </p>
                <button
                  className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1"
                  onClick={() => setShowFullNarrative(!showFullNarrative)}
                >
                  {showFullNarrative ? (
                    <>
                      Leer menos <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Leer completo <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Action items */}
            {parsedActionItems.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">
                  Elementos de acción:
                </p>
                <ul className="space-y-1">
                  {parsedActionItems.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      → {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-muted-foreground italic border-t pt-2">
              ⚠️ Generado por IA como apoyo ministerial. La decisión pastoral
              pertenece al pastor.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
