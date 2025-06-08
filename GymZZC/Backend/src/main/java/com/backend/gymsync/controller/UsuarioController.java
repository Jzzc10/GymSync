package com.backend.gymsync.controller;

import com.backend.gymsync.entity.Usuario;
import com.backend.gymsync.service.interfaces.UsuarioServiceInterface;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

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
                return ResponseEntity.badRequest().build(); // Manejar rol inválido
            }
        }
        if (email != null) {
            return usuarioService.findByEmail(email)
                .map(user -> ResponseEntity.ok(List.of(user)))
                .orElse(ResponseEntity.ok(List.of())); // Lista vacía si no existe
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
    public ResponseEntity<Usuario> createUsuario(@Valid @RequestBody Usuario usuario) {
        Usuario savedUsuario = usuarioService.save(usuario);
        return ResponseEntity.ok(savedUsuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        usuario.setId(id);
        try {
            Usuario usuarioActualizado = usuarioService.save(usuario);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
     public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            usuarioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}