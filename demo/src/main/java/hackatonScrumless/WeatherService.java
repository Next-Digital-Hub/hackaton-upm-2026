package hackatonScrumless;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;


@Service
public class WeatherService {

    private final RestTemplate restTemplate;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getWeather(boolean disaster, String token) {
        try {
            String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/weather?disaster=" + disaster;

            System.out.println(">>> Llamando a: " + url);
            System.out.println(">>> Token: " + token);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            System.out.println(">>> Respuesta: " + response.getStatusCode());
            return response.getBody();

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        }
    }

    public String getRecomendacion(String token, String pregunta) {
        try {
            String url = "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com/prompt";

            System.out.println(">>> Llamando a: " + url);
            System.out.println(">>> Token: " + token);

            // 1. Crear el body JSON
            Map<String, String> body = new HashMap<>();
            body.put("system_prompt", "Eres un asistente experto en meteorología que responde de manera concisa ante preguntas sobre tu disciplina.");
            body.put("user_prompt", pregunta);

            // 2. Cabeceras
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 3. Crear la entidad con body + headers
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

            // 4. Hacer la llamada POST
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            System.out.println(">>> Respuesta: " + response.getStatusCode());
            return response.getBody();

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        }
    }
}
