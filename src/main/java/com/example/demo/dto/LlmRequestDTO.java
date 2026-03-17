package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LlmRequestDTO(
        @JsonProperty("system_prompt") String systemPrompt,
        @JsonProperty("user_prompt") String userPrompt
) {}
