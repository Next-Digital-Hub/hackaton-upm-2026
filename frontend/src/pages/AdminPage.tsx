import { useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Delete as DeleteIcon, PowerSettingsNew as PowerSettingsNewIcon } from "@mui/icons-material";
import type { CondicionClimatica } from "../types/CondicionClimatica";
import type { Alerta } from "../types/Alerta";
import { getCondicionesByProvincia, getAlertasByAdmin, crearAlerta, apagarAlerta, encenderAlerta, eliminarAlerta, getTiposAlerta, getNivelesAlerta } from "../config/api";
import { CondicionesRow } from "../components/CondicionesRow";

// TODO: el admin podrá seleccionar provincia
const PROVINCIA = "VALENCIA";

const emptyForm = {
  tipo: "" as string,
  nivel: "" as string,
  provincia: "",
  valorDetectado: "",
  umbralSuperado: "",
  descripcion: "",
  recomendaciones: "",
};

export function AdminPage() {
  const [condicion, setCondicion] = useState<CondicionClimatica | null>(null);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [tiposAlerta, setTiposAlerta] = useState<string[]>([]);
  const [nivelesAlerta, setNivelesAlerta] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const cargarAlertas = useCallback(() => {
    getAlertasByAdmin()
      .then(setAlertas)
      .catch(() => setAlertas([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCondicionesByProvincia(PROVINCIA).catch(() => []),
      getAlertasByAdmin().catch(() => []),
      getTiposAlerta().catch(() => []),
      getNivelesAlerta().catch(() => []),
    ])
      .then(([conds, alts, tipos, niveles]) => {
        setCondicion(conds[0] ?? null);
        setAlertas(alts);
        setTiposAlerta(tipos.length > 0 ? tipos : ["TEMPERATURA", "LLUVIA", "VIENTO", "PRESION", "HUMEDAD"]);
        setNivelesAlerta(niveles.length > 0 ? niveles : ["VERDE", "AMARILLO", "NARANJA", "ROJO"]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const nueva: Partial<Alerta> = {
        isActive: true,
      };
      if (form.tipo) nueva.tipo = form.tipo;
      if (form.nivel) nueva.nivel = form.nivel;
      if (form.provincia) nueva.provincia = form.provincia;
      if (form.valorDetectado) nueva.valorDetectado = form.valorDetectado;
      if (form.umbralSuperado) nueva.umbralSuperado = form.umbralSuperado;
      if (form.descripcion) nueva.descripcion = form.descripcion;
      if (form.recomendaciones.trim()) {
        nueva.recomendaciones = form.recomendaciones.split("\n").filter(Boolean);
      }
      await crearAlerta(nueva);
      setDialogOpen(false);
      setForm(emptyForm);
      cargarAlertas();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al crear alerta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (alerta: Alerta) => {
    try {
      if (alerta.isActive) {
        await apagarAlerta(alerta.id);
      } else {
        await encenderAlerta(alerta.id);
      }
      cargarAlertas();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cambiar estado");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarAlerta(id);
      cargarAlertas();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al eliminar alerta");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  const nivelColor: Record<string, string> = {
    VERDE: "success",
    AMARILLO: "warning",
    NARANJA: "warning",
    ROJO: "error",
  };

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

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Mis alertas</Typography>
        <Button variant="contained" color="error" onClick={() => setDialogOpen(true)}>
          Emitir alerta
        </Button>
      </Box>

      {alertas.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
          <Typography color="text.secondary">No has emitido ninguna alerta aún.</Typography>
        </Paper>
      ) : (
        alertas.map((a) => (
          <Paper
            key={a.id}
            variant="outlined"
            sx={{
              p: 2,
              mb: 1.5,
              borderRadius: 2,
              opacity: a.isActive ? 1 : 0.55,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                {a.tipo && <Chip label={a.tipo} size="small" />}
                {a.nivel && (
                  <Chip
                    label={a.nivel}
                    size="small"
                    color={nivelColor[a.nivel] as "success" | "warning" | "error" | undefined}
                  />
                )}
                <Chip
                  label={a.isActive ? "Activa" : "Inactiva"}
                  size="small"
                  variant={a.isActive ? "filled" : "outlined"}
                  color={a.isActive ? "success" : "default"}
                />
                {a.provincia && (
                  <Typography variant="caption" color="text.secondary">
                    {a.provincia}
                  </Typography>
                )}
              </Box>
              {a.descripcion && <Typography variant="body2">{a.descripcion}</Typography>}
              {a.fecha && (
                <Typography variant="caption" color="text.secondary">
                  {a.fecha}
                </Typography>
              )}
            </Box>
            <Tooltip title={a.isActive ? "Apagar" : "Encender"}>
              <IconButton
                color={a.isActive ? "warning" : "success"}
                onClick={() => handleToggle(a)}
                aria-label={a.isActive ? "Apagar alerta" : "Encender alerta"}
              >
                <PowerSettingsNewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton color="error" onClick={() => handleDelete(a.id)} aria-label="Eliminar alerta">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        ))
      )}

      {/* Dialog para emitir nueva alerta */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Emitir nueva alerta</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
          <TextField
            select
            label="Tipo"
            value={form.tipo}
            onChange={(e) => handleChange("tipo", e.target.value)}
          >
            <MenuItem value="">— Ninguno —</MenuItem>
            {tiposAlerta.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Nivel"
            value={form.nivel}
            onChange={(e) => handleChange("nivel", e.target.value)}
          >
            <MenuItem value="">— Ninguno —</MenuItem>
            {nivelesAlerta.map((n) => (
              <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
          </TextField>
          <TextField label="Provincia" value={form.provincia} onChange={(e) => handleChange("provincia", e.target.value)} />
          <TextField label="Valor detectado" value={form.valorDetectado} onChange={(e) => handleChange("valorDetectado", e.target.value)} />
          <TextField label="Umbral superado" value={form.umbralSuperado} onChange={(e) => handleChange("umbralSuperado", e.target.value)} />
          <TextField label="Descripción" multiline rows={3} value={form.descripcion} onChange={(e) => handleChange("descripcion", e.target.value)} />
          <TextField
            label="Recomendaciones (una por línea)"
            multiline
            rows={3}
            value={form.recomendaciones}
            onChange={(e) => handleChange("recomendaciones", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Emitiendo…" : "Emitir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
