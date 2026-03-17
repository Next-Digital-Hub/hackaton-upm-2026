"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fetchWeather } from "@/lib/hackathon-api";
import { parseWeatherData, type WeatherParsed } from "@/lib/weather";

export interface WeatherResult {
  normal: WeatherParsed;
  disaster: WeatherParsed;
  isDisasterScenario: boolean;
}

/**
 * Fetch weather data (both normal and disaster scenarios),
 * persist to DB, and return parsed results.
 */
export async function getWeatherAction(): Promise<{
  success: boolean;
  data?: WeatherResult;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "No autenticado" };
    }

    // Fetch both scenarios in parallel
    const [normalRaw, disasterRaw] = await Promise.all([
      fetchWeather(false),
      fetchWeather(true),
    ]);

    const normal = parseWeatherData(normalRaw);
    const disaster = parseWeatherData(disasterRaw);

    // Check if disaster scenario shows significantly worse conditions
    const isDisasterScenario =
      disaster.precipitation !== null &&
      normal.precipitation !== null &&
      disaster.precipitation > normal.precipitation * 3;

    // Persist normal weather record to DB
    await prisma.weatherRecord.create({
      data: {
        data: JSON.parse(JSON.stringify(normalRaw)),
        province: normal.province,
        disaster: false,
        fetchedAt: new Date(),
      },
    });

    // Persist disaster weather record to DB
    await prisma.weatherRecord.create({
      data: {
        data: JSON.parse(JSON.stringify(disasterRaw)),
        province: disaster.province,
        disaster: true,
        fetchedAt: new Date(),
      },
    });

    return {
      success: true,
      data: { normal, disaster, isDisasterScenario },
    };
  } catch (error) {
    console.error("[getWeatherAction] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener datos meteorológicos",
    };
  }
}

/**
 * Get weather history records from DB.
 */
export async function getWeatherHistoryAction(
  page: number = 1,
  pageSize: number = 10
): Promise<{
  success: boolean;
  data?: {
    records: Array<{
      id: string;
      data: Record<string, unknown>;
      province: string | null;
      disaster: boolean;
      fetchedAt: Date;
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

    const [records, total] = await Promise.all([
      prisma.weatherRecord.findMany({
        orderBy: { fetchedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.weatherRecord.count(),
    ]);

    return {
      success: true,
      data: {
        records: records.map((r) => ({
          id: r.id,
          data: r.data as Record<string, unknown>,
          province: r.province,
          disaster: r.disaster,
          fetchedAt: r.fetchedAt,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("[getWeatherHistoryAction] Error:", error);
    return {
      success: false,
      error: "Error al obtener historial meteorológico",
    };
  }
}

/**
 * Get ALL weather records (admin view — identical data, just explicit admin check).
 */
export async function getAdminWeatherHistoryAction(
  page: number = 1,
  pageSize: number = 10
): Promise<{
  success: boolean;
  data?: {
    records: Array<{
      id: string;
      data: Record<string, unknown>;
      province: string | null;
      disaster: boolean;
      fetchedAt: Date;
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

    const [records, total] = await Promise.all([
      prisma.weatherRecord.findMany({
        orderBy: { fetchedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.weatherRecord.count(),
    ]);

    return {
      success: true,
      data: {
        records: records.map((r) => ({
          id: r.id,
          data: r.data as Record<string, unknown>,
          province: r.province,
          disaster: r.disaster,
          fetchedAt: r.fetchedAt,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("[getAdminWeatherHistoryAction] Error:", error);
    return {
      success: false,
      error: "Error al obtener historial meteorológico global",
    };
  }
}
