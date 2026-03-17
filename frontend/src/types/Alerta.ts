export interface Alerta {
  id: string;
  isActive: boolean;
  idAdmin: string;
  fecha: string;
  tipo: string;
  nivel: string;
  provincia: string;
  valorDetectado: string;
  umbralSuperado: string;
  descripcion: string;
  recomendaciones: string[];
}
