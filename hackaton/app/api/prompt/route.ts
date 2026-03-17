import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { system_prompt, user_prompt } = (await request.json()) as {
      system_prompt?: string;
      user_prompt?: string;
    };

    if (!system_prompt || !user_prompt) {
      return NextResponse.json(
        { error: "Faltan system_prompt o user_prompt" },
        { status: 400 },
      );
    }

    const url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/prompt";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqZXN1cyIsImV4cCI6MTc3MzgyMzM4MH0.m2YZVsFSXmhVOE54h_yMdiugogfHDifC2pvAghmin6o";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ system_prompt, user_prompt }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error en la API IA: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: `No se pudo obtener respuesta de IA: ${message}` },
      { status: 500 },
    );
  }
}
