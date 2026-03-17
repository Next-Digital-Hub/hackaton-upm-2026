package com.example.demo.controller;

import org.antlr.v4.runtime.misc.NotNull;

public record UserPromptVO(
        String generalGuidance,
        String previsionContext,
        String userContext
) {

    @Override
    public String toString(){
        String template = """
                %s
                
                **Previsión**
                %s
                
                **Contexto del usuario**
                %s
                """;

        return template.formatted(generalGuidance, previsionContext, userContext);
    }
}
