"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Loader2, Sparkles, Globe } from "lucide-react";
import { toast } from "sonner";

// LISTA EXACTA DE VERSIONES PROPORCIONADA
const BIBLE_VERSIONS = [
  // ESPAÑOL
  { id: "nvi", name: "NVI (Nueva Versión Internacional)", language: "Español" },
  { id: "ntv", name: "NTV (Nueva Traducción Viviente)", language: "Español" },
  {
    id: "nbla",
    name: "NBLA (Nueva Biblia de las Américas)",
    language: "Español",
  },
  {
    id: "nbl",
    name: "NBL (Nueva Biblia Latinoamericana)",
    language: "Español",
  },

  // INGLÉS
  { id: "kjv", name: "KJV (King James Version)", language: "Inglés" },
  { id: "nlt", name: "NLT (New Living Translation)", language: "Inglés" },
  { id: "msg", name: "MSG (The Message)", language: "Inglés" },
  { id: "amp", name: "AMP (Amplified Bible)", language: "Inglés" },

  // PORTUGUÉS
  {
    id: "ptnvi",
    name: "PTNVI (Nova Versão Internacional)",
    language: "Portugués",
  },
  {
    id: "nvt",
    name: "NVT (Nova Versão Transformadora)",
    language: "Portugués",
  },
  { id: "blt", name: "BLT (Bíblia Livre para Todos)", language: "Portugués" },
  { id: "onbv", name: "ONBV", language: "Portugués" },
];

interface VerseResult {
  version: string;
  versionName: string;
  language: string;
  reference: string;
  text: string;
}

export default function BibleVersionComparison() {
  const [searchReference, setSearchReference] = useState("");
  // Por defecto, seleccionamos NVI (Español) y KJV (Inglés) para comparación inicial
  const [selectedVersions, setSelectedVersions] = useState<string[]>([
    "nvi",
    "kjv",
  ]);
  const [results, setResults] = useState<VerseResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchReference.trim()) {
      toast.error("Ingresa una referencia bíblica (ej: Juan 3:16)");
      return;
    }

    if (selectedVersions.length === 0) {
      toast.error("Selecciona al menos una versión bíblica");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const formattedRef = searchReference.replace(/\s+/g, "+");

      const promises = selectedVersions.map(async (versionId) => {
        const version = BIBLE_VERSIONS.find((v) => v.id === versionId);
        if (!version) return null;

        try {
          // Intentamos con bible-api.com primero (soporta nvi, ntv, kjv, nlt, etc.)
          let response = await fetch(
            `https://bible-api.com/${formattedRef}?translation=${versionId}`,
          );

          // Si no es 200, intentamos con getbible.net como respaldo
          if (!response.ok) {
            response = await fetch(
              `https://getbible.net/v2/${formattedRef}/${versionId}`,
            );
          }

          if (!response.ok) {
            throw new Error("No encontrado en esta versión");
          }

          const data = await response.json();

          return {
            version: versionId,
            versionName: version.name,
            language: version.language,
            reference: data.reference || searchReference,
            text:
              data.text ||
              data.passages?.[0] ||
              "Texto no disponible para esta referencia.",
          };
        } catch (err) {
          return {
            version: versionId,
            versionName: version.name,
            language: version.language,
            reference: searchReference,
            text: `⚠️ No se encontró "${searchReference}" en ${version.name}. Verifica la referencia.`,
          };
        }
      });

      const fetchedResults = await Promise.all(promises);
      const validResults = fetchedResults.filter(
        (r): r is VerseResult => r !== null,
      );

      setResults(validResults);

      const successCount = validResults.filter(
        (r) => !r.text.includes("⚠️"),
      ).length;
      if (successCount > 0) {
        toast.success(`Comparación obtenida en ${successCount} versión(es)`);
      } else {
        toast.warning(
          "No se encontró la referencia en las versiones seleccionadas",
        );
      }
    } catch (error) {
      console.error("Error en búsqueda bíblica:", error);
      toast.error("Error de conexión con el servicio bíblico");
    } finally {
      setLoading(false);
    }
  };

  const toggleVersion = (versionId: string) => {
    setSelectedVersions((prev) =>
      prev.includes(versionId)
        ? prev.filter((v) => v !== versionId)
        : [...prev, versionId],
    );
  };

  // Agrupar versiones por idioma para la UI
  const versionsByLanguage = BIBLE_VERSIONS.reduce(
    (acc, version) => {
      if (!acc[version.language]) {
        acc[version.language] = [];
      }
      acc[version.language].push(version);
      return acc;
    },
    {} as Record<string, typeof BIBLE_VERSIONS>,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Comparador de Versiones Bíblicas
          </CardTitle>
          <CardDescription>
            Compara versículos en {BIBLE_VERSIONS.length} traducciones
            específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Búsqueda */}
          <div className="space-y-2">
            <Label htmlFor="reference">Referencia Bíblica</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reference"
                  placeholder="Ej: Juan 3:16, Romanos 8:28, Salmos 23:1"
                  value={searchReference}
                  onChange={(e) => setSearchReference(e.target.value)}
                  className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || selectedVersions.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Comparar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Selección de Versiones por Idioma */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Versiones a Comparar ({selectedVersions.length} seleccionadas)
            </Label>

            {Object.entries(versionsByLanguage).map(([language, versions]) => (
              <div key={language} className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {language}
                </p>
                <div className="flex flex-wrap gap-2">
                  {versions.map((version) => (
                    <Badge
                      key={version.id}
                      variant={
                        selectedVersions.includes(version.id)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1"
                      onClick={() => toggleVersion(version.id)}
                    >
                      {version.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Resultados */}
          {results.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Resultados de la Comparación
              </h3>
              <div className="grid gap-4">
                {results.map((result, idx) => (
                  <Card
                    key={idx}
                    className={`border-l-4 ${result.text.includes("⚠️") ? "border-l-yellow-500" : "border-l-primary"}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {result.versionName}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {result.language}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm font-medium">
                        {result.reference}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {result.text}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Nota de APIs */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-medium mb-2 text-sm">🔌 Fuentes de Datos</h4>
            <p className="text-xs text-muted-foreground">
              Este comparador utiliza APIs bíblicas públicas y gratuitas
              (bible-api.com y getbible.net) para obtener las traducciones
              exactas solicitadas. Si una versión no está disponible en la API
              primaria, se intenta automáticamente en la secundaria.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
