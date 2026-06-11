"use client";

import { useState } from "react";
import { Card, CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Copy, BookOpen, Zap, Eye, EyeOff } from "lucide-react";
import {
  apiBibleService,
  API_BIBLE_VERSIONS,
} from "@/lib/services/api-bible-service";
import { toast } from "sonner";

interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
  reference: string;
}

interface ComparisonResult {
  reference: string;
  verses: BibleVerse[];
  crossReferences: string[];
  loading: boolean;
  error?: string;
}

export default function BibleVersionComparison() {
  const [searchReference, setSearchReference] = useState("");
  const [selectedVersions, setSelectedVersions] = useState<string[]>([
    "bba9f401831a0021-01", // NBLA
    "55424c1a9c398d36-01", // NTV
    "98768a30b89c8dd3-01", // NVI-S
  ]);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [crossReferences, setCrossReferences] = useState<string[]>([]);
  const [showDifferences, setShowDifferences] = useState(true);
  const [topic, setTopic] = useState("");

  const languages = [...new Set(API_BIBLE_VERSIONS.map((v) => v.language))];
  const [selectedLanguage, setSelectedLanguage] = useState("Español");

  const filteredVersions = API_BIBLE_VERSIONS.filter(
    (v) => v.language === selectedLanguage,
  );

  const handleSearch = async () => {
    // 🔍 Verificar la clave en el navegador
    console.log(
      "🔑 Clave en el navegador:",
      process.env.NEXT_PUBLIC_API_BIBLE_KEY
        ? "✅ PRESENTE (Longitud: " +
            process.env.NEXT_PUBLIC_API_BIBLE_KEY.length +
            ")"
        : "❌ AUSENTE o VACÍA",
    );

    console.log("🔍 Bible comparison search initiated");
    console.log("🔍 Search reference:", searchReference);
    console.log("🔍 Selected versions:", selectedVersions);

    if (!searchReference.trim()) {
      toast.error("Por favor ingresa una referencia bíblica");
      return;
    }

    if (selectedVersions.length === 0) {
      toast.error("Selecciona al menos una versión para comparar");
      return;
    }

    setComparisonResult({
      reference: searchReference,
      verses: [],
      crossReferences: [],
      loading: true,
    });

    try {
      console.log("🔍 Starting API.BIBLE service calls...");

      const verses = await apiBibleService.compareVerses(
        searchReference,
        selectedVersions,
      );
      console.log("✅ Verses received:", verses.length);

      const crossRefs = await apiBibleService.getCrossReferences(
        searchReference,
        topic,
      );
      console.log("✅ Cross references received:", crossRefs.length);

      setComparisonResult({
        reference: searchReference,
        verses,
        crossReferences: crossRefs,
        loading: false,
      });

      setCrossReferences(crossRefs);

      if (verses.length === 0) {
        toast.warning("No se encontraron versículos para esta referencia");
      } else {
        toast.success(`Se encontraron ${verses.length} versiones`);
      }
    } catch (error) {
      console.error("❌ Bible comparison search error:", error);
      setComparisonResult({
        reference: searchReference,
        verses: [],
        crossReferences: [],
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
      toast.error("Error al buscar el versículo");
    }
  };

  const toggleVersion = (versionId: string) => {
    setSelectedVersions((prev) => {
      if (prev.includes(versionId)) {
        return prev.filter((v) => v !== versionId);
      } else {
        return [...prev, versionId];
      }
    });
  };

  const copyVerse = (verse: BibleVerse) => {
    const text = `${verse.reference} (${verse.version})\n${verse.text}`;
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      toast.success("Versículo copiado al portapapeles");
    }
  };

  const highlightDifferences = (
    text: string,
    allTexts: string[],
  ): React.ReactNode => {
    if (!showDifferences || allTexts.length < 2) {
      return text;
    }

    const words = text.split(" ");
    const otherWords = allTexts
      .filter((t) => t !== text)
      .flatMap((t) => t.split(" "));

    return (
      <span>
        {words.map((word, index) => {
          const isUnique = !otherWords.some(
            (otherword) =>
              otherword.toLowerCase().replace(/[^\w]/g, "") ===
              word.toLowerCase().replace(/[^\w]/g, ""),
          );

          return (
            <span
              key={index}
              className={isUnique ? "bg-warning/15 px-1 rounded" : ""}
              title={isUnique ? "Palabra única en esta versión" : undefined}
            >
              {word}
              {index < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    );
  };

  const searchCrossReference = (reference: string) => {
    setSearchReference(reference);
    handleSearch();
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
            Compara diferentes versiones de la Biblia usando API.BIBLE
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference" className="text-foreground">
                Referencia Bíblica
              </Label>
              <Input
                id="reference"
                placeholder="ej: Juan 3:16, Romanos 8:28"
                value={searchReference}
                onChange={(e) => setSearchReference(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-background text-foreground border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-foreground">
                Tema (opcional)
              </Label>
              <Input
                id="topic"
                placeholder="ej: amor, fe, esperanza"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background text-foreground border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-foreground">
                Idioma
              </Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="bg-background text-foreground border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Versiones a Comparar</Label>
            <div className="flex flex-wrap gap-2">
              {filteredVersions.map((version: any) => (
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
            <p className="text-sm text-muted-foreground">
              {selectedVersions.length} versiones seleccionadas
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={comparisonResult?.loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Search className="h-4 w-4 mr-2" />
              {comparisonResult?.loading ? "Buscando..." : "Buscar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDifferences(!showDifferences)}
              className="border-border text-foreground hover:bg-muted"
            >
              {showDifferences ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" /> Ocultar Diferencias
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" /> Mostrar Diferencias
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {comparisonResult && (
        <Tabs defaultValue="comparison" className="space-y-4">
          <TabsList className="bg-muted border-border">
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Comparación ({comparisonResult.verses.length})
            </TabsTrigger>
            <TabsTrigger
              value="crossrefs"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Referencias Cruzadas ({comparisonResult.crossReferences.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            {comparisonResult.loading ? (
              <Card className="bg-card border-border">
                <CardContent className="py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-foreground">Buscando versículos...</p>
                  </div>
                </CardContent>
              </Card>
            ) : comparisonResult.error ? (
              <Card className="bg-card border-border">
                <CardContent className="py-8">
                  <div className="text-center text-destructive">
                    <p>Error: {comparisonResult.error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : comparisonResult.verses.length > 0 ? (
              <div className="grid gap-4">
                {comparisonResult.verses.map((verse, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-foreground">
                          {verse.version} - {verse.reference}
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyVerse(verse)}
                          className="border-border text-foreground hover:bg-muted"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-base leading-relaxed text-foreground">
                        {showDifferences
                          ? highlightDifferences(
                              verse.text,
                              comparisonResult.verses.map((v) => v.text),
                            )
                          : verse.text}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    <p>
                      No se encontraron versículos para &quot;
                      {comparisonResult.reference}&quot;
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="crossrefs" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Zap className="h-5 w-5 text-primary" />
                  Referencias Cruzadas
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Versículos relacionados con {comparisonResult.reference}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60">
                  <div className="space-y-2">
                    {crossReferences.map((ref, index) => (
                      <div key={index}>
                        <Button
                          variant="ghost"
                          className="justify-start w-full text-left text-foreground hover:bg-muted"
                          onClick={() => searchCrossReference(ref)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          {ref}
                        </Button>
                        {index < crossReferences.length - 1 && (
                          <Separator className="bg-border" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <h4 className="font-medium text-foreground">
              Instrucciones de uso:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Ingresa una referencia bíblica (ej: &quot;Juan 3:16&quot;,
                &quot;1 Corintios 13:4-7&quot;)
              </li>
              <li>
                Selecciona las versiones que deseas comparar haciendo clic en
                las etiquetas
              </li>
              <li>
                Opcionalmente añade un tema para obtener referencias cruzadas
                más precisas
              </li>
              <li>
                Las diferencias entre versiones se resaltan en amarillo cuando
                está activado
              </li>
              <li>
                Haz clic en las referencias cruzadas para buscarlas
                automáticamente
              </li>
              <li>
                Usa el botón &quot;Copiar&quot; para copiar cualquier versículo
                al portapapeles
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
