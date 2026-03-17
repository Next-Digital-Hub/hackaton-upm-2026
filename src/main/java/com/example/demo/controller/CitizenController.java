package com.example.demo.controller;

import com.example.demo.dto.PrevisionDTO;
import com.example.demo.service.ApiPrevisionClient;
import com.example.demo.service.ApiLlmClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class CitizenController {

    private final ApiPrevisionClient apiPrevisionClient;
    private final ApiLlmClient apiLlmClient;
    // Más adelante inyectaremos aquí servicios de base de datos como AlertService o HistorialService

    // Inyección de dependencias por constructor
    public CitizenController(ApiPrevisionClient apiPrevisionClient, ApiLlmClient apiLlmClient) {
        this.apiPrevisionClient = apiPrevisionClient;
        this.apiLlmClient = apiLlmClient;
    }

    /**
     * Endpoint para alimentar el div#infoprevision de dashboard.html
     */
    @GetMapping("/prevision")
    public ResponseEntity<PrevisionDTO> obtenerprevisionActual() {
        // 1. Llamamos a la API externa mediante nuestro servicio
        PrevisionDTO previsionActual = apiPrevisionClient.getPrevision();

        // 2. Usamos ResponseEntity para manejar casos donde la API externa falle
        if (previsionActual != null) {
            return ResponseEntity.ok(previsionActual); // Devuelve HTTP 200 y el JSON del prevision
        } else {
            return ResponseEntity.noContent().build(); // Devuelve HTTP 204 si no hay datos
        }
    }

    /**
     * Endpoint para alimentar el div#panelIA de dashboard.html
     */
    @GetMapping("/recomendacion")
    public ResponseEntity<Map<String, String>> obtenerRecomendacionIA() {
        // 1. Definimos los prompts. En una versión final, aquí sacarías los datos
        // del usuario (si vive en sótano, necesidades) de la BBDD para personalizar el userPrompt.
        String systemPrompt = "Eres un asistente meteorológico experto en protección civil. Sé breve y directo.";
        String userPrompt =
                "Dame una recomendación personalizada de seguridad para el día de hoy basada en el prevision actual y en mi contexto:\n" +
                "**Previsión actual**:\n" + apiPrevisionClient.getPrevision().toString();

        // 2. Llamamos al LLM
        String respuestaLlm = apiLlmClient.generateRecommendation(systemPrompt, userPrompt);

        // 3. Empaquetamos la respuesta de texto plano en un formato JSON { "mensaje": "..." }
        // para que tu JavaScript (fetch) pueda leerlo fácilmente con response.json()
        Map<String, String> respuestaJson = Map.of("mensaje", respuestaLlm);

        return ResponseEntity.ok(respuestaJson);
    }

    /**
     * Endpoint para alimentar la lista de alertas activas
     */
    @GetMapping("/alertas")
    public ResponseEntity<List<String>> obtenerAlertasActivas() {
        // TODO: Llamar a tu AlertService para obtener las alertas de H2 creadas por el Backoffice
        // Por ahora devolvemos datos mockeados para que el frontend pueda ir trabajando
        List<String> alertasMock = List.of(
                "Alerta Amarilla por viento en tu zona",
                "Recomendación de no circular por la A-3"
        );
        return ResponseEntity.ok(alertasMock);
    }

    /**
     * Endpoint para alimentar el historial de consultas del ciudadano
     */
    @GetMapping("/historial")
    public ResponseEntity<List<String>> obtenerHistorialConsultas() {
        // TODO: Consultar la base de datos para extraer el registro de este usuario
        List<String> historialMock = List.of(
                "Consulta de prevision - 17/03/2026 10:00",
                "Consulta de recomendación IA - 16/03/2026 18:30"
        );
        return ResponseEntity.ok(historialMock);
    }
}