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

export default function BibleVersionComparison() {
  const [searchReference, setSearchReference] = useState("");
  const [selectedVersions, setSelectedVersions] = useState<string[]>([
    "bba9f401831a0021-01",
    "55424c1a9c398d36-01",
    "98768a30b89c8dd3-01",
  ]);
  const [comparisonResult, setComparisonResult] = useState<{
    verses: BibleVerse[];
    loading: boolean;
    error?: string;
  } | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("Español");

  const languages = [...new Set(API_BIBLE_VERSIONS.map((v) => v.language))];
  const filteredVersions = API_BIBLE_VERSIONS.filter(
    (v) => v.language === selectedLanguage,
  );

  const handleSearch = async () => {
    if (!searchReference.trim()) {
      toast.error("Por favor ingresa una referencia bíblica");
      return;
    }
    setComparisonResult({ verses: [], loading: true });
    try {
      const verses = await apiBibleService.compareVerses(
        searchReference,
        selectedVersions,
      );
      setComparisonResult({ verses, loading: false });
      if (verses.length > 0)
        toast.success(`Se encontraron ${verses.length} versiones`);
    } catch (error) {
      setComparisonResult({
        verses: [],
        loading: false,
        error: "Error al buscar",
      });
      toast.error("Error al buscar el versículo");
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
            Compara diferentes versiones de la Biblia usando API.BIBLE
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
                placeholder="ej: Juan 3:16"
                value={searchReference}
                onChange={(e) => setSearchReference(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
              {filteredVersions.map((version) => (
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

          <Button
            onClick={handleSearch}
            disabled={comparisonResult?.loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Search className="h-4 w-4 mr-2" />
            {comparisonResult?.loading ? "Buscando..." : "Buscar"}
          </Button>
        </CardContent>
      </Card>

      {comparisonResult &&
        !comparisonResult.loading &&
        !comparisonResult.error &&
        comparisonResult.verses.length > 0 && (
          <div className="grid gap-4">
            {comparisonResult.verses.map((verse, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-foreground">
                    {verse.version} - {verse.reference}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-foreground">
                    {verse.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
