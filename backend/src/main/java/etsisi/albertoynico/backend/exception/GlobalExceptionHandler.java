package etsisi.albertoynico.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.Map;

/**
 * Captura todas las excepciones y devuelve JSON limpio al frontend.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /** Excepciones lanzadas a propósito con un status HTTP concreto. */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> handleApi(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(Map.of(
                "status", ex.getStatus().value(),
                "error", ex.getStatus().getReasonPhrase(),
                "message", ex.getMessage(),
                "timestamp", Instant.now().toString()
        ));
    }

    /** Cualquier otra excepción no controlada → 500. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return ResponseEntity.internalServerError().body(Map.of(
                "status", 500,
                "error", "Internal Server Error",
                "message", ex.getMessage() != null ? ex.getMessage() : "Error inesperado",
                "timestamp", Instant.now().toString()
        ));
    }
}
