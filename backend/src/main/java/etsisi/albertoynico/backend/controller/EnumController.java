package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.model.NecesidadEspecial;
import etsisi.albertoynico.backend.model.RolUsuario;
import etsisi.albertoynico.backend.model.TipoVivienda;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/enums")
public class EnumController {

    @GetMapping("/roles")
    public List<String> getRoles() {
        return Arrays.stream(RolUsuario.values()).map(Enum::name).toList();
    }

    @GetMapping("/tipos-vivienda")
    public List<String> getTiposVivienda() {
        return Arrays.stream(TipoVivienda.values()).map(Enum::name).toList();
    }

    @GetMapping("/necesidades-especiales")
    public List<String> getNecesidadesEspeciales() {
        return Arrays.stream(NecesidadEspecial.values()).map(Enum::name).toList();
    }
}
