export interface UserForm {
  provincia: string;
  tipoVivienda: string;
  necesidadesEspeciales: string[];
}

export interface RegisterDTO {
  nombre: string;
  password: string;
  rol: string;
  userForm?: UserForm; // solo para CIUDADANO
}
