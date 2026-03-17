package etsisi.albertoynico.backend.manager;

import etsisi.albertoynico.backend.model.*;
import etsisi.albertoynico.backend.service.ClimaService;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

import java.util.ArrayList;
import java.util.List;

@Component
public class AlertaManager extends AbstractManager<Alerta> {

    private final ClimaService climaService;

    public AlertaManager(DynamoDbEnhancedClient client, ClimaService climaService) {
        super(client, "hackathon-alertas", Alerta.class);
        this.climaService = climaService;
    }

    @Override
    public String newId() {
        return super.newId();
    }

    public List<Alerta> findByAdminId(String adminId) {
        return table.scan().items().stream()
                .filter(a -> adminId.equals(a.getAdminId()))
                .toList();
    }

    /**
     * Genera alertas a partir de las condiciones climáticas actuales.
     * Evalúa umbrales para temperatura, lluvia, viento, presión y humedad.
     */
    public List<Alerta> generarAlertas() {

        return null;
    }

    private Alerta crearAlerta(CondicionClimatica c, TipoAlerta tipo, NivelAlerta nivel,
            String valorDetectado, String umbral,
            String descripcion, List<String> recomendaciones) {
        Alerta alerta = new Alerta();
        alerta.setId(newId());
        alerta.setFecha(c.getFecha());
        alerta.setTipo(tipo);
        alerta.setNivel(nivel);
        alerta.setProvincia(c.getProvincia());
        alerta.setValorDetectado(valorDetectado);
        alerta.setUmbralSuperado(umbral);
        alerta.setDescripcion(descripcion);
        alerta.setRecomendaciones(recomendaciones);
        return alerta;
    }

    private double parseDouble(String value) {
        if (value == null || value.isBlank())
            return 0;
        try {
            return Double.parseDouble(value.replace(",", "."));
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
