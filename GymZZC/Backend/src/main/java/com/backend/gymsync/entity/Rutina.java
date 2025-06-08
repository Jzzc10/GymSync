package com.backend.gymsync.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    // Método de conveniencia para obtener todos los progresos de esta rutina
    @Transient
    public List<Progreso> obtenerTodosLosProgresos() {
        List<Progreso> todosLosProgresos = new ArrayList<>();
        if (ejercicios != null) {
            for (RutinaEjercicio ejercicio : ejercicios) {
                if (ejercicio.getProgresos() != null) {
                    todosLosProgresos.addAll(ejercicio.getProgresos());
                }
            }
        }
        return todosLosProgresos;
    }
}