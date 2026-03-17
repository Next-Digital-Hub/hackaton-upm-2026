import { getAlertHistoryAction } from "@/actions/alerts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ALERT_SEVERITIES } from "@/config/constants";
import { AlertCircle, Bell, CheckCircle2 } from "lucide-react";

export default async function AlertsHistoryPage() {
  const result = await getAlertHistoryAction(1, 20);

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

          {result.data && result.data.totalPages > 1 && (
            <p className="text-center text-sm text-muted-foreground">
              Mostrando página {result.data.page} de {result.data.totalPages} (
              {result.data.total} alertas)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
