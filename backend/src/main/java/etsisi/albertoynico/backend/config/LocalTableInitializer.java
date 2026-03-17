package etsisi.albertoynico.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.List;

/**
 * Crea las tablas de DynamoDB Local automáticamente al arrancar con perfil
 * "local".
 * Añade aquí las tablas nuevas que vayas creando en la hackathon.
 */
@Configuration
@Profile("local")
public class LocalTableInitializer {

    private record TableDef(String name, String partitionKey) {
    }

    /** Lista de tablas a crear. Añade aquí las nuevas entidades. */
    private static final List<TableDef> TABLES = List.of(
            new TableDef("hackathon-libros", "id"),
            new TableDef("hackathon-usuarios", "id"),
            new TableDef("hackathon-condiciones-usuario", "id"),
            new TableDef("hackathon-alertas", "id"));

    @Bean
    CommandLineRunner initDynamoTables(DynamoDbClient client) {
        return args -> {
            var existing = client.listTables().tableNames();
            for (var table : TABLES) {
                if (existing.contains(table.name())) {
                    System.out.println("Tabla ya existe: " + table.name());
                    continue;
                }
                client.createTable(CreateTableRequest.builder()
                        .tableName(table.name())
                        .keySchema(KeySchemaElement.builder()
                                .attributeName(table.partitionKey())
                                .keyType(KeyType.HASH)
                                .build())
                        .attributeDefinitions(AttributeDefinition.builder()
                                .attributeName(table.partitionKey())
                                .attributeType(ScalarAttributeType.S)
                                .build())
                        .billingMode(BillingMode.PAY_PER_REQUEST)
                        .build());
                System.out.println("Tabla creada: " + table.name());
            }
        };
    }
}
