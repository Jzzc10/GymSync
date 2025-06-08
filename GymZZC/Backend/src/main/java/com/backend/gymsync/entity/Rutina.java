package com.backend.gymsync.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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

    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false)
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "entrenador_id", referencedColumnName = "id", nullable = false)
    private Usuario entrenador;

    @Column(nullable = true, length = 255)
    private String descripcion;

    @OneToMany(mappedBy = "rutina", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RutinaEjercicio> ejercicios;

    // Relación con los progresos de esta rutina
    @OneToMany(mappedBy = "rutina", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Progreso> progresos;

    /**
     * Obtiene todos los progresos asociados a esta rutina
     * @return Lista de progresos de la rutina
     */
    public List<Progreso> obtenerTodosLosProgresos() {
        return progresos != null ? progresos : new ArrayList<>();
    }

    /**
     * Obtiene los progresos de un usuario específico para esta rutina
     * @param usuarioId ID del usuario
     * @return Lista de progresos del usuario para esta rutina
     */
    public List<Progreso> obtenerProgresosPorUsuario(Integer usuarioId) {
        if (progresos == null) {
            return new ArrayList<>();
        }
        
        return progresos.stream()
                .filter(progreso -> progreso.getUsuario().getId().equals(usuarioId))
                .toList();
    }

    /**
     * Obtiene los progresos de un ejercicio específico dentro de esta rutina
     * @param ejercicioId ID del ejercicio
     * @return Lista de progresos del ejercicio en esta rutina
     */
    public List<Progreso> obtenerProgresosPorEjercicio(Integer ejercicioId) {
        if (progresos == null) {
            return new ArrayList<>();
        }
        
        return progresos.stream()
                .filter(progreso -> progreso.getEjercicio().getId().equals(ejercicioId))
                .toList();
    }

    /**
     * Obtiene los progresos de un usuario específico para un ejercicio específico en esta rutina
     * @param usuarioId ID del usuario
     * @param ejercicioId ID del ejercicio
     * @return Lista de progresos del usuario para el ejercicio en esta rutina
     */
    public List<Progreso> obtenerProgresosPorUsuarioYEjercicio(Integer usuarioId, Integer ejercicioId) {
        if (progresos == null) {
            return new ArrayList<>();
        }
        
        return progresos.stream()
                .filter(progreso -> progreso.getUsuario().getId().equals(usuarioId) && 
                                  progreso.getEjercicio().getId().equals(ejercicioId))
                .toList();
    }
}