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
public class Usuario {
    private String id;
    private String nombre;
    private String rol;
    private String contrasena;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    /** Helper para obtener el rol como enum. */
    public RolUsuario getRolEnum() {
        return rol != null ? RolUsuario.valueOf(rol) : null;
    }

    /** Helper para setear el rol desde el enum. */
    public void setRolEnum(RolUsuario rolEnum) {
        this.rol = rolEnum != null ? rolEnum.name() : null;
    }
}
