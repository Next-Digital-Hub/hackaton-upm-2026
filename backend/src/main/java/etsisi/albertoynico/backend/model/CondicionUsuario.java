package etsisi.albertoynico.backend.model;

import etsisi.albertoynico.backend.model.Provincia;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamoDbBean
public class CondicionUsuario {
    private String id;
    private String usuarioId;
    private Provincia provincia;
    private TipoVivienda tipoVivienda; // valor del enum TipoVivienda
    private Set<NecesidadEspecial> necesidadesEspeciales; // valores del enum NecesidadEspecial

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
