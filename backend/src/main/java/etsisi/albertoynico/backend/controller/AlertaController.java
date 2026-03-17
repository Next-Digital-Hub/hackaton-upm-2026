package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.manager.AlertaManager;
import etsisi.albertoynico.backend.model.Alerta;
import etsisi.albertoynico.backend.model.Provincia;
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

            // Evaluar Nivel Alerta en base al valorDetectado
            double valor;
            try {
                valor = Double.parseDouble(alerta.getValorDetectado().replace(",", "."));
            } catch (NumberFormatException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El valor detectado no es un número válido");
            }

            // Los umbrales de NO_APLICA deben definirse, por defecto si es < 0 en cosas como viento/lluvia. 
            // Para temperatura podríamos poner -20, pero usaremos 0 por defecto como límite inferior general a menos que queramos otro comportamiento
            double limiteNoAplica = 0; 
            
            etsisi.albertoynico.backend.model.NivelAlerta nivelCalculado = etsisi.albertoynico.backend.config.UmbralesAlertaConfig.evaluarNivel(alerta.getTipo(), valor, limiteNoAplica);
            
            if (nivelCalculado == etsisi.albertoynico.backend.model.NivelAlerta.NO_APLICA) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El valor detectado no alcanza el umbral mínimo para generar una alerta");
            }

            alerta.setNivel(nivelCalculado);

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
    public ResponseEntity<?> getMisAlertas(@RequestHeader(value = "Authorization", required = false) String authHeader) {
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
    public ResponseEntity<?> apagarAlerta(@PathVariable String id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
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
    public ResponseEntity<?> encenderAlerta(@PathVariable String id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
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

    @GetMapping("/provincia/{provincia}")
    public ResponseEntity<List<Alerta>> getAlertasByProvincia(@PathVariable Provincia provincia) {
        List<Alerta> alertas = alertaManager.findByProvincia(provincia);
        return ResponseEntity.ok(alertas);
    }
}
