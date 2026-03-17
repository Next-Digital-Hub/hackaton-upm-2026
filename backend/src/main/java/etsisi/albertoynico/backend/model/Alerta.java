package etsisi.albertoynico.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamoDbBean
public class Alerta {
    private String id;
    private String fecha;
    private TipoAlerta tipo;
    private NivelAlerta nivel;
    private Provincia provincia;
    private String valorDetectado;
    private String umbralSuperado;
    private String descripcion;
    private List<String> recomendaciones;
    private boolean isActive;
    private String adminId;           // opcional – ID del admin que creó la alerta

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
