package com.example.demo.service;

import com.example.demo.dto.LlmRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ApiLlmClient {

    private final RestClient restClient;

    public ApiLlmClient(
            RestClient.Builder restBuilder,
            @Value("${hackaton.api.jwt}") String token,
            @Value("${hackaton.api.base-url}") String url){

        this.restClient = restBuilder
                // Actualizado con la URL del servidor EC2 de la documentación
                .baseUrl(url)
                .defaultHeader("Authorization", "Bearer " + token)
                // Fundamental para el POST al LLM
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public String generateRecommendation(String systemPrompt, String userPrompt) {
        LlmRequestDTO requestBody = new LlmRequestDTO(systemPrompt, userPrompt);

        try {
            ResponseEntity<String> httpResponse = this.restClient.post()
                    .uri("/prompt")
                    .body(requestBody)
                    .retrieve()
                    .toEntity(String.class);

            if (httpResponse.getStatusCode().is2xxSuccessful() && httpResponse.getBody() != null) {
                return httpResponse.getBody();
            }
            else return "Error en la respuesta. Código HTTP: " + httpResponse.getStatusCode();

        } catch (Exception e) {
            return "Error de comunicación: " + e.getMessage();
        }
    }
}
