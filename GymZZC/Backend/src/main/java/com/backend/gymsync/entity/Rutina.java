package com.backend.gymsync.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "rutina")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rutina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Referencia al cliente
    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference("usuario-rutinas-cliente")
    private Usuario cliente;

    // Referencia al entrenador
    @ManyToOne
    @JoinColumn(name = "entrenador_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference("usuario-rutinas-entrenador")
    private Usuario entrenador;

    @Column(nullable = true, length = 255)
    private String descripcion;

    // Ejercicios de la rutina
    @OneToMany(mappedBy = "rutina", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("rutina-ejercicios")
    private List<RutinaEjercicio> ejercicios;

    // Progresos de la rutina
    @OneToMany(mappedBy = "rutina", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("rutina-progresos")
    private List<Progreso> progresos;

    // Métodos de utilidad
    public List<Progreso> obtenerTodosLosProgresos() {
        return progresos != null ? progresos : new ArrayList<>();
    }

    public List<Progreso> obtenerProgresosPorUsuario(Integer usuarioId) {
        if (progresos == null) {
            return new ArrayList<>();
        }
        
        return progresos.stream()
                .filter(progreso -> progreso.getUsuario().getId().equals(usuarioId))
                .toList();
    }

    public List<Progreso> obtenerProgresosPorEjercicio(Integer ejercicioId) {
        if (progresos == null) {
            return new ArrayList<>();
        }
        
        return progresos.stream()
                .filter(progreso -> progreso.getEjercicio().getId().equals(ejercicioId))
                .toList();
    }

    public List<Progreso> obtenerProgresosPorUsuarioYEjercicio(Integer usuarioId, Integer ejercicioId) {
        if (progresos == null) {
            return new ArrayList<>();
        }
        
        return progresos.stream()
                .filter(progreso -> progreso.getUsuario().getId().equals(usuarioId) && 
                                  progreso.getEjercicio().getId().equals(ejercicioId))
                .toList();
    }

    // Métodos de conveniencia para obtener IDs sin causar serialización
    @Transient
    public Integer getClienteId() {
        return cliente != null ? cliente.getId() : null;
    }

    @Transient
    public String getClienteNombre() {
        return cliente != null ? cliente.getNombre() : null;
    }

    @Transient
    public Integer getEntrenadorId() {
        return entrenador != null ? entrenador.getId() : null;
    }

    @Transient
    public String getEntrenadorNombre() {
        return entrenador != null ? entrenador.getNombre() : null;
    }
}