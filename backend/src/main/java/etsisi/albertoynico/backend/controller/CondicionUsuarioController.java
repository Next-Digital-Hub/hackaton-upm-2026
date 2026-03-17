package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.exception.ApiException;
import etsisi.albertoynico.backend.manager.CondicionUsuarioManager;
import etsisi.albertoynico.backend.model.CondicionUsuario;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/condiciones-usuario")
public class CondicionUsuarioController {

    private final CondicionUsuarioManager condicionUsuarioManager;

    public CondicionUsuarioController(CondicionUsuarioManager condicionUsuarioManager) {
        this.condicionUsuarioManager = condicionUsuarioManager;
    }

    @GetMapping
    public List<CondicionUsuario> getCondiciones() {
        return condicionUsuarioManager.findAll();
    }

    @GetMapping("/{id}")
    public CondicionUsuario getCondicion(@PathVariable("id") String id) {
        return condicionUsuarioManager.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Condición no encontrada: " + id));
    }

    @PostMapping
    public CondicionUsuario createCondicion(@RequestBody CondicionUsuario condicion) {
        condicion.setId(condicionUsuarioManager.newId());
        condicionUsuarioManager.save(condicion);
        return condicion;
    }

    @PutMapping("/{id}")
    public CondicionUsuario updateCondicion(@PathVariable("id") String id, @RequestBody CondicionUsuario condicion) {
        condicion.setId(id);
        condicionUsuarioManager.update(condicion);
        return condicion;
    }

    @DeleteMapping("/{id}")
    public void deleteCondicion(@PathVariable("id") String id) {
        condicionUsuarioManager.deleteById(id);
    }
}
