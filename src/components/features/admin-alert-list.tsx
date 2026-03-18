"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllAlertsAction, deactivateAlertAction } from "@/actions/alerts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    async function loadAlerts() {
      setIsLoading(true);
      const result = await getAllAlertsAction(page, 10);
      if (!cancelled && result.success && result.data) {
        setAlerts(result.data.alerts);
        setTotalPages(result.data.totalPages);
      }
      if (!cancelled) {
        setIsLoading(false);
      }
    }
    
    void loadAlerts();
    
    return () => {
      cancelled = true;
    };
  }, [page]);

  async function handleDeactivate(alertId: string) {
    setDeletingId(alertId);
    setConfirmDelete(null);
    
    const result = await deactivateAlertAction(alertId);
    
    if (result.success) {
      // Remove the alert from the list
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    }
    
    setDeletingId(null);
  }

  // Expose a refresh method for parent
  const refresh = useCallback(() => {
    setPage((p) => p); // Trigger re-fetch by updating page state
  }, []);

  // Assign to window for inter-component communication (simple approach)
  useEffect(() => {
    (window as unknown as Record<string, () => void>).__refreshAlertList = refresh;
    return () => {
      delete (window as unknown as Record<string, () => void>).__refreshAlertList;
    };
  }, [refresh]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Alertas emitidas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando alertas...</p>
          ) : alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay alertas activas.</p>
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
                        <Badge className="bg-green-100 text-green-800">Activa</Badge>
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
                      onClick={() => setConfirmDelete(alert.id)}
                      disabled={deletingId === alert.id}
                      title="Desactivar alerta"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
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

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(open: boolean) => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar alerta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará la alerta permanentemente. La alerta ya no aparecerá 
              en el panel de alertas emitidas, pero quedará registrada en el historial de alertas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && handleDeactivate(confirmDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
