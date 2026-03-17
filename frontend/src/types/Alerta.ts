export type TipoAlerta = "TEMPERATURA" | "LLUVIA" | "VIENTO" | "PRESION" | "HUMEDAD";

export type NivelAlerta = "VERDE" | "AMARILLO" | "NARANJA" | "ROJO";

export interface Alerta {
  id: string;
  isActive: boolean;
  idAdmin: string;
  fecha: string;
  tipo: TipoAlerta;
  nivel: NivelAlerta;
  provincia: string;
  valorDetectado: string;
  umbralSuperado: string;
  descripcion: string;
  recomendaciones: string[];
}
