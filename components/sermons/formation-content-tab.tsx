"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BookOpen,
  Copy,
  Loader2,
  MessageSquare,
  Share2,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormationContent {
  socialMediaPost: {
    text: string;
    caption: string;
    platforms: string[];
  };
  smallGroupGuide: {
    discussionQuestion: string;
    followUpQuestions: string[];
    verseReference: string | null;
  };
}

interface Props {
  sermonId: string;
}

export function FormationContentTab({ sermonId }: Props) {
  const [content, setContent] = useState<FormationContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/sermons/${sermonId}/formation-content`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar contenido");
      setContent(data.content);
      toast.success("Contenido de formación generado");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado al portapapeles`);
    } catch {
      toast.error("No se pudo copiar al portapapeles");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contenido de formación</h3>
          <p className="text-sm text-muted-foreground">
            Trigo y paja — contenido ministerial, no viral
          </p>
        </div>
        <Button onClick={loadContent} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              {content ? "Regenerar contenido" : "Generar contenido"}
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.10)] p-3 text-sm text-amber-800">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-[hsl(var(--warning))]" />
          <span>
            Requiere Análisis Ministerial previo. Revise el contenido antes de
            publicar.
          </span>
        </div>
      </div>

      {content && (
        <div className="grid gap-4">
          {/* Social Media Post */}
          <Card className="border-[hsl(var(--success)/0.3)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Share2 className="h-4 w-4 text-[hsl(var(--success))]" />
                Publicación para redes sociales
                <div className="ml-auto flex gap-1">
                  {content.socialMediaPost.platforms.map((p) => (
                    <Badge
                      key={p}
                      variant="outline"
                      className="border-[hsl(var(--success)/0.4)] text-[hsl(var(--success))] capitalize"
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Frase principal
                </p>
                <blockquote className="border-l-4 border-[hsl(var(--success)/0.30)] pl-4 text-sm italic">
                  "{content.socialMediaPost.text}"
                </blockquote>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Caption completo
                </p>
                <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
                  {content.socialMediaPost.caption}
                </pre>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    content.socialMediaPost.caption,
                    "Caption",
                  )
                }
              >
                <Copy className="mr-2 h-3 w-3" />
                Copiar caption
              </Button>
            </CardContent>
          </Card>

          {/* Small Group Guide */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                Guía para grupos pequeños
                {content.smallGroupGuide.verseReference && (
                  <Badge
                    variant="outline"
                    className="ml-auto border-primary/30 text-primary"
                  >
                    <BookOpen className="mr-1 h-3 w-3" />
                    {content.smallGroupGuide.verseReference}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Pregunta central
                </p>
                <div className="rounded-md border border-[hsl(var(--lavender)/0.30)] bg-primary/[0.06] p-3">
                  <p className="text-sm font-medium text-foreground">
                    {content.smallGroupGuide.discussionQuestion}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  Preguntas de seguimiento
                </p>
                <ol className="space-y-2">
                  {content.smallGroupGuide.followUpQuestions.map((q, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/[0.12] text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const text = [
                    `Pregunta central: ${content.smallGroupGuide.discussionQuestion}`,
                    "",
                    "Preguntas de seguimiento:",
                    ...content.smallGroupGuide.followUpQuestions.map(
                      (q, i) => `${i + 1}. ${q}`,
                    ),
                    content.smallGroupGuide.verseReference
                      ? `\nReferencia: ${content.smallGroupGuide.verseReference}`
                      : "",
                  ]
                    .join("\n")
                    .trim();
                  copyToClipboard(text, "Guía");
                }}
              >
                <Copy className="mr-2 h-3 w-3" />
                Copiar guía completa
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
