"use client";

import { useState } from "react";
import { getAdminLlmRecommendationAction } from "@/actions/llm";
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
import { Sparkles, AlertCircle, RotateCcw, ShieldAlert, ShieldCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AdminLlmRecommendation() {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shouldAlert = recommendation
    ? recommendation.toUpperCase().includes("RECOMENDAR ALERTA")
    : false;

  async function handleGetRecommendation() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAdminLlmRecommendationAction();
      if (result.success && result.data) {
        setRecommendation(result.data.recommendation);
      } else {
        setError(result.error ?? "Error desconocido");
      }
    } catch {
      setError("Error de conexión al obtener recomendación");
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
            <CardTitle>Evaluación IA de Riesgo</CardTitle>
            <CardDescription>
              La IA analiza los datos meteorológicos y recomienda si se debe emitir una alerta
            </CardDescription>
          </div>
          <Badge variant="outline">IA Admin</Badge>
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
            {/* Alert indicator */}
            {shouldAlert ? (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
                <ShieldAlert className="size-5 shrink-0" />
                <span className="font-medium">Se recomienda emitir alerta</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-800">
                <ShieldCheck className="size-5 shrink-0" />
                <span className="font-medium">Sin riesgo detectado</span>
              </div>
            )}

            {/* Full recommendation */}
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
              Nueva evaluación
            </Button>
          </div>
        ) : (
          <Button onClick={handleGetRecommendation} disabled={isLoading}>
            <Sparkles className="mr-2 size-4" />
            {isLoading ? "Analizando datos..." : "Evaluar riesgo meteorológico"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
