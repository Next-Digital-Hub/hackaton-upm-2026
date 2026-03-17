import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export function AdminPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h3" component="h1">
          Panel de Administración
        </Typography>
        <Typography color="text.secondary">
          Bienvenido, administrador.
        </Typography>
      </Box>
    </Container>
  );
}
