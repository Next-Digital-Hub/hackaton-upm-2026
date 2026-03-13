import type { Libro } from "../types/Libro";
import { API_BASE_URL } from "../config/api";

export async function getLibros(): Promise<Libro[]> {
  const res = await fetch(`${API_BASE_URL}/api/libros`);
  if (!res.ok) throw new Error("Error al cargar libros");
  return res.json();
}
