import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { Alerta } from "../types/Alerta";

interface AlertasContainerProps {
  alertas: Alerta[];
}

export function AlertasContainer({ alertas }: AlertasContainerProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Alertas activas
      </Typography>

      {alertas.length === 0 ? (
        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          <Typography color="text.secondary">
            No hay alertas en tu zona. Todo en calma.
          </Typography>
        </Box>
      ) : (
        alertas.map((a) => (
          <Typography key={a.id}>{a.descripcion}</Typography>
        ))
      )}
    </Paper>
  );
}
