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
  getProvincias,
  registerCiudadano,
  registerAdmin,
} from "../config/api";
import logo from "../assets/logo.png";

interface RegisterPageProps {
  onRegistered: (token: string, nombre: string, rol: string) => void;
  onGoToLogin: () => void;
}

export function RegisterPage({ onRegistered, onGoToLogin }: RegisterPageProps) {
  // Enums cargados del backend
  const [roles, setRoles] = useState<string[]>([]);
  const [tiposVivienda, setTiposVivienda] = useState<string[]>([]);
  const [necesidades, setNecesidades] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
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
      getProvincias().catch(() => []),
    ])
      .then(([r, tv, ne, p]) => {
        setRoles(r);
        setTiposVivienda(tv);
        setNecesidades(ne);
        setProvincias(p);
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
        const resp = await registerCiudadano(dto);
        localStorage.setItem("token", resp.token);
        onRegistered(resp.token, resp.usuario.nombre, resp.usuario.rol);
      } else {
        const resp = await registerAdmin(dto);
        localStorage.setItem("token", resp.token);
        onRegistered(resp.token, resp.usuario.nombre, resp.usuario.rol);
      }

      setSuccess(true);
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
        <Box display="flex" justifyContent="center" mb={3}>
          <Box component="img" src={logo} alt="ClimAlert Logo" sx={{ height: 80 }} />
        </Box>
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
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Box component="img" src={logo} alt="ClimAlert Logo" sx={{ height: 50 }} />
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Registro — {rol.replace(/_/g, " ")}
        </Typography>
      </Box>

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
              select
              label="Provincia"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
            >
              <MenuItem value="">— Selecciona —</MenuItem>
              {provincias.map((p) => (
                <MenuItem key={p} value={p}>
                  {p.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </TextField>
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
        <Button size="small" onClick={onGoToLogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Box>
    </Container>
  );
}
