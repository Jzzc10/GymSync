package com.backend.gymsync.repository;

import com.backend.gymsync.entity.Progreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgresoRepository extends JpaRepository<Progreso, Integer> {
    
    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId")
    List<Progreso> findByUsuarioId(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.rutina.id = :rutinaId")
    List<Progreso> findByUsuarioIdAndRutinaId(@Param("usuarioId") Integer usuarioId, @Param("rutinaId") Integer rutinaId);
    
    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.ejercicio.id = :ejercicioId")
    List<Progreso> findByUsuarioIdAndEjercicioId(@Param("usuarioId") Integer usuarioId, @Param("ejercicioId") Integer ejercicioId);
    
    @Query("SELECT p FROM Progreso p WHERE p.usuario.id = :usuarioId AND p.rutina.id = :rutinaId AND p.ejercicio.id = :ejercicioId")
    List<Progreso> findByUsuarioIdAndRutinaIdAndEjercicioId(@Param("usuarioId") Integer usuarioId, @Param("rutinaId") Integer rutinaId, @Param("ejercicioId") Integer ejercicioId);
    
    @Query("SELECT p FROM Progreso p WHERE p.rutina.id = :rutinaId")
    List<Progreso> findByRutinaId(@Param("rutinaId") Integer rutinaId);
    
    @Query("SELECT p FROM Progreso p WHERE p.ejercicio.id = :ejercicioId")
    List<Progreso> findByEjercicioId(@Param("ejercicioId") Integer ejercicioId);
    
    @Query("SELECT p FROM Progreso p WHERE p.rutina.id = :rutinaId AND p.ejercicio.id = :ejercicioId")
    List<Progreso> findByRutinaIdAndEjercicioId(@Param("rutinaId") Integer rutinaId, @Param("ejercicioId") Integer ejercicioId);
}