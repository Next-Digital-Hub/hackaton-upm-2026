import { getAlertHistoryAction } from "@/actions/alerts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ALERT_SEVERITIES } from "@/config/constants";
import { AlertCircle, Bell, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AlertsHistoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const result = await getAlertHistoryAction(page, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial de alertas</h1>
        <p className="text-sm text-muted-foreground">
          Alertas meteorológicas que has recibido
        </p>
      </div>

      {!result.success ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {result.error ?? "Error al cargar historial"}
          </AlertDescription>
        </Alert>
      ) : result.data && result.data.notifications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No has recibido alertas todavía.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {result.data?.notifications.map((notification) => {
            const severityKey = notification.alert
              .severity as keyof typeof ALERT_SEVERITIES;
            const severityInfo = ALERT_SEVERITIES[severityKey];

            return (
              <Card key={notification.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Bell className="size-3.5" />
                      {notification.alert.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {severityInfo && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityInfo.color}`}
                        >
                          {severityInfo.label}
                        </span>
                      )}
                      {notification.readAt && (
                        <CheckCircle2 className="size-3.5 text-green-600" />
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    {new Date(notification.alert.createdAt).toLocaleString(
                      "es-ES",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{notification.alert.description}</p>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {result.data && result.data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/history/alerts?page=${Math.max(1, page - 1)}`}
                className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
              >
                <ChevronLeft className="size-4" />
                Anterior
              </Link>
              <span className="text-sm text-muted-foreground">
                Página {result.data.page} de {result.data.totalPages} ({result.data.total} alertas)
              </span>
              <Link
                href={`/history/alerts?page=${Math.min(result.data.totalPages, page + 1)}`}
                className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${page >= result.data.totalPages ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
              >
                Siguiente
                <ChevronRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
