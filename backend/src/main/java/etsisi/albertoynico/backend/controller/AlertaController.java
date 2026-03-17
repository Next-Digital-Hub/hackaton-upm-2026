package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.manager.AlertaManager;
import etsisi.albertoynico.backend.model.Alerta;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    private final AlertaManager alertaManager;

    public AlertaController(AlertaManager alertaManager) {
        this.alertaManager = alertaManager;
    }

    @GetMapping
    public List<Alerta> getAlertas() {
        return alertaManager.generarAlertas();
    }

    @PostMapping
    public Alerta createAlerta(@RequestBody Alerta alerta) {
        alerta.setId(alertaManager.newId());
        alertaManager.save(alerta);
        return alerta;
    }
}
