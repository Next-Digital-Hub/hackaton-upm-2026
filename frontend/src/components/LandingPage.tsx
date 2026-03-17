import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import type { Libro, LibroInput } from "../types/Libro";
import { getLibros, createLibro, updateLibro, deleteLibro } from "../config/api";
import { LibroCard } from "./LibroCard";

const emptyForm: LibroInput = { autor: "", descripcion: "", anio: new Date().getFullYear() };

export function LandingPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LibroInput>(emptyForm);

  const load = () => {
    setLoading(true);
    getLibros()
      .then(setLibros)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (libro: Libro) => {
    setEditingId(libro.id);
    setForm({ autor: libro.autor, descripcion: libro.descripcion, anio: libro.anio });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateLibro(editingId, form);
      } else {
        await createLibro(form);
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLibro(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Libros</Typography>
        <Button variant="contained" onClick={openCreate}>
          + Nuevo libro
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {libros.length === 0 ? (
        <Typography color="text.secondary">No hay libros todavía. Crea el primero.</Typography>
      ) : (
        libros.map((libro) => (
          <LibroCard key={libro.id} libro={libro} onEdit={openEdit} onDelete={handleDelete} />
        ))
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Editar libro" : "Nuevo libro"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
          <TextField
            label="Autor"
            value={form.autor}
            onChange={(e) => setForm({ ...form, autor: e.target.value })}
            fullWidth
          />
          <TextField
            label="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Año"
            type="number"
            value={form.anio}
            onChange={(e) => setForm({ ...form, anio: Number(e.target.value) })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingId ? "Guardar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
