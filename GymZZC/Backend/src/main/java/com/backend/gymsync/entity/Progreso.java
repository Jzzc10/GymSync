package com.backend.gymsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDate;

@Entity
@Table(name = "progresos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Progreso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false)
    @NotNull
    @JsonBackReference("usuario-progresos")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "rutina_id", referencedColumnName = "id", nullable = false)
    @NotNull
    @JsonBackReference("rutina-progresos")
    private Rutina rutina;

    @ManyToOne
    @JoinColumn(name = "ejercicio_id", referencedColumnName = "id", nullable = false)
    @NotNull
    private Ejercicio ejercicio;

    @Column(nullable = false)
    @NotNull
    private Integer series;

    @Column(nullable = false)
    @NotNull
    private Integer repeticiones;

    @Column(name = "peso_utilizado")
    private Double pesoUtilizado;

    @Column(name = "fecha_registro", nullable = false)
    @NotNull
    private LocalDate fechaRegistro;

    @Column(length = 500)
    private String observaciones;

    // Métodos de conveniencia para obtener los IDs
    @Transient
    public Integer getUsuarioId() {
        return usuario != null ? usuario.getId() : null;
    }

    @Transient
    public String getUsuarioNombre() {
        return usuario != null ? usuario.getNombre() : null;
    }

    @Transient
    public Integer getRutinaId() {
        return rutina != null ? rutina.getId() : null;
    }

    @Transient
    public Integer getEjercicioId() {
        return ejercicio != null ? ejercicio.getId() : null;
    }

    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDate.now();
        }
    }
}