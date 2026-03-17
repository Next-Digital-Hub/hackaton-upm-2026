package etsisi.albertoynico.backend.service;

import etsisi.albertoynico.backend.model.CondicionClimatica;

public interface ClimaService {
    CondicionClimatica obtenerCondiciones();
    CondicionClimatica simularNuevoDia(boolean disaster);
}
