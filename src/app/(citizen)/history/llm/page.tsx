import { getLlmHistoryAction } from "@/actions/llm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Sparkles } from "lucide-react";

export default async function LlmHistoryPage() {
  const result = await getLlmHistoryAction(1, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial de consultas LLM</h1>
        <p className="text-sm text-muted-foreground">
          Tus consultas anteriores al asistente de IA
        </p>
      </div>

      {!result.success ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {result.error ?? "Error al cargar historial"}
          </AlertDescription>
        </Alert>
      ) : result.data && result.data.queries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No has realizado consultas al asistente de IA todavía. Usa el botón
            &quot;Obtener recomendaciones&quot; en el Dashboard.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {result.data?.queries.map((query) => (
            <Card key={query.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="size-3.5" />
                    Consulta IA
                  </CardTitle>
                  <Badge variant="outline">
                    {new Date(query.createdAt).toLocaleString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {query.userPrompt.split("\n").slice(0, 2).join(" ")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {query.response}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {result.data && result.data.totalPages > 1 && (
            <p className="text-center text-sm text-muted-foreground">
              Mostrando página {result.data.page} de {result.data.totalPages} (
              {result.data.total} consultas)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
