package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.exception.ApiException;
import etsisi.albertoynico.backend.manager.CondicionUsuarioManager;
import etsisi.albertoynico.backend.manager.UsuarioManager;
import etsisi.albertoynico.backend.model.CondicionUsuario;
import etsisi.albertoynico.backend.model.Usuario;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UsuarioController {

    private final UsuarioManager usuarioManager;
    private final CondicionUsuarioManager condicionUsuarioManager;

    public UsuarioController(UsuarioManager usuarioManager, CondicionUsuarioManager condicionUsuarioManager) {
        this.usuarioManager = usuarioManager;
        this.condicionUsuarioManager = condicionUsuarioManager;
    }

    @GetMapping
    public List<Usuario> getUsuarios() {
        return usuarioManager.findAll();
    }

    @GetMapping("/{id}")
    public Usuario getUsuario(@PathVariable("id") String id) {
        return usuarioManager.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado: " + id));
    }

    @PostMapping
    public Usuario createUsuario(@RequestBody Usuario usuario) {
        usuario.setId(usuarioManager.newId());
        usuarioManager.save(usuario);
        return usuario;
    }

    @PutMapping("/{id}")
    public Usuario updateUsuario(@PathVariable("id") String id, @RequestBody Usuario usuario) {
        usuario.setId(id);
        usuarioManager.update(usuario);
        return usuario;
    }

    @DeleteMapping("/{id}")
    public void deleteUsuario(@PathVariable("id") String id) {
        usuarioManager.deleteById(id);
    }

    @GetMapping("/necesidades-especiales")
    public List<CondicionUsuario> getNecesidadesEspeciales() {
        return condicionUsuarioManager.findAll();
    }

    @PostMapping("/necesidades-especiales")
    public CondicionUsuario createNecesidadEspecial(@RequestBody CondicionUsuario condicion) {
        condicion.setId(condicionUsuarioManager.newId());
        condicionUsuarioManager.save(condicion);
        return condicion;
    }
}
