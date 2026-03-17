package etsisi.albertoynico.backend.manager;

import etsisi.albertoynico.backend.model.Libro;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

@Component
public class LibroManager extends AbstractManager<Libro> {

    public LibroManager(DynamoDbEnhancedClient client) {
        super(client, "hackathon-libros-v2", Libro.class);
    }

    @Override
    public String newId() {
        return super.newId();
    }
}
