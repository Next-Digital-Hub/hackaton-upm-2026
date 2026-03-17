package etsisi.albertoynico.backend.manager;

import etsisi.albertoynico.backend.model.CondicionClimatica;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

@Component
public class CondicionClimaticaManager extends AbstractManager<CondicionClimatica> {

    public CondicionClimaticaManager(DynamoDbEnhancedClient client) {
        super(client, "hackathon-condiciones-climatica", CondicionClimatica.class);
    }

    /**
     * Guarda una nueva condición climática después de borrar todas las existentes.
     */
    public void saveWithCleanup(CondicionClimatica item) {
        // Borrar todas las existentes
        findAll().forEach(c -> deleteById(c.getId()));
        
        // Guardar la nueva
        if (item.getId() == null) {
            item.setId(newId());
        }
        save(item);
    }
}
