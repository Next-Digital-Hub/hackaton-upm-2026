package com.example.demo.controller;

import com.example.demo.dto.PredictionDTO;
import com.example.demo.model.Ciudadano;
import com.example.demo.model.User;
import com.example.demo.service.ApiPredictionClient;
import com.example.demo.dto.CitizenDTO;
import com.example.demo.service.ApiLlmClient;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/citizen-dashboard")
public class CitizenController {

    private final UserService userService;
    private final ApiPredictionClient apiPredictionClient;
    private final ApiLlmClient apiLlmClient;

    private static final String SECURITY_SUGGESTIONS_PROMPT =
            "Dame una recomendación de seguridad basada en la siguiente predicción y contexto personal";

    // Inyección de dependencias por constructor
    public CitizenController(UserService userService, ApiPredictionClient apiPredictionClient, ApiLlmClient apiLlmClient) {
        this.userService = userService;
        this.apiPredictionClient = apiPredictionClient;
        this.apiLlmClient = apiLlmClient;
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<User> getCitizenByUsername(@PathVariable String username){
        Optional<User> user = this.userService.findByUsername(username);
        return ResponseEntity.of(user);
    }

    /**
     * Endpoint para alimentar el div#infoprediction de dashboard.html
     */
    @GetMapping("/prediction")
    public ResponseEntity<PredictionDTO> getActualPrediction() {
        PredictionDTO currectPrediction = apiPredictionClient.getPrediction();
        if (currectPrediction != null) {
            return ResponseEntity.ok(currectPrediction);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    /**
     * Endpoint para alimentar el div#panelIA de dashboard.html
     */
    @PostMapping("/recommendation")
    public ResponseEntity<Map<String, String>> getLlmPoweredRecommendation(@RequestParam String username,
                                                                           @RequestBody PredictionDTO prediction) {
        Optional<User> citizen = userService.findByUsername(username);
        if(citizen.isEmpty()) return ResponseEntity.notFound().build();
        CitizenDTO currentCitizen = this.convertToDTO(citizen.get());

        String systemPrompt = "Eres un asistente meteorológico experto en protección civil. Sé breve y directo.";

        UserPromptVO userPromptVO = new UserPromptVO(SECURITY_SUGGESTIONS_PROMPT, currentCitizen.toString(), prediction.toString());

        String respuestaLlm = apiLlmClient.generateRecommendation(systemPrompt, userPromptVO.toString());

        return ResponseEntity.ok(Map.of("response", respuestaLlm));
    }

    /**
     * Endpoint para alimentar la lista de alertas activas
     */
    @GetMapping("/alerts")
    public ResponseEntity<List<String>> getActiveAlerts() {
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
    @GetMapping("/history")
    public ResponseEntity<List<String>> getHistory() {
        // TODO: Consultar la base de datos para extraer el registro de este usuario
        List<String> historialMock = List.of(
                "Consulta de prediction - 17/03/2026 10:00",
                "Consulta de recomendación IA - 16/03/2026 18:30"
        );
        return ResponseEntity.ok(historialMock);
    }

    private CitizenDTO convertToDTO(User user){
        if(!(user instanceof Ciudadano ciudadano)){
            throw new IllegalArgumentException("El usuario no es un ciudadano");
        }
        return new CitizenDTO(
                ciudadano.getUsername(),
                ciudadano.getPassword(),
                ciudadano.getProvincia(),
                ciudadano.getTipoVivienda(),
                ciudadano.getTipoNecesidades(),
                ciudadano.getRol()
        );
    }
}