import { useEffect, useState } from "react";
import type { Role } from "./types/Role";
import { CiudadanoPage } from "./pages/CiudadanoPage";
import { AdminPage } from "./pages/AdminPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { AccountCircle, CalendarToday as CalendarTodayIcon } from "@mui/icons-material";

interface UserSession {
  token: string;
  nombre: string;
  rol: Role;
}

type View = "login" | "register" | "app";

function parseToken(token: string): { nombre: string; rol: string } | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { nombre: payload.nombre, rol: payload.rol };
  } catch {
    return null;
  }
}

function App() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [view, setView] = useState<View>("login");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Al montar, intentar restaurar sesión desde localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const parsed = parseToken(token);
      if (parsed) {
        setUser({ token, nombre: parsed.nombre, rol: parsed.rol as Role });
        setView("app");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, nombre: string, rol: string) => {
    localStorage.setItem("token", token);
    setUser({ token, nombre, rol: rol as Role });
    setView("app");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setView("login");
    setAnchorEl(null);
  };

  const handleSimularNuevoDia = async () => {
    try {
      await import("./config/api").then(api => api.simularNuevoDia());
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert("Error al simular día: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (view === "login") {
    return <LoginPage onLogin={handleLogin} onGoToRegister={() => setView("register")} />;
  }

  if (view === "register") {
    return <RegisterPage onRegistered={handleLogin} onGoToLogin={() => setView("login")} />;
  }

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CalendarTodayIcon />}
            onClick={handleSimularNuevoDia}
            sx={{ mr: 2, borderRadius: 2, textTransform: "none" }}
          >
            Simular nuevo día
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {user?.rol === "ADMINISTRADOR" ? "Panel Admin" : "ClimAlert"}
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Perfil de usuario">
            <AccountCircle />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="subtitle1">{user?.nombre}</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {user?.rol}
              </Typography>
              <Button variant="outlined" size="small" fullWidth onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </Box>
          </Popover>
        </Toolbar>
      </AppBar>

      {user?.rol === "ADMINISTRADOR" ? (
        <AdminPage key={`admin-${refreshKey}`} />
      ) : (
        <CiudadanoPage key={`user-${refreshKey}`} />
      )}
    </>
  );
}

export default App;
