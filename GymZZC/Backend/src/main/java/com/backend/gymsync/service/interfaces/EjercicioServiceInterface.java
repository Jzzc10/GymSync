package com.backend.gymsync.service.interfaces;

import com.backend.gymsync.entity.Ejercicio;
import java.util.List;
import java.util.Optional;

public interface EjercicioServiceInterface {
    List<Ejercicio> findAll();                 // Obtener todos los ejercicios
    Optional<Ejercicio> findById(Integer id);  // Buscar ejercicio por ID
    Ejercicio save(Ejercicio ejercicio);       // Guardar/Crear ejercicio
    void deleteById(Integer id);               // Eliminar ejercicio por ID
    boolean existsById(Integer id);
}
