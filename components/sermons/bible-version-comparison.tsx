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
import { Search, BookOpen, Loader2 } from "lucide-react";
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
          // Usamos bible-api.com: 100% gratuita, sin API Key, sin límites estrictos
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            Comparación de Versiones Bíblicas
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Herramienta gratuita y sin límites para comparar textos bíblicos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference" className="text-foreground">
                Referencia Bíblica
              </Label>
              <Input
                id="reference"
                placeholder="ej: Juan 3:16 o John 3:16"
                value={searchReference}
                onChange={(e) => setSearchReference(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-background text-foreground border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Versiones a Comparar</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {VERSIONS.map((version) => (
                  <Badge
                    key={version.id}
                    variant={
                      selectedVersions.includes(version.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleVersion(version.id)}
                  >
                    {version.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={loading || selectedVersions.length === 0}
            className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {loading ? "Buscando..." : "Comparar Versiones"}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Consultando textos bíblicos...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-4">
          {results.map((result, index) => (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">
                  {result.version}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {result.reference}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                  {result.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
