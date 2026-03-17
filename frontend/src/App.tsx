import { useState } from "react";
import type { Role } from "./types/Role";
import { CiudadanoPage } from "./pages/CiudadanoPage";
import { AdminPage } from "./pages/AdminPage";
import { RegisterPage } from "./pages/RegisterPage";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";

// TODO: reemplazar con autenticación real
const DEFAULT_ROLE: Role = "CIUDADANO";

type View = "app" | "register";

function App() {
  const [role, setRole] = useState<Role>(DEFAULT_ROLE);
  const [view, setView] = useState<View>("app");

  if (view === "register") {
    return <RegisterPage onRegistered={() => setView("app")} />;
  }

  return (
    <>
      {/* Barra superior temporal — quitar cuando haya auth */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} pt={2}>
        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={(_, v) => v && setRole(v as Role)}
          size="small"
        >
          <ToggleButton value="CIUDADANO">Ciudadano</ToggleButton>
          <ToggleButton value="ADMIN">Admin</ToggleButton>
        </ToggleButtonGroup>
        <Button variant="outlined" size="small" onClick={() => setView("register")}>
          Registro
        </Button>
      </Box>

      {role === "ADMIN" ? <AdminPage /> : <CiudadanoPage />}
    </>
  );
}

export default App;
