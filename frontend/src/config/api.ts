import type { Libro, LibroInput } from "../types/Libro";
import type { CondicionClimatica } from "../types/CondicionClimatica";
import type { Alerta } from "../types/Alerta";
import type { RegisterDTO } from "../types/Register";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const LIBROS = `${BASE_URL}/api/libros`;
const CLIMA = `${BASE_URL}/api/clima`;
const ALERTAS = `${BASE_URL}/api/alertas`;
const AUTH = `${BASE_URL}/api/auth`;
const ENUMS = `${BASE_URL}/api/enums`;

// --- Enums (cargados dinámicamente desde el backend) ---

// Devuelve los valores del enum RolUsuario: ["CIUDADANO", "ADMINISTRADOR"]
// GET /api/enums/roles
export async function getRoles(): Promise<string[]> {
  const res = await fetch(`${ENUMS}/roles`);
  if (!res.ok) throw new Error("Error al cargar roles");
  return res.json();
}

// Devuelve los valores del enum TipoVivienda: ["SOTANO", "PLANTA_BAJA", ...]
// GET /api/enums/tipos-vivienda
export async function getTiposVivienda(): Promise<string[]> {
  const res = await fetch(`${ENUMS}/tipos-vivienda`);
  if (!res.ok) throw new Error("Error al cargar tipos de vivienda");
  return res.json();
}

// Devuelve los valores del enum NecesidadEspecial: ["MOVILIDAD_REDUCIDA", ...]
// GET /api/enums/necesidades-especiales
export async function getNecesidadesEspeciales(): Promise<string[]> {
  const res = await fetch(`${ENUMS}/necesidades-especiales`);
  if (!res.ok) throw new Error("Error al cargar necesidades especiales");
  return res.json();
}

// Devuelve los valores del enum TipoAlerta: ["TEMPERATURA", "LLUVIA", ...]
// GET /api/enums/tipos-alerta
export async function getTiposAlerta(): Promise<string[]> {
  const res = await fetch(`${ENUMS}/tipos-alerta`);
  if (!res.ok) throw new Error("Error al cargar tipos de alerta");
  return res.json();
}

// Devuelve los valores del enum NivelAlerta: ["VERDE", "AMARILLO", "NARANJA", "ROJO"]
// GET /api/enums/niveles-alerta
export async function getNivelesAlerta(): Promise<string[]> {
  const res = await fetch(`${ENUMS}/niveles-alerta`);
  if (!res.ok) throw new Error("Error al cargar niveles de alerta");
  return res.json();
}

// --- Registro de usuarios ---

// Registra un ciudadano con sus datos personales y formulario de condiciones
// POST /api/auth/registerCiudadano — body: RegisterDTO (con userForm)
// Devuelve { token, usuario, condicionUsuario }
export async function registerCiudadano(dto: RegisterDTO): Promise<{ token: string; usuario: { id: string; nombre: string; rol: string } }> {
  const res = await fetch(`${AUTH}/registerCiudadano`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Error al registrar ciudadano");
  return res.json();
}

// Registra un administrador (solo nombre y contraseña)
// POST /api/auth/registerAdmin — body: { nombre, password }
// Devuelve { token, usuario }
export async function registerAdmin(dto: RegisterDTO): Promise<{ token: string; usuario: { id: string; nombre: string; rol: string } }> {
  const res = await fetch(`${AUTH}/registerAdmin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Error al registrar administrador");
  return res.json();
}

// --- Login ---

// Inicia sesión con nombre y contraseña
// POST /api/auth/login — body: { nombre, password }
// Devuelve { token, usuario: { id, nombre, rol } }
export async function login(nombre: string, password: string): Promise<{ token: string; usuario: { id: string; nombre: string; rol: string } }> {
  const res = await fetch(`${AUTH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, password }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas");
  return res.json();
}

// --- Clima ---

export async function getCondiciones(): Promise<CondicionClimatica | null> {
  const res = await fetch(CLIMA);
  if (!res.ok) throw new Error("Error al cargar condiciones climáticas");
  return res.json();
}

// --- Alertas ---

// Helper para obtener el header de autorización
function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAlertasByProvincia(provincia: string): Promise<Alerta[]> {
  const res = await fetch(`${ALERTAS}/provincia/${encodeURIComponent(provincia)}`);
  if (!res.ok) throw new Error("Error al cargar alertas");
  return res.json();
}

// Obtiene las alertas personalizadas del ciudadano autenticado
// GET /api/alertas/mis-alertas-ciudadano (requiere Authorization header)
export async function getMisAlertasCiudadano(): Promise<Alerta[]> {
  const res = await fetch(`${ALERTAS}/mis-alertas-ciudadano`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error al cargar tus alertas");
  return res.json();
}

// Obtiene las alertas creadas por el admin autenticado
// GET /api/alertas/mis-alertas (requiere Authorization header)
export async function getAlertasByAdmin(): Promise<Alerta[]> {
  const res = await fetch(`${ALERTAS}/mis-alertas`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error al cargar alertas del admin");
  return res.json();
}

// Crea una nueva alerta manual emitida por un admin
// POST /api/alertas (requiere Authorization header)
export async function crearAlerta(alerta: Partial<Alerta>): Promise<Alerta> {
  const res = await fetch(ALERTAS, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(alerta),
  });
  if (!res.ok) throw new Error("Error al crear alerta");
  return res.json();
}

// Desactiva una alerta (isActive=false)
// POST /api/alertas/apagar-alerta/{id} (requiere Authorization header)
export async function apagarAlerta(id: string): Promise<void> {
  const res = await fetch(`${ALERTAS}/apagar-alerta/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error al apagar alerta");
}

// Reactiva una alerta (isActive=true)
// POST /api/alertas/encender-alerta/{id} (requiere Authorization header)
export async function encenderAlerta(id: string): Promise<void> {
  const res = await fetch(`${ALERTAS}/encender-alerta/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error al encender alerta");
}

// Elimina una alerta permanentemente
// DELETE /api/alertas/{id} — TODO: implementar endpoint en backend
export async function eliminarAlerta(id: string): Promise<void> {
  const res = await fetch(`${ALERTAS}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error al eliminar alerta");
}

// Lanza la generación automática de alertas basada en condiciones climáticas
// POST /api/alertas/generar (requiere Authorization header de admin)
export async function generarAlertas(): Promise<Alerta[]> {
  const res = await fetch(`${ALERTAS}/generar`, {
    method: "POST",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error al generar alertas");
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
