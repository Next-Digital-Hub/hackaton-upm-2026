"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { queryLlm } from "@/lib/hackathon-api";
import {
  buildCitizenSystemPrompt,
  buildCitizenUserPrompt,
  buildAdminSystemPrompt,
  buildAdminUserPrompt,
} from "@/lib/prompts";
import { parseWeatherData, type WeatherParsed } from "@/lib/weather";
import { fetchWeather } from "@/lib/hackathon-api";

/**
 * Get personalized LLM recommendations based on current weather + user profile.
 * Persists the query and response to DB.
 */
export async function getLlmRecommendationAction(): Promise<{
  success: boolean;
  data?: {
    recommendation: string;
    queryId: string;
  };
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "No autenticado" };
    }

    // Fetch current weather
    const weatherRaw = await fetchWeather(false);
    const weather: WeatherParsed = parseWeatherData(weatherRaw);

    // Build prompts with user profile
    const systemPrompt = buildCitizenSystemPrompt();
    const userPrompt = buildCitizenUserPrompt(weather, {
      province: session.user.province,
      housingType: session.user.housingType,
      specialNeeds: session.user.specialNeeds,
      name: session.user.name,
    });

    // Call LLM API
    const llmResponse = await queryLlm(systemPrompt, userPrompt);

    // Extract text from response — handle various response formats
    let responseText: string;
    if (typeof llmResponse === "string") {
      responseText = llmResponse;
    } else if (
      llmResponse &&
      typeof llmResponse === "object" &&
      "response" in llmResponse
    ) {
      responseText = String(llmResponse.response);
    } else if (
      llmResponse &&
      typeof llmResponse === "object" &&
      "message" in llmResponse
    ) {
      responseText = String(llmResponse.message);
    } else if (
      llmResponse &&
      typeof llmResponse === "object" &&
      "content" in llmResponse
    ) {
      responseText = String(llmResponse.content);
    } else if (
      llmResponse &&
      typeof llmResponse === "object" &&
      "text" in llmResponse
    ) {
      responseText = String(llmResponse.text);
    } else {
      responseText = JSON.stringify(llmResponse);
    }

    // Persist to DB
    const query = await prisma.llmQuery.create({
      data: {
        userId: session.user.id,
        systemPrompt,
        userPrompt,
        response: responseText,
      },
    });

    return {
      success: true,
      data: {
        recommendation: responseText,
        queryId: query.id,
      },
    };
  } catch (error) {
    console.error("[getLlmRecommendationAction] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener recomendaciones",
    };
  }
}

/**
 * Get LLM query history for the current user.
 */
export async function getLlmHistoryAction(
  page: number = 1,
  pageSize: number = 10
): Promise<{
  success: boolean;
  data?: {
    queries: Array<{
      id: string;
      systemPrompt: string;
      userPrompt: string;
      response: string;
      createdAt: Date;
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

    const [queries, total] = await Promise.all([
      prisma.llmQuery.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.llmQuery.count({
        where: { userId: session.user.id },
      }),
    ]);

    return {
      success: true,
      data: {
        queries,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("[getLlmHistoryAction] Error:", error);
    return {
      success: false,
      error: "Error al obtener historial de consultas LLM",
    };
  }
}

// ─── Admin LLM Actions ───────────────────────────────────────

/**
 * Get an LLM-based alert recommendation based on current weather data.
 * Admin-only. Compares normal vs disaster scenario.
 */
export async function getAdminLlmRecommendationAction(): Promise<{
  success: boolean;
  data?: {
    recommendation: string;
    queryId: string;
  };
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    // Fetch both weather scenarios
    const [normalRaw, disasterRaw] = await Promise.all([
      fetchWeather(false),
      fetchWeather(true),
    ]);

    const normalWeather = parseWeatherData(normalRaw);
    const disasterWeather = parseWeatherData(disasterRaw);

    // Build admin prompts
    const systemPrompt = buildAdminSystemPrompt();
    const userPrompt = buildAdminUserPrompt(normalWeather, disasterWeather);

    // Call LLM API
    const llmResponse = await queryLlm(systemPrompt, userPrompt);

    // Extract text
    let responseText: string;
    if (typeof llmResponse === "string") {
      responseText = llmResponse;
    } else if (llmResponse && typeof llmResponse === "object" && "response" in llmResponse) {
      responseText = String(llmResponse.response);
    } else if (llmResponse && typeof llmResponse === "object" && "message" in llmResponse) {
      responseText = String(llmResponse.message);
    } else if (llmResponse && typeof llmResponse === "object" && "content" in llmResponse) {
      responseText = String(llmResponse.content);
    } else if (llmResponse && typeof llmResponse === "object" && "text" in llmResponse) {
      responseText = String(llmResponse.text);
    } else {
      responseText = JSON.stringify(llmResponse);
    }

    // Persist to DB
    const query = await prisma.llmQuery.create({
      data: {
        userId: session.user.id,
        systemPrompt,
        userPrompt,
        response: responseText,
      },
    });

    return {
      success: true,
      data: {
        recommendation: responseText,
        queryId: query.id,
      },
    };
  } catch (error) {
    console.error("[getAdminLlmRecommendationAction] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener recomendación IA",
    };
  }
}

/**
 * Get ALL LLM queries (admin view — not user-filtered).
 */
export async function getAdminLlmHistoryAction(
  page: number = 1,
  pageSize: number = 10
): Promise<{
  success: boolean;
  data?: {
    queries: Array<{
      id: string;
      systemPrompt: string;
      userPrompt: string;
      response: string;
      createdAt: Date;
      user: { name: string | null; email: string };
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

    const [queries, total] = await Promise.all([
      prisma.llmQuery.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.llmQuery.count(),
    ]);

    return {
      success: true,
      data: {
        queries,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("[getAdminLlmHistoryAction] Error:", error);
    return {
      success: false,
      error: "Error al obtener historial global de consultas LLM",
    };
  }
}
