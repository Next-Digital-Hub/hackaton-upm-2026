import { getWeatherHistoryAction } from "@/actions/weather";
import { parseWeatherData } from "@/lib/weather";
import type { AemetWeatherRaw } from "@/lib/hackathon-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CloudRain, Thermometer, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function WeatherHistoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const result = await getWeatherHistoryAction(page, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial meteorológico</h1>
        <p className="text-sm text-muted-foreground">
          Registros de datos meteorológicos almacenados
        </p>
      </div>

      {!result.success ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {result.error ?? "Error al cargar historial"}
          </AlertDescription>
        </Alert>
      ) : result.data && result.data.records.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No hay registros meteorológicos todavía. Visita el Dashboard para
            generar el primer registro.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {result.data?.records.map((record) => {
            const raw = record.data as unknown as AemetWeatherRaw;
            const parsed = parseWeatherData(raw);

            return (
              <Card key={record.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {parsed.station} ({parsed.province})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {record.disaster && (
                        <Badge variant="destructive">Desastre</Badge>
                      )}
                      <Badge variant="outline">{parsed.date}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Registrado el{" "}
                    {new Date(record.fetchedAt).toLocaleString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Thermometer className="size-3.5 text-muted-foreground" />
                      <span>
                        {parsed.tempAvg !== null
                          ? `${parsed.tempAvg.toFixed(1)}°C`
                          : "N/D"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CloudRain className="size-3.5 text-muted-foreground" />
                      <span>
                        {parsed.precipitation !== null
                          ? `${parsed.precipitation.toFixed(1)} mm`
                          : "N/D"}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Humedad: {parsed.humidityAvg ?? "N/D"}%
                    </div>
                    <div className="text-muted-foreground">
                      T. máx: {parsed.tempMax?.toFixed(1) ?? "N/D"}°C / mín:{" "}
                      {parsed.tempMin?.toFixed(1) ?? "N/D"}°C
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {result.data && result.data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/history/weather?page=${Math.max(1, page - 1)}`}
                className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
              >
                <ChevronLeft className="size-4" />
                Anterior
              </Link>
              <span className="text-sm text-muted-foreground">
                Página {result.data.page} de {result.data.totalPages} ({result.data.total} registros)
              </span>
              <Link
                href={`/history/weather?page=${Math.min(result.data.totalPages, page + 1)}`}
                className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${page >= result.data.totalPages ? "pointer-events-none opacity-50" : "hover:bg-accent"}`}
              >
                Siguiente
                <ChevronRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
