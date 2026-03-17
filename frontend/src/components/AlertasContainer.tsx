import { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import {
  Thermostat as ThermostatIcon,
  WaterDrop as WaterDropIcon,
  Air as AirIcon,
  Opacity as OpacityIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import type { Alerta } from "../types/Alerta";

interface AlertasContainerProps {
  alertas: Alerta[];
}

const nivelBorderColor: Record<string, string> = {
  VERDE: "#4caf50",
  AMARILLO: "#ffc107",
  NARANJA: "#ed6c02",
  ROJO: "#d32f2f",
};

const tipoIcon: Record<string, React.ReactNode> = {
  TEMPERATURA: <ThermostatIcon />,
  LLUVIA: <WaterDropIcon />,
  VIENTO: <AirIcon />,
  PRESION: <SpeedIcon />,
  HUMEDAD: <OpacityIcon />,
};

export function AlertasContainer({ alertas }: AlertasContainerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Alertas activas
      </Typography>

      {alertas.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
          <Typography color="text.secondary">
            No hay alertas para ti. Todo en calma.
          </Typography>
        </Paper>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {alertas.map((a) => {
            const borderColor = nivelBorderColor[a.nivel] ?? "#bdbdbd";
            const icon = tipoIcon[a.tipo] ?? <WarningIcon />;

            return (
              <Paper
                key={a.id}
                variant="outlined"
                sx={{
                  width: 280,
                  borderRadius: 2,
                  border: `2px solid ${borderColor}`,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {/* Cabecera */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1,
                    borderBottom: `1px solid ${borderColor}`,
                    bgcolor: `${borderColor}14`,
                  }}
                >
                  <Box sx={{ color: borderColor, display: "flex" }}>{icon}</Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1 }}>
                    {a.tipo ?? "Alerta"}
                  </Typography>
                  {a.nivel && (
                    <Chip
                      label={a.nivel}
                      size="small"
                      sx={{
                        bgcolor: borderColor,
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: 22,
                      }}
                    />
                  )}
                </Box>

                {/* Cuerpo */}
                <Box sx={{ px: 1.5, py: 1.2, flex: 1 }}>
                  {a.descripcion && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {a.descripcion}
                    </Typography>
                  )}
                  {a.fecha && (
                    <Typography variant="caption" color="text.secondary">
                      {a.fecha}
                    </Typography>
                  )}
                </Box>

                {/* Recomendaciones expandibles */}
                {a.recomendaciones && a.recomendaciones.length > 0 && (
                  <>
                    <Box
                      onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        cursor: "pointer",
                        borderTop: "1px solid",
                        borderColor: "divider",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Recomendaciones
                      </Typography>
                      <ExpandMoreIcon
                        sx={{
                          fontSize: 18,
                          color: "text.secondary",
                          transition: "transform 0.2s",
                          transform: expandedId === a.id ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </Box>
                    <Collapse in={expandedId === a.id}>
                      <Box component="ul" sx={{ m: 0, px: 2.5, py: 1, listStyle: "disc" }}>
                        {a.recomendaciones.map((r, i) => (
                          <Typography
                            component="li"
                            variant="caption"
                            key={i}
                            color="text.secondary"
                            sx={{ mb: 0.3 }}
                          >
                            {r}
                          </Typography>
                        ))}
                      </Box>
                    </Collapse>
                  </>
                )}
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
