package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.manager.AlertaManager;
import etsisi.albertoynico.backend.model.Alerta;
import etsisi.albertoynico.backend.manager.UsuarioManager;
import etsisi.albertoynico.backend.model.Usuario;
import etsisi.albertoynico.backend.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    private final AlertaManager alertaManager;
    private final JwtService jwtService;
    private final UsuarioManager usuarioManager;

    public AlertaController(AlertaManager alertaManager, JwtService jwtService, UsuarioManager usuarioManager) {
        this.alertaManager = alertaManager;
        this.jwtService = jwtService;
        this.usuarioManager = usuarioManager;
    }

    @GetMapping
    public List<Alerta> getAlertas() {
        return alertaManager.generarAlertas();
    }

    @PostMapping
    public ResponseEntity<?> createAlerta(@RequestBody Alerta alerta, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token requerido");
            }
            Usuario usuario = getUsuarioFromToken(authHeader);
            if (!etsisi.albertoynico.backend.model.RolUsuario.ADMINISTRADOR.name().equals(usuario.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: Solo los administradores pueden crear alertas manuales");
            }
            
            alerta.setId(alertaManager.newId());
            alerta.setAdminId(usuario.getId());
            alerta.setActive(true);
            alertaManager.save(alerta);
            return ResponseEntity.ok(alerta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    private Usuario getUsuarioFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token inválido o ausente");
        }
        String token = authHeader.substring(7);
        String usuarioId = jwtService.getUsuarioId(token);
        return usuarioManager.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping("/mis-alertas")
    public ResponseEntity<?> getMisAlertas(@RequestHeader("Authorization") String authHeader) {
        try {
            Usuario usuario = getUsuarioFromToken(authHeader);
            if (!etsisi.albertoynico.backend.model.RolUsuario.ADMINISTRADOR.name().equals(usuario.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: Se requiere rol ADMINISTRADOR");
            }
            List<Alerta> alertas = alertaManager.findByAdminId(usuario.getId());
            return ResponseEntity.ok(alertas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/apagar-alerta/{id}")
    public ResponseEntity<?> apagarAlerta(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        try {
            Usuario usuario = getUsuarioFromToken(authHeader);
            if (!etsisi.albertoynico.backend.model.RolUsuario.ADMINISTRADOR.name().equals(usuario.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: Se requiere rol ADMINISTRADOR");
            }
            
            Alerta alerta = alertaManager.findById(id).orElse(null);
            if (alerta == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alerta no encontrada");
            }
            
            // Verificamos que la alerta sea del admin que intenta apagarla (opcional, pero buena práctica)
            if (!usuario.getId().equals(alerta.getAdminId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No eres el propietario de esta alerta");
            }

            alerta.setActive(false);
            alertaManager.update(alerta);
            return ResponseEntity.ok(alerta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/encender-alerta/{id}")
    public ResponseEntity<?> encenderAlerta(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        try {
            Usuario usuario = getUsuarioFromToken(authHeader);
            if (!etsisi.albertoynico.backend.model.RolUsuario.ADMINISTRADOR.name().equals(usuario.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: Se requiere rol ADMINISTRADOR");
            }
            
            Alerta alerta = alertaManager.findById(id).orElse(null);
            if (alerta == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alerta no encontrada");
            }

            if (!usuario.getId().equals(alerta.getAdminId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No eres el propietario de esta alerta");
            }

            alerta.setActive(true);
            alertaManager.update(alerta);
            return ResponseEntity.ok(alerta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlerta(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        try {
            Usuario usuario = getUsuarioFromToken(authHeader);
            if (!etsisi.albertoynico.backend.model.RolUsuario.ADMINISTRADOR.name().equals(usuario.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: Se requiere rol ADMINISTRADOR");
            }
            
            Alerta alerta = alertaManager.findById(id).orElse(null);
            if (alerta == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alerta no encontrada");
            }

            if (!usuario.getId().equals(alerta.getAdminId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No eres el propietario de esta alerta");
            }

            alertaManager.deleteById(id);
            return ResponseEntity.ok("Alerta eliminada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
