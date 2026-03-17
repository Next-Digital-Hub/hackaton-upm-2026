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
public class CondicionClimatica {
    private String id;
    private String altitud;
    private String dir;
    private String fecha;
    private String horaHrMax;
    private String horaHrMin;
    private String horaPresMax;
    private String horaPresMin;
    private String horaracha;
    private String horatmax;
    private String horatmin;
    private String hrMax;
    private String hrMedia;
    private String hrMin;
    private String indicativo;
    private String nombre;
    private String prec;
    private String presMax;
    private String presMin;
    private Provincia provincia;
    private String racha;
    private String sol;
    private String tmax;
    private String tmed;
    private String tmin;
    private String velmedia;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
