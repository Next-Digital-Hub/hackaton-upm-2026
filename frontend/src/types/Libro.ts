export type Libro = {
  id: string;
  autor: string;
  descripcion: string;
  anio: number;
};

export type LibroInput = Omit<Libro, "id">;
