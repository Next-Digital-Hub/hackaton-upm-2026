import type { Libro, LibroInput } from "../types/Libro";
import type { CondicionClimatica } from "../types/CondicionClimatica";
import type { Alerta } from "../types/Alerta";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const LIBROS = `${BASE_URL}/api/libros`;
const CLIMA = `${BASE_URL}/api/clima`;
const ALERTAS = `${BASE_URL}/api/alertas`;

// --- Clima ---

export async function getCondicionesByProvincia(provincia: string): Promise<CondicionClimatica[]> {
  const res = await fetch(`${CLIMA}?provincia=${encodeURIComponent(provincia)}`);
  if (!res.ok) throw new Error("Error al cargar condiciones climáticas");
  return res.json();
}

// --- Alertas ---

export async function getAlertasByProvincia(provincia: string): Promise<Alerta[]> {
  const res = await fetch(`${ALERTAS}?provincia=${encodeURIComponent(provincia)}`);
  if (!res.ok) throw new Error("Error al cargar alertas");
  return res.json();
}

// Obtiene todas las alertas creadas por un admin concreto
// GET /api/alertas/admin/{idAdmin}
export async function getAlertasByAdmin(idAdmin: string): Promise<Alerta[]> {
  const res = await fetch(`${ALERTAS}/admin/${encodeURIComponent(idAdmin)}`);
  if (!res.ok) throw new Error("Error al cargar alertas del admin");
  return res.json();
}

// Crea una nueva alerta manual emitida por un admin
// POST /api/alertas  — body: Partial<Alerta> (campos opcionales) + isActive=true + idAdmin
export async function crearAlerta(alerta: Partial<Alerta>): Promise<Alerta> {
  const res = await fetch(ALERTAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alerta),
  });
  if (!res.ok) throw new Error("Error al crear alerta");
  return res.json();
}

// Desactiva una alerta (isActive=false)
// POST /api/alertas/{id}/apagar
export async function apagarAlerta(id: string): Promise<void> {
  const res = await fetch(`${ALERTAS}/${encodeURIComponent(id)}/apagar`, { method: "POST" });
  if (!res.ok) throw new Error("Error al apagar alerta");
}

// Reactiva una alerta (isActive=true)
// POST /api/alertas/{id}/encender
export async function encenderAlerta(id: string): Promise<void> {
  const res = await fetch(`${ALERTAS}/${encodeURIComponent(id)}/encender`, { method: "POST" });
  if (!res.ok) throw new Error("Error al encender alerta");
}

// Elimina una alerta permanentemente
// DELETE /api/alertas/{id}
export async function eliminarAlerta(id: string): Promise<void> {
  const res = await fetch(`${ALERTAS}/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar alerta");
}

// --- Libros (legacy) ---

export async function getLibros(): Promise<Libro[]> {
  const res = await fetch(LIBROS);
  if (!res.ok) throw new Error("Error al cargar libros");
  return res.json();
}

export async function getLibro(id: string): Promise<Libro> {
  const res = await fetch(`${LIBROS}/${id}`);
  if (!res.ok) throw new Error("Error al cargar libro");
  return res.json();
}

export async function createLibro(libro: LibroInput): Promise<Libro> {
  const res = await fetch(LIBROS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(libro),
  });
  if (!res.ok) throw new Error("Error al crear libro");
  return res.json();
}

export async function updateLibro(id: string, libro: LibroInput): Promise<Libro> {
  const res = await fetch(`${LIBROS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(libro),
  });
  if (!res.ok) throw new Error("Error al actualizar libro");
  return res.json();
}

export async function deleteLibro(id: string): Promise<void> {
  const res = await fetch(`${LIBROS}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar libro");
}
