import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { Libro } from "../types/Libro";

interface LibroCardProps {
  libro: Libro;
}

export function LibroCard({ libro }: LibroCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{libro.autor}</Typography>
        <Typography variant="body2" color="text.secondary">
          {libro.descripcion}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Año: {libro.anio}
        </Typography>
      </CardContent>
    </Card>
  );
}
