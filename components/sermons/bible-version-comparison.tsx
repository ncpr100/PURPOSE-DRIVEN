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
import { Search, BookOpen, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const VERSIONS = [
  { id: "almeida", name: "Almeida (Portugués)" },
  { id: "kjv", name: "King James Version (Inglés)" },
  { id: "web", name: "World English Bible (Inglés)" },
  { id: "clementine", name: "Clementine (Latín)" },
];

interface VerseResult {
  version: string;
  reference: string;
  text: string;
}

export default function BibleVersionComparison() {
  const [searchReference, setSearchReference] = useState("");
  const [selectedVersions, setSelectedVersions] = useState<string[]>([
    "almeida",
    "kjv",
  ]);
  const [results, setResults] = useState<VerseResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchReference.trim()) {
      toast.error("Ingresa una referencia bíblica (ej: Juan 3:16)");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const formattedRef = searchReference.replace(/\s+/g, "+");
      const promises = selectedVersions.map(async (versionId) => {
        try {
          const response = await fetch(
            `https://bible-api.com/${formattedRef}?translation=${versionId}`,
          );
          if (!response.ok) throw new Error("No encontrado");
          const data = await response.json();

          const versionName =
            VERSIONS.find((v) => v.id === versionId)?.name || versionId;
          return {
            version: versionName,
            reference: data.reference || searchReference,
            text: data.text || "Texto no disponible para esta versión.",
          };
        } catch (err) {
          return {
            version:
              VERSIONS.find((v) => v.id === versionId)?.name || versionId,
            reference: searchReference,
            text: "⚠️ No se encontró esta referencia en esta versión.",
          };
        }
      });

      const fetchedResults = await Promise.all(promises);
      setResults(fetchedResults);
      toast.success("Comparación obtenida exitosamente");
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Comparador de Versiones Bíblicas
          </CardTitle>
          <CardDescription>
            Compara versículos en diferentes traducciones bíblicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reference">Referencia Bíblica</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reference"
                  placeholder="Ej: Juan 3:16"
                  value={searchReference}
                  onChange={(e) => setSearchReference(e.target.value)}
                  className="pl-9"
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

          <div className="space-y-2">
            <Label>Versiones a Comparar</Label>
            <div className="flex flex-wrap gap-2">
              {VERSIONS.map((version) => (
                <Badge
                  key={version.id}
                  variant={
                    selectedVersions.includes(version.id)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleVersion(version.id)}
                >
                  {version.name}
                </Badge>
              ))}
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="font-semibold text-lg">Resultados</h3>
              {results.map((result, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {result.version}
                    </CardTitle>
                    <CardDescription>{result.reference}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{result.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
