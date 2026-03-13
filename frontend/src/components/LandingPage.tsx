import { useEffect, useState } from "react";
import type { Libro } from "../types/Libro";
import { getLibros } from "../services/libroService";
import { LibroCard } from "./LibroCard";

export function LandingPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLibros()
      .then(setLibros)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando libros...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px" }}>
      <h1>Libros</h1>
      {libros.map((libro) => (
        <LibroCard key={libro.id} libro={libro} />
      ))}
    </div>
  );
}
