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

// Versiones bíblicas reales disponibles en APIs gratuitas
const BIBLE_VERSIONS = [
  // Español
  {
    id: "rvr1960",
    name: "Reina-Valera 1960",
    language: "Español",
    api: "bible-api",
  },
  {
    id: "nvi",
    name: "Nueva Versión Internacional",
    language: "Español",
    api: "getbible",
  },
  {
    id: "tla",
    name: "Traducción en Lenguaje Actual",
    language: "Español",
    api: "getbible",
  },

  // Inglés
  {
    id: "kjv",
    name: "King James Version",
    language: "English",
    api: "bible-api",
  },
  {
    id: "web",
    name: "World English Bible",
    language: "English",
    api: "bible-api",
  },
  {
    id: "asv",
    name: "American Standard Version",
    language: "English",
    api: "bible-api",
  },
  {
    id: "bbe",
    name: "Bible in Basic English",
    language: "English",
    api: "bible-api",
  },
  {
    id: "darby",
    name: "Darby Translation",
    language: "English",
    api: "bible-api",
  },
  {
    id: "ylt",
    name: "Young's Literal Translation",
    language: "English",
    api: "bible-api",
  },
  {
    id: "esv",
    name: "English Standard Version",
    language: "English",
    api: "esv",
  },

  // Portugués
  {
    id: "almeida",
    name: "Almeida Revista e Corrigida",
    language: "Português",
    api: "bible-api",
  },

  // Latín
  {
    id: "clementine",
    name: "Vulgata Clementina",
    language: "Latina",
    api: "bible-api",
  },

  // Otros idiomas
  {
    id: "almeida-rc",
    name: "Almeida Revista e Atualizada",
    language: "Português",
    api: "getbible",
  },
  { id: "lsg", name: "Louis Segond", language: "Français", api: "getbible" },
  { id: "lut", name: "Luther Bibel", language: "Deutsch", api: "getbible" },
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
    "rvr1960",
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
          let response;
          let data;

          // Usar la API correspondiente según la versión
          if (version.api === "bible-api") {
            response = await fetch(
              `https://bible-api.com/${formattedRef}?translation=${versionId}`,
            );
            if (!response.ok) throw new Error("No encontrado");
            data = await response.json();
          } else if (version.api === "getbible") {
            // GetBible.net API
            response = await fetch(
              `https://getbible.net/v2/${formattedRef}/${versionId}`,
            );
            if (!response.ok) throw new Error("No encontrado");
            data = await response.json();
          } else if (version.api === "esv") {
            // ESV API (requiere API key para producción, pero tiene demo)
            response = await fetch(
              `https://api.esv.org/v3/passage/text/?q=${formattedRef}`,
              {
                headers: {
                  Authorization: `Token demo`, // Demo key para pruebas
                },
              },
            );
            if (!response.ok) throw new Error("No encontrado");
            data = await response.json();
          }

          return {
            version: versionId,
            versionName: version.name,
            language: version.language,
            reference: data.reference || searchReference,
            text: data.text || data.passages?.[0] || "Texto no disponible",
          };
        } catch (err) {
          return {
            version: versionId,
            versionName: version.name,
            language: version.language,
            reference: searchReference,
            text: "⚠️ No se encontró esta referencia en esta versión.",
          };
        }
      });

      const fetchedResults = await Promise.all(promises);
      setResults(fetchedResults.filter((r): r is VerseResult => r !== null));
      toast.success(
        `Comparación obtenida en ${fetchedResults.filter((r) => r && !r.text.includes("⚠️")).length} versiones`,
      );
    } catch (error) {
      console.error("Error en búsqueda bíblica:", error);
      toast.error("Error al conectar con el servicio bíblico");
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

  // Agrupar versiones por idioma
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
            Compara versículos en {BIBLE_VERSIONS.length} traducciones bíblicas
            gratuitas
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
                <p className="text-sm font-medium text-muted-foreground">
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
                      className="cursor-pointer hover:opacity-80 transition-opacity"
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
              <h3 className="font-semibold text-lg">
                Resultados de la Comparación
              </h3>
              <div className="grid gap-4">
                {results.map((result, idx) => (
                  <Card key={idx} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {result.versionName}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {result.language}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
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

          {/* Información de APIs */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">🔌 APIs Gratuitas Utilizadas</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                • <strong>Bible-API.com</strong>: RVR1960, KJV, WEB, ASV, BBE,
                Darby, YLT, Almeida, Clementine
              </li>
              <li>
                • <strong>GetBible.net</strong>: NVI, TLA, Almeida RC, Louis
                Segond, Luther
              </li>
              <li>
                • <strong>ESV API</strong>: English Standard Version (5,000
                requests/día gratis)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
