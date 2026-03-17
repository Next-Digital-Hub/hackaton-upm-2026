import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import type { RegisterDTO } from "../types/Register";
import {
  getRoles,
  getTiposVivienda,
  getNecesidadesEspeciales,
  registerCiudadano,
  registerAdmin,
} from "../config/api";

interface RegisterPageProps {
  onRegistered: () => void;
}

export function RegisterPage({ onRegistered }: RegisterPageProps) {
  // Enums cargados del backend
  const [roles, setRoles] = useState<string[]>([]);
  const [tiposVivienda, setTiposVivienda] = useState<string[]>([]);
  const [necesidades, setNecesidades] = useState<string[]>([]);
  const [loadingEnums, setLoadingEnums] = useState(true);

  // Form state
  const [rol, setRol] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [provincia, setProvincia] = useState("");
  const [tipoVivienda, setTipoVivienda] = useState("");
  const [necesidadesSeleccionadas, setNecesidadesSeleccionadas] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      getRoles().catch(() => []),
      getTiposVivienda().catch(() => []),
      getNecesidadesEspeciales().catch(() => []),
    ])
      .then(([r, tv, ne]) => {
        setRoles(r);
        setTiposVivienda(tv);
        setNecesidades(ne);
      })
      .finally(() => setLoadingEnums(false));
  }, []);

  const toggleNecesidad = (n: string) => {
    setNecesidadesSeleccionadas((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  };

  const handleSubmit = async () => {
    if (!rol) return;
    if (!nombre.trim() || !password.trim()) {
      setError("Nombre y contraseña son obligatorios");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const dto: RegisterDTO = { nombre: nombre.trim(), password, rol };

      if (rol === "CIUDADANO") {
        dto.userForm = {
          provincia: provincia.trim(),
          tipoVivienda,
          necesidadesEspeciales: necesidadesSeleccionadas,
        };
        await registerCiudadano(dto);
      } else {
        await registerAdmin(dto);
      }

      setSuccess(true);
      setTimeout(onRegistered, 1500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error en el registro");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEnums) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  // Paso 1: elegir rol
  if (!rol) {
    return (
      <Container maxWidth="xs" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Registro
        </Typography>
        <Typography variant="body1" textAlign="center" mb={3} color="text.secondary">
          ¿Con qué rol deseas registrarte?
        </Typography>
        <Box display="flex" justifyContent="center">
          <ToggleButtonGroup
            exclusive
            onChange={(_, v) => v && setRol(v)}
            size="large"
          >
            {roles.map((r) => (
              <ToggleButton key={r} value={r}>
                {r.replace(/_/g, " ")}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Container>
    );
  }

  // Paso 2: formulario
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Registro — {rol.replace(/_/g, " ")}
      </Typography>

      <Button size="small" sx={{ mb: 2 }} onClick={() => setRol(null)}>
        ← Cambiar rol
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registro completado correctamente
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {rol === "CIUDADANO" && (
          <>
            <TextField
              label="Provincia"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
            />
            <TextField
              select
              label="Tipo de vivienda"
              value={tipoVivienda}
              onChange={(e) => setTipoVivienda(e.target.value)}
            >
              <MenuItem value="">— Ninguno —</MenuItem>
              {tiposVivienda.map((t) => (
                <MenuItem key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </TextField>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Necesidades especiales
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {necesidades.map((n) => (
                  <Chip
                    key={n}
                    label={n.replace(/_/g, " ")}
                    onClick={() => toggleNecesidad(n)}
                    color={necesidadesSeleccionadas.includes(n) ? "primary" : "default"}
                    variant={necesidadesSeleccionadas.includes(n) ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </Paper>
          </>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={submitting || success}
        >
          {submitting ? "Registrando…" : "Registrarse"}
        </Button>
      </Box>
    </Container>
  );
}
