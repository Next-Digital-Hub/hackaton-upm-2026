import { getAllAlertsAction } from "@/actions/alerts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ALERT_SEVERITIES } from "@/config/constants";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminAlertsHistoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const result = await getAllAlertsAction(page, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial de Alertas</h1>
        <p className="text-sm text-muted-foreground">
          Todas las alertas emitidas con su estado actual
        </p>
      </div>

      {result.success && result.data ? (
        <>
          {result.data.alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay alertas emitidas aún.
            </p>
          ) : (
            <div className="space-y-3">
              {result.data.alerts.map((alert) => {
                const sev =
                  ALERT_SEVERITIES[alert.severity as keyof typeof ALERT_SEVERITIES];
                return (
                  <Card key={alert.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          {alert.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={sev?.color ?? ""}>
                            {sev?.label ?? alert.severity}
                          </Badge>
                          {alert.active ? (
                            <Badge className="bg-green-100 text-green-800">
                              Activa
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactiva</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {alert._count.notifications} notificaciones enviadas
                      </p>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination */}
              {result.data.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={`/admin/history/alerts?page=${Math.max(1, page - 1)}`}
                    className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                  >
                    <ChevronLeft className="size-4" />
                    Anterior
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    Página {page} de {result.data.totalPages} ({result.data.total} alertas)
                  </span>
                  <Link
                    href={`/admin/history/alerts?page=${Math.min(result.data.totalPages, page + 1)}`}
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
          {result.error ?? "Error al cargar historial de alertas."}
        </p>
      )}
    </div>
  );
}
