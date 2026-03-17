package etsisi.albertoynico.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamoDbBean
public class Libro {
    private String id;
    private String autor;
    private String descripcion;
    private int anio;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
