
export default async function ServicioMeteorologia() {
  try {
    const apiUrl = `${window.location.origin}/api/weather`;
    const response = await fetch(apiUrl, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error al obtener datos meteorológicos:", error);
    return null;
  }
};

