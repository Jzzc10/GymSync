package com.backend.gymsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

@Entity
@Table(name = "ejercicios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ejercicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(length = 50, nullable = false)
    private String nombre;

    @NotNull(message = "El tipo es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Tipo tipo;

    @Column(length = 255, nullable = true)
    private String descripcion;

    @Column(name = "url_imagen")
    private String urlImagen;

    @Column(name = "url_video")
    private String urlVideo;

    // Rutinas donde aparece este ejercicio
    @OneToMany(mappedBy = "ejercicio", cascade = CascadeType.ALL)
    @JsonManagedReference("ejercicio-rutinas")
    private List<RutinaEjercicio> rutinas;

    public enum Tipo {
        PECHO, ABDOMINALES, PIERNAS, ESPALDA, TRICEPS, BICEPS, HOMBRO, GLUTEO
    }
}