package com.backend.gymsync.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class RutinaEjercicioId implements Serializable {
    private Integer rutina;
    private Integer ejercicio;

    // Constructor de conveniencia para usar con IDs directos
    public static RutinaEjercicioId of(Integer rutinaId, Integer ejercicioId) {
        return new RutinaEjercicioId(rutinaId, ejercicioId);
    }
}