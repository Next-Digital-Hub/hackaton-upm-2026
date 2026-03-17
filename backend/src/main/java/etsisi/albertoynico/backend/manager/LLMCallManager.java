package etsisi.albertoynico.backend.manager;

import etsisi.albertoynico.backend.model.LLMCall;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;

@Component
public class LLMCallManager extends AbstractManager<LLMCall> {

    public LLMCallManager(DynamoDbEnhancedClient client) {
        super(client, "hackathon-llm-calls-v2", LLMCall.class);
    }
}
