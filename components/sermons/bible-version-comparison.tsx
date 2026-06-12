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
import {
  Search,
  BookOpen,
  Loader2,
  Sparkles,
  Globe,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// Mapeo de versiones a los Bible IDs oficiales de api.bible (Scripture API)
// Nota: Si algún ID específico de tu cuenta difiere, ajústalo aquí.
const BIBLE_VERSIONS = [
  // ESPAÑOL
  {
    id: "nvi",
    name: "NVI (Nueva Versión Internacional)",
    language: "Español",
    bibleId: "56812621317b4f5f",
  },
  {
    id: "ntv",
    name: "NTV (Nueva Traducción Viviente)",
    language: "Español",
    bibleId: "9879cbfb0672252b",
  },
  {
    id: "nbla",
    name: "NBLA (Nueva Biblia de las Américas)",
    language: "Español",
    bibleId: "a071128576248251",
  },
  {
    id: "nbl",
    name: "NBL (Nueva Biblia Latinoamericana)",
    language: "Español",
    bibleId: "e920b9c5e7355d53",
  },

  // INGLÉS
  {
    id: "kjv",
    name: "KJV (King James Version)",
    language: "Inglés",
    bibleId: "de4e12af7f28f599-02",
  },
  {
    id: "nlt",
    name: "NLT (New Living Translation)",
    language: "Inglés",
    bibleId: "04622b7e07722287",
  },
  {
    id: "msg",
    name: "MSG (The Message)",
    language: "Inglés",
    bibleId: "020618793a0ae55f",
  },
  {
    id: "amp",
    name: "AMP (Amplified Bible)",
    language: "Inglés",
    bibleId: "06125adad2d5898a-01",
  },

  // PORTUGUÉS
  {
    id: "ptnvi",
    name: "PTNVI (Nova Versão Internacional)",
    language: "Portugués",
    bibleId: "196536e97e60040e",
  },
  {
    id: "nvt",
    name: "NVT (Nova Versão Transformadora)",
    language: "Portugués",
    bibleId: "0860537162447a48",
  },
  {
    id: "blt",
    name: "BLT (Bíblia Livre para Todos)",
    language: "Portugués",
    bibleId: "2050104141673356",
  },
  {
    id: "onbv",
    name: "ONBV",
    language: "Portugués",
    bibleId: "9c01e7f7b6b4f2e8",
  }, // ID placeholder, verificar en dashboard
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
  const [selectedVersions, setSelectedVersions] = useState<string[]>([
    "nvi",
    "kjv",
  ]);
  const [results, setResults] = useState<VerseResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchReference.trim()) {
      toast.error(
        "Ingresa una referencia bíblica (ej: Juan 3:16 o 1 Corintios 15:22)",
      );
      return;
    }

    if (selectedVersions.length === 0) {
      toast.error("Selecciona al menos una versión bíblica");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_API_BIBLE_KEY;
    if (!apiKey) {
      toast.error("Falta la clave de API de Bible (NEXT_PUBLIC_API_BIBLE_KEY)");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      // api.bible requiere formato específico, ej: "1CO.15.22" o "JHN.3.16"
      // Intentamos pasar la referencia tal cual, la API de passages suele aceptar formatos comunes
      const passageId = searchReference.trim();

      const promises = selectedVersions.map(async (versionId) => {
        const version = BIBLE_VERSIONS.find((v) => v.id === versionId);
        if (!version) return null;

        try {
          const url = `https://api.scripture.api.bible/v1/bibles/${version.bibleId}/passages/${passageId}?content-type=text`;

          const response = await fetch(url, {
            headers: {
              "api-key": apiKey,
            },
          });

          if (!response.ok) {
            throw new Error(`API respondió con ${response.status}`);
          }

          const data = await response.json();

          // La estructura de respuesta de api.bible para passages es data.data.content
          const text =
            data.data?.content || "Texto no disponible para esta referencia.";

          return {
            version: versionId,
            versionName: version.name,
            language: version.language,
            reference: data.data?.reference || searchReference,
            text: text,
          };
        } catch (err) {
          return {
            version: versionId,
            versionName: version.name,
            language: version.language,
            reference: searchReference,
            text: `⚠️ No se encontró "${searchReference}" en ${version.name}. Verifica el formato (ej: Juan 3:16) o el Bible ID.`,
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
          "No se encontró la referencia. Revisa el formato o los IDs de la API.",
        );
      }
    } catch (error) {
      console.error("Error en búsqueda bíblica:", error);
      toast.error("Error de conexión con api.bible");
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
            Compara versículos usando la API oficial de Scripture (api.bible).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nota de Transparencia */}
          <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold">Formato de Referencia:</p>
              <p>
                Para mejores resultados con api.bible, usa formatos como{" "}
                <strong>Juan 3:16</strong> o <strong>1 Corintios 15:22</strong>.
                La API convertirá automáticamente la referencia al formato
                interno.
              </p>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="space-y-2">
            <Label htmlFor="reference">Referencia Bíblica</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reference"
                  placeholder="Ej: Juan 3:16, 1 Corintios 15:22"
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

          {/* Selección de Versiones */}
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
        </CardContent>
      </Card>
    </div>
  );
}
