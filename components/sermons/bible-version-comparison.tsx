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

// VERSIONES REALES Y AUTORIZADAS PARA TU API KEY EN rest.api.bible
const BIBLE_VERSIONS = [
  // ESPAÑOL
  {
    id: "rvr09",
    name: "Reina Valera 1909",
    language: "Español",
    bibleId: "592420522e16049f-01",
  },
  {
    id: "pdDpt",
    name: "Palabra de Dios para ti",
    language: "Español",
    bibleId: "48acedcf8595c754-01",
  },
  {
    id: "spabes",
    name: "Simple Spanish",
    language: "Español",
    bibleId: "b32b9d1b64b4ef29-01",
  },
  {
    id: "vbl",
    name: "Versión Biblia Libre (VBL)",
    language: "Español",
    bibleId: "482ddd53705278cc-02",
  },

  // INGLÉS
  {
    id: "kjv",
    name: "King James Version (KJV)",
    language: "Inglés",
    bibleId: "de4e12af7f28f599-02",
  },
  {
    id: "web",
    name: "World English Bible (WEB)",
    language: "Inglés",
    bibleId: "9879dbb7cfe39e4d-02",
  },
  {
    id: "asv",
    name: "American Standard (ASV)",
    language: "Inglés",
    bibleId: "06125adad2d5898a-01",
  },

  // PORTUGUÉS
  {
    id: "blt",
    name: "Bíblia Livre Para Todos (BLT)",
    language: "Portugués",
    bibleId: "d63894c8d9a7a503-01",
  },
];

interface VerseResult {
  version: string;
  versionName: string;
  language: string;
  reference: string;
  text: string;
  hasError: boolean;
  errorMessage?: string;
}

export default function BibleVersionComparison() {
  const [searchReference, setSearchReference] = useState("");
  const [selectedVersions, setSelectedVersions] = useState<string[]>([
    "rvr09",
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

    const apiKey = process.env.NEXT_PUBLIC_API_BIBLE_KEY;
    if (!apiKey) {
      toast.error(
        "Falta NEXT_PUBLIC_API_BIBLE_KEY en las variables de entorno",
      );
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const query = encodeURIComponent(searchReference.trim());

      const promises = selectedVersions.map(async (versionId) => {
        const version = BIBLE_VERSIONS.find((v) => v.id === versionId);
        if (!version) return null;

        try {
          // Usando el endpoint oficial rest.api.bible que acepta lenguaje natural
          const url = `https://rest.api.bible/v1/bibles/${version.bibleId}/search?query=${query}&limit=1`;

          const response = await fetch(url, {
            headers: { "api-key": apiKey },
          });

          if (!response.ok) {
            return {
              version: versionId,
              versionName: version.name,
              language: version.language,
              reference: searchReference,
              text: "",
              hasError: true,
              errorMessage: `Error de conexión (${response.status}).`,
            };
          }

          const data = await response.json();

          if (!data.data || data.data.length === 0) {
            return {
              version: versionId,
              versionName: version.name,
              language: version.language,
              reference: searchReference,
              text: "",
              hasError: true,
              errorMessage:
                "No se encontró esta referencia exacta en esta versión.",
            };
          }

          const match = data.data[0];
          // Limpiar etiquetas HTML o de formato que a veces devuelve la API
          const cleanText = match.text
            ? match.text
                .replace(/<[^>]*>?/gm, "")
                .replace(/\s+/g, " ")
                .trim()
            : "Texto no disponible.";

          return {
            version: versionId,
            versionName: version.name,
            language: version.language,
            reference: match.reference || searchReference,
            text: cleanText,
            hasError: false,
          };
        } catch (err) {
          return {
            version: versionId,
            versionName: version.name,
            language: version.language,
            reference: searchReference,
            text: "",
            hasError: true,
            errorMessage: "Error de red al contactar rest.api.bible.",
          };
        }
      });

      const fetchedResults = await Promise.all(promises);
      const validResults = fetchedResults.filter(
        (r): r is VerseResult => r !== null,
      );

      setResults(validResults);

      const successCount = validResults.filter((r) => !r.hasError).length;
      if (successCount > 0) {
        toast.success(`Comparación obtenida en ${successCount} versión(es)`);
      } else {
        toast.warning(
          "No se encontró la referencia en las versiones seleccionadas.",
        );
      }
    } catch (error) {
      console.error("Error en búsqueda bíblica:", error);
      toast.error("Error inesperado al conectar con el servicio bíblico");
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
      if (!acc[version.language]) acc[version.language] = [];
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
            Compara versículos usando la API oficial de Scripture
            (rest.api.bible).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold">Versiones Disponibles:</p>
              <p>
                Se muestran las versiones autorizadas por tu cuenta actual
                (Reina Valera, KJV, WEB, BLT, etc.). Las versiones con derechos
                de autor premium (NVI, NLT, MSG) requieren licencias adicionales
                en API.Bible.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Referencia Bíblica</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reference"
                  placeholder="Ej: Juan 3:16, 1 Corintios 15:56"
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
                    className={`border-l-4 ${result.hasError ? "border-l-yellow-500" : "border-l-primary"}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.hasError && (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                          <CardTitle className="text-base">
                            {result.versionName}
                          </CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {result.language}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm font-medium">
                        {result.reference}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {result.hasError ? (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          {result.errorMessage}
                        </p>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {result.text}
                        </p>
                      )}
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
