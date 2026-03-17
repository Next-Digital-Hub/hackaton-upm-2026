package etsisi.albertoynico.backend.manager;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import etsisi.albertoynico.backend.config.UmbralesAlertaConfig;
import etsisi.albertoynico.backend.model.*;
import etsisi.albertoynico.backend.service.BedrockService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class AlertaManager extends AbstractManager<Alerta> {

    private static final Logger log = LoggerFactory.getLogger(AlertaManager.class);

    private final BedrockService bedrockService;
    private final CondicionUsuarioManager condicionUsuarioManager;
    private final CondicionClimaticaManager condicionClimaticaManager;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String systemPrompt;
    private final String userPromptTemplate;

    public AlertaManager(DynamoDbEnhancedClient client,
                         BedrockService bedrockService,
                         CondicionUsuarioManager condicionUsuarioManager,
                         CondicionClimaticaManager condicionClimaticaManager) {
        super(client, "hackathon-alertas-v2", Alerta.class);
        this.bedrockService = bedrockService;
        this.condicionUsuarioManager = condicionUsuarioManager;
        this.condicionClimaticaManager = condicionClimaticaManager;
        this.systemPrompt = cargarRecurso("system_prompt.txt");
        this.userPromptTemplate = cargarRecurso("user_prompt.txt");
    }

    @Override
    public String newId() { return super.newId(); }

    public List<Alerta> findByAdminId(String adminId) {
        return table.scan().items().stream()
                .filter(a -> adminId.equals(a.getAdminId()))
                .toList();
    }

    public List<Alerta> findByProvincia(Provincia provincia) {
        return table.scan().items().stream()
                .filter(a -> provincia.equals(a.getProvincia()))
                .toList();
    }

    public List<Alerta> findByUsuarioId(String usuarioId) {
        return table.scan().items().stream()
                .filter(a -> usuarioId.equals(a.getUsuarioId()))
                .toList();
    }

    /**
     * Genera alertas a partir de las condiciones climáticas actuales.
     * 1. Obtiene condiciones del servicio meteorológico
     * 2. Compara cada valor con los umbrales de UmbralesAlertaConfig
     * 3. Para cada umbral superado (nivel > VERDE), genera una alerta base
     * 4. Llama a Bedrock en paralelo por usuario para descripción y recomendaciones
     * 5. Guarda en DynamoDB
     */
    public List<Alerta> generarAlertas() {
        List<CondicionClimatica> condiciones = condicionClimaticaManager.findAll();
        if (condiciones.isEmpty()) {
            log.warn("No hay condiciones climáticas en la base de datos");
            return List.of();
        }
        CondicionClimatica condicion = condiciones.get(0); // Tomamos la más reciente (según lógica actual)

        List<CondicionUsuario> usuarios = condicionUsuarioManager.findAll();
        if (usuarios.isEmpty()) {
            log.info("No hay usuarios registrados con condiciones, guardando alertas base");
            for (Alerta alerta : alertasBase) {
                save(alerta);
            }
            return List.of();
        }

        List<Alerta> alertasFinales = new CopyOnWriteArrayList<>();
        String umbralesJson = serializarObjeto(UmbralesAlertaConfig.getUmbralesMap());
        String condicionClimaticaJson = serializarObjeto(condicion);

        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for (CondicionUsuario usuario : usuarios) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                try {
                    String condicionesUsuarioJson = serializarObjeto(Map.of(
                            "provincia", Optional.ofNullable(usuario.getProvincia()).map(Enum::name).orElse(""),
                            "tipoVivienda", Optional.ofNullable(usuario.getTipoVivienda()).map(Enum::name).orElse(""),
                            "necesidadesEspeciales", Optional.ofNullable(usuario.getNecesidadesEspeciales()).orElse(Set.of())
                    ));

                    String userPrompt = userPromptTemplate
                            .replace("{{CONDICIONES_CLIMATICAS_JSON}}", condicionClimaticaJson)
                            .replace("{{UMBRALES_JSON}}", umbralesJson)
                            .replace("{{CONDICIONES_USUARIO_JSON}}", condicionesUsuarioJson);

                    log.info("Llamando a Bedrock para usuario {}", usuario.getUsuarioId());
                    String respuestaLlm = bedrockService.sendMessage(systemPrompt, userPrompt);
                    parsearYGuardarAlertas(respuestaLlm, usuario.getUsuarioId(), condicion.getProvincia(), condicion.getFecha(), alertasFinales);
                } catch (Exception e) {
                    log.error("Error generando alertas para usuario {}, guardando alertas sin LLM", usuario.getUsuarioId(), e);
                    // Guardar alertas base sin descripción/recomendaciones del LLM
                    for (Alerta base : alertasBase) {
                        Alerta alerta = new Alerta();
                        alerta.setId(newId());
                        alerta.setFecha(base.getFecha());
                        alerta.setTipo(base.getTipo());
                        alerta.setNivel(base.getNivel());
                        alerta.setProvincia(base.getProvincia());
                        alerta.setValorDetectado(base.getValorDetectado());
                        alerta.setUmbralSuperado(base.getUmbralSuperado());
                        alerta.setActive(true);
                        alerta.setUsuarioId(usuario.getUsuarioId());
                        save(alerta);
                        alertasFinales.add(alerta);
                    }
                }
            });
            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        return alertasFinales;
    }

    private String serializarObjeto(Object o) {
        try {
            return objectMapper.writeValueAsString(o);
        } catch (Exception e) {
            return "{}";
        }
    }

    private void parsearYGuardarAlertas(String respuestaLlm, String usuarioId, Provincia provincia, String fecha, List<Alerta> destino) {
        try {
            String json = limpiarRespuestaJson(respuestaLlm);
            JsonNode root = objectMapper.readTree(json);
            if (!root.isArray()) return;

            for (JsonNode node : root) {
                Alerta alerta = new Alerta();
                alerta.setId(newId());
                alerta.setUsuarioId(usuarioId);
                alerta.setProvincia(provincia);
                alerta.setFecha(fecha != null ? fecha : LocalDate.now().toString());
                alerta.setActive(true);

                if (node.has("tipo")) alerta.setTipo(TipoAlerta.valueOf(node.get("tipo").asText()));
                if (node.has("nivel")) alerta.setNivel(NivelAlerta.valueOf(node.get("nivel").asText()));
                if (node.has("valorDetectado")) alerta.setValorDetectado(node.get("valorDetectado").asText());
                if (node.has("umbralSuperado")) alerta.setUmbralSuperado(node.get("umbralSuperado").asText());
                if (node.has("descripcion")) alerta.setDescripcion(node.get("descripcion").asText());

                if (node.has("recomendaciones") && node.get("recomendaciones").isArray()) {
                    List<String> recs = new ArrayList<>();
                    for (JsonNode r : node.get("recomendaciones")) recs.add(r.asText());
                    alerta.setRecomendaciones(recs);
                }

                save(alerta);
                destino.add(alerta);
            }
        } catch (Exception e) {
            log.warn("Error parseando respuesta LLM para usuario {}: {}", usuarioId, e.getMessage());
        }
    }

    private String limpiarRespuestaJson(String raw) {
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            int start = cleaned.indexOf("[");
            int end = cleaned.lastIndexOf("]");
            if (start >= 0 && end > start) {
                cleaned = cleaned.substring(start, end + 1);
            }
        }
        return cleaned;
    }



    private String cargarRecurso(String nombre) {
        try {
            return new ClassPathResource(nombre).getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("No se pudo cargar recurso: {}", nombre, e);
            return "";
        }
    }
}
