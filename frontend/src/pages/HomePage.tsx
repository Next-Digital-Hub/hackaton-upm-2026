import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export function HomePage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h3" component="h1">
          Hackaton 2026
        </Typography>
        <Typography color="text.secondary">
          Página principal — aquí va el nuevo proyecto.
        </Typography>
      </Box>
    </Container>
  );
}
