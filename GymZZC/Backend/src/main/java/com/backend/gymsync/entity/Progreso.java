package com.backend.gymsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "progreso")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Progreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @NotNull
    private Usuario usuario;

    // Relación con RutinaEjercicio usando las columnas correctas
    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "rutina_id", referencedColumnName = "rutina_id", nullable = false),
        @JoinColumn(name = "ejercicio_id", referencedColumnName = "ejercicio_id", nullable = false)
    })
    @NotNull
    private RutinaEjercicio rutinaEjercicio;

    @Column(nullable = false)
    private LocalDate fecha = LocalDate.now();

    @Column(name = "series_completadas", nullable = false)
    @NotNull
    private Integer seriesCompletadas;

    @Column(name = "repeticiones_completadas", nullable = false)
    @NotNull
    private Integer repeticionesCompletadas;

    @Column(name = "peso_utilizado")
    private Integer pesoUtilizado;

    private String notas;

    // Método para obtener la rutina a través de rutinaEjercicio
    public Rutina getRutina() {
        return rutinaEjercicio != null ? rutinaEjercicio.getRutina() : null;
    }
}