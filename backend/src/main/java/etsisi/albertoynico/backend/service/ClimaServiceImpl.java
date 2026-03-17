package etsisi.albertoynico.backend.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import etsisi.albertoynico.backend.model.CondicionClimatica;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class ClimaServiceImpl implements ClimaService {

    private static final Logger log = LoggerFactory.getLogger(ClimaServiceImpl.class);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiUrl;
    private final String apiToken;

    public ClimaServiceImpl(
            @Value("${weather.api.url}") String apiUrl,
            @Value("${api.token}") String apiToken) {
        this.apiUrl = apiUrl;
        this.apiToken = apiToken;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public CondicionClimatica obtenerCondiciones() {
        try {
            URI uri = URI.create(apiUrl + "/weather?disaster=false");
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("Authorization", "Bearer " + apiToken)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Error al obtener condiciones climáticas: HTTP {}", response.statusCode());
                return null;
            }

            return objectMapper.readValue(response.body(), CondicionClimatica.class);
        } catch (Exception e) {
            log.error("Error al conectar con la API meteorológica", e);
            return null;
        }
    }
}
