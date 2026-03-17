package com.kernelpanic.campusostenible;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kernelpanic.campusostenible.domain.MeteoData;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class getWeatherAPI {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Puedes inyectar el RestTemplate y ObjectMapper via constructor si los tienes como @Bean en tu config
    public getWeatherAPI() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<MeteoData> fetchWeather() {
        String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/weather?disaster=false";

        HttpHeaders headers = new HttpHeaders();
        // Añade el token Bearer en la cabecera "Authorization"
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTZXJnaW8iLCJleHAiOjE3NzM4MjQ3NDd9.zloyQhaXgRSd-PPJH6EVbQj0zsxve0q0AWYrOdqo0UE";
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // Se hace la petición GET 
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            if (response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                List<MeteoData> result = new ArrayList<>();
                
                // Si la respuesta es un array (Ej. múltiple JSON)
                if (root.isArray()) {
                    for (JsonNode node : root) {
                        MeteoData data = objectMapper.treeToValue(node, MeteoData.class);
                        result.add(data);
                    }
                } 
                // Si la respuesta es un objeto único (Ej. un solo MeteoData)
                else if (root.isObject()) {
                    MeteoData data = objectMapper.treeToValue(root, MeteoData.class);
                    result.add(data);
                }
                
                return result;
            }
        } catch (Exception e) {
            e.printStackTrace(); // Manejo básico de errores, en producción deberías usar un logger
        }

        return new ArrayList<>();
    }
}
