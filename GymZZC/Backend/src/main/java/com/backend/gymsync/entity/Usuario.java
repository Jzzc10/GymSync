package com.backend.gymsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(length = 50, nullable = false)
    private String nombre;

    @Email(message = "Email debe tener formato válido")
    @NotBlank(message = "El email es obligatorio")
    @Column(length = 100, nullable = false, unique = true) // Unique para evitar duplicados
    private String email;

    @NotNull(message = "El rol es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Rol rol;

    // Rutinas donde este usuario es el CLIENTE
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Rutina> rutinasAsignadas;

    // Rutinas donde este usuario es el ENTRENADOR
    @OneToMany(mappedBy = "entrenador", cascade = CascadeType.ALL)
    private List<Rutina> rutinasCreadas;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Progreso> progresos;

    public enum Rol {
        CLIENTE, ENTRENADOR, ADMIN
    }
}