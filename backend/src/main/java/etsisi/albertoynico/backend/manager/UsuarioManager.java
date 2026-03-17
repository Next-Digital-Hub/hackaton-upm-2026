package etsisi.albertoynico.backend.manager;

import etsisi.albertoynico.backend.model.Usuario;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

@Component
public class UsuarioManager extends AbstractManager<Usuario> {

    public UsuarioManager(DynamoDbEnhancedClient client) {
        super(client, "hackathon-usuarios", Usuario.class);
    }

    @Override
    public String newId() {
        return super.newId();
    }
}
