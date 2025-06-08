package com.backend.gymsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity // Convertirá esta clase en una entidad JPA, una tabla en la base de datos
@Table(name = "ejercicio") // Nombre de la tabla en la base de datos
@Data // Genera getters, setters, toString, equals y hashCode automáticamente
@NoArgsConstructor // Constructor sin argumentos
@AllArgsConstructor // Constructor con todos los argumentos
// La clase Ejercicio representa un ejercicio en el sistema de gestión de rutinas de gimnasio
public class Ejercicio {
    @Id // Marca este campo como la clave primaria de la entidad
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Genera el valor de la clave primaria automáticamente, usando la estrategia de identidad de la base de datos
    private Integer id;

    @NotBlank(message = "El nombre es obligatorio") // Asegura que el nombre del ejercicio no esté en blanco
    @Column(length = 50, nullable = false)
    private String nombre;

    @NotNull(message = "El tipo es obligatorio") // Asegura que el tipo de ejercicio no sea nulo
    @Enumerated(EnumType.STRING) // Almacena el tipo de ejercicio como una cadena en la base de datos
    @Column(length = 20, nullable = false) // Almacena el tipo de ejercicio como una cadena en la base de datos
    private Tipo tipo;

    @Column (length = 255, nullable = true) // Longitud máxima de 255 caracteres, puede ser nulo
    private String descripcion;

    @Column(name = "url_imagen") // Nombre de la columna en la base de datos
    private String urlImagen;

    @Column(name = "url_video")
    private String urlVideo;

    @OneToMany(mappedBy = "ejercicio", cascade = CascadeType.ALL)
    private List<RutinaEjercicio> rutinas;

    public enum Tipo {
        PECHO, ABDOMINALES, PIERNAS, ESPALDA, TRICEPS, BICEPS, HOMBRO, GLUTEO
    }
}