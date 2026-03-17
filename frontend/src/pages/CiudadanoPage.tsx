import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import type { CondicionClimatica } from "../types/CondicionClimatica";
import type { Alerta } from "../types/Alerta";
import { getCondiciones, getMisAlertasCiudadano } from "../config/api";
import { CondicionesRow } from "../components/CondicionesRow";
import { AlertasContainer } from "../components/AlertasContainer";
import Button from "@mui/material/Button";

export function CiudadanoPage() {
  const [condicion, setCondicion] = useState<CondicionClimatica | null>(null);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getMisAlertasCiudadano().catch(() => []),
      getCondiciones().catch(() => null),
    ])
      .then(([alts, cond]) => {
        setAlertas(alts);
        setCondicion(cond);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRefrescarClima = async () => {
    setError(null);
    try {
      const cond = await getCondiciones();
      setCondicion(cond);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al refrescar clima");
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
      <Typography variant="h4" gutterBottom>
        Mis alertas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box mb={4} position="relative">
        <Box position="absolute" right={0} top={-40}>
          <Button size="small" variant="outlined" onClick={handleRefrescarClima}>
            Ver clima actual
          </Button>
        </Box>
        <CondicionesRow condicion={condicion} />
      </Box>

      <AlertasContainer alertas={alertas} />
    </Container>
  );
}
