package com.backend.gymsync.repository;

import com.backend.gymsync.entity.Progreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgresoRepository extends JpaRepository<Progreso, Integer> {
    
    List<Progreso> findByUsuarioId(Integer usuarioId);
    
    // Para acceder a rutina y ejercicio, necesitamos usar consultas personalizadas
    // porque están dentro de rutinaEjercicio  
    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.rutinaEjercicio.rutina.id = :rutinaId")
    List<Progreso> findByUsuarioIdAndRutinaId(@Param("usuarioId") Integer usuarioId, @Param("rutinaId") Integer rutinaId);
    
    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.rutinaEjercicio.ejercicio.id = :ejercicioId")
    List<Progreso> findByUsuarioIdAndEjercicioId(@Param("usuarioId") Integer usuarioId, @Param("ejercicioId") Integer ejercicioId);
    
    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.rutinaEjercicio.rutina.id = :rutinaId AND p.rutinaEjercicio.ejercicio.id = :ejercicioId")
    List<Progreso> findByUsuarioIdAndRutinaIdAndEjercicioId(@Param("usuarioId") Integer usuarioId, @Param("rutinaId") Integer rutinaId, @Param("ejercicioId") Integer ejercicioId);
}