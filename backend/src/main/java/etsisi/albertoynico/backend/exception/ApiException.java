package etsisi.albertoynico.backend.exception;

import org.springframework.http.HttpStatus;

/**
 * Excepción genérica para devolver errores HTTP desde cualquier controller.
 * Uso: throw new ApiException(HttpStatus.NOT_FOUND, "Libro no encontrado");
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
