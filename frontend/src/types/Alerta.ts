export interface Alerta {
  id: string;
  active: boolean;
  adminId: string;
  fecha: string;
  tipo: string;
  nivel: string;
  provincia: string;
  valorDetectado: string;
  umbralSuperado: string;
  descripcion: string;
  recomendaciones: string[];
}
