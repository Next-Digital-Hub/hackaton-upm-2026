import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: string;
  createdAt: Date;
}

interface AlertBannerProps {
  alerts: AlertItem[];
}

const severityConfig: Record<
  string,
  {
    icon: typeof AlertTriangle;
    className: string;
    variant?: "destructive" | "default";
  }
> = {
  EXTREME: {
    icon: AlertTriangle,
    className: "",
    variant: "destructive",
  },
  SEVERE: {
    icon: AlertTriangle,
    className: "border-orange-300 bg-orange-50 text-orange-900",
  },
  MODERATE: {
    icon: AlertCircle,
    className: "border-amber-300 bg-amber-50 text-amber-900",
  },
  LOW: {
    icon: Info,
    className: "border-blue-300 bg-blue-50 text-blue-900",
  },
};

export function AlertBanner({ alerts }: AlertBannerProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity] ?? severityConfig.LOW;
        const Icon = config.icon;

        return (
          <Alert
            key={alert.id}
            variant={config.variant ?? "default"}
            className={config.variant ? undefined : config.className}
          >
            <Icon className="size-4" />
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>
              {alert.description}
              <span className="mt-1 block text-xs opacity-70">
                {new Date(alert.createdAt).toLocaleString("es-ES", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
}
