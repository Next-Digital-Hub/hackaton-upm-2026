import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { Alerta } from "../types/Alerta";

interface AlertasContainerProps {
  alertas: Alerta[];
}

const nivelColor: Record<string, "success" | "warning" | "error" | "default"> = {
  VERDE: "success",
  AMARILLO: "warning",
  NARANJA: "warning",
  ROJO: "error",
};

export function AlertasContainer({ alertas }: AlertasContainerProps) {
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
        alertas.map((a) => (
          <Paper
            key={a.id}
            variant="outlined"
            sx={{ p: 2, mb: 1.5, borderRadius: 2 }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {a.tipo && <Chip label={a.tipo} size="small" />}
              {a.nivel && (
                <Chip label={a.nivel} size="small" color={nivelColor[a.nivel] ?? "default"} />
              )}
              {a.fecha && (
                <Typography variant="caption" color="text.secondary">
                  {a.fecha}
                </Typography>
              )}
            </Box>
            {a.descripcion && (
              <Typography variant="body2" mb={1}>{a.descripcion}</Typography>
            )}
            {a.recomendaciones && a.recomendaciones.length > 0 && (
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {a.recomendaciones.map((r, i) => (
                  <Typography component="li" variant="body2" key={i} color="text.secondary">
                    {r}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
}
