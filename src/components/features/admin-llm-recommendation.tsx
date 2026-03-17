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
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {recommendation}
              </p>
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
