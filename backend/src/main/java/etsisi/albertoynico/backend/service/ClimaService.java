package etsisi.albertoynico.backend.service;

import etsisi.albertoynico.backend.model.CondicionClimatica;

import java.util.List;

public interface ClimaService {

    List<CondicionClimatica> obtenerCondiciones();
}
