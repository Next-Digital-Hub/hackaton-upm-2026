package etsisi.albertoynico.backend.service;

import etsisi.albertoynico.backend.manager.LLMCallManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.ContentBlock;
import software.amazon.awssdk.services.bedrockruntime.model.ConversationRole;
import software.amazon.awssdk.services.bedrockruntime.model.ConverseRequest;
import software.amazon.awssdk.services.bedrockruntime.model.ConverseResponse;
import software.amazon.awssdk.services.bedrockruntime.model.InferenceConfiguration;
import software.amazon.awssdk.services.bedrockruntime.model.Message;

import etsisi.albertoynico.backend.model.LLMCall;

import java.util.List;

@Service
public class BedrockService {

    private static final Logger log = LoggerFactory.getLogger(BedrockService.class);

    private final BedrockRuntimeClient client;
    private final String modelId;
    private final LLMCallManager llmCallManager;

    public BedrockService(
            BedrockRuntimeClient client,
            @Value("${aws.bedrock.model-id:amazon.nova-pro-v1:0}") String modelId,
            LLMCallManager llmCallManager) {
        this.client = client;
        this.modelId = modelId;
        this.llmCallManager = llmCallManager;
    }

        /**
         * Sends a message to Bedrock and returns the model's text response.
         * Returns empty string on any failure (best effort).
         */
        public String sendMessage(String prompt) {
                String respuestaText = "";
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

                        respuestaText = response.output().message().content().stream()
                                        .filter(block -> block.text() != null)
                                        .map(ContentBlock::text)
                                        .findFirst()
                                        .orElse("");
                } catch (Exception e) {
                        log.error("Error llamando a Bedrock (single prompt): {}", e.getMessage(), e);
                }

                // Creamos y guardamos el objeto LLMCall
                LLMCall call = LLMCall.crear(prompt, respuestaText);
                llmCallManager.save(call);

                return respuestaText;
        }

        /**
         * Sends a message with a system prompt for more control.
         * Returns empty string on any failure (best effort).
         */
        public String sendMessage(String systemPrompt, String userPrompt) {
                String respuestaText = "";
                try {
                        log.info("Llamando a Bedrock modelo={}, systemPrompt={} chars, userPrompt={} chars", 
                                modelId, systemPrompt.length(), userPrompt.length());

                        Message userMessage = Message.builder()
                                        .role(ConversationRole.USER)
                                        .content(ContentBlock.fromText(userPrompt))
                                        .build();

                        ConverseResponse response = client.converse(ConverseRequest.builder()
                                        .modelId(modelId)
                                        .messages(List.of(userMessage))
                                        .system(software.amazon.awssdk.services.bedrockruntime.model.SystemContentBlock
                                                        .fromText(systemPrompt))
                                        .inferenceConfig(InferenceConfiguration.builder()
                                                        .maxTokens(1024)
                                                        .temperature(0.7f)
                                                        .build())
                                        .build());

                        respuestaText = response.output().message().content().stream()
                                        .filter(block -> block.text() != null)
                                        .map(ContentBlock::text)
                                        .findFirst()
                                        .orElse("");

                        log.info("Respuesta Bedrock recibida: {} chars, stopReason={}", 
                                respuestaText.length(), response.stopReason());
                } catch (Exception e) {
                        log.error("Error llamando a Bedrock (system+user): {}", e.getMessage(), e);
                }

                // Guardamos LLMCall truncando el prompt para no exceder límites de DynamoDB
                try {
                        String fullPrompt = "System: " + systemPrompt + "\nUser: " + userPrompt;
                        if (fullPrompt.length() > 10000) {
                                fullPrompt = fullPrompt.substring(0, 10000) + "... [truncado]";
                        }
                        LLMCall call = LLMCall.crear(fullPrompt, respuestaText);
                        llmCallManager.save(call);
                } catch (Exception e) {
                        log.warn("Error guardando LLMCall en DynamoDB: {}", e.getMessage());
                }

                return respuestaText;
        }
}
