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
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {recommendation}
              </p>
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
