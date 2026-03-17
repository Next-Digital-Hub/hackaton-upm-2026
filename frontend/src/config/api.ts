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
