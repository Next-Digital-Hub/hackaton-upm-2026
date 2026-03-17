package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.manager.LLMCallManager;
import etsisi.albertoynico.backend.model.LLMCall;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/llm-calls")
public class LLMCallController {

    private final LLMCallManager llmCallManager;

    public LLMCallController(LLMCallManager llmCallManager) {
        this.llmCallManager = llmCallManager;
    }

    @GetMapping
    public ResponseEntity<List<LLMCall>> getAll() {
        List<LLMCall> calls = llmCallManager.findAll().stream()
                .sorted(Comparator.comparing(LLMCall::getFecha, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
        return ResponseEntity.ok(calls);
    }
}
