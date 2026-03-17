package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.dto.RegisterDTO;
import etsisi.albertoynico.backend.dto.UserFormDTO;
import etsisi.albertoynico.backend.manager.CondicionUsuarioManager;
import etsisi.albertoynico.backend.manager.UsuarioManager;
import etsisi.albertoynico.backend.model.CondicionUsuario;
import etsisi.albertoynico.backend.model.Usuario;
import etsisi.albertoynico.backend.service.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioManager usuarioManager;
    private final CondicionUsuarioManager condicionUsuarioManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioManager usuarioManager,
            CondicionUsuarioManager condicionUsuarioManager,
            JwtService jwtService,
            PasswordEncoder passwordEncoder) {
        this.usuarioManager = usuarioManager;
        this.condicionUsuarioManager = condicionUsuarioManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/registerCiudadano")
    public Map<String, Object> registerCiudadano(@RequestBody RegisterDTO dto) {
        // 1. Crear y guardar Usuario con rol CIUDADANO
        Usuario usuario = new Usuario();
        usuario.setId(usuarioManager.newId());
        usuario.setNombre(dto.getNombre());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
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
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRolEnum(etsisi.albertoynico.backend.model.RolUsuario.ADMINISTRADOR);
        usuarioManager.save(usuario);

        // 2. Generar JWT
        String token = jwtService.generarToken(usuario.getId(), usuario.getNombre(), usuario.getRol());

        return Map.of(
                "token", token,
                "usuario", usuario);
    }
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody etsisi.albertoynico.backend.dto.LoginDTO dto) {
        // 1. Buscar usuario por nombre
        Usuario usuario = usuarioManager.findByNombre(dto.getNombre())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        // 2. Comprobar contraseña
        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // 3. Generar JWT
        String token = jwtService.generarToken(usuario.getId(), usuario.getNombre(), usuario.getRol());

        return Map.of(
                "token", token,
                "usuario", usuario
        );
    }
    @GetMapping("/get-user")
    public Map<String, Object> getUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token inválido o ausente");
        }

        String token = authHeader.substring(7);
        String usuarioId = jwtService.getUsuarioId(token);

        Usuario usuario = usuarioManager.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (etsisi.albertoynico.backend.model.RolUsuario.CIUDADANO.name().equals(usuario.getRol())) {
            CondicionUsuario condicion = condicionUsuarioManager.findByUsuarioId(usuarioId)
                    .orElse(null);
            
            if (condicion != null) {
                return Map.of(
                        "usuario", usuario,
                        "condicionUsuario", condicion
                );
            }
        }

        return Map.of("usuario", usuario);
    }
}
