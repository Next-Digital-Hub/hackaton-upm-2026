package etsisi.albertoynico.backend.manager;

import etsisi.albertoynico.backend.model.CondicionUsuario;
import etsisi.albertoynico.backend.model.Provincia;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

@Component
public class CondicionUsuarioManager extends AbstractManager<CondicionUsuario> {

    public CondicionUsuarioManager(DynamoDbEnhancedClient client) {
        super(client, "hackathon-condiciones-usuario-v2", CondicionUsuario.class);
    }

    @Override
    public String newId() {
        return super.newId();
    }

    public java.util.Optional<CondicionUsuario> findByUsuarioId(String usuarioId) {
        return table.scan().items().stream()
                .filter(c -> usuarioId.equals(c.getUsuarioId()))
                .findFirst();
    }
}
