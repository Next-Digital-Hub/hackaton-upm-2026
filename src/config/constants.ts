export const PROVINCES = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias",
  "Ávila", "Badajoz", "Barcelona", "Burgos", "Cáceres",
  "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba",
  "A Coruña", "Cuenca", "Girona", "Granada", "Guadalajara",
  "Gipuzkoa", "Huelva", "Huesca", "Illes Balears", "Jaén",
  "León", "Lleida", "Lugo", "Madrid", "Málaga",
  "Murcia", "Navarra", "Ourense", "Palencia", "Las Palmas",
  "Pontevedra", "La Rioja", "Salamanca", "Santa Cruz de Tenerife",
  "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel",
  "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora",
  "Zaragoza", "Ceuta", "Melilla",
] as const;

export type Province = (typeof PROVINCES)[number];

export const HOUSING_TYPES = {
  BASEMENT: "Sótano",
  GROUND_FLOOR: "Planta baja",
  HIGH_FLOOR: "Piso alto",
  COUNTRY_HOUSE: "Casa de campo",
} as const;

export const SPECIAL_NEEDS = {
  WHEELCHAIR: "Silla de ruedas",
  DEPENDENT: "Persona dependiente",
  PETS: "Mascotas",
} as const;

export const ALERT_SEVERITIES = {
  LOW: { label: "Baja", color: "bg-blue-100 text-blue-800" },
  MODERATE: { label: "Moderada", color: "bg-yellow-100 text-yellow-800" },
  SEVERE: { label: "Grave", color: "bg-orange-100 text-orange-800" },
  EXTREME: { label: "Extrema", color: "bg-red-100 text-red-800" },
} as const;
