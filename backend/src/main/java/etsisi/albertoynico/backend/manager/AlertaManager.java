package etsisi.albertoynico.backend.manager;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import etsisi.albertoynico.backend.config.UmbralesAlertaConfig;
import etsisi.albertoynico.backend.model.*;
import etsisi.albertoynico.backend.service.BedrockService;
import etsisi.albertoynico.backend.service.ClimaService;
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

    private final ClimaService climaService;
    private final BedrockService bedrockService;
    private final CondicionUsuarioManager condicionUsuarioManager;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String systemPrompt;
    private final String userPromptTemplate;

    public AlertaManager(DynamoDbEnhancedClient client,
                         ClimaService climaService,
                         BedrockService bedrockService,
                         CondicionUsuarioManager condicionUsuarioManager) {
        super(client, "hackathon-alertas", Alerta.class);
        this.climaService = climaService;
        this.bedrockService = bedrockService;
        this.condicionUsuarioManager = condicionUsuarioManager;
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
        CondicionClimatica condicion = climaService.obtenerCondiciones();
        if (condicion == null) {
            log.warn("No se pudieron obtener condiciones climáticas");
            return List.of();
        }

        List<Alerta> alertasBase = evaluarUmbrales(condicion);
        if (alertasBase.isEmpty()) {
            log.info("No se han superado umbrales");
            return List.of();
        }

        List<CondicionUsuario> usuarios = condicionUsuarioManager.findAll();
        if (usuarios.isEmpty()) {
            log.info("No hay usuarios registrados con condiciones");
            return alertasBase;
        }

        List<Alerta> alertasFinales = new CopyOnWriteArrayList<>();
        String alertasJson = serializarAlertasParaPrompt(alertasBase);

        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for (CondicionUsuario usuario : usuarios) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                try {
                    String condicionesUsuarioJson = objectMapper.writeValueAsString(Map.of(
                            "provincia", Optional.ofNullable(usuario.getProvincia()).map(Enum::name).orElse(""),
                            "tipoVivienda", Optional.ofNullable(usuario.getTipoVivienda()).map(Enum::name).orElse(""),
                            "necesidadesEspeciales", Optional.ofNullable(usuario.getNecesidadesEspeciales()).orElse(Set.of())
                    ));

                    String userPrompt = userPromptTemplate
                            .replace("{{ALERTAS_JSON}}", alertasJson)
                            .replace("{{CONDICIONES_USUARIO_JSON}}", condicionesUsuarioJson);

                    String respuestaLlm = bedrockService.sendMessage(systemPrompt, userPrompt);
                    parsearYCrearAlertas(respuestaLlm, alertasBase, alertasFinales, usuario.getUsuarioId());
                } catch (Exception e) {
                    log.error("Error generando alertas para usuario {}", usuario.getUsuarioId(), e);
                }
            });
            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        return alertasFinales;
    }

    private List<Alerta> evaluarUmbrales(CondicionClimatica c) {
        List<Alerta> alertas = new ArrayList<>();
        evaluarTipo(c, TipoAlerta.TEMPERATURA, c.getTmax(), alertas);
        evaluarTipo(c, TipoAlerta.LLUVIA, c.getPrec(), alertas);
        evaluarTipo(c, TipoAlerta.VIENTO, c.getRacha() != null ? c.getRacha() : c.getVelmedia(), alertas);
        evaluarTipo(c, TipoAlerta.PRESION, c.getPresMin(), alertas);
        evaluarTipo(c, TipoAlerta.HUMEDAD, c.getHrMax(), alertas);
        return alertas;
    }

    private void evaluarTipo(CondicionClimatica c, TipoAlerta tipo, String valorStr, List<Alerta> alertas) {
        if (valorStr == null || valorStr.isBlank()) return;
        double valor = parseDouble(valorStr);

        // limiteNoAplica = 0 para que cualquier valor positivo sea evaluado
        NivelAlerta nivel = UmbralesAlertaConfig.evaluarNivel(tipo, valor, 0);
        if (nivel == NivelAlerta.NO_APLICA || nivel == NivelAlerta.VERDE) return;

        // Obtener el umbral superado (el techo del nivel anterior)
        String umbralSuperado = UmbralesAlertaConfig.getUmbralMaximo(tipo, nivelAnterior(nivel))
                .map(String::valueOf)
                .orElse("");

        Alerta alerta = new Alerta();
        alerta.setId(newId());
        alerta.setFecha(c.getFecha() != null ? c.getFecha() : LocalDate.now().toString());
        alerta.setTipo(tipo);
        alerta.setNivel(nivel);
        alerta.setProvincia(c.getProvincia());
        alerta.setValorDetectado(valorStr);
        alerta.setUmbralSuperado(umbralSuperado);
        alerta.setActive(true);
        alertas.add(alerta);
    }

    /** Devuelve el nivel inmediatamente inferior para obtener el umbral que se superó */
    private NivelAlerta nivelAnterior(NivelAlerta nivel) {
        return switch (nivel) {
            case AMARILLO -> NivelAlerta.VERDE;
            case NARANJA -> NivelAlerta.AMARILLO;
            case ROJO -> NivelAlerta.NARANJA;
            default -> NivelAlerta.NO_APLICA;
        };
    }

    private String serializarAlertasParaPrompt(List<Alerta> alertas) {
        try {
            List<Map<String, String>> lista = alertas.stream().map(a -> Map.of(
                    "tipo", a.getTipo().name(),
                    "nivel", a.getNivel().name(),
                    "valorDetectado", Optional.ofNullable(a.getValorDetectado()).orElse(""),
                    "umbralSuperado", Optional.ofNullable(a.getUmbralSuperado()).orElse("")
            )).toList();
            return objectMapper.writeValueAsString(lista);
        } catch (Exception e) {
            return "[]";
        }
    }

    private void parsearYCrearAlertas(String respuestaLlm, List<Alerta> alertasBase, List<Alerta> destino, String usuarioId) {
        String descripcion = "";
        List<String> recomendaciones = List.of();

        try {
            String json = respuestaLlm.trim();
            if (json.contains("```")) {
                int start = json.indexOf("{");
                int end = json.lastIndexOf("}");
                if (start >= 0 && end > start) json = json.substring(start, end + 1);
            }
            JsonNode node = objectMapper.readTree(json);
            if (node.has("descripcion")) descripcion = node.get("descripcion").asText();
            if (node.has("recomendaciones") && node.get("recomendaciones").isArray()) {
                recomendaciones = new ArrayList<>();
                for (JsonNode r : node.get("recomendaciones")) recomendaciones.add(r.asText());
            }
        } catch (Exception e) {
            log.warn("Error parseando respuesta LLM: {}", e.getMessage());
        }

        for (Alerta base : alertasBase) {
            Alerta alerta = new Alerta();
            alerta.setId(newId());
            alerta.setFecha(base.getFecha());
            alerta.setTipo(base.getTipo());
            alerta.setNivel(base.getNivel());
            alerta.setProvincia(base.getProvincia());
            alerta.setValorDetectado(base.getValorDetectado());
            alerta.setUmbralSuperado(base.getUmbralSuperado());
            alerta.setDescripcion(descripcion);
            alerta.setRecomendaciones(recomendaciones);
            alerta.setActive(true);
            alerta.setUsuarioId(usuarioId);
            save(alerta);
            destino.add(alerta);
        }
    }

    private String cargarRecurso(String nombre) {
        try {
            return new ClassPathResource(nombre).getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("No se pudo cargar recurso: {}", nombre, e);
            return "";
        }
    }

    private double parseDouble(String value) {
        if (value == null || value.isBlank()) return 0;
        try { return Double.parseDouble(value.replace(",", ".")); }
        catch (NumberFormatException e) { return 0; }
    }
}
