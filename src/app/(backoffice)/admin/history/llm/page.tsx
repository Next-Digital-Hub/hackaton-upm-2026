import { getAdminLlmHistoryAction } from "@/actions/llm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminLlmHistoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const result = await getAdminLlmHistoryAction(page, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial Consultas IA</h1>
        <p className="text-sm text-muted-foreground">
          Todas las consultas realizadas al LLM por todos los usuarios
        </p>
      </div>

      {result.success && result.data ? (
        <>
          {result.data.queries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay consultas IA aún.
            </p>
          ) : (
            <div className="space-y-3">
              {result.data.queries.map((query) => (
                <Card key={query.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {new Date(query.createdAt).toLocaleString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardTitle>
                      <Badge variant="outline">
                        {query.user.name ?? query.user.email}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Ver prompt del usuario
                      </summary>
                      <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs">
                        {query.userPrompt}
                      </pre>
                    </details>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="whitespace-pre-line text-sm leading-relaxed line-clamp-6">
                        {query.response}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {result.data.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={`/admin/history/llm?page=${Math.max(1, page - 1)}`}
                    className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                  >
                    <ChevronLeft className="size-4" />
                    Anterior
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    Página {page} de {result.data.totalPages} ({result.data.total} consultas)
                  </span>
                  <Link
                    href={`/admin/history/llm?page=${Math.min(result.data.totalPages, page + 1)}`}
                    className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${page >= result.data.totalPages ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                  >
                    Siguiente
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-red-600">
          {result.error ?? "Error al cargar historial de consultas IA."}
        </p>
      )}
    </div>
  );
}
