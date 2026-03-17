package com.example.demo.service;

import com.example.demo.dto.PrevisionDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ApiPrevisionClient {

    private final RestClient restClient;

    // Spring inyecta el RestClient.Builder y también busca el valor de hackaton.api.jwt
    public ApiPrevisionClient(
            RestClient.Builder restBuilder,
            @Value("${hackaton.api.jwt}") String token,
            @Value("${hackaton.api.base-url}") String url){

        this.restClient = restBuilder
                .baseUrl(url)
                .defaultHeader("Authorization", "Bearer " + token)
                .build();
    }

    public PrevisionDTO getPrevision() {
        try {
            ResponseEntity<PrevisionDTO> response = this.restClient.get()
                    .uri("/weather") // Asegúrate de apuntar al endpoint correcto ("weather")
                    .retrieve()
                    .toEntity(PrevisionDTO.class);

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
