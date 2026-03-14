import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import type { Libro } from "../types/Libro";

interface LibroCardProps {
  libro: Libro;
  onEdit: (libro: Libro) => void;
  onDelete: (id: string) => void;
}

export function LibroCard({ libro, onEdit, onDelete }: LibroCardProps) {
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
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button size="small" onClick={() => onEdit(libro)}>
          Editar
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(libro.id)}>
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
}
