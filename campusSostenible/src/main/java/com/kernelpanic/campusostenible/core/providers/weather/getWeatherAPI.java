package com.kernelpanic.campusostenible.core.providers.weather;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.kernelpanic.campusostenible.core.providers.MeteoData;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.kernelpanic.campusostenible.core.domain.WeatherData;

import java.util.ArrayList;
import java.util.List;

@Service
public class getWeatherAPI {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Puedes inyectar el RestTemplate y ObjectMapper via constructor si los tienes
    // como @Bean en tu config
    public getWeatherAPI() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<MeteoData> fetchWeather() {
        String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/weather?disaster=false";

        HttpHeaders headers = new HttpHeaders();
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTZXJnaW8iLCJleHAiOjE3NzM4MjQ3NDd9.zloyQhaXgRSd-PPJH6EVbQj0zsxve0q0AWYrOdqo0UE";
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class);

            if (response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                List<MeteoData> result = new ArrayList<>();

                if (root.isArray()) {
                    for (JsonNode node : root) {
                        MeteoData data = objectMapper.treeToValue(node, MeteoData.class);
                        result.add(data);
                    }
                } else if (root.isObject()) {
                    MeteoData data = objectMapper.treeToValue(root, MeteoData.class);
                    result.add(data);
                }

                return result;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ArrayList<>();
    }
}
