import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

interface CondicionCardProps {
  label: string;
  valor: string | null;
  unidad?: string;
  nivel?: "normal" | "moderado" | "alto" | "extremo";
  icon?: ReactNode;
}

const coloresByNivel: Record<string, string> = {
  normal: "#4caf50",
  moderado: "#ff9800",
  alto: "#f44336",
  extremo: "#b71c1c",
};

export function CondicionCard({ label, valor, unidad, nivel = "normal", icon }: CondicionCardProps) {
  const color = coloresByNivel[nivel];

  return (
    <Card
      sx={{
        minWidth: 130,
        borderTop: `4px solid ${color}`,
        textAlign: "center",
        flex: "0 0 auto",
        borderRadius: 2,
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" }
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        {icon && (
          <Box sx={{ color, mb: 0.5, opacity: 0.8, display: "flex", justifyContent: "center" }}>
            {icon}
          </Box>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="baseline" gap={0.5} mt={0.5}>
          <Typography variant="h5" fontWeight={700} sx={{ color }}>
            {valor ?? "—"}
          </Typography>
          {unidad && (
            <Typography variant="caption" color="text.secondary">
              {unidad}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
