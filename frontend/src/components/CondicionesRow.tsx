import Box from "@mui/material/Box";
import type { CondicionClimatica } from "../types/CondicionClimatica";
import { CondicionCard } from "./CondicionCard";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";

function clasificar(valor: string | null, umbrales: [number, number, number]): "normal" | "moderado" | "alto" | "extremo" {
  if (!valor) return "normal";
  const n = parseFloat(valor.replace(",", "."));
  if (isNaN(n)) return "normal";
  if (n >= umbrales[2]) return "extremo";
  if (n >= umbrales[1]) return "alto";
  if (n >= umbrales[0]) return "moderado";
  return "normal";
}

interface CondicionesRowProps {
  condicion: CondicionClimatica | null;
}

export function CondicionesRow({ condicion }: CondicionesRowProps) {
  return (
    <Box display="flex" gap={2} sx={{ overflowX: "auto", pb: 1, py: 1 }}>
      <CondicionCard
        label="Temperatura"
        valor={condicion?.tmed ?? null}
        unidad="°C"
        nivel={clasificar(condicion?.tmed ?? null, [30, 37, 42])}
        icon={<ThermostatIcon />}
      />
      <CondicionCard
        label="T. Máxima"
        valor={condicion?.tmax ?? null}
        unidad="°C"
        nivel={clasificar(condicion?.tmax ?? null, [33, 38, 43])}
        icon={<ThermostatIcon color="error" />}
      />
      <CondicionCard
        label="T. Mínima"
        valor={condicion?.tmin ?? null}
        unidad="°C"
        nivel={clasificar(condicion?.tmin ?? null, [25, 30, 35])}
        icon={<ThermostatIcon color="primary" />}
      />
      <CondicionCard
        label="Precipitación"
        valor={condicion?.prec ?? null}
        unidad="mm"
        nivel={clasificar(condicion?.prec ?? null, [20, 40, 80])}
        icon={<WaterDropIcon />}
      />
      <CondicionCard
        label="Humedad"
        valor={condicion?.hrMedia ?? null}
        unidad="%"
        nivel={clasificar(condicion?.hrMedia ?? null, [70, 85, 95])}
        icon={<OpacityIcon />}
      />
      <CondicionCard
        label="Viento"
        valor={condicion?.velmedia ?? null}
        unidad="km/h"
        nivel={clasificar(condicion?.velmedia ?? null, [40, 70, 100])}
        icon={<AirIcon />}
      />
      <CondicionCard
        label="Racha máx."
        valor={condicion?.racha ?? null}
        unidad="km/h"
        nivel={clasificar(condicion?.racha ?? null, [60, 90, 120])}
        icon={<AirIcon sx={{ transform: "rotate(45deg)" }} />}
      />
    </Box>
  );
}
