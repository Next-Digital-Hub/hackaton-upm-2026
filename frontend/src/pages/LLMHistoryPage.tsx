import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { ExpandMore as ExpandMoreIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import type { LLMCall } from "../types/LLMCall";
import { getLLMCalls } from "../config/api";

interface LLMHistoryPageProps {
  onBack: () => void;
}

export function LLMHistoryPage({ onBack }: LLMHistoryPageProps) {
  const [calls, setCalls] = useState<LLMCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedField, setExpandedField] = useState<"prompt" | "respuesta" | null>(null);

  useEffect(() => {
    getLLMCalls()
      .then(setCalls)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string, field: "prompt" | "respuesta") => {
    if (expandedId === id && expandedField === field) {
      setExpandedId(null);
      setExpandedField(null);
    } else {
      setExpandedId(id);
      setExpandedField(field);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ textTransform: "none" }}
        >
          Volver
        </Button>
        <Typography variant="h5">Historial de llamadas LLM</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {calls.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
          <Typography color="text.secondary">No hay llamadas registradas.</Typography>
        </Paper>
      ) : (
        calls.map((c) => (
          <Paper
            key={c.id}
            variant="outlined"
            sx={{ mb: 1.5, borderRadius: 2, overflow: "hidden" }}
          >
            {/* Header */}
            <Box sx={{ px: 2, py: 1.2, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                {c.fecha ?? "Sin fecha"}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {c.id.slice(0, 8)}…
              </Typography>
            </Box>

            {/* Prompt expandible */}
            <Box
              onClick={() => toggle(c.id, "prompt")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 2,
                py: 0.7,
                cursor: "pointer",
                borderTop: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                Prompt
              </Typography>
              <ExpandMoreIcon
                sx={{
                  fontSize: 18,
                  color: "text.secondary",
                  transition: "transform 0.2s",
                  transform: expandedId === c.id && expandedField === "prompt" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Box>
            <Collapse in={expandedId === c.id && expandedField === "prompt"}>
              <Box sx={{ px: 2, py: 1, bgcolor: "#f9f9f9" }}>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "0.82rem" }}
                >
                  {c.prompt}
                </Typography>
              </Box>
            </Collapse>

            {/* Respuesta expandible */}
            <Box
              onClick={() => toggle(c.id, "respuesta")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 2,
                py: 0.7,
                cursor: "pointer",
                borderTop: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                Respuesta
              </Typography>
              <ExpandMoreIcon
                sx={{
                  fontSize: 18,
                  color: "text.secondary",
                  transition: "transform 0.2s",
                  transform: expandedId === c.id && expandedField === "respuesta" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Box>
            <Collapse in={expandedId === c.id && expandedField === "respuesta"}>
              <Box sx={{ px: 2, py: 1, bgcolor: "#f9f9f9" }}>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "0.82rem" }}
                >
                  {c.respuesta}
                </Typography>
              </Box>
            </Collapse>
          </Paper>
        ))
      )}
    </Container>
  );
}
