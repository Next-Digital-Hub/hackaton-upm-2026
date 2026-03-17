import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import type { CondicionClimatica } from "../types/CondicionClimatica";
import { getCondicionesByProvincia } from "../config/api";
import { CondicionesRow } from "../components/CondicionesRow";

// TODO: el admin podrá seleccionar provincia
const PROVINCIA = "VALENCIA";

export function AdminPage() {
  const [condicion, setCondicion] = useState<CondicionClimatica | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getCondicionesByProvincia(PROVINCIA)
      .then((conds) => setCondicion(conds[0] ?? null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración — {PROVINCIA}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box mb={4}>
        <CondicionesRow condicion={condicion} />
      </Box>
    </Container>
  );
}
