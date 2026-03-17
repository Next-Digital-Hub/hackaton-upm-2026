package com.example.demo.service;

import com.example.demo.dto.PredictionDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ApiPredictionClient {

    private final RestClient restClient;

    // Spring inyecta el RestClient.Builder y también busca el valor de hackaton.api.jwt
    public ApiPredictionClient(
            RestClient.Builder restBuilder,
            @Value("${hackaton.api.jwt}") String token,
            @Value("${hackaton.api.base-url}") String url){

        this.restClient = restBuilder
                .baseUrl(url)
                .defaultHeader("Authorization", "Bearer " + token)
                .build();
    }

    @Cacheable("prevision")
    public PredictionDTO getPrediction() {
        try {
            ResponseEntity<PredictionDTO> response = this.restClient.get()
                    .uri("/weather") // Asegúrate de apuntar al endpoint correcto ("weather")
                    .retrieve()
                    .toEntity(PredictionDTO.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                System.err.println("La API del clima devolvió el código HTTP: " + response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            System.err.println("Error de red al consultar el clima: " + e.getMessage());
            return null;
        }
    }
}
