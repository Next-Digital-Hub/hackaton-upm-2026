"use client";

import { useState } from "react";
import { getLlmRecommendationAction } from "@/actions/llm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LlmRecommendations() {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGetRecommendation() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getLlmRecommendationAction();
      if (result.success && result.data) {
        setRecommendation(result.data.recommendation);
      } else {
        setError(result.error ?? "Error desconocido");
      }
    } catch {
      setError("Error de conexión al obtener recomendaciones");
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewQuery() {
    setRecommendation(null);
    setError(null);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recomendaciones de Seguridad</CardTitle>
            <CardDescription>
              Consejos personalizados basados en el clima actual y tu perfil
            </CardDescription>
          </div>
          <Badge variant="outline">IA</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {recommendation ? (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none dark:prose-invert rounded-lg bg-muted/50 p-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0" {...props} />,
                  p: ({ ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc pl-6 mb-3 space-y-1" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-3 space-y-1" {...props} />,
                  li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                  strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                  em: ({ ...props }) => <em className="italic" {...props} />,
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-3" {...props} />
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-muted p-3 rounded text-sm font-mono overflow-x-auto" {...props}>
                        {children}
                      </code>
                    );
                  },
                  hr: ({ ...props }) => <hr className="my-4 border-border" {...props} />,
                }}
              >
                {recommendation}
              </ReactMarkdown>
            </div>
            <Button variant="outline" size="sm" onClick={handleNewQuery}>
              <RotateCcw className="mr-2 size-4" />
              Nueva consulta
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleGetRecommendation}
            disabled={isLoading}
          >
            <Sparkles className="mr-2 size-4" />
            {isLoading ? "Consultando IA..." : "Obtener recomendaciones"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
