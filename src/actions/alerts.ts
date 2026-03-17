"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createAlertSchema, type CreateAlertInput } from "@/lib/validations";

/**
 * Get active alerts for display on the citizen dashboard.
 */
export async function getActiveAlertsAction(): Promise<{
  success: boolean;
  data?: Array<{
    id: string;
    title: string;
    description: string;
    severity: string;
    createdAt: Date;
  }>;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "No autenticado" };
    }

    const alerts = await prisma.alert.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: alerts.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        severity: a.severity,
        createdAt: a.createdAt,
      })),
    };
  } catch (error) {
    console.error("[getActiveAlertsAction] Error:", error);
    return { success: false, error: "Error al obtener alertas activas" };
  }
}

/**
 * Get alert history for the current user (notifications they've received).
 */
export async function getAlertHistoryAction(
  page: number = 1,
  pageSize: number = 10
): Promise<{
  success: boolean;
  data?: {
    notifications: Array<{
      id: string;
      readAt: Date | null;
      alert: {
        id: string;
        title: string;
        description: string;
        severity: string;
        createdAt: Date;
      };
    }>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "No autenticado" };
    }

    const [notifications, total] = await Promise.all([
      prisma.alertNotification.findMany({
        where: { userId: session.user.id },
        include: {
          alert: true,
        },
        orderBy: { alert: { createdAt: "desc" } },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.alertNotification.count({
        where: { userId: session.user.id },
      }),
    ]);

    return {
      success: true,
      data: {
        notifications: notifications.map((n) => ({
          id: n.id,
          readAt: n.readAt,
          alert: {
            id: n.alert.id,
            title: n.alert.title,
            description: n.alert.description,
            severity: n.alert.severity,
            createdAt: n.alert.createdAt,
          },
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("[getAlertHistoryAction] Error:", error);
    return { success: false, error: "Error al obtener historial de alertas" };
  }
}

/**
 * Mark an alert notification as read.
 */
export async function markAlertReadAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "No autenticado" };
    }

    await prisma.alertNotification.update({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: { readAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    console.error("[markAlertReadAction] Error:", error);
    return { success: false, error: "Error al marcar alerta como leída" };
  }
}

// ─── Admin Actions ────────────────────────────────────────────

/**
 * Get all alerts (admin view — includes inactive).
 */
export async function getAllAlertsAction(
  page: number = 1,
  pageSize: number = 20
): Promise<{
  success: boolean;
  data?: {
    alerts: Array<{
      id: string;
      title: string;
      description: string;
      severity: string;
      active: boolean;
      createdBy: string;
      createdAt: Date;
      _count: { notifications: number };
    }>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { _count: { select: { notifications: true } } },
      }),
      prisma.alert.count(),
    ]);

    return {
      success: true,
      data: {
        alerts: alerts.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          severity: a.severity,
          active: a.active,
          createdBy: a.createdBy,
          createdAt: a.createdAt,
          _count: a._count,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("[getAllAlertsAction] Error:", error);
    return { success: false, error: "Error al obtener alertas" };
  }
}

/**
 * Create a new alert and notify all citizens.
 */
export async function createAlertAction(
  input: CreateAlertInput
): Promise<{ success: boolean; alertId?: string; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    // Validate input
    const parsed = createAlertSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Datos de alerta no válidos" };
    }

    // Create the alert
    const alert = await prisma.alert.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        severity: parsed.data.severity as "LOW" | "MODERATE" | "SEVERE" | "EXTREME",
        createdBy: session.user.id,
      },
    });

    // Get all citizen users to notify
    const citizens = await prisma.user.findMany({
      where: { role: "CITIZEN" },
      select: { id: true },
    });

    // Create notifications for all citizens
    if (citizens.length > 0) {
      await prisma.alertNotification.createMany({
        data: citizens.map((citizen) => ({
          alertId: alert.id,
          userId: citizen.id,
        })),
      });
    }

    return { success: true, alertId: alert.id };
  } catch (error) {
    console.error("[createAlertAction] Error:", error);
    return { success: false, error: "Error al crear la alerta" };
  }
}

/**
 * Toggle an alert's active status.
 */
export async function toggleAlertAction(
  alertId: string
): Promise<{ success: boolean; active?: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      select: { active: true },
    });

    if (!alert) {
      return { success: false, error: "Alerta no encontrada" };
    }

    const updated = await prisma.alert.update({
      where: { id: alertId },
      data: { active: !alert.active },
    });

    return { success: true, active: updated.active };
  } catch (error) {
    console.error("[toggleAlertAction] Error:", error);
    return { success: false, error: "Error al actualizar la alerta" };
  }
}

/**
 * Get admin stats (counts for dashboard overview).
 */
export async function getAdminStatsAction(): Promise<{
  success: boolean;
  data?: {
    totalUsers: number;
    totalAlerts: number;
    activeAlerts: number;
    totalLlmQueries: number;
    totalWeatherRecords: number;
  };
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const [totalUsers, totalAlerts, activeAlerts, totalLlmQueries, totalWeatherRecords] =
      await Promise.all([
        prisma.user.count({ where: { role: "CITIZEN" } }),
        prisma.alert.count(),
        prisma.alert.count({ where: { active: true } }),
        prisma.llmQuery.count(),
        prisma.weatherRecord.count(),
      ]);

    return {
      success: true,
      data: { totalUsers, totalAlerts, activeAlerts, totalLlmQueries, totalWeatherRecords },
    };
  } catch (error) {
    console.error("[getAdminStatsAction] Error:", error);
    return { success: false, error: "Error al obtener estadísticas" };
  }
}
