package com.backend.gymsync.controller;

import com.backend.gymsync.entity.Progreso;
import com.backend.gymsync.entity.RutinaEjercicioId;
import com.backend.gymsync.service.interfaces.ProgresoServiceInterface;
import com.backend.gymsync.service.interfaces.RutinaEjercicioServiceInterface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/progreso")
@CrossOrigin(origins = "*")
public class ProgresoController {

    @Autowired
    private ProgresoServiceInterface progresoService;

    @Autowired
    private RutinaEjercicioServiceInterface rutinaEjercicioService;

    @GetMapping
    public ResponseEntity<List<Progreso>> obtenerTodoProgreso() {
        List<Progreso> progresos = progresoService.findAll();
        return ResponseEntity.ok(progresos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Progreso> obtenerProgresoPorId(@PathVariable Integer id) {
        Optional<Progreso> progreso = progresoService.findById(id);
        return progreso.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Progreso>> obtenerProgresoDelUsuario(@PathVariable Integer usuarioId) {
        List<Progreso> progresos = progresoService.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(progresos);
    }

    @GetMapping("/usuario/{usuarioId}/rutina/{rutinaId}")
    public ResponseEntity<List<Progreso>> obtenerProgresoEnRutina(
            @PathVariable Integer usuarioId,
            @PathVariable Integer rutinaId) {
        
        List<Progreso> progresos = progresoService.findByUsuarioIdAndRutinaId(usuarioId, rutinaId);
        return ResponseEntity.ok(progresos);
    }

    @GetMapping("/usuario/{usuarioId}/ejercicio/{ejercicioId}")
    public ResponseEntity<List<Progreso>> obtenerProgresoEnEjercicio(
            @PathVariable Integer usuarioId,
            @PathVariable Integer ejercicioId) {
        
        List<Progreso> progresos = progresoService.findByUsuarioIdAndEjercicioId(usuarioId, ejercicioId);
        return ResponseEntity.ok(progresos);
    }

    @GetMapping("/usuario/{usuarioId}/rutina/{rutinaId}/ejercicio/{ejercicioId}")
    public ResponseEntity<List<Progreso>> obtenerProgresoEspecifico(
            @PathVariable Integer usuarioId,
            @PathVariable Integer rutinaId,
            @PathVariable Integer ejercicioId) {
        
        RutinaEjercicioId id = RutinaEjercicioId.of(rutinaId, ejercicioId);
        if (!rutinaEjercicioService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        List<Progreso> progresos = progresoService.findByUsuarioIdAndRutinaIdAndEjercicioId(
                usuarioId, rutinaId, ejercicioId);
        return ResponseEntity.ok(progresos);
    }

    @PostMapping
    public ResponseEntity<Progreso> registrarProgreso(@Valid @RequestBody Progreso progreso) {
        // Validar que exista la relación RutinaEjercicio
        if (progreso.getRutinaEjercicio() == null || 
            progreso.getRutinaEjercicio().getRutina() == null || 
            progreso.getRutinaEjercicio().getEjercicio() == null) {
            return ResponseEntity.badRequest().build();
        }

        RutinaEjercicioId id = RutinaEjercicioId.of(
            progreso.getRutinaEjercicio().getRutina().getId(),
            progreso.getRutinaEjercicio().getEjercicio().getId()
        );

        if (!rutinaEjercicioService.existsById(id)) {
            return ResponseEntity.badRequest().build();
        }

        // Asegurar que la fecha esté establecida
        if (progreso.getFecha() == null) {
            progreso.setFecha(java.time.LocalDate.now());
        }

        try {
            Progreso progresoGuardado = progresoService.save(progreso);
            return ResponseEntity.status(HttpStatus.CREATED).body(progresoGuardado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Progreso> actualizarProgreso(@PathVariable Integer id, @Valid @RequestBody Progreso progreso) {
        if (!progresoService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        progreso.setId(id);
        try {
            Progreso progresoActualizado = progresoService.save(progreso);
            return ResponseEntity.ok(progresoActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProgreso(@PathVariable Integer id) {
        if (!progresoService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            progresoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}