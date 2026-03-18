"use client";

import { CreateAlertForm } from "@/components/features/create-alert-form";
import { AdminAlertList } from "@/components/features/admin-alert-list";

export default function AdminAlertsPage() {
  function handleAlertCreated() {
    // Trigger refresh on the alert list
    const refresh = (window as unknown as Record<string, (() => void) | undefined>).__refreshAlertList;
    if (refresh) refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Alertas</h1>
        <p className="text-sm text-muted-foreground">
          Crea alertas y gestiona las existentes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CreateAlertForm onCreated={handleAlertCreated} />
        <AdminAlertList />
      </div>
    </div>
  );
}
