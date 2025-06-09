package com.backend.gymsync.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Column(nullable = false, length = 255)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @NotNull(message = "El rol es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Rol rol;

    // Rutinas donde el usuario es cliente
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    @JsonManagedReference("usuario-rutinas-cliente")
    private List<Rutina> rutinasAsignadas;

    // Rutinas donde el usuario es entrenador
    @OneToMany(mappedBy = "entrenador", cascade = CascadeType.ALL)
    @JsonManagedReference("usuario-rutinas-entrenador")
    private List<Rutina> rutinasCreadas;

    // Progresos del usuario
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonManagedReference("usuario-progresos")
    private List<Progreso> progresos;

    public enum Rol {
        CLIENTE, ENTRENADOR, ADMIN
    }
}