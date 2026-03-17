package etsisi.albertoynico.backend.service;

import etsisi.albertoynico.backend.model.CondicionClimatica;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementación de ClimaService.
 * TODO: conectar con fuente de datos real (API AEMET, etc.)
 */
@Service
public class ClimaServiceImpl implements ClimaService {

    @Override
    public List<CondicionClimatica> obtenerCondiciones() {
        // TODO: implementar obtención real de condiciones climáticas
        return List.of();
    }
}
