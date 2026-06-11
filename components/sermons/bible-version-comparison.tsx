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
import { Search, BookOpen, Loader2 , Sparkles} from "lucide-react";
import { toast } from "sonner";

const VERSIONS = [
  { id: "almeida", name: "Almeida (PortuguÃ©s)" },
  { id: "kjv", name: "King James Version (InglÃ©s)" },
  { id: "web", name: "World English Bible (InglÃ©s)" },
  { id: "clementine", name: "Clementine (LatÃ­n)" },
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
      toast.error("Ingresa una referencia bÃ­blica (ej: Juan 3:16)");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const formattedRef = searchReference.replace(/\s+/g, "+");
      const promises = selectedVersions.map(async (versionId) => {
        try {
          // Usamos bible-api.com: 100% gratuita, sin API Key, sin lÃ­mites estrictos
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
            text: data.text || "Texto no disponible para esta versiÃ³n.",
          };
        } catch (err) {
          return {
            version:
              VERSIONS.find((v) => v.id === versionId)?.name || versionId,
            reference: searchReference,
            text: "âš ï¸ No se encontrÃ³ esta referencia en esta versiÃ³n.",
          };
        }
      });

      const fetchedResults = await Promise.all(promises);
      setResults(fetchedResults);
      toast.success("ComparaciÃ³n obtenida exitosamente");
    } catch (error) {
      console.error("Error en bÃºsqueda bÃ­blica:", error);
      toast.error("Error al conectar con el servicio bÃ­blico");
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
      {/* Header Limpio y Unificado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            GestiÃ³n de Sermones
          </h1>
          <p className="text-muted-foreground">
            Crea, administra y analiza sermones con herramientas de exÃ©gesis
            bÃ­blica e IA.
          </p>
        </div>
        <Button
          onClick={() => setShowAssistant(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generar SermÃ³n con IA
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por tÃ­tulo, escritura o predicador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sermons Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <p>Cargando sermones...</p>
          </div>
        ) : filteredSermons.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "No se encontraron sermones"
                : "No hay sermones creados"}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => setShowAssistant(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Crear con IA
              </Button>
            </div>
          </div>
        ) : (
          filteredSermons.map((sermon) => (
            <Card key={sermon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">
                  {sermon.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  {sermon.scripture && (
                    <Badge variant="secondary" className="text-xs">
                      {sermon.scripture}
                    </Badge>
                  )}
                  {sermon.speaker && (
                    <Badge variant="outline" className="text-xs">
                      {sermon.speaker}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sermon.content && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {truncateText(sermon.content, 120)}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(sermon.createdAt)}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingSermon(sermon)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSermon(sermon.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
