import { getWeatherAction } from "@/actions/weather";
import { getActiveAlertsAction } from "@/actions/alerts";
import { WeatherCards } from "@/components/features/weather-cards";
import { AlertBanner } from "@/components/features/alert-banner";
import { LlmRecommendations } from "@/components/features/llm-recommendations";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CloudOff } from "lucide-react";

export default async function DashboardPage() {
  const [weatherResult, alertsResult] = await Promise.all([
    getWeatherAction(),
    getActiveAlertsAction(),
  ]);

  return (
    <div className="space-y-6">
      {/* Active alerts banner */}
      {alertsResult.success && alertsResult.data && (
        <AlertBanner alerts={alertsResult.data} />
      )}

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Datos meteorológicos en tiempo real
        </p>
      </div>

      {/* Weather data */}
      {weatherResult.success && weatherResult.data ? (
        <>
          {/* Disaster scenario warning */}
          {weatherResult.data.isDisasterScenario && (
            <Alert className="border-orange-300 bg-orange-50 text-orange-900">
              <AlertTriangle className="size-4" />
              <AlertTitle>Escenario de riesgo detectado</AlertTitle>
              <AlertDescription>
                Los modelos meteorológicos indican un escenario de
                precipitación extrema (
                {weatherResult.data.disaster.precipitation?.toFixed(1) ??
                  "N/D"}{" "}
                mm). Mantente atento a las indicaciones de Protección Civil.
              </AlertDescription>
            </Alert>
          )}

          {/* Weather metric cards */}
          <WeatherCards weather={weatherResult.data.normal} />
        </>
      ) : (
        <Alert variant="destructive">
          <CloudOff className="size-4" />
          <AlertTitle>Error al cargar datos meteorológicos</AlertTitle>
          <AlertDescription>
            {weatherResult.error ??
              "No se pudieron obtener los datos del servidor."}
          </AlertDescription>
        </Alert>
      )}

      {/* LLM Recommendations */}
      <LlmRecommendations />
    </div>
  );
}
