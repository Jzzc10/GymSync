package com.backend.gymsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "rutina_ejercicios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(RutinaEjercicioId.class)
public class RutinaEjercicio {

    @Id
    @ManyToOne
    @JoinColumn(name = "rutina_id", nullable = false)
    @NotNull
    @JsonBackReference("rutina-ejercicios")
    private Rutina rutina;

    @Id
    @ManyToOne
    @JoinColumn(name = "ejercicio_id", nullable = false)
    @NotNull
    @JsonBackReference("ejercicio-rutinas")
    private Ejercicio ejercicio;

    @Min(1) // Solo si el valor no es null, debe ser >= 1
    private Integer series;

    @Min(1)
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

    @Transient
    public String getEjercicioNombre() {
        return ejercicio != null ? ejercicio.getNombre() : null;
    }

    @Transient
    public String getEjercicioTipo() {
        return ejercicio != null ? ejercicio.getTipo().toString() : null;
    }
}