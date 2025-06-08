package com.backend.gymsync.controller;

import com.backend.gymsync.entity.Usuario;
import com.backend.gymsync.service.interfaces.UsuarioServiceInterface;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioServiceInterface usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuarios(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) String email) {
        
        if (nombre != null) {
            return ResponseEntity.ok(usuarioService.findByNombre(nombre));
        }
        if (rol != null) {
            try {
                Usuario.Rol rolEnum = Usuario.Rol.valueOf(rol.toUpperCase());
                return ResponseEntity.ok(usuarioService.findByRol(rolEnum));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        if (email != null) {
            return usuarioService.findByEmail(email)
                .map(user -> ResponseEntity.ok(List.of(user)))
                .orElse(ResponseEntity.ok(List.of()));
        }
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Integer id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/entrenadores")
    public ResponseEntity<List<Usuario>> getEntrenadores() {
        return ResponseEntity.ok(usuarioService.findByRol(Usuario.Rol.ENTRENADOR));
    }

    @PostMapping
    public ResponseEntity<?> createUsuario(@Valid @RequestBody Usuario usuario) {
        try {
            // Verificar si el email ya existe
            if (usuarioService.existsByEmail(usuario.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El email ya está registrado"));
            }
            
            // Validar que la contraseña no esté vacía
            if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "La contraseña es obligatoria"));
            }
            
            Usuario savedUsuario = usuarioService.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUsuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Error al crear usuario: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
        Optional<Usuario> usuarioExistente = usuarioService.findById(id);
        
        if (!usuarioExistente.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            Usuario usuarioActual = usuarioExistente.get();
            
            // Verificar si el email ya existe en otro usuario
            if (!usuarioActual.getEmail().equals(usuario.getEmail()) && 
                usuarioService.existsByEmail(usuario.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El email ya está registrado por otro usuario"));
            }
            
            // Si no se envía contraseña, mantener la actual
            if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
                usuario.setPassword(usuarioActual.getPassword());
            }
            
            usuario.setId(id);
            Usuario usuarioActualizado = usuarioService.save(usuario);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Error al actualizar usuario: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            usuarioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al eliminar usuario: " + e.getMessage()));
        }
    }

    // Endpoint para login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email y contraseña son obligatorios"));
        }
        
        try {
            Optional<Usuario> usuarioOpt = usuarioService.findByEmail(email.trim());
            
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                
                // Verificar la contraseña usando el service
                if (usuarioService.checkPassword(password, usuario.getPassword())) {
                    return ResponseEntity.ok(Map.of(
                        "message", "Login exitoso",
                        "usuario", usuario,
                        "rol", usuario.getRol().toString()
                    ));
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Credenciales inválidas"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno del servidor"));
        }
    }

    // Endpoint para cambiar contraseña
    @PutMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(
            @PathVariable Integer id, 
            @RequestBody Map<String, String> passwordData) {
        
        Optional<Usuario> usuarioOpt = usuarioService.findById(id);
        
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        String nuevaPassword = passwordData.get("nuevaPassword");
        
        if (nuevaPassword == null || nuevaPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "La nueva contraseña es obligatoria"));
        }
        
        if (nuevaPassword.length() < 8) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "La contraseña debe tener al menos 8 caracteres"));
        }
        
        try {
            Usuario usuario = usuarioOpt.get();
            usuario.setPassword(nuevaPassword); // Se encriptará automáticamente en el service
            usuarioService.save(usuario);
            
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al cambiar contraseña"));
        }
    }
}