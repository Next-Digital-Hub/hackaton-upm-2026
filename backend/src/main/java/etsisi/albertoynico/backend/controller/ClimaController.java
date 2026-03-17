package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.model.CondicionClimatica;
import etsisi.albertoynico.backend.service.ClimaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clima")
public class ClimaController {

    private final ClimaService climaService;

    public ClimaController(ClimaService climaService) {
        this.climaService = climaService;
    }

    @GetMapping
    public CondicionClimatica getCondiciones() {
        return climaService.obtenerCondiciones();
    }
}
