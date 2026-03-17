// lib/alertBus.ts
// In-memory event bus for SSE alert broadcasting
// This works because Next.js dev server keeps a single process in memory

type AlertListener = (alert: any) => void

class AlertBus {
  private listeners: Set<AlertListener> = new Set()

  subscribe(listener: AlertListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  emit(alert: any) {
    this.listeners.forEach(listener => listener(alert))
  }

  getListenerCount() {
    return this.listeners.size
  }
}

// Singleton: survives across API route calls in the same process
const globalForAlerts = globalThis as unknown as { alertBus: AlertBus }
export const alertBus = globalForAlerts.alertBus ?? new AlertBus()
globalForAlerts.alertBus = alertBus
