package etsisi.albertoynico.backend.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import etsisi.albertoynico.backend.manager.AlertaManager;
import etsisi.albertoynico.backend.manager.CondicionClimaticaManager;
import etsisi.albertoynico.backend.model.CondicionClimatica;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class ClimaServiceImpl implements ClimaService {

    private static final Logger log = LoggerFactory.getLogger(ClimaServiceImpl.class);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final CondicionClimaticaManager condicionClimaticaManager;
    private final AlertaManager alertaManager;
    private final String apiUrl;
    private final String apiToken;

    public ClimaServiceImpl(
            @Value("${weather.api.url}") String apiUrl,
            @Value("${api.token}") String apiToken,
            CondicionClimaticaManager condicionClimaticaManager,
            AlertaManager alertaManager) {
        this.apiUrl = apiUrl;
        this.apiToken = apiToken;
        this.condicionClimaticaManager = condicionClimaticaManager;
        this.alertaManager = alertaManager;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public CondicionClimatica obtenerCondiciones() {
        try {
            // 1. Prioridad: Base de Datos
            List<CondicionClimatica> existentes = condicionClimaticaManager.findAll();
            if (!existentes.isEmpty()) {
                log.info("Cargando condiciones climáticas desde la base de datos");
                return existentes.get(0);
            }

            // 2. Fallback: API Externa
            log.info("Base de datos vacía, consultando API meteorológica externa");
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

            CondicionClimatica condicion = objectMapper.readValue(response.body(), CondicionClimatica.class);
            
            // 3. Persistir en DB para futuras consultas
            if (condicion != null) {
                log.info("Guardando nuevas condiciones en la base de datos");
                condicionClimaticaManager.saveWithCleanup(condicion);
                lanzarGeneracionAlertas();
            }
            
            return condicion;
        } catch (Exception e) {
            log.error("Error al conectar con la API meteorológica o la base de datos", e);
            return null;
        }
    }

    @Override
    public CondicionClimatica simularNuevoDia(boolean disaster) {
        try {
            log.info("Simulando nuevo día (disaster={}): consultando API meteorológica externa directamente", disaster);
            URI uri = URI.create(apiUrl + "/weather?disaster=" + disaster);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("Authorization", "Bearer " + apiToken)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Error al simular nuevo día: HTTP {}", response.statusCode());
                return null;
            }

            CondicionClimatica condicion = objectMapper.readValue(response.body(), CondicionClimatica.class);
            
            if (condicion != null) {
                log.info("Actualizando condiciones climáticas en la base de datos para el 'nuevo día'");
                condicionClimaticaManager.saveWithCleanup(condicion);
                lanzarGeneracionAlertas();
            }
            
            return condicion;
        } catch (Exception e) {
            log.error("Error al simular nuevo día", e);
            return null;
        }
    }

    private void lanzarGeneracionAlertas() {
        CompletableFuture.runAsync(() -> {
            try {
                log.info("Lanzando generación automática de alertas tras nuevos datos climáticos");
                alertaManager.generarAlertas();
            } catch (Exception ex) {
                log.error("Error en generación automática de alertas", ex);
            }
        });
    }
}
