import type { Libro } from "../types/Libro";

interface LibroCardProps {
  libro: Libro;
}

export function LibroCard({ libro }: LibroCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0" }}>{libro.autor}</h3>
      <p style={{ margin: "0 0 8px 0", color: "#555" }}>{libro.descripcion}</p>
      <span style={{ fontSize: "0.9em", color: "#888" }}>Año: {libro.anio}</span>
    </div>
  );
}
