import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { login } from "../config/api";
import logo from "../assets/logo.png";

interface LoginPageProps {
  onLogin: (token: string, nombre: string, rol: string) => void;
  onGoToRegister: () => void;
}

export function LoginPage({ onLogin, onGoToRegister }: LoginPageProps) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!nombre.trim() || !password.trim()) {
      setError("Nombre y contraseña son obligatorios");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const resp = await login(nombre.trim(), password);
      onLogin(resp.token, resp.usuario.nombre, resp.usuario.rol);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Box display="flex" justifyContent="center" mb={3}>
        <Box component="img" src={logo} alt="ClimAlert Logo" sx={{ height: 100 }} />
      </Box>
      <Typography variant="h4" gutterBottom textAlign="center">
        Iniciar sesión
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
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
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Entrando…" : "Entrar"}
        </Button>
        <Button size="small" onClick={onGoToRegister}>
          ¿No tienes cuenta? Regístrate
        </Button>
      </Box>
    </Container>
  );
}
