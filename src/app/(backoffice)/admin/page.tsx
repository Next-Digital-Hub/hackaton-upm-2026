import { getWeatherAction } from "@/actions/weather";
import { getAdminStatsAction } from "@/actions/alerts";
import { WeatherCards } from "@/components/features/weather-cards";
import { AdminLlmRecommendation } from "@/components/features/admin-llm-recommendation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  CloudOff,
  Users,
  Bell,
  BellRing,
  Database,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [weatherResult, statsResult] = await Promise.all([
    getWeatherAction(),
    getAdminStatsAction(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-sm text-muted-foreground">
          Visión general del sistema y evaluación de riesgos
        </p>
      </div>

      {/* Quick stats */}
      {statsResult.success && statsResult.data && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ciudadanos</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsResult.data.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas activas</CardTitle>
              <BellRing className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsResult.data.activeAlerts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total alertas</CardTitle>
              <Bell className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsResult.data.totalAlerts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas IA</CardTitle>
              <MessageSquare className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsResult.data.totalLlmQueries}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reg. meteorológicos</CardTitle>
              <Database className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsResult.data.totalWeatherRecords}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weather data — normal + disaster comparison */}
      {weatherResult.success && weatherResult.data ? (
        <div className="space-y-4">
          {/* Disaster scenario warning */}
          {weatherResult.data.isDisasterScenario && (
            <Alert className="border-orange-300 bg-orange-50 text-orange-900">
              <AlertTriangle className="size-4" />
              <AlertTitle>Escenario de riesgo detectado</AlertTitle>
              <AlertDescription>
                Los modelos muestran precipitación extrema ({weatherResult.data.disaster.precipitation?.toFixed(1) ?? "N/D"} mm) en escenario de desastre vs{" "}
                {weatherResult.data.normal.precipitation?.toFixed(1) ?? "N/D"} mm normales.{" "}
                <Link href="/admin/alerts" className="font-medium underline">
                  Crear alerta →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* Normal weather */}
          <div>
            <h2 className="mb-2 text-lg font-semibold">Datos meteorológicos — Escenario normal</h2>
            <WeatherCards weather={weatherResult.data.normal} />
          </div>

          {/* Disaster weather */}
          <div>
            <h2 className="mb-2 text-lg font-semibold">Datos meteorológicos — Escenario desastre</h2>
            <WeatherCards weather={weatherResult.data.disaster} />
          </div>
        </div>
      ) : (
        <Alert variant="destructive">
          <CloudOff className="size-4" />
          <AlertTitle>Error al cargar datos meteorológicos</AlertTitle>
          <AlertDescription>
            {weatherResult.error ?? "No se pudieron obtener los datos del servidor."}
          </AlertDescription>
        </Alert>
      )}

      {/* LLM Alert Recommendation */}
      <AdminLlmRecommendation />
    </div>
  );
}
