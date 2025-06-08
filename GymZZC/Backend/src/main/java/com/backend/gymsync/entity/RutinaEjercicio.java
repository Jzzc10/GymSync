package com.backend.gymsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "rutina_ejercicio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(RutinaEjercicioId.class)
public class RutinaEjercicio {

    @Id
    @ManyToOne
    @JoinColumn(name = "rutina_id", nullable = false)
    @NotNull
    private Rutina rutina;

    @Id
    @ManyToOne  
    @JoinColumn(name = "ejercicio_id", nullable = false)
    @NotNull
    private Ejercicio ejercicio;

    @Column(nullable = false)
    @NotNull
    private Integer series;

    @Column(nullable = false)
    @NotNull
    private Integer repeticiones;

    @Column(name = "peso_ejercicio")
    private Integer pesoEjercicio;
    
    // Métodos de conveniencia para obtener los IDs
    @Transient
    public Integer getRutinaId() {
        return rutina != null ? rutina.getId() : null;
    }

    @Transient
    public Integer getEjercicioId() {
        return ejercicio != null ? ejercicio.getId() : null;
    }
}