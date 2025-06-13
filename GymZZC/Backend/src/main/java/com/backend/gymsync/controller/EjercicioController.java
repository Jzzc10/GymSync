package com.backend.gymsync.controller;

import com.backend.gymsync.entity.Ejercicio;
import com.backend.gymsync.service.interfaces.EjercicioServiceInterface;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
//http://localhost:8080/api/ejercicios
@RequestMapping("/api/ejercicios")
@CrossOrigin(origins = "*")
public class EjercicioController {

    @Autowired
    private EjercicioServiceInterface ejercicioService;

    @GetMapping
    public ResponseEntity<List<Ejercicio>> getAllEjercicios() {
        return ResponseEntity.ok(ejercicioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ejercicio> getEjercicioById(@PathVariable Integer id) {
        return ejercicioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ejercicio> crearEjercicio(@Valid @RequestBody Ejercicio ejercicio) {
        Ejercicio savedEjercicio = ejercicioService.save(ejercicio);
        return ResponseEntity.ok(savedEjercicio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ejercicio> actualizarEjercicio(@PathVariable Integer id, @RequestBody Ejercicio ejercicio) {
        if (!ejercicioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        ejercicio.setId(id);
        try {
            Ejercicio ejercicioActualizado = ejercicioService.save(ejercicio);
            return ResponseEntity.ok(ejercicioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEjercicio(@PathVariable Integer id) {
        if (!ejercicioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            ejercicioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}