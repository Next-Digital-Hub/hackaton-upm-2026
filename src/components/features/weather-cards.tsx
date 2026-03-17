import type { WeatherParsed } from "@/lib/weather";
import { formatWeatherValue, getPrecipitationLevel } from "@/lib/weather";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Thermometer, CloudRain, Droplets, Wind } from "lucide-react";

interface WeatherCardsProps {
  weather: WeatherParsed;
}

export function WeatherCards({ weather }: WeatherCardsProps) {
  const precipLevel = getPrecipitationLevel(weather.precipitation);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Estación {weather.station} ({weather.province}) — {weather.date}
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Temperature */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
            <Thermometer className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatWeatherValue(weather.tempAvg, "°C")}
            </div>
            <p className="text-xs text-muted-foreground">
              Máx {formatWeatherValue(weather.tempMax, "°C")} / Mín{" "}
              {formatWeatherValue(weather.tempMin, "°C")}
            </p>
          </CardContent>
        </Card>

        {/* Precipitation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Precipitación
            </CardTitle>
            <CloudRain className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatWeatherValue(weather.precipitation, " mm")}
            </div>
            <p className="text-xs text-muted-foreground">
              {precipLevel.label}
            </p>
          </CardContent>
        </Card>

        {/* Humidity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humedad</CardTitle>
            <Droplets className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatWeatherValue(weather.humidityAvg, "%", 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Máx {formatWeatherValue(weather.humidityMax, "%", 0)} / Mín{" "}
              {formatWeatherValue(weather.humidityMin, "%", 0)}
            </p>
          </CardContent>
        </Card>

        {/* Wind */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viento</CardTitle>
            <Wind className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weather.windAvgSpeed !== null
                ? formatWeatherValue(weather.windAvgSpeed, " km/h")
                : "Sin datos"}
            </div>
            <p className="text-xs text-muted-foreground">
              {weather.windDirection
                ? `Dirección: ${weather.windDirection}`
                : "Dirección no disponible"}
              {weather.windGust
                ? ` · Rachas: ${weather.windGust} km/h`
                : ""}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
