package com.backend.gymsync.controller;

import com.backend.gymsync.entity.Rutina;
import com.backend.gymsync.entity.Ejercicio;
import com.backend.gymsync.entity.RutinaEjercicio;
import com.backend.gymsync.entity.RutinaEjercicioId;
import com.backend.gymsync.service.interfaces.EjercicioServiceInterface;
import com.backend.gymsync.service.interfaces.RutinaServiceInterface;
import com.backend.gymsync.service.interfaces.RutinaEjercicioServiceInterface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rutinas")
@CrossOrigin(origins = "*")
public class RutinaEjercicioController {

    @Autowired
    private RutinaEjercicioServiceInterface rutinaEjercicioService;

    @Autowired
    private EjercicioServiceInterface ejercicioService;

    @Autowired
    private RutinaServiceInterface rutinaService;

    @GetMapping("/{rutinaId}/ejercicios")
    public ResponseEntity<List<RutinaEjercicio>> obtenerEjerciciosDeRutina(@PathVariable Integer rutinaId) {
        List<RutinaEjercicio> ejercicios = rutinaEjercicioService.findByRutinaId(rutinaId);
        return ResponseEntity.ok(ejercicios);
    }

    @GetMapping("/{rutinaId}/ejercicios/{ejercicioId}")
    public ResponseEntity<RutinaEjercicio> obtenerEjercicioEnRutina(
            @PathVariable Integer rutinaId, 
            @PathVariable Integer ejercicioId) {
        
        RutinaEjercicioId id = RutinaEjercicioId.of(rutinaId, ejercicioId);
        Optional<RutinaEjercicio> rutinaEjercicio = rutinaEjercicioService.findById(id);
        
        return rutinaEjercicio.map(ResponseEntity::ok)
                             .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{rutinaId}/ejercicios")
    public ResponseEntity<RutinaEjercicio> agregarEjercicioARutina(
            @PathVariable Integer rutinaId,
            @RequestBody RutinaEjercicio rutinaEjercicio) {
        
        // Validar que la rutina existe
        Optional<Rutina> rutina = rutinaService.findById(rutinaId);
        if (!rutina.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Validar que el ejercicio existe
        Optional<Ejercicio> ejercicio = ejercicioService.findById(rutinaEjercicio.getEjercicio().getId());
        if (!ejercicio.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Asignar las entidades completas
        rutinaEjercicio.setRutina(rutina.get());
        rutinaEjercicio.setEjercicio(ejercicio.get());
        
        try {
            RutinaEjercicio saved = rutinaEjercicioService.save(rutinaEjercicio);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{rutinaId}/ejercicios/{ejercicioId}")
    public ResponseEntity<RutinaEjercicio> actualizarEjercicioEnRutina(
            @PathVariable Integer rutinaId,
            @PathVariable Integer ejercicioId,
            @RequestBody RutinaEjercicio rutinaEjercicio) {

        RutinaEjercicioId id = RutinaEjercicioId.of(rutinaId, ejercicioId);
        
        if (!rutinaEjercicioService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Validar que la rutina existe
        Optional<Rutina> rutina = rutinaService.findById(rutinaId);
        if (!rutina.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Validar que el ejercicio existe
        Optional<Ejercicio> ejercicio = ejercicioService.findById(ejercicioId);
        if (!ejercicio.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Asignar las entidades completas
        rutinaEjercicio.setRutina(rutina.get());
        rutinaEjercicio.setEjercicio(ejercicio.get());
        
        try {
            RutinaEjercicio actualizado = rutinaEjercicioService.save(rutinaEjercicio);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{rutinaId}/ejercicios/{ejercicioId}")
    public ResponseEntity<Void> quitarEjercicioDeRutina(
            @PathVariable Integer rutinaId,
            @PathVariable Integer ejercicioId) {
        
        RutinaEjercicioId id = RutinaEjercicioId.of(rutinaId, ejercicioId);
        
        if (!rutinaEjercicioService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            rutinaEjercicioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}