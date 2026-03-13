import type { Libro } from "../types/Libro";

export async function getLibros(): Promise<Libro[]> {
  const res = await fetch("http://localhost:8080/api/libros");
  if (!res.ok) throw new Error("Error al cargar libros");
  return res.json();
}
