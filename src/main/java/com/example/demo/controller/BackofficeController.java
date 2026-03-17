package com.example.demo.controller;

import com.example.demo.dto.PredictionDTO;
import com.example.demo.service.ApiLlmClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class BackofficeController {

    private static final String ALERT_INFERENCE_PROMPT =
            "En base a esta previsión meteorológica, indica si es menester emitir una alerta a la ciudadanía";

    private final ApiLlmClient apiLlmClient;

    public BackofficeController(ApiLlmClient apiLlmClient) {
        this.apiLlmClient = apiLlmClient;
    }

    @PostMapping("/")
    public ResponseEntity<Map<String, String>> getLlmAlertInference(PredictionDTO prediction) {
        String systemPrompt = "Eres un asistente meteorológico experto en protección civil. Sé breve y directo.";

        String respuestaLlm = apiLlmClient.generateRecommendation(systemPrompt,
                ALERT_INFERENCE_PROMPT + '\n' + prediction.toString());

        return ResponseEntity.ok(Map.of("response", respuestaLlm));
    }
}
