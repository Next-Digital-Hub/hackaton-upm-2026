package etsisi.albertoynico.backend.manager;

import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Manager abstracto y agnóstico para cualquier entidad DynamoDB.
 * Para crear un manager nuevo solo hay que:
 *   1. Anotar tu clase con @DynamoDbBean y @DynamoDbPartitionKey
 *   2. Extender esta clase indicando el tipo y el nombre de tabla
 *
 * Ejemplo:
 *   public class NuevoManager extends AbstractManager<NuevaEntidad> {
 *       public NuevoManager(DynamoDbEnhancedClient client) {
 *           super(client, "NombreTabla", NuevaEntidad.class);
 *       }
 *   }
 */
public abstract class AbstractManager<T> {

    protected final DynamoDbTable<T> table;

    protected AbstractManager(DynamoDbEnhancedClient client, String tableName, Class<T> clazz) {
        this.table = client.table(tableName, TableSchema.fromBean(clazz));
    }

    /** Genera un ID único. Úsalo al crear entidades nuevas. */
    protected String newId() {
        return UUID.randomUUID().toString();
    }

    public void save(T item) {
        table.putItem(item);
    }

    public Optional<T> findById(String id) {
        T item = table.getItem(Key.builder().partitionValue(id).build());
        return Optional.ofNullable(item);
    }

    public void deleteById(String id) {
        table.deleteItem(Key.builder().partitionValue(id).build());
    }

    public List<T> findAll() {
        return table.scan().items().stream().toList();
    }

    public void update(T item) {
        table.updateItem(item);
    }
}
