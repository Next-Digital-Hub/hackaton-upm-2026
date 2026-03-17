package com.example.demo.service;

import com.example.demo.dto.PrevisionDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ApiPrevisionClient {
    private final RestClient restClient;

    // Spring inyecta el RestClient.Builder y también busca el valor de hackaton.api.jwt
    public ApiPrevisionClient(
            RestClient.Builder restBuilder,
            @Value("${hackaton.api.jwt}") String token) {

        this.restClient = restBuilder
                .baseUrl("https://api.github.com/Next-Digital-Hub/hackaton-upm-2026")
                .defaultHeader("Authorization", "Bearer " + token)
                .build();
    }

    public PrevisionDTO getPrevision() {
        return this.restClient.get()
                .uri("/alertas-meteorologicas")
                .retrieve()
                .body(PrevisionDTO.class);
    }
}
