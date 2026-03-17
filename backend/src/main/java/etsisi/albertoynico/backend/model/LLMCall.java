package etsisi.albertoynico.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamoDbBean
public class LLMCall {
    private String id;
    private String prompt;
    private String respuesta;
    private String fecha;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    public static LLMCall crear(String prompt, String respuesta) {
        LLMCall call = new LLMCall();
        call.setId(UUID.randomUUID().toString());
        call.setPrompt(prompt);
        call.setRespuesta(respuesta);
        call.setFecha(Instant.now().toString());
        return call;
    }
}
