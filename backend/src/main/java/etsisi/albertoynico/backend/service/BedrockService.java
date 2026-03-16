package etsisi.albertoynico.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.ContentBlock;
import software.amazon.awssdk.services.bedrockruntime.model.ConversationRole;
import software.amazon.awssdk.services.bedrockruntime.model.ConverseRequest;
import software.amazon.awssdk.services.bedrockruntime.model.ConverseResponse;
import software.amazon.awssdk.services.bedrockruntime.model.InferenceConfiguration;
import software.amazon.awssdk.services.bedrockruntime.model.Message;

import java.util.List;

@Service
public class BedrockService {

    private final BedrockRuntimeClient client;
    private final String modelId;

    public BedrockService(
            BedrockRuntimeClient client,
            @Value("${aws.bedrock.model-id:amazon.nova-pro-v1:0}") String modelId) {
        this.client = client;
        this.modelId = modelId;
    }

    /**
     * Sends a message to Bedrock and returns the model's text response.
     * Returns empty string on any failure (best effort).
     */
    public String sendMessage(String prompt) {
        try {
            Message userMessage = Message.builder()
                    .role(ConversationRole.USER)
                    .content(ContentBlock.fromText(prompt))
                    .build();

            ConverseResponse response = client.converse(ConverseRequest.builder()
                    .modelId(modelId)
                    .messages(List.of(userMessage))
                    .inferenceConfig(InferenceConfiguration.builder()
                            .maxTokens(1024)
                            .temperature(0.7f)
                            .build())
                    .build());

            return response.output().message().content().stream()
                    .filter(block -> block.text() != null)
                    .map(ContentBlock::text)
                    .findFirst()
                    .orElse("");
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Sends a message with a system prompt for more control.
     * Returns empty string on any failure (best effort).
     */
    public String sendMessage(String systemPrompt, String userPrompt) {
        try {
            Message userMessage = Message.builder()
                    .role(ConversationRole.USER)
                    .content(ContentBlock.fromText(userPrompt))
                    .build();

            ConverseResponse response = client.converse(ConverseRequest.builder()
                    .modelId(modelId)
                    .messages(List.of(userMessage))
                    .system(software.amazon.awssdk.services.bedrockruntime.model
                            .SystemContentBlock.fromText(systemPrompt))
                    .inferenceConfig(InferenceConfiguration.builder()
                            .maxTokens(1024)
                            .temperature(0.7f)
                            .build())
                    .build());

            return response.output().message().content().stream()
                    .filter(block -> block.text() != null)
                    .map(ContentBlock::text)
                    .findFirst()
                    .orElse("");
        } catch (Exception e) {
            return "";
        }
    }
}
