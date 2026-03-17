package etsisi.albertoynico.backend.manager;

import etsisi.albertoynico.backend.model.Usuario;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

@Component
public class UsuarioManager extends AbstractManager<Usuario> {

    public UsuarioManager(DynamoDbEnhancedClient client) {
        super(client, "hackathon-usuarios-v2", Usuario.class);
    }

    @Override
    public String newId() {
        return super.newId();
    }

    /**
     * Busca un usuario por su nombre exacto.
     * En un entorno de producción, esto debería usar un GSI (Global Secondary Index)
     * sobre el campo 'nombre' para ser eficiente, pero para la hackathon
     * un scan() filtrado es suficiente si no hay millones de registros.
     */
    public java.util.Optional<Usuario> findByNombre(String nombre) {
        return table.scan().items().stream()
                .filter(u -> nombre.equals(u.getNombre()))
                .findFirst();
    }
}
