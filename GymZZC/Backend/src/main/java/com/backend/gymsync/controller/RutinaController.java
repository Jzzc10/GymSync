package com.backend.gymsync.controller;

import com.backend.gymsync.entity.Rutina;
import com.backend.gymsync.entity.Progreso;
import com.backend.gymsync.service.interfaces.RutinaServiceInterface;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/rutinas")
@CrossOrigin(origins = "*")
public class RutinaController {

    @Autowired
    private RutinaServiceInterface rutinaService;

    @GetMapping
    public ResponseEntity<List<Rutina>> getAllRutinas() {
        return ResponseEntity.ok(rutinaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rutina> getRutinaById(@PathVariable Integer id) {
        return rutinaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Rutina>> getRutinasByCliente(@PathVariable Integer clienteId) {
        return ResponseEntity.ok(rutinaService.findByCliente_Id(clienteId));
    }

    @GetMapping("/entrenador/{entrenadorId}")
    public ResponseEntity<List<Rutina>> getRutinasByEntrenador(@PathVariable Integer entrenadorId) {
        return ResponseEntity.ok(rutinaService.findByEntrenador_Id(entrenadorId));
    }

    // Endpoint para obtener todos los progresos de una rutina
    @GetMapping("/{id}/progresos")
    public ResponseEntity<List<Progreso>> getProgresosByRutina(@PathVariable Integer id) {
        return rutinaService.findById(id)
                .map(rutina -> ResponseEntity.ok(rutina.obtenerTodosLosProgresos()))
                .orElse(ResponseEntity.notFound().build());
    }

    // Nuevo endpoint para obtener progresos de una rutina por usuario
    @GetMapping("/{id}/progresos/usuario/{usuarioId}")
    public ResponseEntity<List<Progreso>> getProgresosByRutinaAndUsuario(
            @PathVariable Integer id, 
            @PathVariable Integer usuarioId) {
        return rutinaService.findById(id)
                .map(rutina -> ResponseEntity.ok(rutina.obtenerProgresosPorUsuario(usuarioId)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Nuevo endpoint para obtener progresos de una rutina por ejercicio
    @GetMapping("/{id}/progresos/ejercicio/{ejercicioId}")
    public ResponseEntity<List<Progreso>> getProgresosByRutinaAndEjercicio(
            @PathVariable Integer id, 
            @PathVariable Integer ejercicioId) {
        return rutinaService.findById(id)
                .map(rutina -> ResponseEntity.ok(rutina.obtenerProgresosPorEjercicio(ejercicioId)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Nuevo endpoint para obtener progresos específicos de usuario y ejercicio en una rutina
    @GetMapping("/{id}/progresos/usuario/{usuarioId}/ejercicio/{ejercicioId}")
    public ResponseEntity<List<Progreso>> getProgresosByRutinaUsuarioAndEjercicio(
            @PathVariable Integer id, 
            @PathVariable Integer usuarioId,
            @PathVariable Integer ejercicioId) {
        return rutinaService.findById(id)
                .map(rutina -> ResponseEntity.ok(rutina.obtenerProgresosPorUsuarioYEjercicio(usuarioId, ejercicioId)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Rutina> crearRutina(@Valid @RequestBody Rutina rutina) {
        Rutina savedRutina = rutinaService.save(rutina);
        return ResponseEntity.ok(savedRutina);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rutina> actualizarRutina(@PathVariable Integer id, @Valid @RequestBody Rutina rutina) {
        if (!rutinaService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Validate all progresos have usuario
        if (rutina.getProgresos() != null) {
            for (Progreso progreso : rutina.getProgresos()) {
                if (progreso.getUsuario() == null) {
                    return ResponseEntity.badRequest()
                        .body(null);
                }
            }
        }
        
        rutina.setId(id);
        return ResponseEntity.ok(rutinaService.save(rutina));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRutina(@PathVariable Integer id) {
        if (!rutinaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            rutinaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}