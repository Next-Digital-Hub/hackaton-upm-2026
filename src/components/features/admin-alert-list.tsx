"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllAlertsAction, toggleAlertAction } from "@/actions/alerts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ALERT_SEVERITIES } from "@/config/constants";

interface AlertRow {
  id: string;
  title: string;
  description: string;
  severity: string;
  active: boolean;
  createdBy: string;
  createdAt: Date;
  _count: { notifications: number };
}

export function AdminAlertList() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchAlerts = useCallback(async (p: number) => {
    setIsLoading(true);
    const result = await getAllAlertsAction(p, 10);
    if (result.success && result.data) {
      setAlerts(result.data.alerts);
      setTotalPages(result.data.totalPages);
      setPage(result.data.page);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts(page);
  }, [fetchAlerts, page]);

  async function handleToggle(alertId: string) {
    setTogglingId(alertId);
    const result = await toggleAlertAction(alertId);
    if (result.success) {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId ? { ...a, active: result.active! } : a
        )
      );
    }
    setTogglingId(null);
  }

  // Expose a refresh method for parent
  function refresh() {
    fetchAlerts(page);
  }

  // Assign to window for inter-component communication (simple approach)
  useEffect(() => {
    (window as unknown as Record<string, () => void>).__refreshAlertList = refresh;
    return () => {
      delete (window as unknown as Record<string, () => void>).__refreshAlertList;
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas emitidas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando alertas...</p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay alertas emitidas todavía.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const sev =
                ALERT_SEVERITIES[alert.severity as keyof typeof ALERT_SEVERITIES];
              return (
                <div
                  key={alert.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{alert.title}</span>
                      <Badge
                        variant="outline"
                        className={sev?.color ?? ""}
                      >
                        {sev?.label ?? alert.severity}
                      </Badge>
                      {alert.active ? (
                        <Badge className="bg-green-100 text-green-800">Activa</Badge>
                      ) : (
                        <Badge variant="secondary">Inactiva</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {alert._count.notifications} notificaciones
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggle(alert.id)}
                    disabled={togglingId === alert.id}
                    title={alert.active ? "Desactivar alerta" : "Activar alerta"}
                  >
                    {alert.active ? (
                      <ToggleRight className="size-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="size-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Siguiente
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
