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
  CloudOff,
  Users,
  BellRing,
  Database,
  MessageSquare,
} from "lucide-react";

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Weather data */}
      {weatherResult.success && weatherResult.data ? (
        <div>
          <h2 className="mb-2 text-lg font-semibold">Datos meteorológicos</h2>
          <WeatherCards weather={weatherResult.data.normal} />
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
