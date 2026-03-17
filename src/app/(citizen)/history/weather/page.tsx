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
import { AlertCircle, CloudRain, Thermometer } from "lucide-react";

export default async function WeatherHistoryPage() {
  const result = await getWeatherHistoryAction(1, 20);

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

          {result.data && result.data.totalPages > 1 && (
            <p className="text-center text-sm text-muted-foreground">
              Mostrando página {result.data.page} de {result.data.totalPages} (
              {result.data.total} registros)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
