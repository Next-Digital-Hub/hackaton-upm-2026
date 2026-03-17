package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.dto.RegisterDTO;
import etsisi.albertoynico.backend.dto.UserFormDTO;
import etsisi.albertoynico.backend.manager.CondicionUsuarioManager;
import etsisi.albertoynico.backend.manager.UsuarioManager;
import etsisi.albertoynico.backend.model.CondicionUsuario;
import etsisi.albertoynico.backend.model.Usuario;
import etsisi.albertoynico.backend.service.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioManager usuarioManager;
    private final CondicionUsuarioManager condicionUsuarioManager;
    private final JwtService jwtService;

    public AuthController(UsuarioManager usuarioManager,
            CondicionUsuarioManager condicionUsuarioManager,
            JwtService jwtService) {
        this.usuarioManager = usuarioManager;
        this.condicionUsuarioManager = condicionUsuarioManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/registerCiudadano")
    public Map<String, Object> registerCiudadano(@RequestBody RegisterDTO dto) {
        // 1. Crear y guardar Usuario con rol CIUDADANO
        Usuario usuario = new Usuario();
        usuario.setId(usuarioManager.newId());
        usuario.setNombre(dto.getNombre());
        usuario.setContrasena(dto.getContrasena());
        usuario.setRolEnum(etsisi.albertoynico.backend.model.RolUsuario.CIUDADANO);
        usuarioManager.save(usuario);

        // 2. Crear y guardar CondicionUsuario
        UserFormDTO form = dto.getUserForm();
        CondicionUsuario condicion = new CondicionUsuario();
        condicion.setId(condicionUsuarioManager.newId());
        condicion.setUsuarioId(usuario.getId());
        condicion.setProvincia(form.getProvincia());
        condicion.setTipoVivienda(form.getTipoVivienda());
        condicion.setNecesidadesEspeciales(form.getNecesidadesEspeciales());
        condicionUsuarioManager.save(condicion);

        // 3. Generar JWT
        String token = jwtService.generarToken(usuario.getId(), usuario.getNombre(), usuario.getRol());

        return Map.of(
                "token", token,
                "usuario", usuario,
                "condicionUsuario", condicion);
    }

    @PostMapping("/registerAdmin")
    public Map<String, Object> registerAdmin(@RequestBody etsisi.albertoynico.backend.dto.RegisterAdminDTO dto) {
        // 1. Crear y guardar Usuario con rol ADMINISTRADOR
        Usuario usuario = new Usuario();
        usuario.setId(usuarioManager.newId());
        usuario.setNombre(dto.getNombre());
        usuario.setContrasena(dto.getContrasena());
        usuario.setRolEnum(etsisi.albertoynico.backend.model.RolUsuario.ADMINISTRADOR);
        usuarioManager.save(usuario);

        // 2. Generar JWT
        String token = jwtService.generarToken(usuario.getId(), usuario.getNombre(), usuario.getRol());

        return Map.of(
                "token", token,
                "usuario", usuario);
    }
}
