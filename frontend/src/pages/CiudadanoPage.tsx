import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export function CiudadanoPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h3" component="h1">
          Portal Ciudadano
        </Typography>
        <Typography color="text.secondary">
          Bienvenido, ciudadano.
        </Typography>
      </Box>
    </Container>
  );
}
