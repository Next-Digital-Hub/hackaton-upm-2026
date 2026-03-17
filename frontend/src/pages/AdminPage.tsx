import React, { useEffect, useState, useCallback } from "react";
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
import Collapse from "@mui/material/Collapse";
import {
  Delete as DeleteIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Thermostat as ThermostatIcon,
  WaterDrop as WaterDropIcon,
  Air as AirIcon,
  Opacity as OpacityIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import type { CondicionClimatica } from "../types/CondicionClimatica";
import type { Alerta } from "../types/Alerta";
import { getCondiciones, getAlertasByAdmin, crearAlerta, apagarAlerta, encenderAlerta, eliminarAlerta, getTiposAlerta, getNivelesAlerta, generarAlertas, getProvincias } from "../config/api";
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
  const [provincias, setProvincias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const cargarAlertas = useCallback(() => {
    getAlertasByAdmin()
      .then(setAlertas)
      .catch(() => setAlertas([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAlertasByAdmin().catch(() => []),
      getTiposAlerta().catch(() => []),
      getNivelesAlerta().catch(() => []),
      getProvincias().catch(() => []),
      getCondiciones().catch(() => null),
    ])
      .then(([alts, tipos, niveles, p, cond]) => {
        setAlertas(alts);
        setTiposAlerta(tipos.length > 0 ? tipos : ["TEMPERATURA", "LLUVIA", "VIENTO", "PRESION", "HUMEDAD"]);
        setNivelesAlerta(niveles.length > 0 ? niveles : ["VERDE", "AMARILLO", "NARANJA", "ROJO"]);
        setProvincias(p);
        setCondicion(cond);
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
        active: true,
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
      if (alerta.active) {
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

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGenerar = async () => {
    setGenerando(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await generarAlertas();
      setSuccessMsg("Generación de alertas iniciada. Las alertas aparecerán en unos segundos.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al generar alertas");
    } finally {
      setGenerando(false);
    }
  };

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

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      <Box mb={4} position="relative">
        <Box position="absolute" right={0} top={-40}>
          <Button size="small" variant="outlined" onClick={handleRefrescarClima}>
            Refrescar clima
          </Button>
        </Box>
        <CondicionesRow condicion={condicion} />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Mis alertas</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerar}
            disabled={generando}
          >
            {generando ? "Generando…" : "Generar alertas"}
          </Button>
          <Button variant="contained" color="error" onClick={() => setDialogOpen(true)}>
            Emitir alerta
          </Button>
        </Box>
      </Box>

      {alertas.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
          <Typography color="text.secondary">No has emitido ninguna alerta aún.</Typography>
        </Paper>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {alertas.map((a) => {
            const borderColor = a.active
              ? (nivelBorderColor[a.nivel] ?? "#bdbdbd")
              : "#bdbdbd";
            const icon = tipoIcon[a.tipo] ?? <WarningIcon />;

            return (
              <Paper
                key={a.id}
                variant="outlined"
                sx={{
                  width: 260,
                  borderRadius: 2,
                  border: `2px solid ${borderColor}`,
                  bgcolor: a.active ? "background.paper" : "#f5f5f5",
                  opacity: a.active ? 1 : 0.7,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Cabecera con icono y tipo */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1,
                    borderBottom: `1px solid ${a.active ? borderColor : "#e0e0e0"}`,
                    bgcolor: a.active ? `${borderColor}14` : "#eeeeee",
                  }}
                >
                  <Box sx={{ color: a.active ? borderColor : "#9e9e9e", display: "flex" }}>
                    {icon}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1 }}>
                    {a.tipo ?? "Alerta"}
                  </Typography>
                  {a.nivel && (
                    <Chip
                      label={a.nivel}
                      size="small"
                      sx={{
                        bgcolor: a.active ? borderColor : "#bdbdbd",
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
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color: a.active ? "text.primary" : "text.disabled",
                      }}
                    >
                      {a.descripcion}
                    </Typography>
                  )}
                  <Box display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
                    {a.provincia && (
                      <Typography variant="caption" color="text.secondary">
                        {a.provincia.replace(/_/g, " ")}
                      </Typography>
                    )}
                    {a.fecha && (
                      <Typography variant="caption" color="text.secondary">
                        · {a.fecha}
                      </Typography>
                    )}
                  </Box>
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
                        {a.recomendaciones.map((r: string, i: number) => (
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

                {/* Acciones */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Tooltip title={a.active ? "Apagar" : "Encender"}>
                    <IconButton
                      size="small"
                      color={a.active ? "warning" : "success"}
                      onClick={() => handleToggle(a)}
                      aria-label={a.active ? "Apagar alerta" : "Encender alerta"}
                    >
                      <PowerSettingsNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(a.id)}
                      aria-label="Eliminar alerta"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            );
          })}
        </Box>
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
          <TextField
            select
            label="Provincia"
            value={form.provincia}
            onChange={(e) => handleChange("provincia", e.target.value)}
          >
            <MenuItem value="">— Selecciona —</MenuItem>
            {provincias.map((p) => (
              <MenuItem key={p} value={p}>
                {p.replace(/_/g, " ")}
              </MenuItem>
            ))}
          </TextField>
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
