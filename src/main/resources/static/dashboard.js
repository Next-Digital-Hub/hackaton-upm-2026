document.addEventListener("DOMContentLoaded", () => {
    // IMPORTANTE: Pon aquí un nombre de usuario que hayas registrado previamente
    // en la pantalla de registro para que la BD lo encuentre y la IA funcione.
    const USERNAME_ACTUAL = "user";

    // Iniciamos la cadena de promesas
    cargarPrediccion()
        .then(prediccion => {
            // Solo si la predicción se obtiene con éxito, se la pasamos a la IA
            if (prediccion) {
                cargarRecomendacionIA(USERNAME_ACTUAL, prediccion);
            }
        });
});

/**
 * Llama al endpoint GET /dashboard/prediction
 * Actualiza los widgets del clima y la tabla
 */
function cargarPrediccion() {
    return fetch('/dashboard/prediction')
        .then(response => {
            // Si el controlador devuelve 204 No Content o hay un error
            if (response.status === 204 || !response.ok) {
                throw new Error("Sin datos de predicción meteorológica");
            }
            return response.json();
        })
        .then(data => {
            // 1. Actualizamos los bloques de datos principales
            document.getElementById('temp-val').textContent = `${data.tmax || '--'}°C`;
            // En tu DTO "username" mapea el nombre de la estación
            document.getElementById('weather-desc').textContent = data.username || 'Previsión actual';
            document.getElementById('wind-val').textContent = `${data.velmedia || '--'} km/h`;
            document.getElementById('hum-val').textContent = `${data.hrMedia || '--'}%`;

            // 2. Actualizamos la tabla de registro
            const tablaMeteo = document.getElementById('tabla-meteo-ciudadano');
            tablaMeteo.innerHTML = `
                <tr>
                    <td class="px-4 py-3 text-slate-500">${data.fecha || 'Hoy'}</td>
                    <td class="px-4 py-3 text-slate-500">--:--</td>
                    <td class="px-4 py-3 font-medium text-slate-700">Predicción</td>
                    <td class="px-4 py-3 text-blue-600 font-bold">${data.tmax || '--'}°C</td>
                </tr>
            `;

            // Retornamos los datos para que el siguiente .then() (el de la IA) los reciba
            return data;
        })
        .catch(error => {
            console.error("Error al cargar la predicción:", error);
            document.getElementById('weather-desc').textContent = "Error al obtener datos";
            return null; // Devolvemos null para detener la ejecución de la IA
        });
}

/**
 * Llama al endpoint POST /dashboard/recommendation
 * Actualiza el bloque oscuro de la IA
 */
function cargarRecomendacionIA(username, predictionData) {
    const textoIA = document.getElementById('ia-text');
    textoIA.textContent = "Analizando la predicción meteorológica y tu perfil para generar un consejo...";

    // Como en Java no pusimos @RequestBody, Spring espera parámetros de formulario (x-www-form-urlencoded)
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('fecha', predictionData.fecha || '');
    params.append('tmax', predictionData.tmax || '');
    params.append('prec', predictionData.prec || '');
    params.append('velmedia', predictionData.velmedia || '');

    fetch('/dashboard/recommendation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en el servidor: Código ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Tu controlador devuelve un Map.of("response", respuestaLlm)
        textoIA.textContent = data.response;
    })
    .catch(error => {
        console.error("Error al obtener recomendación de IA:", error);
        textoIA.textContent = "El asistente inteligente no está disponible en este momento. Mantén la precaución habitual.";
    });
}