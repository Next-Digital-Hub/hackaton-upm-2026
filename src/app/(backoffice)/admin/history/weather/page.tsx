import { getAdminWeatherHistoryAction } from "@/actions/weather";
import { parseWeatherData } from "@/lib/weather";
import type { AemetWeatherRaw } from "@/lib/hackathon-api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminWeatherHistoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const result = await getAdminWeatherHistoryAction(page, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial Meteorológico</h1>
        <p className="text-sm text-muted-foreground">
          Todos los registros meteorológicos almacenados en el sistema
        </p>
      </div>

      {result.success && result.data ? (
        <>
          {result.data.records.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay registros meteorológicos aún.
            </p>
          ) : (
            <div className="space-y-3">
              {result.data.records.map((record) => {
                const weather = parseWeatherData(record.data as unknown as AemetWeatherRaw);
                return (
                  <Card key={record.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          {weather.station} ({weather.province}) — {weather.date}
                        </CardTitle>
                        <div className="flex gap-2">
                          {record.disaster ? (
                            <Badge variant="destructive">Desastre</Badge>
                          ) : (
                            <Badge variant="outline">Normal</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-4">
                        <div>
                          <span className="text-muted-foreground">Temp. media:</span>{" "}
                          {weather.tempAvg !== null ? `${weather.tempAvg}°C` : "N/D"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Precipitación:</span>{" "}
                          {weather.precipitation !== null ? `${weather.precipitation} mm` : "N/D"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Humedad:</span>{" "}
                          {weather.humidityAvg !== null ? `${weather.humidityAvg}%` : "N/D"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Registrado:</span>{" "}
                          {new Date(record.fetchedAt).toLocaleString("es-ES", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination */}
              {result.data.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={`/admin/history/weather?page=${Math.max(1, page - 1)}`}
                    className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                  >
                    <ChevronLeft className="size-4" />
                    Anterior
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    Página {page} de {result.data.totalPages} ({result.data.total} registros)
                  </span>
                  <Link
                    href={`/admin/history/weather?page=${Math.min(result.data.totalPages, page + 1)}`}
                    className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${page >= result.data.totalPages ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
                  >
                    Siguiente
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-red-600">
          {result.error ?? "Error al cargar historial meteorológico."}
        </p>
      )}
    </div>
  );
}
