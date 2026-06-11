"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, BookOpen, Sparkles } from "lucide-react";

import BibleVersionComparison from "@/components/sermons/bible-version-comparison";
import { AntiphonyAnalysisTab } from "@/components/sermons/antiphony-analysis-tab";

export default function SermonWorkspacePage() {
  const params = useParams();
  const sermonId = params.id as string;

  const [activeTab, setActiveTab] = useState<"editor" | "bible" | "analysis">(
    "editor",
  );

  const [title, setTitle] = useState("");
  const [scripture, setScripture] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [existingAnalysis, setExistingAnalysis] = useState<any>(null);

  useEffect(() => {
    const loadSermon = async () => {
      try {
        const res = await fetch(`/api/sermons/${sermonId}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title || "");
          setScripture(data.scripture || "");
          setContent(data.content || "");
          setExistingAnalysis(data.aiAnalysis || null);
        }
      } catch (err) {
        console.error("Error cargando sermón:", err);
        setTitle("Sermón de Prueba");
        setScripture("Juan 3:16");
      }
    };
    if (sermonId) loadSermon();
  }, [sermonId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/sermons/${sermonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, scripture, content }),
      });
    } catch (err) {
      console.error("Error guardando:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Espacio de Trabajo: Sermón
          </h1>
          <p className="text-muted-foreground text-sm">
            Prepara, compara y analiza tu mensaje con IA.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Guardar Cambios
        </Button>
      </div>

      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("editor")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "editor"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" /> Editor
        </button>
        <button
          onClick={() => setActiveTab("bible")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "bible"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4 inline mr-2" /> Comparador Bíblico
        </button>
        <button
          onClick={() => setActiveTab("analysis")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "analysis"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4 inline mr-2" /> Análisis IA (Agente 1)
        </button>
      </div>

      <div className="min-h-[500px]">
        {activeTab === "editor" && (
          <Card className="bg-card border-border">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title" className="text-foreground">
                    Título del Sermón
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: La Gracia en Tiempos Difíciles"
                    className="bg-background text-foreground border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scripture" className="text-foreground">
                    Texto Base
                  </Label>
                  <Input
                    id="scripture"
                    value={scripture}
                    onChange={(e) => setScripture(e.target.value)}
                    placeholder="Ej: Juan 3:16"
                    className="bg-background text-foreground border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-foreground">
                  Borrador / Notas del Sermón
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe o pega tu bosquejo aquí..."
                  className="min-h-[400px] bg-background text-foreground border-border font-mono text-sm leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "bible" && (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <BibleVersionComparison />
            </CardContent>
          </Card>
        )}

        {activeTab === "analysis" && (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <AntiphonyAnalysisTab
                sermonId={sermonId}
                existingAnalysis={existingAnalysis}
                canAnalyze={!!title && !!scripture}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
