package com.kernelpanic.campusostenible.core.providers.recomendation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kernelpanic.campusostenible.core.domain.*;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class getRecomendationAPI implements RecomendationProvider{

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public getRecomendationAPI() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String getRecommendation(Citizen citizen, WeatherData weatherData) {
        String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/prompt";
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTZXJnaW8iLCJleHAiOjE3NzM4MjQ3NDd9.zloyQhaXgRSd-PPJH6EVbQj0zsxve0q0AWYrOdqo0UE";
        String userPrompt = String.format(
            "Genera precauciones personalizadas para un ciudadano en la provincia de %s, " +
            "que vive en una vivienda de tipo '%s' y tiene las siguientes necesidades especiales: '%s'.\n\n" +
            "Situación meteorológica actual (%s):\n" +
            "- Condición general: %s\n" +
            "- Temperaturas: Máxima de %.1f°C y mínima de %.1f°C\n" +
            "- Humedad: %d%%\n" +
            "- Viento: %.1f km/h con dirección %s\n" +
            "- Probabilidad de lluvia: %d%%\n\n" +
            "Por favor, detalla medidas de seguridad específicas para su hogar y su salud.",
            citizen.getProvince(),
            citizen.getVillageType(),
            citizen.getSpecialNeeds(),
            weatherData.getDate(),
            weatherData.getWeatherCondition().getDisplayName(),
            weatherData.getTemperatureMax(),
            weatherData.getTemperatureMin(),
            weatherData.getHumidity(),
            weatherData.getWindSpeed(),
            weatherData.getWindDirection(),
            weatherData.getRainProbability()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, String> bodyMap = new HashMap<>();
        bodyMap.put("system_prompt", "Eres un asistente experto en meteorología.");
        bodyMap.put("user_prompt", userPrompt);

        try {
            String jsonBody = objectMapper.writeValueAsString(bodyMap);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class);

            if (response.getBody() != null) {
                return response.getBody();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "No se ha podido obtener la recomendación.";
    }

    public String getSimplifiedRecommendation(Citizen citizen, Alert alert) {
        String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/prompt";
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTZXJnaW8iLCJleHAiOjE3NzM4MjQ3NDd9.zloyQhaXgRSd-PPJH6EVbQj0zsxve0q0AWYrOdqo0UE";
        String userPrompt = "Resumiendo en menos de 200 palabras, dame las precauciones que debe tomar el ciudadano de la provincia "
                + citizen.getProvince() + ", con tipo de vivienda: " + citizen.getVillageType()
                + ". Y con necesidades especiales : " + citizen.getSpecialNeeds()
                + "\n Para una alerta de la provincia de " + alert.getProvince() + " y que comenta lo siguiente: "
                + alert.getSafetyRecommendation();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, String> bodyMap = new HashMap<>();
        bodyMap.put("system_prompt", "Eres un asistente experto en meteorología.");
        bodyMap.put("user_prompt", userPrompt);

        try {
            String jsonBody = objectMapper.writeValueAsString(bodyMap);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class);

            if (response.getBody() != null) {
                return response.getBody();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "No se ha podido obtener la recomendación.";
    }

    public Optional<SystemAlert> recomendAlert(WeatherData weatherData) {
        String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/prompt";
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTZXJnaW8iLCJleHAiOjE3NzM4MjQ3NDd9.zloyQhaXgRSd-PPJH6EVbQj0zsxve0q0AWYrOdqo0UE";

        Province province = Province.fromId(weatherData.getProvinceId());
        String provinceName = province != null ? province.getName() : "desconocida";

        String userPrompt = String.format(
                "Teniendo en cuenta los siguientes datos de la provincia %s: " +
                "Temperatura Máxima: %.1f°C, Mínima: %.1f°C, " +
                "Humedad: %d%%, Viento: %.1f km/h, " +
                "Precipitación: %dmm. " +
                "Indica si recomiendas generar una alerta ciudadana. Responde estricta y únicamente con un bloque JSON " +
                "con el formato: {\"recomienda_alerta\": true/false, \"message\": \"string\" }.",
                provinceName,
                weatherData.getTemperatureMax(), weatherData.getTemperatureMin(),
                weatherData.getHumidity(), weatherData.getWindSpeed(),
                weatherData.getRainProbability()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, String> bodyMap = new HashMap<>();
        bodyMap.put("system_prompt",
                "Eres un asistente experto en meteorología y sistemas de emergencias. Tu salida debe ser exclusivamente JSON válido.");
        bodyMap.put("user_prompt", userPrompt);

        try {
            String jsonBody = objectMapper.writeValueAsString(bodyMap);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class);

            if (response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.has("recomienda_alerta") && root.get("recomienda_alerta").asBoolean()) {
                    String message = root.has("message") ? root.get("message").asText() : "Alerta meteorológica detectada";
                    return Optional.of(SystemAlert.builder()
                            .date(weatherData.getDate())
                            .province(province)
                            .alert(message)
                            .build());
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
        return Optional.empty();
    }

    @Override
    public String generateSafetyRecommendation(AlertLevel level, Province province, LocalDate date) {
        String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/prompt";
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTZXJnaW8iLCJleHAiOjE3NzM4MjQ3NDd9.zloyQhaXgRSd-PPJH6EVbQj0zsxve0q0AWYrOdqo0UE";

        String userPrompt = String.format(
                "Genera una recomendación de seguridad breve (máximo 150 palabras) para la provincia de %s " +
                "con un nivel de riesgo '%s' para la fecha %s. " +
                "La recomendación debe ser clara, concisa y útil para el ciudadano.",
                province.getName(),
                level.getDisplayName(),
                date.toString()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, String> bodyMap = new HashMap<>();
        bodyMap.put("system_prompt", "Eres un asistente experto en meteorología y seguridad ciudadana.");
        bodyMap.put("user_prompt", userPrompt);

        try {
            String jsonBody = objectMapper.writeValueAsString(bodyMap);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class);

            if (response.getBody() != null) {
                return response.getBody();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "Manténgase informado a través de los canales oficiales.";
    }
}
