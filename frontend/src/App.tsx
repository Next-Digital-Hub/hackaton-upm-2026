import { useState } from "react";
import type { Role } from "./types/Role";
import { CiudadanoPage } from "./pages/CiudadanoPage";
import { AdminPage } from "./pages/AdminPage";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

// TODO: reemplazar con autenticación real
const DEFAULT_ROLE: Role = "CIUDADANO";

function App() {
  const [role, setRole] = useState<Role>(DEFAULT_ROLE);

  return (
    <>
      {/* Selector temporal de rol — quitar cuando haya auth */}
      <Box display="flex" justifyContent="center" pt={2}>
        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={(_, v) => v && setRole(v as Role)}
          size="small"
        >
          <ToggleButton value="CIUDADANO">Ciudadano</ToggleButton>
          <ToggleButton value="ADMIN">Admin</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {role === "ADMIN" ? <AdminPage /> : <CiudadanoPage />}
    </>
  );
}

export default App;
